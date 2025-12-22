const DiseaseReport = require('../models/DiseaseReport');
const CommunityAlert = require('../models/CommunityAlert');
const Notification = require('../models/Notification');
const User = require('../models/User');

// Alert thresholds configuration
const ALERT_CONFIG = {
  reportThreshold: 3,        // Minimum reports to trigger alert
  timeWindowDays: 7,         // Days to look back for reports
  confidenceThreshold: 0.5,  // Minimum AI confidence for valid report
  trustScoreThreshold: 30,   // Minimum trust score for verified reports
  severityLevels: {
    low: { min: 3, max: 5 },
    medium: { min: 6, max: 10 },
    high: { min: 11, max: 20 },
    critical: { min: 21, max: Infinity }
  }
};

// District coordinates for geocoding
const districtCoordinates = {
  "Anuradhapura": { lat: 8.3114, lng: 80.4037 },
  "Polonnaruwa": { lat: 7.9403, lng: 81.0188 },
  "Colombo": { lat: 6.9271, lng: 79.8612 },
  "Gampaha": { lat: 7.0873, lng: 80.0144 },
  "Kalutara": { lat: 6.5854, lng: 79.9607 },
  "Kandy": { lat: 7.2906, lng: 80.6337 },
  "Matale": { lat: 7.4675, lng: 80.6234 },
  "Nuwara Eliya": { lat: 6.9497, lng: 80.7891 },
  "Galle": { lat: 6.0535, lng: 80.2210 },
  "Matara": { lat: 5.9549, lng: 80.5550 },
  "Hambantota": { lat: 6.1429, lng: 81.1212 },
  "Jaffna": { lat: 9.6615, lng: 80.0255 },
  "Kilinochchi": { lat: 9.3803, lng: 80.3770 },
  "Mannar": { lat: 8.9833, lng: 79.9042 },
  "Vavuniya": { lat: 8.7514, lng: 80.4997 },
  "Mullaitivu": { lat: 9.2671, lng: 80.8142 },
  "Trincomalee": { lat: 8.5874, lng: 81.2152 },
  "Batticaloa": { lat: 7.7310, lng: 81.6747 },
  "Ampara": { lat: 7.2975, lng: 81.6820 },
  "Kurunegala": { lat: 7.4863, lng: 80.3647 },
  "Puttalam": { lat: 8.0362, lng: 79.8283 },
  "Badulla": { lat: 6.9934, lng: 81.0550 },
  "Moneragala": { lat: 6.8728, lng: 81.3507 },
  "Ratnapura": { lat: 6.6828, lng: 80.4028 },
  "Kegalle": { lat: 7.2513, lng: 80.3464 }
};

