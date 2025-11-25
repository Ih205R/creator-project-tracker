'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { userAPI, projectsAPI } from '@/lib/api';

export default function APITestPage() {
  const { user, userProfile, loading } = useAuth();
  const [testResults, setTestResults] = useState([]);
  const [testing, setTesting] = useState(false);

  const addResult = (test, success, data) => {
    setTestResults(prev => [...prev, { test, success, data, time: new Date().toISOString() }]);
  };

  const runTests = async () => {
    setTesting(true);
    setTestResults([]);

    // Test 1: Check auth state
    addResult('Auth State', !!user, {
      hasUser: !!user,
      hasProfile: !!userProfile,
      email: user?.email,
      role: userProfile?.role
    });

    // Test 2: User Profile
    try {
      const response = await userAPI.getProfile();
      addResult('GET /api/user/profile', true, response.data);
    } catch (error) {
      addResult('GET /api/user/profile', false, {
        status: error.response?.status,
        message: error.message,
        data: error.response?.data
      });
    }

    // Test 3: User Stats
    try {
      const response = await userAPI.getStats();
      addResult('GET /api/user/stats', true, response.data);
    } catch (error) {
      addResult('GET /api/user/stats', false, {
        status: error.response?.status,
        message: error.message,
        data: error.response?.data
      });
    }

    // Test 4: Projects
    try {
      const response = await projectsAPI.getAll();
      addResult('GET /api/projects', true, response.data);
    } catch (error) {
      addResult('GET /api/projects', false, {
        status: error.response?.status,
        message: error.message,
        data: error.response?.data
      });
    }

    setTesting(false);
  };

  if (loading) {
    return <div className="p-8">Loading auth...</div>;
  }

  if (!user) {
    return <div className="p-8">Please log in to test API</div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">API Test Page</h1>
      
      <div className="bg-gray-100 p-4 rounded mb-6">
        <h2 className="text-xl font-semibold mb-2">Current User</h2>
        <pre className="text-sm overflow-auto">{JSON.stringify({
          email: user?.email,
          uid: user?.uid,
          profile: userProfile
        }, null, 2)}</pre>
      </div>

      <button
        onClick={runTests}
        disabled={testing}
        className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 disabled:opacity-50 mb-6"
      >
        {testing ? 'Testing...' : 'Run API Tests'}
      </button>

      {testResults.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Test Results</h2>
          {testResults.map((result, index) => (
            <div
              key={index}
              className={`p-4 rounded border-2 ${
                result.success ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{result.success ? '✅' : '❌'}</span>
                <h3 className="text-lg font-semibold">{result.test}</h3>
              </div>
              <pre className="text-xs overflow-auto bg-white p-2 rounded">
                {JSON.stringify(result.data, null, 2)}
              </pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
