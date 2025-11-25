# 🔐 YouTube OAuth2 - Authorized Redirect URIs

## Quick Reference for Google Cloud Console Setup

When configuring your OAuth 2.0 Client ID in Google Cloud Console, add **ALL** of the following redirect URIs:

---

## Development Environment

### Backend API Callback (Primary)
```
http://localhost:5001/api/youtube/oauth/callback
```

### Alternative Localhost
```
http://127.0.0.1:5001/api/youtube/oauth/callback
```

### Frontend Redirect (Optional)
```
http://localhost:3000/dashboard/integrations
```

---

## Production Environment

⚠️ **Important**: Replace `yourdomain.com` with your actual production domain

### Primary Backend Callback
```
https://yourdomain.com/api/youtube/oauth/callback
```

### API Subdomain (If using separate API server)
```
https://api.yourdomain.com/api/youtube/oauth/callback
```

### Frontend Redirect
```
https://yourdomain.com/dashboard/integrations
```

---

## Staging/Testing Environments

### Staging
```
https://staging.yourdomain.com/api/youtube/oauth/callback
https://staging.yourdomain.com/dashboard/integrations
```

### Testing
```
https://test.yourdomain.com/api/youtube/oauth/callback
https://test.yourdomain.com/dashboard/integrations
```

---

## How to Add These URIs

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Navigate to: **APIs & Services** > **Credentials**
4. Click on your OAuth 2.0 Client ID
5. Under **Authorized redirect URIs**, click **+ ADD URI**
6. Copy and paste each URI from above
7. Click **SAVE**

---

## ⚠️ Common Mistakes to Avoid

❌ **Missing protocol** (http:// or https://)  
✅ Always include the full protocol

❌ **Trailing slash** at the end  
✅ Do NOT add a trailing slash

❌ **Wrong port number**  
✅ Use port 5001 for backend (or your configured port)

❌ **Mixed http/https**  
✅ Use http for localhost, https for production

❌ **Typos in the path**  
✅ Double-check: `/api/youtube/oauth/callback` (exact match)

---

## Verification

After adding the URIs, test the OAuth flow:

1. Start your application
2. Go to: `http://localhost:3000/dashboard/integrations`
3. Select "Full Access with Google"
4. Click "Sign in with Google"
5. You should be redirected to Google consent screen
6. After granting permissions, you should be redirected back to your app

If you see **"redirect_uri_mismatch"** error:
- Double-check the URI in Google Console
- Verify it matches exactly what your backend is using
- Wait a few minutes for changes to propagate

---

## Environment Variable Configuration

Ensure your `.env` file has the correct callback URI:

### Development
```bash
GOOGLE_REDIRECT_URI=http://localhost:5001/api/youtube/oauth/callback
FRONTEND_URL=http://localhost:3000
```

### Production
```bash
GOOGLE_REDIRECT_URI=https://yourdomain.com/api/youtube/oauth/callback
FRONTEND_URL=https://yourdomain.com
```

---

## Required OAuth Scopes

Add these scopes in the OAuth consent screen configuration:

```
https://www.googleapis.com/auth/youtube.readonly
https://www.googleapis.com/auth/yt-analytics.readonly
```

---

## Summary

✅ **Total URIs to add (minimum for development)**:
- `http://localhost:5001/api/youtube/oauth/callback`
- `http://127.0.0.1:5001/api/youtube/oauth/callback`

✅ **Total URIs to add (for production)**:
- `https://yourdomain.com/api/youtube/oauth/callback`
- `https://yourdomain.com/dashboard/integrations`

---

**Last Updated**: November 2024  
**Documentation**: See `/YOUTUBE_OAUTH_SETUP.md` for complete guide
