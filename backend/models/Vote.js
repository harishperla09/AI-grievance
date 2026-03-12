const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
  complaint_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Complaint', required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  created_at: { type: Date, default: Date.now }
});

voteSchema.index({ complaint_id: 1, user_id: 1 }, { unique: true });

module.exports = mongoose.model('Vote', voteSchema);
