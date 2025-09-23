const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['super_admin', 'admin', 'viewer', 'analytics_manager'],
    default: 'viewer',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  twoFactorSecret: {
    type: String,
    required: false,
  },
  isTwoFactorEnabled: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('User', UserSchema);

