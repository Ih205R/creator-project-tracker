const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true
  },
  description: String,
  platform: {
    type: String,
    enum: ['YouTube', 'TikTok', 'Instagram', 'Twitter', 'LinkedIn', 'Podcast', 'Blog', 'Other'],
    required: true
  },
  status: {
    type: String,
    enum: ['Idea', 'Drafting', 'Editing', 'Scheduled', 'Posted'],
    default: 'Idea'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Urgent'],
    default: 'Medium'
  },
  tags: [String],
  dueDate: Date,
  scheduledDate: Date,
  postedDate: Date,
  aiSuggestions: {
    captions: [String],
    titles: [String],
    scripts: [String],
    generatedAt: Date
  },
  attachments: [{
    name: String,
    url: String,
    type: String,
    uploadedAt: Date
  }],
  order: {
    type: Number,
    default: 0
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

projectSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

projectSchema.index({ userId: 1, status: 1 });
projectSchema.index({ userId: 1, dueDate: 1 });

module.exports = mongoose.model('Project', projectSchema);
