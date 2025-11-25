# YouTube OAuth2 Integration Setup Guide

## Overview
This guide explains how to set up Google OAuth2 for YouTube Analytics integration. The app now supports two modes:

1. **Public Channel Search** - No authentication required, limited to public data
2. **OAuth2 Authentication** - Full access to user's own YouTube Analytics data

---

## Features by Access Type

### Public Access (No OAuth Required)
✅ Channel name & subscriber count  
✅ Total views & video list  
✅ Engagement metrics (likes, comments)  
✅ Upload frequency  
✅ Estimated statistics  

### OAuth Access (Google Sign-In Required)
✅ All public metrics PLUS:  
✅ Revenue data (RPM/CPM, estimated earnings)  
✅ Watch time & retention rates  
✅ Traffic sources & referrals  
✅ Search keywords  
✅ Demographics (age, gender, location)  
✅ Monetization details  
✅ Advanced analytics reports  

---

## Google Cloud Console Setup

### Step 1: Create OAuth2 Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (or create a new one)
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth 2.0 Client ID**
5. Select **Web application** as application type

### Step 2: Configure OAuth Consent Screen

1. Go to **APIs & Services** > **OAuth consent screen**
2. Select **External** user type
3. Fill in required information:
   - **App name**: Creator Project Tracker
   - **User support email**: Your email
   - **Developer contact**: Your email
4. Add scopes:
   - `https://www.googleapis.com/auth/youtube.readonly`
   - `https://www.googleapis.com/auth/yt-analytics.readonly`
5. Add test users (if in testing mode)

### Step 3: Enable Required APIs

Enable the following APIs in your Google Cloud project:
1. **YouTube Data API v3**
2. **YouTube Analytics API**
3. **YouTube Reporting API** (optional, for advanced features)

---

## Authorized Redirect URIs

You **MUST** add all of the following redirect URIs to your OAuth 2.0 Client ID configuration:

### Development Environment
```
http://localhost:5001/api/youtube/oauth/callback
http://127.0.0.1:5001/api/youtube/oauth/callback
http://localhost:3000/dashboard/integrations
```

### Production Environment
Replace `yourdomain.com` with your actual domain:
```
https://yourdomain.com/api/youtube/oauth/callback
https://api.yourdomain.com/api/youtube/oauth/callback
https://yourdomain.com/dashboard/integrations
```

### Staging/Testing Environments
```
https://staging.yourdomain.com/api/youtube/oauth/callback
https://test.yourdomain.com/api/youtube/oauth/callback
```

---

## Environment Variables Setup

Add the following to your `.env` file:

```bash
# Google OAuth2 (for YouTube Analytics)
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=http://localhost:5001/api/youtube/oauth/callback

# For production, update to:
# GOOGLE_REDIRECT_URI=https://yourdomain.com/api/youtube/oauth/callback

# Ensure these are also set:
FRONTEND_URL=http://localhost:3000
API_URL=http://localhost:5001
```

---

## Backend Implementation

### OAuth Flow

1. **User clicks "Sign in with Google"** on Integrations page
2. Frontend calls: `POST /api/youtube/oauth/init`
3. Backend generates OAuth URL and returns it
4. User is redirected to Google consent screen
5. User grants permissions
6. Google redirects to: `/api/youtube/oauth/callback?code=...&state=userId`
7. Backend exchanges code for access & refresh tokens
8. Backend fetches user's YouTube channel info
9. Backend saves tokens and channel data to database
10. User is redirected back to Integrations page

### Available Backend Endpoints

```javascript
// Public access endpoints (YouTube Data API only)
GET  /api/youtube/channel/:channelId
GET  /api/youtube/channel/:channelId/videos
GET  /api/youtube/channel/:channelId/analytics
GET  /api/youtube/search?query=channelName
POST /api/youtube/connect
POST /api/youtube/disconnect

// OAuth2 endpoints
POST /api/youtube/oauth/init           // Initialize OAuth flow
GET  /api/youtube/oauth/callback       // Handle Google callback
GET  /api/youtube/analytics/authenticated  // Get full analytics (OAuth required)
```

---

## User Database Schema

The User model includes the following integration fields:

