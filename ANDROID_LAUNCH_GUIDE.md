# �� Android App Launch Guide

## 🚀 Launch Everything - Quick Start

### Option 1: Use Launch Script (Easiest)
```bash
./launch-all.sh
```
This will open 3 Terminal windows:
- Terminal 1: Backend Server (Port 5001)
- Terminal 2: Web Frontend (Port 3000)
- Terminal 3: Mobile App (Expo)

### Option 2: Manual Launch (Step-by-Step)

#### Terminal 1 - Backend
```bash
cd backend
npm run dev
```

#### Terminal 2 - Web Frontend
```bash
npm run dev
```

#### Terminal 3 - Android App
```bash
cd mobile
npm start
```

---

## 📱 Running on Android Device

### Physical Android Device

1. **Install Expo Go**
   - Open Google Play Store
   - Search for "Expo Go"
   - Install the app

2. **Enable Developer Options**
   - Go to Settings > About Phone
   - Tap "Build Number" 7 times
   - Go back to Settings > Developer Options
   - Enable "USB Debugging"

3. **Connect and Run**
   - Connect device via USB
   - Allow USB debugging on device
   - In Terminal 3, scan QR code with Expo Go app
   - OR press `a` to auto-detect connected device

### Android Emulator

1. **Setup Emulator (First Time)**
   ```bash
   # Open Android Studio
   # Go to: Tools > Device Manager
   # Create Virtual Device
   # Choose: Pixel 5 or similar
   # System Image: Android 13 (API 33) or higher
   # Finish and launch emulator
   ```

2. **Run App**
   - Make sure emulator is running
   - In Terminal 3, press `a`
   - App will install and launch automatically

---

## 🌐 Backend API Configuration

The mobile app needs to connect to your backend API. Update the API URL:

### For Physical Device
```bash
cd mobile
# Edit app.json
# Update "extra.apiUrl" to your computer's local IP
```

**Find your local IP:**
```bash
# macOS/Linux
ifconfig | grep "inet " | grep -v 127.0.0.1

# Windows
ipconfig
```

**Example:**
```json
"extra": {
  "apiUrl": "http://192.168.1.100:5001"
}
```

### For Emulator
```json
"extra": {
  "apiUrl": "http://10.0.2.2:5001"
}
```
*(10.0.2.2 is the special IP that Android emulator uses to reach localhost)*

---

## 🔧 Troubleshooting

### Issue: "Metro bundler error"
```bash
cd mobile
rm -rf node_modules
npm install
npm start -- --clear
```

### Issue: "Cannot connect to backend"
1. Check backend is running on port 5001
2. Update `apiUrl` in `mobile/app.json`
3. For physical device, use your computer's local IP
4. For emulator, use `10.0.2.2:5001`

### Issue: "Android build failed"
```bash
cd mobile/android
./gradlew clean
cd ..
npm run android
```

### Issue: "Expo Go not detecting QR code"
- Make sure phone and computer are on same WiFi
- Check firewall isn't blocking port 19000
- Try using tunnel: `npm start -- --tunnel`

### Issue: "App crashes on launch"
1. Check backend is running
2. Verify Firebase configuration in `.env`
3. Check mobile console logs: `npx react-native log-android`

---

## 📊 Feature Parity

### ✅ Android App Has:
- ✅ User Authentication (Firebase)
- ✅ Dashboard View
- ✅ Projects Management
- ✅ Calendar View
- ✅ Brand Deals Tracking
- ✅ Settings & Profile

### 🔄 Needs Implementation:
- ⏳ Notifications Page (from web app)
- ⏳ Subscription Management UI
- ⏳ Success/Error pages for subscriptions

### 🎯 Backend Shared:
- ✅ Same Express.js backend (Port 5001)
- ✅ Same MongoDB database
- ✅ Same API endpoints
- ✅ Same authentication system

---

## 🧪 Test the App

### 1. Test Authentication
- Open Android app
- Register new account or login
- Verify user appears in MongoDB

### 2. Test Projects
- Create a project
- Edit project details
- Verify syncs with web app

### 3. Test Calendar
- View calendar events
- Create new event
- Verify appears in web app

### 4. Test Brand Deals
- Add brand deal
- Update status
- Verify in database

---

## 📱 Build for Production

### Development Build
```bash
cd mobile
npx expo run:android
```

### Production APK
```bash
cd mobile
eas build --platform android
```
*(Requires Expo EAS account)*

### Release to Play Store
1. Sign up for Google Play Developer account ($25)
2. Configure signing keys
3. Build release APK
4. Upload to Play Console
5. Submit for review

---

## 🎯 Quick Commands

### Start Everything
```bash
./launch-all.sh
```

### Start Android Only
```bash
./launch-android.sh
```

### Start Backend Only
```bash
cd backend && npm run dev
```

### Start Web Only
```bash
npm run dev
```

### View Android Logs
```bash
npx react-native log-android
```

### Restart Metro Bundler
```bash
cd mobile
npm start -- --reset-cache
```

---

## 🆘 Need Help?

### Check Logs
- **Backend:** Check Terminal 1
- **Web:** Check Terminal 2 and browser console (F12)
- **Mobile:** Check Terminal 3 and `npx react-native log-android`

### Common Issues
1. **Port conflicts:** Kill processes on ports 3000, 5001, 19000
2. **Dependencies:** Run `npm install` in root, backend, and mobile folders
3. **Cache:** Clear with `npm start -- --clear` in mobile folder
4. **Emulator:** Restart Android emulator if freezing

---

## ✅ Success Checklist

- [ ] Backend running on port 5001
- [ ] Web app running on port 3000
- [ ] Expo dev tools running (port 19000)
- [ ] Android emulator running OR physical device connected
- [ ] Expo Go installed (for physical device)
- [ ] QR code scanning OR press 'a' for emulator
- [ ] App loads successfully
- [ ] Can login/register
- [ ] Can view dashboard
- [ ] API calls working

---

**All Set! 🎉**

You now have:
- ✅ Web App (Next.js)
- ✅ Mobile App (React Native + Expo)
- ✅ Backend API (Express + MongoDB)
- ✅ Shared Database
- ✅ Same Authentication

**Platform Support:**
- 🌐 Web Browser
- 📱 Android (Expo Go or Native)
- 🍎 iOS (Expo Go or Native)
- 💻 Desktop (via web browser)

