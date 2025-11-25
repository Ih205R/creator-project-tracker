# 📖 Quick Reference Guide

## 🎯 Main Features Overview

### 1. Calendar Page 🗓️
**Location:** `/dashboard/calendar`

```
┌─────────────────────────────────────────────┐
│  📅 Calendar                    + Add Event │
├─────────────────────────────────────────────┤
│                                             │
│  🔍 Filter: [All Types ▼]  Search...       │
│                                             │
│  ┌────────────────────────────────────┐    │
│  │ Team Meeting                       │    │
│  │ 📅 Jan 15, 2024 • 14:00          │    │
│  │ 🏢 Meeting                         │    │
│  │ 📝 Discuss Q1 goals               │    │
│  │ [Edit] [Delete]                    │    │
│  └────────────────────────────────────┘    │
│                                             │
│  ┌────────────────────────────────────┐    │
│  │ Video Upload Deadline              │    │
│  │ 📅 Jan 20, 2024                   │    │
│  │ ⏰ Deadline                        │    │
│  │ 🎬 Project: YouTube Series         │    │
│  │ [Edit] [Delete]                    │    │
│  └────────────────────────────────────┘    │
│                                             │
└─────────────────────────────────────────────┘
```

**Features:**
- ✅ Create events with title, date, time, type
- ✅ Link events to projects
- ✅ Add notes to events
- ✅ Filter by type (Meeting, Deadline, Content, Other)
- ✅ Search events
- ✅ Edit and delete

---

### 2. Notifications Page 🔔
**Location:** `/dashboard/notifications`

```
┌─────────────────────────────────────────────┐
│  🔔 Notifications (3 unread)    Mark All   │
├─────────────────────────────────────────────┤
│                                             │
│  Filter: [All ▼]                           │
│                                             │
│  ┌────────────────────────────────────┐    │
│  │ 🔵 INFO • New Brand Deal           │    │
│  │ You have a new partnership request │    │
│  │ 2 hours ago           [✓] [🗑]    │    │
│  └────────────────────────────────────┘    │
│                                             │
│  ┌────────────────────────────────────┐    │
│  │ ✅ SUCCESS • Video Published       │    │
│  │ Your video was successfully posted │    │
│  │ Yesterday             [✓] [🗑]    │    │
│  └────────────────────────────────────┘    │
│                                             │
│  ┌────────────────────────────────────┐    │
│  │ ⚠️ WARNING • Payment Due           │    │
│  │ Subscription payment due in 3 days │    │
│  │ 3 days ago            [✓] [🗑]    │    │
│  └────────────────────────────────────┘    │
│                                             │
└─────────────────────────────────────────────┘
```

**Features:**
- ✅ View all notifications
- ✅ Mark as read/unread
- ✅ Delete notifications
- ✅ Filter by status (All, Unread, Read)
- ✅ Badge counter
- ✅ Color-coded by type

---

### 3. Subscription System 💳

#### Upgrade Page
**Location:** `/dashboard/upgrade`

```
┌─────────────────────────────────────────────────────────┐
│               🎉 Upgrade Your Account                   │
│                                                         │
│  [Monthly] [Annual] ← Save 2 months with annual! 🎉   │
│                                                         │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐         │
│  │  🚀 Lite  │  │ ⭐ Pro    │  │ 👑 Premium │         │
│  │           │  │ POPULAR!  │  │            │         │
│  │  €7.99/mo │  │ €11.99/mo │  │ €14.99/mo  │         │
│  │           │  │           │  │            │         │
│  │ ✓ 10 proj │  │ ✓ Unlim.  │  │ ✓ All Pro  │         │
│  │ ✓ Basic AI│  │ ✓ AI Tools│  │ ✓ Teams    │         │
│  │ ✓ Calendar│  │ ✓ Priority│  │ ✓ Custom   │         │
│  │           │  │ ✓ Export  │  │ ✓ 24/7     │         │
│  │           │  │           │  │            │         │
│  │ [Upgrade] │  │ [Upgrade] │  │ [Upgrade]  │         │
│  └───────────┘  └───────────┘  └───────────┘         │
│                                                         │
│  ✓ 14-day money-back guarantee                        │
│  ✓ Secure payment via Stripe                          │
│  ✓ Cancel anytime                                     │
└─────────────────────────────────────────────────────────┘
```

#### Success Page
**Location:** `/subscription/success`

