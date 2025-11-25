# 📱 Android App Launch Guide

## 🚀 Quick Launch - All Platforms

This guide will help you launch the **Android mobile app**, **Next.js web frontend**, and **Express backend** simultaneously.

---

## ✅ Prerequisites

### Required Software
- [ ] **Node.js** 18+ installed
- [ ] **Android Studio** installed
- [ ] **Java Development Kit (JDK)** 11 or higher
- [ ] **Android SDK** configured
- [ ] **Expo CLI** installed globally: `npm install -g expo-cli`

### For Physical Android Device
- [ ] USB debugging enabled
- [ ] Device connected via USB
- [ ] ADB drivers installed

### For Android Emulator
- [ ] Android emulator created in Android Studio
- [ ] Emulator running

---

## 🎯 Option 1: Launch Everything (Recommended)

### Step 1: Start Backend Server
```bash
# Terminal 1
cd /Users/ihorromanenko/Desktop/test25/backend
npm run dev
```

**Expected Output:**
```
Server running on port 5001
✅ MongoDB connected successfully
```

### Step 2: Start Next.js Frontend (Web)
```bash
# Terminal 2
cd /Users/ihorromanenko/Desktop/test25
npm run dev
```

**Expected Output:**
```
Ready on http://localhost:3000
```

### Step 3: Start Android App
```bash
# Terminal 3
cd /Users/ihorromanenko/Desktop/test25/mobile
npm start
```

This will open Expo Dev Tools in your browser.

### Step 4: Run on Android

**Option A - Physical Device:**
1. Install Expo Go app from Google Play Store
2. Scan QR code from Terminal 3
3. App will load on your device

**Option B - Android Emulator:**
```bash
# In Terminal 3, press 'a' or run:
npm run android
```

---

## 🎯 Option 2: One-Command Launch Script

Let me create a launch script for you:

<function_calls>
<invoke name="create_file">
<parameter name="content">#!/bin/bash

# Launch All Platforms - Android App + Web + Backend
# This script launches the backend, web frontend, and Android mobile app

echo "=================================================="
echo "Creator Project Tracker - Launch All Platforms"
echo "=================================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "Node.js detected: $(node --version)"
echo ""

# Check if running on macOS
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "🍎 macOS detected - Will open new Terminal windows"
    IS_MAC=true
else
    echo "🐧 Linux/Other OS detected"
    IS_MAC=false
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 Starting Services..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Start Backend
echo "1️⃣  Starting Backend Server (Port 5001)..."
if [ "$IS_MAC" = true ]; then
    osascript -e 'tell app "Terminal" to do script "cd '"$(pwd)"'/backend && echo \"🔧 Backend Server Starting...\" && npm run dev"'
else
    cd backend && npm run dev > ../logs/backend.log 2>&1 &
    echo "   Backend PID: $!"
    cd ..
fi
sleep 2

# Start Web Frontend
echo "2️⃣  Starting Web Frontend (Port 3000)..."
if [ "$IS_MAC" = true ]; then
    osascript -e 'tell app "Terminal" to do script "cd '"$(pwd)"' && echo \"🌐 Web Frontend Starting...\" && npm run dev"'
else
    npm run dev > logs/frontend.log 2>&1 &
    echo "   Frontend PID: $!"
fi
sleep 3

# Start Mobile App
echo "3️⃣  Starting Android Mobile App..."
if [ "$IS_MAC" = true ]; then
    osascript -e 'tell app "Terminal" to do script "cd '"$(pwd)"'/mobile && echo \"📱 Mobile App Starting...\" && echo \"\" && echo \"Choose an option:\" && echo \"  Press 'a' for Android Emulator\" && echo \"  Scan QR code with Expo Go for Physical Device\" && echo \"\" && npm start"'
else
    cd mobile && npm start > ../logs/mobile.log 2>&1 &
    echo "   Mobile PID: $!"
    cd ..
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ All Services Starting!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📍 Access Points:"
echo "   🌐 Web App:      http://localhost:3000"
echo "   ⚙️  Backend API:  http://localhost:5001"
echo "   📱 Mobile App:   Expo Dev Tools (will open in browser)"
echo ""
echo "📱 To Run Android App:"
echo "   • Physical Device: Install Expo Go, scan QR code"
echo "   • Emulator: Press 'a' in the Mobile terminal window"
echo ""
echo "🛑 To Stop All Services:"
echo "   • macOS: Close all Terminal windows"
echo "   • Linux: Run: pkill -f \"npm run dev\""
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Wait a bit for services to start
sleep 5

# Open Web Frontend in browser
if command -v open &> /dev/null; then
    echo "🌐 Opening Web Frontend in browser..."
    open http://localhost:3000
elif command -v xdg-open &> /dev/null; then
    echo "🌐 Opening Web Frontend in browser..."
    xdg-open http://localhost:3000
fi

echo ""
echo "✨ All services should now be running!"
echo "   Check the separate terminal windows for logs."
echo ""
