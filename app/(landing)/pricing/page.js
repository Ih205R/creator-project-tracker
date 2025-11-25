'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  LuSparkles, 
  LuCheck,
  LuX,
  LuZap,
  LuArrowRight,
  LuCrown,
  LuStar
} from 'react-icons/lu';

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState('monthly');

  const plans = [
    {
      name: 'Starter',
      description: 'Perfect for beginners',
      monthlyPrice: 0,
      yearlyPrice: 0,
      color: 'from-blue-500 to-cyan-500',
      features: [
        { text: 'Basic AI Content Generation', included: true },
        { text: 'Up to 10 projects', included: true },
        { text: 'Basic Analytics', included: true },
        { text: 'Community Support', included: true },
        { text: 'Advanced AI Tools', included: false },
        { text: 'Deep Analytics', included: false },
        { text: 'Brand Deal Management', included: false },
        { text: 'Priority Support', included: false }
      ],
      cta: 'Get Started',
      popular: false
    },
    {
      name: 'Pro',
      description: 'For serious creators',
      monthlyPrice: 19,
      yearlyPrice: 190,
      color: 'from-purple-500 to-pink-500',
      features: [
        { text: 'Advanced AI Content Generation', included: true },
        { text: 'Unlimited Projects', included: true },
        { text: 'Deep Analytics & Insights', included: true },
        { text: 'Brand Deal Management', included: true },
        { text: 'Priority Email Support', included: true },
        { text: 'Calendar Integration', included: true },
        { text: 'Custom Branding', included: true },
        { text: 'API Access', included: false }
      ],
      cta: 'Start Pro Trial',
      popular: true
    },
    {
      name: 'Premium',
      description: 'For professional teams',
      monthlyPrice: 49,
      yearlyPrice: 490,
      color: 'from-orange-500 to-red-500',
      features: [
        { text: 'Everything in Pro', included: true },
        { text: 'Team Collaboration (5 seats)', included: true },
        { text: 'White-label Options', included: true },
        { text: 'API Access & Integrations', included: true },
        { text: 'Dedicated Account Manager', included: true },
        { text: 'Custom AI Training', included: true },
        { text: 'Advanced Security', included: true },
        { text: '24/7 Phone Support', included: true }
      ],
      cta: 'Contact Sales',
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-purple-900">
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <motion.div 
              whileHover={{ rotate: 180, scale: 1.1 }}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg"
            >
              <LuSparkles className="w-6 h-6 text-white" />
            </motion.div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              CreatorHub
            </span>
          </Link>
          <Link href="/login">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2.5 text-gray-600 dark:text-gray-300 hover:text-purple-600 transition-colors"
            >
              Log In
            </motion.button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Simple, Transparent Pricing
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Choose the perfect plan for your creative journey
          </p>

          {/* Billing Toggle */}
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center gap-4 p-2 bg-gray-200 dark:bg-gray-800 rounded-xl"
          >
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                billingPeriod === 'monthly'
                  ? 'bg-white dark:bg-gray-700 shadow-lg text-purple-600'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              className={`px-6 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                billingPeriod === 'yearly'
                  ? 'bg-white dark:bg-gray-700 shadow-lg text-purple-600'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              Yearly
              <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs rounded-full">
                Save 20%
              </span>
            </button>
          </motion.div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className={`relative p-8 rounded-3xl shadow-2xl border-2 ${
                plan.popular
                  ? 'border-purple-500 bg-white dark:bg-gray-800'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring" }}
                  className="absolute -top-4 left-1/2 transform -translate-x-1/2"
                >
                  <div className={`px-6 py-2 bg-gradient-to-r ${plan.color} text-white rounded-full font-bold text-sm shadow-lg flex items-center gap-2`}>
                    <LuStar className="w-4 h-4" />
                    Most Popular
                  </div>
                </motion.div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-6">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${plan.color} mb-4 shadow-lg`}>
                  {index === 0 && <LuZap className="w-8 h-8 text-white" />}
                  {index === 1 && <LuCrown className="w-8 h-8 text-white" />}
                  {index === 2 && <LuStar className="w-8 h-8 text-white" />}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {plan.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {plan.description}
                </p>
                <div className="flex items-end justify-center gap-2">
                  <span className="text-5xl font-bold text-gray-900 dark:text-white">
                    ${billingPeriod === 'monthly' ? plan.monthlyPrice : Math.floor(plan.yearlyPrice / 12)}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400 mb-2">
                    /month
                  </span>
                </div>
                {billingPeriod === 'yearly' && plan.yearlyPrice > 0 && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Billed ${plan.yearlyPrice} annually
                  </p>
                )}
              </div>

              {/* Features List */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 + idx * 0.05 }}
                    className="flex items-start gap-3"
                  >
                    {feature.included ? (
                      <LuCheck className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    ) : (
                      <LuX className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    )}
                    <span className={`text-sm ${
                      feature.included
                        ? 'text-gray-700 dark:text-gray-300'
                        : 'text-gray-400 dark:text-gray-600'
                    }`}>
                      {feature.text}
                    </span>
                  </motion.li>
                ))}
              </ul>

              {/* CTA Button */}
              <Link href="/signup">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-full py-4 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2 ${
                    plan.popular
                      ? `bg-gradient-to-r ${plan.color} shadow-xl`
                      : 'bg-gray-800 dark:bg-gray-700'
                  }`}
                >
                  {plan.cta}
                  <LuArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-3xl font-bold text-center mb-8">
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Frequently Asked Questions
            </span>
          </h2>
          <div className="space-y-4">
            {[
              {
                q: 'Can I change plans later?',
                a: 'Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.'
              },
              {
                q: 'What payment methods do you accept?',
                a: 'We accept all major credit cards, PayPal, and bank transfers for annual plans.'
              },
              {
                q: 'Is there a free trial?',
                a: 'Yes! Pro and Premium plans come with a 14-day free trial. No credit card required.'
              },
              {
                q: 'Can I cancel anytime?',
                a: 'Absolutely! Cancel anytime with no penalties. Your subscription remains active until the end of your billing period.'
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ x: -20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg"
              >
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                  {faq.q}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {faq.a}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2 
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-white mb-6"
          >
            Still Have Questions?
          </motion.h2>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-white/90 mb-8"
          >
            Our team is here to help you choose the right plan
          </motion.p>
          <motion.button 
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-10 py-4 bg-white text-purple-600 rounded-xl font-bold text-lg shadow-2xl"
          >
            Contact Us
          </motion.button>
        </div>
      </section>
    </div>
  );
}
