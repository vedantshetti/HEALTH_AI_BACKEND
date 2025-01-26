const Influencer = require('../models/Influencer');

exports.getInfluencers = async (req, res) => {
  try {
    const filters = {};
    if (req.query.category) filters.category = req.query.category;
    
    const influencers = await Influencer.find(filters)
      .sort({ trustScore: -1 });
    res.json(influencers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getInfluencerById = async (req, res) => {
  try {
    const influencer = await Influencer.findById(req.params.id);
    if (!influencer) {
      return res.status(404).json({ message: 'Influencer not found' });
    }
    res.json(influencer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createInfluencer = async (req, res) => {
  try {
    const influencer = new Influencer(req.body);
    const savedInfluencer = await influencer.save();
    res.status(201).json(savedInfluencer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateInfluencer = async (req, res) => {
  try {
    const updatedInfluencer = await Influencer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedInfluencer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteInfluencer = async (req, res) => {
  try {
    await Influencer.findByIdAndDelete(req.params.id);
    res.json({ message: 'Influencer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
