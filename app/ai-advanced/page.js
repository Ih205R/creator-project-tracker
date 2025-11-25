'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LuBrain, LuSparkles, LuTrendingUp, LuSearch, LuFileText, 
  LuArrowLeft, LuCrown, LuRefreshCw, LuCopy, LuCheck, LuCoins, LuPlus, LuX
} from 'react-icons/lu';

export default function AIAdvancedPage() {
  const { userProfile, user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('script');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);
  const [credits, setCredits] = useState(0);
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [purchaseLoading, setPurchaseLoading] = useState(false);

  // Form states
  const [scriptForm, setScriptForm] = useState({
    topic: '',
    duration: '5',
    tone: 'engaging',
    platform: 'youtube'
  });

  const [optimizationForm, setOptimizationForm] = useState({
    content: '',
    platform: 'youtube',
    goal: 'engagement'
  });

  const [trendForm, setTrendForm] = useState({
    niche: '',
    region: 'Global'
  });

  const [seoForm, setSeoForm] = useState({
    title: '',
    description: '',
    keywords: ''
  });

  const isPremium = userProfile?.subscriptionPlan === 'Premium';

  // Fetch user credits on load
  useEffect(() => {
    if (isPremium && user) {
      fetchCredits();
    }
  }, [isPremium, user]);

  const fetchCredits = async () => {
    try {
      const token = await user.getIdToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/ai-credits`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setCredits(data.credits || 0);
      }
    } catch (error) {
      console.error('Error fetching credits:', error);
    }
  };

  const deductCredit = async () => {
    try {
      const token = await user.getIdToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/use-ai-credit`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setCredits(data.credits);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deducting credit:', error);
      return false;
    }
  };

  const purchaseCredits = async (packageType) => {
    setPurchaseLoading(true);
    try {
      const token = await user.getIdToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/stripe/purchase-credits`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ package: packageType })
      });

      if (!response.ok) {
        throw new Error('Failed to create purchase session');
      }

      const data = await response.json();
      
      // Redirect to Stripe checkout
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Purchase error:', error);
      alert('Failed to initiate purchase. Please try again.');
    } finally {
      setPurchaseLoading(false);
    }
  };

  // Check for successful purchase and refresh credits
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('purchase') === 'success') {
      const creditsAdded = urlParams.get('credits');
      fetchCredits();
      
      // Show success message
      if (creditsAdded) {
        setTimeout(() => {
          setResult(`✅ Successfully purchased ${creditsAdded} credits!`);
        }, 500);
      }
      
      // Clean up URL
      window.history.replaceState({}, document.title, '/ai-advanced');
    }
  }, []);

  if (!isPremium) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 text-center"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <LuBrain className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Advanced AI Content Tools
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Upgrade to Premium to unlock advanced AI-powered content creation tools.
          </p>
          <Link
            href="/dashboard?upgrade=premium"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
          >
            <LuCrown className="w-5 h-5" />
            Upgrade to Premium
          </Link>
        </motion.div>
      </div>
    );
  }

  const generateScript = async () => {
    if (credits <= 0) {
      setResult('Error: Insufficient credits. Please purchase more credits to continue.');
      return;
    }

    setLoading(true);
    setResult('');
    try {
      const token = await user.getIdToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ai/generate-script`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          topic: scriptForm.topic,
          duration: parseInt(scriptForm.duration),
          tone: scriptForm.tone,
          platform: scriptForm.platform
        })
      });

      if (!response.ok) throw new Error('Failed to generate script');
      const data = await response.json();
      setResult(data.script || 'Script generated successfully!');
      
      // Deduct credit after successful generation
      await deductCredit();
    } catch (error) {
      setResult('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const optimizeContent = async () => {
    if (credits <= 0) {
      setResult('Error: Insufficient credits. Please purchase more credits to continue.');
      return;
    }

    setLoading(true);
    setResult('');
    try {
      const token = await user.getIdToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ai/optimize-content`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(optimizationForm)
      });

      if (!response.ok) throw new Error('Failed to optimize content');
      const data = await response.json();
      setResult(data.optimized || 'Content optimized successfully!');
      
      // Deduct credit after successful generation
      await deductCredit();
    } catch (error) {
      setResult('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const analyzeTrends = async () => {
    if (credits <= 0) {
      setResult('Error: Insufficient credits. Please purchase more credits to continue.');
      return;
    }

    setLoading(true);
    setResult('');
    try {
      const token = await user.getIdToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ai/analyze-trends`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(trendForm)
      });

      if (!response.ok) throw new Error('Failed to analyze trends');
      const data = await response.json();
      setResult(data.trends || 'Trends analyzed successfully!');
      
      // Deduct credit after successful generation
      await deductCredit();
    } catch (error) {
      setResult('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const generateSEO = async () => {
    if (credits <= 0) {
      setResult('Error: Insufficient credits. Please purchase more credits to continue.');
      return;
    }

    setLoading(true);
    setResult('');
    try {
      const token = await user.getIdToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ai/seo-recommendations`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(seoForm)
      });

      if (!response.ok) throw new Error('Failed to generate SEO recommendations');
      const data = await response.json();
      setResult(data.recommendations || 'SEO recommendations generated!');
      
      // Deduct credit after successful generation
      await deductCredit();
    } catch (error) {
      setResult('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tabs = [
    { id: 'script', label: 'Video Script', icon: LuFileText },
    { id: 'optimize', label: 'Content Optimization', icon: LuSparkles },
    { id: 'trends', label: 'Trend Analysis', icon: LuTrendingUp },
    { id: 'seo', label: 'SEO Recommendations', icon: LuSearch }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <Link href="/premium" className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700">
              <LuArrowLeft className="w-4 h-4" />
              Back to Premium Features
            </Link>
            
            {/* Credits Display */}
            <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
              <LuCoins className="w-5 h-5 text-yellow-500" />
              <span className="font-semibold text-gray-900 dark:text-white">{credits}</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">Credits</span>
              <button
                onClick={() => setShowCreditModal(true)}
                className="ml-2 p-1 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors"
              >
                <LuPlus className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
              <LuBrain className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Advanced AI Content Tools
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Powerful AI tools for professional content creation
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <div className="flex overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setResult('');
                    }}
                    className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-6">
            {/* Video Script Generator */}
            {activeTab === 'script' && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  AI Video Script Generator
                </h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Video Topic
                  </label>
                  <input
                    type="text"
                    value={scriptForm.topic}
                    onChange={(e) => setScriptForm({...scriptForm, topic: e.target.value})}
                    placeholder="e.g., How to grow your YouTube channel"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Duration (minutes)
                    </label>
                    <select
                      value={scriptForm.duration}
                      onChange={(e) => setScriptForm({...scriptForm, duration: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                    >
                      <option value="1">1 minute</option>
                      <option value="3">3 minutes</option>
                      <option value="5">5 minutes</option>
                      <option value="10">10 minutes</option>
                      <option value="15">15 minutes</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tone
                    </label>
                    <select
                      value={scriptForm.tone}
                      onChange={(e) => setScriptForm({...scriptForm, tone: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                    >
                      <option value="engaging">Engaging</option>
                      <option value="professional">Professional</option>
                      <option value="casual">Casual</option>
                      <option value="educational">Educational</option>
                      <option value="entertaining">Entertaining</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Platform
                    </label>
                    <select
                      value={scriptForm.platform}
                      onChange={(e) => setScriptForm({...scriptForm, platform: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                    >
                      <option value="youtube">YouTube</option>
                      <option value="tiktok">TikTok</option>
                      <option value="instagram">Instagram</option>
                    </select>
                  </div>
                </div>
                <button
                  onClick={generateScript}
                  disabled={loading || !scriptForm.topic}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <LuRefreshCw className="w-5 h-5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <LuSparkles className="w-5 h-5" />
                      Generate Script
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Content Optimization */}
            {activeTab === 'optimize' && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Content Optimization
                </h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Your Content
                  </label>
                  <textarea
                    value={optimizationForm.content}
                    onChange={(e) => setOptimizationForm({...optimizationForm, content: e.target.value})}
                    placeholder="Paste your content here to optimize..."
                    rows={6}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Platform
                    </label>
                    <select
                      value={optimizationForm.platform}
                      onChange={(e) => setOptimizationForm({...optimizationForm, platform: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                    >
                      <option value="youtube">YouTube</option>
                      <option value="tiktok">TikTok</option>
                      <option value="instagram">Instagram</option>
                      <option value="twitter">Twitter</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Goal
                    </label>
                    <select
                      value={optimizationForm.goal}
                      onChange={(e) => setOptimizationForm({...optimizationForm, goal: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                    >
                      <option value="engagement">Maximize Engagement</option>
                      <option value="reach">Increase Reach</option>
                      <option value="conversions">Drive Conversions</option>
                      <option value="awareness">Build Awareness</option>
                    </select>
                  </div>
                </div>
                <button
                  onClick={optimizeContent}
                  disabled={loading || !optimizationForm.content}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <LuRefreshCw className="w-5 h-5 animate-spin" />
                      Optimizing...
                    </>
                  ) : (
                    <>
                      <LuSparkles className="w-5 h-5" />
                      Optimize Content
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Trend Analysis */}
            {activeTab === 'trends' && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Trend Analysis
                </h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Your Niche
                  </label>
                  <input
                    type="text"
                    value={trendForm.niche}
                    onChange={(e) => setTrendForm({...trendForm, niche: e.target.value})}
                    placeholder="e.g., Tech reviews, Gaming, Cooking"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Region
                  </label>
                  <select
                    value={trendForm.region}
                    onChange={(e) => setTrendForm({...trendForm, region: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                  >
                    <option value="Global">Global</option>
                    <optgroup label="North America">
                      <option value="United States">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="Mexico">Mexico</option>
                    </optgroup>
                    <optgroup label="Europe">
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Germany">Germany</option>
                      <option value="France">France</option>
                      <option value="Italy">Italy</option>
                      <option value="Spain">Spain</option>
                      <option value="Netherlands">Netherlands</option>
                      <option value="Sweden">Sweden</option>
                      <option value="Norway">Norway</option>
                      <option value="Denmark">Denmark</option>
                      <option value="Finland">Finland</option>
                      <option value="Poland">Poland</option>
                      <option value="Belgium">Belgium</option>
                      <option value="Austria">Austria</option>
                      <option value="Switzerland">Switzerland</option>
                      <option value="Portugal">Portugal</option>
                      <option value="Ireland">Ireland</option>
                    </optgroup>
                    <optgroup label="Asia Pacific">
                      <option value="Australia">Australia</option>
                      <option value="New Zealand">New Zealand</option>
                      <option value="Japan">Japan</option>
                      <option value="South Korea">South Korea</option>
                      <option value="Singapore">Singapore</option>
                      <option value="India">India</option>
                      <option value="Thailand">Thailand</option>
                      <option value="Vietnam">Vietnam</option>
                      <option value="Philippines">Philippines</option>
                      <option value="Indonesia">Indonesia</option>
                      <option value="Malaysia">Malaysia</option>
                    </optgroup>
                    <optgroup label="Middle East">
                      <option value="United Arab Emirates">United Arab Emirates</option>
                      <option value="Saudi Arabia">Saudi Arabia</option>
                      <option value="Israel">Israel</option>
                      <option value="Turkey">Turkey</option>
                      <option value="Qatar">Qatar</option>
                    </optgroup>
                    <optgroup label="South America">
                      <option value="Brazil">Brazil</option>
                      <option value="Argentina">Argentina</option>
                      <option value="Chile">Chile</option>
                      <option value="Colombia">Colombia</option>
                      <option value="Peru">Peru</option>
                    </optgroup>
                    <optgroup label="Africa">
                      <option value="South Africa">South Africa</option>
                      <option value="Nigeria">Nigeria</option>
                      <option value="Egypt">Egypt</option>
                      <option value="Kenya">Kenya</option>
                      <option value="Morocco">Morocco</option>
                    </optgroup>
                  </select>
                </div>
                <button
                  onClick={analyzeTrends}
                  disabled={loading || !trendForm.niche}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <LuRefreshCw className="w-5 h-5 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <LuTrendingUp className="w-5 h-5" />
                      Analyze Trends
                    </>
                  )}
                </button>
              </div>
            )}

            {/* SEO Recommendations */}
            {activeTab === 'seo' && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  SEO Recommendations
                </h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Content Title
                  </label>
                  <input
                    type="text"
                    value={seoForm.title}
                    onChange={(e) => setSeoForm({...seoForm, title: e.target.value})}
                    placeholder="Your content title"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={seoForm.description}
                    onChange={(e) => setSeoForm({...seoForm, description: e.target.value})}
                    placeholder="Brief description of your content"
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Target Keywords (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={seoForm.keywords}
                    onChange={(e) => setSeoForm({...seoForm, keywords: e.target.value})}
                    placeholder="keyword1, keyword2, keyword3"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <button
                  onClick={generateSEO}
                  disabled={loading || !seoForm.title}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <LuRefreshCw className="w-5 h-5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <LuSearch className="w-5 h-5" />
                      Generate SEO Recommendations
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Result Display */}
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-6 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Result
                  </h3>
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-2 px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    {copied ? (
                      <>
                        <LuCheck className="w-4 h-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <LuCopy className="w-4 h-4" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
                <div className="prose dark:prose-invert max-w-none">
                  <pre className="whitespace-pre-wrap text-gray-900 dark:text-white text-sm">
                    {result}
                  </pre>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Credit Purchase Modal */}
        <AnimatePresence>
          {showCreditModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowCreditModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Additional Credits
                  </h2>
                  <button
                    onClick={() => setShowCreditModal(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <LuX className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  </button>
                </div>

                <div className="p-6">
                  <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      <strong>Current Balance:</strong> {credits} Credits
                    </p>
                    <p className="text-xs text-blue-600 dark:text-blue-300 mt-2">
                      Each AI generation uses 1 credit. Purchase more credits to continue using Advanced AI tools.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Credit Packages */}
                    <div className="border-2 border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors cursor-pointer">
                      <div className="text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-full mb-4">
                          <LuCoins className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                          10 Credits
                        </h3>
                        <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">
                          $9.99
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                          Perfect for occasional use
                        </p>
                        <button 
                          onClick={() => purchaseCredits('small')}
                          disabled={purchaseLoading}
                          className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {purchaseLoading ? 'Processing...' : 'Purchase'}
                        </button>
                      </div>
                    </div>

                    <div className="border-2 border-indigo-500 dark:border-indigo-400 rounded-xl p-6 relative">
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-indigo-600 text-white text-xs font-semibold rounded-full">
                        POPULAR
                      </div>
                      <div className="text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-full mb-4">
                          <LuCoins className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                          50 Credits
                        </h3>
                        <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-1">
                          $39.99
                        </p>
                        <p className="text-xs text-green-600 dark:text-green-400 mb-4">
                          Save 20%
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                          Great for regular users
                        </p>
                        <button 
                          onClick={() => purchaseCredits('medium')}
                          disabled={purchaseLoading}
                          className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {purchaseLoading ? 'Processing...' : 'Purchase'}
                        </button>
                      </div>
                    </div>

                    <div className="border-2 border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors cursor-pointer">
                      <div className="text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-full mb-4">
                          <LuCoins className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                          100 Credits
                        </h3>
                        <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-1">
                          $69.99
                        </p>
                        <p className="text-xs text-green-600 dark:text-green-400 mb-4">
                          Save 30%
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                          Best value for power users
                        </p>
                        <button 
                          onClick={() => purchaseCredits('large')}
                          disabled={purchaseLoading}
                          className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {purchaseLoading ? 'Processing...' : 'Purchase'}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      What can you do with credits?
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <li className="flex items-start gap-2">
                        <LuCheck className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Generate AI-powered video scripts</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <LuCheck className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Optimize content for maximum engagement</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <LuCheck className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Analyze trends in your niche</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <LuCheck className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Get SEO recommendations for better visibility</span>
                      </li>
                    </ul>
                  </div>

                  <div className="mt-6 text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Credits never expire and are valid for all Premium AI features
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
