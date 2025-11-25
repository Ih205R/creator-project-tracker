'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { userAPI } from '@/lib/api';

export default function DebugPage() {
  const { user, userProfile, isPro, refreshProfile } = useAuth();
  const [rawApiResponse, setRawApiResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchDirectly = async () => {
    setLoading(true);
    try {
      const response = await userAPI.getProfile();
      setRawApiResponse(response.data);
      console.log('🔍 Direct API call response:', response.data);
    } catch (error) {
      console.error('❌ Direct API call failed:', error);
      setRawApiResponse({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      await refreshProfile();
      await fetchDirectly();
    } catch (error) {
      console.error('❌ Refresh failed:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchDirectly();
    }
  }, [user]);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            🐛 Debug Dashboard
          </h1>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? '⏳ Refreshing...' : '🔄 Refresh Data'}
          </button>
        </div>

        {/* Firebase User */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
            🔥 Firebase User (from AuthContext)
          </h2>
          <div className="bg-gray-50 dark:bg-gray-900 rounded p-4 overflow-x-auto">
            <pre className="text-sm text-gray-700 dark:text-gray-300">
              {JSON.stringify(
                {
                  uid: user?.uid,
                  email: user?.email,
                  emailVerified: user?.emailVerified,
                  displayName: user?.displayName,
                },
                null,
                2
              )}
            </pre>
          </div>
        </div>

        {/* User Profile from Context */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
            👤 User Profile (from AuthContext.userProfile)
          </h2>
          <div className="bg-gray-50 dark:bg-gray-900 rounded p-4 overflow-x-auto">
            <pre className="text-sm text-gray-700 dark:text-gray-300">
              {JSON.stringify(userProfile, null, 2)}
            </pre>
          </div>
        </div>

        {/* isPro Status */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
            ⭐ isPro Status
          </h2>
          <div className="bg-gray-50 dark:bg-gray-900 rounded p-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold">isPro:</span>
                <span className={`px-3 py-1 rounded-full text-white font-bold ${isPro ? 'bg-green-600' : 'bg-red-600'}`}>
                  {isPro ? '✅ TRUE' : '❌ FALSE'}
                </span>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-4">
                <p className="mb-2">Calculation breakdown:</p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>role === 'pro_user': <span className={userProfile?.role === 'pro_user' ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>{userProfile?.role === 'pro_user' ? '✅ TRUE' : '❌ FALSE'}</span> (actual: {userProfile?.role})</li>
                  <li>subscriptionStatus === 'active': <span className={userProfile?.subscriptionStatus === 'active' ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>{userProfile?.subscriptionStatus === 'active' ? '✅ TRUE' : '❌ FALSE'}</span> (actual: {userProfile?.subscriptionStatus})</li>
                  <li>subscriptionPlan in ['Lite', 'Pro', 'Premium']: <span className={['Lite', 'Pro', 'Premium'].includes(userProfile?.subscriptionPlan) ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>{['Lite', 'Pro', 'Premium'].includes(userProfile?.subscriptionPlan) ? '✅ TRUE' : '❌ FALSE'}</span> (actual: {userProfile?.subscriptionPlan})</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Raw API Response */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
            📡 Raw API Response (Direct /api/user/profile call)
          </h2>
          <div className="bg-gray-50 dark:bg-gray-900 rounded p-4 overflow-x-auto">
            <pre className="text-sm text-gray-700 dark:text-gray-300">
              {JSON.stringify(rawApiResponse, null, 2)}
            </pre>
          </div>
        </div>

        {/* Troubleshooting Tips */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded p-4">
          <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
            🛠️ Troubleshooting Tips
          </h3>
          <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1 list-disc list-inside">
            <li>If the API response shows correct data but the UI doesn't update, try: <strong>Cmd+Shift+R</strong> (Mac) or <strong>Ctrl+Shift+R</strong> (Windows)</li>
            <li>Check browser console (F12) for any error messages</li>
            <li>Verify the backend server is running on port 5000</li>
            <li>Try logging out and logging back in</li>
            <li>Clear browser cache and cookies for this site</li>
            <li>If using incognito mode, make sure you're logged into the correct account</li>
          </ul>
        </div>

        {/* Browser Info */}
        <div className="mt-6 text-xs text-gray-500 dark:text-gray-400">
          <p>Browser: {typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown'}</p>
          <p>Timestamp: {new Date().toISOString()}</p>
        </div>
      </div>
    </div>
  );
}
