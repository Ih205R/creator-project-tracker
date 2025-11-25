'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  LuCrown, 
  LuTriangleAlert, 
  LuCheck, 
  LuX, 
  LuCreditCard, 
  LuCalendar,
  LuRefreshCw
} from 'react-icons/lu';

export default function SettingsPage() {
  const { user, userProfile, isPro, logout } = useAuth();
  const router = useRouter();
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);

  useEffect(() => {
    if (isPro) {
      loadSubscriptionData();
    }
  }, [isPro]);

  const loadSubscriptionData = async () => {
    try {
      const token = await user.getIdToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/stripe/subscription-status`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setSubscriptionData(data.subscription);
      }
    } catch (error) {
      console.error('Failed to load subscription:', error);
    }
  };

  const handleManageSubscription = async () => {
    setLoading(true);
    try {
      const token = await user.getIdToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/stripe/create-portal-session`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          returnUrl: `${window.location.origin}/dashboard/settings`,
        }),
      });

      if (response.ok) {
        const { url } = await response.json();
        window.location.href = url;
      } else {
        alert('Failed to open billing portal. Please try again.');
      }
    } catch (error) {
      console.error('Failed to create portal session:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    setLoading(true);
    try {
      const token = await user.getIdToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/stripe/cancel-subscription`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        alert('Subscription cancelled successfully. You will have access until the end of your billing period.');
        setShowCancelModal(false);
        loadSubscriptionData();
      } else {
        alert('Failed to cancel subscription. Please try again or contact support.');
      }
    } catch (error) {
      console.error('Failed to cancel subscription:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestRefund = async () => {
    setLoading(true);
    try {
      const token = await user.getIdToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/stripe/request-refund`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        alert('Refund request submitted successfully. Our team will review it within 24 hours.');
        setShowRefundModal(false);
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to request refund. Please contact support.');
      }
    } catch (error) {
      console.error('Failed to request refund:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getPlanBadge = () => {
    if (!userProfile?.subscriptionPlan) return null;
    
    const badges = {
      starter: { color: 'bg-blue-500', icon: '🚀' },
      pro: { color: 'bg-purple-500', icon: '⭐' },
      premium: { color: 'bg-orange-500', icon: '👑' },
    };

    const badge = badges[userProfile.subscriptionPlan.toLowerCase()] || badges.starter;
    
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-white text-sm font-semibold ${badge.color}`}>
        {badge.icon} {userProfile.subscriptionPlan}
      </span>
    );
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-4xl mx-auto space-y-6"
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>

        {/* Account Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Account</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Name</p>
              <p className="font-medium text-gray-900 dark:text-white">{userProfile?.displayName || 'Not set'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
              <p className="font-medium text-gray-900 dark:text-white">{userProfile?.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Plan</p>
              <div className="mt-1">
                {isPro ? getPlanBadge() : (
                  <span className="text-gray-600 dark:text-gray-400">Free Plan</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Subscription Section */}
        {isPro ? (
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-800 rounded-lg shadow-lg p-8 border-2 border-indigo-200 dark:border-indigo-900">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <LuCrown className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Subscription</h2>
              </div>
              {getPlanBadge()}
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Status</p>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="font-semibold text-green-600 dark:text-green-400">Active</span>
                  </div>
                </div>
                
                {subscriptionData?.periodEnd && (
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Next Billing Date</p>
                    <div className="flex items-center gap-2">
                      <LuCalendar className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      <span className="font-medium text-gray-900 dark:text-white">
                        {new Date(subscriptionData.periodEnd).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Manage your subscription, update payment methods, or view billing history.
                </p>
                
                <div className="flex flex-wrap gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleManageSubscription}
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <LuCreditCard className="w-5 h-5" />
                    {loading ? 'Loading...' : 'Manage Billing'}
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowRefundModal(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                  >
                    <LuRefreshCw className="w-5 h-5" />
                    Request Refund
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowCancelModal(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
                  >
                    <LuX className="w-5 h-5" />
                    Cancel Subscription
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-800 rounded-lg shadow-lg p-8 border-2 border-purple-200 dark:border-purple-900">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Upgrade Your Plan</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Unlock premium features with a Pro subscription. Get AI-powered tools, unlimited projects, and priority support.
            </p>
            <Link
              href="/dashboard/upgrade"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-semibold transition-all shadow-lg"
            >
              <LuCrown className="w-5 h-5" />
              Upgrade Now
            </Link>
          </div>
        )}

        {/* Notifications */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Notifications</h2>
          <div className="space-y-4">
            <label className="flex items-center justify-between">
              <span className="text-gray-900 dark:text-white">Email Notifications</span>
              <input type="checkbox" className="w-5 h-5 text-indigo-600 rounded" defaultChecked />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-gray-900 dark:text-white">Push Notifications</span>
              <input type="checkbox" className="w-5 h-5 text-indigo-600 rounded" defaultChecked />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-gray-900 dark:text-white">Project Reminders</span>
              <input type="checkbox" className="w-5 h-5 text-indigo-600 rounded" defaultChecked />
            </label>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border-2 border-red-200 dark:border-red-900">
          <h2 className="text-xl font-semibold text-red-600 mb-4">Danger Zone</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Once you logout, you'll need to sign in again to access your account.
          </p>
          <button
            onClick={logout}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
          >
            Logout
          </button>
        </div>
      </motion.div>

      {/* Cancel Subscription Modal */}
      <AnimatePresence>
        {showCancelModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowCancelModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-8"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                  <LuTriangleAlert className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Cancel Subscription?</h3>
              </div>
              
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Are you sure you want to cancel your subscription? You'll lose access to premium features at the end of your billing period.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-semibold transition-colors"
                >
                  Keep Subscription
                </button>
                <button
                  onClick={handleCancelSubscription}
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Cancelling...' : 'Yes, Cancel'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Refund Request Modal */}
      <AnimatePresence>
        {showRefundModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowRefundModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-8"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                  <LuRefreshCw className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Request Refund</h3>
              </div>
              
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                We offer a 14-day money-back guarantee. Your refund request will be reviewed by our team within 24 hours.
              </p>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  <strong>Note:</strong> Refunds are available for subscriptions purchased within the last 14 days. Your subscription will be cancelled upon approval.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowRefundModal(false)}
                  className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRequestRefund}
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
