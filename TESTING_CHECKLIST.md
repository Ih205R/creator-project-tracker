# ✅ Testing Checklist - All Features

## Pre-Testing Setup

- [ ] Backend server running on `http://localhost:5001`
- [ ] Frontend server running on `http://localhost:3000`
- [ ] MongoDB Atlas connected successfully
- [ ] `.env` file configured with all required variables
- [ ] User logged in with Firebase authentication

---

## 🗓️ Calendar Feature Testing

### Create Event
- [ ] Navigate to `/dashboard/calendar`
- [ ] Click "Add Event" button
- [ ] Fill in event details:
  - [ ] Title: "Team Meeting"
  - [ ] Date: Tomorrow's date
  - [ ] Time: 14:00
  - [ ] Type: Meeting
  - [ ] Notes: "Discuss Q1 goals"
- [ ] Click "Create Event"
- [ ] ✅ Event appears in calendar list
- [ ] ✅ Event saved to MongoDB
- [ ] ✅ No errors in console

### Edit Event
- [ ] Click "Edit" button on created event
- [ ] Change title to "Team Meeting - Updated"
- [ ] Change time to 15:00
- [ ] Click "Update Event"
- [ ] ✅ Event updated in list
- [ ] ✅ Changes saved to MongoDB
- [ ] ✅ No errors in console

### Delete Event
- [ ] Click "Delete" button on event
- [ ] Confirm deletion
- [ ] ✅ Event removed from list
- [ ] ✅ Event deleted from MongoDB
- [ ] ✅ No errors in console

### Filter Events
- [ ] Create multiple events with different types
- [ ] Use type filter dropdown
- [ ] Select "Meeting"
- [ ] ✅ Only meeting events shown
- [ ] Select "All"
- [ ] ✅ All events shown again

### Link to Project
- [ ] Create an event
- [ ] Select a project from dropdown
- [ ] Save event
- [ ] ✅ Event linked to project
- [ ] ✅ Project name displayed on event card

---

## 🔔 Notifications Feature Testing

### View Notifications
- [ ] Navigate to `/dashboard/notifications`
- [ ] ✅ All notifications displayed
- [ ] ✅ Unread notifications highlighted
- [ ] ✅ Notification count badge shows correct number
- [ ] ✅ No errors in console

### Mark as Read
- [ ] Click checkmark icon on unread notification
- [ ] ✅ Notification marked as read
- [ ] ✅ Styling changes (no highlight)
- [ ] ✅ Unread count decreases
- [ ] ✅ Status updated in MongoDB

### Mark All as Read
- [ ] Click "Mark All Read" button
- [ ] ✅ All notifications marked as read
- [ ] ✅ Unread count becomes 0
- [ ] ✅ All notifications updated in MongoDB

### Delete Notification
- [ ] Click trash icon on notification
- [ ] Confirm deletion
- [ ] ✅ Notification removed from list
- [ ] ✅ Notification deleted from MongoDB
- [ ] ✅ Count updated

### Filter Notifications
- [ ] Use status filter dropdown
- [ ] Select "Unread"
- [ ] ✅ Only unread notifications shown
- [ ] Select "Read"
- [ ] ✅ Only read notifications shown
- [ ] Select "All"
- [ ] ✅ All notifications shown

### Create Notification (API Test)
```bash
# Use this curl command or Postman
curl -X POST http://localhost:5001/api/notifications \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "info",
    "title": "Test Notification",
    "message": "This is a test notification"
  }'
```
- [ ] Run API request
- [ ] ✅ Notification created
- [ ] Refresh notifications page
- [ ] ✅ New notification appears

---

## 💳 Subscription System Testing

### View Pricing Plans
- [ ] Navigate to `/dashboard/upgrade`
- [ ] ✅ Three plans displayed (Lite, Pro, Premium)
- [ ] ✅ Prices shown correctly (€7.99, €11.99, €14.99)
- [ ] ✅ Monthly/Annual toggle works
- [ ] ✅ Annual shows savings calculation
- [ ] ✅ "Most Popular" badge on Pro plan
- [ ] ✅ All features listed correctly

### Test Stripe Checkout Flow
- [ ] Select Pro plan
- [ ] Select Monthly billing
- [ ] Click "Upgrade Now"
- [ ] ✅ Redirects to Stripe Checkout
- [ ] ✅ Correct plan and price shown
- [ ] ✅ Customer email pre-filled

### Test Successful Payment
- [ ] Use test card: `4242 4242 4242 4242`
- [ ] Expiry: `12/25`
- [ ] CVC: `123`
- [ ] Complete payment
- [ ] ✅ Redirects to success page
- [ ] ✅ Confetti animation plays
- [ ] ✅ Plan name displayed correctly
- [ ] ✅ Amount shown (€11.99)
- [ ] ✅ Next billing date shown
- [ ] ✅ User role updated to "pro_user" in MongoDB
- [ ] ✅ Subscription status set to "active"
- [ ] ✅ Subscription plan set to "Pro"

