# ⚡ Quick Start Guide

Get the Creator Project Tracker running in under 10 minutes!

## Prerequisites Check

Before you begin, make sure you have:
- [ ] Node.js 18+ installed (`node -v`)
- [ ] npm installed (`npm -v`)
- [ ] Git installed (if cloning from repo)

## Step 1: Install Dependencies (2 minutes)

```bash
cd test25
npm install
```

## Step 2: Configure Environment (5 minutes)

### 2.1 Create .env file
```bash
cp .env.example .env
```

### 2.2 Get MongoDB Connection String
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create free cluster (M0)
4. Get connection string
5. Add to `.env`:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/creator-tracker
```

### 2.3 Setup Firebase (Quick Mode)
1. Go to https://console.firebase.google.com/
2. Create new project
3. Add Web App
4. Copy config to `.env`:
```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
# etc.
```
5. Enable Email/Password auth in Authentication
6. Enable Google auth in Authentication
7. Go to Project Settings > Service Accounts
8. Generate new private key
9. Copy values to `.env`:
```
FIREBASE_PROJECT_ID=...
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=...
```

### 2.4 Get Stripe Keys (Test Mode)
1. Go to https://stripe.com
2. Create account
3. Get test keys from Dashboard
4. Add to `.env`:
```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
```
5. Create a product and price
6. Copy price ID:
```
STRIPE_PRO_PRICE_ID=price_...
```

### 2.5 Get OpenAI API Key
1. Go to https://platform.openai.com/
2. Create account
3. Generate API key
4. Add to `.env`:
```
OPENAI_API_KEY=sk-...
```

### 2.6 Set Other Variables
```
NODE_ENV=development
PORT=5000
NEXT_PUBLIC_API_URL=http://localhost:5000
JWT_SECRET=your-random-secret-key-change-in-production
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Step 3: Start the Application (1 minute)

### Terminal 1 - Backend
```bash
npm run backend:dev
```

You should see:
```
✅ MongoDB Connected
🚀 Server running on port 5000
✅ Notification scheduler initialized
```

### Terminal 2 - Frontend
```bash
npm run dev
```

You should see:
```
- ready started server on 0.0.0.0:3000
```

## Step 4: Test the Application

1. **Open browser**: http://localhost:3000
2. **Sign up** with email/password or Google
3. **Create a project**
4. **Verify** it appears in dashboard

## Quick Test Checklist

- [ ] App loads at http://localhost:3000
- [ ] Can sign up with email
- [ ] Can sign in with Google
- [ ] Can create a project
- [ ] Project appears in dashboard
- [ ] Can navigate between pages
- [ ] Dark mode toggle works

## Common Issues & Fixes

### Issue: "Cannot connect to MongoDB"
**Fix**: Check MongoDB URI is correct and IP is whitelisted

### Issue: "Firebase auth error"
**Fix**: Verify Firebase config in .env matches Firebase console

### Issue: "Port 3000 already in use"
**Fix**: Kill process on port 3000:
```bash
lsof -ti:3000 | xargs kill -9
```

### Issue: "Port 5000 already in use"
**Fix**: Kill process on port 5000:
```bash
lsof -ti:5000 | xargs kill -9
```

### Issue: "Module not found"
**Fix**: Reinstall dependencies:
```bash
rm -rf node_modules package-lock.json
npm install
```

## What's Next?

### Test Pro Features
1. Go to Stripe Dashboard
2. Use test card: `4242 4242 4242 4242`
3. Expiry: any future date
4. CVC: any 3 digits
5. Upgrade to Pro in app
6. Test AI tools

### Configure Stripe Webhook (for subscriptions)
1. Install Stripe CLI: https://stripe.com/docs/stripe-cli
2. Login: `stripe login`
3. Forward webhooks:
```bash
stripe listen --forward-to localhost:5000/api/stripe/webhook
```
4. Copy webhook secret to `.env`:
```
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Customize the App
- Update app name in `/app/layout.js`
- Change colors in `tailwind.config.js`
- Update legal pages in `/app/terms` and `/app/privacy`
- Add your logo

### Mobile App Setup
```bash
cd mobile
npm install
# For iOS
cd ios && pod install && cd ..
npm run ios
# For Android
npm run android
```

## Development Workflow

### Daily Development
```bash
# Terminal 1
npm run backend:dev

# Terminal 2
npm run dev
```

### View Logs
```bash
# Backend logs
tail -f backend/logs/app.log

# MongoDB logs
# View in MongoDB Atlas dashboard
```

### Test API Endpoints
Use Postman or curl:
```bash
# Health check
curl http://localhost:5000/health

# Get projects (requires auth token)
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/projects
```

## Ready for Production?

When you're ready to deploy:
1. Read `DEPLOYMENT.md`
2. Set up production databases
3. Configure production domains
4. Set production environment variables
5. Deploy backend to Heroku/Railway
6. Deploy frontend to Vercel
7. Submit mobile apps to stores

## Need Help?

- **Documentation**: See README.md
- **API Reference**: See API_DOCS.md
- **Deployment**: See DEPLOYMENT.md
- **Mobile**: See mobile/README.md

---

## 🎉 You're All Set!

Your Creator Project Tracker is now running locally. Start creating projects and exploring features!

**Pro Tip**: Keep both terminal windows open while developing. The backend auto-restarts on changes (nodemon) and Next.js has hot reload for instant updates.

Happy coding! 🚀
