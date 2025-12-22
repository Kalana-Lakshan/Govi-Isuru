const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const alertService = require('../services/alertService');
const DiseaseReport = require('../models/DiseaseReport');
const CommunityAlert = require('../models/CommunityAlert');
const Notification = require('../models/Notification');

// Auth middleware
const authMiddleware = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Optional auth middleware (doesn't fail if no token)
const optionalAuth = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      req.user = decoded;
    }
    next();
  } catch (error) {
    next();
  }
};

/**
 * POST /api/alerts/disease-report
 * Save a disease report after AI prediction
 */
router.post('/disease-report', optionalAuth, async (req, res) => {
  try {
    const {
      crop,
      disease,
      confidence,
      district,
      dsDivision,
      gnDivision,
      treatment,
      farmerUsername
    } = req.body;

    // Validation
    if (!disease || !gnDivision) {
      return res.status(400).json({ 
        error: 'Disease and GN Division are required' 
      });
    }

    const reportData = {
      farmerId: req.user?.userId || null,
      farmerUsername: farmerUsername || req.user?.username || 'Anonymous',
      crop: crop || 'Rice',
      disease,
      confidence: confidence || 0,
      district: district || 'Unknown',
      dsDivision: dsDivision || 'Unknown',
      gnDivision,
      treatment: treatment || ''
    };

    const { report, alerts } = await alertService.saveDiseaseReport(reportData);

    res.status(201).json({
      success: true,
      message: 'Disease report saved successfully',
      report: {
        id: report._id,
        disease: report.disease,
        location: report.gnDivision
      },
      alertsTriggered: alerts.length,
      alerts: alerts.map(a => ({
        id: a._id,
        disease: a.disease,
        severity: a.severity,
        reportCount: a.reportCount
      }))
    });
  } catch (error) {
    console.error('Error saving disease report:', error);
    res.status(500).json({ error: 'Failed to save disease report' });
  }
});

/**
 * GET /api/alerts/active
 * Get active alerts for a location
 */
router.get('/active', async (req, res) => {
  try {
    const { gnDivision, dsDivision, district } = req.query;

    if (!gnDivision && !dsDivision && !district) {
      return res.status(400).json({ 
        error: 'At least one location parameter required (gnDivision, dsDivision, or district)' 
      });
    }

    const alerts = await alertService.getActiveAlerts(
      gnDivision,
      dsDivision,
      district
    );

    res.json({
      success: true,
      count: alerts.length,
      alerts: alerts.map(alert => ({
        id: alert._id,
        crop: alert.crop,
        disease: alert.disease,
        district: alert.district,
        dsDivision: alert.dsDivision,
        gnDivision: alert.gnDivision,
        reportCount: alert.reportCount,
        severity: alert.severity,
        status: alert.status,
        firstReportedAt: alert.firstReportedAt,
        lastUpdatedAt: alert.lastUpdatedAt,
        recommendation: alert.recommendation
      }))
    });
  } catch (error) {
    console.error('Error getting active alerts:', error);
    res.status(500).json({ error: 'Failed to get active alerts' });
  }
});

/**
 * GET /api/alerts/notifications
 * Get notifications for a user's location
 */
router.get('/notifications', async (req, res) => {
  try {
    const { gnDivision, limit } = req.query;

    if (!gnDivision) {
      return res.status(400).json({ error: 'GN Division is required' });
    }

    const notifications = await alertService.getNotifications(
      gnDivision,
      parseInt(limit) || 10
    );

    res.json({
      success: true,
      count: notifications.length,
      notifications
    });
  } catch (error) {
    console.error('Error getting notifications:', error);
    res.status(500).json({ error: 'Failed to get notifications' });
  }
});

/**
 * PUT /api/alerts/notifications/:id/read
 * Mark a notification as read
 */
router.put('/notifications/:id/read', authMiddleware, async (req, res) => {
  try {
    const notification = await alertService.markNotificationRead(req.params.id);
    
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.json({
      success: true,
      notification
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ error: 'Failed to update notification' });
  }
});

