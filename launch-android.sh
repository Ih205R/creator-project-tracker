#!/bin/bash

# 📱 Launch Android App Only
# This script starts the mobile app with Expo

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📱 Launching Android Mobile App"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

cd mobile

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing mobile dependencies..."
    npm install
    echo ""
fi

echo "🚀 Starting Expo..."
echo ""
echo "Options:"
echo "  📱 Physical Device: Install 'Expo Go' from Play Store, scan QR code"
echo "  🖥️  Emulator: Press 'a' to launch Android emulator"
echo "  🌐 Web: Press 'w' to open in web browser"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

npm start
