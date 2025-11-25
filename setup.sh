#!/bin/bash

echo "🚀 Creator Project Tracker - Setup Script"
echo "=========================================="
echo ""

# Check Node.js version
echo "📦 Checking Node.js version..."
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Error: Node.js 18 or higher is required"
    exit 1
fi
echo "✅ Node.js version OK"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install
echo "✅ Dependencies installed"
echo ""

# Setup environment file
if [ ! -f .env ]; then
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
    echo "⚠️  Please update .env with your actual credentials"
    echo ""
else
    echo "✅ .env file already exists"
    echo ""
fi

# Check for required environment variables
echo "🔍 Checking environment configuration..."
if [ -f .env ]; then
    source .env
    
    MISSING_VARS=()
    
    [ -z "$MONGODB_URI" ] && MISSING_VARS+=("MONGODB_URI")
    [ -z "$FIREBASE_PROJECT_ID" ] && MISSING_VARS+=("FIREBASE_PROJECT_ID")
    [ -z "$STRIPE_SECRET_KEY" ] && MISSING_VARS+=("STRIPE_SECRET_KEY")
    [ -z "$OPENAI_API_KEY" ] && MISSING_VARS+=("OPENAI_API_KEY")
    
    if [ ${#MISSING_VARS[@]} -gt 0 ]; then
        echo "⚠️  Missing environment variables:"
        for var in "${MISSING_VARS[@]}"; do
            echo "   - $var"
        done
        echo ""
        echo "Please update .env file with these values"
        echo ""
    else
        echo "✅ All required environment variables are set"
        echo ""
    fi
fi

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p public/uploads
mkdir -p backend/logs
echo "✅ Directories created"
echo ""

# Setup Git hooks (optional)
if [ -d .git ]; then
    echo "🔧 Setting up Git hooks..."
    cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
npm run lint --if-present
EOF
    chmod +x .git/hooks/pre-commit
    echo "✅ Git hooks configured"
    echo ""
fi

echo "✨ Setup Complete!"
echo ""
echo "Next steps:"
echo "1. Update .env with your credentials"
echo "2. Start MongoDB (if running locally)"
echo "3. Run 'npm run backend:dev' in one terminal"
echo "4. Run 'npm run dev' in another terminal"
echo "5. Visit http://localhost:3000"
echo ""
echo "For mobile app setup:"
echo "cd mobile && npm install"
echo ""
echo "For more information, see README.md"
echo ""
echo "Happy coding! 🎉"
