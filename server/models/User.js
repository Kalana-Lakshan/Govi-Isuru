const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  district: { type: String, required: true },
  dsDivision: { type: String, required: true },
  gnDivision: { type: String, required: true },
  phone: { type: String, default: '' },
  
  // Email Verification
  isEmailVerified: { type: Boolean, default: false },
  verificationToken: { type: String },
  verificationTokenExpires: { type: Date },
  
  // Password Reset
  passwordResetToken: { type: String },
  passwordResetExpires: { type: Date },
  
  // Role System - Farmer, Government Officer, or Buyer
  role: { type: String, enum: ['farmer', 'officer', 'buyer', 'admin', 'moderator'], default: 'farmer' },
  officerId: { type: String, default: null }, // For government officers only
  department: { type: String, default: null }, // e.g., "Department of Agriculture", "Agrarian Services"
  designation: { type: String, default: null }, // e.g., "Agricultural Instructor", "Agrarian Development Officer"
  
  // Reputation System Fields (for farmers)
  reputation_score: { type: Number, default: 3.0, min: 1, max: 5 },
  total_sales: { type: Number, default: 0 },
  verified_listings: { type: Number, default: 0 },
  total_feedbacks: { type: Number, default: 0 },
  is_verified_farmer: { type: Boolean, default: false },
  
  // False Report Tracking (Alert System)
  false_report_count: { type: Number, default: 0 },
  account_flagged: { type: Boolean, default: false },
  last_report_at: { type: Date },
  
  createdAt: { type: Date, default: Date.now }
});

// Index for reputation queries
UserSchema.index({ reputation_score: -1 });
UserSchema.index({ role: 1 });
UserSchema.index({ account_flagged: 1 });
UserSchema.index({ officerId: 1 });
UserSchema.index({ district: 1, role: 1 });
UserSchema.index({ verificationToken: 1 });
UserSchema.index({ passwordResetToken: 1 });

module.exports = mongoose.model('User', UserSchema);