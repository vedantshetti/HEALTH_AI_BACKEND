const express = require('express');
const router = express.Router();
const researchController = require('../controllers/researchController');

router.post('/configure', researchController.configureResearch);
router.get('/journals', researchController.getJournals);
router.post('/analyze', researchController.analyzeClaims);
router.get('/stats', researchController.getResearchStats);

module.exports = router;
