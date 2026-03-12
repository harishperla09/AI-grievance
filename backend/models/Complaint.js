const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  complaint_text: { type: String, required: true, trim: true },
  translated_text: { type: String, default: '' },
  location: { type: String, required: true, trim: true },
  language: { type: String, default: 'English' },
  uploaded_image_url: { type: String, default: '' },
  department: { type: String, required: true },
  priority_level: { type: String, enum: ['red', 'yellow', 'green'], default: 'yellow' },
  status: { type: String, enum: ['Pending', 'In Progress', 'Resolved'], default: 'Pending' },
  upvotes: { type: Number, default: 0 },
  assigned_staff: { type: String, default: '' },
  ai_suggestion: { type: String, default: '' },
  feedback: {
    rating: { type: Number, min: 1, max: 5, default: null },
    comment: { type: String, default: '' },
    submitted_at: { type: Date, default: null }
  },
  is_duplicate: { type: Boolean, default: false },
  duplicate_of: { type: mongoose.Schema.Types.ObjectId, ref: 'Complaint', default: null },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

complaintSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

module.exports = mongoose.model('Complaint', complaintSchema);
