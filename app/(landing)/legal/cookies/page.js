'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { LuSparkles, LuArrowLeft, LuCookie } from 'react-icons/lu';

export default function CookiesPage() {
  const cookieTypes = [
    {
      name: 'Essential Cookies',
      description: 'These cookies are necessary for the website to function and cannot be switched off. They are usually only set in response to actions made by you such as setting your privacy preferences, logging in, or filling in forms.',
      examples: 'Authentication tokens, session management, security cookies',
      retention: 'Session or up to 1 year',
      canDisable: false
    },
    {
      name: 'Performance Cookies',
      description: 'These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us know which pages are the most and least popular and see how visitors move around the site.',
      examples: 'Google Analytics, page load times, error tracking',
      retention: 'Up to 2 years',
      canDisable: true
    },
    {
      name: 'Functionality Cookies',
      description: 'These cookies enable the website to provide enhanced functionality and personalization. They may be set by us or by third-party providers whose services we have added to our pages.',
      examples: 'Language preferences, theme selection, user preferences',
      retention: 'Up to 1 year',
      canDisable: true
    },
    {
      name: 'Targeting Cookies',
      description: 'These cookies may be set through our site by our advertising partners. They may be used by those companies to build a profile of your interests and show you relevant adverts on other sites.',
      examples: 'Ad targeting, remarketing pixels, social media cookies',
      retention: 'Up to 1 year',
      canDisable: true
    }
  ];

  const thirdPartyCookies = [
    {
      service: 'Google Analytics',
      purpose: 'Website analytics and performance tracking',
      link: 'https://policies.google.com/privacy'
    },
    {
      service: 'Stripe',
      purpose: 'Payment processing and fraud prevention',
      link: 'https://stripe.com/privacy'
    },
    {
      service: 'Firebase',
      purpose: 'Authentication and backend services',
      link: 'https://firebase.google.com/support/privacy'
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
          <Link href="/">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-purple-600 transition-colors"
            >
              <LuArrowLeft className="w-4 h-4" />
              Back to Home
            </motion.button>
          </Link>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-20">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg">
              <LuCookie className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold">
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Cookie Policy
              </span>
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Last Updated: November 24, 2024
          </p>
        </motion.div>

        {/* Introduction */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            What Are Cookies?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
            Cookies are small text files that are placed on your computer or mobile device when you visit a website. 
            They are widely used to make websites work more efficiently and provide information to website owners.
          </p>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            We use cookies and similar technologies to improve your experience on CreatorHub, provide personalized 
            content, analyze site traffic, and understand where our visitors are coming from.
          </p>
        </motion.div>

        {/* Cookie Types */}
        <div className="mb-12">
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-3xl font-bold text-gray-900 dark:text-white mb-6"
          >
            Types of Cookies We Use
          </motion.h2>
          <div className="space-y-6">
            {cookieTypes.map((cookie, index) => (
              <motion.div
                key={index}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {cookie.name}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    cookie.canDisable
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                      : 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
                  }`}>
                    {cookie.canDisable ? 'Optional' : 'Required'}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {cookie.description}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-semibold text-gray-900 dark:text-white">Examples:</span>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">{cookie.examples}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900 dark:text-white">Retention:</span>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">{cookie.retention}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Third-Party Cookies */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Third-Party Cookies
          </h2>
          <div className="space-y-4">
            {thirdPartyCookies.map((service, index) => (
              <motion.div
                key={index}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                      {service.service}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-3">
                      {service.purpose}
                    </p>
                    <a 
                      href={service.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-600 dark:text-purple-400 hover:underline text-sm"
                    >
                      View Privacy Policy →
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Managing Cookies */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Managing Your Cookie Preferences
          </h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
            You can control and manage cookies in various ways. Please note that removing or blocking cookies 
            can impact your user experience and parts of our website may no longer be fully accessible.
          </p>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-purple-600 dark:text-purple-400 text-sm font-bold">1</span>
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">Browser Settings</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Most browsers allow you to refuse cookies or delete them. The methods vary by browser and version.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-purple-600 dark:text-purple-400 text-sm font-bold">2</span>
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">Cookie Consent Tool</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Use our cookie consent banner to customize your preferences when you first visit our site.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-purple-600 dark:text-purple-400 text-sm font-bold">3</span>
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">Account Settings</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Manage your privacy preferences in your CreatorHub account settings.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Updates */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Changes to This Cookie Policy
          </h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            We may update this Cookie Policy from time to time to reflect changes in our practices or for other 
            operational, legal, or regulatory reasons. Please revisit this Cookie Policy regularly to stay 
            informed about our use of cookies.
          </p>
        </motion.div>

        {/* Contact */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-8 border border-purple-200 dark:border-purple-800"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Questions About Cookies?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            If you have any questions about our use of cookies, please contact us at:
          </p>
          <p className="text-purple-600 dark:text-purple-400 font-medium">
            privacy@creatorhub.com
          </p>
        </motion.div>

        {/* Legal Navigation */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-12 p-6 bg-gray-100 dark:bg-gray-800 rounded-xl"
        >
          <h3 className="font-bold text-gray-900 dark:text-white mb-4">
            More Legal Information
          </h3>
          <div className="flex flex-wrap gap-4">
            <Link href="/legal/terms" className="text-purple-600 dark:text-purple-400 hover:underline font-medium">
              Terms of Service
            </Link>
            <Link href="/legal/privacy" className="text-purple-600 dark:text-purple-400 hover:underline font-medium">
              Privacy Policy
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
