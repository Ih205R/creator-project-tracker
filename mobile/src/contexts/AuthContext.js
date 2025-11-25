import React, { createContext, useState, useEffect, useContext } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { auth } from '../config/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        // Store user token
        const token = await user.getIdToken();
        await AsyncStorage.setItem('userToken', token);
        // Fetch user profile from backend
        await fetchUserProfile(token);
      } else {
        setUser(null);
        setUserProfile(null);
        await AsyncStorage.removeItem('userToken');
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const fetchUserProfile = async (token) => {
    try {
      const apiUrl = 'http://10.0.2.2:5000';
      const response = await fetch(`${apiUrl}/api/user/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUserProfile(data.user);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const signup = async (email, password, displayName) => {
    try {
      setError(null);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile with display name
      if (displayName) {
        await updateProfile(userCredential.user, {
          displayName: displayName
        });
      }

      // Register user in backend
      const token = await userCredential.user.getIdToken();
      await registerUserInBackend(token, {
        email,
        displayName,
        uid: userCredential.user.uid
      });

      return userCredential.user;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await signOut(auth);
      await AsyncStorage.removeItem('userToken');
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const registerUserInBackend = async (token, userData) => {
    try {
      // Use 10.0.2.2 for Android emulator to access host machine's localhost
      const apiUrl = 'http://10.0.2.2:5000';
      const response = await fetch(`${apiUrl}/api/user/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        console.warn('Failed to register user in backend');
      }
    } catch (error) {
      console.error('Error registering user in backend:', error);
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    error,
    signup,
    login,
    logout,
    isPro: userProfile?.subscriptionStatus === 'active' || userProfile?.subscriptionPlan === 'pro'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
