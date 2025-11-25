# 🔧 Android Authentication Fix Guide

## Issues Fixed

### 1. ✅ Firebase Configuration
**Problem**: Mobile app was using placeholder Firebase API keys
**Solution**: Updated `mobile/app.json` with real Firebase credentials from `.env`

```json
"extra": {
  "firebaseApiKey": "AIzaSyB5txnMBnYzOnfBEcPF-vidM35Fm67a5DM",
  "firebaseMessagingSenderId": "721842592810",
  "firebaseAppId": "1:721842592810:android:cf23d9947c9d54b7faf753",
  ...
}
```

### 2. ✅ API URL for Android Emulator
**Problem**: Backend API URL was set to `localhost:5000`, which doesn't work in Android emulator
**Solution**: Changed to `10.0.2.2:5000` (Android emulator's special alias for host machine)

- Updated `mobile/app.json` extra.apiUrl
- Updated `mobile/src/contexts/AuthContext.js` API URL

## How to Test

### Step 1: Restart Metro Bundler
```bash
# Stop the current Expo process (Ctrl+C)
cd /Users/ihorromanenko/Desktop/test25/mobile
npx expo start --clear
```

### Step 2: Reload App
- In the running Android emulator, press `R` twice (or shake device)
- Or press `r` in the Metro Bundler terminal to reload

### Step 3: Test Sign Up
1. Open the app in emulator
2. Click "Create New Account"
3. Fill in:
   - Full Name: Test User
   - Email: test@example.com
   - Password: password123
   - Confirm Password: password123
4. Click "Sign Up"
5. Should see success alert and navigate to dashboard

### Step 4: Test Login
1. Log out from dashboard settings
2. Use the same credentials to log in
3. Should successfully reach dashboard

## Additional Notes

### Network Requirements
- **Backend must be running** on port 5000
- Check backend is accessible: `curl http://localhost:5000/api/health`

### For Physical Android Device
If testing on a physical device instead of emulator:
1. Connect device and computer to same WiFi
2. Find your computer's IP address: `ipconfig getifaddr en0` (macOS)
3. Update API URL in `mobile/app.json`:
   ```json
   "apiUrl": "http://YOUR_IP_ADDRESS:5000"
   ```
4. Update in `mobile/src/contexts/AuthContext.js` as well

### Common Issues

#### Issue: "Network request failed"
- **Cause**: Backend not running or wrong API URL
- **Fix**: Verify backend is running on port 5000

#### Issue: "Firebase: Error (auth/invalid-api-key)"
- **Cause**: Firebase config not loaded properly
- **Fix**: Clear cache and rebuild: `npx expo start --clear`

#### Issue: "Cannot connect to backend"
- **Cause**: Using `localhost` instead of `10.0.2.2`
- **Fix**: Verify app.json and AuthContext.js have correct URLs

## Verification Checklist

- [ ] Backend running on port 5000
- [ ] Mobile app restarted with `--clear` flag
- [ ] Firebase API key in app.json is real (not placeholder)
- [ ] API URL is `10.0.2.2:5000` for emulator
- [ ] Sign up creates new account successfully
- [ ] Login works with created account
- [ ] User data appears in MongoDB
- [ ] Navigation to dashboard works

## Files Modified

1. `/mobile/app.json` - Updated Firebase credentials and API URL
2. `/mobile/src/contexts/AuthContext.js` - Fixed backend API URL for emulator

## Next Steps

After auth is working:
1. Test all dashboard features (projects, calendar, notifications)
2. Test subscription upgrade flow
3. Test settings and logout
4. Build APK for distribution: `cd mobile && eas build --platform android`
