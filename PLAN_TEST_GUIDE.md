# Quick Test Guide - Updated Subscription Plans

## 🎯 Quick Testing Checklist

### ✅ Visual Tests (5 minutes)

**1. Pricing Page**
```bash
URL: http://localhost:3000/pricing
```
- [ ] See 3 plans: Starter, Pro, Premium
- [ ] Starter shows "FREE" and "Start Free" button
- [ ] Pro shows "€11.99" and "⭐ MOST POPULAR" badge
- [ ] Premium shows "€14.99"
- [ ] All features match new structure

**2. Upgrade Page**
```bash
URL: http://localhost:3000/upgrade
```
- [ ] Same 3 plans visible
- [ ] If logged in, shows current plan
- [ ] Free users see Starter as "Current Plan"
- [ ] Upgrade buttons work

**3. Profile Page**
```bash
URL: http://localhost:3000/dashboard/profile
```
- [ ] Free users see "Free Plan" or no badge
- [ ] Pro users see purple "⭐ Pro" badge
- [ ] Premium users see orange "👑 Premium" badge

**4. Settings Page**
```bash
URL: http://localhost:3000/dashboard/settings
```
- [ ] Same badge display as profile
- [ ] Manage subscription button works (Pro/Premium only)

---

## 🧪 Functional Tests (10 minutes)

### Test 1: Free User Signup
```bash
1. Go to: http://localhost:3000/signup
2. Create new account
3. Go to dashboard
4. Check: Should have 0 projects, 0 deals
5. Check: Should be on Starter (free) plan
```
**Expected:** New users start with clean slate, Starter plan

### Test 2: Pro Upgrade
```bash
1. From dashboard, click "Upgrade"
2. Select Pro plan
3. Complete Stripe checkout (use test card)
4. After success, check profile
```
**Expected:** User now has Pro badge, unlimited projects/deals

### Test 3: Premium Upgrade
```bash
1. From dashboard, click "Upgrade"
2. Select Premium plan
3. Complete Stripe checkout (use test card)
4. After success, check profile
5. Try accessing Team page
```
**Expected:** User now has Premium badge, can access team features

---

## 🔍 Feature Verification (5 minutes)

### Starter Plan Features
```bash
Navigate to: /dashboard
```
- [ ] Can create up to 3 projects
- [ ] Can create up to 3 brand deals
- [ ] Can view basic analytics
- [ ] Can use calendar
- [ ] **Cannot** use AI tools (should show upgrade prompt)
- [ ] **Cannot** access team features

### Pro Plan Features
```bash
Log in as Pro user or upgrade to Pro
```
- [ ] Can create unlimited projects
- [ ] Can create unlimited brand deals
- [ ] Can access AI caption generator
- [ ] Can access AI script writer
- [ ] Can view advanced analytics
- [ ] Can use custom branding
- [ ] **Cannot** access team features (Premium only)

### Premium Plan Features
```bash
Log in as Premium user or upgrade to Premium
```
- [ ] All Pro features available
- [ ] Can access Team page (/team)
- [ ] Can add up to 5 team members
- [ ] Can use advanced AI tools
- [ ] Can access premium features hub (/premium)

---

## ✨ Success Criteria

After testing, you should see:

✅ **Visual**
- All pages show 3 plans: Starter (free), Pro, Premium
- Correct colors and icons for each plan
- Features match new structure

✅ **Functional**
- New signups get Starter plan
- Upgrades to Pro/Premium work
- Plan badges display correctly
- Feature access matches plan level

✅ **Technical**
- No "Lite" references in UI
- Database stores correct plan names
- Stripe integration works
- No console errors

---

**Test Duration:** ~20 minutes total
**Status:** Ready to test ✅
