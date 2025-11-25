const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/auth');
const {
  createCheckoutSession,
  createPortalSession,
  getSubscriptionStatus,
  cancelSubscription,
  requestRefund,
  handleWebhook,
  getSessionData,
  purchaseCredits
} = require('../controllers/stripeController');

// Webhook must use raw body
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

router.use(authenticateUser);

router.post('/create-checkout-session', createCheckoutSession);
router.post('/create-portal-session', createPortalSession);
router.get('/subscription-status', getSubscriptionStatus);
router.get('/session/:sessionId', getSessionData);
router.post('/cancel-subscription', cancelSubscription);
router.post('/request-refund', requestRefund);
router.post('/purchase-credits', purchaseCredits);

module.exports = router;
