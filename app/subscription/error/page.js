'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  LuCircleX, 
  LuTriangleAlert,
  LuArrowLeft,
  LuRefreshCw,
  LuMessageCircle,
  LuCreditCard
} from 'react-icons/lu';

function ErrorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const errorType = searchParams.get('type') || 'general';
  const message = searchParams.get('message');

  const errorDetails = {
    payment_failed: {
      icon: LuCreditCard,
      title: 'Payment Failed',
      description: 'We couldn\'t process your payment. Please check your payment details and try again.',
      color: 'red'
    },
    canceled: {
      icon: LuCircleX,
      title: 'Subscription Canceled',
      description: 'You\'ve canceled the subscription process. No charges were made.',
      color: 'orange'
    },
    session_expired: {
      icon: LuTriangleAlert,
      title: 'Session Expired',
      description: 'Your checkout session has expired. Please start the subscription process again.',
      color: 'yellow'
    },
    general: {
      icon: LuCircleX,
      title: 'Something Went Wrong',
      description: message || 'We encountered an error processing your subscription. Please try again.',
      color: 'red'
    }
  };

  const error = errorDetails[errorType] || errorDetails.general;
  const Icon = error.icon;

  const colorClasses = {
    red: {
      bg: 'from-red-600 to-pink-600',
      icon: 'bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400',
      text: 'text-red-600 dark:text-red-400'
    },
    orange: {
      bg: 'from-orange-600 to-red-600',
      icon: 'bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400',
      text: 'text-orange-600 dark:text-orange-400'
    },
    yellow: {
      bg: 'from-yellow-600 to-orange-600',
      icon: 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-600 dark:text-yellow-400',
      text: 'text-yellow-600 dark:text-yellow-400'
    }
  };

  const colors = colorClasses[error.color];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Error Header */}
          <div className={`bg-gradient-to-r ${colors.bg} p-8 text-center`}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="inline-block p-4 bg-white/20 rounded-full mb-4"
            >
              <Icon className="w-16 h-16 text-white" />
            </motion.div>
            <h1 className="text-4xl font-bold text-white mb-2">
              {error.title}
            </h1>
            <p className="text-white/90 text-lg">
              {error.description}
            </p>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="space-y-6">
              {/* What Happened */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  What Happened?
                </h2>
                <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                  {errorType === 'payment_failed' && (
                    <>
                      <li>• Your payment method was declined</li>
                      <li>• No charges were made to your account</li>
                      <li>• Your subscription was not activated</li>
                    </>
                  )}
                  {errorType === 'canceled' && (
                    <>
                      <li>• You canceled the checkout process</li>
                      <li>• No payment was attempted</li>
                      <li>• You can try again anytime</li>
                    </>
                  )}
                  {errorType === 'session_expired' && (
                    <>
                      <li>• The checkout session timed out</li>
                      <li>• No payment was processed</li>
                      <li>• Please start a new session</li>
                    </>
                  )}
                  {errorType === 'general' && (
                    <>
                      <li>• An unexpected error occurred</li>
                      <li>• No charges were made</li>
                      <li>• Please try again</li>
                    </>
                  )}
                </ul>
              </div>

              {/* Next Steps */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  What Can You Do?
                </h3>
                
                <div className="space-y-3">
                  {errorType === 'payment_failed' && (
                    <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className={`p-2 ${colors.icon} rounded-lg flex-shrink-0`}>
                        <LuCreditCard className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">Check Your Payment Method</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Verify your card details, billing address, and available funds
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg flex-shrink-0">
                      <LuRefreshCw className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">Try Again</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Return to the upgrade page and start the subscription process again
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex-shrink-0">
                      <LuMessageCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">Contact Support</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        If the problem persists, our support team is here to help
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  onClick={() => router.push('/dashboard/upgrade')}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                >
                  <LuRefreshCw className="w-5 h-5" />
                  Try Again
                </button>
                <button
                  onClick={() => router.push('/dashboard')}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
                >
                  <LuArrowLeft className="w-5 h-5" />
                  Back to Dashboard
                </button>
              </div>

              {/* Common Issues */}
              {errorType === 'payment_failed' && (
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <details className="group">
                    <summary className="flex items-center justify-between cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                      <span>Common Payment Issues</span>
                      <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                    </summary>
                    <div className="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-400 pl-4">
                      <p>• <strong>Insufficient funds:</strong> Ensure your account has enough balance</p>
                      <p>• <strong>Incorrect details:</strong> Double-check card number, expiry, and CVV</p>
                      <p>• <strong>Billing address:</strong> Verify your billing address matches your card</p>
                      <p>• <strong>Card restrictions:</strong> Some cards block international or online transactions</p>
                      <p>• <strong>Daily limits:</strong> You may have reached your card's daily spending limit</p>
                    </div>
                  </details>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Support */}
        <div className="mt-6 text-center space-y-2">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Need help? Contact us at{' '}
            <a href="mailto:support@creatortracker.com" className="text-indigo-600 dark:text-indigo-400 hover:underline">
              support@creatortracker.com
            </a>
          </p>
          <p className="text-gray-500 dark:text-gray-500 text-xs">
            Error Code: {errorType.toUpperCase()}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SubscriptionErrorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600"></div>
      </div>
    }>
      <ErrorContent />
    </Suspense>
  );
}
