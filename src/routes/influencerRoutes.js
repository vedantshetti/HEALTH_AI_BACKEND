const express = require('express');
const router = express.Router();
const influencerController = require('../controllers/influencerController');

router.get('/', influencerController.getInfluencers);
router.get('/:id', influencerController.getInfluencerById);
router.post('/', influencerController.createInfluencer);
router.put('/:id', influencerController.updateInfluencer);
router.delete('/:id', influencerController.deleteInfluencer);

module.exports = router;
