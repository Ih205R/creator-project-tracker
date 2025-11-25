'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LuCheck, LuSparkles, LuRocket, LuStar, LuArrowLeft, LuZap } from 'react-icons/lu';

export default function UpgradePage() {
  const [billingCycle, setBillingCycle] = useState('monthly');
  const { user, isPro, userProfile } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const calculateSavings = (monthlyPrice) => {
    const annualTotal = monthlyPrice * 12;
    const annualPrice = monthlyPrice * 10;
    return (annualTotal - annualPrice).toFixed(2);
  };

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      description: 'Perfect for getting started with content creation',
      icon: LuRocket,
      iconColor: 'text-blue-600',
      bgGradient: 'from-blue-400 to-blue-600',
      monthly: {
        price: 0,
        priceId: null,
      },
      annual: {
        price: 0,
        priceId: null,
      },
      features: [
        'Up to 3 active projects',
        'Up to 3 brand deals',
        'Basic analytics dashboard',
        'Calendar integration',
        'Community support',
        'Mobile app access',
      ],
      popular: false,
      isFree: true,
    },
    {
      id: 'pro',
      name: 'Pro',
      description: 'Most popular choice for serious creators',
      icon: LuStar,
      iconColor: 'text-purple-600',
      bgGradient: 'from-purple-400 to-pink-600',
      monthly: {
        price: 11.99,
        priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY || 'prod_TR0vXJjp5EQO0V',
      },
      annual: {
        price: 114.99,
        priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_ANNUAL || 'prod_TR0xBhCJL8MF0f',
      },
      features: [
        'Unlimited projects',
        'Unlimited brand deals',
        'AI caption generator',
        'AI script writer',
        'Advanced analytics & insights',
        'Custom branding options',
        'Priority support (24h response)',
        'Export reports (PDF/CSV)',
        'Integration with social platforms',
      ],
      popular: true,
    },
    {
      id: 'premium',
      name: 'Premium',
      description: 'For professional creators and teams',
      icon: LuSparkles,
      iconColor: 'text-orange-600',
      bgGradient: 'from-orange-400 to-red-600',
      monthly: {
        price: 14.99,
        priceId: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_MONTHLY || 'prod_TR0vgZtaWwzMcE',
      },
      annual: {
        price: 142.99,
        priceId: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_ANNUAL || 'prod_TR169gfxV6gnk9',
      },
      features: [
        'Everything in Pro',
        'Team collaboration (up to 5 members)',
        'Advanced AI content tools',
        'Custom API access & integrations',
        'Dedicated account manager',
        'White-label options',
        '24/7 phone & chat support',
        'Custom training sessions',
        'Priority feature requests',
      ],
      popular: false,
    },
  ];

  const handleSubscribe = async (plan) => {
    if (!user) {
      router.push(`/login?redirect=/upgrade&plan=${plan.id}`);
      return;
    }

    setLoading(true);
    const priceId = billingCycle === 'monthly' ? plan.monthly.priceId : plan.annual.priceId;
    
    try {
      const token = await user.getIdToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/stripe/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          priceId,
          planName: plan.name,
          billingCycle,
          successUrl: `${window.location.origin}/dashboard?upgrade=success`,
          cancelUrl: `${window.location.origin}/upgrade?canceled=true`,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Subscription error:', error);
      alert('Failed to start subscription. Please try again or contact support.');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentPrice = (plan) => {
    return billingCycle === 'monthly' ? plan.monthly.price : plan.annual.price;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 font-semibold"
          >
            <LuArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="inline-block mb-4"
          >
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-full font-bold text-lg shadow-lg">
              <LuZap className="inline-block w-6 h-6 mr-2" />
              Upgrade Your Account
            </div>
          </motion.div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
            Unlock Premium Features
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-4 max-w-2xl mx-auto">
            Take your content creation to the next level with AI-powered tools, unlimited projects, and advanced analytics.
          </p>
          
          {user && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 px-6 py-3 rounded-lg shadow-md"
            >
              <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                {userProfile?.displayName?.[0] || user.email?.[0].toUpperCase()}
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {userProfile?.displayName || user.email}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {isPro ? '⭐ Pro Member' : 'Free Plan'}
                </p>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <div className="inline-flex items-center bg-white dark:bg-gray-800 rounded-full p-1.5 shadow-lg border border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                billingCycle === 'monthly'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                billingCycle === 'annual'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Annual
            </button>
          </div>
          
          <AnimatePresence mode="wait">
            {billingCycle === 'annual' && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                className="px-4 py-2 bg-gradient-to-r from-green-400 to-emerald-500 text-white text-sm font-bold rounded-full shadow-lg"
              >
                🎉 Save 2 months with annual
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            const currentPrice = getCurrentPrice(plan);
            const monthlySavings = billingCycle === 'annual' ? calculateSavings(plan.monthly.price) : 0;

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -10, transition: { duration: 0.2 } }}
                className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden ${
                  plan.popular ? 'ring-4 ring-indigo-600 scale-105' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-center py-2 text-sm font-bold">
                    ⭐ MOST POPULAR
                  </div>
                )}

                <div className={`${plan.popular ? 'pt-12' : 'pt-8'} pb-8 bg-gradient-to-r ${plan.bgGradient} flex flex-col items-center justify-center`}>
                  <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-lg mb-4">
                    <Icon className={`w-12 h-12 ${plan.iconColor} stroke-[1.5]`} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-white/90 text-sm px-4 text-center">{plan.description}</p>
                </div>

                <div className="p-8">
                  <div className="mb-6">
                    <div className="flex items-baseline justify-center gap-2 mb-2">
                      <span className="text-5xl font-bold text-gray-900 dark:text-white">
                        €{currentPrice}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400 text-lg">
                        /{billingCycle === 'monthly' ? 'mo' : 'yr'}
                      </span>
                    </div>
                    
                    {billingCycle === 'annual' && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center text-sm font-semibold text-green-600 dark:text-green-400"
                      >
                        💰 Save €{monthlySavings} per year!
                      </motion.p>
                    )}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => plan.isFree ? router.push('/dashboard') : handleSubscribe(plan)}
                    disabled={loading || plan.isFree}
                    className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-200 shadow-lg ${
                      plan.popular
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl'
                        : plan.isFree
                        ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                        : 'bg-gray-900 dark:bg-gray-700 text-white hover:bg-gray-800 dark:hover:bg-gray-600'
                    } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {loading ? 'Processing...' : plan.isFree ? 'Current Plan' : isPro ? 'Switch Plan' : 'Upgrade Now'}
                  </motion.button>

                  <ul className="mt-8 space-y-4">
                    {plan.features.map((feature, idx) => (
                      <motion.li
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 + idx * 0.05 }}
                        className="flex items-start gap-3"
                      >
                        <LuCheck className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5 stroke-2" />
                        <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-8 mb-8 flex-wrap">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <LuCheck className="w-5 h-5 text-green-500 stroke-2" />
              <span>14-day money-back guarantee</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <LuCheck className="w-5 h-5 text-green-500 stroke-2" />
              <span>Secure payment via Stripe</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <LuCheck className="w-5 h-5 text-green-500 stroke-2" />
              <span>Cancel anytime</span>
            </div>
          </div>

          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Questions about upgrading?
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 font-semibold text-lg hover:underline"
          >
            Contact our support team →
          </Link>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12 max-w-4xl mx-auto"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Frequently Asked Questions
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Can I cancel anytime?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Yes! Cancel anytime. You'll have access until your billing period ends.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                What payment methods?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                All major credit cards and digital wallets via Stripe.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Free trial available?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Yes! Free plan available forever with limited features.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Switch plans later?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Absolutely! Upgrade or downgrade anytime with prorated billing.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Is my data secure?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Yes! We use enterprise-grade encryption and comply with GDPR/CCPA standards.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Do you offer refunds?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Yes, we offer a 14-day money-back guarantee for all paid plans.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Can I use on multiple devices?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Absolutely! Access your account from any device with your login.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                What happens to my data if I cancel?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Your data is saved for 30 days after cancellation, then permanently deleted.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