```
┌─────────────────────────────────────────────┐
│           🎊🎉🎊 CONFETTI! 🎊🎉🎊           │
│                                             │
│        ✅ Subscription Successful!          │
│                                             │
│  Plan: Pro Plan                            │
│  Amount: €11.99                            │
│  Billing: Monthly                          │
│  Next charge: February 15, 2024            │
│                                             │
│  Features Unlocked:                        │
│  ✓ Unlimited Projects                      │
│  ✓ AI Caption Generator                    │
│  ✓ AI Script Writer                        │
│  ✓ Priority Support                        │
│  ✓ Advanced Analytics                      │
│                                             │
│  [Go to Dashboard] [Manage Subscription]   │
│                                             │
└─────────────────────────────────────────────┘
```

#### Error Page
**Location:** `/subscription/error`

```
┌─────────────────────────────────────────────┐
│            ❌ Payment Failed                │
│                                             │
│  We couldn't process your payment.         │
│  Please check your payment details.        │
│                                             │
│  What to do:                               │
│  • Check your card details                 │
│  • Ensure sufficient funds                 │
│  • Try a different payment method          │
│  • Contact your bank                       │
│                                             │
│  Need help?                                │
│  Contact our support team                  │
│                                             │
│  [Try Again] [Contact Support] [Dashboard] │
│                                             │
└─────────────────────────────────────────────┘
```

---

### 4. User Badge System 👤

**Sidebar Display:**

```
┌─────────────────────────┐
│ 👤 John Doe            │
│    🚀 Lite             │  ← Badge updates automatically!
│                        │
│ [Upgrade to Pro]       │
│ [Sign Out]             │
└─────────────────────────┘
```

**Badge Types:**

| Status    | Badge | Color  | Icon |
|-----------|-------|--------|------|
| Free      | Free  | Gray   | -    |
| Lite      | Lite  | Blue   | 🚀   |
| Pro       | Pro   | Purple | ⭐   |
| Premium   | Premium | Orange | 👑  |

---

## 🔄 Subscription Flow

```
User clicks "Upgrade Now"
         ↓
Frontend creates checkout session
         ↓
Redirect to Stripe Checkout
         ↓
User enters payment details
         ↓
Payment processed
         ↓
         ├─ Success → /subscription/success
         │              ↓
         │          Show confetti 🎉
         │              ↓
         │          Stripe sends webhook
         │              ↓
         │          Backend updates database
         │              ↓
         │          User role → "pro_user"
         │              ↓
         │          User badge updated ⭐
         │
         └─ Failed → /subscription/error
                       ↓
                   Show error message
                       ↓
                   Offer retry/support
```

---

## 📡 API Endpoints

### Calendar Endpoints
```http
GET    /api/calendar              # Get all events
POST   /api/calendar              # Create event
PUT    /api/calendar/:id          # Update event
DELETE /api/calendar/:id          # Delete event
```

### Notification Endpoints
```http
GET    /api/notifications         # Get all notifications
POST   /api/notifications         # Create notification
PUT    /api/notifications/:id/read  # Mark as read
PUT    /api/notifications/read-all  # Mark all as read
DELETE /api/notifications/:id     # Delete notification
```

### Stripe Endpoints
```http
POST   /api/stripe/create-checkout-session  # Create checkout
GET    /api/stripe/session/:sessionId       # Get session data
GET    /api/stripe/subscription-status      # Get subscription
POST   /api/stripe/cancel-subscription      # Cancel subscription
POST   /api/stripe/request-refund           # Request refund
POST   /api/stripe/create-portal-session    # Billing portal
POST   /api/stripe/webhook                  # Stripe webhooks
```

---

## 🗄️ Database Collections

### calendaritems
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  title: "Team Meeting",
  date: ISODate("2024-01-15"),
  time: "14:00",
  type: "meeting",
  project: ObjectId,  // Optional
  notes: "Discuss Q1 goals",
  createdAt: ISODate,
  updatedAt: ISODate
}
```

### notifications
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  type: "info",
  title: "New Brand Deal",
  message: "You have a new partnership request",
  read: false,
  link: "/dashboard/brand-deals",
  createdAt: ISODate,
  updatedAt: ISODate
}
```