// Disease-specific recommendations
const diseaseRecommendations = {
  // Rice diseases
  'Bacterial Leaf Blight': {
    en: 'Use copper-based bactericides. Ensure proper field drainage. Apply balanced NPK fertilizer avoiding excess nitrogen. Remove and destroy infected plant debris.',
    si: 'තඹ පදනම් වූ බැක්ටීරිසයිඩ භාවිතා කරන්න. නිසි ජල බැහැර කිරීම සහතික කරන්න. අධික නයිට්‍රජන් වළක්වා සමබර NPK පොහොර යොදන්න. ආසාදිත ශාක අපද්‍රව්‍ය ඉවත් කර විනාශ කරන්න.'
  },
  'Bacterial leaf blight': {
    en: 'Use copper-based bactericides. Ensure proper field drainage. Apply balanced NPK fertilizer avoiding excess nitrogen. Remove and destroy infected plant debris.',
    si: 'තඹ පදනම් වූ බැක්ටීරිසයිඩ භාවිතා කරන්න. නිසි ජල බැහැර කිරීම සහතික කරන්න. අධික නයිට්‍රජන් වළක්වා සමබර NPK පොහොර යොදන්න. ආසාදිත ශාක අපද්‍රව්‍ය ඉවත් කර විනාශ කරන්න.'
  },
  'Brown Spot': {
    en: 'Apply fungicides like Mancozeb or Carbendazim. Ensure potassium-rich fertilization. Maintain proper water management. Use resistant varieties if available.',
    si: 'Mancozeb හෝ Carbendazim වැනි දිලීර නාශක යොදන්න. පොටෑසියම් බහුල පොහොර සහතික කරන්න. නිසි ජල කළමනාකරණය පවත්වන්න. ඇත්නම් ප්‍රතිරෝධී ප්‍රභේද භාවිතා කරන්න.'
  },
  'Brown spot': {
    en: 'Apply fungicides like Mancozeb or Carbendazim. Ensure potassium-rich fertilization. Maintain proper water management. Use resistant varieties if available.',
    si: 'Mancozeb හෝ Carbendazim වැනි දිලීර නාශක යොදන්න. පොටෑසියම් බහුල පොහොර සහතික කරන්න. නිසි ජල කළමනාකරණය පවත්වන්න. ඇත්නම් ප්‍රතිරෝධී ප්‍රභේද භාවිතා කරන්න.'
  },
  'Leaf smut': {
    en: 'Remove and burn infected plants immediately. Apply appropriate fungicides. Avoid dense planting. Ensure good air circulation in the field.',
    si: 'ආසාදිත ශාක වහාම ඉවත් කර පුළුස්සා දමන්න. සුදුසු දිලීර නාශක යොදන්න. ඝන වගාව වළක්වන්න. කෙතේ හොඳ වාතාශ්‍රය සහතික කරන්න.'
  },
  'Leaf Blast': {
    en: 'Apply Tricyclazole or Isoprothiolane fungicides. Avoid excess nitrogen fertilization. Use resistant varieties. Remove weeds that may harbor the pathogen.',
    si: 'Tricyclazole හෝ Isoprothiolane දිලීර නාශක යොදන්න. අධික නයිට්‍රජන් පොහොර වළක්වන්න. ප්‍රතිරෝධී ප්‍රභේද භාවිතා කරන්න. රෝග කාරකය රඳවා ගත හැකි වල් පැලෑටි ඉවත් කරන්න.'
  },
  'Rice blast': {
    en: 'Apply Tricyclazole or Isoprothiolane fungicides. Avoid excess nitrogen fertilization. Use resistant varieties. Remove weeds that may harbor the pathogen.',
    si: 'Tricyclazole හෝ Isoprothiolane දිලීර නාශක යොදන්න. අධික නයිට්‍රජන් පොහොර වළක්වන්න. ප්‍රතිරෝධී ප්‍රභේද භාවිතා කරන්න. රෝග කාරකය රඳවා ගත හැකි වල් පැලෑටි ඉවත් කරන්න.'
  },
  // Tea diseases
  'Blister Blight': {
    en: 'Apply copper-based fungicides or Hexaconazole. Maintain proper shade (30-40%). Improve drainage in affected areas. Remove infected shoots during plucking. Avoid plucking during wet weather.',
    si: 'තඹ පදනම් වූ දිලීර නාශක හෝ Hexaconazole යොදන්න. නිසි සෙවන (30-40%) පවත්වන්න. බලපෑමට ලක්වූ ප්‍රදේශවල ජලාපවහනය වැඩි දියුණු කරන්න. නෙලීමේදී ආසාදිත අංකුර ඉවත් කරන්න. තෙත් කාලගුණයේදී නෙලීමෙන් වළකින්න.'
  },
  'Brown Blight': {
    en: 'Prune affected branches and burn them. Apply copper hydroxide fungicide. Avoid excess nitrogen fertilizer. Improve air circulation through proper pruning. Reduce shade during monsoon.',
    si: 'බලපෑමට ලක්වූ අතු කප්පාදු කර පුළුස්සන්න. කොපර් හයිඩ්‍රොක්සයිඩ් දිලීර නාශක යොදන්න. අධික නයිට්‍රජන් පොහොර වළක්වන්න. නිසි කප්පාදුව හරහා වාතාශ්‍රය වැඩි දියුණු කරන්න. මෝසම් කාලයේ සෙවන අඩු කරන්න.'
  },
  'Gray Blight': {
    en: 'Apply Mancozeb fungicide regularly. Correct nutrient deficiencies, especially potassium. Remove infected leaves. Maintain proper soil moisture. Avoid water stress.',
    si: 'Mancozeb දිලීර නාශක නිතිපතා යොදන්න. පෝෂක ඌනතා, විශේෂයෙන් පොටෑසියම් නිවැරදි කරන්න. ආසාදිත කොළ ඉවත් කරන්න. නිසි පස් තෙතමනය පවත්වන්න. ජල ආතතියෙන් වළකින්න.'
  },
  'Red Rust': {
    en: 'Improve light penetration through shade tree management. Apply copper fungicides. Remove heavily infected branches. Reduce shade tree density. Ensure good air circulation.',
    si: 'සෙවන ගස් කළමනාකරණය හරහා ආලෝක ප්‍රවේශය වැඩි දියුණු කරන්න. තඹ දිලීර නාශක යොදන්න. දැඩි ලෙස ආසාදිත අතු ඉවත් කරන්න. සෙවන ගස් ඝනත්වය අඩු කරන්න. හොඳ වාතාශ්‍රය සහතික කරන්න.'
  }
};

