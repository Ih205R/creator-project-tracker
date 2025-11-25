const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ['due_date', 'scheduled_content', 'subscription', 'ai_generated', 'brand_deal', 'system'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  body: String,
  data: mongoose.Schema.Types.Mixed,
  read: {
    type: Boolean,
    default: false
  },
  sent: {
    type: Boolean,
    default: false
  },
  sentAt: Date,
  scheduledFor: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

notificationSchema.index({ userId: 1, read: 1 });
notificationSchema.index({ scheduledFor: 1, sent: 1 });

module.exports = mongoose.model('Notification', notificationSchema);
