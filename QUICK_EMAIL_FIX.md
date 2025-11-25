# Quick Commands - Fix Email & Restart Backend

## Current Issue
Gmail authentication failed because you need to use an App Password instead of your regular password.

## Option 1: Quick Fix with Mailtrap (FASTEST - 2 minutes)

### 1. Sign up for Mailtrap
Visit: https://mailtrap.io (free account)

### 2. Get credentials
- Go to "Email Testing" → "Inboxes"
- Copy: Host, Port, Username, Password

### 3. Update .env
```bash
# Open .env file
nano /Users/ihorromanenko/Desktop/test25/.env

# Add/Update these lines:
EMAIL_SERVICE=smtp
SMTP_HOST=sandbox.smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your-mailtrap-username
SMTP_PASS=your-mailtrap-password
EMAIL_FROM="Creator Tracker <noreply@creatortracker.com>"

# Save: Ctrl+O, Enter, Ctrl+X
```

### 4. Restart backend
```bash
cd /Users/ihorromanenko/Desktop/test25
# Stop current process (Ctrl+C)
node backend/server.js
```

---

## Option 2: Gmail App Password (5 minutes)

### 1. Enable 2-Step Verification
https://myaccount.google.com/security

### 2. Create App Password
https://myaccount.google.com/apppasswords
- Create App Password for "Mail" / "Creator Tracker"
- Copy the 16-character password (e.g., `abcd efgh ijkl mnop`)

### 3. Update .env
```bash
# Open .env
nano /Users/ihorromanenko/Desktop/test25/.env

# Update these lines:
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=abcdefghijklmnop  # 16 chars, no spaces
EMAIL_FROM="Creator Tracker <noreply@creatortracker.com>"

# Save: Ctrl+O, Enter, Ctrl+X
```

### 4. Restart backend
```bash
cd /Users/ihorromanenko/Desktop/test25
# Stop current process (Ctrl+C)
node backend/server.js
```

---

## Test the Email Feature

### 1. Check backend is running
Look for: "✅ Server running on port 5001"

### 2. Sign up new user
- Go to: http://localhost:3000/signup
- Create a test account
- Submit registration

### 3. Check for success
**Backend terminal should show:**
```
✅ Welcome email sent successfully to: test@example.com
```

**If using Mailtrap:**
- Go to Mailtrap inbox
- See the welcome email

**If using Gmail:**
- Check your Gmail inbox
- Look for "Welcome to Creator Tracker!"

---

## Troubleshooting

### Backend won't start?
```bash
# Kill all node processes
pkill -f node

# Start backend fresh
cd /Users/ihorromanenko/Desktop/test25
node backend/server.js
```

### Can't find .env file?
```bash
# Check if it exists
ls -la /Users/ihorromanenko/Desktop/test25/.env

# If missing, create it
cp /Users/ihorromanenko/Desktop/test25/.env.example /Users/ihorromanenko/Desktop/test25/.env
```

### Email still not sending?
```bash
# Check the backend logs carefully
# Look for these messages:
# ✅ = Success
# ⚠️ = Warning (email logged but not sent)
# ❌ = Error (configuration problem)
```

---

## Quick Status Check

### Backend running?
```bash
lsof -i :5001
# Should show node process
```

### Frontend running?
```bash
lsof -i :3000
# Should show next.js process
```

### .env file correct?
```bash
# View email config
grep EMAIL_ /Users/ihorromanenko/Desktop/test25/.env
```

---

## What You'll See

### ✅ Success (Mailtrap):
```
📧 Using custom SMTP: sandbox.smtp.mailtrap.io
✅ Welcome email sent successfully to: user@example.com
📧 Message ID: <message-id>
```

### ✅ Success (Gmail):
```
📧 Using Gmail service for emails
✅ Welcome email sent successfully to: user@example.com
📧 Message ID: <message-id>
```

### ⚠️ Not Configured:
```
⚠️  No email service configured. Emails will be logged to console only.
📖 See FIX_EMAIL_ERROR.md to setup email service
📧 [DEMO MODE] Welcome email for John Doe (john@example.com)
```

### ❌ Error (Bad Password):
```
❌ Authentication failed!
📖 If using Gmail:
   1. Enable 2-Step Verification
   2. Generate App Password
   3. Use the 16-character App Password in .env file
```

---

## One-Line Solutions

### Restart everything:
```bash
pkill -f node && cd /Users/ihorromanenko/Desktop/test25 && node backend/server.js
```

### View .env email config:
```bash
grep -A 5 "# Email" /Users/ihorromanenko/Desktop/test25/.env
```

### Check if ports are in use:
```bash
lsof -i :3000 && lsof -i :5001
```

---

## Recommended: Use Mailtrap for Development

Mailtrap is the easiest and fastest option for testing:
- ✅ No Gmail security hassles
- ✅ Works immediately
- ✅ See all test emails in one place
- ✅ No risk of sending real emails
- ✅ Free tier is enough for development

Get it at: https://mailtrap.io
