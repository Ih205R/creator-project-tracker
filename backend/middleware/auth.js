const { auth } = require('../config/firebase');
const User = require('../models/User');
const { sendWelcomeEmail } = require('../services/emailServiceSendGrid');

const authenticateUser = async (req, res, next) => {
  try {
    // Skip authentication for OPTIONS requests (CORS preflight)
    if (req.method === 'OPTIONS') {
      return next();
    }
    
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split('Bearer ')[1];
    
    // Verify Firebase token
    const decodedToken = await auth.verifyIdToken(token);
    
    // Try to get or create user in MongoDB (skip if DB not connected)
    let user = null;
    let isNewUser = false;
    try {
      user = await User.findOne({ firebaseUid: decodedToken.uid }).maxTimeMS(2000);
      
      if (!user) {
        isNewUser = true;
        user = await User.create({
          firebaseUid: decodedToken.uid,
          email: decodedToken.email,
          displayName: decodedToken.name,
          photoURL: decodedToken.picture
        });
        
        // Send welcome email to new user (async, don't wait)
        sendWelcomeEmail(decodedToken.email, decodedToken.name || decodedToken.email.split('@')[0])
          .then(result => {
            if (result.success) {
              console.log('✅ Welcome email sent to:', decodedToken.email);
            } else {
              console.error('⚠️ Failed to send welcome email:', result.error);
            }
          })
          .catch(err => console.error('⚠️ Welcome email error:', err));
      }
    } catch (dbError) {
      console.warn('MongoDB not available, using Firebase user data:', dbError.message);
      // Create a mock user object from Firebase data
      user = {
        firebaseUid: decodedToken.uid,
        email: decodedToken.email,
        displayName: decodedToken.name,
        photoURL: decodedToken.picture,
        role: 'free_user',
        subscriptionStatus: 'inactive',
        _isMockUser: true
      };
    }
    
    req.user = user;
    req.firebaseUid = decodedToken.uid;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ error: 'Invalid token' });
  }
};

const checkProUser = async (req, res, next) => {
  if (req.user.role !== 'pro_user' || req.user.subscriptionStatus !== 'active') {
    return res.status(403).json({ 
      error: 'Pro subscription required',
      message: 'This feature is only available for Pro users'
    });
  }
  next();
};

const checkFreeUserLimits = async (model, userId, limit, errorMessage) => {
  const count = await model.countDocuments({ userId });
  if (count >= limit) {
    throw new Error(errorMessage);
  }
};

module.exports = { authenticateUser, checkProUser, checkFreeUserLimits };
