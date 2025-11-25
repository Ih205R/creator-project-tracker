# Creator Project Tracker

A full-stack, production-ready application for content creators to track projects, schedules, brand deals, and leverage AI-powered tools including **YouTube Deep Analytics**.

## 🚀 Features

### ✨ NEW: AI-Powered YouTube Analytics
- **🧠 Growth Predictions**: AI analyzes trends and predicts future growth
- **💡 Content Recommendations**: Personalized suggestions based on performance data
- **🎯 Optimization Tips**: AI-generated strategies to improve your channel
- **📈 Trend Analysis**: Real-time week-over-week performance insights
- **📊 Interactive Charts**: Recharts-powered visualization with metric selector
- **💰 Revenue Analytics**: RPM, CPM, and estimated earnings tracking
- **🔍 Traffic Sources**: Detailed breakdown of how viewers find your content
- **👥 Demographics**: Age and gender insights for your audience

[➡️ See full AI features documentation](./AI_FEATURES_COMPLETE.md)

### Core Features
- **Kanban Board**: Drag-and-drop content management with 5 statuses (Idea, Drafting, Editing, Scheduled, Posted)
- **Calendar View**: Month/week view with drag-and-drop scheduling
- **Brand Deal Tracker**: Manage brand partnerships with contract tracking
- **YouTube Integration**: Dual-mode integration (Public Search + OAuth)
- **AI Tools** (Pro only): Generate captions, titles, and script outlines
- **Push Notifications**: Due date reminders and scheduled content alerts
- **User Roles**: Free and Pro tiers with Stripe subscriptions

### Tech Stack
- **Frontend**: Next.js 14 (App Router), React, Tailwind CSS
- **Mobile**: React Native (iOS & Android)
- **Backend**: Node.js + Express
- **Database**: MongoDB Atlas
- **Authentication**: Firebase Auth (Email/Password + Google OAuth)
- **Payments**: Stripe
- **AI**: OpenAI API + Custom Analytics Engine
- **Charts**: Recharts
- **Storage**: Firebase Storage
- **Push Notifications**: Firebase Cloud Messaging
- **APIs**: YouTube Data API v3, YouTube Analytics API v2

## 📋 Prerequisites

- Node.js 18+ and npm
- MongoDB Atlas account
- Firebase project
- Stripe account
- OpenAI API key

## 🛠️ Setup Instructions

### 1. Clone and Install

```bash
cd test25
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory (use `.env.example` as template):

```bash
# MongoDB
MONGODB_URI=your_mongodb_connection_string

# Firebase Admin (from Firebase Console > Project Settings > Service Accounts)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@...iam.gserviceaccount.com

# Firebase Client (from Firebase Console > Project Settings > General)
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-ABCD123

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRO_PRICE_ID=price_...

# OpenAI
OPENAI_API_KEY=sk-...

# YouTube API
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret
YOUTUBE_API_KEY=your_youtube_api_key

# App Config
NODE_ENV=development
PORT=5000
NEXT_PUBLIC_API_URL=http://localhost:5000
FRONTEND_URL=http://localhost:3000
JWT_SECRET=your-secret-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Firebase Setup

1. Create a Firebase project at https://console.firebase.google.com/
2. Enable Authentication (Email/Password + Google)
3. Enable Cloud Firestore and Storage
4. Enable Cloud Messaging for push notifications
5. Download service account key (Settings > Service Accounts)
6. Get web app config (Settings > General > Your apps)

### 4. MongoDB Setup

1. Create a MongoDB Atlas cluster at https://www.mongodb.com/cloud/atlas
2. Create a database user
3. Whitelist your IP address (or use 0.0.0.0/0 for development)
4. Get connection string

### 5. Stripe Setup

1. Create account at https://stripe.com
2. Get API keys from Dashboard > Developers > API keys
3. Create a product and price for Pro subscription
4. Set up webhook endpoint: `https://your-domain.com/api/stripe/webhook`
5. Add webhook secret to environment variables

### 6. OpenAI Setup

1. Create account at https://platform.openai.com
2. Generate API key from API Keys section
3. Add to environment variables

### 7. YouTube API Setup (NEW)

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable APIs:
   - YouTube Data API v3
   - YouTube Analytics API v2
