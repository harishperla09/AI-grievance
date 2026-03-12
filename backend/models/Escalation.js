const mongoose = require('mongoose');

const escalationSchema = new mongoose.Schema({
  complaint_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Complaint', required: true },
  department: { type: String, required: true },
  escalation_level: { type: Number, default: 1 },
  reason: { type: String, default: 'Not resolved within SLA' },
  escalation_date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Escalation', escalationSchema);
