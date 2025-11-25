#!/bin/bash

# 🚀 Quick Start Script - Creator Project Tracker
# This script helps you start the application quickly

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 Creator Project Tracker - Quick Start"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js detected: $(node --version)"
echo ""

# Check if MongoDB connection string exists
if ! grep -q "MONGODB_URI" .env 2>/dev/null; then
    echo "⚠️  Warning: .env file not found or missing MONGODB_URI"
    echo "   Please ensure .env file exists with all required variables"
    echo ""
fi

# Function to check if port is available
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo "⚠️  Port $1 is already in use"
        echo "   Please close the application using port $1 or choose a different port"
        return 1
    else
        echo "✅ Port $1 is available"
        return 0
    fi
}

# Check required ports
echo "Checking required ports..."
check_port 3000 || { echo ""; }
check_port 5001 || { echo ""; }
echo ""

# Install dependencies if needed
echo "📦 Checking dependencies..."

if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi

if [ ! -d "backend/node_modules" ]; then
    echo "Installing backend dependencies..."
    cd backend && npm install && cd ..
fi

echo "✅ Dependencies ready"
echo ""

# Display configuration info
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 Configuration"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Frontend URL: http://localhost:3000"
echo "Backend URL:  http://localhost:5001"
echo "Database:     MongoDB Atlas (languageApp)"
echo ""
echo "📍 Quick Links:"
echo "  Dashboard:      http://localhost:3000/dashboard"
echo "  Calendar:       http://localhost:3000/dashboard/calendar"
echo "  Notifications:  http://localhost:3000/dashboard/notifications"
echo "  Upgrade:        http://localhost:3000/dashboard/upgrade"
echo "  Settings:       http://localhost:3000/dashboard/settings"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Ask user what to start
echo "What would you like to start?"
echo ""
echo "1) Start both Frontend & Backend (recommended)"
echo "2) Start Frontend only"
echo "3) Start Backend only"
echo "4) Run tests"
echo "5) Exit"
echo ""
read -p "Enter your choice (1-5): " choice

case $choice in
    1)
        echo ""
        echo "🚀 Starting both Frontend & Backend..."
        echo ""
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo "📝 IMPORTANT:"
        echo "   - Backend will start in a new terminal window"
        echo "   - Frontend will start in this terminal"
        echo "   - Keep both terminals open while using the app"
        echo "   - Press Ctrl+C to stop servers"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo ""
        
        # Start backend in new terminal (macOS)
        if [[ "$OSTYPE" == "darwin"* ]]; then
            osascript -e 'tell app "Terminal" to do script "cd '"$(pwd)"'/backend && npm run dev"'
            sleep 3
        else
            # For Linux/Windows, start in background
            cd backend && npm run dev > backend.log 2>&1 &
            BACKEND_PID=$!
            echo "Backend started with PID: $BACKEND_PID"
            cd ..
        fi
        
        # Start frontend
        echo "Starting frontend..."
        npm run dev
        ;;
        
    2)
        echo ""
        echo "🎨 Starting Frontend only..."
        echo "   Backend URL: http://localhost:5001"
        echo "   Make sure backend is running separately!"
        echo ""
        npm run dev
        ;;
        
    3)
        echo ""
        echo "⚙️  Starting Backend only..."
        echo "   API URL: http://localhost:5001"
        echo "   Health check: http://localhost:5001/health"
        echo ""
        cd backend && npm run dev
        ;;
        
    4)
        echo ""
        echo "🧪 Running tests..."
        echo ""
        npm test
        ;;
        
    5)
        echo ""
        echo "👋 Goodbye!"
        exit 0
        ;;
        
    *)
        echo ""
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac
