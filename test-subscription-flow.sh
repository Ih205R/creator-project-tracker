#!/bin/bash

# Subscription Flow Test Helper
# This script helps you test the complete subscription flow

echo "🧪 Subscription Flow Test Helper"
echo "=================================="
echo ""

# Check if email provided
if [ -z "$1" ]; then
    echo "Usage: ./test-subscription-flow.sh <email>"
    echo "Example: ./test-subscription-flow.sh user@example.com"
    exit 1
fi

EMAIL=$1

echo "📧 Testing subscription flow for: $EMAIL"
echo ""

# Step 1: Check current status
echo "Step 1: Checking current user status..."
echo "----------------------------------------"
cd backend
node check-user-status.js "$EMAIL"
echo ""

# Step 2: Instructions for purchase
echo "Step 2: Make a test purchase"
echo "----------------------------------------"
echo "1. Open your browser to http://localhost:3000"
echo "2. Log in with: $EMAIL"
echo "3. Go to /dashboard/upgrade"
echo "4. Select a plan (Premium recommended)"
echo "5. Use Stripe test card: 4242 4242 4242 4242"
echo "6. Complete the purchase"
echo ""
echo "Press ENTER when you've completed the purchase..."
read

# Step 3: Wait for webhook
echo ""
echo "Step 3: Waiting for webhook processing..."
echo "----------------------------------------"
echo "Waiting 5 seconds for Stripe webhook to process..."
sleep 5
echo "✅ Done waiting"
echo ""

# Step 4: Check updated status
echo "Step 4: Checking updated user status..."
echo "----------------------------------------"
node check-user-status.js "$EMAIL"
echo ""

# Step 5: Verification checklist
echo "Step 5: Manual Verification Checklist"
echo "----------------------------------------"
echo ""
echo "Please verify the following in your browser:"
echo ""
echo "□ Success page showed confetti animation"
echo "□ Session data loaded (plan name, price shown)"
echo "□ Dashboard button clicked successfully"
echo "□ Sidebar shows subscription badge (⭐ Premium/Pro/Lite)"
echo "□ NO 'Upgrade to Pro' button in sidebar"
echo "□ NO PRO badges on AI Tools, Analytics, Branding, Integrations"
echo "□ Can access /dashboard/ai-tools"
echo "□ Can access /dashboard/analytics"
echo "□ Can access /dashboard/branding"
echo "□ Can access /dashboard/integrations"
echo "□ Profile page shows colored subscription card"
echo ""
echo "Browser Console Logs to Check:"
echo "□ '✅ Profile refreshed' appeared multiple times"
echo "□ '🔍 isPro check: { isPro: true }' appeared"
echo ""
echo "Backend Terminal Logs to Check:"
echo "□ '✅ Updated subscription for user' appeared"
echo "□ 'Plan: Premium' (or your selected plan) appeared"
echo ""
echo "If any checks FAILED:"
echo "1. Check browser console (F12) for errors"
echo "2. Check backend terminal for errors"
echo "3. Run: node check-user-status.js $EMAIL"
echo "4. If needed, fix manually: node fix-user-subscription.js $EMAIL Premium"
echo ""
echo "=================================="
echo "Test helper complete!"
