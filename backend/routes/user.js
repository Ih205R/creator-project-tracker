const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/auth');
const {
  getProfile,
  updateProfile,
  updatePushToken,
  removePushToken,
  getUserStats,
  updateBranding,
  getBranding,
  getAICredits,
  useAICredit,
  addAICredits
} = require('../controllers/userController');

router.use(authenticateUser);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.post('/push-token', updatePushToken);
router.delete('/push-token', removePushToken);
router.get('/stats', getUserStats);
router.get('/branding', getBranding);
router.put('/branding', updateBranding);
router.get('/ai-credits', getAICredits);
router.post('/use-ai-credit', useAICredit);
router.post('/add-ai-credits', addAICredits);

module.exports = router;
