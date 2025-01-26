const axios = require('axios');

class PerplexityService {
  constructor() {
    this.apiKey = process.env.PERPLEXITY_API_KEY;
    this.baseURL = 'https://api.perplexity.ai';
  }

  async analyzeClaim(claim) {
    try {
        console.log('Analyzing claim:', claim);
        console.log('API Key:', this.apiKey ? 'Present' : 'Missing');
        console.log('Request URL:', `${this.baseURL}/analyze`);
        
        // Mock response since Perplexity API isn't accessible
        // This matches the UI screenshot's data format
        return {
            verificationStatus: 'Verified',
            trustScore: 92,
            aiAnalysis: "Multiple studies confirm morning light exposure affects cortisol rhythms. Timing window supported by research.",
            sourceLinks: ['https://pubmed.gov/example1', 'https://nature.com/example2'],
            category: 'Sleep',
            dateVerified: new Date()
        };

        /* Comment out actual API call for now
        const response = await axios.post(
            `${this.baseURL}/analyze`,
            {
                query: claim,
                context: "Analyze this health claim for scientific accuracy"
            },
            {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        */
    } catch (error) {
        console.error('Analysis error:', error);
        throw new Error('Failed to analyze claim: ' + error.message);
    }
}


  determineVerificationStatus(confidence) {
    if (confidence >= 0.8) return 'Verified';
    if (confidence >= 0.5) return 'Questionable';
    return 'Debunked';
  }
  
  determineCategory(content) {
    if (!content || typeof content !== 'string') {
        console.log('Invalid content for category determination:', content);
        return 'General';
    }
    
    const categories = [
        'Sleep', 'Performance', 'Hormones', 'Nutrition',
        'Exercise', 'Stress', 'Cognition', 'Motivation',
        'Recovery', 'Mental Health'
    ];
    
    const match = categories.find(category => 
        content.toLowerCase().includes(category.toLowerCase())
    );
    console.log('Determined category:', match || 'General');
    return match || 'General';
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
