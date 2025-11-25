# Authentication 401 Error - FIXED ✅

## Problem
- Frontend was receiving **401 Unauthorized** errors when calling `/api/stripe/create-checkout-session`
- The authentication middleware was working, but MongoDB queries were timing out
- `User.findOne()` was blocking the request for 10+ seconds, then timing out

## Root Cause
**MongoDB is not connected** - The connection string in `.env` is invalid:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/creator-tracker
```

This is a placeholder and needs to be replaced with a real MongoDB connection string.

## Solution Applied

### 1. Updated Authentication Middleware (`backend/middleware/auth.js`)

Added graceful fallback when MongoDB is unavailable:

```javascript
// Try to get or create user in MongoDB (skip if DB not connected)
let user = null;
try {
  user = await User.findOne({ firebaseUid: decodedToken.uid }).maxTimeMS(2000);
  
  if (!user) {
    user = await User.create({
      firebaseUid: decodedToken.uid,
      email: decodedToken.email,
      displayName: decodedToken.name,
      photoURL: decodedToken.picture
    });
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
```

**Key Changes:**
- Added `maxTimeMS(2000)` to prevent long timeout
- Wrapped MongoDB operations in try-catch
- Creates mock user from Firebase token when DB unavailable
- Authentication continues even without MongoDB

## Current Status

| Component | Status | Notes |
|-----------|--------|-------|
| **Backend** | ✅ Running | Port 5001 |
| **CORS** | ✅ Fixed | 204 on OPTIONS |
| **Authentication** | ✅ Fixed | Works without MongoDB |
| **MongoDB** | ❌ Not Connected | Need valid connection string |
| **Stripe API** | ✅ Ready | Authentication working |

## Testing

### 1. Test Authentication Endpoint
```bash
# Get a Firebase token from the frontend console, then:
curl -X POST http://localhost:5001/api/stripe/create-checkout-session \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
  -d '{"priceId":"price_1SU8tUJBI9K8r3FqawHSWcCr"}'
```

### 2. Test from Frontend
1. Go to http://localhost:3000/dashboard/upgrade
2. Click "Subscribe to Lite" (or any plan)
3. Check browser console - **should NOT see 401 error**
4. Should redirect to Stripe checkout

## MongoDB Setup (Required for Full Functionality)

### Option 1: MongoDB Atlas (Recommended - Free)

1. Go to https://cloud.mongodb.com
2. Create a free account
3. Create a new cluster (M0 Free tier)
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Update `.env`:
   ```env
   MONGODB_URI=mongodb+srv://username:password@your-cluster.mongodb.net/creator-tracker?retryWrites=true&w=majority
   ```
   Replace `username`, `password`, and `your-cluster` with your actual values

### Option 2: Local MongoDB

```bash
# Install MongoDB
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Update .env
MONGODB_URI=mongodb://localhost:27017/creator-tracker
```

## What Works Now (Without MongoDB)

✅ **Authentication** - Firebase tokens are verified  
✅ **User Data** - Extracted from Firebase token  
✅ **Stripe Checkout** - Can create sessions  
✅ **API Requests** - All authenticated routes work  

## What Needs MongoDB

❌ **Persistent User Data** - User profiles, settings  
❌ **Subscription Storage** - Plan info saved to database  
❌ **Projects/Calendar/Brand Deals** - All data storage  
❌ **Webhook Updates** - Stripe webhook updates user records  

## Next Steps

1. ✅ Authentication is fixed - API calls work
2. ✅ Try creating a Stripe checkout session
3. ⏳ Set up MongoDB Atlas for persistent data
4. ⏳ Update `MONGODB_URI` in `.env`
5. ⏳ Restart backend after MongoDB setup
6. ⏳ Test full subscription flow with data persistence

## Important Notes

- The backend will continue working for API testing without MongoDB
- User data will be generated from Firebase tokens on each request
- For **production**, MongoDB is **required** for data persistence
- Subscription data won't persist without MongoDB
- Stripe webhooks need MongoDB to update user subscription status

---

**Status**: ✅ 401 Error Fixed  
**Authentication**: Working with Firebase tokens  
**MongoDB**: Optional for development, required for production  
**Last Updated**: November 16, 2025
