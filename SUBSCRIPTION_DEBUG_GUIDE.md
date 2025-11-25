# Subscription Badge & Pro Access Debug Guide

## Problem Description
After purchasing a Premium subscription, the subscription badge is not displayed and Pro features are not accessible.

## Fixes Applied

### 1. Enhanced AuthContext (contexts/AuthContext.js)
- ✅ Improved `isPro` logic with explicit checks for Lite, Pro, and Premium plans
- ✅ Added comprehensive logging for debugging
- ✅ Multiple profile refresh attempts with delays

### 2. Enhanced Backend Logging (backend/controllers/stripeController.js)
- ✅ Added detailed logging for subscription updates
- ✅ Enhanced price ID matching with all environment variables
- ✅ Added fallback plan detection based on price ID patterns
- ✅ Improved session data retrieval with full user profile

### 3. Enhanced Subscription Success Page (app/subscription/success/page.js)
- ✅ Multiple profile refresh attempts with delays
- ✅ Wait for webhook processing before refreshing
- ✅ Enhanced error handling and logging

## How to Debug

### Step 1: Check Environment Variables
Open your `.env` file and verify all price IDs are correct:

```bash
# Monthly Plans
STRIPE_LITE_MONTHLY=price_1SU8tUJBI9K8r3FqawHSWcCr
STRIPE_PRO_MONTHLY=price_1SU8thJBI9K8r3Fq8R7forbV
STRIPE_PREMIUM_MONTHLY=price_1SU8tsJBI9K8r3FqeDiLDiV9

# Annual Plans
STRIPE_LITE_ANNUAL=price_1SU8v0JBI9K8r3FqK5G0Iue7
STRIPE_PRO_ANNUAL=price_1SU8vUJBI9K8r3FqK4JbUVXy
STRIPE_PREMIUM_ANNUAL=price_1SU94TJBI9K8r3FqUHWQpFIk
```

### Step 2: Open Browser Console
1. Open your browser's developer tools (F12 or Cmd+Option+I)
2. Go to the Console tab
3. Look for these log messages:

**On Subscription Success Page:**
- 🔄 Fetching session data for: [session_id]
- ✅ Session data received: { planName, status, userRole, userPlan }
- ⏳ Waiting 2 seconds for webhook processing...
- 🔄 Refreshing user profile...
- ✅ Profile refreshed: { role, subscriptionStatus, subscriptionPlan }

**On Any Page After Login:**
- 🔍 isPro check: { isPro, role, status, plan }

### Step 3: Check Backend Logs
In your terminal running the backend, look for:

```
📥 Getting session data for: [session_id]
✅ Session retrieved: { id, customer, payment_status }
💳 Payment successful, updating subscription...
🔄 Handling subscription update for customer: [customer_id]
💰 Price ID: [price_id]
✅ Matched Premium plan
✅ Updated subscription for user [email]
   Plan: Premium
   Status: active
   Role: pro_user
```

### Step 4: Check Database Directly
If you have MongoDB access, run this query to check user data:

```javascript
db.users.findOne({ email: "your-email@example.com" })
```

Expected result after purchase:
```javascript
{
  role: "pro_user",
  subscriptionStatus: "active",
  subscriptionPlan: "Premium",  // or "Lite" or "Pro"
  subscriptionId: "sub_xxxxx",
  subscriptionPeriodEnd: ISODate("2025-...")
}
```

## Testing Steps

### Test 1: Make a Test Purchase
1. Go to http://localhost:3000/dashboard/upgrade
2. Select a plan (Premium recommended)
3. Use Stripe test card: `4242 4242 4242 4242`
4. Complete the purchase
5. You should be redirected to `/subscription/success`

### Test 2: Check Console Logs
1. Open browser console before making purchase
2. Watch for log messages during the redirect
3. Look for:
   - Session data fetch
   - Profile refresh attempts (should happen 2-3 times)
   - isPro status update

### Test 3: Navigate to Pro Pages
After successful purchase, try accessing:
- `/dashboard/ai-tools` - Should work
- `/dashboard/analytics` - Should work
- `/dashboard/branding` - Should work
- `/dashboard/integrations` - Should work

