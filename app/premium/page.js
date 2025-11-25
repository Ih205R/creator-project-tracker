'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  LuUsers, LuBrain, LuPalette,
  LuCrown, LuArrowRight, LuCheck
} from 'react-icons/lu';

const PREMIUM_FEATURES = [
  {
    id: 'team',
    title: 'Team Collaboration',
    description: 'Invite up to 5 team members to collaborate on projects',
    icon: LuUsers,
    color: 'from-blue-500 to-cyan-500',
    link: '/team',
    features: [
      'Add up to 5 team members',
      'Role-based permissions',
      'Real-time collaboration',
      'Activity tracking'
    ]
  },
  {
    id: 'ai-advanced',
    title: 'Advanced AI Content Tools',
    description: 'Powerful AI tools for content creation and optimization',
    icon: LuBrain,
    color: 'from-purple-500 to-pink-500',
    link: '/ai-advanced',
    features: [
      'AI video script generator',
      'Content optimization',
      'Trend analysis',
      'SEO recommendations'
    ]
  },
  {
    id: 'white-label',
    title: 'White-Label Options',
    description: 'Brand the platform with your own identity',
    icon: LuPalette,
    color: 'from-indigo-500 to-blue-500',
    link: '/white-label',
    features: [
      'Custom branding',
      'Custom domain',
      'Branded reports',
      'Logo customization'
    ]
  }
];

export default function PremiumFeaturesPage() {
  const { userProfile, isPro } = useAuth();
  const router = useRouter();

  const isPremium = userProfile?.subscriptionPlan === 'Premium';

  if (!isPremium) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 text-center"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <LuCrown className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Premium Features
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Upgrade to Premium to unlock advanced features and take your content creation to the next level.
          </p>
          <Link
            href="/dashboard?upgrade=premium"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all"
          >
            Upgrade to Premium
            <LuArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-full mb-6"
          >
            <LuCrown className="w-5 h-5" />
            <span className="font-semibold">Premium Features</span>
          </motion.div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Unlock the Full Potential
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Access exclusive premium features designed for professional content creators
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PREMIUM_FEATURES.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={feature.link}>
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all cursor-pointer group h-full flex flex-col">
                    <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {feature.title}
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-400 mb-4 flex-grow">
                      {feature.description}
                    </p>

                    <ul className="space-y-2 mb-4">
                      {feature.features.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <LuCheck className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-medium group-hover:gap-3 transition-all">
                      <span>Explore</span>
                      <LuArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Support Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl p-8 text-white text-center"
        >
          <h2 className="text-2xl font-bold mb-4">Ready to Elevate Your Content?</h2>
          <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
            Explore these powerful Premium features and take your content creation to the next level.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/team"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <LuUsers className="w-5 h-5" />
              Start Collaborating
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