```javascript
integrations: {
  youtube: {
    connected: Boolean,            // Whether channel is connected
    accessType: String,            // 'public' or 'oauth'
    channelId: String,             // YouTube channel ID
    channelTitle: String,          // Channel display name
    accessToken: String,           // OAuth access token (oauth only)
    refreshToken: String,          // OAuth refresh token (oauth only)
    tokenExpiry: Date,             // Token expiration date (oauth only)
    connectedAt: Date,             // When connected
    lastSync: Date,                // Last data sync
    disconnectedAt: Date           // When disconnected
  }
}
```

---

## Frontend Implementation

### Integrations Page Features

1. **Mode Selection**: User can choose between Public or OAuth access
2. **Public Mode**: Search and connect any public YouTube channel
3. **OAuth Mode**: Sign in with Google to connect owned channel
4. **Access Indicator**: Shows current access level with badges
5. **Upgrade Prompt**: Encourages public users to upgrade to OAuth

### User Flow

#### Public Access Flow:
1. Select "Public Channel Search"
2. Enter channel name
3. Search results appear
4. Click "Connect" on desired channel
5. View public analytics on Dashboard

#### OAuth Access Flow:
1. Select "Full Access with Google"
2. Click "Sign in with Google"
3. Redirected to Google consent screen
4. Grant permissions
5. Redirected back to app
6. View full analytics on Dashboard

---

## Testing the Integration

### Test OAuth Flow (Development)

1. Start backend server: `npm run dev` (in root directory)
2. Start frontend: `npm run dev` (Next.js)
3. Log in to your app
4. Navigate to Dashboard > Integrations
5. Select "Full Access with Google"
6. Click "Sign in with Google"
7. Verify redirect to Google
8. Grant permissions
9. Verify redirect back to app
10. Check database for saved tokens

### Test Analytics Retrieval

```bash
# Get authenticated analytics
curl -X GET \
  http://localhost:5001/api/youtube/analytics/authenticated \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN"
```

---

## Security Considerations

1. **Never commit credentials**: Keep `.env` out of version control
2. **Use HTTPS in production**: All OAuth flows must use HTTPS
3. **Store tokens securely**: Tokens are encrypted in database
4. **Token refresh**: Tokens are automatically refreshed when expired
5. **User consent**: Users must explicitly grant permissions
6. **Scope limitation**: Only request necessary scopes
7. **Revocation**: Users can revoke access in Google Account settings

---

## Troubleshooting

### Common Issues

**Error: redirect_uri_mismatch**
- Verify redirect URI in Google Console matches exactly
- Check for trailing slashes, http vs https
- Ensure URI includes protocol and port

**Error: invalid_client**
- Check GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET
- Verify credentials are for correct project

**Error: access_denied**
- User declined permissions
- Check OAuth consent screen setup
- Verify app is not in restricted mode

**Error: invalid_grant**
- Token expired or revoked
- Delete and reconnect channel
- Check token refresh logic

**No analytics data returned**
- Channel may not be monetized (revenue data)
- User may not own the channel
- Analytics data may not be available yet (new channels)

---

## Production Deployment Checklist

- [ ] Create production OAuth credentials
- [ ] Update redirect URIs for production domain
- [ ] Set environment variables in production
- [ ] Enable required APIs in Google Cloud
- [ ] Test OAuth flow in production
- [ ] Monitor token refresh mechanism
- [ ] Set up error logging for OAuth failures
- [ ] Configure OAuth consent screen for production
- [ ] Add privacy policy and terms of service links
- [ ] Request OAuth verification (if needed for public release)

---

## API Rate Limits

### YouTube Data API v3
- **Quota**: 10,000 units/day (default)
- **Cost per request**: 1-100 units depending on operation
- **Request quota increase**: Available in Google Cloud Console

### YouTube Analytics API
- **Quota**: 50,000 units/day (default)
- **Cost per request**: 1-10 units per query
- **Real-time data**: Updated every 24-48 hours

---

## Additional Resources

- [Google OAuth2 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [YouTube Data API](https://developers.google.com/youtube/v3)
- [YouTube Analytics API](https://developers.google.com/youtube/analytics)
- [OAuth2 Scopes](https://developers.google.com/identity/protocols/oauth2/scopes)

---

## Support

For issues or questions:
1. Check Google Cloud Console for API errors
2. Review server logs for backend errors
3. Check browser console for frontend errors
4. Verify all environment variables are set
5. Test with a different Google account

---

**Last Updated**: 2024
**Version**: 1.0
