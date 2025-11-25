#!/usr/bin/env node
require('dotenv').config();
const axios = require('axios');
const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin
const serviceAccount = {
  type: "service_account",
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
};

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const TEST_EMAIL = 'test4@gmail.com';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

async function debugAPI() {
  console.log('\n🔍 API DEBUGGING SCRIPT');
  console.log('='.repeat(50));
  
  // Step 1: Check backend health
  console.log('\n1️⃣ Checking backend health...');
  try {
    const health = await axios.get(`${API_BASE_URL}/health`);
    console.log('✅ Backend is healthy:', health.data);
  } catch (error) {
    console.error('❌ Backend health check failed:', error.message);
    return;
  }
  
  // Step 2: Get Firebase user and token
  console.log('\n2️⃣ Getting Firebase user and token...');
  let token;
  try {
    const userRecord = await admin.auth().getUserByEmail(TEST_EMAIL);
    token = await admin.auth().createCustomToken(userRecord.uid);
    console.log('✅ Got custom token for user:', userRecord.uid);
    
    // Exchange custom token for ID token (simulating real auth flow)
    const FIREBASE_API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    const tokenExchange = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${FIREBASE_API_KEY}`,
      { token, returnSecureToken: true }
    );
    token = tokenExchange.data.idToken;
    console.log('✅ Exchanged for ID token');
  } catch (error) {
    console.error('❌ Failed to get token:', error.message);
    return;
  }
  
  // Step 3: Test API endpoints
  console.log('\n3️⃣ Testing API endpoints...');
  const api = axios.create({
    baseURL: `${API_BASE_URL}/api`,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  // Test user profile
  console.log('\n📡 GET /api/user/profile');
  try {
    const profile = await api.get('/user/profile');
    console.log('✅ Profile:', {
      email: profile.data.user.email,
      role: profile.data.user.role,
      subscriptionStatus: profile.data.user.subscriptionStatus,
      subscriptionPlan: profile.data.user.subscriptionPlan
    });
  } catch (error) {
    console.error('❌ Failed:', error.response?.status, error.response?.data || error.message);
  }
  
  // Test user stats
  console.log('\n📡 GET /api/user/stats');
  try {
    const stats = await api.get('/user/stats');
    console.log('✅ Stats:', stats.data.stats);
  } catch (error) {
    console.error('❌ Failed:', error.response?.status, error.response?.data || error.message);
  }
  
  // Test projects
  console.log('\n📡 GET /api/projects');
  try {
    const projects = await api.get('/projects');
    console.log('✅ Projects:', projects.data.projects.length, 'projects');
  } catch (error) {
    console.error('❌ Failed:', error.response?.status, error.response?.data || error.message);
  }
  
  // Step 4: Test full URL (as frontend would call it)
  console.log('\n4️⃣ Testing full URLs (as frontend calls them)...');
  
  const frontendAPI = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  console.log('\n📡 GET', `${API_BASE_URL}/api/user/profile`);
  try {
    const profile = await frontendAPI.get('/api/user/profile');
    console.log('✅ Full URL works!');
  } catch (error) {
    console.error('❌ Full URL failed:', error.response?.status, error.response?.data || error.message);
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('✅ Debug complete!\n');
}

debugAPI().catch(console.error);
