const Claim = require('../models/Claim');
const perplexityService = require('../services/perplexityService');

exports.configureResearch = async (req, res) => {
  try {
    const {
      influencerName,
      timeRange,
      claimsCount,
      includeRevenue,
      verifyWithJournals,
      selectedJournals,
      notes
    } = req.body;

    // Store research configuration and initiate analysis
    const researchConfig = {
      influencerName,
      timeRange,
      claimsCount,
      includeRevenue,
      verifyWithJournals,
      selectedJournals,
      notes,
      status: 'pending'
    };

    // Start analysis process
    // This would typically be handled by a queue in production
    res.status(200).json({ 
      message: 'Research configuration saved',
      config: researchConfig 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getJournals = async (req, res) => {
  // Based on the UI, return predefined list of scientific journals
  const journals = [
    'PubMed Central',
    'Nature',
    'Science',
    'Cell',
    'The Lancet',
    'JAMA Network',
    'New England Journal of Medicine'
  ];
  res.json(journals);
};

exports.analyzeClaims = async (req, res) => {
  try {
    const { influencerId, content } = req.body;
    const analysis = await perplexityService.analyzeClaim(content);
    
    const claim = new Claim({
      influencerId,
      content,
      category: analysis.category,
      verificationStatus: analysis.status,
      trustScore: analysis.trustScore,
      sourceLinks: analysis.sources,
      aiAnalysis: analysis.explanation
    });

    await claim.save();
    res.status(201).json(claim);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getResearchStats = async (req, res) => {
  try {
    const stats = {
      activeInfluencers: 1234,
      claimsVerified: 25431,
      averageTrustScore: 85.7
    };
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
