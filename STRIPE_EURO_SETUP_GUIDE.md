# 🔴 STRIPE SETUP GUIDE - EURO PRICING

## Problem
Your `.env` file had **Product IDs** (`prod_xxxxx`) instead of **Price IDs** (`price_xxxxx`). Stripe checkout requires Price IDs to process payments.

---

## ✅ Solution: Create Prices in Stripe Dashboard

### Step 1: Access Stripe Dashboard
1. Go to [Stripe Test Dashboard](https://dashboard.stripe.com/test/products)
2. Log in with your Stripe account

### Step 2: Create Prices for Each Product

You need to create 6 prices total (3 monthly + 3 annual):

#### **Lite Plan**
- **Monthly Price**: €7.99/month
- **Annual Price**: €76.99/year

#### **Pro Plan** 
- **Monthly Price**: €11.99/month
- **Annual Price**: €114.99/year

#### **Premium Plan**
- **Monthly Price**: €14.99/month
- **Annual Price**: €142.99/year

---

## 📋 How to Create Prices in Stripe

### Option A: Update Existing Products

1. **Find Your Products**:
   - Lite Product: `prod_TR0vD2xkQkQPnG`
   - Pro Product: `prod_TR0vXJjp5EQO0V`
   - Premium Product: `prod_TR0vgZtaWwzMcE`

2. **For Each Product**:
   - Click on the product in Stripe Dashboard
   - Click "Add another price"
   - Enter the amount in **Euros** (€)
   - Select billing period (Monthly or Yearly)
   - Set currency to **EUR**
   - Click "Save"
   - **Copy the Price ID** (starts with `price_`)

### Option B: Create New Products (Recommended)

If you want clean products:

1. Click "Create product" in Stripe Dashboard
2. Enter product details:
   - **Name**: "Lite Plan" / "Pro Plan" / "Premium Plan"
   - **Description**: Add description from your pages
   - **Pricing**: 
     - Amount: €7.99 (for Lite monthly, etc.)
     - Currency: EUR
     - Billing period: Monthly or Yearly
     - Recurring: Yes
3. Click "Save product"
4. **Copy the Price ID** from the pricing section
5. Repeat for all 6 prices

---

## 🔧 Update Your .env File

After creating prices in Stripe, you'll have 6 Price IDs. Update your `.env`:

```bash
# Example Price IDs (replace with your actual IDs from Stripe)

# Monthly Plans
STRIPE_LITE_MONTHLY=price_1ABC123DEF456GHI
STRIPE_PRO_MONTHLY=price_1ABC123DEF456JKL
STRIPE_PREMIUM_MONTHLY=price_1ABC123DEF456MNO

# Annual Plans
STRIPE_LITE_ANNUAL=price_1ABC123DEF456PQR
STRIPE_PRO_ANNUAL=price_1ABC123DEF456STU
STRIPE_PREMIUM_ANNUAL=price_1ABC123DEF456VWX

# Public (client-side) - Same IDs
NEXT_PUBLIC_STRIPE_LITE_MONTHLY=price_1ABC123DEF456GHI
NEXT_PUBLIC_STRIPE_PRO_MONTHLY=price_1ABC123DEF456JKL
NEXT_PUBLIC_STRIPE_PREMIUM_MONTHLY=price_1ABC123DEF456MNO
NEXT_PUBLIC_STRIPE_LITE_ANNUAL=price_1ABC123DEF456PQR
NEXT_PUBLIC_STRIPE_PRO_ANNUAL=price_1ABC123DEF456STU
NEXT_PUBLIC_STRIPE_PREMIUM_ANNUAL=price_1ABC123DEF456VWX
```

---

## 🌍 Display Currency Symbol (€ instead of $)

Since you're using Euros, you should also update your frontend pages to display € instead of $:

### Update Pricing Pages

You need to update these files:
- `/app/pricing/page.js`
- `/app/upgrade/page.js`
- `/app/dashboard/upgrade/page.js`

**Change this**:
```javascript
<span className="text-5xl font-bold text-gray-900 dark:text-white">
  ${currentPrice}
</span>
```

**To this**:
```javascript
<span className="text-5xl font-bold text-gray-900 dark:text-white">
  €{currentPrice}
</span>
```

---

## 🔄 Testing Checklist

### 1. Update .env with Real Price IDs
- [ ] Replace all `price_YOUR_*` placeholders with actual Stripe Price IDs
- [ ] Verify all 6 price IDs are correct
- [ ] Verify all NEXT_PUBLIC_ variables match the regular ones

### 2. Restart Your Servers
```bash
# Stop all running servers
# Then restart them

# Frontend (Next.js)
npm run dev

# Backend (Node.js) - in a new terminal
cd backend
npm start
```

### 3. Test Checkout Flow

Use Stripe test cards:
- **Success**: `4242 4242 4242 4242`
- **Failure**: `4000 0000 0000 0002`
- **3D Secure**: `4000 0025 0000 3155`

Test each plan:
- [ ] Lite Monthly (€7.99)
- [ ] Lite Annual (€76.99)
- [ ] Pro Monthly (€11.99)
- [ ] Pro Annual (€114.99)
- [ ] Premium Monthly (€14.99)
- [ ] Premium Annual (€142.99)

### 4. Verify Stripe Dashboard
After successful test:
- [ ] Check Stripe Dashboard > Customers
- [ ] Verify subscription was created
- [ ] Check the correct price is shown (in Euros)
- [ ] Verify webhook events fired (if webhooks configured)

---

## 🚨 Common Errors & Solutions

### Error: "No such price"
**Cause**: Price ID doesn't exist or is incorrect
**Solution**: Double-check Price ID in Stripe Dashboard and .env file

### Error: "Invalid currency"
**Cause**: Product/Price created in different currency
**Solution**: Create new prices with EUR currency

### Error: "Price not found"
**Cause**: Using Product ID instead of Price ID
**Solution**: Use Price IDs (start with `price_`) not Product IDs (`prod_`)

### Error: Checkout redirects but no session
**Cause**: Backend can't create session with given Price ID
**Solution**: Check backend logs and verify Price ID exists in Stripe

---

## 📝 Quick Reference

### What You Need:
- ✅ 6 Price IDs from Stripe (not Product IDs)
- ✅ All prices in EUR currency
- ✅ Updated .env file
- ✅ Restarted servers
- ✅ Changed $ to € in frontend

### Price Structure:
| Plan | Monthly | Annual |
|------|---------|--------|
| Lite | €7.99 | €76.99 |
| Pro | €11.99 | €114.99 |
| Premium | €14.99 | €142.99 |

---

## 🎯 Next Steps

1. **Go to Stripe Dashboard** → Create 6 prices with EUR amounts
2. **Copy Price IDs** → Update .env file
3. **Update Currency Symbol** → Change $ to € in frontend files
4. **Restart Servers** → Stop and start both frontend and backend
5. **Test Checkout** → Use test card 4242 4242 4242 4242
6. **Verify in Stripe** → Check subscription was created

---

## ❓ Need Help?

If you're still having issues:
1. Check Stripe Dashboard > Logs for errors
2. Check browser console for errors
3. Check backend terminal logs
4. Verify Price IDs match exactly
5. Ensure currency is set to EUR in Stripe

**Remember**: You MUST use Price IDs (starting with `price_`), NOT Product IDs (starting with `prod_`)!
