const Claim = require('../models/Claim');

// Get all claims with filtering and sorting
exports.getClaims = async (req, res) => {
  try {
    const {
      category,
      verificationStatus,
      sortBy = 'date',
      search,
      influencerId
    } = req.query;

    const filter = {};
    
    if (category && category !== 'All Categories') {
      filter.category = category;
    }
    
    if (verificationStatus && verificationStatus !== 'All Statuses') {
      filter.verificationStatus = verificationStatus;
    }
    
    if (influencerId) {
      filter.influencerId = influencerId;
    }
    
    if (search) {
      filter.content = { $regex: search, $options: 'i' };
    }

    const sortOptions = {};
    sortOptions[sortBy] = -1;

    const claims = await Claim.find(filter)
      .sort(sortOptions)
      .populate('influencerId', 'name category profileImage');

    res.json(claims);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get categories (based on UI showing Sleep, Performance, etc.)
exports.getCategories = async (req, res) => {
  try {
    const categories = [
      'Sleep', 'Performance', 'Hormones', 'Nutrition',
      'Exercise', 'Stress', 'Cognition', 'Motivation',
      'Recovery', 'Mental Health'
    ];
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get claims by influencer
exports.getClaimsByInfluencer = async (req, res) => {
  try {
    const claims = await Claim.find({ 
      influencerId: req.params.influencerId 
    }).sort({ dateVerified: -1 });
    res.json(claims);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single claim
exports.getClaimById = async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id)
      .populate('influencerId', 'name category');
    if (!claim) {
      return res.status(404).json({ message: 'Claim not found' });
    }
    res.json(claim);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create claim
exports.createClaim = async (req, res) => {
  try {
    const claim = new Claim({
      ...req.body,
      dateVerified: new Date(),
      trustScore: Math.floor(Math.random() * (100 - 70) + 70) // Mock trust score
    });
    const savedClaim = await claim.save();
    res.status(201).json(savedClaim);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update claim
exports.updateClaim = async (req, res) => {
  try {
    const updatedClaim = await Claim.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedClaim);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete claim
exports.deleteClaim = async (req, res) => {
  try {
    await Claim.findByIdAndDelete(req.params.id);
    res.json({ message: 'Claim deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get AI analysis for a claim
exports.getClaimAnalysis = async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id);
    const analysis = {
      explanation: claim.aiAnalysis || "Analysis pending",
      trustScore: claim.trustScore,
      sourceLinks: claim.sourceLinks,
      dateVerified: claim.dateVerified
    };
    res.json(analysis);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get claim statistics
exports.getClaimStats = async (req, res) => {
  try {
    const stats = await Claim.aggregate([
      {
        $group: {
          _id: null,
          totalClaims: { $sum: 1 },
          verifiedClaims: {
            $sum: { $cond: [{ $eq: ["$verificationStatus", "Verified"] }, 1, 0] }
          },
          averageTrustScore: { $avg: "$trustScore" }
        }
      }
    ]);

    res.json({
      claimsVerified: stats[0].verifiedClaims,
      averageTrustScore: Math.round(stats[0].averageTrustScore * 10) / 10
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