// Default recommendation for unknown diseases
const defaultRecommendation = {
  en: 'Consult your local agricultural officer immediately. Isolate affected plants to prevent spread. Take photos and collect samples for proper diagnosis.',
  si: 'වහාම ඔබගේ ප්‍රදේශීය කෘෂිකර්ම නිලධාරියා හමුවන්න. ව්‍යාප්තිය වැළැක්වීමට බලපෑමට ලක්වූ ශාක හුදකලා කරන්න. නිසි රෝග විනිශ්චය සඳහා ඡායාරූප ගෙන සාම්පල එකතු කරන්න.'
};

/**
 * Calculate severity level based on report count
 */
function calculateSeverity(reportCount) {
  const { severityLevels } = ALERT_CONFIG;
  
  if (reportCount >= severityLevels.critical.min) return 'critical';
  if (reportCount >= severityLevels.high.min) return 'high';
  if (reportCount >= severityLevels.medium.min) return 'medium';
  return 'low';
}

/**
 * Get recommendation for a disease
 */
function getRecommendation(disease) {
  return diseaseRecommendations[disease] || defaultRecommendation;
}

/**
 * Check for disease outbreaks and create/update alerts
 * This function aggregates disease reports and triggers alerts when threshold is reached
 */
async function checkDiseaseAlerts(gnDivision, dsDivision, district) {
  try {
    const timeWindow = new Date();
    timeWindow.setDate(timeWindow.getDate() - ALERT_CONFIG.timeWindowDays);

    // Aggregate reports by crop, disease, and location
    const aggregation = await DiseaseReport.aggregate([
      {
        $match: {
          gnDivision: gnDivision,
          createdAt: { $gte: timeWindow }
        }
      },
      {
        $group: {
          _id: {
            crop: '$crop',
            disease: '$disease',
            gnDivision: '$gnDivision',
            dsDivision: '$dsDivision',
            district: '$district'
          },
          reportCount: { $sum: 1 },
          avgConfidence: { $avg: '$confidence' },
          firstReport: { $min: '$createdAt' },
          lastReport: { $max: '$createdAt' },
          reporters: { $addToSet: '$farmerId' }
        }
      },
      {
        $match: {
          reportCount: { $gte: ALERT_CONFIG.reportThreshold }
        }
      }
    ]);

    const alerts = [];

    for (const outbreak of aggregation) {
      const { crop, disease, gnDivision: gn, dsDivision: ds, district: dist } = outbreak._id;
      const severity = calculateSeverity(outbreak.reportCount);
      const recommendation = getRecommendation(disease);

      // Check if alert already exists
      let existingAlert = await CommunityAlert.findOne({
        crop,
        disease,
        gnDivision: gn,
        status: { $in: ['active', 'monitoring'] }
      });

      if (existingAlert) {
        // Update existing alert
        existingAlert.reportCount = outbreak.reportCount;
        existingAlert.severity = severity;
        existingAlert.lastUpdatedAt = new Date();
        await existingAlert.save();
        alerts.push(existingAlert);
      } else {
        // Create new alert
        const newAlert = await CommunityAlert.create({
          crop,
          disease,
          district: dist,
          dsDivision: ds,
          gnDivision: gn,
          reportCount: outbreak.reportCount,
          severity,
          status: 'active',
          firstReportedAt: outbreak.firstReport,
          lastUpdatedAt: outbreak.lastReport,
          recommendation
        });

        alerts.push(newAlert);

        // Create notification for farmers in the area
        await createAlertNotification(newAlert);
      }
    }

    return alerts;
  } catch (error) {
    console.error('Error checking disease alerts:', error);
    throw error;
  }
}

