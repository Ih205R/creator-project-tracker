const mongoose = require('mongoose');

const calendarItemSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  },
  title: {
    type: String,
    required: true
  },
  description: String,
  startDate: {
    type: Date,
    required: true
  },
  endDate: Date,
  allDay: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    enum: ['content', 'meeting', 'deadline', 'reminder', 'other'],
    default: 'content'
  },
  color: String,
  notificationSent: {
    type: Boolean,
    default: false
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

calendarItemSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

calendarItemSchema.index({ userId: 1, startDate: 1 });

module.exports = mongoose.model('CalendarItem', calendarItemSchema);
