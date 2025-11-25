/**
 * Quick Fix for Premium User - test4@gmail.com
 * Run from project root: node fix-premium-user.js
 */

require('dotenv').config();
const mongoose = require('mongoose');

// User Schema (inline)
const userSchema = new mongoose.Schema({
  firebaseUid: String,
  email: String,
  displayName: String,
  role: String,
  subscriptionStatus: String,
  subscriptionPlan: String,
  subscriptionId: String,
  subscriptionPeriodEnd: Date,
  stripeCustomerId: String,
});

const User = mongoose.model('User', userSchema);

async function fixUser() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    console.log('📍 URI:', process.env.MONGODB_URI ? 'Found' : 'NOT FOUND');
    
    if (!process.env.MONGODB_URI) {
      console.error('❌ MONGODB_URI not found in environment variables');
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Find user
    const email = 'test4@gmail.com';
    console.log(`🔍 Searching for user: ${email}`);
    const user = await User.findOne({ email });

    if (!user) {
      console.error(`❌ User not found: ${email}`);
      console.log('\n💡 Available users:');
      const allUsers = await User.find({}, 'email').limit(5);
      allUsers.forEach(u => console.log(`   - ${u.email}`));
      process.exit(1);
    }

    console.log('\n📊 BEFORE UPDATE:');
    console.log('═══════════════════════════════════════');
    console.log('Email:', user.email);
    console.log('Role:', user.role);
    console.log('Status:', user.subscriptionStatus);
    console.log('Plan:', user.subscriptionPlan);
    console.log('Stripe Customer:', user.stripeCustomerId || 'None');

    // Update to Premium
    console.log('\n🔄 Updating to Premium...');
    user.role = 'pro_user';
    user.subscriptionStatus = 'active';
    user.subscriptionPlan = 'Premium';
    
    // Set period end to 1 year from now if not set
    if (!user.subscriptionPeriodEnd) {
      const oneYearFromNow = new Date();
      oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
      user.subscriptionPeriodEnd = oneYearFromNow;
    }

    await user.save();

    console.log('\n✅ AFTER UPDATE:');
    console.log('═══════════════════════════════════════');
    console.log('Email:', user.email);
    console.log('Role:', user.role);
    console.log('Status:', user.subscriptionStatus);
    console.log('Plan:', user.subscriptionPlan);
    console.log('Period End:', user.subscriptionPeriodEnd);

    console.log('\n🎉 SUCCESS! User updated to Premium!');
    console.log('\n📝 Next steps:');
    console.log('1. Go to your browser');
    console.log('2. Press Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows) to hard refresh');
    console.log('3. You should now see the "⭐ Premium" badge');
    console.log('4. All Pro features should be unlocked');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

// Run the fix
console.log('🚀 Premium User Fix Script');
console.log('═══════════════════════════════════════\n');
fixUser();