/**
 * Create notifications for a new alert
 */
async function createAlertNotification(alert) {
  try {
    const severityText = {
      low: { en: 'Low', si: 'අඩු' },
      medium: { en: 'Medium', si: 'මධ්‍යම' },
      high: { en: 'High', si: 'ඉහළ' },
      critical: { en: 'Critical', si: 'බරපතල' }
    };

    const severityMap = {
      low: 'info',
      medium: 'warning',
      high: 'danger',
      critical: 'danger'
    };

    const notification = await Notification.create({
      targetDistrict: alert.district,
      targetDsDivision: alert.dsDivision,
      targetGnDivision: alert.gnDivision,
      type: 'disease_alert',
      title: {
        en: `⚠️ ${alert.disease} Alert - ${severityText[alert.severity].en} Severity`,
        si: `⚠️ ${alert.disease} අනතුරු ඇඟවීම - ${severityText[alert.severity].si} බරපතලකම`
      },
      message: {
        en: `${alert.reportCount} cases of ${alert.disease} detected in ${alert.crop} crops in your area (${alert.gnDivision}). ${alert.recommendation.en}`,
        si: `ඔබගේ ප්‍රදේශයේ (${alert.gnDivision}) ${alert.crop} බෝගවල ${alert.disease} රෝගී අවස්ථා ${alert.reportCount}ක් හඳුනාගෙන ඇත. ${alert.recommendation.si}`
      },
      alertId: alert._id,
      severity: severityMap[alert.severity]
    });

    return notification;
  } catch (error) {
    console.error('Error creating alert notification:', error);
    throw error;
  }
}

/**
 * Save a disease report and check for alerts
 */
async function saveDiseaseReport(reportData) {
  try {
    // Calculate initial trust score
    const trustScore = await calculateTrustScore(reportData);
    
    // Get coordinates for the location
    const coordinates = getLocationCoordinates(reportData.district, reportData.gnDivision);
    
    // Check AI confidence validity
    const aiConfidenceValid = reportData.confidence >= ALERT_CONFIG.confidenceThreshold;
    
    // Determine severity based on disease info
    const severity = determineSeverity(reportData.disease, reportData.confidence);
    
    // Create the disease report with enhanced data
    const report = await DiseaseReport.create({
      ...reportData,
      trustScore,
      coordinates,
      aiConfidenceValid,
      severity,
      verificationStatus: aiConfidenceValid && trustScore >= 50 ? 'pending' : 'flagged'
    });

    // Check for community confirmations (similar reports nearby)
    await checkCommunityConfirmations(report);

    // Check if this triggers any alerts (only for valid reports)
    let alerts = [];
    if (report.trustScore >= ALERT_CONFIG.trustScoreThreshold) {
      alerts = await checkDiseaseAlerts(
        reportData.gnDivision,
        reportData.dsDivision,
        reportData.district
      );
    }

    return { report, alerts };
  } catch (error) {
    console.error('Error saving disease report:', error);
    throw error;
  }
}

/**
 * Calculate trust score for a report based on multiple factors
 */
