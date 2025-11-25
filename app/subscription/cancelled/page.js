'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { LuX, LuArrowLeft, LuHeart, LuZap, LuTrendingUp } from 'react-icons/lu';
import Link from 'next/link';

export default function SubscriptionCancelledPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full"
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="flex justify-center mb-8"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 rounded-full blur-xl opacity-50"></div>
            <div className="relative bg-white dark:bg-gray-800 p-6 rounded-full shadow-2xl border-4 border-gray-100 dark:border-gray-700">
              <LuX className="w-16 h-16 text-gray-600 dark:text-gray-400" />
            </div>
          </div>
        </motion.div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 md:p-12 border border-gray-200 dark:border-gray-700"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Subscription Cancelled
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
              No worries! You can always upgrade later.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              You'll continue to have access to all free features.
            </p>
          </div>

          {/* What You're Missing */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 mb-8 border border-blue-200 dark:border-blue-800">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <LuHeart className="w-5 h-5 text-red-500" />
              What You're Missing Out On
            </h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <LuZap className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">AI-Powered Insights</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Get advanced analytics and predictions to grow your channel faster</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <LuTrendingUp className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Deep Analytics</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Access comprehensive data on your channel's performance</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <LuZap className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Premium Features</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Unlimited projects, brand deals tracking, and priority support</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Link
              href="/subscription"
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
            >
              <LuZap className="w-5 h-5" />
              View Subscription Plans
            </Link>

            <Link
              href="/dashboard"
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
            >
              <LuArrowLeft className="w-5 h-5" />
              Back to Dashboard
            </Link>

            <button
              onClick={() => router.back()}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Go Back
            </button>
          </div>

          {/* Help Section */}
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Have questions or need help?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/support"
                className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
              >
                Contact Support
              </Link>
              <span className="hidden sm:inline text-gray-400">•</span>
              <Link
                href="/faq"
                className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
              >
                View FAQ
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Footer Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-8"
        >
          <p className="text-sm text-gray-500 dark:text-gray-400">
            We're here whenever you're ready to upgrade! 🚀
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