4. Create OAuth 2.0 credentials:
   - Go to APIs & Services > Credentials
   - Create OAuth client ID (Web application)
   - Add authorized redirect URIs:
     - `http://localhost:3000/dashboard/integrations` (dev)
     - `https://yourdomain.com/dashboard/integrations` (production)
5. Get Client ID and Client Secret
6. (Optional) Create API Key for public data access

[➡️ Detailed setup guide](./YOUTUBE_OAUTH_SETUP.md)

### 8. Run the Application

#### Development Mode

Terminal 1 - Backend:
```bash
npm run backend:dev
```

Terminal 2 - Frontend:
```bash
npm run dev
```

Access the app at `http://localhost:3000`

#### Production Build

```bash
npm run build
npm start
```

Backend:
```bash
NODE_ENV=production node backend/server.js
```

## 📱 Mobile App Setup

### Prerequisites
- React Native CLI
- Xcode (for iOS)
- Android Studio (for Android)

### Setup

```bash
cd mobile
npm install

# iOS
cd ios
pod install
cd ..
npx react-native run-ios

# Android
npx react-native run-android
```

### Mobile Configuration

Create `mobile/.env`:
```bash
API_URL=http://localhost:5000
FIREBASE_API_KEY=...
# Add other Firebase config
```

## 🗂️ Project Structure

```
test25/
├── app/                      # Next.js app (frontend)
│   ├── dashboard/           # Main dashboard pages
│   ├── login/              # Authentication pages
│   ├── terms/              # Legal pages
│   └── privacy/
├── backend/                 # Express server
│   ├── models/             # MongoDB models
│   ├── controllers/        # Route controllers
│   ├── routes/             # API routes
│   ├── middleware/         # Auth middleware
│   ├── schedulers/         # Cron jobs
│   └── config/             # Configuration
├── components/             # React components
├── contexts/               # React contexts
├── lib/                    # Utilities
├── mobile/                 # React Native app
└── public/                 # Static assets
```

## 🔐 API Endpoints

### Authentication
All endpoints except webhooks require `Authorization: Bearer <firebase_token>` header.

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create project
- `GET /api/projects/:id` - Get single project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `POST /api/projects/order` - Bulk update order

### Brand Deals
- `GET /api/brand-deals` - Get all brand deals
- `POST /api/brand-deals` - Create brand deal
- `GET /api/brand-deals/stats` - Get statistics
- `GET /api/brand-deals/:id` - Get single deal
- `PUT /api/brand-deals/:id` - Update deal
- `DELETE /api/brand-deals/:id` - Delete deal

### Calendar
- `GET /api/calendar?startDate=&endDate=` - Get calendar items
- `POST /api/calendar` - Create calendar item
- `PUT /api/calendar/:id` - Update item
- `DELETE /api/calendar/:id` - Delete item

### AI (Pro only)
- `POST /api/ai/captions` - Generate captions
- `POST /api/ai/titles` - Generate titles
- `POST /api/ai/script` - Generate script
- `POST /api/ai/all` - Generate all suggestions

### Stripe
- `POST /api/stripe/create-checkout-session` - Create checkout
- `POST /api/stripe/create-portal-session` - Billing portal
- `GET /api/stripe/subscription-status` - Get status
- `POST /api/stripe/webhook` - Stripe webhooks

### User
- `GET /api/user/profile` - Get profile
- `PUT /api/user/profile` - Update profile
- `POST /api/user/push-token` - Register push token
- `GET /api/user/stats` - Get user statistics

### Notifications
- `GET /api/notifications` - Get notifications
- `PUT /api/notifications/:id/read` - Mark as read
- `PUT /api/notifications/read-all` - Mark all as read
- `DELETE /api/notifications/:id` - Delete notification

## 🧪 Testing

```bash
npm test
npm run test:watch
```

## 📊 User Limits

### Free Users
- Max 30 content projects
- Max 1 brand deal
- No AI features
- All other features included

### Pro Users
- Unlimited projects
- Unlimited brand deals
- Full AI access
- Priority support

## 🔔 Notifications

