const User = require('../models/User');
const Feedback = require('../models/Feedback');
const Listing = require('../models/Listing');

// Configuration for reputation calculation
const REPUTATION_CONFIG = {
  weights: {
    sales: 0.4,      // 40% weight for successful sales
    verified: 0.3,   // 30% weight for verified listings
    feedback: 0.3    // 30% weight for buyer feedback
  },
  normalization: {
    salesMax: 10,    // Max sales for full score (adjustable)
    verifiedMax: 10  // Max verified listings for full score
  },
  minScore: 1.0,
  maxScore: 5.0,
  defaultScore: 3.0  // New farmers start at neutral
};

/**
 * Calculate normalized score (0-5) based on count and max
 */
function normalizeScore(count, max) {
  return Math.min(count / max, 1) * 5;
}

/**
 * Calculate average rating from feedbacks
 */
function calculateAverageRating(feedbacks) {
  if (!feedbacks || feedbacks.length === 0) {
    return REPUTATION_CONFIG.defaultScore; // Default rating for new farmers
  }
  const sum = feedbacks.reduce((acc, fb) => acc + fb.rating, 0);
  return sum / feedbacks.length;
}

/**
 * Calculate reputation score for a farmer
 * @param {string} farmerId - MongoDB ObjectId of the farmer
 * @returns {object} - Reputation details including score and breakdown
 */
async function calculateReputation(farmerId) {
  try {
    const farmer = await User.findById(farmerId);
    if (!farmer) {
      throw new Error('Farmer not found');
    }

    // Get all feedbacks for this farmer
    const feedbacks = await Feedback.find({ farmer_id: farmerId });

    // Get listing stats
    const totalSales = await Listing.countDocuments({ 
      farmer_id: farmerId, 
      status: 'sold' 
    });
    
    const verifiedListings = await Listing.countDocuments({ 
      farmer_id: farmerId, 
      verified: true 
    });

    // Calculate individual scores
    const salesScore = normalizeScore(totalSales, REPUTATION_CONFIG.normalization.salesMax);
    const verifiedScore = normalizeScore(verifiedListings, REPUTATION_CONFIG.normalization.verifiedMax);
    const feedbackScore = calculateAverageRating(feedbacks);

    // Calculate weighted final score
    const { weights } = REPUTATION_CONFIG;
    let finalScore = 
      (salesScore * weights.sales) +
      (verifiedScore * weights.verified) +
      (feedbackScore * weights.feedback);

    // Clamp between min and max
    finalScore = Math.max(REPUTATION_CONFIG.minScore, Math.min(finalScore, REPUTATION_CONFIG.maxScore));

    // Update farmer's reputation data
    farmer.reputation_score = Math.round(finalScore * 10) / 10; // Round to 1 decimal
    farmer.total_sales = totalSales;
    farmer.verified_listings = verifiedListings;
    farmer.total_feedbacks = feedbacks.length;
    await farmer.save();

    return {
      farmerId: farmer._id,
      username: farmer.username,
      reputation_score: farmer.reputation_score,
      breakdown: {
        sales: {
          count: totalSales,
          score: Math.round(salesScore * 10) / 10,
          weight: `${weights.sales * 100}%`,
          maxForFullScore: REPUTATION_CONFIG.normalization.salesMax
        },
        verified: {
          count: verifiedListings,
          score: Math.round(verifiedScore * 10) / 10,
          weight: `${weights.verified * 100}%`,
          maxForFullScore: REPUTATION_CONFIG.normalization.verifiedMax
        },
        feedback: {
          count: feedbacks.length,
          averageRating: Math.round(feedbackScore * 10) / 10,
          weight: `${weights.feedback * 100}%`
        }
      },
      is_verified_farmer: farmer.is_verified_farmer
    };
  } catch (error) {
    console.error('Error calculating reputation:', error);
    throw error;
  }
}

/**
 * Get reputation breakdown for display
 */
