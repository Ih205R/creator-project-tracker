# MongoDB Setup Guide

## Option 1: MongoDB Atlas (Cloud - FREE & RECOMMENDED) ⭐

### What You Need:
- ✅ Email address
- ✅ Internet connection
- ✅ 5-10 minutes

### Step-by-Step Instructions:

#### 1. Create MongoDB Atlas Account

1. Go to: **https://cloud.mongodb.com**
2. Click **"Try Free"** or **"Sign Up"**
3. Sign up with:
   - Email + Password, OR
   - Google account, OR
   - GitHub account
4. Verify your email if required

#### 2. Create Your First Cluster

1. After logging in, click **"Build a Database"**
2. Choose deployment option:
   - Select **"M0 FREE"** (0 cost, perfect for development)
   - 512 MB storage (plenty for testing)
3. Choose cloud provider:
   - **AWS** (recommended)
   - Or Google Cloud / Azure
4. Choose region:
   - Pick **closest to your location** (e.g., `us-east-1` for East US)
   - Or `eu-central-1` for Europe
5. Cluster Name:
   - Enter: **`creator-tracker`**
   - Or keep default name
6. Click **"Create"** (takes 1-3 minutes to provision)

#### 3. Set Up Database Access (Security)

**Create Database User:**
1. On left sidebar, click **"Database Access"**
2. Click **"Add New Database User"**
3. Authentication Method: **"Password"**
4. Username: Choose a username (e.g., `admin` or `creator-app`)
5. Password: 
   - Click **"Autogenerate Secure Password"** (RECOMMENDED)
   - **SAVE THIS PASSWORD!** You'll need it later
   - Or create your own strong password
6. Database User Privileges: **"Read and write to any database"**
7. Click **"Add User"**

**⚠️ IMPORTANT: Save your username and password somewhere safe!**

#### 4. Set Up Network Access (Allow Connections)

1. On left sidebar, click **"Network Access"**
2. Click **"Add IP Address"**
3. For development/testing, choose one:
   - **Option A (Easy)**: Click **"Allow Access from Anywhere"**
     - This adds `0.0.0.0/0` (all IPs can connect)
     - Good for development, not for production
   - **Option B (Secure)**: Click **"Add Current IP Address"**
     - Only your current IP can connect
     - You'll need to add more IPs if you change networks
4. Click **"Confirm"**

#### 5. Get Your Connection String

1. Go back to **"Database"** (left sidebar)
2. Your cluster should be ready (green "Active" status)
3. Click **"Connect"** button on your cluster
4. Choose connection method: **"Connect your application"**
5. Driver: **"Node.js"**
6. Version: **"4.1 or later"**
7. Copy the connection string - it looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

#### 6. Update Your .env File

1. Open `/Users/ihorromanenko/Desktop/test25/.env`
2. Find the line:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/creator-tracker?retryWrites=true&w=majority
   ```
3. Replace it with your connection string:
   ```env
   MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/creator-tracker?retryWrites=true&w=majority
   ```
   
   **Replace:**
   - `YOUR_USERNAME` → Your database username
   - `YOUR_PASSWORD` → Your database password
   - `cluster0.xxxxx` → Your actual cluster address
   - Keep `/creator-tracker` as the database name

4. **Example:**
   ```env
   MONGODB_URI=mongodb+srv://admin:MySecurePass123@cluster0.ab12cd.mongodb.net/creator-tracker?retryWrites=true&w=majority
   ```

#### 7. Restart Your Backend

```bash
# Kill existing backend
lsof -ti:5001 | xargs kill -9

# Start backend with new MongoDB connection
cd /Users/ihorromanenko/Desktop/test25/backend
PORT=5001 npm start
```

#### 8. Verify Connection

You should see:
```
✅ MongoDB Connected: cluster0-shard-00-00.xxxxx.mongodb.net
🚀 Server running on port 5001
```

**Success!** Your MongoDB is now connected! 🎉

---

## Option 2: Local MongoDB (On Your Mac)

### What You Need:
- ✅ macOS with Homebrew installed
- ✅ ~500 MB disk space
- ✅ Admin/sudo access

### Step-by-Step Instructions:

#### 1. Install Homebrew (if not installed)

Check if you have Homebrew:
```bash
brew --version
```

If not installed:
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

#### 2. Install MongoDB

```bash
# Add MongoDB tap
brew tap mongodb/brew

# Install MongoDB Community Edition
brew install mongodb-community@7.0

# This takes 2-5 minutes
```

#### 3. Start MongoDB Service

```bash
# Start MongoDB (runs in background)
brew services start mongodb-community@7.0

