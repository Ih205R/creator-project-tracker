const mongoose = require('mongoose');

// Deliverable sub-schema
const deliverableSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['video', 'story', 'short', 'post', 'reel', 'tweet', 'blog', 'podcast', 'other'],
    required: true
  },
  description: String,
  deadline: Date,
  status: {
    type: String,
    enum: ['not-started', 'in-progress', 'submitted', 'approved'],
    default: 'not-started'
  },
  submittedLink: String,
  approvalNotes: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Document sub-schema
const documentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['contract', 'brief', 'assets', 'other'],
    default: 'other'
  },
  url: String,
  uploadedAt: {
    type: Date,
    default: Date.now
  },
  aiSummary: String
});

// Payment sub-schema
const paymentSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'paid'],
    default: 'pending'
  },
  dueDate: Date,
  paidAt: Date,
  method: {
    type: String,
    enum: ['stripe', 'paypal', 'bank_transfer', 'invoice', 'other'],
    default: 'invoice'
  },
  stripePaymentId: String,
  receiptUrl: String,
  notes: String
});

// Communication sub-schema
const communicationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['email', 'note', 'message'],
    default: 'note'
  },
  from: String,
  to: String,
  subject: String,
  content: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  attachments: [String]
});

// AI Insight sub-schema
const aiInsightSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['negotiation', 'pricing', 'deadline', 'follow-up', 'risk', 'general'],
    default: 'general'
  },
  message: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const brandDealSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  dealName: {
    type: String,
    default: function() {
      return this.brandName ? `${this.brandName} Deal` : 'New Deal';
    }
  },
  brandName: {
    type: String,
    required: true
  },
  description: String,
  contactPerson: String,
  contactEmail: String,
  campaignGoal: String,
  amount: {
    type: Number,
    default: 0
  },
  currency: {
    type: String,
    default: 'USD'
  },
  paymentTerms: {
    type: String,
    enum: ['upfront', 'net-15', 'net-30', 'net-60', 'milestone', 'upon-completion', 'other'],
    default: 'net-30'
  },
  platforms: [{
    type: String,
    enum: ['youtube', 'instagram', 'tiktok', 'twitter', 'facebook', 'linkedin', 'blog', 'podcast', 'other']
  }],
  // Updated status to stage-based workflow
  stage: {
    type: String,
    enum: ['lead', 'negotiation', 'contract', 'active', 'completed', 'paid'],
    default: 'lead'
  },
  // Keep status for backward compatibility
  status: {
    type: String,
    enum: ['pending', 'active', 'completed', 'cancelled'],
    default: 'pending'
  },
  commission: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  startDate: Date,
  endDate: Date,
  paymentDueDate: Date,
  dueDate: Date,
  completionDate: Date,
  notes: String,
  // Keep legacy deliverables string for backward compatibility
  deliverablesText: String,
  // New structured deliverables
  deliverables: [deliverableSchema],
  // Rename old attachments to documents with enhanced schema
  documents: [documentSchema],
  // Keep legacy attachments for backward compatibility
  attachments: [{
    name: String,
    url: String,
    type: String,
    uploadedAt: Date
  }],
  // Payment tracking
  payments: [paymentSchema],
  // Communication history
  communications: [communicationSchema],
  // AI-generated insights
  aiInsights: [aiInsightSchema],
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

// Pre-save middleware to update timestamps and sync stage/status
brandDealSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  
  // Sync stage to status for backward compatibility
  const stageToStatus = {
    'lead': 'pending',
    'negotiation': 'pending',
    'contract': 'pending',
    'active': 'active',
    'completed': 'completed',
    'paid': 'completed'
  };
  
  if (this.stage && stageToStatus[this.stage]) {
    this.status = stageToStatus[this.stage];
  }
  
  next();
});

// Indexes for efficient queries
brandDealSchema.index({ userId: 1, status: 1 });
brandDealSchema.index({ userId: 1, stage: 1 });
brandDealSchema.index({ userId: 1, createdAt: -1 });

// Virtual for total paid amount
brandDealSchema.virtual('totalPaid').get(function() {
  if (!this.payments) return 0;
  return this.payments
    .filter(p => p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0);
});

// Virtual for outstanding amount
brandDealSchema.virtual('outstandingAmount').get(function() {
  return this.amount - (this.totalPaid || 0);
});

// Virtual for deliverables progress
brandDealSchema.virtual('deliverablesProgress').get(function() {
  if (!this.deliverables || this.deliverables.length === 0) return 0;
  const approved = this.deliverables.filter(d => d.status === 'approved').length;
  return Math.round((approved / this.deliverables.length) * 100);
});

// Enable virtuals in JSON output
brandDealSchema.set('toJSON', { virtuals: true });
brandDealSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('BrandDeal', brandDealSchema);
