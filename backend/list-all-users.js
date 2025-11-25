/**
 * List All Users Script
 * Lists all users in the database with their subscription info
 */

require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const User = require('./models/User');

async function listAllUsers() {
  try {
    // Connect to MongoDB
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Find all users
    const users = await User.find({}).select('email displayName role subscriptionStatus subscriptionPlan');

    console.log(`📊 Found ${users.length} user(s):\n`);
    console.log('═══════════════════════════════════════════════════');
    
    users.forEach((user, index) => {
      console.log(`\n${index + 1}. Email: ${user.email}`);
      console.log(`   Name: ${user.displayName || 'Not set'}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Status: ${user.subscriptionStatus}`);
      console.log(`   Plan: ${user.subscriptionPlan || 'None'}`);
      
      const isPro = user.role === 'pro_user' && 
                    user.subscriptionStatus === 'active' &&
                    ['Lite', 'Pro', 'Premium'].includes(user.subscriptionPlan);
      console.log(`   Pro Access: ${isPro ? '✅ YES' : '❌ NO'}`);
    });
    
    console.log('\n═══════════════════════════════════════════════════\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

// Run the script
listAllUsers();
