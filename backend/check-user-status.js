/**
 * Check User Subscription Status Script
 * 
 * Use this script to check a user's current subscription data in the database.
 * Run with: node check-user-status.js <email>
 * 
 * Example: node check-user-status.js user@example.com
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

// Get command line arguments
const userEmail = process.argv[2];

if (!userEmail) {
  console.error('❌ Usage: node check-user-status.js <email>');
  console.error('   Example: node check-user-status.js user@example.com');
  process.exit(1);
}

async function checkUserStatus() {
  try {
    // Connect to MongoDB
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Find user
    console.log(`🔍 Searching for user: ${userEmail}`);
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      console.error(`❌ User not found: ${userEmail}`);
      process.exit(1);
    }

    console.log('\n📊 User Subscription Status\n');
    console.log('═══════════════════════════════════════════════════');
    console.log('👤 User Info:');
    console.log('   Email:', user.email);
    console.log('   Display Name:', user.displayName || 'Not set');
    console.log('   Firebase UID:', user.firebaseUid);
    console.log('\n💳 Subscription Info:');
    console.log('   Role:', user.role);
    console.log('   Status:', user.subscriptionStatus);
    console.log('   Plan:', user.subscriptionPlan || 'None');
    console.log('   Subscription ID:', user.subscriptionId || 'None');
    console.log('   Stripe Customer ID:', user.stripeCustomerId || 'None');
    
    if (user.subscriptionPeriodEnd) {
      console.log('   Period End:', user.subscriptionPeriodEnd.toISOString());
      const now = new Date();
      const daysRemaining = Math.ceil((user.subscriptionPeriodEnd - now) / (1000 * 60 * 60 * 24));
      console.log('   Days Remaining:', daysRemaining > 0 ? daysRemaining : 'Expired');
    } else {
      console.log('   Period End: Not set');
    }

    console.log('\n🔐 Access Status:');
    const isPro = user.role === 'pro_user' && 
                  user.subscriptionStatus === 'active' &&
                  ['Lite', 'Pro', 'Premium'].includes(user.subscriptionPlan);
    
    if (isPro) {
      console.log('   ✅ HAS PRO ACCESS');
      console.log('   Plan:', user.subscriptionPlan);
    } else {
      console.log('   ❌ NO PRO ACCESS');
      console.log('\n   Why?');
      if (user.role !== 'pro_user') {
        console.log('   - Role is not "pro_user" (current:', user.role + ')');
      }
      if (user.subscriptionStatus !== 'active') {
        console.log('   - Status is not "active" (current:', user.subscriptionStatus + ')');
      }
      if (!['Lite', 'Pro', 'Premium'].includes(user.subscriptionPlan)) {
        console.log('   - Plan is not Lite/Pro/Premium (current:', user.subscriptionPlan || 'None' + ')');
      }
    }

    console.log('\n📅 Account Dates:');
    console.log('   Created:', user.createdAt.toISOString());
    console.log('   Updated:', user.updatedAt.toISOString());
    console.log('═══════════════════════════════════════════════════\n');

    if (!isPro && user.subscriptionPlan) {
      console.log('💡 TIP: User has a plan but no Pro access.');
      console.log('   Run: node fix-user-subscription.js ' + user.email + ' ' + user.subscriptionPlan);
      console.log('   to grant Pro access.\n');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

// Run the script
checkUserStatus();
