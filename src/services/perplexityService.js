const axios = require('axios');

class PerplexityService {
  constructor() {
    this.apiKey = process.env.PERPLEXITY_API_KEY;
    this.baseURL = 'https://api.perplexity.ai';
  }

  async analyzeClaim(claim) {
    try {
      const response = await axios.post(
        `${this.baseURL}/analyze`,
        {
          query: claim.content,
          context: "Analyze this health claim for scientific accuracy"
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Process the response to match UI requirements
      return {
        verificationStatus: this.determineVerificationStatus(response.data.confidence),
        trustScore: Math.round(response.data.confidence * 100),
        aiAnalysis: response.data.explanation,
        sourceLinks: response.data.references || [],
        category: this.determineCategory(claim.content),
        dateVerified: new Date()
      };
    } catch (error) {
      throw new Error('Failed to analyze claim: ' + error.message);
    }
  }

  determineVerificationStatus(confidence) {
    if (confidence >= 0.8) return 'Verified';
    if (confidence >= 0.5) return 'Questionable';
    return 'Debunked';
  }

  determineCategory(content) {
    const categories = [
      'Sleep', 'Performance', 'Hormones', 'Nutrition',
      'Exercise', 'Stress', 'Cognition', 'Motivation',
      'Recovery', 'Mental Health'
    ];
    
    // Simple keyword matching - could be enhanced with AI
    return categories.find(category => 
      content.toLowerCase().includes(category.toLowerCase())
    ) || 'General';
  }

  async searchScientificJournals(claim) {
    try {
      const response = await axios.post(
        `${this.baseURL}/search`,
        {
          query: claim,
          journals: [
            'PubMed Central',
            'Nature',
            'Science',
            'Cell',
            'The Lancet',
            'JAMA Network',
            'New England Journal of Medicine'
          ]
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      return response.data.results;
    } catch (error) {
      throw new Error('Failed to search journals: ' + error.message);
    }
  }

  async getInfluencerMetrics(influencerName) {
    try {
      const response = await axios.post(
        `${this.baseURL}/metrics`,
        { influencerName },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        followers: response.data.followers,
        yearlyRevenue: response.data.estimatedEarnings,
        trustScore: response.data.trustScore,
        verifiedClaims: response.data.verifiedClaims
      };
    } catch (error) {
      throw new Error('Failed to get influencer metrics: ' + error.message);
    }
  }
}

module.exports = new PerplexityService();
