# ⚡ 5-Minute Test Guide

## 🎯 Quick Test - All Features in 5 Minutes

This guide will help you verify that all requested features are working correctly in just 5 minutes.

---

## 🚀 Step 1: Start the Application (1 minute)

### Terminal 1 - Backend
```bash
cd backend
npm run dev
```

**Expected Output:**
```
Server running on port 5001
✅ MongoDB connected successfully
```

### Terminal 2 - Frontend
```bash
npm run dev
```

**Expected Output:**
```
Ready on http://localhost:3000
```

---

## ✅ Step 2: Test Calendar (1 minute)

### 2.1 Open Calendar
```
http://localhost:3000/dashboard/calendar
```

### 2.2 Create Event
1. Click **"Add Event"** button (top right)
2. Fill in:
   - **Title:** "Test Meeting"
   - **Date:** Tomorrow
   - **Time:** 14:00
   - **Type:** Meeting
   - **Notes:** "Testing calendar"
3. Click **"Create Event"**

### 2.3 Verify
- ✅ Event appears in list
- ✅ Shows title, date, time, type
- ✅ Has Edit and Delete buttons

### 2.4 Edit Event
1. Click **"Edit"** button on the event
2. Change title to **"Test Meeting - Updated"**
3. Click **"Update Event"**

### 2.5 Verify
- ✅ Title updated in list

### 2.6 Delete Event
1. Click **"Delete"** button
2. Confirm deletion

### 2.7 Verify
- ✅ Event removed from list

**✅ Calendar Test PASSED** if all steps work correctly

---

## 🔔 Step 3: Test Notifications (1 minute)

### 3.1 Open Notifications
```
http://localhost:3000/dashboard/notifications
```

### 3.2 Verify Display
- ✅ Notifications list shown
- ✅ Each notification has:
  - Icon with color
  - Title and message
  - Timestamp
  - Mark as read button (✓)
  - Delete button (🗑)

### 3.3 Mark as Read
1. Find an **unread** notification (highlighted)
2. Click the **checkmark (✓)** icon

### 3.4 Verify
- ✅ Notification changes appearance (no longer highlighted)
- ✅ "Mark as Read" changes to "Mark as Unread"

### 3.5 Mark All as Read
1. Click **"Mark All Read"** button (top right)

### 3.6 Verify
- ✅ All notifications marked as read
- ✅ Badge count becomes 0 (if present)

### 3.7 Delete Notification
1. Click **trash icon (🗑)** on any notification
2. Confirm deletion (if prompted)

### 3.8 Verify
- ✅ Notification removed from list

**✅ Notifications Test PASSED** if all steps work correctly

---

## 💳 Step 4: Test Subscription System (2 minutes)

### 4.1 Open Upgrade Page
```
http://localhost:3000/dashboard/upgrade
```

### 4.2 Verify Pricing Display
- ✅ Three plans shown: Lite, Pro, Premium
- ✅ Prices displayed: €7.99, €11.99, €14.99
- ✅ Monthly/Annual toggle works
- ✅ "Most Popular" badge on Pro plan
- ✅ Feature lists shown for each plan

### 4.3 Start Subscription Flow
1. Select **"Pro"** plan
2. Ensure **"Monthly"** is selected
3. Click **"Upgrade Now"**

### 4.4 Verify Redirect
- ✅ Redirects to Stripe Checkout page
- ✅ Shows "Pro Plan - €11.99"
- ✅ Email pre-filled (if logged in)

### 4.5 Complete Payment
1. Enter test card: **4242 4242 4242 4242**
2. Expiry: **12/25**
3. CVC: **123**
4. Postal Code: **12345**
5. Click **"Pay"**

### 4.6 Verify Success Page
- ✅ Redirected to `/subscription/success`
- ✅ **Confetti animation plays** 🎊
- ✅ Shows plan name: "Pro"
- ✅ Shows amount: "€11.99"
- ✅ Shows billing cycle: "Monthly"
- ✅ Shows next billing date
- ✅ Features list displayed

### 4.7 Verify User Badge Update
1. Click **"Go to Dashboard"**
2. Look at sidebar (left side)
3. Find your user profile section (bottom of sidebar)

### 4.8 Verify Badge
- ✅ Badge changed from "Free" to **"⭐ Pro"**
- ✅ Badge has purple color
- ✅ "Upgrade to Pro" button no longer shown

### 4.9 Test Failed Payment (Optional)
1. Go back to upgrade page
2. Select any plan
3. Click "Upgrade Now"
4. Use declined card: **4000 0000 0000 0002**
5. Complete checkout

### 4.10 Verify Error Page
- ✅ Redirected to `/subscription/error`
- ✅ Error message displayed
- ✅ Shows "Payment Failed" or similar
- ✅ Has "Try Again" button
- ✅ Has support/help options
- ✅ User badge NOT changed (still Free or previous status)

**✅ Subscription Test PASSED** if all steps work correctly

---

## 🗄️ Step 5: Verify Database (BONUS - 1 minute)

### Option A: Using MongoDB Compass

1. Open MongoDB Compass
2. Connect using:
   ```
   mongodb+srv://ihorr30:Mariya1504@allo@cluster0.omaagfq.mongodb.net/languageApp
   ```
3. Navigate to `languageApp` database

### Check Calendar Items
1. Open **`calendaritems`** collection
2. Find your test event (if you created one before deleting)
3. Verify it was deleted (should not be there)

### Check Notifications
1. Open **`notifications`** collection
2. Find notifications you marked as read
3. Verify **`read: true`** field

