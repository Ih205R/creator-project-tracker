'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { LuCrown, LuCalendar, LuCheck } from 'react-icons/lu';

export default function ProfilePage() {
  const { userProfile, isPro } = useAuth();
  const [formData, setFormData] = useState({
    displayName: userProfile?.displayName || '',
    email: userProfile?.email || '',
    bio: '',
    website: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle profile update
  };

  const getPlanBadgeStyle = (plan) => {
    const styles = {
      'Starter': 'from-blue-500 to-cyan-500',
      'Pro': 'from-indigo-500 to-purple-600',
      'Premium': 'from-purple-600 to-pink-600'
    };
    return styles[plan] || styles['Starter'];
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile</h1>

      {/* Subscription Status Card */}
      {isPro && userProfile?.subscriptionPlan && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={`bg-gradient-to-r ${getPlanBadgeStyle(userProfile.subscriptionPlan)} rounded-2xl shadow-xl p-6 text-white`}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <LuCrown className="w-6 h-6" />
                <h2 className="text-2xl font-bold">{userProfile.subscriptionPlan} Plan</h2>
              </div>
              <p className="text-white/90 mb-4">
                You have full access to all premium features
              </p>
              <div className="flex items-center gap-4 text-sm text-white/80">
                <div className="flex items-center gap-1">
                  <LuCheck className="w-4 h-4" />
                  <span>Active Subscription</span>
                </div>
                {userProfile.subscriptionPeriodEnd && (
                  <div className="flex items-center gap-1">
                    <LuCalendar className="w-4 h-4" />
                    <span>Renews: {formatDate(userProfile.subscriptionPeriodEnd)}</span>
                  </div>
                )}
              </div>
            </div>
            <Link
              href="/dashboard/settings"
              className="px-6 py-3 bg-white/20 hover:bg-white/30 rounded-lg font-semibold backdrop-blur-sm transition-all"
            >
              Manage Subscription
            </Link>
          </div>
        </motion.div>
      )}

      {!isPro && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-2xl shadow-xl p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Free Plan
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Upgrade to unlock premium features and boost your productivity
              </p>
            </div>
            <Link
              href="/dashboard/upgrade"
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-semibold transition-all"
            >
              ✨ Upgrade Now
            </Link>
          </div>
        </motion.div>
      )}

      {/* Profile Information Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Display Name
            </label>
            <input
              type="text"
              value={formData.displayName}
              onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              disabled
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Bio
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Website
            </label>
            <input
              type="url"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700"
            />
          </div>

          <button
            type="submit"
            className="w-full px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-colors"
          >
            Save Changes
          </button>
        </form>
      </div>
    </motion.div>
  );
}