# Verify it's running
brew services list | grep mongodb
```

You should see:
```
mongodb-community@7.0  started
```

#### 4. Update Your .env File

```env
MONGODB_URI=mongodb://localhost:27017/creator-tracker
```

#### 5. Restart Your Backend

```bash
cd /Users/ihorromanenko/Desktop/test25/backend
PORT=5001 npm start
```

#### 6. Verify Connection

You should see:
```
✅ MongoDB Connected: localhost:27017
🚀 Server running on port 5001
```

---

## Troubleshooting

### Atlas: "Authentication failed"
- ❌ Wrong username or password
- ✅ Solution: Re-check credentials in Database Access
- ✅ Make sure password doesn't have special characters that need URL encoding

### Atlas: "Network error" / "ENOTFOUND"
- ❌ IP address not whitelisted
- ✅ Solution: Add your IP in Network Access
- ✅ Or allow all IPs (0.0.0.0/0) for development

### Local: "ECONNREFUSED localhost:27017"
- ❌ MongoDB service not running
- ✅ Solution: `brew services start mongodb-community@7.0`

### "querySrv ENOTFOUND"
- ❌ Invalid connection string
- ✅ Solution: Copy connection string exactly from Atlas
- ✅ Make sure to replace `<username>` and `<password>`

---

## Which Option Should You Choose?

### Choose MongoDB Atlas (Cloud) if:
- ✅ You want the **easiest setup** (no installation)
- ✅ You want **free hosting** (no server needed)
- ✅ You want to **deploy to production** later
- ✅ You want **automatic backups**
- ✅ You're new to MongoDB

### Choose Local MongoDB if:
- ✅ You want to work **offline**
- ✅ You have **fast local development** preference
- ✅ You're **experienced with databases**
- ✅ You want **full control** over the database

**Recommendation: Use MongoDB Atlas** - It's free, easy, and production-ready! 🚀

---

## After MongoDB is Connected

### What Will Work:
✅ **User profiles saved** - Data persists across sessions  
✅ **Subscription storage** - Plan info saved to database  
✅ **Projects/Calendar/Brand Deals** - All features work  
✅ **Stripe webhooks** - Subscription updates save correctly  
✅ **Full app functionality** - Everything works as designed  

### Test Your Connection:

```bash
# In your backend directory
cd /Users/ihorromanenko/Desktop/test25/backend

# Check logs for successful connection
PORT=5001 npm start

# Should see:
# ✅ MongoDB Connected: cluster0.xxxxx.mongodb.net (or localhost)
# 🚀 Server running on port 5001
```

### View Your Data:

**For Atlas:**
1. Go to https://cloud.mongodb.com
2. Click "Browse Collections"
3. See your data in real-time

**For Local:**
```bash
# Install MongoDB Compass (GUI)
brew install mongodb-compass

# Or use command line
mongosh mongodb://localhost:27017/creator-tracker
```

---

## Quick Reference

### MongoDB Atlas Connection String Format:
```
mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/DATABASE?retryWrites=true&w=majority
```

### Local MongoDB Connection String:
```
mongodb://localhost:27017/creator-tracker
```

### Environment Variable (in .env):
```env
# Cloud (Atlas)
MONGODB_URI=mongodb+srv://admin:pass123@cluster0.ab12cd.mongodb.net/creator-tracker?retryWrites=true&w=majority

# OR Local
MONGODB_URI=mongodb://localhost:27017/creator-tracker
```

---

## Security Tips

### For Production:
1. ❌ Don't use `0.0.0.0/0` for Network Access
2. ✅ Whitelist only specific IPs
3. ✅ Use strong passwords
4. ✅ Enable encryption at rest
5. ✅ Rotate credentials regularly
6. ✅ Use environment variables (never hardcode)

### Password URL Encoding:
If your password contains special characters, encode them:
- `@` → `%40`
- `#` → `%23`
- `$` → `%24`
- `%` → `%25`
- etc.

Or use `encodeURIComponent()` in Node.js.

---

## Need Help?

### MongoDB Atlas Support:
- Documentation: https://docs.atlas.mongodb.com
- Community: https://community.mongodb.com
- Free tier: M0 (512 MB)

### Your App Status:
- Backend: http://localhost:5001
- Frontend: http://localhost:3000
- API Docs: See `API_DOCS.md`

---

**Ready to connect?** Follow Option 1 (MongoDB Atlas) for the fastest setup! 🚀

**Estimated time**: 5-10 minutes from start to finish.
