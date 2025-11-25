# Fix Google OAuth 403 Error: access_denied

## Error Details
```
Fehler 403: access_denied
client_id=1026985891044-fu1pfgajic1nj4jrm73odmt7d36ra18t.apps.googleusercontent.com
redirect_uri=http://localhost:5001/api/youtube/oauth/callback
```

## Common Causes & Solutions

### 1. OAuth Consent Screen Not Configured ⚠️ MOST COMMON

**Solution:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Navigate to: **APIs & Services** > **OAuth consent screen**
4. If you see "NEEDS SETUP" or the screen is incomplete:

   **Configure it as follows:**

   **User Type:**
   - Select **"External"** (allows any Google account to test)
   - Click **CREATE**

   **App Information:**
   - **App name**: `Creator Project Tracker` (or your app name)
   - **User support email**: Select your email from dropdown
   - **App logo**: (Optional) Upload if you have one
   - **Developer contact email**: Enter your email

   **Scopes:**
   - Click **ADD OR REMOVE SCOPES**
   - Search and add these scopes:
     - `https://www.googleapis.com/auth/youtube.readonly`
     - `https://www.googleapis.com/auth/yt-analytics.readonly`
   - Click **UPDATE**
   - Click **SAVE AND CONTINUE**

   **Test Users (IMPORTANT):**
   - Click **ADD USERS**
   - Add YOUR Google email address
   - Add any other test user emails
   - Click **SAVE AND CONTINUE**

   **Summary:**
   - Review and click **BACK TO DASHBOARD**

5. **Important**: Make sure the status shows **"Testing"** or **"In production"**

---

### 2. Required APIs Not Enabled

**Solution:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to: **APIs & Services** > **Library**
3. Search and **ENABLE** these APIs:
   - ✅ **YouTube Data API v3**
   - ✅ **YouTube Analytics API**

---

### 3. App Status is "Not Published"

If your app is in "Testing" mode, you MUST add test users.

**Solution:**
1. Go to **OAuth consent screen**
2. Under **"Test users"** section, click **ADD USERS**
3. Add the Google account(s) you'll use to test
4. Save

**OR** publish your app:
1. Click **PUBLISH APP** button
2. Confirm publishing (note: may require verification for sensitive scopes)

---

### 4. Redirect URI Not Added

**Solution:**
1. Go to: **APIs & Services** > **Credentials**
2. Click on your OAuth 2.0 Client ID: `1026985891044-fu1pfgajic1nj4jrm73odmt7d36ra18t`
3. Under **"Authorized redirect URIs"**, add:
   ```
   http://localhost:5001/api/youtube/oauth/callback
   ```
4. Click **SAVE**
5. Wait 5 minutes for changes to propagate

---

### 5. OAuth Client Type Mismatch

**Verify:**
1. Go to: **APIs & Services** > **Credentials**
2. Your OAuth client should be type: **"Web application"**
3. If it's "Desktop app" or other type, you need to create a new one

**Create new Web Application OAuth Client:**
1. Click **CREATE CREDENTIALS** > **OAuth 2.0 Client ID**
2. Select **"Web application"**
3. Name: `Creator Tracker Web Client`
4. Add Authorized redirect URIs:
   ```
   http://localhost:5001/api/youtube/oauth/callback
   http://127.0.0.1:5001/api/youtube/oauth/callback
   ```
5. Click **CREATE**
6. Copy new Client ID and Secret to your `.env` file

---

## Step-by-Step Fix (Recommended Order)

### Step 1: Configure OAuth Consent Screen
```
Google Cloud Console → APIs & Services → OAuth consent screen
→ User Type: External
→ Fill in app information
→ Add scopes (YouTube readonly + Analytics readonly)
→ Add your email as test user
→ Save
```

### Step 2: Enable Required APIs
```
Google Cloud Console → APIs & Services → Library
→ Search "YouTube Data API v3" → Enable
→ Search "YouTube Analytics API" → Enable
```

### Step 3: Verify OAuth Client Configuration
```
Google Cloud Console → APIs & Services → Credentials
→ Click your OAuth 2.0 Client ID
→ Verify Type: "Web application"
→ Add redirect URI: http://localhost:5001/api/youtube/oauth/callback
→ Save
```

### Step 4: Add Test User
```
Google Cloud Console → APIs & Services → OAuth consent screen
→ Scroll to "Test users"
→ Click "ADD USERS"
→ Add your Google email
→ Save
```

### Step 5: Wait & Test
```
→ Wait 5 minutes for changes to propagate
→ Clear browser cookies/cache
→ Try OAuth flow again
```

---

## Testing Checklist

Before testing again, verify:

- [ ] OAuth consent screen is configured (External, with app name)
- [ ] YouTube Data API v3 is **Enabled**
- [ ] YouTube Analytics API is **Enabled**
- [ ] Your email is added as a **Test User**
- [ ] OAuth Client Type is **Web application**
- [ ] Redirect URI `http://localhost:5001/api/youtube/oauth/callback` is added
- [ ] Waited 5 minutes after making changes
- [ ] Cleared browser cache/cookies

---

## Still Getting 403?

### Check These:

1. **Verify your Google account:**
   - Are you using the same Google account that's added as a test user?
   - Try with the exact email you added as test user

2. **Check OAuth consent screen status:**
   - Should show "Testing" or "Published"
   - Should NOT show "Needs Setup"

3. **Verify scopes in consent screen:**
   - Go to OAuth consent screen
   - Check "Scopes" section
   - Ensure YouTube scopes are listed

4. **Try incognito/private browsing:**
   - Clear all cookies
   - Open in private/incognito window
   - Try OAuth flow again

5. **Check API quotas:**
   - Go to: APIs & Services → Dashboard
   - Check if APIs have any quota issues

---

## Alternative: Use Google Test Account

If your main account has issues:

1. Create a new Google account specifically for testing
2. Add this new account as a test user in OAuth consent screen
3. Use this account to test the OAuth flow

---

## Common Error Messages

### "This app isn't verified"
**Solution:** Click "Advanced" → "Go to [App Name] (unsafe)"
This is normal for apps in testing mode.

### "Access blocked: Authorization Error"
**Solution:** Add your email as a test user in OAuth consent screen.

### "redirect_uri_mismatch"
**Solution:** Add the exact redirect URI to your OAuth client credentials.

---

## Production Deployment

For production (when ready):

1. **Publish your OAuth consent screen**
2. **Request OAuth verification** (if needed for sensitive scopes)
3. **Update redirect URIs** to production domain
4. **Update environment variables** for production

---

## Support Links

- [Google OAuth Console](https://console.cloud.google.com/apis/credentials)
- [OAuth Consent Screen](https://console.cloud.google.com/apis/credentials/consent)
- [API Library](https://console.cloud.google.com/apis/library)
- [Google OAuth Docs](https://developers.google.com/identity/protocols/oauth2)

---

**Most Common Fix:** Add your email as a test user in the OAuth consent screen, then wait 5 minutes and try again! 🎯
