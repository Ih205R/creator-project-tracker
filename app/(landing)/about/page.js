'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  LuSparkles, 
  LuUsers, 
  LuHeart, 
  LuTarget,
  LuTrendingUp,
  LuShield,
  LuZap,
  LuArrowRight
} from 'react-icons/lu';

export default function AboutPage() {
  const values = [
    {
      icon: LuHeart,
      title: 'Creator-First',
      description: 'We build everything with creators in mind, ensuring every feature serves your success.',
      color: 'from-red-500 to-pink-500'
    },
    {
      icon: LuZap,
      title: 'Innovation',
      description: 'Constantly pushing boundaries with cutting-edge AI and technology.',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: LuUsers,
      title: 'Community',
      description: 'Building a supportive ecosystem where creators can thrive together.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: LuShield,
      title: 'Trust & Security',
      description: 'Your data and privacy are our top priorities, always.',
      color: 'from-green-500 to-emerald-500'
    }
  ];

  const team = [
    { name: 'Alex Rivera', role: 'CEO & Founder', avatar: '👨‍💼', bio: 'Former content creator turned tech entrepreneur' },
    { name: 'Sarah Kim', role: 'CTO', avatar: '👩‍💻', bio: 'AI specialist with 10+ years in ML' },
    { name: 'Marcus Chen', role: 'Head of Design', avatar: '👨‍🎨', bio: 'Award-winning product designer' },
    { name: 'Emily Johnson', role: 'Community Lead', avatar: '👩‍🦰', bio: 'Building creator communities for 5+ years' }
  ];

  const milestones = [
    { year: '2022', title: 'Founded', description: 'CreatorHub was born from a creator\'s frustration' },
    { year: '2023', title: '1K Users', description: 'Reached our first thousand creators' },
    { year: '2023', title: 'AI Launch', description: 'Launched AI-powered content tools' },
    { year: '2024', title: '10K Users', description: 'Growing community of 10,000+ creators' }
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
          <Link href="/signup">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold shadow-lg flex items-center gap-2"
            >
              Get Started
              <LuArrowRight className="w-4 h-4" />
            </motion.button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Our Story
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            CreatorHub was founded by creators, for creators. We understand your challenges 
            because we've lived them. Our mission is to empower every content creator with 
            the tools they need to succeed.
          </p>
        </motion.div>

        {/* Mission Statement */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-12 text-white text-center mb-20"
        >
          <LuTarget className="w-16 h-16 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            To democratize content creation by providing world-class tools that were once 
            only available to big media companies. Every creator deserves access to powerful 
            AI, analytics, and management tools.
          </p>
        </motion.div>
      </section>

      {/* Values Section */}
      <section className="bg-white dark:bg-gray-800/50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Our Values
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="p-8 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700"
                >
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${value.color} flex items-center justify-center mb-4 shadow-lg`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {value.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Our Journey
              </span>
            </h2>
          </motion.div>

          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <motion.div
                key={index}
                initial={{ x: index % 2 === 0 ? -50 : 50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-8"
              >
                <div className="flex-shrink-0 w-24 text-right">
                  <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {milestone.year}
                  </span>
                </div>
                <div className="flex-shrink-0 w-4 h-4 rounded-full bg-gradient-to-r from-purple-600 to-pink-600"></div>
                <div className="flex-1 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {milestone.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {milestone.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-white dark:bg-gray-800/50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Meet the Team
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              The passionate people behind CreatorHub
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="text-center p-6 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-xl"
              >
                <div className="text-6xl mb-4">{member.avatar}</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                  {member.name}
                </h3>
                <p className="text-purple-600 dark:text-purple-400 font-medium mb-3">
                  {member.role}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {member.bio}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-12 text-white"
          >
            <h2 className="text-4xl font-bold mb-4">Join Our Community</h2>
            <p className="text-xl text-white/90 mb-8">
              Be part of the creator revolution. Start your journey with us today.
            </p>
            <Link href="/signup">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-4 bg-white text-purple-600 rounded-xl font-bold text-lg shadow-2xl flex items-center gap-2 mx-auto"
              >
                Get Started Now
                <LuArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
