# Quick Setup - Welcome Email (2 Minutes) ⚡

## Step 1: Get Gmail App Password (1 min)
1. Visit: https://myaccount.google.com/apppasswords
2. Enable 2-Factor Authentication (if not already)
3. Create App Password → Mail → Other → "Creator Tracker"
4. **Copy the 16-character password** (example: `abcd efgh ijkl mnop`)

## Step 2: Update .env File (30 seconds)
Open `/Users/ihorromanenko/Desktop/test25/.env` and update:

```properties
EMAIL_SERVICE=gmail
EMAIL_USER=youremail@gmail.com
EMAIL_PASSWORD=abcdefghijklmnop
EMAIL_FROM=noreply@creatortracker.com
```

**Replace**:
- `youremail@gmail.com` with YOUR Gmail address
- `abcdefghijklmnop` with YOUR App Password (remove spaces)

## Step 3: Test (30 seconds)
1. Go to http://localhost:3000/signup
2. Sign up with a **NEW email** (not previously used)
3. Check your inbox for welcome email! 📧

✅ **Done!** New users will now receive welcome emails automatically.

## Expected Result

### Email Preview:
```
Subject: Welcome to Creator Project Tracker! 🎉
From: Creator Project Tracker

Hi [Name]! 👋

We're thrilled to have you join our community!

Features you can use:
📋 Track Projects
🤝 Manage Brand Deals  
📅 Schedule Content
🤖 AI Tools
📊 Analytics

[Go to Dashboard →]
```

### Backend Console:
```
✅ Welcome email sent to: newuser@example.com
```

## Troubleshooting

**Email not received?**
- Check spam folder
- Verify App Password (no spaces)
- Ensure 2FA is enabled on Gmail

**Backend error?**
- Restart backend: `cd backend && node server.js`
- Check .env file syntax (no quotes needed for password)

---
**That's it! Welcome emails are now active!** 🎉
