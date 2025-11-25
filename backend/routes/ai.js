const express = require('express');
const router = express.Router();
const { authenticateUser, checkProUser } = require('../middleware/auth');
const {
  generateCaptions,
  generateCaption,
  generateTitles,
  generateScript,
  generateAllSuggestions,
  optimizeContent,
  analyzeTrends,
  seoRecommendations
} = require('../controllers/aiController');
const { generateChannelSummary } = require('../controllers/aiSummaryController');

router.use(authenticateUser);
router.use(checkProUser);

router.post('/captions', generateCaptions);
router.post('/generate-caption', generateCaption);
router.post('/generate-script', generateScript);
router.post('/titles', generateTitles);
router.post('/script', generateScript);
router.post('/all', generateAllSuggestions);
router.post('/optimize-content', optimizeContent);
router.post('/analyze-trends', analyzeTrends);
router.post('/seo-recommendations', seoRecommendations);
router.post('/channel-summary', generateChannelSummary);

module.exports = router;
