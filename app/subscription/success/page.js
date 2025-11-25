'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import confetti from 'canvas-confetti';
import { 
  LuCheck, 
  LuStar, 
  LuRocket,
  LuSparkles,
  LuArrowRight
} from 'react-icons/lu';

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, refreshProfile } = useAuth();
  const [sessionData, setSessionData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [autoRedirectCountdown, setAutoRedirectCountdown] = useState(null);
  const sessionId = searchParams.get('session_id');

  // Trigger confetti animation
  useEffect(() => {
    if (sessionId && user) {
      const duration = 3000;
      const end = Date.now() + duration;
      const colors = ['#4F46E5', '#7C3AED', '#EC4899'];

      (function frame() {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      }());
    }
  }, [sessionId, user]);

  // Fetch session data and refresh user profile
  useEffect(() => {
    if (!sessionId) {
      router.push('/dashboard');
      return;
    }

    if (!user) return;

    const fetchSessionData = async () => {
      try {
        setDataLoading(true);
        const token = await user.getIdToken();
        
        console.log('🔄 Fetching session data for:', sessionId);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // Reduced timeout

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/stripe/session/${sessionId}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            },
            signal: controller.signal
          }
        );

        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          setSessionData(data);
          console.log('✅ Session data received:', {
            planName: data.planName,
            status: data.status,
            userRole: data.user?.role,
            userPlan: data.user?.subscriptionPlan
          });
          
          // The session endpoint already updated the user, so just refresh once
          console.log('🔄 Refreshing user profile...');
          await refreshProfile();
          
          console.log('✅ Profile refresh complete');
          
          // Start auto-redirect countdown after data loads
          console.log('⏲️ Starting 10-second auto-redirect countdown...');
          setAutoRedirectCountdown(10);
        } else {
          console.warn('⚠️ Could not fetch session data, showing generic success');
          // Still try to refresh profile
          await refreshProfile();
          // Start countdown even if data fetch failed
          setAutoRedirectCountdown(10);
        }
      } catch (error) {
        if (error.name === 'AbortError') {
          console.log('⏱️ Session data fetch timed out, showing generic success');
        } else {
          console.error('❌ Error fetching session data:', error);
        }
        // Try to refresh profile even if session fetch fails
        try {
          await refreshProfile();
          // Start countdown even on error
          setAutoRedirectCountdown(10);
        } catch (refreshError) {
          console.error('❌ Error refreshing profile:', refreshError);
          // Start countdown anyway
          setAutoRedirectCountdown(10);
        }
      } finally {
        setDataLoading(false);
      }
    };

    fetchSessionData();
  }, [sessionId, user, router, refreshProfile]);

  // Auto-redirect countdown
  useEffect(() => {
    if (autoRedirectCountdown === null) return;
    
    if (autoRedirectCountdown === 0) {
      console.log('⏰ Auto-redirect time reached, navigating to dashboard...');
      // Add a query parameter to help dashboard know this is a fresh subscription
      window.location.href = '/dashboard?subscriptionUpdated=true';
      return;
    }

    const timer = setTimeout(() => {
      setAutoRedirectCountdown(autoRedirectCountdown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [autoRedirectCountdown]);

  const planFeatures = {
    starter: [
      '3 Active Projects',
      '3 Brand Deals',
      'Basic Analytics',
      'Calendar Integration',
      'Community Support'
    ],
    pro: [
      'Unlimited Projects',
      'Unlimited Brand Deals',
      'AI Caption Generator',
      'AI Script Writer',
      'Advanced Analytics',
      'Priority Support',
      'Custom Branding',
      'Social Integrations'
    ],
    premium: [
      'Everything in Pro',
      'Team Collaboration (5 members)',
      'Advanced AI Content Tools',
      'Custom API Access',
      'Dedicated Account Manager',
      'White-label Options',
      '24/7 Priority Support'
    ]
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto"></div>
          <p className="text-gray-600 dark:text-gray-400 mt-4">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden animate-fadeIn">
          {/* Success Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-center">
            <div className="inline-block p-4 bg-white/20 rounded-full mb-4 animate-scaleIn">
              <LuCheck className="w-16 h-16 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">
              🎉 Welcome to Premium!
            </h1>
            <p className="text-indigo-100 text-lg">
              Your subscription is now active
            </p>
          </div>

          {/* Subscription Details */}
          <div className="p-8">
            {dataLoading && !sessionData ? (
              // Loading skeleton
              <div className="space-y-6 animate-pulse">
                <div className="bg-gray-200 dark:bg-gray-700 h-48 rounded-xl"></div>
                <div className="space-y-3">
                  <div className="bg-gray-200 dark:bg-gray-700 h-24 rounded-lg"></div>
                  <div className="bg-gray-200 dark:bg-gray-700 h-24 rounded-lg"></div>
                </div>
              </div>
            ) : sessionData ? (
              // Show actual data
              <div className="space-y-6">
                {/* Plan Info */}
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white capitalize">
                        {sessionData.planName} Plan
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400">
                        {sessionData.billingCycle === 'annual' ? 'Billed Annually' : 'Billed Monthly'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                        €{(sessionData.amount / 100).toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        /{sessionData.billingCycle === 'annual' ? 'year' : 'month'}
                      </p>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {planFeatures[sessionData.planName.toLowerCase()]?.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 animate-slideIn"
                        style={{ animationDelay: `${0.3 + index * 0.1}s` }}
                      >
                        <LuCheck className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Next Steps */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <LuSparkles className="w-6 h-6 text-indigo-600" />
                    What's Next?
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg">
                        <LuRocket className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">Explore Your Dashboard</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Access all premium features and start creating amazing content
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                        <LuStar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">Manage Your Subscription</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          View your billing details and manage your subscription in Settings
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    onClick={async () => {
                      try {
                        setLoading(true);
                        setAutoRedirectCountdown(null); // Cancel auto-redirect
                        console.log('🔄 Final profile refresh before dashboard navigation...');
                        // Quick refresh before navigation - no delay needed since data is already loaded
                        await refreshProfile();
                        console.log('✅ Profile refreshed, navigating to dashboard...');
                        // Use window.location for hard navigation to ensure fresh state
                        // Add query param to help dashboard identify fresh subscription
                        window.location.href = '/dashboard?subscriptionUpdated=true';
                      } catch (error) {
                        console.error('❌ Error during navigation:', error);
                        // Navigate anyway even if refresh fails
                        window.location.href = '/dashboard?subscriptionUpdated=true';
                      }
                    }}
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Redirecting...' : (
                      autoRedirectCountdown !== null 
                        ? `Go to Dashboard (${autoRedirectCountdown}s)` 
                        : 'Go to Dashboard'
                    )}
                    {!loading && <LuArrowRight className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={async () => {
                      try {
                        setLoading(true);
                        setAutoRedirectCountdown(null); // Cancel auto-redirect
                        await refreshProfile();
                        window.location.href = '/dashboard/settings';
                      } catch (error) {
                        console.error('❌ Error during navigation:', error);
                        window.location.href = '/dashboard/settings';
                      }
                    }}
                    disabled={loading}
                    className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    View Settings
                  </button>
                </div>

                {/* Auto-redirect notice */}
                {autoRedirectCountdown !== null && autoRedirectCountdown > 0 && !loading && (
                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Automatically redirecting to dashboard in <span className="font-semibold text-indigo-600 dark:text-indigo-400">{autoRedirectCountdown}</span> seconds...
                    </p>
                  </div>
                )}

                {/* Receipt Info */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                    📧 A receipt has been sent to your email address
                  </p>
                </div>
              </div>
            ) : (
              // Fallback if data fetch fails
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-6 text-center">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Subscription Active!
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Your premium features are now available
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    onClick={async () => {
                      try {
                        setLoading(true);
                        setAutoRedirectCountdown(null); // Cancel auto-redirect
                        console.log('🔄 Final profile refresh before dashboard navigation...');
                        await refreshProfile();
                        console.log('✅ Profile refreshed, navigating to dashboard...');
                        window.location.href = '/dashboard?subscriptionUpdated=true';
                      } catch (error) {
                        console.error('❌ Error during navigation:', error);
                        window.location.href = '/dashboard?subscriptionUpdated=true';
                      }
                    }}
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Redirecting...' : (
                      autoRedirectCountdown !== null 
                        ? `Go to Dashboard (${autoRedirectCountdown}s)` 
                        : 'Go to Dashboard'
                    )}
                    {!loading && <LuArrowRight className="w-5 h-5" />}
                  </button>
                </div>

                {/* Auto-redirect notice */}
                {autoRedirectCountdown !== null && autoRedirectCountdown > 0 && !loading && (
                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Automatically redirecting to dashboard in <span className="font-semibold text-indigo-600 dark:text-indigo-400">{autoRedirectCountdown}</span> seconds...
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Support */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Need help? Contact us at{' '}
            <a href="mailto:support@creatortracker.com" className="text-indigo-600 dark:text-indigo-400 hover:underline">
              support@creatortracker.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SubscriptionSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600"></div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
