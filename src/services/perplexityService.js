const axios = require('axios');

class PerplexityService {
  constructor() {
    this.apiKey = process.env.PERPLEXITY_API_KEY;
    this.baseURL = 'https://api.perplexity.ai';
  }

  async analyzeClaim(claim) {
    try {
      // Implementation for Perplexity API integration
      // This is a placeholder - you'll need to implement based on actual API
      const response = await axios.post(
        `${this.baseURL}/analyze`,
        { claim },
        { headers: { Authorization: `Bearer ${this.apiKey}` } }
      );
      return response.data;
    } catch (error) {
      throw new Error('Failed to analyze claim: ' + error.message);
    }
  }
}

module.exports = new PerplexityService();
