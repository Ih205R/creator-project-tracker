const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firebaseUid: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  displayName: String,
  photoURL: String,
  role: {
    type: String,
    enum: ['free_user', 'pro_user'],
    default: 'free_user'
  },
  stripeCustomerId: String,
  subscriptionStatus: {
    type: String,
    enum: ['active', 'canceled', 'canceling', 'past_due', 'trialing', 'none'],
    default: 'none'
  },
  subscriptionId: String,
  subscriptionPlan: {
    type: String,
    enum: ['Starter', 'Pro', 'Premium', null],
    default: null
  },
  subscriptionPeriodEnd: Date,
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark'],
      default: 'light'
    },
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true }
    }
  },
  pushTokens: [String],
  integrations: {
    youtube: {
      connected: { type: Boolean, default: false },
      accessType: { type: String, enum: ['public', 'oauth'], default: 'public' },
      channelId: String,
      channelTitle: String,
      accessToken: String,
      refreshToken: String,
      tokenExpiry: Date,
      connectedAt: Date,
      lastSync: Date,
      disconnectedAt: Date
    },
    instagram: {
      connected: { type: Boolean, default: false },
      username: String,
      connectedAt: Date,
      lastSync: Date
    },
    tiktok: {
      connected: { type: Boolean, default: false },
      username: String,
      connectedAt: Date,
      lastSync: Date
    },
    twitter: {
      connected: { type: Boolean, default: false },
      username: String,
      connectedAt: Date,
      lastSync: Date
    }
  },
  branding: {
    companyName: String,
    logo: String,
    primaryColor: String,
    secondaryColor: String,
    accentColor: String,
    customDomain: String,
    favicon: String,
    reportHeader: String,
    reportFooter: String
  },
  aiCredits: {
    type: Number,
    default: 10
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

userSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('User', userSchema);