/**
 * GET /api/alerts/stats
 * Get alert statistics for dashboard
 */
router.get('/stats', async (req, res) => {
  try {
    const { district } = req.query;

    const matchQuery = { status: 'active' };
    if (district) {
      matchQuery.district = district;
    }

    const stats = await CommunityAlert.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$severity',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalReports = await DiseaseReport.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    });

    const diseaseBreakdown = await DiseaseReport.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: '$disease',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    res.json({
      success: true,
      stats: {
        alertsBySeverity: stats,
        totalReportsThisWeek: totalReports,
        topDiseases: diseaseBreakdown
      }
    });
  } catch (error) {
    console.error('Error getting alert stats:', error);
    res.status(500).json({ error: 'Failed to get stats' });
  }
});

/**
 * GET /api/alerts/history
 * Get alert history for a location
 */
router.get('/history', async (req, res) => {
  try {
    const { gnDivision, dsDivision, district, limit } = req.query;

    const query = {};
    if (gnDivision) query.gnDivision = gnDivision;
    if (dsDivision) query.dsDivision = dsDivision;
    if (district) query.district = district;

    const alerts = await CommunityAlert.find(query)
      .sort({ createdAt: -1 })
      .limit(Number.parseInt(limit) || 20);

    res.json({
      success: true,
      count: alerts.length,
      alerts
    });
  } catch (error) {
    console.error('Error getting alert history:', error);
    res.status(500).json({ error: 'Failed to get alert history' });
  }
});

/**
 * GET /api/alerts/heatmap
 * Get heatmap data for disease visualization
 */
router.get('/heatmap', async (req, res) => {
  try {
    const { district, disease, severity, days } = req.query;
    
    const heatmapData = await alertService.getHeatmapData({
      district,
      disease,
      severity,
      days: Number.parseInt(days) || 30
    });
    
    res.json({
      success: true,
      count: heatmapData.length,
      data: heatmapData
    });
  } catch (error) {
    console.error('Error getting heatmap data:', error);
    res.status(500).json({ error: 'Failed to get heatmap data' });
  }
});

/**
 * GET /api/alerts/timeseries
 * Get time-series outbreak data
 */
router.get('/timeseries', async (req, res) => {
  try {
    const { district, disease, gnDivision, days } = req.query;
    
    const timeSeriesData = await alertService.getTimeSeriesData({
      district,
      disease,
      gnDivision,
      days: Number.parseInt(days) || 30
    });
    
    res.json({
      success: true,
      ...timeSeriesData
    });
  } catch (error) {
    console.error('Error getting time series data:', error);
    res.status(500).json({ error: 'Failed to get time series data' });
  }
});

/**
 * GET /api/alerts/flagged
 * Get flagged reports for admin review
 */
router.get('/flagged', authMiddleware, async (req, res) => {
  try {
    const { district, limit } = req.query;
    
    const reports = await alertService.getFlaggedReports({
      district,
      limit: Number.parseInt(limit) || 50
    });
    
    res.json({
      success: true,
      count: reports.length,
      reports
    });
  } catch (error) {
    console.error('Error getting flagged reports:', error);
    res.status(500).json({ error: 'Failed to get flagged reports' });
  }
});

/**
 * PUT /api/alerts/reports/:id/review
 * Admin review a flagged report
 */
router.put('/reports/:id/review', authMiddleware, async (req, res) => {
  try {
    const { status, flaggedReason } = req.body;
    
    if (!['verified', 'rejected', 'flagged'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status. Must be verified, rejected, or flagged' });
    }
    
    const report = await alertService.reviewReport(req.params.id, {
      status,
      flaggedReason,
      reviewedBy: req.user?.username || 'admin'
    });
    
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }
    
    res.json({
      success: true,
      message: `Report ${status}`,
      report
    });
  } catch (error) {
    console.error('Error reviewing report:', error);
    res.status(500).json({ error: 'Failed to review report' });
  }
});

