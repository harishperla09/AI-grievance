const express = require('express');
const Complaint = require('../models/Complaint');
const Vote = require('../models/Vote');
const User = require('../models/User');
const Reward = require('../models/Reward');
const Notification = require('../models/Notification');
const { authMiddleware } = require('../middleware/auth');
const { processComplaint, generateInsights } = require('../ai/nlpEngine');

const router = express.Router();

// POST /api/complaints/submit
router.post('/submit', authMiddleware, async (req, res) => {
  try {
    const { complaint_text, location, language, uploaded_image_url } = req.body;

    if (!complaint_text || !location) {
      return res.status(400).json({ error: 'Complaint text and location are required.' });
    }

    // Run AI processing pipeline
    const aiResult = await processComplaint(complaint_text, Complaint);

    // Handle duplicate
    if (aiResult.is_duplicate && aiResult.duplicate_of) {
      const originalComplaint = await Complaint.findById(aiResult.duplicate_of);
      if (originalComplaint) {
        originalComplaint.upvotes += 1;
        await originalComplaint.save();

        // Record vote
        try {
          await new Vote({ complaint_id: originalComplaint._id, user_id: req.user.id }).save();
        } catch (e) { /* duplicate vote */ }

        // Give upvote points
        await User.findByIdAndUpdate(req.user.id, { $inc: { reward_points: 2 } });
        await new Reward({ user_id: req.user.id, points: 2, reason: 'Duplicate complaint merged as upvote' }).save();

        return res.json({
          message: 'Similar complaint already exists. Your support has been added as an upvote!',
          is_duplicate: true,
          original_complaint: originalComplaint,
          points_earned: 2
        });
      }
    }

    // Create new complaint
    const complaint = new Complaint({
      user_id: req.user.id,
      complaint_text,
      translated_text: aiResult.translated_text,
      location,
      language: language || aiResult.detected_language,
      uploaded_image_url: uploaded_image_url || '',
      department: aiResult.department,
      priority_level: aiResult.priority_level,
      ai_suggestion: aiResult.ai_suggestion,
      status: 'Pending'
    });

    await complaint.save();

    // Award points for submission
    await User.findByIdAndUpdate(req.user.id, { $inc: { reward_points: 10 } });
    await new Reward({ user_id: req.user.id, points: 10, reason: 'Submitted a new complaint' }).save();

    // Check for badge milestones
    const user = await User.findById(req.user.id);
    const complaintCount = await Complaint.countDocuments({ user_id: req.user.id });
    if (complaintCount === 5 && !user.badges.find(b => b.name === 'Active Citizen')) {
      user.badges.push({ name: 'Active Citizen', icon: '🏆' });
      await user.save();
    }
    if (complaintCount === 10 && !user.badges.find(b => b.name === 'Civic Champion')) {
      user.badges.push({ name: 'Civic Champion', icon: '👑' });
      await user.save();
    }

    // Create notification
    await new Notification({
      user_id: req.user.id,
      complaint_id: complaint._id,
      message: `Your complaint has been submitted and assigned to ${aiResult.department}.`
    }).save();

    res.status(201).json({
      message: 'Complaint submitted successfully!',
      complaint,
      ai_analysis: {
        department: aiResult.department,
        priority: aiResult.priority_level,
        suggestion: aiResult.ai_suggestion,
        language: aiResult.detected_language,
        translated_text: aiResult.translated_text
      },
      points_earned: 10
    });
  } catch (error) {
    console.error('Complaint submission error:', error);
    res.status(500).json({ error: 'Server error submitting complaint.' });
  }
});

// GET /api/complaints/user/:userId
router.get('/user/:userId', authMiddleware, async (req, res) => {
  try {
    const complaints = await Complaint.find({ user_id: req.params.userId })
      .sort({ created_at: -1 });
    res.json({ complaints });
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching complaints.' });
  }
});

