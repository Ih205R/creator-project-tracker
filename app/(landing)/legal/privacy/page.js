'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { LuSparkles, LuArrowLeft, LuShield } from 'react-icons/lu';

export default function PrivacyPage() {
  const sections = [
    {
      title: '1. Information We Collect',
      content: 'We collect information you provide directly to us, including: Account information (name, email, password), Profile information (bio, website, avatar), Content you create or upload, Payment information (processed securely through our payment provider), Communication preferences, Usage data and analytics.'
    },
    {
      title: '2. How We Use Your Information',
      content: 'We use the information we collect to: Provide, maintain, and improve our services; Process transactions and send related information; Send you technical notices, updates, security alerts, and support messages; Respond to your comments, questions, and customer service requests; Communicate with you about products, services, and events; Monitor and analyze trends, usage, and activities; Detect, investigate and prevent fraudulent transactions and other illegal activities; Personalize and improve the Service and provide content or features that match your interests.'
    },
    {
      title: '3. Information Sharing',
      content: 'We do not sell your personal information. We may share your information only in the following circumstances: With your consent; With service providers who perform services on our behalf; To comply with legal obligations; To protect and defend our rights and property; With your consent or at your direction; In connection with a merger, sale, or acquisition of all or a portion of our company.'
    },
    {
      title: '4. AI and Data Processing',
      content: 'When you use our AI tools, your input is processed to generate content. We may use anonymized and aggregated data to improve our AI models. Your specific content and prompts are not shared with third parties or used to train models that would benefit other users without your explicit consent.'
    },
    {
      title: '5. Data Security',
      content: 'We implement appropriate technical and organizational measures to protect your personal information against unauthorized or unlawful processing, accidental loss, destruction, or damage. We use encryption for data transmission and storage, regular security assessments, access controls and authentication, and secure backup systems.'
    },
    {
      title: '6. Data Retention',
      content: 'We retain your personal information for as long as necessary to provide you with our services and as described in this Privacy Policy. When you delete your account, we will delete or anonymize your personal information within 90 days, except where we are required to retain it for legal or regulatory purposes.'
    },
    {
      title: '7. Your Rights',
      content: 'Depending on your location, you may have the following rights: Access your personal information; Correct inaccurate data; Request deletion of your data; Object to or restrict processing; Data portability; Withdraw consent; Opt-out of marketing communications. To exercise these rights, please contact us at privacy@creatorhub.com.'
    },
    {
      title: '8. Cookies and Tracking',
      content: 'We use cookies and similar tracking technologies to track activity on our Service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Service. For more information, see our Cookie Policy.'
    },
    {
      title: '9. Third-Party Services',
      content: 'Our Service may contain links to third-party websites or services that are not owned or controlled by CreatorHub. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services. We encourage you to review the privacy policy of every site you visit.'
    },
    {
      title: '10. International Data Transfers',
      content: 'Your information may be transferred to and maintained on computers located outside of your state, province, country, or other governmental jurisdiction where the data protection laws may differ. We ensure appropriate safeguards are in place for such transfers.'
    },
    {
      title: '11. Children\'s Privacy',
      content: 'Our Service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us so we can delete it.'
    },
    {
      title: '12. California Privacy Rights',
      content: 'If you are a California resident, you have specific rights regarding your personal information under the California Consumer Privacy Act (CCPA). This includes the right to know what personal information we collect, the right to delete personal information, and the right to opt-out of the sale of personal information (note: we do not sell personal information).'
    },
    {
      title: '13. GDPR Compliance',
      content: 'If you are located in the European Economic Area (EEA), you have certain data protection rights under the General Data Protection Regulation (GDPR). We process your personal information based on: Your consent; Performance of a contract; Compliance with legal obligations; Our legitimate interests. You have the right to lodge a complaint with a supervisory authority.'
    },
    {
      title: '14. Changes to This Policy',
      content: 'We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this Privacy Policy periodically for any changes. Changes are effective when posted on this page.'
    },
    {
      title: '15. Contact Us',
      content: 'If you have any questions about this Privacy Policy, please contact us: Email: privacy@creatorhub.com, Address: CreatorHub Legal Department, or through our website contact form.'
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
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg">
              <LuShield className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold">
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Privacy Policy
              </span>
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Last Updated: November 24, 2024
          </p>
          <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
            <p className="text-green-800 dark:text-green-300">
              <strong>Your privacy matters.</strong> This policy explains how we collect, use, and protect your personal information.
            </p>
          </div>
        </motion.div>

        <div className="space-y-8">
          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {section.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {section.content}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Quick Links */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-800"
        >
          <h3 className="font-bold text-gray-900 dark:text-white mb-4">
            More Legal Information
          </h3>
          <div className="flex flex-wrap gap-4">
            <Link href="/legal/terms" className="text-purple-600 dark:text-purple-400 hover:underline font-medium">
              Terms of Service
            </Link>
            <Link href="/legal/cookies" className="text-purple-600 dark:text-purple-400 hover:underline font-medium">
              Cookie Policy
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
