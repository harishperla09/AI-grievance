const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['citizen', 'admin'], default: 'citizen' },
  reward_points: { type: Number, default: 0 },
  badges: [{ 
    name: String, 
    icon: String, 
    earned_at: { type: Date, default: Date.now } 
  }],
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