### Check User Subscription
1. Open **`users`** collection
2. Find your user by email
3. Verify fields:
   ```javascript
   {
     role: "pro_user",           // ✅ Updated
     subscriptionStatus: "active", // ✅ Updated
     subscriptionPlan: "Pro",     // ✅ Updated
     subscriptionId: "sub_...",   // ✅ Added
     stripeCustomerId: "cus_...", // ✅ Added
     subscriptionPeriodEnd: Date  // ✅ Added
   }
   ```

### Option B: Using MongoDB Shell
```bash
mongosh "mongodb+srv://ihorr30:Mariya1504@allo@cluster0.omaagfq.mongodb.net/languageApp"

# Check user
db.users.findOne({ email: "YOUR_EMAIL" })

# Check notifications
db.notifications.find({ userId: YOUR_USER_ID })

# Check calendar items
db.calendaritems.find({ userId: YOUR_USER_ID })
```

**✅ Database Test PASSED** if all data matches expected values

---

## 📊 Test Results Summary

### Mark each test as PASSED or FAILED:

- [ ] ✅ Calendar - Create Event
- [ ] ✅ Calendar - Edit Event
- [ ] ✅ Calendar - Delete Event
- [ ] ✅ Notifications - Display
- [ ] ✅ Notifications - Mark as Read
- [ ] ✅ Notifications - Delete
- [ ] ✅ Subscription - Pricing Display
- [ ] ✅ Subscription - Checkout Flow
- [ ] ✅ Subscription - Success Page
- [ ] ✅ Subscription - Confetti Animation
- [ ] ✅ Subscription - User Badge Update
- [ ] ✅ Subscription - Error Handling
- [ ] ✅ Database - User Updated
- [ ] ✅ Database - Subscription Fields

---

## ✅ Expected Results Summary

If all tests pass, you should see:

### ✅ Calendar
- Events can be created, edited, and deleted
- Events stored in MongoDB
- UI updates in real-time
- No console errors

### ✅ Notifications
- Notifications display correctly
- Read/unread status works
- Delete works
- Filter works
- Database updates correctly

### ✅ Subscription
- **Success Page:**
  - Confetti animation 🎊
  - Plan details shown
  - Next billing date shown
  - User badge updates to Pro (⭐ Purple)
  
- **Error Page:**
  - User-friendly error message
  - Troubleshooting tips
  - Options to retry or get help
  - User badge NOT changed

- **Database:**
  - User role changed to "pro_user"
  - Subscription status set to "active"
  - Subscription plan set to "Pro"
  - Stripe customer ID added
  - Subscription ID added
  - Period end date added

---

## 🎉 Success Criteria

**All features are working if:**

1. ✅ You can create and manage calendar events
2. ✅ Calendar events persist in MongoDB
3. ✅ Notifications display and can be managed
4. ✅ Subscription checkout completes successfully
5. ✅ Success page shows with confetti 🎊
6. ✅ User badge updates to Pro (⭐)
7. ✅ Database updates automatically with subscription info
8. ✅ Error page shows when payment fails
9. ✅ No console errors during any operation
10. ✅ All data persists after page refresh

---

## 🐛 If Something Doesn't Work

### Calendar issues:
1. Check backend is running on port 5001
2. Check MongoDB connection string in `.env`
3. Check browser console for errors
4. Verify Firebase authentication token is valid

### Notification issues:
1. Check userId matches between Firebase and MongoDB
2. Verify notifications collection exists in MongoDB
3. Check API endpoints are responding
4. Refresh the page

### Subscription issues:
1. Verify Stripe keys in `.env` are correct
2. Check price IDs match your Stripe account
3. Ensure webhook secret is set (for database updates)
4. Check Stripe dashboard for payment status
5. Verify backend is receiving webhooks

### Database issues:
1. Check MongoDB connection in backend logs
2. Verify database name is "languageApp"
3. Check collections exist
4. Verify network access in MongoDB Atlas

### Badge not updating:
1. Hard refresh page (Ctrl+Shift+R or Cmd+Shift+R)
2. Check webhook was received (backend logs)
3. Verify user document in MongoDB
4. Clear browser cache

---

## 📞 Still Having Issues?

Check these logs:

1. **Backend logs** (Terminal 1)
   - Look for errors or warnings
   - Check MongoDB connection message
   - Verify API requests are being received

2. **Frontend console** (Browser F12)
   - Check for JavaScript errors
   - Verify API responses
   - Check network tab for failed requests

3. **MongoDB Atlas**
   - Login to atlas.mongodb.com
   - Check cluster is running
   - Verify network access
   - Check database users

4. **Stripe Dashboard**
   - Login to dashboard.stripe.com
   - Check payments tab
   - Check webhooks tab
   - Verify test mode is enabled

---

## 🎊 Test Complete!

If all tests passed, congratulations! 🎉

**You now have:**
- ✅ Working calendar with database persistence
- ✅ Working notifications system
- ✅ Complete subscription flow with success page
- ✅ Error handling with error page
- ✅ Automatic database updates on subscription
- ✅ User badge system that updates correctly

**Total time:** ~5 minutes  
**Features tested:** 3 major systems  
**Database operations:** All working  
**Status:** 🚀 Production Ready

---

**Need more detailed testing?** See `TESTING_CHECKLIST.md`  
**Need documentation?** See `COMPLETE_FEATURES_GUIDE.md`  
**Need API reference?** See `QUICK_REFERENCE.md`
