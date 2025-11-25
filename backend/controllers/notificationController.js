const Notification = require('../models/Notification');
const { messaging } = require('../config/firebase');

// Get user notifications
exports.getNotifications = async (req, res) => {
  try {
    const { unreadOnly } = req.query;
    
    const query = { userId: req.user._id };
    if (unreadOnly === 'true') {
      query.read = false;
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(50);
    
    res.json({ notifications });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

// Mark notification as read
exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { $set: { read: true } },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.json({ notification });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
};

// Mark all as read
exports.markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.user._id, read: false },
      { $set: { read: true } }
    );

    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Mark all as read error:', error);
    res.status(500).json({ error: 'Failed to mark all as read' });
  }
};

// Delete notification
exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({ error: 'Failed to delete notification' });
  }
};

// Send push notification (internal function)
async function sendPushNotification(userId, notification) {
  try {
    const User = require('../models/User');
    const user = await User.findById(userId);

    if (!user || !user.pushTokens || user.pushTokens.length === 0) {
      console.log('No push tokens found for user:', userId);
      return;
    }

    if (!user.preferences.notifications.push) {
      console.log('Push notifications disabled for user:', userId);
      return;
    }

    const message = {
      notification: {
        title: notification.title,
        body: notification.body
      },
      data: notification.data || {},
      tokens: user.pushTokens
    };

    const response = await messaging.sendMulticast(message);
    
    console.log(`✅ Sent push notification to ${response.successCount} devices`);
    
    // Remove invalid tokens
    if (response.failureCount > 0) {
      const failedTokens = [];
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          failedTokens.push(user.pushTokens[idx]);
        }
      });
      
      user.pushTokens = user.pushTokens.filter(token => !failedTokens.includes(token));
      await user.save();
    }

    return response;
  } catch (error) {
    console.error('Send push notification error:', error);
  }
}

module.exports = {
  ...exports,
  sendPushNotification
};
