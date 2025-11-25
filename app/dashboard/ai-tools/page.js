'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { aiAPI } from '@/lib/api';
import { LuSparkles, LuFileText, LuMessageSquare, LuWand, LuCopy, LuCheck, LuZap, LuTrendingUp, LuRefreshCw, LuStar } from 'react-icons/lu';

export default function AIToolsPage() {
  const { userProfile, isPro } = useAuth();
  const [activeTab, setActiveTab] = useState('captions');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [history, setHistory] = useState([]);
  const [formData, setFormData] = useState({
    topic: '',
    tone: 'engaging',
    length: 'medium'
  });

  // Floating animation for background elements
  const floatingAnimation = {
    y: [0, -20, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  // Update character count
  useEffect(() => {
    setCharCount(formData.topic.length);
  }, [formData.topic]);

  const tools = [
    { 
      id: 'captions', 
      label: 'Caption Generator', 
      icon: LuMessageSquare,
      color: 'from-blue-500 to-cyan-500',
      description: 'Create engaging social media captions',
      emoji: '💬'
    },
    { 
      id: 'titles', 
      label: 'Title Generator', 
      icon: LuFileText,
      color: 'from-purple-500 to-pink-500',
      description: 'Generate catchy video titles',
      emoji: '🎬'
    },
    { 
      id: 'script', 
      label: 'Script Writer', 
      icon: LuWand,
      color: 'from-orange-500 to-red-500',
      description: 'Write complete video scripts',
      emoji: '📝'
    },
  ];

  const handleGenerate = async () => {
    if (!formData.topic.trim()) {
      alert('Please enter a topic');
      return;
    }

    setLoading(true);
    setResult('');
    setCopied(false);

    try {
      let response;
      switch (activeTab) {
        case 'captions':
          response = await aiAPI.generateCaptions(formData);
          break;
        case 'titles':
          response = await aiAPI.generateTitles(formData);
          break;
        case 'script':
          response = await aiAPI.generateScript(formData);
          break;
      }
      const generatedContent = response.data.result || response.data.content;
      setResult(generatedContent);
      
      // Add to history (keep last 5)
      setHistory(prev => [{
        tool: activeTab,
        content: generatedContent.substring(0, 100) + '...',
        timestamp: Date.now()
      }, ...prev].slice(0, 5));
    } catch (error) {
      console.error('AI generation error:', error);
      alert(error.response?.data?.error || 'Failed to generate content');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentTool = tools.find(t => t.id === activeTab);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 p-6 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={floatingAnimation}
          className="absolute top-20 left-10 w-64 h-64 bg-purple-300/20 dark:bg-purple-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ ...floatingAnimation, transition: { ...floatingAnimation.transition, delay: 1 }}}
          className="absolute bottom-20 right-10 w-96 h-96 bg-blue-300/20 dark:bg-blue-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ ...floatingAnimation, transition: { ...floatingAnimation.transition, delay: 2 }}}
          className="absolute top-1/2 left-1/3 w-72 h-72 bg-pink-300/20 dark:bg-pink-500/10 rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 mb-4 shadow-2xl relative"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 opacity-50 blur-xl"
            />
            <LuSparkles className="w-10 h-10 text-white relative z-10" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-3"
          >
            AI Content Tools
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
          >
            Generate engaging content for your social media with AI-powered creativity ✨
          </motion.p>
        </motion.div>

        {/* Tool Cards Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          {tools.map((tool, index) => {
            const Icon = tool.icon;
            const isActive = activeTab === tool.id;
            return (
              <motion.button
                key={tool.id}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  delay: 0.4 + index * 0.1,
                  type: "spring",
                  stiffness: 200
                }}
                whileHover={{ y: -5, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setActiveTab(tool.id);
                  setResult('');
                  setCopied(false);
                }}
                className={`relative p-6 rounded-2xl transition-all duration-300 group overflow-hidden backdrop-blur-sm ${
                  isActive
                    ? 'bg-white/90 dark:bg-gray-800/90 shadow-2xl'
                    : 'bg-white/60 dark:bg-gray-800/60 hover:bg-white/80 dark:hover:bg-gray-800/80 hover:shadow-lg'
                }`}
              >
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${tool.color} opacity-0 ${isActive ? 'opacity-5' : 'group-hover:opacity-10'} transition-opacity duration-300`}></div>
                
                {/* Active Indicator Border */}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className={`absolute inset-0 border-2 border-transparent bg-gradient-to-br ${tool.color} rounded-2xl`}
                    style={{ padding: '2px', borderRadius: '1rem' }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    <div className="w-full h-full bg-white dark:bg-gray-800 rounded-2xl"></div>
                  </motion.div>
                )}
                
                <div className="relative z-10">
                  <motion.div 
                    className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${tool.color} mb-3 shadow-lg`}
                    whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </motion.div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-1 text-left flex items-center gap-2">
                    {tool.label}
                    <span className="text-xl">{tool.emoji}</span>
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 text-left">
                    {tool.description}
                  </p>
                </div>
                
                {/* Corner Badge */}
                {isActive && (
                  <motion.div
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", delay: 0.2 }}
                    className="absolute top-3 right-3"
                  >
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${tool.color} flex items-center justify-center shadow-lg`}>
                      <LuStar className="w-4 h-4 text-white" />
                    </div>
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </motion.div>

        {/* Main Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700"
          >
            <div className="space-y-6 mb-6">
              {/* Topic Input */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <LuZap className="w-4 h-4 text-purple-500" />
                    Topic or Description
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    charCount > 200 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                    charCount > 100 ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                    'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                  }`}>
                    {charCount} characters
                  </span>
                </label>
                <div className="relative">
                  <textarea
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    placeholder={`Describe what you want to create... (e.g., "A fun vlog about my morning routine")`}
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white transition-all duration-200 resize-none"
                  />
                  {formData.topic && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      onClick={() => setFormData({ ...formData, topic: '' })}
                      className="absolute top-3 right-3 p-1.5 rounded-lg bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </motion.button>
                  )}
                </div>
              </motion.div>

              {/* Options Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Tone Selection */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                    <LuTrendingUp className="w-4 h-4 text-blue-500" />
                    Tone
                  </label>
                  <select
                    value={formData.tone}
                    onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white transition-all duration-200 cursor-pointer"
                  >
                    <option value="professional">💼 Professional</option>
                    <option value="engaging">✨ Engaging</option>
                    <option value="casual">😊 Casual</option>
                    <option value="humorous">😄 Humorous</option>
                    <option value="inspiring">🚀 Inspiring</option>
                  </select>
                </motion.div>

                {/* Length Selection */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                    <LuFileText className="w-4 h-4 text-green-500" />
                    Length
                  </label>
                  <select
                    value={formData.length}
                    onChange={(e) => setFormData({ ...formData, length: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white transition-all duration-200 cursor-pointer"
                  >
                    <option value="short">📝 Short</option>
                    <option value="medium">📄 Medium</option>
                    <option value="long">📚 Long</option>
                  </select>
                </motion.div>
              </div>
            </div>

            {/* Generate Button */}
            <motion.button
              whileHover={{ scale: !loading && formData.topic.trim() ? 1.02 : 1 }}
              whileTap={{ scale: !loading && formData.topic.trim() ? 0.98 : 1 }}
              onClick={handleGenerate}
              disabled={loading || !formData.topic.trim()}
              className={`relative w-full px-6 py-4 rounded-xl font-bold text-white transition-all duration-300 overflow-hidden group ${
                loading || !formData.topic.trim()
                  ? 'bg-gray-400 cursor-not-allowed'
                  : `bg-gradient-to-r ${currentTool.color} shadow-lg hover:shadow-2xl`
              }`}
            >
              {/* Animated Background Shine */}
              {!loading && formData.topic.trim() && (
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                />
              )}
              
              {/* Pulse Effect when loading */}
              {loading && (
                <motion.div
                  className="absolute inset-0 bg-white/20"
                  animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.2, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
              
              <div className="relative flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <motion.div 
                      className="rounded-full h-5 w-5 border-2 border-white border-t-transparent"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <span>Generating Magic...</span>
                    <motion.span
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      ✨
                    </motion.span>
                  </>
                ) : (
                  <>
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    >
                      <LuSparkles className="w-5 h-5" />
                    </motion.div>
                    <span>Generate {currentTool.label.replace(' Generator', '').replace(' Writer', '')}</span>
                    <span className="text-xl">{currentTool.emoji}</span>
                  </>
                )}
              </div>
            </motion.button>

          {/* Result */}
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.4, type: "spring" }}
                className="mt-8"
              >
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <LuSparkles className={`w-5 h-5 bg-gradient-to-r ${currentTool.color} bg-clip-text text-transparent`} />
                    </motion.div>
                    Generated Content
                    <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                      ({result.length} chars)
                    </span>
                  </label>
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05, rotate: -5 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleGenerate}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium bg-gradient-to-r ${currentTool.color} text-white hover:shadow-lg transition-shadow`}
                      title="Regenerate"
                    >
                      <LuRefreshCw className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleCopy}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                        copied
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 shadow-lg'
                          : `bg-gradient-to-r ${currentTool.color} text-white hover:shadow-lg`
                      }`}
                    >
                      <AnimatePresence mode="wait">
                        {copied ? (
                          <motion.div
                            key="check"
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0 }}
                            className="flex items-center gap-2"
                          >
                            <LuCheck className="w-4 h-4" />
                            <span>Copied!</span>
                          </motion.div>
                        ) : (
                          <motion.div
                            key="copy"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="flex items-center gap-2"
                          >
                            <LuCopy className="w-4 h-4" />
                            <span>Copy</span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  </div>
                </div>
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className={`relative p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-600 shadow-lg overflow-hidden backdrop-blur-sm`}
                >
                  {/* Decorative Corners */}
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${currentTool.color} opacity-10 rounded-bl-full`}></div>
                  <div className={`absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr ${currentTool.color} opacity-10 rounded-tr-full`}></div>
                  
                  {/* Content with typing effect */}
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed relative z-10"
                  >
                    {result}
                  </motion.p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          </motion.div>
        </AnimatePresence>

        {/* Tips & History Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {/* Tips Section */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-5 border border-blue-200 dark:border-blue-800 backdrop-blur-sm"
          >
            <h3 className="font-bold text-blue-900 dark:text-blue-300 mb-3 flex items-center gap-2">
              <span className="text-2xl">💡</span>
              Tips for Better Results
            </h3>
            <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-2">
              <motion.li 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                className="flex items-start gap-2"
              >
                <span className="text-blue-500 mt-0.5">✓</span>
                <span>Be specific about your topic or product</span>
              </motion.li>
              <motion.li 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.75 }}
                className="flex items-start gap-2"
              >
                <span className="text-blue-500 mt-0.5">✓</span>
                <span>Choose a tone that matches your brand</span>
              </motion.li>
              <motion.li 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
                className="flex items-start gap-2"
              >
                <span className="text-blue-500 mt-0.5">✓</span>
                <span>Try different length options for variety</span>
              </motion.li>
              <motion.li 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.85 }}
                className="flex items-start gap-2"
              >
                <span className="text-blue-500 mt-0.5">✓</span>
                <span>Regenerate as many times as you want</span>
              </motion.li>
            </ul>
          </motion.div>

          {/* Recent History */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-5 border border-purple-200 dark:border-purple-800 backdrop-blur-sm"
          >
            <h3 className="font-bold text-purple-900 dark:text-purple-300 mb-3 flex items-center gap-2">
              <span className="text-2xl">📜</span>
              Recent History
            </h3>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {history.length === 0 ? (
                <p className="text-sm text-purple-600/60 dark:text-purple-400/60 italic">
                  No history yet. Generate something to get started!
                </p>
              ) : (
                history.map((item, index) => (
                  <motion.div
                    key={item.timestamp}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="text-sm text-purple-800 dark:text-purple-400 p-2 bg-white/50 dark:bg-gray-800/50 rounded-lg"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium capitalize">{item.tool}</span>
                      <span className="text-xs text-purple-600/60 dark:text-purple-400/60">
                        {new Date(item.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-xs text-purple-700/80 dark:text-purple-300/80 truncate">
                      {item.content}
                    </p>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </div>

        {/* Stats Card */}
        {isPro && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="mt-4 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center shadow-lg">
                <LuStar className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-bold text-amber-900 dark:text-amber-300">Pro Member Benefits</p>
                <p className="text-sm text-amber-800 dark:text-amber-400">Unlimited AI generations • Priority processing • Advanced features</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
