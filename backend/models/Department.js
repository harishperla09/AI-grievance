const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  department_name: { type: String, required: true, unique: true },
  department_email: { type: String, required: true },
  department_head: { type: String, required: true },
  icon: { type: String, default: '🏛️' }
});

module.exports = mongoose.model('Department', departmentSchema);
