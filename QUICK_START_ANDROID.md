# 🚀 QUICK START - Android App

## ⚡ Launch Everything (1 Command)

```bash
cd /Users/ihorromanenko/Desktop/test25
./launch.sh
```

This opens **3 terminal windows**:
1. **Backend** (Port 5001)
2. **Web** (Port 3000)  
3. **Mobile** (Expo)

---

## 📱 Run on Android

### Option A: Physical Device
1. Install **Expo Go** from Play Store
2. Open Expo Go app
3. Scan QR code from Terminal 3

### Option B: Emulator
1. Start Android emulator
2. In Terminal 3, press **`a`**

---

## 🌐 Access Your Apps

| Platform | URL |
|----------|-----|
| Web App | http://localhost:3000 |
| Backend API | http://localhost:5001 |
| Mobile (Expo) | Shown in Terminal 3 |

---

## ✅ What's Running

### Backend Features:
- MongoDB Atlas connected
- Calendar API
- Notifications API
- Stripe webhooks
- User authentication

### Web App Features:
- Calendar (create, edit, delete events)
- Notifications (read, delete, filter)
- Subscription system (success/error pages)
- User dashboard
- User badge system

### Android App Features:
- User authentication (login/register)
- Dashboard view
- Projects management
- Calendar events
- Brand deals tracking
- Settings & profile

---

## 🔄 Data Sync

All platforms share:
- ✅ Same backend (Port 5001)
- ✅ Same MongoDB database
- ✅ Same API endpoints
- ✅ Same authentication
- ✅ **Data syncs automatically!**

---

## 🧪 Quick Test

1. **Login on Web** → http://localhost:3000
2. **Create calendar event** on web
3. **Open Android app** → View same event
4. **Create project** on Android
5. **Refresh web** → See same project

---

## 🛑 Stop Everything

**Close all 3 Terminal windows**

Or run:
```bash
pkill -f "npm"
```

---

## 🔧 Troubleshooting

### Can't connect to backend on physical device?
1. Find your local IP:
   ```bash
   ifconfig | grep "inet " | grep -v 127.0.0.1
   ```
2. Edit `mobile/app.json`:
   ```json
   "extra": {
     "apiUrl": "http://YOUR_LOCAL_IP:5001"
   }
   ```
3. Restart mobile app

### Metro bundler error?
```bash
cd mobile
npm start -- --clear
```

### Port already in use?
```bash
lsof -ti:3000 | xargs kill
lsof -ti:5001 | xargs kill
```

---

## 📚 More Help

- `APP_LAUNCHED.md` - Full guide
- `ANDROID_LAUNCH_GUIDE.md` - Detailed Android setup
- `5_MINUTE_TEST.md` - Testing guide
- `COMPLETE_FEATURES_GUIDE.md` - All features

---

**You're all set! 🎉**

Your app is running on:
- 🌐 Web Browser
- 📱 Android (via Expo Go)
- 💾 MongoDB Atlas
- 🔐 Firebase Auth
- 💳 Stripe Payments