async function calculateTrustScore(reportData) {
  let score = 50; // Base score
  
  // Factor 1: AI Confidence (up to 25 points)
  if (reportData.confidence) {
    score += Math.min(reportData.confidence * 25, 25);
  }
  
  // Factor 2: Farmer reputation (up to 25 points)
  if (reportData.farmerId) {
    try {
      const farmer = await User.findById(reportData.farmerId);
      if (farmer && farmer.reputation_score) {
        score += (farmer.reputation_score / 5) * 25; // reputation_score is 1-5
      }
    } catch (e) {
      // Ignore if farmer not found
    }
  }
  
  // Factor 3: Healthy leaf reports get lower trust (likely testing)
  if (reportData.disease && reportData.disease.toLowerCase().includes('healthy')) {
    score -= 20;
  }
  
  // Factor 4: Very low confidence is suspicious
  if (reportData.confidence && reportData.confidence < 0.3) {
    score -= 15;
  }
  
  // Clamp between 0 and 100
  return Math.max(0, Math.min(100, score));
}

/**
 * Get coordinates for a location
 */
function getLocationCoordinates(district, gnDivision) {
  // Get district coordinates as base
  const districtCoords = districtCoordinates[district];
  if (!districtCoords) {
    return { lat: 7.8731, lng: 80.7718 }; // Sri Lanka center
  }
  
  // Add small random offset for GN division (simulating different GN locations)
  // In production, you'd have a proper GN coordinates database
  const hash = gnDivision ? gnDivision.split('').reduce((a, b) => a + b.charCodeAt(0), 0) : 0;
  const latOffset = ((hash % 100) - 50) / 1000; // +/- 0.05 degrees
  const lngOffset = (((hash * 7) % 100) - 50) / 1000;
  
  return {
    lat: districtCoords.lat + latOffset,
    lng: districtCoords.lng + lngOffset
  };
}

/**
 * Determine severity level based on disease type and confidence
 */
function determineSeverity(disease, confidence) {
  const highSeverityDiseases = ['Bacterial Leaf Blight', 'Leaf Blast', 'Sheath Blight', 'Rice Blast'];
  const mediumSeverityDiseases = ['Brown Spot', 'Leaf scald', 'Narrow Brown Leaf Spot', 'Rice Hispa'];
  
  if (!disease || disease.toLowerCase().includes('healthy')) {
    return 'none';
  }
  
  if (highSeverityDiseases.some(d => disease.toLowerCase().includes(d.toLowerCase()))) {
    return confidence > 0.7 ? 'high' : 'medium';
  }
  
  if (mediumSeverityDiseases.some(d => disease.toLowerCase().includes(d.toLowerCase()))) {
    return confidence > 0.7 ? 'medium' : 'low';
  }
  
  return 'medium';
}

/**
 * Check for similar reports nearby for community confirmation
 */
async function checkCommunityConfirmations(report) {
  try {
    const timeWindow = new Date();
    timeWindow.setDate(timeWindow.getDate() - 3); // Look at last 3 days
    
    // Find similar reports in same GN Division
    const similarReports = await DiseaseReport.find({
      _id: { $ne: report._id },
      disease: report.disease,
      gnDivision: report.gnDivision,
      createdAt: { $gte: timeWindow },
      farmerId: { $ne: report.farmerId } // Different farmers
    }).limit(10);
    
    if (similarReports.length > 0) {
      // Update confirmation count
      report.communityConfirmations = similarReports.length;
      
      // If multiple confirmations, increase trust and verify
      if (similarReports.length >= 2) {
        report.trustScore = Math.min(100, report.trustScore + 15);
        if (report.verificationStatus === 'pending') {
          report.verificationStatus = 'verified';
        }
      }
      
      // Add references
      report.confirmedBy = similarReports.slice(0, 5).map(r => ({
        reportId: r._id,
        farmerId: r.farmerId,
        confirmedAt: new Date()
      }));
      
      await report.save();
    }
    
    return report;
  } catch (error) {
    console.error('Error checking community confirmations:', error);
    return report;
  }
}

/**
 * Get heatmap data for disease visualization
 */