### Test 4: Check Badge Display
The subscription badge should appear in:
1. **Sidebar** (bottom section) - Should show "⭐ Premium" (or your plan name)
2. **Profile Page** - Should show colored badge with plan details
3. **Dashboard Layout** - PRO badges should disappear from menu items

## Common Issues & Solutions

### Issue 1: Badge Not Showing
**Symptom:** User can access Pro features but badge doesn't appear

**Solution:**
```bash
# Force refresh the page
Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)

# Or clear browser cache and refresh
```

### Issue 2: No Pro Access After Purchase
**Symptom:** Badge shows but features are locked

**Check:**
1. Browser console for `isPro` value
2. Backend logs for subscription update
3. User profile in database

**Fix:**
```bash
# Restart both servers
cd backend && pkill -f "node.*server.js" && node server.js &
cd .. && pkill -f "next dev" && npm run dev
```

### Issue 3: Price ID Not Matching
**Symptom:** Backend logs show "⚠️ Unknown price ID"

**Solution:**
1. Check the price ID in backend logs
2. Verify it matches your `.env` file
3. Update `.env` with correct price ID
4. Restart backend server

### Issue 4: Webhook Not Processing
**Symptom:** Session succeeds but user not updated

**Solution:**
1. Check if Stripe webhook is configured
2. Test webhook locally with Stripe CLI:
```bash
stripe listen --forward-to localhost:5001/api/stripe/webhook
```
3. The session data endpoint also updates user, so webhook issues won't block updates

## Manual Fix for Existing User

If you already purchased but don't have access, you can manually update the database:

### Using MongoDB Compass or CLI:
```javascript
db.users.updateOne(
  { email: "your-email@example.com" },
  {
    $set: {
      role: "pro_user",
      subscriptionStatus: "active",
      subscriptionPlan: "Premium"  // or "Lite" or "Pro"
    }
  }
)
```

### Using Backend API (after implementing an admin endpoint):
```bash
curl -X POST http://localhost:5001/api/admin/update-subscription \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your-email@example.com",
    "plan": "Premium",
    "status": "active"
  }'
```

## Expected Behavior

### After Successful Purchase:
1. ✅ Redirected to `/subscription/success`
2. ✅ Confetti animation plays
3. ✅ Session data loads within 2-3 seconds
4. ✅ Profile refreshes automatically (2-3 times)
5. ✅ Badge appears in sidebar showing plan name
6. ✅ PRO badges disappear from menu items
7. ✅ All Pro pages are accessible
8. ✅ Profile page shows colored plan card

### In Dashboard Sidebar:
```
Bottom section should show:
┌────────────────────────────┐
│ [Avatar] User Name         │
│         ⭐ Premium          │ ← Should appear for paid plans
│                            │
│ ✨ Upgrade to Pro          │ ← Should NOT appear for paid users
│ Sign Out                   │
└────────────────────────────┘
```

### In Menu Items:
- AI Tools [NO PRO BADGE]
- Analytics [NO PRO BADGE]
- Branding [NO PRO BADGE]
- Integrations [NO PRO BADGE]

## Still Having Issues?

### 1. Check All Logs
- Browser Console (F12)
- Backend Terminal
- MongoDB logs

### 2. Verify Data Flow
```
Purchase → Stripe Checkout → Webhook/Session Endpoint → 
Database Update → Profile Refresh → UI Update
```

### 3. Test Each Step
- Can you see session data in backend logs?
- Is user updated in database?
- Does profile refresh succeed?
- Is isPro computed correctly?

### 4. Contact Support
If issues persist, provide:
- Browser console logs (copy all)
- Backend terminal logs
- User email address
- Stripe session ID (from URL after purchase)

## Success Indicators

You'll know everything is working when you see:
1. 👤 Backend logs: "✅ Updated subscription for user [email]"
2. 🔍 Browser console: "isPro: true"
3. ⭐ Sidebar shows your plan badge
4. 🎯 All Pro pages are accessible
5. 📊 Profile page shows colored plan card
