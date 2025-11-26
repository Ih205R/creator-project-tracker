const BrandDeal = require('../models/BrandDeal');
const { checkFreeUserLimits } = require('../middleware/auth');
const mongoose = require('mongoose');

// Get all brand deals
exports.getBrandDeals = async (req, res) => {
  try {
    const { stage, search, sortBy, sortOrder } = req.query;
    
    let query = { userId: req.user._id };
    
    // Filter by stage if provided
    if (stage && stage !== 'all') {
      query.stage = stage;
    }
    
    // Search by brand name or deal name
    if (search) {
      query.$or = [
        { brandName: { $regex: search, $options: 'i' } },
        { dealName: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Build sort options
    let sort = { createdAt: -1 };
    if (sortBy) {
      sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
    }
    
    const brandDeals = await BrandDeal.find(query)
      .populate('relatedProjects')
      .sort(sort);
    
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

    // Set default deal name if not provided
    const dealData = {
      ...req.body,
      userId: req.user._id
    };
    
    if (!dealData.dealName && dealData.brandName) {
      dealData.dealName = `${dealData.brandName} Deal`;
    }

    const brandDeal = await BrandDeal.create(dealData);

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

// Update deal stage (move between pipeline stages)
exports.updateDealStage = async (req, res) => {
  try {
    const { stage } = req.body;
    
    const validStages = ['lead', 'negotiation', 'contract', 'active', 'completed', 'paid'];
    if (!validStages.includes(stage)) {
      return res.status(400).json({ error: 'Invalid stage' });
    }

    const brandDeal = await BrandDeal.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { $set: { stage } },
      { new: true, runValidators: true }
    ).populate('relatedProjects');

    if (!brandDeal) {
      return res.status(404).json({ error: 'Brand deal not found' });
    }

    res.json({ brandDeal });
  } catch (error) {
    console.error('Update deal stage error:', error);
    res.status(400).json({ error: 'Failed to update deal stage' });
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

// ============ DELIVERABLES ============

// Add a deliverable to a deal
exports.addDeliverable = async (req, res) => {
  try {
    const brandDeal = await BrandDeal.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!brandDeal) {
      return res.status(404).json({ error: 'Brand deal not found' });
    }

    brandDeal.deliverables.push(req.body);
    await brandDeal.save();

    res.status(201).json({ 
      brandDeal,
      deliverable: brandDeal.deliverables[brandDeal.deliverables.length - 1]
    });
  } catch (error) {
    console.error('Add deliverable error:', error);
    res.status(400).json({ error: 'Failed to add deliverable' });
  }
};

// Update a deliverable
exports.updateDeliverable = async (req, res) => {
  try {
    const brandDeal = await BrandDeal.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!brandDeal) {
      return res.status(404).json({ error: 'Brand deal not found' });
    }

    const deliverable = brandDeal.deliverables.id(req.params.deliverableId);
    if (!deliverable) {
      return res.status(404).json({ error: 'Deliverable not found' });
    }

    Object.assign(deliverable, req.body);
    await brandDeal.save();

    res.json({ brandDeal, deliverable });
  } catch (error) {
    console.error('Update deliverable error:', error);
    res.status(400).json({ error: 'Failed to update deliverable' });
  }
};

// Delete a deliverable
exports.deleteDeliverable = async (req, res) => {
  try {
    const brandDeal = await BrandDeal.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!brandDeal) {
      return res.status(404).json({ error: 'Brand deal not found' });
    }

    const deliverable = brandDeal.deliverables.id(req.params.deliverableId);
    if (!deliverable) {
      return res.status(404).json({ error: 'Deliverable not found' });
    }

    deliverable.deleteOne();
    await brandDeal.save();

    res.json({ message: 'Deliverable deleted successfully', brandDeal });
  } catch (error) {
    console.error('Delete deliverable error:', error);
    res.status(500).json({ error: 'Failed to delete deliverable' });
  }
};

// ============ DOCUMENTS ============

// Add a document to a deal
exports.addDocument = async (req, res) => {
  try {
    const brandDeal = await BrandDeal.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!brandDeal) {
      return res.status(404).json({ error: 'Brand deal not found' });
    }

    brandDeal.documents.push({
      ...req.body,
      uploadedAt: new Date()
    });
    await brandDeal.save();

    res.status(201).json({ 
      brandDeal,
      document: brandDeal.documents[brandDeal.documents.length - 1]
    });
  } catch (error) {
    console.error('Add document error:', error);
    res.status(400).json({ error: 'Failed to add document' });
  }
};

// Get documents for a deal
exports.getDocuments = async (req, res) => {
  try {
    const brandDeal = await BrandDeal.findOne({
      _id: req.params.id,
      userId: req.user._id
    }).select('documents');

    if (!brandDeal) {
      return res.status(404).json({ error: 'Brand deal not found' });
    }

    res.json({ documents: brandDeal.documents });
  } catch (error) {
    console.error('Get documents error:', error);
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
};

// Delete a document
exports.deleteDocument = async (req, res) => {
  try {
    const brandDeal = await BrandDeal.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!brandDeal) {
      return res.status(404).json({ error: 'Brand deal not found' });
    }

    const document = brandDeal.documents.id(req.params.documentId);
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    document.deleteOne();
    await brandDeal.save();

    res.json({ message: 'Document deleted successfully', brandDeal });
  } catch (error) {
    console.error('Delete document error:', error);
    res.status(500).json({ error: 'Failed to delete document' });
  }
};

// ============ PAYMENTS ============

// Add a payment to a deal
exports.addPayment = async (req, res) => {
  try {
    const brandDeal = await BrandDeal.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!brandDeal) {
      return res.status(404).json({ error: 'Brand deal not found' });
    }

    brandDeal.payments.push(req.body);
    await brandDeal.save();

    res.status(201).json({ 
      brandDeal,
      payment: brandDeal.payments[brandDeal.payments.length - 1]
    });
  } catch (error) {
    console.error('Add payment error:', error);
    res.status(400).json({ error: 'Failed to add payment' });
  }
};

// Update a payment
exports.updatePayment = async (req, res) => {
  try {
    const brandDeal = await BrandDeal.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!brandDeal) {
      return res.status(404).json({ error: 'Brand deal not found' });
    }

    const payment = brandDeal.payments.id(req.params.paymentId);
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    Object.assign(payment, req.body);
    await brandDeal.save();

    res.json({ brandDeal, payment });
  } catch (error) {
    console.error('Update payment error:', error);
    res.status(400).json({ error: 'Failed to update payment' });
  }
};