async function getHeatmapData(filters = {}) {
  try {
    // First try DiseaseReport with coordinates
    const query = {
      'coordinates.lat': { $exists: true, $ne: null },
      'coordinates.lng': { $exists: true, $ne: null }
    };
    
    // Apply filters
    if (filters.district) query.district = filters.district;
    if (filters.disease && filters.disease !== 'all') query.disease = filters.disease;
    if (filters.severity && filters.severity !== 'all') query.severity = filters.severity;
    
    // Time range filter
    const days = filters.days || 30;
    query.createdAt = { $gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000) };
    
    // Aggregate by location
    const heatmapData = await DiseaseReport.aggregate([
      { $match: query },
      {
        $group: {
          _id: {
            lat: { $round: ['$coordinates.lat', 2] }, // Round to 2 decimal places
            lng: { $round: ['$coordinates.lng', 2] }
          },
          count: { $sum: 1 },
          diseases: { $addToSet: '$disease' },
          avgSeverity: { $avg: { $switch: {
            branches: [
              { case: { $eq: ['$severity', 'critical'] }, then: 4 },
              { case: { $eq: ['$severity', 'high'] }, then: 3 },
              { case: { $eq: ['$severity', 'medium'] }, then: 2 },
              { case: { $eq: ['$severity', 'low'] }, then: 1 }
            ],
            default: 0
          }}},
          avgTrustScore: { $avg: '$trustScore' },
          gnDivisions: { $addToSet: '$gnDivision' },
          district: { $first: '$district' }
        }
      },
      { $sort: { count: -1 } }
    ]);
    
    // If no data from DiseaseReport, fallback to CommunityAlert
    if (heatmapData.length === 0) {
      const alertQuery = { status: { $in: ['active', 'monitoring'] } };
      if (filters.district) alertQuery.district = filters.district;
      if (filters.disease && filters.disease !== 'all') alertQuery.disease = filters.disease;
      if (filters.severity && filters.severity !== 'all') alertQuery.severity = filters.severity;
      
      const alerts = await CommunityAlert.find(alertQuery);
      
      // Convert alerts to heatmap points using district coordinates
      return alerts.map(alert => {
        const coords = districtCoordinates[alert.district] || { lat: 7.8731, lng: 80.7718 };
        // Add some random offset to prevent exact overlap
        const offset = (Math.random() - 0.5) * 0.2;
        return {
          lat: coords.lat + offset,
          lng: coords.lng + offset,
          intensity: Math.min(alert.reportCount * 0.2, 1),
          count: alert.reportCount,
          diseases: [alert.disease],
          severity: alert.severity || 'medium',
          district: alert.district,
          gnDivisions: [alert.gnDivision],
          trustScore: 75 // Default trust score for community alerts
        };
      });
    }
    
    // Transform to heatmap format
    return heatmapData.map(point => ({
      lat: point._id.lat,
      lng: point._id.lng,
      intensity: Math.min(point.count * 0.2, 1), // Normalize intensity
      count: point.count,
      diseases: point.diseases,
      severity: getSeverityLevel(point.avgSeverity),
      district: point.district,
      gnDivisions: point.gnDivisions,
      trustScore: Math.round(point.avgTrustScore || 50)
    }));
  } catch (error) {
    console.error('Error getting heatmap data:', error);
    throw error;
  }
}

/**
 * Get time-series outbreak data
 */
