# 🚀 Quick Start Guide - Testing All Features

## Prerequisites
- MongoDB running with your connection string
- Stripe account with test API keys
- OpenAI API key configured
- Node.js installed

## Step 1: Start the Backend
```bash
cd backend
npm start
```
Backend should start on `http://localhost:5001`

## Step 2: Start the Frontend
```bash
npm run dev
```
Frontend should start on `http://localhost:3001`

---

## 🧪 Testing Checklist

### 1. Subscription Flow ✅

#### Sign Up & Subscribe:
1. Go to `http://localhost:3001/signup`
2. Create a new account
3. Click "Upgrade to Pro" in the dashboard
4. Select a plan (Lite/Pro/Premium)
5. Use Stripe test card: `4242 4242 4242 4242`
6. Complete checkout
7. **Check:** You should see success page with confetti
8. **Check MongoDB:** User document should have:
   - `subscriptionStatus: 'active'`
   - `role: 'pro_user'`
   - `subscriptionPlan: 'Pro'` (or Lite/Premium)
   - `subscriptionPeriodEnd: [Date]`

#### Test Subscription Management:
1. Go to `/dashboard/settings`
2. **Test Cancel:**
   - Click "Cancel Subscription"
   - Confirm cancellation
   - Should show "will be cancelled at end of period"
3. **Test Refund:**
   - Click "Request Refund"
   - Submit request
   - Should show 14-day policy
4. **Test Billing Portal:**
   - Click "Manage Billing"
   - Should redirect to Stripe Customer Portal

---

### 2. Analytics Page 📊

1. Go to `/dashboard/analytics`
2. **Check Features:**
   - [ ] 4 metric cards with animated numbers
   - [ ] Interactive bar chart (hover for details)
   - [ ] Top performing content list
   - [ ] Revenue tracking section
   - [ ] AI insights section
   - [ ] Time range selector (7d, 30d, 90d, 1y)
   - [ ] Export dropdown (PDF/CSV)
3. **Check Animations:**
   - [ ] Cards fade in on page load
   - [ ] Chart bars animate from bottom
   - [ ] Hover effects on all interactive elements

---

### 3. Branding Page 🎨

1. Go to `/dashboard/branding`
2. **Test Features:**
   - [ ] Upload logo (drag & drop or click)
   - [ ] Change primary color (color picker)
   - [ ] Change secondary color
   - [ ] Change accent color
   - [ ] Try color presets (Vibrant, Ocean, Sunset, etc.)
   - [ ] Select different fonts from dropdown
   - [ ] Apply quick template
   - [ ] Enter brand name, tagline, website
   - [ ] See live preview update in real-time
   - [ ] Click "Save Changes"
3. **Check Animations:**
   - [ ] Smooth color transitions
   - [ ] Template hover effects
   - [ ] Save button animation

---

### 4. Social Integrations 🔗

1. Go to `/dashboard/integrations`
2. **Test Features:**
   - [ ] Connection status overview shows 0/8 connected
   - [ ] Click "Connect Instagram"
   - [ ] Should simulate OAuth and show connected state
   - [ ] View follower count and username
   - [ ] Click refresh icon to sync data
   - [ ] Click "View Analytics" button
   - [ ] Click disconnect (X button)
   - [ ] Repeat for other platforms
3. **Platforms to Test:**
   - [ ] Instagram
   - [ ] YouTube
   - [ ] TikTok
   - [ ] Twitter/X
   - [ ] Facebook
   - [ ] LinkedIn
   - [ ] Twitch
   - [ ] Discord
4. **Check Animations:**
   - [ ] Platform icons animate on hover
   - [ ] Connection status updates smoothly
   - [ ] Refresh icon spins when syncing

---

### 5. Enhanced AI Tools 🤖

1. Go to `/dashboard/ai-tools`

#### Caption Generator Tab:
1. **Set Options:**
   - [ ] Select Platform: Instagram
   - [ ] Select Tone: Casual
   - [ ] Select Length: Medium
2. **Generate:**
   - [ ] Enter: "A video about morning routine for productivity"
   - [ ] Click "Generate Caption"
   - [ ] Wait for AI response (should see loading spinner)
   - [ ] Caption appears in right panel
3. **Test Actions:**
   - [ ] Click copy icon (should show checkmark)
   - [ ] Click download icon (should download .txt file)
