const mongoose = require('mongoose');

// Disease Report Schema - Logs every AI prediction with verification support
const DiseaseReportSchema = new mongoose.Schema({
  farmerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: false // Allow anonymous reports
  },
  farmerUsername: {
    type: String,
    required: false
  },
  crop: { 
    type: String, 
    required: true,
    default: 'rice'
  },
  disease: { 
    type: String, 
    required: true 
  },
  confidence: { 
    type: Number, 
    required: true,
    min: 0,
    max: 1
  },
  // Severity level from AI or manual override
  severity: {
    type: String,
    enum: ['none', 'low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  district: { 
    type: String, 
    required: true 
  },
  dsDivision: { 
    type: String, 
    required: true 
  },
  gnDivision: { 
    type: String, 
    required: true 
  },
  // Geographic coordinates for heatmap
  coordinates: {
    lat: { type: Number },
    lng: { type: Number }
  },
  // Optional: Store treatment given
  treatment: {
    type: String
  },
  // === VERIFICATION & TRUST SYSTEM ===
  // AI confidence validation
  aiConfidenceValid: {
    type: Boolean,
    default: true // Set to false if confidence < threshold
  },
  // Trust score (0-100) calculated from multiple factors
  trustScore: {
    type: Number,
    default: 50,
    min: 0,
    max: 100
  },
  // Verification status
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'flagged', 'rejected'],
    default: 'pending'
  },
  // Community confirmations (nearby farmers confirming the same disease)
  communityConfirmations: {
    type: Number,
    default: 0
  },
  // References to confirming reports
  confirmedBy: [{
    reportId: { type: mongoose.Schema.Types.ObjectId, ref: 'DiseaseReport' },
    farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    confirmedAt: { type: Date, default: Date.now }
  }],
  // Flag for suspicious activity
  flaggedReason: {
    type: String,
    default: null
  },
  // Admin review status
  adminReviewed: {
    type: Boolean,
    default: false
  },
  reviewedBy: {
    type: String,
    default: null
  },
  reviewedAt: {
    type: Date,
    default: null
  },
  // Image data (optional - for manual verification)
  imageUrl: {
    type: String,
    default: null
  },
  createdAt: { 
    type: Date, 
    default: Date.now,
    index: true // Index for faster time-based queries
  }
});

// Compound indexes for efficient queries
DiseaseReportSchema.index({ crop: 1, disease: 1, gnDivision: 1, createdAt: -1 });
DiseaseReportSchema.index({ verificationStatus: 1, createdAt: -1 });
DiseaseReportSchema.index({ trustScore: -1, createdAt: -1 });
DiseaseReportSchema.index({ 'coordinates.lat': 1, 'coordinates.lng': 1 });
DiseaseReportSchema.index({ district: 1, disease: 1, createdAt: -1 });

// Static method to get verified reports for heatmap
DiseaseReportSchema.statics.getVerifiedReportsForHeatmap = async function(filters = {}) {
  const query = {
    verificationStatus: { $in: ['verified', 'pending'] },
    trustScore: { $gte: 30 }, // Minimum trust score
    'coordinates.lat': { $exists: true },
    'coordinates.lng': { $exists: true }
  };
  
  if (filters.district) query.district = filters.district;
  if (filters.disease) query.disease = filters.disease;
  if (filters.severity) query.severity = filters.severity;
  if (filters.startDate && filters.endDate) {
    query.createdAt = { 
      $gte: new Date(filters.startDate), 
      $lte: new Date(filters.endDate) 
    };
  } else if (filters.days) {
    query.createdAt = { 
      $gte: new Date(Date.now() - filters.days * 24 * 60 * 60 * 1000) 
    };
  }
  
  return this.find(query)
    .select('disease severity coordinates district gnDivision trustScore createdAt confidence')
    .sort({ createdAt: -1 })
    .lean();
};

// Static method to get time-series data
DiseaseReportSchema.statics.getTimeSeriesData = async function(filters = {}) {
  const matchQuery = {};
  
  if (filters.district) matchQuery.district = filters.district;
  if (filters.disease) matchQuery.disease = filters.disease;
  if (filters.gnDivision) matchQuery.gnDivision = filters.gnDivision;
  
  // Default to last 30 days
  const days = filters.days || 30;
  matchQuery.createdAt = { 
    $gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000) 
  };
  
  // Only include trusted reports
  matchQuery.trustScore = { $gte: 30 };
  
  return this.aggregate([
    { $match: matchQuery },
    {
      $group: {
        _id: {
          date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          disease: "$disease"
        },
        count: { $sum: 1 },
        avgConfidence: { $avg: "$confidence" },
        avgTrustScore: { $avg: "$trustScore" }
      }
    },
    { $sort: { "_id.date": 1 } },
    {
      $group: {
        _id: "$_id.disease",
        data: {
          $push: {
            date: "$_id.date",
            count: "$count",
            avgConfidence: "$avgConfidence",
            avgTrustScore: "$avgTrustScore"
          }
        },
        totalReports: { $sum: "$count" }
      }
    }
  ]);
};

module.exports = mongoose.model('DiseaseReport', DiseaseReportSchema);
