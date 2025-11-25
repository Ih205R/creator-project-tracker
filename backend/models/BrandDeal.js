const mongoose = require('mongoose');

const brandDealSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  brandName: {
    type: String,
    required: true
  },
  description: String,
  contactPerson: String,
  contactEmail: String,
  amount: {
    type: Number,
    default: 0
  },
  currency: {
    type: String,
    default: 'USD'
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'completed', 'cancelled'],
    default: 'pending'
  },
  startDate: Date,
  endDate: Date,
  dueDate: Date,
  completionDate: Date,
  notes: String,
  deliverables: String, // Changed from array to string to match frontend
  attachments: [{
    name: String,
    url: String,
    type: String,
    uploadedAt: Date
  }],
  relatedProjects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

brandDealSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

brandDealSchema.index({ userId: 1, status: 1 });

module.exports = mongoose.model('BrandDeal', brandDealSchema);
