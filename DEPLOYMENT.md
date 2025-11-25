# Deployment Guide

## Prerequisites

- Domain name configured
- SSL certificate
- Environment variables configured
- Database credentials
- API keys (Firebase, Stripe, OpenAI)

## Backend Deployment (Heroku)

### 1. Install Heroku CLI
```bash
brew install heroku/brew/heroku  # macOS
```

### 2. Login and Create App
```bash
heroku login
heroku create creator-tracker-api
```

### 3. Set Environment Variables
```bash
heroku config:set MONGODB_URI="your_mongodb_uri"
heroku config:set FIREBASE_PROJECT_ID="your_project_id"
heroku config:set FIREBASE_PRIVATE_KEY="your_private_key"
heroku config:set FIREBASE_CLIENT_EMAIL="your_client_email"
heroku config:set STRIPE_SECRET_KEY="your_stripe_key"
heroku config:set STRIPE_WEBHOOK_SECRET="your_webhook_secret"
heroku config:set OPENAI_API_KEY="your_openai_key"
heroku config:set NODE_ENV="production"
heroku config:set JWT_SECRET="your_jwt_secret"
```

### 4. Add Procfile
```bash
echo "web: node backend/server.js" > Procfile
```

### 5. Deploy
```bash
git push heroku main
```

### 6. Configure Stripe Webhook
- Go to Stripe Dashboard > Webhooks
- Add endpoint: `https://creator-tracker-api.herokuapp.com/api/stripe/webhook`
- Select events: subscription.*, invoice.*, customer.*

---

## Frontend Deployment (Vercel)

### 1. Install Vercel CLI
```bash
npm i -g vercel
```

### 2. Login
```bash
vercel login
```

### 3. Configure Environment Variables
Create `vercel.json`:
```json
{
  "env": {
    "NEXT_PUBLIC_FIREBASE_API_KEY": "@firebase-api-key",
    "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN": "@firebase-auth-domain",
    "NEXT_PUBLIC_FIREBASE_PROJECT_ID": "@firebase-project-id",
    "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET": "@firebase-storage-bucket",
    "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID": "@firebase-messaging-sender-id",
    "NEXT_PUBLIC_FIREBASE_APP_ID": "@firebase-app-id",
    "NEXT_PUBLIC_API_URL": "@api-url",
    "NEXT_PUBLIC_APP_URL": "@app-url"
  }
}
```

### 4. Set Secrets
```bash
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY
vercel env add NEXT_PUBLIC_API_URL
# Add all other environment variables
```

### 5. Deploy
```bash
vercel --prod
```

---

## Alternative: Railway Deployment

### Backend + Frontend

1. Go to https://railway.app
2. Connect GitHub repository
3. Select repository
4. Add environment variables
5. Deploy

Railway will automatically detect:
- Node.js backend
- Next.js frontend

### Advantages
- Automatic SSL
- Easy database provisioning
- GitHub integration
- Automatic deployments

---

## Mobile App Deployment

### iOS (App Store)

1. **Configure App in Xcode**
   - Open `mobile/ios/YourApp.xcworkspace`
   - Set Bundle Identifier
   - Set Team
   - Configure signing certificates

2. **Update Environment**
   - Create production `.env` file
   - Build for production

3. **Archive and Upload**
   ```bash
   cd mobile/ios
   xcodebuild archive \
     -workspace YourApp.xcworkspace \
     -scheme YourApp \
     -archivePath YourApp.xcarchive
   ```

4. **Submit to App Store Connect**
   - Create app in App Store Connect
   - Upload archive
   - Submit for review

### Android (Play Store)

1. **Generate Signing Key**
   ```bash
   cd mobile/android/app
   keytool -genkeypair -v -keystore release.keystore \
     -alias release -keyalg RSA -keysize 2048 -validity 10000
   ```

2. **Configure Gradle**
   Update `android/app/build.gradle`:
   ```gradle
   signingConfigs {
     release {
       storeFile file('release.keystore')
       storePassword 'your-password'
       keyAlias 'release'
       keyPassword 'your-password'
     }
   }
   ```

3. **Build AAB**
   ```bash
   cd mobile/android
   ./gradlew bundleRelease
   ```

4. **Upload to Play Console**
   - Create app in Google Play Console
   - Upload AAB
   - Submit for review

---

## Database Migration

### MongoDB Atlas Production

1. Create production cluster
2. Configure IP whitelist
3. Create database user
4. Enable backup
5. Configure monitoring alerts

---

## Monitoring & Logging

### Heroku Logs
```bash
heroku logs --tail
```

### Vercel Logs
```bash
vercel logs
```

### MongoDB Atlas Monitoring
- Enable performance advisor
- Set up alerts for:
  - High connection count
  - Slow queries
  - High CPU usage

---

## Post-Deployment Checklist

- [ ] SSL certificate configured
- [ ] Environment variables set
- [ ] Database backups enabled
- [ ] Stripe webhooks configured
- [ ] Firebase settings updated
- [ ] Domain DNS configured
- [ ] CORS origins updated
- [ ] Error monitoring setup (Sentry)
- [ ] Analytics setup (Google Analytics)
- [ ] Load testing completed
- [ ] Security audit completed
- [ ] Legal pages accessible
- [ ] Mobile apps submitted

---

## Rollback Procedure

### Heroku
```bash
heroku releases
heroku rollback v123
```

### Vercel
```bash
vercel rollback
```

---

## Performance Optimization

### Backend
- Enable Redis caching
- Add database indexes
- Implement rate limiting
- Enable gzip compression

### Frontend
- Enable Next.js image optimization
- Implement code splitting
- Enable service workers
- Add CDN (Cloudflare)

---

## Security Hardening

1. **Enable Rate Limiting**
   ```bash
   npm install express-rate-limit
   ```

2. **Add Helmet.js**
   ```bash
   npm install helmet
   ```

3. **Update CORS**
   - Restrict to production domains
   - Remove wildcards

4. **Rotate Secrets**
   - Change JWT secret
   - Rotate API keys quarterly
   - Update Firebase service account

---

## Monitoring Services (Optional)

- **Error Tracking**: Sentry
- **APM**: New Relic
- **Uptime**: UptimeRobot
- **Analytics**: Google Analytics 4

---

## Backup Strategy

### Database
- Daily automated backups (MongoDB Atlas)
- Test restore monthly
- Keep 30 days of backups

### Files
- Replicate Firebase Storage
- Export user data monthly

---

## Support & Maintenance

### Regular Tasks
- [ ] Monitor error logs daily
- [ ] Review performance metrics weekly
- [ ] Update dependencies monthly
- [ ] Security audit quarterly
- [ ] Load testing before major releases

---

## Cost Estimation (Monthly)

| Service | Tier | Est. Cost |
|---------|------|-----------|
| Heroku | Hobby | $7 |
| Vercel | Pro | $20 |
| MongoDB Atlas | M10 | $57 |
| Firebase | Blaze | $25-50 |
| Stripe | Pay-per-use | 2.9% + 30¢ |
| OpenAI | Pay-per-use | Variable |

**Total**: ~$150-200/month for small-medium scale

---

## Scaling Considerations

### When to Scale

- 1000+ active users: Upgrade MongoDB to M20
- 10000+ requests/day: Add Redis cache
- International users: Add CDN
- 100+ concurrent users: Scale Heroku dynos

### Horizontal Scaling

```bash
# Heroku
heroku ps:scale web=3

# Add load balancer
# Add Redis for session storage
# Implement queue system (Bull/RabbitMQ)
```