Automated notifications are sent for:
- Content due in 24 hours
- Scheduled content release (1 hour before)
- Subscription renewal (3 days before)
- AI-generated content ready

## 🚢 Deployment

### Vercel (Frontend)
```bash
vercel --prod
```

### Heroku (Backend)
```bash
git push heroku main
```

### Railway / Render
Connect GitHub repository and deploy

### Environment Variables
Ensure all environment variables are set in your deployment platform.

### Stripe Webhook
Update webhook URL in Stripe dashboard to your production URL.

## 📄 Legal

- Terms of Use: `/terms`
- Privacy Policy: `/privacy`

Both pages are GDPR and CCPA compliant and cover all data collection and processing activities.

## 🛡️ Security Features

- Firebase Authentication with secure token validation
- HTTPS/TLS encryption
- CORS protection
- Rate limiting (recommended to add)
- Input validation
- Secure password reset
- Stripe PCI compliance
- MongoDB encryption at rest

## 🎨 Customization

### Theme
Update `tailwind.config.js` for custom colors and styling.

### Platform Colors
Platform-specific colors are defined in the Tailwind config (YouTube red, TikTok black, etc.).

### Dark Mode
Automatic dark mode support with `class` strategy.

## 📚 Additional Resources

### Official Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Stripe Documentation](https://stripe.com/docs)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [YouTube API Documentation](https://developers.google.com/youtube)

### Project Documentation
- **[📖 Complete Documentation Index](./DOCUMENTATION_INDEX.md)** - Find all docs
- **[🚀 Complete Implementation Summary](./COMPLETE_IMPLEMENTATION_SUMMARY.md)** - Full feature overview
- **[🤖 AI Features Guide](./AI_FEATURES_COMPLETE.md)** - AI capabilities deep dive
- **[🎨 Visual Design Guide](./DEEP_ANALYTICS_VISUAL_GUIDE.md)** - UI/UX details
- **[📊 Visual Changelog](./VISUAL_CHANGELOG.md)** - Before/After comparison
- **[⚡ Quick Start Guide](./QUICK_START_AI_ANALYTICS.md)** - Get started fast

## ✨ What's New

### Latest Updates (December 2024)

#### 🎉 YouTube Deep Analytics with AI
- **AI Growth Predictions**: Forecast subscriber growth based on trends
- **AI Content Recommendations**: Get personalized content strategy advice
- **AI Optimization Tips**: Learn how to improve your channel performance
- **AI Trend Analysis**: Real-time week-over-week performance insights
- **Interactive Charts**: Beautiful Recharts visualizations
- **Revenue Analytics**: Track RPM, CPM, and estimated earnings
- **Traffic Sources**: See where your views come from
- **Demographics**: Understand your audience better

#### 🔗 YouTube Integration
- **Dual-Mode Access**: Public search OR OAuth authentication
- **Secure Token Management**: Automatic token refresh
- **Deep Analytics Access**: Private channel data with user consent
- **Modern UI**: Purple-themed AI features with gradient design

[➡️ See all documentation](./DOCUMENTATION_INDEX.md)

## 🏆 Competitive Advantages

### vs. Other Creator Tools
✅ **AI-Powered Analytics** - Predictive insights, not just historical data
✅ **All-in-One Platform** - Projects, scheduling, brand deals, and analytics
✅ **Custom AI Engine** - Proprietary algorithms for growth predictions
✅ **Modern Tech Stack** - Next.js 14, React Native, Firebase
✅ **Professional Design** - Dark mode, gradients, smooth animations
✅ **Mobile Apps** - iOS and Android native apps
✅ **Flexible Pricing** - Free tier + Pro features

### Key Differentiators
- **YouTube Studio**: We add AI predictions and recommendations
- **TubeBuddy/VidIQ**: Native integration, no browser extension needed
- **Social Blade**: OAuth access to private data + AI insights
- **Generic Project Trackers**: YouTube-specific analytics integration

## 🐛 Known Issues

1. Push notifications require HTTPS in production
2. Mobile app requires separate Firebase configuration
3. Stripe webhooks must be configured for production

## 🤝 Support

For support, email support@creatorprojecttracker.com

## 📝 License

This project is proprietary software. All rights reserved.

---

Built with ❤️ for content creators