async function getTimeSeriesData(filters = {}) {
  try {
    const matchQuery = {
      trustScore: { $gte: ALERT_CONFIG.trustScoreThreshold }
    };
    
    if (filters.district) matchQuery.district = filters.district;
    if (filters.disease && filters.disease !== 'all') matchQuery.disease = filters.disease;
    if (filters.gnDivision) matchQuery.gnDivision = filters.gnDivision;
    
    const days = filters.days || 30;
    matchQuery.createdAt = { $gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000) };
    
    // Aggregate by date and disease
    const timeSeriesRaw = await DiseaseReport.aggregate([
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
      { $sort: { "_id.date": 1 } }
    ]);
    
    // Get unique diseases and dates
    const diseases = [...new Set(timeSeriesRaw.map(r => r._id.disease))];
    const dates = [...new Set(timeSeriesRaw.map(r => r._id.date))].sort();
    
    // Build series data for each disease
    const series = diseases.map(disease => {
      const diseaseData = timeSeriesRaw.filter(r => r._id.disease === disease);
      const data = dates.map(date => {
        const point = diseaseData.find(d => d._id.date === date);
        return {
          date,
          count: point ? point.count : 0,
          avgConfidence: point ? Math.round(point.avgConfidence * 100) : 0
        };
      });
      return {
        disease,
        data,
        total: diseaseData.reduce((sum, d) => sum + d.count, 0)
      };
    });
    
    // Calculate outbreak detection (rapid increase)
    const outbreakAlerts = detectOutbreaks(series);
    
    return {
      dates,
      series: series.sort((a, b) => b.total - a.total),
      outbreakAlerts,
      totalReports: timeSeriesRaw.reduce((sum, r) => sum + r.count, 0)
    };
  } catch (error) {
    console.error('Error getting time series data:', error);
    throw error;
  }
}

/**
 * Detect rapid outbreak patterns in time series
 */
function detectOutbreaks(series) {
  const alerts = [];
  
  for (const s of series) {
    if (s.data.length < 3) continue;
    
    // Check last 3 days for rapid increase
    const recent = s.data.slice(-3);
    const older = s.data.slice(-6, -3);
    
    const recentTotal = recent.reduce((sum, d) => sum + d.count, 0);
    const olderTotal = older.reduce((sum, d) => sum + d.count, 0);
    
    if (olderTotal > 0 && recentTotal > olderTotal * 2) {
      // More than 2x increase
      alerts.push({
        disease: s.disease,
        type: 'rapid_increase',
        message: `Rapid increase in ${s.disease} reports detected`,
        increase: Math.round((recentTotal / olderTotal - 1) * 100),
        recentCount: recentTotal
      });
    }
    
    // Check for new outbreak (no cases before, cases now)
    if (olderTotal === 0 && recentTotal >= 3) {
      alerts.push({
        disease: s.disease,
        type: 'new_outbreak',
        message: `New ${s.disease} outbreak detected`,
        recentCount: recentTotal
      });
    }
  }
  
  return alerts;
}

/**
 * Get severity level from numeric average
 */
function getSeverityLevel(avgSeverity) {
  if (avgSeverity >= 3.5) return 'critical';
  if (avgSeverity >= 2.5) return 'high';
  if (avgSeverity >= 1.5) return 'medium';
  if (avgSeverity >= 0.5) return 'low';
  return 'none';
}

/**
 * Get flagged reports for admin review
 */
async function getFlaggedReports(filters = {}) {
  try {
    const query = {
      $or: [
        { verificationStatus: 'flagged' },
        { trustScore: { $lt: ALERT_CONFIG.trustScoreThreshold } },
        { adminReviewed: false, verificationStatus: 'pending', trustScore: { $lt: 50 } }
      ]
    };
    
    if (filters.district) query.district = filters.district;
    
    const reports = await DiseaseReport.find(query)
      .sort({ createdAt: -1 })
      .limit(filters.limit || 50)
      .populate('farmerId', 'username reputation_score');
    
    return reports;
  } catch (error) {
    console.error('Error getting flagged reports:', error);
    throw error;
  }
}

/**
 * Admin review a flagged report
 */
async function reviewReport(reportId, reviewData) {
  try {
    const update = {
      adminReviewed: true,
      reviewedBy: reviewData.reviewedBy,
      reviewedAt: new Date(),
      verificationStatus: reviewData.status // 'verified', 'rejected', or 'flagged'
    };
    
    if (reviewData.flaggedReason) {
      update.flaggedReason = reviewData.flaggedReason;
    }
    
    // Adjust trust score based on review
    const report = await DiseaseReport.findById(reportId);
    if (report) {
      if (reviewData.status === 'verified') {
        update.trustScore = Math.min(100, report.trustScore + 20);
      } else if (reviewData.status === 'rejected') {
        update.trustScore = Math.max(0, report.trustScore - 30);
        
        // Penalize farmer reputation for rejected reports
        if (report.farmerId) {
          await penalizeFarmerReputation(report.farmerId);
        }
      }
    }
    
    const updatedReport = await DiseaseReport.findByIdAndUpdate(
      reportId,
      update,
      { new: true }
    );
    
    return updatedReport;
  } catch (error) {
    console.error('Error reviewing report:', error);
    throw error;
  }
}

