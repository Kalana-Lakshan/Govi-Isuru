const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  district: { type: String, required: true },
  dsDivision: { type: String, required: true },
  gnDivision: { type: String, required: true },
  phone: { type: String, default: '' },
  
  // Reputation System Fields
  reputation_score: { type: Number, default: 3.0, min: 1, max: 5 },
  total_sales: { type: Number, default: 0 },
  verified_listings: { type: Number, default: 0 },
  total_feedbacks: { type: Number, default: 0 },
  is_verified_farmer: { type: Boolean, default: false },
  
  // False Report Tracking (Alert System)
  false_report_count: { type: Number, default: 0 },
  account_flagged: { type: Boolean, default: false },
  last_report_at: { type: Date },
  
  // Role for admin moderation
  role: { type: String, enum: ['farmer', 'admin', 'moderator'], default: 'farmer' },
  
  createdAt: { type: Date, default: Date.now }
});

// Index for reputation queries
UserSchema.index({ reputation_score: -1 });
UserSchema.index({ role: 1 });
UserSchema.index({ account_flagged: 1 });

module.exports = mongoose.model('User', UserSchema);