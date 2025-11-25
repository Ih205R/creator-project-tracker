const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/auth');
const {
  getBrandDeals,
  createBrandDeal,
  getBrandDeal,
  updateBrandDeal,
  deleteBrandDeal,
  getBrandDealStats
} = require('../controllers/brandDealController');

router.use(authenticateUser);

router.get('/', getBrandDeals);
router.post('/', createBrandDeal);
router.get('/stats', getBrandDealStats);
router.get('/:id', getBrandDeal);
router.put('/:id', updateBrandDeal);
router.delete('/:id', deleteBrandDeal);

module.exports = router;
