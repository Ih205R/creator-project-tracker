# 🐛 DEBUGGING GUIDE - Premium Badge Not Showing

## Quick Fix Steps

### 1. **Open Debug Dashboard**
Navigate to: **http://localhost:3000/dashboard/debug**

This page will show you:
- ✅ Your Firebase user data
- ✅ Your user profile from MongoDB
- ✅ isPro calculation breakdown
- ✅ Raw API response from backend

### 2. **Check Browser Console**
1. Press `F12` (or right-click → Inspect)
2. Click on **Console** tab
3. Look for these logs:
   - `📡 API: Fetching user profile...`
   - `📡 API: Profile response:`
   - `🔄 Refreshing profile...`
   - `✅ Profile refreshed:`
   - `🔍 isPro check:`
   - `🎨 Dashboard Layout - User Profile:`

### 3. **What You Should See**

If your Premium is working, the console should show:
```javascript
🔍 isPro check: {
  isPro: true,
  role: "pro_user",
  status: "active",
  plan: "Premium"
}
```

And in the sidebar, you should see:
- **⭐ Premium** badge next to your name
- NO "PRO" badges on AI Tools, Analytics, Branding, Integrations
- NO "Upgrade to Pro" button

### 4. **Common Issues & Fixes**

#### Issue: Console shows correct data but UI doesn't update
**Fix:** Hard refresh the page
- **Mac:** `Cmd + Shift + R`
- **Windows/Linux:** `Ctrl + Shift + R`
- Or open in **Incognito/Private** mode

#### Issue: API returns old data
**Fix:** Clear cache and cookies
1. Press `F12`
2. Go to **Application** tab (Chrome) or **Storage** tab (Firefox)
3. Click **Clear site data** or **Clear storage**
4. Refresh the page

#### Issue: Backend not returning updated data
**Fix:** Restart the backend server
```bash
# Stop the server (Ctrl+C)
# Then restart it
cd backend
node server.js
```

#### Issue: Profile not loading at all
**Fix:** Check backend connection
1. Open http://localhost:5000/health
2. Should see: `{"status":"ok","database":"connected"}`
3. If not, restart backend

### 5. **Step-by-Step Verification**

1. **Login to your account** (test4@gmail.com)
2. **Navigate to Debug page**: http://localhost:3000/dashboard/debug
3. **Check all 4 sections** on the debug page:
   - Firebase User
   - User Profile
   - isPro Status (should show ✅ TRUE with all green checkmarks)
   - Raw API Response
4. **Click "Refresh Data"** button on debug page
5. **Check browser console** for the logs mentioned above
6. **Navigate back to Dashboard**: http://localhost:3000/dashboard
7. **Look at the sidebar** - you should see **⭐ Premium** badge

### 6. **Backend Verification**

Check the backend terminal logs when you load the dashboard. You should see:
```
📡 Backend: Get profile request for user: {
  uid: '...',
  email: 'test4@gmail.com',
  role: 'pro_user',
  subscriptionStatus: 'active',
  subscriptionPlan: 'Premium'
}
```

### 7. **Database Verification**

Verify directly in MongoDB:
```bash
cd backend
node -e "
const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect('YOUR_MONGODB_URI').then(async () => {
  const user = await User.findOne({ email: 'test4@gmail.com' });
  console.log('User in DB:', {
    email: user.email,
    role: user.role,
    subscriptionStatus: user.subscriptionStatus,
    subscriptionPlan: user.subscriptionPlan,
    subscriptionPeriodEnd: user.subscriptionPeriodEnd
  });
  process.exit(0);
});
"
```

## Expected State

### ✅ Database (MongoDB)
```json
{
  "email": "test4@gmail.com",
  "role": "pro_user",
  "subscriptionStatus": "active",
  "subscriptionPlan": "Premium",
  "subscriptionPeriodEnd": "2025-02-18T..."
}
```

### ✅ Backend API Response
```json
{
  "user": {
    "email": "test4@gmail.com",
    "role": "pro_user",
    "subscriptionStatus": "active",
    "subscriptionPlan": "Premium",
    "subscriptionPeriodEnd": "2025-02-18T..."
  }
}
```

### ✅ Frontend (AuthContext)
```javascript
userProfile = {
  email: "test4@gmail.com",
  role: "pro_user",
  subscriptionStatus: "active",
  subscriptionPlan: "Premium",
  subscriptionPeriodEnd: "2025-02-18T..."
}

isPro = true
```

### ✅ UI (Dashboard Sidebar)
- Avatar with first letter of email
- Name: "User" or display name
- Badge: **⭐ Premium** (purple gradient)
- NO "Upgrade to Pro" button
- Navigation items with "PRO" badges should NOT show badges

## Still Not Working?

If after all these steps the badge still doesn't show:

1. **Take screenshots** of:
   - Debug dashboard (http://localhost:3000/dashboard/debug)
   - Browser console (F12)
   - Backend terminal logs

2. **Check for errors** in:
   - Browser console (red error messages)
   - Backend terminal (error messages)
   - Network tab (F12 → Network → look for failed requests)

3. **Try a different browser** or **incognito mode**

4. **Verify environment variables** are loaded:
   ```bash
   # In backend directory
   cat .env | grep MONGODB_URI
   cat .env | grep STRIPE_SECRET_KEY
   ```

5. **Make sure both servers are running**:
   - Backend: http://localhost:5000/health
   - Frontend: http://localhost:3000

## Developer Notes

### Where isPro is calculated:
`/contexts/AuthContext.js` line 94-98
```javascript
const isPro = userProfile?.role === 'pro_user' && 
              userProfile?.subscriptionStatus === 'active' &&
              (userProfile?.subscriptionPlan === 'Lite' || 
               userProfile?.subscriptionPlan === 'Pro' || 
               userProfile?.subscriptionPlan === 'Premium');
```

### Where badge is shown:
`/app/dashboard/layout.js` line 129-135
```javascript
{isPro && userProfile?.subscriptionPlan ? (
  <div className="flex items-center gap-1 mt-1">
    <span className="inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
      ⭐ {userProfile.subscriptionPlan}
    </span>
  </div>
) : (
```

### Where "PRO" badges are hidden:
`/app/dashboard/layout.js` line 108-112
```javascript
{item.proBadge && !isPro && (
  <span className="px-2 py-1 text-xs font-semibold text-white bg-indigo-600 rounded">
    PRO
  </span>
)}
```

---

**Created:** 2025-01-18
**For:** test4@gmail.com Premium subscription debugging