/**
 * GET /api/alerts/outbreak-summary
 * Get outbreak summary statistics
 */
router.get('/outbreak-summary', async (req, res) => {
  try {
    const { district, days } = req.query;
    const daysNum = Number.parseInt(days) || 7;
    
    const timeWindow = new Date(Date.now() - daysNum * 24 * 60 * 60 * 1000);
    
    const matchQuery = { createdAt: { $gte: timeWindow } };
    if (district) matchQuery.district = district;
    
    // Get summary statistics from DiseaseReport
    const [totalReports, diseaseBreakdownRaw, severityBreakdown, locationBreakdownRaw] = await Promise.all([
      DiseaseReport.countDocuments(matchQuery),
      
      DiseaseReport.aggregate([
        { $match: { ...matchQuery, disease: { $ne: null, $ne: '' } } },
        { $group: { _id: '$disease', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]),
      
      DiseaseReport.aggregate([
        { $match: matchQuery },
        { $group: { _id: '$severity', count: { $sum: 1 } } }
      ]),
      
      DiseaseReport.aggregate([
        { $match: { ...matchQuery, district: { $ne: null, $ne: '' } } },
        { $group: { _id: '$district', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ])
    ]);
    
    // If DiseaseReport has no data, fallback to CommunityAlert aggregation
    let diseaseBreakdown = diseaseBreakdownRaw;
    let locationBreakdown = locationBreakdownRaw;
    
    if (diseaseBreakdown.length === 0 || locationBreakdown.length === 0) {
      const alertMatchQuery = { status: { $in: ['active', 'monitoring'] } };
      if (district) alertMatchQuery.district = district;
      
      const [alertDiseaseBreakdown, alertLocationBreakdown] = await Promise.all([
        CommunityAlert.aggregate([
          { $match: alertMatchQuery },
          { $group: { _id: '$disease', count: { $sum: '$reportCount' } } },
          { $sort: { count: -1 } },
          { $limit: 10 }
        ]),
        
        CommunityAlert.aggregate([
          { $match: alertMatchQuery },
          { $group: { _id: '$district', count: { $sum: '$reportCount' } } },
          { $sort: { count: -1 } },
          { $limit: 10 }
        ])
      ]);
      
      if (diseaseBreakdown.length === 0) diseaseBreakdown = alertDiseaseBreakdown;
      if (locationBreakdown.length === 0) locationBreakdown = alertLocationBreakdown;
    }
    
    // Get active alerts count
    const activeAlerts = await CommunityAlert.countDocuments({
      status: 'active',
      ...(district ? { district } : {})
    });
    
    res.json({
      success: true,
      summary: {
        totalReports,
        activeAlerts,
        timeRange: `Last ${daysNum} days`,
        diseaseBreakdown: diseaseBreakdown.map(d => ({ disease: d._id, count: d.count })),
        severityBreakdown: severityBreakdown.map(s => ({ severity: s._id, count: s.count })),
        topLocations: locationBreakdown.map(l => ({ district: l._id, count: l.count }))
      }
    });
  } catch (error) {
    console.error('Error getting outbreak summary:', error);
    res.status(500).json({ error: 'Failed to get outbreak summary' });
  }
});

/**
 * PUT /api/alerts/:id/resolve
 * Resolve an alert (admin only - simplified for now)
 * NOTE: This route must be at the end to avoid catching named routes like /outbreak-summary
 */
router.put('/:id/resolve', authMiddleware, async (req, res) => {
  try {
    const alert = await alertService.resolveAlert(req.params.id);
    
    if (!alert) {
      return res.status(404).json({ error: 'Alert not found' });
    }

    res.json({
      success: true,
      message: 'Alert resolved',
      alert
    });
  } catch (error) {
    console.error('Error resolving alert:', error);
    res.status(500).json({ error: 'Failed to resolve alert' });
  }
});

module.exports = router;
