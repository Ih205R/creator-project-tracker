'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { userAPI } from '@/lib/api';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileError, setProfileError] = useState(null);

  const fetchUserProfile = async (firebaseUser, retryCount = 0) => {
    try {
      console.log('🔄 Fetching user profile... (attempt', retryCount + 1, ')');
      const { data } = await userAPI.getProfile();
      setUserProfile(data.user);
      setProfileError(null);
      console.log('✅ User profile loaded:', {
        email: data.user?.email,
        role: data.user?.role,
        subscriptionStatus: data.user?.subscriptionStatus,
        subscriptionPlan: data.user?.subscriptionPlan
      });
      return data.user;
    } catch (error) {
      console.error('❌ Failed to fetch user profile:', error);
      setProfileError(error);
      
      // Retry up to 3 times with exponential backoff
      if (retryCount < 3) {
        const delay = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s
        console.log(`⏳ Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return fetchUserProfile(firebaseUser, retryCount + 1);
      }
      
      throw error;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        try {
          await fetchUserProfile(firebaseUser);
        } catch (error) {
          console.error('Failed to fetch user profile after retries:', error);
        }
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signUp = async (email, password, displayName) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  };

  const signIn = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  };

  const signInWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  const resetPassword = async (email) => {
    await sendPasswordResetEmail(auth, email);
  };

  const refreshProfile = async () => {
    try {
      console.log('🔄 Refreshing profile...');
      const { data } = await userAPI.getProfile();
      
      // Force a new object reference to trigger re-render
      const updatedProfile = { ...data.user };
      setUserProfile(updatedProfile);
      
      console.log('✅ Profile refreshed:', {
        role: updatedProfile?.role,
        subscriptionStatus: updatedProfile?.subscriptionStatus,
        subscriptionPlan: updatedProfile?.subscriptionPlan,
        subscriptionPeriodEnd: updatedProfile?.subscriptionPeriodEnd
      });
      
      return updatedProfile;
    } catch (error) {
      console.error('❌ Failed to refresh profile:', error);
      throw error;
    }
  };

  // User has Pro access if they have ANY active paid subscription (Starter, Pro, or Premium)
  // Check role is pro_user AND status is active AND plan is one of the paid plans
  const isPro = userProfile?.role === 'pro_user' && 
                userProfile?.subscriptionStatus === 'active' &&
                (userProfile?.subscriptionPlan === 'Starter' || 
                 userProfile?.subscriptionPlan === 'Pro' || 
                 userProfile?.subscriptionPlan === 'Premium');
  
  // Log isPro status for debugging
  useEffect(() => {
    if (userProfile) {
      console.log('🔍 isPro check:', {
        isPro,
        role: userProfile.role,
        status: userProfile.subscriptionStatus,
        plan: userProfile.subscriptionPlan
      });
    }
  }, [userProfile, isPro]);

  const value = {
    user,
    userProfile,
    loading,
    isPro,
    profileError,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    resetPassword,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
