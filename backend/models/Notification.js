const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  complaint_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Complaint' },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', notificationSchema);
