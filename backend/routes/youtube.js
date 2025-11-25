const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/auth');
const youtubeController = require('../controllers/youtubeController');
const aiSummaryController = require('../controllers/aiSummaryController');

// Get YouTube channel statistics (public)
router.get('/channel/:channelId', authenticateUser, youtubeController.getChannelStats);

// Get channel videos (public)
router.get('/channel/:channelId/videos', authenticateUser, youtubeController.getChannelVideos);

// Get channel analytics (public - limited data)
router.get('/channel/:channelId/analytics', authenticateUser, youtubeController.getChannelAnalytics);

// Search for channels (public)
router.get('/search', authenticateUser, youtubeController.searchChannel);

// Connect YouTube channel to user (public mode)
router.post('/connect', authenticateUser, youtubeController.connectChannel);

// Disconnect YouTube channel
router.post('/disconnect', authenticateUser, youtubeController.disconnectChannel);

// OAuth2 flow
router.post('/oauth/init', authenticateUser, youtubeController.initOAuth);
router.get('/oauth/callback', youtubeController.handleOAuthCallback);

// Get authenticated analytics (OAuth required - full data)
router.get('/analytics/authenticated', authenticateUser, youtubeController.getAuthenticatedAnalytics);

// AI Summary (costs 3 credits)
router.post('/ai-summary/generate', authenticateUser, aiSummaryController.generateChannelSummary);

module.exports = router;
