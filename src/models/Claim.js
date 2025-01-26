const mongoose = require('mongoose');

const claimSchema = new mongoose.Schema({
  influencerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Influencer', required: true },
  content: { type: String, required: true },
  category: { type: String, required: true },
  verificationStatus: { 
    type: String, 
    enum: ['Verified', 'Questionable', 'Debunked'],
    required: true 
  },
  trustScore: { type: Number, required: true },
  sourceLinks: [String],
  dateVerified: { type: Date, default: Date.now },
  // Additional fields from screenshots
  aiAnalysis: { type: String },
  researchNotes: { type: String },
  viewSource: { type: String }
}, {
  timestamps: true
});

module.exports = mongoose.model('Claim', claimSchema);
