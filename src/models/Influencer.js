const mongoose = require('mongoose');

const influencerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  trustScore: { type: Number, default: 0 },
  followers: { type: Number, default: 0 },
  verifiedClaims: { type: Number, default: 0 },
  profileImage: { type: String },
  yearlyRevenue: { type: Number },
  specialties: [String],
  bio: { type: String },
  products: { type: Number, default: 0 },
  // Additional fields from screenshots
  trend: { type: String, enum: ['up', 'down'], default: 'up' },
  rank: { type: Number }
}, {
  timestamps: true
});

module.exports = mongoose.model('Influencer', influencerSchema);
