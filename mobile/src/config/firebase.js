import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

// Firebase configuration
const firebaseConfig = {
  apiKey: Constants.expoConfig?.extra?.firebaseApiKey || "your-api-key",
  authDomain: "app1-33f1b.firebaseapp.com",
  projectId: "app1-33f1b",
  storageBucket: "app1-33f1b.appspot.com",
  messagingSenderId: Constants.expoConfig?.extra?.firebaseMessagingSenderId || "123456789",
  appId: Constants.expoConfig?.extra?.firebaseAppId || "1:123456789:web:abc123",
  measurementId: Constants.expoConfig?.extra?.firebaseMeasurementId || "G-ABCD123"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with AsyncStorage persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export { app, auth };