// GET /api/complaints/all
router.get('/all', async (req, res) => {
  try {
    const { department, priority, status, page = 1, limit = 50 } = req.query;
    const filter = {};
    if (department) filter.department = department;
    if (priority) filter.priority_level = priority;
    if (status) filter.status = status;

    const complaints = await Complaint.find(filter)
      .populate('user_id', 'name email')
      .sort({ created_at: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Complaint.countDocuments(filter);

    res.json({ complaints, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching complaints.' });
  }
});

// PUT /api/complaints/update-status
router.put('/update-status', authMiddleware, async (req, res) => {
  try {
    const { complaint_id, status } = req.body;

    if (!['Pending', 'In Progress', 'Resolved'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value.' });
    }

    const complaint = await Complaint.findByIdAndUpdate(
      complaint_id,
      { status, updated_at: Date.now() },
      { new: true }
    );

    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found.' });
    }

    // If resolved, update priority to green and award points
    if (status === 'Resolved') {
      complaint.priority_level = 'green';
      await complaint.save();

      await User.findByIdAndUpdate(complaint.user_id, { $inc: { reward_points: 5 } });
      await new Reward({ user_id: complaint.user_id, points: 5, reason: 'Complaint resolved' }).save();

      // Check for resolution badge
      const user = await User.findById(complaint.user_id);
      const resolvedCount = await Complaint.countDocuments({ user_id: complaint.user_id, status: 'Resolved' });
      if (resolvedCount >= 3 && !user.badges.find(b => b.name === 'Problem Solver')) {
        user.badges.push({ name: 'Problem Solver', icon: '🔧' });
        await user.save();
      }
    }

    // Notification
    await new Notification({
      user_id: complaint.user_id,
      complaint_id: complaint._id,
      message: `Your complaint status has been updated to "${status}".`
    }).save();

    res.json({ message: 'Status updated successfully.', complaint });
  } catch (error) {
    res.status(500).json({ error: 'Server error updating status.' });
  }
});

// POST /api/complaints/upvote
router.post('/upvote', authMiddleware, async (req, res) => {
  try {
    const { complaint_id } = req.body;

    // Check for existing vote
    const existingVote = await Vote.findOne({ complaint_id, user_id: req.user.id });
    if (existingVote) {
      return res.status(400).json({ error: 'You have already upvoted this complaint.' });
    }

    await new Vote({ complaint_id, user_id: req.user.id }).save();
    const complaint = await Complaint.findByIdAndUpdate(
      complaint_id,
      { $inc: { upvotes: 1 } },
      { new: true }
    );

    // Award points for upvoting
    await User.findByIdAndUpdate(req.user.id, { $inc: { reward_points: 2 } });
    await new Reward({ user_id: req.user.id, points: 2, reason: 'Upvoted a complaint' }).save();

    res.json({ message: 'Upvote recorded!', upvotes: complaint.upvotes, points_earned: 2 });
  } catch (error) {
    res.status(500).json({ error: 'Server error recording upvote.' });
  }
});

// POST /api/complaints/feedback
router.post('/feedback', authMiddleware, async (req, res) => {
  try {
    const { complaint_id, rating, comment } = req.body;

    if (!complaint_id || !rating) {
      return res.status(400).json({ error: 'complaint_id and rating are required.' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating should be between 1 and 5.' });
    }

    const complaint = await Complaint.findOne({ _id: complaint_id, user_id: req.user.id });
    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found.' });
    }

    if (complaint.status !== 'Resolved') {
      return res.status(400).json({ error: 'Feedback can be submitted only for resolved complaints.' });
    }

    complaint.feedback = {
      rating,
      comment: comment || '',
      submitted_at: new Date()
    };

    await complaint.save();

    await new Notification({
      user_id: req.user.id,
      complaint_id: complaint._id,
      message: 'Thank you for your feedback. It helps us improve department performance.'
    }).save();

    res.json({ message: 'Feedback submitted successfully.', feedback: complaint.feedback });
  } catch (error) {
    res.status(500).json({ error: 'Server error submitting feedback.' });
  }
});

// GET /api/complaints/insights
router.get('/insights', async (req, res) => {
  try {
    const insights = await generateInsights(Complaint);
    res.json({ insights });
  } catch (error) {
    res.status(500).json({ error: 'Server error generating insights.' });
  }
});

// GET /api/complaints/notifications/:userId
router.get('/notifications/:userId', authMiddleware, async (req, res) => {
  try {
    const notifications = await Notification.find({ user_id: req.params.userId })
      .sort({ created_at: -1 })
      .limit(20);
    res.json({ notifications });
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching notifications.' });
  }
});

module.exports = router;
