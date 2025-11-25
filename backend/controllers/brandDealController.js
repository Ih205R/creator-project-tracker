const BrandDeal = require('../models/BrandDeal');
const { checkFreeUserLimits } = require('../middleware/auth');

// Get all brand deals
exports.getBrandDeals = async (req, res) => {
  try {
    const brandDeals = await BrandDeal.find({ userId: req.user._id })
      .populate('relatedProjects')
      .sort({ createdAt: -1 });
    
    res.json({ brandDeals });
  } catch (error) {
    console.error('Get brand deals error:', error);
    res.status(500).json({ error: 'Failed to fetch brand deals' });
  }
};

// Create a new brand deal
exports.createBrandDeal = async (req, res) => {
  try {
    // Check free user limits
    if (req.user.role === 'free_user') {
      await checkFreeUserLimits(
        BrandDeal,
        req.user._id,
        1,
        'Free users are limited to 1 brand deal. Upgrade to Pro for unlimited brand deals.'
      );
    }

    const brandDeal = await BrandDeal.create({
      ...req.body,
      userId: req.user._id
    });

    res.status(201).json({ brandDeal });
  } catch (error) {
    console.error('Create brand deal error:', error);
    res.status(400).json({ error: error.message || 'Failed to create brand deal' });
  }
};

// Get a single brand deal
exports.getBrandDeal = async (req, res) => {
  try {
    const brandDeal = await BrandDeal.findOne({
      _id: req.params.id,
      userId: req.user._id
    }).populate('relatedProjects');

    if (!brandDeal) {
      return res.status(404).json({ error: 'Brand deal not found' });
    }

    res.json({ brandDeal });
  } catch (error) {
    console.error('Get brand deal error:', error);
    res.status(500).json({ error: 'Failed to fetch brand deal' });
  }
};

// Update a brand deal
exports.updateBrandDeal = async (req, res) => {
  try {
    const brandDeal = await BrandDeal.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { $set: req.body },
      { new: true, runValidators: true }
    ).populate('relatedProjects');

    if (!brandDeal) {
      return res.status(404).json({ error: 'Brand deal not found' });
    }

    res.json({ brandDeal });
  } catch (error) {
    console.error('Update brand deal error:', error);
    res.status(400).json({ error: 'Failed to update brand deal' });
  }
};

// Delete a brand deal
exports.deleteBrandDeal = async (req, res) => {
  try {
    const brandDeal = await BrandDeal.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!brandDeal) {
      return res.status(404).json({ error: 'Brand deal not found' });
    }

    res.json({ message: 'Brand deal deleted successfully' });
  } catch (error) {
    console.error('Delete brand deal error:', error);
    res.status(500).json({ error: 'Failed to delete brand deal' });
  }
};

// Get brand deal statistics
exports.getBrandDealStats = async (req, res) => {
  try {
    const stats = await BrandDeal.aggregate([
      { $match: { userId: req.user._id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' }
        }
      }
    ]);

    const totalRevenue = await BrandDeal.aggregate([
      { $match: { userId: req.user._id, status: 'Paid' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    res.json({ 
      stats,
      totalRevenue: totalRevenue[0]?.total || 0
    });
  } catch (error) {
    console.error('Get brand deal stats error:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
};