### Verify User Badge Update
- [ ] Navigate back to dashboard
- [ ] ✅ Sidebar shows "⭐ Pro" badge
- [ ] Check user profile in settings
- [ ] ✅ Badge displayed correctly
- [ ] ✅ Subscription details shown

### Test Failed Payment
- [ ] Navigate to upgrade page again
- [ ] Select any plan
- [ ] Click "Upgrade Now"
- [ ] Use declined card: `4000 0000 0000 0002`
- [ ] ✅ Payment fails
- [ ] ✅ Redirects to error page
- [ ] ✅ Error message displayed
- [ ] ✅ Troubleshooting tips shown
- [ ] ✅ User role NOT changed in database

### Test Canceled Checkout
- [ ] Navigate to upgrade page
- [ ] Select any plan
- [ ] Click "Upgrade Now"
- [ ] Close Stripe checkout window (press ESC or close tab)
- [ ] ✅ Redirects to error page with "canceled" type
- [ ] ✅ Appropriate message shown
- [ ] ✅ Options to retry or contact support

---

## ⚙️ Subscription Management Testing

### Access Settings
- [ ] Navigate to `/dashboard/settings`
- [ ] ✅ Subscription section displayed
- [ ] ✅ Current plan shown
- [ ] ✅ Next billing date shown
- [ ] ✅ Subscription status shown

### Test Stripe Customer Portal
- [ ] Click "Manage Subscription" button
- [ ] ✅ Redirects to Stripe Customer Portal
- [ ] ✅ Can view invoices
- [ ] ✅ Can update payment method
- [ ] ✅ Can view subscription details

### Test Cancel Subscription
- [ ] In settings, click "Cancel Subscription"
- [ ] ✅ Confirmation modal appears
- [ ] Confirm cancellation
- [ ] ✅ Success message shown
- [ ] ✅ Status updates to "canceling"
- [ ] ✅ Shows "Access until [date]"
- [ ] ✅ Database updated
- [ ] ✅ Can still access pro features until period end

### Test Request Refund (Within 14 Days)
- [ ] In settings, click "Request Refund"
- [ ] ✅ Confirmation modal appears
- [ ] Confirm refund request
- [ ] ✅ Success message shown
- [ ] ✅ Subscription immediately canceled
- [ ] ✅ Role downgraded to "free_user"
- [ ] ✅ User badge updates to "Free"
- [ ] ✅ Refund processed in Stripe

### Test Refund Outside 14 Days
- [ ] Manually update invoice date in Stripe to 15+ days ago
- [ ] Try to request refund
- [ ] ✅ Error message: "Refund period has expired"
- [ ] ✅ Subscription NOT canceled
- [ ] ✅ User role unchanged

---

## 🔗 Webhook Testing

### Setup Stripe CLI
```bash
# Install Stripe CLI (macOS)
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks
stripe listen --forward-to localhost:5001/api/stripe/webhook
```

- [ ] Stripe CLI installed
- [ ] Logged in successfully
- [ ] Webhooks forwarding
- [ ] ✅ Webhook secret copied to `.env`
- [ ] ✅ Backend restarted

### Test Subscription Created Event
```bash
stripe trigger customer.subscription.created
```
- [ ] Event triggered
- [ ] ✅ Backend receives webhook
- [ ] ✅ User updated in MongoDB
- [ ] ✅ Console log: "✅ Updated subscription for user..."

### Test Payment Succeeded Event
```bash
stripe trigger invoice.payment_succeeded
```
- [ ] Event triggered
- [ ] ✅ Backend receives webhook
- [ ] ✅ Console log: "💰 Payment succeeded for user..."

### Test Subscription Deleted Event
```bash
stripe trigger customer.subscription.deleted
```
- [ ] Event triggered
- [ ] ✅ Backend receives webhook
- [ ] ✅ User downgraded to free_user
- [ ] ✅ Console log: "❌ Subscription deleted for user..."

---

## 🗄️ Database Verification

### Verify Calendar Items in MongoDB
```javascript
// MongoDB Compass or CLI
db.calendaritems.find({ userId: ObjectId("USER_ID") })
```
- [ ] Calendar items exist
- [ ] ✅ All fields populated correctly
- [ ] ✅ userId matches authenticated user
- [ ] ✅ Dates stored correctly

### Verify Notifications in MongoDB
```javascript
db.notifications.find({ userId: ObjectId("USER_ID") })
```
- [ ] Notifications exist
- [ ] ✅ read status accurate
- [ ] ✅ Type field correct
- [ ] ✅ Timestamps present