### users
```javascript
{
  _id: ObjectId,
  firebaseUid: "abc123",
  email: "user@example.com",
  displayName: "John Doe",
  
  // Subscription fields
  role: "pro_user",
  subscriptionStatus: "active",
  subscriptionPlan: "Pro",
  subscriptionId: "sub_123",
  stripeCustomerId: "cus_123",
  subscriptionPeriodEnd: ISODate("2024-02-15"),
  
  createdAt: ISODate,
  updatedAt: ISODate
}
```

---

## 🧪 Testing with Stripe

### Test Cards

| Scenario | Card Number | Result |
|----------|-------------|--------|
| Success | 4242 4242 4242 4242 | Payment succeeds |
| Declined | 4000 0000 0000 0002 | Card declined |
| Insufficient Funds | 4000 0000 0000 9995 | Insufficient funds |
| Expired Card | 4000 0000 0000 0069 | Expired card |

**Other details:**
- Expiry: Any future date (e.g., 12/25)
- CVC: Any 3 digits (e.g., 123)
- Postal Code: Any (e.g., 12345)

---

## 🎯 Common Tasks

### Create a Calendar Event
```bash
# Via UI
1. Go to /dashboard/calendar
2. Click "Add Event"
3. Fill in details
4. Click "Create"

# Via API
curl -X POST http://localhost:5001/api/calendar \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Team Meeting",
    "date": "2024-01-15",
    "time": "14:00",
    "type": "meeting",
    "notes": "Discuss Q1 goals"
  }'
```

### Subscribe to Pro Plan
```bash
1. Go to /dashboard/upgrade
2. Select "Pro" plan
3. Choose "Monthly" or "Annual"
4. Click "Upgrade Now"
5. Enter card: 4242 4242 4242 4242
6. Complete checkout
7. Redirected to success page
8. Badge updates to ⭐ Pro
```

### Check Subscription in Database
```javascript
// MongoDB
db.users.findOne({ email: "user@example.com" })

// Should show:
{
  role: "pro_user",
  subscriptionStatus: "active",
  subscriptionPlan: "Pro",
  subscriptionId: "sub_...",
  stripeCustomerId: "cus_...",
  subscriptionPeriodEnd: ISODate(...)
}
```

---

## 📊 Quick Stats

| Feature | Files | Lines of Code | Database Collections |
|---------|-------|---------------|---------------------|
| Calendar | 4 | ~500 | 1 (calendaritems) |
| Notifications | 4 | ~400 | 1 (notifications) |
| Subscriptions | 6 | ~800 | 1 (users) |
| **Total** | **14** | **~1,700** | **3** |

---

## 🔍 Troubleshooting Quick Reference

| Issue | Solution |
|-------|----------|
| Calendar events not saving | Check MongoDB connection in `.env` |
| Notifications not showing | Verify userId matches Firebase auth |
| Webhook not working | Check webhook secret and Stripe CLI |
| Badge not updating | Refresh page (Ctrl+Shift+R) |
| Payment fails | Use test card 4242... or check Stripe logs |
| Can't access Pro features | Check user.role in MongoDB |

---

## 📝 File Locations

```
Quick Reference:

Calendar UI:        /app/dashboard/calendar/page.js
Notifications UI:   /app/dashboard/notifications/page.js
Subscription UI:    /app/dashboard/upgrade/page.js
Success Page:       /app/subscription/success/page.js
Error Page:         /app/subscription/error/page.js

Calendar API:       /backend/controllers/calendarController.js
Notifications API:  /backend/controllers/notificationController.js
Stripe API:         /backend/controllers/stripeController.js

Calendar Model:     /backend/models/CalendarItem.js
Notification Model: /backend/models/Notification.js
User Model:         /backend/models/User.js
```

---

## 🚀 Quick Commands

```bash
# Start everything
./start.sh

# Start backend only
cd backend && npm run dev

# Start frontend only
npm run dev

# Test webhook
stripe listen --forward-to localhost:5001/api/stripe/webhook

# Check MongoDB
mongosh "mongodb+srv://cluster0.mongodb.net/languageApp"

# Run tests
npm test
```

---

## 📚 Documentation

- **COMPLETE_FEATURES_GUIDE.md** - Detailed feature docs
- **TESTING_CHECKLIST.md** - Step-by-step testing
- **IMPLEMENTATION_SUMMARY.md** - Implementation overview
- **README.md** - Setup and installation

---

**Last Updated:** November 17, 2025  
**Version:** 1.0.0  
**Status:** ✅ Production Ready
