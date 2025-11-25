/**
 * Manual User Subscription Fix Script
 * 
 * Use this script to manually update a user's subscription data in the database.
 * Run with: node fix-user-subscription.js <email> <plan>
 * 
 * Example: node fix-user-subscription.js user@example.com Premium
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

// Get command line arguments
const userEmail = process.argv[2];
const subscriptionPlan = process.argv[3]; // Lite, Pro, or Premium

if (!userEmail || !subscriptionPlan) {
  console.error('❌ Usage: node fix-user-subscription.js <email> <plan>');
  console.error('   Plans: Lite, Pro, Premium');
  console.error('   Example: node fix-user-subscription.js user@example.com Premium');
  process.exit(1);
}

if (!['Lite', 'Pro', 'Premium'].includes(subscriptionPlan)) {
  console.error('❌ Invalid plan. Must be: Lite, Pro, or Premium');
  process.exit(1);
}

async function fixUserSubscription() {
  try {
    // Connect to MongoDB
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find user
    console.log(`🔍 Searching for user: ${userEmail}`);
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      console.error(`❌ User not found: ${userEmail}`);
      process.exit(1);
    }

    console.log('👤 User found:', {
      email: user.email,
      currentRole: user.role,
      currentStatus: user.subscriptionStatus,
      currentPlan: user.subscriptionPlan
    });

    // Update user subscription
    console.log(`\n🔄 Updating user to ${subscriptionPlan} plan...`);
    
    user.role = 'pro_user';
    user.subscriptionStatus = 'active';
    user.subscriptionPlan = subscriptionPlan;
    
    // Set subscription period end to 1 year from now if not set
    if (!user.subscriptionPeriodEnd) {
      const oneYearFromNow = new Date();
      oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
      user.subscriptionPeriodEnd = oneYearFromNow;
    }

    await user.save();

    console.log('\n✅ User updated successfully!');
    console.log('📊 New user data:', {
      email: user.email,
      role: user.role,
      subscriptionStatus: user.subscriptionStatus,
      subscriptionPlan: user.subscriptionPlan,
      subscriptionPeriodEnd: user.subscriptionPeriodEnd
    });

    console.log('\n🎉 Done! User should now have Pro access.');
    console.log('💡 User should refresh their browser or log out and back in to see changes.');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

// Run the script
fixUserSubscription();
