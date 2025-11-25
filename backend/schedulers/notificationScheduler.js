const cron = require('node-cron');
const Project = require('../models/Project');
const CalendarItem = require('../models/CalendarItem');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { sendPushNotification } = require('../controllers/notificationController');

// Run every hour
cron.schedule('0 * * * *', async () => {
  console.log('🔔 Running scheduled notifications check...');
  
  try {
    await checkDueDates();
    await checkScheduledContent();
    await sendPendingNotifications();
  } catch (error) {
    console.error('Scheduled notifications error:', error);
  }
});

// Check for upcoming due dates (24 hours before)
async function checkDueDates() {
  const tomorrow = new Date();
  tomorrow.setHours(tomorrow.getHours() + 24);
  
  const projects = await Project.find({
    dueDate: {
      $gte: new Date(),
      $lte: tomorrow
    }
  }).populate('userId');

  for (const project of projects) {
    // Check if notification already exists
    const existingNotification = await Notification.findOne({
      userId: project.userId._id,
      type: 'due_date',
      'data.projectId': project._id.toString(),
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    });

    if (!existingNotification) {
      const notification = await Notification.create({
        userId: project.userId._id,
        type: 'due_date',
        title: '⏰ Project Due Soon',
        body: `"${project.title}" is due in less than 24 hours!`,
        data: {
          projectId: project._id.toString(),
          projectTitle: project.title
        }
      });

      await sendPushNotification(project.userId._id, notification);
    }
  }
}

// Check for scheduled content releases
async function checkScheduledContent() {
  const now = new Date();
  const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);

  const scheduledItems = await CalendarItem.find({
    startDate: {
      $gte: now,
      $lte: oneHourFromNow
    },
    notificationSent: false
  }).populate('userId');

  for (const item of scheduledItems) {
    const notification = await Notification.create({
      userId: item.userId._id,
      type: 'scheduled_content',
      title: '📅 Upcoming Scheduled Content',
      body: `"${item.title}" is scheduled to go live in 1 hour`,
      data: {
        calendarItemId: item._id.toString(),
        itemTitle: item.title
      }
    });

    await sendPushNotification(item.userId._id, notification);
    
    item.notificationSent = true;
    await item.save();
  }
}

// Send pending scheduled notifications
async function sendPendingNotifications() {
  const notifications = await Notification.find({
    sent: false,
    scheduledFor: { $lte: new Date() }
  });

  for (const notification of notifications) {
    await sendPushNotification(notification.userId, notification);
    
    notification.sent = true;
    notification.sentAt = new Date();
    await notification.save();
  }
}

// Check for expiring subscriptions (3 days before)
cron.schedule('0 9 * * *', async () => {
  console.log('💳 Checking for expiring subscriptions...');
  
  const threeDaysFromNow = new Date();
  threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
  
  const users = await User.find({
    subscriptionStatus: 'active',
    subscriptionPeriodEnd: {
      $gte: new Date(),
      $lte: threeDaysFromNow
    }
  });

  for (const user of users) {
    const existingNotification = await Notification.findOne({
      userId: user._id,
      type: 'subscription',
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    });

    if (!existingNotification) {
      const notification = await Notification.create({
        userId: user._id,
        type: 'subscription',
        title: '💳 Subscription Renewal',
        body: 'Your Pro subscription will renew in 3 days',
        data: {
          subscriptionEnd: user.subscriptionPeriodEnd
        }
      });

      await sendPushNotification(user._id, notification);
    }
  }
});

console.log('✅ Notification scheduler initialized');
