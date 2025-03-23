const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['student', 'professor', 'admin'], default: 'student' },
  isVerified: { type: Boolean, default: false },
  verificationCode: String
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);