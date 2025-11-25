const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/auth');
const {
  getBrandDeals,
  createBrandDeal,
  getBrandDeal,
  updateBrandDeal,
  deleteBrandDeal,
  updateDealStage,
  getBrandDealStats,
  // Deliverables
  addDeliverable,
  updateDeliverable,
  deleteDeliverable,
  // Documents
  addDocument,
  getDocuments,
  deleteDocument,
  // Payments
  addPayment,
  updatePayment,
  // Communications
  addCommunication,
  getCommunications,
  // AI Insights
  addAIInsight
} = require('../controllers/brandDealController');

router.use(authenticateUser);

// Main CRUD routes
router.get('/', getBrandDeals);
router.post('/', createBrandDeal);
router.get('/stats', getBrandDealStats);
router.get('/:id', getBrandDeal);
router.put('/:id', updateBrandDeal);
router.delete('/:id', deleteBrandDeal);
router.put('/:id/stage', updateDealStage);

// Deliverables routes
router.post('/:id/deliverables', addDeliverable);
router.put('/:id/deliverables/:deliverableId', updateDeliverable);
router.delete('/:id/deliverables/:deliverableId', deleteDeliverable);

// Documents routes
router.get('/:id/documents', getDocuments);
router.post('/:id/documents', addDocument);
router.delete('/:id/documents/:documentId', deleteDocument);

// Payments routes
router.post('/:id/payments', addPayment);
router.put('/:id/payments/:paymentId', updatePayment);

// Communications routes
router.get('/:id/communications', getCommunications);
router.post('/:id/communications', addCommunication);

// AI Insights routes
router.post('/:id/insights', addAIInsight);

module.exports = router;
