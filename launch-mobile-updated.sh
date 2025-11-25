#!/bin/bash

# Mobile App Relaunch Script
# Restarts the Expo app with the new synchronized design

echo "🚀 Relaunching Mobile App with Updated Design..."
echo ""

# Navigate to mobile directory
cd "$(dirname "$0")/mobile" || exit 1

echo "📱 Step 1: Clearing Metro Bundler cache..."
npx expo start --clear &

EXPO_PID=$!
echo "✅ Expo started with PID: $EXPO_PID"
echo ""

echo "🎨 Design Updates Applied:"
echo "  ✅ Professional Ionicons (no more emojis)"
echo "  ✅ Modern Dashboard with Pro badges"
echo "  ✅ Updated Settings screen"
echo "  ✅ Synchronized color scheme"
echo "  ✅ Enhanced AuthContext with Pro features"
echo ""

echo "📋 Next Steps:"
echo "  1. Wait for Expo to start (~10-15 seconds)"
echo "  2. Press 'a' to launch on Android emulator"
echo "  3. Or scan QR code with Expo Go app"
echo ""

echo "🧪 Testing Checklist:"
echo "  □ Dashboard shows modern icons (not emojis)"
echo "  □ Pro badge visible for Pro users"
echo "  □ Settings shows colored icon containers"
echo "  □ Navigation bar has Ionicons"
echo "  □ Pull-to-refresh works on Dashboard"
echo "  □ Logout functionality works"
echo ""

echo "📚 Documentation:"
echo "  - Full details: MOBILE_APP_SYNCHRONIZED.md"
echo "  - Testing guide: MOBILE_APP_TEST_GUIDE.md"
echo ""

echo "✨ Mobile app is launching with the new design!"
echo "Press Ctrl+C to stop"
echo ""

# Keep script running
wait $EXPO_PID
