const express = require('express');
const Complaint = require('../models/Complaint');
const Escalation = require('../models/Escalation');
const Notification = require('../models/Notification');
const User = require('../models/User');
const Reward = require('../models/Reward');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const { generateInsights } = require('../ai/nlpEngine');

const router = express.Router();

// GET /api/admin/complaints
router.get('/complaints', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { department, priority, status, page = 1, limit = 50 } = req.query;
    const filter = {};
    if (department) filter.department = department;
    if (priority) filter.priority_level = priority;
    if (status) filter.status = status;

    const complaints = await Complaint.find(filter)
      .populate('user_id', 'name email phone')
      .sort({ priority_level: 1, created_at: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Complaint.countDocuments(filter);

    res.json({ complaints, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching admin complaints.' });
  }
});

// PUT /api/admin/update-status
router.put('/update-status', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { complaint_id, status, assigned_staff } = req.body;

    if (!['Pending', 'In Progress', 'Resolved'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value.' });
    }

    const updateData = { status, updated_at: Date.now() };
    if (assigned_staff) updateData.assigned_staff = assigned_staff;

    const complaint = await Complaint.findByIdAndUpdate(complaint_id, updateData, { new: true });

    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found.' });
    }

    // If resolved, update priority and award points
    if (status === 'Resolved') {
      complaint.priority_level = 'green';
      await complaint.save();

      await User.findByIdAndUpdate(complaint.user_id, { $inc: { reward_points: 5 } });
      await new Reward({ user_id: complaint.user_id, points: 5, reason: 'Complaint resolved' }).save();
    }

    // Send notification
    await new Notification({
      user_id: complaint.user_id,
      complaint_id: complaint._id,
      message: `Your complaint status has been updated to "${status}"${assigned_staff ? ` and assigned to ${assigned_staff}` : ''}.`
    }).save();

    res.json({ message: 'Complaint updated successfully.', complaint });
  } catch (error) {
    res.status(500).json({ error: 'Server error updating complaint.' });
  }
});

// POST /api/admin/escalate
router.post('/escalate', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { complaint_id, escalation_level, reason } = req.body;

    const complaint = await Complaint.findById(complaint_id);
    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found.' });
    }

    const escalation = new Escalation({
      complaint_id,
      department: complaint.department,
      escalation_level: escalation_level || 1,
      reason: reason || 'Not resolved within SLA'
    });

    await escalation.save();

    // Update priority to red on escalation
    complaint.priority_level = 'red';
    await complaint.save();

    await new Notification({
      user_id: complaint.user_id,
      complaint_id: complaint._id,
      message: 'Your complaint has been escalated for faster resolution.'
    }).save();

    res.json({ message: 'Complaint escalated successfully.', escalation });
  } catch (error) {
    res.status(500).json({ error: 'Server error escalating complaint.' });
  }
});

// GET /api/admin/insights
router.get('/insights', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const insights = await generateInsights(Complaint);
    res.json({ insights });
  } catch (error) {
    res.status(500).json({ error: 'Server error generating insights.' });
  }
});

// GET /api/admin/departments
router.get('/departments', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const departments = await Complaint.distinct('department');
    const deptStats = await Promise.all(departments.map(async (dept) => {
      const total = await Complaint.countDocuments({ department: dept });
      const resolved = await Complaint.countDocuments({ department: dept, status: 'Resolved' });
      const pending = await Complaint.countDocuments({ department: dept, status: 'Pending' });
      const inProgress = await Complaint.countDocuments({ department: dept, status: 'In Progress' });
      return { department: dept, total, resolved, pending, inProgress };
    }));

    res.json({ departments: deptStats });
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching department stats.' });
  }
});

module.exports = router;
