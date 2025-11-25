#!/bin/bash

echo "=================================================="
echo "Launching: Backend + Web + Android Mobile App"
echo "=================================================="
echo ""

# Start Backend in new terminal
echo "1. Starting Backend Server..."
osascript -e 'tell app "Terminal" to do script "cd '"$(pwd)"'/backend && echo \"BACKEND SERVER\" && echo \"Port: 5001\" && echo \"\" && npm run dev"'
sleep 3

# Start Web Frontend in new terminal  
echo "2. Starting Web Frontend..."
osascript -e 'tell app "Terminal" to do script "cd '"$(pwd)"' && echo \"WEB FRONTEND\" && echo \"Port: 3000\" && echo \"\" && npm run dev"'
sleep 3

# Start Mobile App in new terminal
echo "3. Starting Mobile App..."
osascript -e 'tell app "Terminal" to do script "cd '"$(pwd)"'/mobile && echo \"ANDROID MOBILE APP\" && echo \"Press a for Android Emulator\" && echo \"Or scan QR with Expo Go app\" && echo \"\" && npm start"'

echo ""
echo "=================================================="
echo "All services are starting in separate terminals!"
echo "=================================================="
echo ""
echo "Access URLs:"
echo "  Web:    http://localhost:3000"
echo "  API:    http://localhost:5001"
echo "  Mobile: Check the Expo terminal"
echo ""
echo "For Android:"
echo "  - Emulator: Press 'a' in mobile terminal"
echo "  - Device: Scan QR with Expo Go app"
echo ""
