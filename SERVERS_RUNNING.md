# 🚀 Servers Running - Quick Access Guide

## Current Server Status

### ✅ Backend API Server
- **Port**: 5001
- **URL**: http://localhost:5001
- **Status**: ✅ Running
- **MongoDB**: ✅ Connected
- **API Base**: http://localhost:5001/api

#### Available Endpoints:
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User signup
- `GET /api/user/profile` - Get user profile
- `PATCH /api/user/profile` - Update user profile
- `GET /api/stripe/subscription` - Get subscription status
- `POST /api/stripe/create-checkout-session` - Create Stripe session
- `GET /api/stripe/session/:sessionId` - Get session details
- `POST /api/stripe/webhook` - Stripe webhook
- `GET /api/projects` - Get projects
- `POST /api/projects` - Create project
- `GET /api/calendar` - Get calendar items
- `POST /api/calendar` - Create calendar item
- `GET /api/notifications` - Get notifications
- `POST /api/notifications` - Create notification
- `GET /api/brand-deals` - Get brand deals
- `POST /api/brand-deals` - Create brand deal

### ✅ Frontend Web App
- **Port**: 3005
- **URL**: http://localhost:3005
- **Status**: ✅ Ready
- **Framework**: Next.js 14

#### Available Pages:
- `/` - Landing page
- `/login` - Login page
- `/signup` - Signup page
- `/dashboard` - Main dashboard (requires auth)
- `/dashboard/calendar` - Calendar view (requires auth)
- `/dashboard/notifications` - Notifications (requires auth)
- `/dashboard/upgrade` - Subscription plans (requires auth)
- `/dashboard/settings` - User settings (requires auth)
- `/subscription/success` - Success after subscription
- `/subscription/error` - Error after subscription
- `/privacy` - Privacy policy
- `/terms` - Terms of service

## Quick Access Links

### For Testing:
1. **Homepage**: http://localhost:3005
2. **Login**: http://localhost:3005/login
3. **Signup**: http://localhost:3005/signup
4. **Dashboard**: http://localhost:3005/dashboard
5. **Upgrade**: http://localhost:3005/dashboard/upgrade

## Test Accounts

### Create a test account at:
http://localhost:3005/signup

### Test Flow:
1. Sign up at `/signup`
2. Login at `/login`
3. Access dashboard at `/dashboard`
4. Test subscription at `/dashboard/upgrade`
5. After purchase, redirects to `/subscription/success?session_id=...`

## Environment Configuration

All environment variables are set in `.env`:
- ✅ MongoDB Atlas connection
- ✅ Firebase credentials
- ✅ Stripe API keys
- ✅ JWT secret

## Server Management

### Stop Servers:
```bash
# Kill backend (port 5001)
lsof -ti:5001 | xargs kill -9

# Kill frontend (port 3005)
lsof -ti:3005 | xargs kill -9
```

### Start Servers:
```bash
# Backend
cd /Users/ihorromanenko/Desktop/test25
node backend/server.js

# Frontend (in new terminal)
cd /Users/ihorromanenko/Desktop/test25
npm run dev
```

### Or use launch script:
```bash
chmod +x launch.sh
./launch.sh
```

## Recent Optimizations ✨

### Subscription Success Page:
- ✅ Immediate display (no waiting)
- ✅ Background data loading
- ✅ 5-second timeout protection
- ✅ Loading skeleton UI
- ✅ Graceful fallback for failures
- ✅ Instant confetti animation 🎉

See `SUBSCRIPTION_SUCCESS_OPTIMIZED.md` for details.

## Monitoring

### Check Backend Health:
```bash
curl http://localhost:5001/api/health
```

### Check MongoDB Connection:
Look for: `✅ MongoDB Connected: ac-ppzjaz5-shard-00-02.omaagfq.mongodb.net`

### View Logs:
Backend logs are visible in the terminal running `node backend/server.js`

## Troubleshooting

### Port Already in Use?
```bash
# Find and kill process
lsof -ti:5001 | xargs kill -9  # Backend
lsof -ti:3005 | xargs kill -9  # Frontend
```

### MongoDB Connection Issues?
- Check `.env` file has correct MongoDB URI
- Verify MongoDB Atlas cluster is running
- Check network connection

### Stripe Webhook Issues?
- For local testing, use Stripe CLI
- Or test with actual deployment

## Next Steps

1. ✅ Both servers are running
2. ✅ Subscription success page optimized
3. 📝 Test the complete flow:
   - User signup/login
   - Dashboard access
   - Subscription purchase
   - Success page performance
   - Calendar/notifications features

---

**Status**: 🟢 ALL SYSTEMS OPERATIONAL
**Backend**: http://localhost:5001
**Frontend**: http://localhost:3005
**Last Updated**: Performance optimization complete
