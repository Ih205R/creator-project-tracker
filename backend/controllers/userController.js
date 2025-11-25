const User = require('../models/User');

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    console.log('📡 Backend: Get profile request for user:', {
      uid: req.user.uid,
      email: req.user.email,
      role: req.user.role,
      subscriptionStatus: req.user.subscriptionStatus,
      subscriptionPlan: req.user.subscriptionPlan
    });
    res.json({ user: req.user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const allowedUpdates = ['displayName', 'photoURL', 'preferences'];
    const updates = {};

    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    res.json({ user });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(400).json({ error: 'Failed to update profile' });
  }
};

// Update push token
exports.updatePushToken = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Token is required' });
    }

    // Add token if it doesn't exist
    if (!req.user.pushTokens.includes(token)) {
      req.user.pushTokens.push(token);
      await req.user.save();
    }

    res.json({ message: 'Push token updated successfully' });
  } catch (error) {
    console.error('Update push token error:', error);
    res.status(500).json({ error: 'Failed to update push token' });
  }
};

// Remove push token
exports.removePushToken = async (req, res) => {
  try {
    const { token } = req.body;

    req.user.pushTokens = req.user.pushTokens.filter(t => t !== token);
    await req.user.save();

    res.json({ message: 'Push token removed successfully' });
  } catch (error) {
    console.error('Remove push token error:', error);
    res.status(500).json({ error: 'Failed to remove push token' });
  }
};

// Get user statistics
exports.getUserStats = async (req, res) => {
  try {
    const Project = require('../models/Project');
    const BrandDeal = require('../models/BrandDeal');

    const [projectCount, brandDealCount, projectsByStatus, brandDealsByStatus] = await Promise.all([
      Project.countDocuments({ userId: req.user._id }),
      BrandDeal.countDocuments({ userId: req.user._id }),
      Project.aggregate([
        { $match: { userId: req.user._id } },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      BrandDeal.aggregate([
        { $match: { userId: req.user._id } },
        { $group: { _id: '$status', count: { $sum: 1 }, totalAmount: { $sum: '$amount' } } }
      ])
    ]);

    const stats = {
      projects: {
        total: projectCount,
        byStatus: projectsByStatus
      },
      brandDeals: {
        total: brandDealCount,
        byStatus: brandDealsByStatus
      }
    };

    res.json({ stats });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
};

// Update branding settings
exports.updateBranding = async (req, res) => {
  try {
    const { branding } = req.body;

    if (!branding) {
      return res.status(400).json({ error: 'Branding data is required' });
    }

    // Check if user has Premium plan
    if (req.user.subscriptionPlan !== 'Premium') {
      return res.status(403).json({ error: 'Premium subscription required for white-label branding' });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { branding } },
      { new: true, runValidators: true }
    );

    res.json({ 
      success: true,
      message: 'Branding settings updated successfully',
      branding: user.branding
    });
  } catch (error) {
    console.error('Update branding error:', error);
    res.status(500).json({ error: 'Failed to update branding settings' });
  }
};

// Get branding settings
exports.getBranding = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('branding');
    res.json({ branding: user.branding || {} });
  } catch (error) {
    console.error('Get branding error:', error);
    res.status(500).json({ error: 'Failed to fetch branding settings' });
  }
};

// Get AI credits
exports.getAICredits = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('aiCredits');
    res.json({ credits: user.aiCredits || 0 });
  } catch (error) {
    console.error('Get AI credits error:', error);
    res.status(500).json({ error: 'Failed to fetch AI credits' });
  }
};

// Use AI credit
exports.useAICredit = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user.aiCredits || user.aiCredits <= 0) {
      return res.status(403).json({ error: 'Insufficient AI credits' });
    }

    user.aiCredits -= 1;
    await user.save();

    res.json({ 
      success: true,
      credits: user.aiCredits,
      message: 'Credit used successfully'
    });
  } catch (error) {
    console.error('Use AI credit error:', error);
    res.status(500).json({ error: 'Failed to use AI credit' });
  }
};

// Add AI credits (for purchases)
exports.addAICredits = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid credit amount' });
    }

    const user = await User.findById(req.user._id);
    user.aiCredits = (user.aiCredits || 0) + amount;
    await user.save();

    res.json({ 
      success: true,
      credits: user.aiCredits,
      message: `${amount} credits added successfully`
    });
  } catch (error) {
    console.error('Add AI credits error:', error);
    res.status(500).json({ error: 'Failed to add AI credits' });
  }
};
