# 🚀 Mobile App Setup - Complete Guide

## ✅ What's Been Done

### 1. Expo Configuration
- ✅ Converted from React Native CLI to Expo
- ✅ Created `app.json` with proper configuration
- ✅ Set Firebase Project ID: `app1-33f1b`
- ✅ Installed all dependencies

### 2. Android Configuration
- ✅ Created Android Gradle files
- ✅ Package name: `com.creatorprojecttracker.app`
- ✅ AndroidManifest.xml configured
- ✅ Firebase integration ready
- ✅ Build configuration complete

### 3. App Structure
- ✅ Simple working App.js with navigation
- ✅ Placeholder screens for all features
- ✅ Tab navigation configured
- ✅ Babel config for Expo

---

## 📱 Firebase Setup Required

### Get Your google-services.json

1. **Go to Firebase Console**
   - Visit: https://console.firebase.google.com
   - Select project: `app1-33f1b`

2. **Add Android App**
   - Click "Add app" → Select Android
   - **Android package name**: `com.creatorprojecttracker.app`
   - App nickname: Creator Project Tracker (optional)
   - Click "Register app"

3. **Download google-services.json**
   - Download the `google-services.json` file
   - Replace `/mobile/google-services.json` with the downloaded file

4. **Get Web Config** (for frontend)
   - In Firebase Console, go to Project Settings
   - Scroll to "Your apps"
   - Select Web app or create one
   - Copy the config values and update `.env`:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your-web-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=app1-33f1b.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=app1-33f1b
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=app1-33f1b.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

5. **Get Service Account** (for backend)
   - In Firebase Console → Project Settings → Service Accounts
   - Click "Generate new private key"
   - Download the JSON file
   - Extract these values to `.env`:

```bash
FIREBASE_PROJECT_ID=app1-33f1b
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@app1-33f1b.iam.gserviceaccount.com
```

6. **Enable Authentication**
   - In Firebase Console → Authentication
   - Click "Get Started"
   - Enable "Email/Password" sign-in method

---

## 🚀 Launch Instructions

### Option 1: Android Emulator (Recommended)

1. **Install Android Studio** (if not installed)
   - Download: https://developer.android.com/studio
   - Install Android SDK
   - Create a virtual device (AVD)

2. **Start Android Emulator**
   ```bash
   # Open Android Studio → AVD Manager → Start emulator
   # OR use command line:
   emulator -avd Pixel_5_API_33
   ```

3. **Start Expo**
   ```bash
   cd mobile
   npx expo start --android
   ```

### Option 2: Physical Android Device

1. **Enable Developer Options on your phone**
   - Go to Settings → About Phone
   - Tap "Build Number" 7 times
   - Go back → Developer Options → Enable USB Debugging

2. **Connect via USB**
   ```bash
   # Check device is connected
   adb devices
   
   # Start Expo
   cd mobile
   npx expo start --android
   ```

### Option 3: Expo Go App (Easiest)

1. **Install Expo Go**
   - Download from Google Play Store
   - Search "Expo Go"

2. **Start Expo Dev Server**
   ```bash
   cd mobile
   npx expo start
   ```

3. **Scan QR Code**
   - Open Expo Go app on your phone
   - Scan the QR code from terminal
   - App will load automatically

---

## 🐛 Troubleshooting

### "Metro bundler error"
```bash
cd mobile
rm -rf node_modules
npm install
npx expo start --clear
```

### "No Android emulator found"
```bash
# List available emulators
emulator -list-avds

# Start specific emulator
emulator -avd YOUR_AVD_NAME
```

### "Google Services error"
- Make sure `google-services.json` is in `/mobile/` directory
- Verify package name matches: `com.creatorprojecttracker.app`
- Re-download from Firebase Console if needed

### "Expo CLI not found"
```bash
npm install -g expo-cli
# OR use npx
npx expo start
```

### "Can't connect to dev server"
- Make sure your phone and computer are on the same WiFi
- Try using tunnel mode: `npx expo start --tunnel`
- Check firewall settings

---

## 📦 Current Package Name

**Android Package**: `com.creatorprojecttracker.app`

Use this exact package name when:
- Adding Android app in Firebase Console
- Configuring Google Sign-In
- Setting up any Android-specific services
- Publishing to Google Play Store

---

## 🎨 Placeholder Assets

The app currently uses placeholder assets. To add real assets:

1. **Create images** (or generate with AI):
   - `icon.png` - 1024x1024px (app icon)
   - `splash.png` - 1284x2778px (splash screen)
   - `adaptive-icon.png` - 1024x1024px (Android icon)
   - `favicon.png` - 64x64px (web icon)

2. **Add to `/mobile/assets/` directory**

3. **Rebuild app**:
   ```bash
   npx expo start --clear
   ```

---

## 🔥 Quick Test (Without Firebase)

You can test the app UI immediately without Firebase setup:

```bash
cd mobile
npx expo start
```

Then:
- Press `a` for Android
- Press `i` for iOS (Mac only)
- Press `w` for web
- Scan QR with Expo Go app

You'll see placeholder screens for all features.

---

## 📱 What Works Now

✅ Navigation structure
✅ Tab bar with 5 sections
✅ Placeholder screens
✅ Basic UI layout
✅ Expo dev environment

## 🔜 After Firebase Setup

- User authentication
- Push notifications
- Cloud storage
- Real-time data sync
- Firebase analytics

---

## 📝 Next Steps Priority

1. ✅ **DONE**: Build Next.js frontend (`npm run build`)
2. ✅ **DONE**: Create Android Gradle configuration
3. ⏳ **TODO**: Get `google-services.json` from Firebase
4. ⏳ **TODO**: Update `.env` with Firebase web config
5. ⏳ **TODO**: Update `.env` with Firebase service account
6. ⏳ **TODO**: Test authentication flow

---

## 🆘 Need Help?

### Expo Documentation
- Getting Started: https://docs.expo.dev/get-started/introduction/
- Android Build: https://docs.expo.dev/workflow/android-studio-emulator/
- Troubleshooting: https://docs.expo.dev/troubleshooting/overview/

### Firebase Documentation
- Android Setup: https://firebase.google.com/docs/android/setup
- Authentication: https://firebase.google.com/docs/auth/android/start

### Android Studio
- Download: https://developer.android.com/studio
- Emulator Setup: https://developer.android.com/studio/run/managing-avds

---

**Created**: $(date)
**Status**: Ready for testing
**Package**: com.creatorprojecttracker.app
**Firebase Project**: app1-33f1b