// ============ COMMUNICATIONS ============

// Add a communication to a deal
exports.addCommunication = async (req, res) => {
  try {
    const brandDeal = await BrandDeal.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!brandDeal) {
      return res.status(404).json({ error: 'Brand deal not found' });
    }

    brandDeal.communications.push({
      ...req.body,
      date: new Date()
    });
    await brandDeal.save();

    res.status(201).json({ 
      brandDeal,
      communication: brandDeal.communications[brandDeal.communications.length - 1]
    });
  } catch (error) {
    console.error('Add communication error:', error);
    res.status(400).json({ error: 'Failed to add communication' });
  }
};

// Get communications for a deal
exports.getCommunications = async (req, res) => {
  try {
    const brandDeal = await BrandDeal.findOne({
      _id: req.params.id,
      userId: req.user._id
    }).select('communications');

    if (!brandDeal) {
      return res.status(404).json({ error: 'Brand deal not found' });
    }

    res.json({ communications: brandDeal.communications });
  } catch (error) {
    console.error('Get communications error:', error);
    res.status(500).json({ error: 'Failed to fetch communications' });
  }
};

// ============ AI INSIGHTS ============

// Add an AI insight to a deal
exports.addAIInsight = async (req, res) => {
  try {
    const brandDeal = await BrandDeal.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!brandDeal) {
      return res.status(404).json({ error: 'Brand deal not found' });
    }

    brandDeal.aiInsights.push({
      ...req.body,
      createdAt: new Date()
    });
    await brandDeal.save();

    res.status(201).json({ 
      brandDeal,
      insight: brandDeal.aiInsights[brandDeal.aiInsights.length - 1]
    });
  } catch (error) {
    console.error('Add AI insight error:', error);
    res.status(400).json({ error: 'Failed to add AI insight' });
  }
};

// ============ STATISTICS ============

// Get comprehensive brand deal statistics
exports.getBrandDealStats = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);
    
    // Get all deals for the user
    const allDeals = await BrandDeal.find({ userId });
    
    // Calculate stats
    const totalDeals = allDeals.length;
    const totalValue = allDeals.reduce((sum, deal) => sum + (deal.amount || 0), 0);
    
    // Deals by stage
    const stageStats = await BrandDeal.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: '$stage',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' }
        }
      }
    ]);
    
    // Active deals (not completed or paid)
    const activeDeals = allDeals.filter(d => 
      !['completed', 'paid'].includes(d.stage)
    ).length;
    
    // Outstanding payments (completed but not paid)
    const outstandingAmount = allDeals
      .filter(d => d.stage === 'completed')
      .reduce((sum, deal) => sum + (deal.amount || 0), 0);
    
    // Paid deals total
    const paidAmount = allDeals
      .filter(d => d.stage === 'paid')
      .reduce((sum, deal) => sum + (deal.amount || 0), 0);
    
    // Win rate (deals that made it past negotiation / total deals)
    const wonDeals = allDeals.filter(d => 
      ['contract', 'active', 'completed', 'paid'].includes(d.stage)
    ).length;
    const winRate = totalDeals > 0 ? Math.round((wonDeals / totalDeals) * 100) : 0;
    
    // Average deal size
    const averageDealSize = totalDeals > 0 ? Math.round(totalValue / totalDeals) : 0;
    
    // Pipeline revenue forecast (leads + negotiation deals)
    const pipelineForecast = allDeals
      .filter(d => ['lead', 'negotiation'].includes(d.stage))
      .reduce((sum, deal) => sum + (deal.amount || 0), 0);
    
    // Monthly revenue (paid deals from current month)
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const monthlyRevenue = allDeals
      .filter(d => d.stage === 'paid' && d.updatedAt >= startOfMonth)
      .reduce((sum, deal) => sum + (deal.amount || 0), 0);

    res.json({ 
      stats: stageStats,
      totalDeals,
      totalValue,
      activeDeals,
      outstandingAmount,
      paidAmount,
      winRate,
      averageDealSize,
      pipelineForecast,
      monthlyRevenue
    });
  } catch (error) {
    console.error('Get brand deal stats error:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
};
