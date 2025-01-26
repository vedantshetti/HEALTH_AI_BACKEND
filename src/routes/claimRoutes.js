const express = require('express');
const router = express.Router();
const claimController = require('../controllers/claimController');

// Get all claims with filters and sorting
router.get('/', claimController.getClaims);

// Get claims by influencer ID
router.get('/influencer/:influencerId', claimController.getClaimsByInfluencer);

// Get claim categories
router.get('/categories', claimController.getCategories);

// Get claim by ID
router.get('/:id', claimController.getClaimById);

// Create new claim
router.post('/', claimController.createClaim);

// Update claim
router.put('/:id', claimController.updateClaim);

// Delete claim
router.delete('/:id', claimController.deleteClaim);

// Get AI analysis for a claim
router.get('/:id/analysis', claimController.getClaimAnalysis);

// Get claim statistics
router.get('/stats/overview', claimController.getClaimStats);

module.exports = router;