### Verify User Subscription Data
```javascript
db.users.findOne({ email: "YOUR_EMAIL" })
```
- [ ] User document exists
- [ ] ✅ `role` field correct
- [ ] ✅ `subscriptionStatus` correct
- [ ] ✅ `subscriptionPlan` correct
- [ ] ✅ `stripeCustomerId` populated
- [ ] ✅ `subscriptionId` populated
- [ ] ✅ `subscriptionPeriodEnd` set

---

## 🚀 Performance Testing

### Calendar Performance
- [ ] Create 50+ calendar events
- [ ] ✅ Page loads quickly (<2 seconds)
- [ ] ✅ Filtering works smoothly
- [ ] ✅ No lag when scrolling
- [ ] ✅ No memory leaks (check browser console)

### Notifications Performance
- [ ] Create 100+ notifications
- [ ] ✅ Page loads quickly
- [ ] ✅ Filtering responsive
- [ ] ✅ Mark all read completes quickly
- [ ] ✅ No UI freezing

### Subscription Performance
- [ ] Multiple rapid subscription changes
- [ ] ✅ Webhook handles events correctly
- [ ] ✅ No duplicate updates
- [ ] ✅ Database stays consistent

---

## 🔒 Security Testing

### API Authentication
- [ ] Try accessing API without token
- [ ] ✅ Returns 401 Unauthorized
- [ ] Try with invalid token
- [ ] ✅ Returns 401 Unauthorized
- [ ] Try with valid token
- [ ] ✅ Returns data successfully

### CORS Testing
- [ ] Access from allowed origin (localhost:3000)
- [ ] ✅ Request successful
- [ ] Try from different origin (manually in browser)
- [ ] ✅ CORS headers present

### Webhook Security
- [ ] Send webhook without signature
- [ ] ✅ Returns 400 Bad Request
- [ ] Send webhook with invalid signature
- [ ] ✅ Returns 400 Bad Request
- [ ] Send webhook with valid signature
- [ ] ✅ Processes successfully

---

## 📱 UI/UX Testing

### Responsive Design
- [ ] Test on mobile (375px)
- [ ] ✅ Calendar responsive
- [ ] ✅ Notifications responsive
- [ ] ✅ Subscription cards stack correctly
- [ ] Test on tablet (768px)
- [ ] ✅ All layouts work
- [ ] Test on desktop (1920px)
- [ ] ✅ Everything displays correctly

### Dark Mode
- [ ] Toggle dark mode
- [ ] ✅ Calendar colors adjust
- [ ] ✅ Notifications readable
- [ ] ✅ Subscription page looks good
- [ ] ✅ No white flashes
- [ ] ✅ All text readable

### Animations
- [ ] ✅ Confetti plays on success page
- [ ] ✅ Modal transitions smooth
- [ ] ✅ Button hover effects work
- [ ] ✅ Card animations fluid
- [ ] ✅ No janky animations

---

## 🎯 Final Verification

### Calendar
- [ ] ✅ Create works
- [ ] ✅ Read works
- [ ] ✅ Update works
- [ ] ✅ Delete works
- [ ] ✅ Database persistence confirmed

### Notifications
- [ ] ✅ Display works
- [ ] ✅ Mark as read works
- [ ] ✅ Delete works
- [ ] ✅ Filter works
- [ ] ✅ Database persistence confirmed

### Subscription
- [ ] ✅ Checkout works
- [ ] ✅ Success page works
- [ ] ✅ Error page works
- [ ] ✅ User badge updates
- [ ] ✅ Database updates via webhook
- [ ] ✅ Manage subscription works
- [ ] ✅ Cancel works
- [ ] ✅ Refund works

---

## 📝 Test Results

### Date Tested: _______________

### Tester: _______________

### Overall Status:
- [ ] All tests passed ✅
- [ ] Some issues found (document below)
- [ ] Major issues found (document below)

### Issues Found:
```
1. Issue description:
   - Steps to reproduce:
   - Expected behavior:
   - Actual behavior:

2. Issue description:
   - Steps to reproduce:
   - Expected behavior:
   - Actual behavior:
```

### Notes:
```
Additional observations or comments:
```

---

## 🎉 Sign-off

- [ ] All features tested and working
- [ ] Database persistence verified
- [ ] Webhooks functioning correctly
- [ ] UI/UX acceptable
- [ ] Performance acceptable
- [ ] Security checks passed
- [ ] Ready for production deployment

**Signed:** _______________  
**Date:** _______________

---

## 📞 Support

If any tests fail, refer to:
- `COMPLETE_FEATURES_GUIDE.md` for detailed documentation
- Backend logs at `/backend/server.log`
- MongoDB Atlas logs
- Stripe Dashboard webhook logs
- Browser console for frontend errors

**Need help?** Check the troubleshooting section in the main guide.
