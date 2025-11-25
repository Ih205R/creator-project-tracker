# AI Credits Purchase System - Quick Test Checklist

## ✅ Pre-Testing Verification
- [x] Frontend page loads without errors
- [x] Backend server is running (port 5001)
- [x] Frontend server is running (port 3000)
- [x] Environment variables configured
- [x] Stripe keys are set
- [x] MongoDB connection active
- [x] Build cache cleared

## 🧪 Test Scenarios

### Test 1: View Credit Balance
1. Navigate to `http://localhost:3000/dashboard/analytics/deep`
2. Look for "AI Channel Summary" section
3. **Expected**: See current credit balance displayed
4. **Pass/Fail**: _____

### Test 2: View Credit Purchase Modal
1. Click "Buy More Credits" button (if balance < 3)
   - OR scroll to AI Channel Summary section
2. **Expected**: Modal opens with 3 packages
   - Small: 10 credits - $9.99
   - Medium: 50 credits - $39.99 (POPULAR)
   - Large: 100 credits - $69.99 (BEST VALUE)
3. **Pass/Fail**: _____

### Test 3: Initiate Credit Purchase
1. Click "Purchase" on any package
2. **Expected**: 
   - Button shows "Processing..."
   - Redirected to Stripe Checkout page
3. **Pass/Fail**: _____

### Test 4: Complete Test Purchase
1. On Stripe Checkout, enter:
   - Card: `4242 4242 4242 4242`
   - Expiry: Any future date (e.g., 12/25)
   - CVC: Any 3 digits (e.g., 123)
   - Name: Test User
   - Email: Your email
2. Click "Pay"
3. **Expected**: 
   - Payment processes successfully
   - Redirected back to Deep Analytics page
   - Success message appears: "Successfully purchased X credits!"
   - Credit balance updates automatically
4. **Pass/Fail**: _____

### Test 5: Generate AI Summary (with credits)
1. Ensure you have at least 3 credits
2. Click "Generate AI Summary (3 Credits)"
3. **Expected**:
   - Button shows "Generating..." with spinner
   - AI summary appears after ~10-30 seconds
   - Shows comprehensive analysis with sections:
     - Channel Overview
     - Demand Analysis
     - Growth Analysis
     - Key Strengths
     - Growth Opportunities
     - Growth Projections
     - Improvement Suggestions
     - Market Position
   - Green success message: "Successfully generated! Used 3 credits. X credits remaining."
   - Credit balance decreases by 3
4. **Pass/Fail**: _____

### Test 6: Try to Generate Summary (insufficient credits)
1. Wait until credit balance < 3
2. Try to click "Generate AI Summary"
3. **Expected**:
   - Button is disabled
   - Message shown: "You need at least 3 AI Credits to generate a summary"
   - "Buy More Credits" button visible
4. **Pass/Fail**: _____

### Test 7: URL Parameter Handling
1. After successful purchase, check URL
2. **Expected**: 
   - URL briefly shows: `/dashboard/analytics/deep?purchase=success&credits=X`
   - URL params are cleared automatically
   - Clean URL remains: `/dashboard/analytics/deep`
3. **Pass/Fail**: _____

### Test 8: Cancel Purchase
1. Initiate purchase
2. On Stripe Checkout, click "Back" or cancel
3. **Expected**:
   - Redirected back to Deep Analytics page
   - No error messages
   - Credit balance unchanged
4. **Pass/Fail**: _____

## 🔍 Backend Verification

### Check 1: Webhook Logs
1. Open terminal running backend server
2. Complete a test purchase
3. **Expected logs**:
   ```
   🎉 Checkout completed for session: cs_test_xxxxx
   💎 Added X credits to user email@example.com. New balance: X
   ```
4. **Pass/Fail**: _____

### Check 2: Database Update
1. Check MongoDB user document
2. **Expected**:
   - `aiCredits` field exists
   - Value matches current balance
   - `stripeCustomerId` is saved
3. **Pass/Fail**: _____

### Check 3: Credit Deduction
1. Generate AI summary
2. Check backend logs
3. **Expected**:
   - Log shows credit deduction
   - New balance calculated correctly
4. **Pass/Fail**: _____

## 🚨 Error Testing

### Error Test 1: Network Failure
1. Disconnect internet
2. Try to purchase credits
3. **Expected**: Error message shown
4. **Pass/Fail**: _____

### Error Test 2: Invalid Card
1. Use card: `4000 0000 0000 0002` (declined card)
2. **Expected**: Stripe shows decline message
3. **Pass/Fail**: _____

### Error Test 3: Generate Without Authentication
1. Log out
2. Try to access `/dashboard/analytics/deep`
3. **Expected**: Redirected to login
4. **Pass/Fail**: _____

## 📊 Results Summary

**Total Tests**: 14  
**Passed**: _____  
**Failed**: _____  
**Issues Found**: _____

### Issues to Fix:
1. _____________________
2. _____________________
3. _____________________

## 🎯 Success Criteria
- [x] All files compile without errors
- [ ] All 14 tests pass
- [ ] No console errors
- [ ] Credits add correctly after purchase
- [ ] Credits deduct correctly after use
- [ ] UI shows accurate credit balance
- [ ] Success messages display properly
- [ ] Error handling works correctly

## 📝 Notes
_______________________________________________________
_______________________________________________________
_______________________________________________________

---

**Tester**: _______________  
**Date**: _______________  
**Environment**: Development  
**Status**: ⏳ Ready for Testing