/**
 * Penalize farmer reputation for false reports
 */
async function penalizeFarmerReputation(farmerId) {
  try {
    const farmer = await User.findById(farmerId);
    if (farmer) {
      // Reduce reputation score
      farmer.reputation_score = Math.max(1, (farmer.reputation_score || 3) - 0.5);
      
      // Track false report count
      farmer.false_report_count = (farmer.false_report_count || 0) + 1;
      
      // If too many false reports, flag the account
      if (farmer.false_report_count >= 3) {
        farmer.account_flagged = true;
      }
      
      await farmer.save();
    }
  } catch (error) {
    console.error('Error penalizing farmer reputation:', error);
  }
}

/**
 * Get active alerts for a location
 * Shows alerts that are relevant to the user's specific area:
 * - Alerts from the same GN Division (most relevant)
 * - Alerts from the same DS Division (nearby areas)
 * - Critical alerts from the same district (important regional alerts)
 */
async function getActiveAlerts(gnDivision, dsDivision, district) {
  try {
    // Build query based on specificity of location
    let query = {
      status: { $in: ['active', 'monitoring'] }
    };

    if (gnDivision && dsDivision) {
      // Show alerts from same GN Division or same DS Division
      // District-wide alerts only if severity is critical/high
      query.$or = [
        { gnDivision: gnDivision }, // Same village
        { dsDivision: dsDivision, gnDivision: { $exists: true } }, // Same DS area
        { district: district, severity: { $in: ['critical', 'high'] } } // Critical district alerts
      ];
    } else if (dsDivision) {
      // Only DS Division provided - show DS level and critical district alerts
      query.$or = [
        { dsDivision: dsDivision },
        { district: district, severity: { $in: ['critical', 'high'] } }
      ];
    } else if (district) {
      // Only district provided - show only critical/high alerts
      query.district = district;
      query.severity = { $in: ['critical', 'high'] };
    }

    const alerts = await CommunityAlert.find(query)
      .sort({ severity: -1, lastUpdatedAt: -1 });

    return alerts;
  } catch (error) {
    console.error('Error getting active alerts:', error);
    throw error;
  }
}

/**
 * Get notifications for a user's location
 */
async function getNotifications(gnDivision, limit = 10) {
  try {
    const notifications = await Notification.find({
      targetGnDivision: gnDivision,
      expiresAt: { $gt: new Date() }
    })
    .sort({ createdAt: -1 })
    .limit(limit);

    return notifications;
  } catch (error) {
    console.error('Error getting notifications:', error);
    throw error;
  }
}

/**
 * Mark notification as read
 */
async function markNotificationRead(notificationId) {
  try {
    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { read: true },
      { new: true }
    );
    return notification;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
}

/**
 * Resolve an alert (mark as resolved)
 */
async function resolveAlert(alertId) {
  try {
    const alert = await CommunityAlert.findByIdAndUpdate(
      alertId,
      { status: 'resolved', lastUpdatedAt: new Date() },
      { new: true }
    );
    return alert;
  } catch (error) {
    console.error('Error resolving alert:', error);
    throw error;
  }
}

module.exports = {
  checkDiseaseAlerts,
  saveDiseaseReport,
  getActiveAlerts,
  getNotifications,
  markNotificationRead,
  resolveAlert,
  createAlertNotification,
  getHeatmapData,
  getTimeSeriesData,
  getFlaggedReports,
  reviewReport,
  calculateTrustScore,
  ALERT_CONFIG
};