4. **Try Different Combinations:**
   - [ ] Professional tone + Long length
   - [ ] Funny tone + Short length
   - [ ] Different platforms (TikTok, YouTube, etc.)

#### Script Writer Tab:
1. **Set Options:**
   - [ ] Select Tone: Inspiring
   - [ ] Select Length: Medium (2-5min)
2. **Generate:**
   - [ ] Enter: "5 tips for new content creators"
   - [ ] Click "Generate Script"
   - [ ] Wait for AI response
   - [ ] Script appears with structure (Hook, Main Content, CTA)
3. **Test Actions:**
   - [ ] Click copy icon
   - [ ] Click download icon
4. **Try Different Combinations:**
   - [ ] Educational tone + Long length
   - [ ] Storytelling tone + Short length

---

### 6. Navigation & Layout 🗺️

1. **Check Sidebar:**
   - [ ] Dashboard
   - [ ] Projects
   - [ ] Calendar
   - [ ] Brand Deals
   - [ ] AI Tools (PRO badge if free)
   - [ ] Analytics (PRO badge if free)
   - [ ] Branding (PRO badge if free)
   - [ ] Integrations (PRO badge if free)
   - [ ] Profile
   - [ ] Settings

2. **Check User Profile:**
   - [ ] Avatar with initial
   - [ ] Display name
   - [ ] Subscription badge (Lite/Pro/Premium)
   - [ ] "Upgrade to Pro" button (if free)
   - [ ] Sign Out button

3. **Check Top Bar:**
   - [ ] Dark mode toggle (moon/sun icon)
   - [ ] Notifications bell (with red dot)
   - [ ] Responsive menu on mobile

---

### 7. Pro Feature Gates 🔒

#### As Free User:
1. Go to `/dashboard/ai-tools`
   - [ ] Should see upgrade prompt with emoji 🔒
   - [ ] Shows features preview
   - [ ] "Upgrade to Pro Now" button
2. Go to `/dashboard/analytics`
   - [ ] Should see upgrade prompt with emoji 📊
3. Go to `/dashboard/branding`
   - [ ] Should see upgrade prompt with emoji 🎨
4. Go to `/dashboard/integrations`
   - [ ] Should see upgrade prompt with emoji 🔗

#### After Subscribing:
1. All pages should show full content
2. No more upgrade prompts
3. All features accessible

---

## 🐛 Common Issues & Solutions

### Backend won't start:
- Check MongoDB connection string in `.env`
- Verify port 5001 is not in use
- Run `npm install` in backend folder

### Frontend won't start:
- Check port 3001 is not in use
- Run `npm install` in root folder
- Clear `.next` cache: `rm -rf .next`

### Stripe payments fail:
- Verify Stripe keys in `.env`
- Use test card: `4242 4242 4242 4242`
- Check webhook secret matches Stripe dashboard

### AI tools not working:
- Verify OpenAI API key in `.env`
- Check API key has credits
- Look for errors in browser console

### Subscription not updating MongoDB:
- Check webhook is configured in Stripe
- Verify MongoDB connection
- Check backend logs for errors

---

## 📱 Mobile Testing

1. Open browser DevTools
2. Toggle device toolbar
3. Test on iPhone/Android viewport
4. **Check:**
   - [ ] Sidebar becomes mobile menu
   - [ ] All pages responsive
   - [ ] Forms work on mobile
   - [ ] Animations smooth on touch

---

## ✅ Success Criteria

All features working when:
- ✅ User can sign up and subscribe
- ✅ MongoDB updates automatically after payment
- ✅ User can cancel/refund subscription
- ✅ Analytics page shows metrics and charts
- ✅ Branding page allows customization
- ✅ Integrations can connect platforms
- ✅ AI tools generate captions/scripts with options
- ✅ All pages have modern design and animations
- ✅ Pro features are properly gated
- ✅ Navigation works smoothly
- ✅ Dark mode works
- ✅ Export functionality works

---

## 🎉 Ready for Production!

Once all tests pass, your SaaS app is fully functional with:
- Complete subscription management
- Advanced analytics & insights
- Custom branding options
- Social platform integrations
- Enhanced AI tools with advanced options
- Modern, animated UI/UX
- Full export capabilities

**Happy testing! 🚀**