async function getReputationBreakdown(farmerId) {
  return await calculateReputation(farmerId);
}

/**
 * Update reputation when listing is sold
 */
async function onListingSold(listingId) {
  try {
    const listing = await Listing.findById(listingId);
    if (!listing) {
      throw new Error('Listing not found');
    }

    // Mark as sold
    listing.status = 'sold';
    listing.sold_at = new Date();
    await listing.save();

    // Recalculate farmer's reputation
    if (listing.farmer_id) {
      await calculateReputation(listing.farmer_id);
    }

    return listing;
  } catch (error) {
    console.error('Error processing listing sale:', error);
    throw error;
  }
}

/**
 * Update reputation when listing is verified
 */
async function onListingVerified(listingId, adminUsername) {
  try {
    const listing = await Listing.findById(listingId);
    if (!listing) {
      throw new Error('Listing not found');
    }

    // Mark as verified
    listing.verified = true;
    listing.verified_at = new Date();
    listing.verified_by = adminUsername;
    await listing.save();

    // Recalculate farmer's reputation
    if (listing.farmer_id) {
      await calculateReputation(listing.farmer_id);
    }

    return listing;
  } catch (error) {
    console.error('Error verifying listing:', error);
    throw error;
  }
}

/**
 * Submit buyer feedback and update reputation
 */
async function submitFeedback(feedbackData) {
  try {
    const { listing_id, farmer_id, buyer_name, buyer_phone, rating, comment } = feedbackData;

    // Check if feedback already exists for this listing from this buyer (only if buyer_id is provided)
    let existingFeedback = null;
    if (feedbackData.buyer_id) {
      existingFeedback = await Feedback.findOne({
        listing_id,
        buyer_id: feedbackData.buyer_id
      });
    }

    if (existingFeedback) {
      throw new Error('You have already submitted feedback for this listing');
    }

    // Verify the listing exists and is sold
    const listing = await Listing.findById(listing_id);
    if (!listing) {
      throw new Error('Listing not found');
    }

    // Prevent farmers from rating their own listings
    if (feedbackData.buyer_id && listing.farmer_id && String(listing.farmer_id) === String(feedbackData.buyer_id)) {
      throw new Error('You cannot rate your own listing');
    }

    // Create feedback
    const feedback = await Feedback.create({
      listing_id,
      farmer_id: farmer_id || listing.farmer_id,
      buyer_name,
      buyer_phone,
      rating,
      comment,
      is_verified_purchase: listing.status === 'sold'
    });

    // Recalculate farmer's reputation
    const farmerId = farmer_id || listing.farmer_id;
    if (farmerId) {
      await calculateReputation(farmerId);
    }

    return feedback;
  } catch (error) {
    console.error('Error submitting feedback:', error);
    throw error;
  }
}

/**
 * Get all feedbacks for a farmer
 */
async function getFarmerFeedbacks(farmerId, limit = 10) {
  try {
    const feedbacks = await Feedback.find({ farmer_id: farmerId })
      .populate('listing_id', 'cropType quantity price')
      .sort({ created_at: -1 })
      .limit(limit);
    
    return feedbacks;
  } catch (error) {
    console.error('Error getting farmer feedbacks:', error);
    throw error;
  }
}

/**
 * Get top rated farmers
 */
async function getTopFarmers(limit = 10) {
  try {
    const farmers = await User.find({ total_sales: { $gt: 0 } })
      .select('username district gnDivision reputation_score total_sales verified_listings total_feedbacks is_verified_farmer')
      .sort({ reputation_score: -1 })
      .limit(limit);
    
    return farmers;
  } catch (error) {
    console.error('Error getting top farmers:', error);
    throw error;
  }
}

module.exports = {
  calculateReputation,
  getReputationBreakdown,
  onListingSold,
  onListingVerified,
  submitFeedback,
  getFarmerFeedbacks,
  getTopFarmers,
  REPUTATION_CONFIG
};
