const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  refreshToken: { 
    type: String, 
    required: true,
    unique: true 
  },
  deviceInfo: {
    userAgent: { type: String, default: '' },
    ip: { type: String, default: '' },
    browser: { type: String, default: '' },
    os: { type: String, default: '' }
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  lastActivity: { 
    type: Date, 
    default: Date.now 
  },
  createdAt: { 
    type: Date, 
    default: Date.now,
    expires: 60 * 60 * 24 * 30 // Auto-delete after 30 days
  }
});

// Indexes for efficient queries
SessionSchema.index({ userId: 1, isActive: 1 });

module.exports = mongoose.model('Session', SessionSchema);
