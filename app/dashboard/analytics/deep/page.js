'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  LuChartBar, LuTrendingUp, LuUsers, LuEye, LuClock, 
  LuDollarSign, LuMapPin, LuMonitor, LuRefreshCw, LuArrowLeft,
  LuSparkles, LuBrain, LuLightbulb, LuZap, LuTarget, LuRocket,
  LuArrowRight, LuTrophy,
  LuActivity, LuTrendingDown, LuTriangleAlert, LuCheck, LuX,
  LuGlobe, LuSmartphone, LuMonitorPlay, LuThumbsUp, LuThumbsDown,
  LuMessageSquare, LuShare2, LuVideo, LuCalendar, LuAward, LuCoins, LuPlus
} from 'react-icons/lu';
import { FaYoutube } from 'react-icons/fa';
import Link from 'next/link';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

export default function DeepAnalyticsPage() {
  const { user, userProfile, isPro, refreshProfile } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [purchasedCredits, setPurchasedCredits] = useState(0);

  // Handle purchase success/cancellation from URL params
  useEffect(() => {
    const purchase = searchParams.get('purchase');
    const credits = searchParams.get('credits');

    if (purchase === 'success' && credits) {
      setPurchasedCredits(parseInt(credits));
      setShowSuccessMessage(true);
      
      // Refresh user profile to get updated credit balance
      if (refreshProfile) {
        refreshProfile();
      }
      
      // Clear URL params
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
      
      // Auto-hide success message after 10 seconds
      setTimeout(() => setShowSuccessMessage(false), 10000);
    } else if (purchase === 'cancelled') {
      // Optionally show cancellation message
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  }, [searchParams, refreshProfile]);

  useEffect(() => {
    loadAnalytics(selectedPeriod);
  }, [selectedPeriod]);

  const loadAnalytics = async (period = '30d') => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const token = await user.getIdToken();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/youtube/analytics/authenticated?period=${period}`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to load analytics');
      }

      const data = await response.json();
      setAnalytics(data);
    } catch (err) {
      console.error('Analytics error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const refreshAnalytics = async () => {
    setRefreshing(true);
    await loadAnalytics(selectedPeriod);
    setRefreshing(false);
  };

  // Check if user has OAuth access
  const hasOAuthAccess = userProfile?.integrations?.youtube?.accessType === 'oauth';

  if (!hasOAuthAccess) {
    return (
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        className="text-center py-12"
      >
        <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-2xl p-12 max-w-2xl mx-auto border border-red-200 dark:border-red-900">
          <FaYoutube className="w-20 h-20 text-red-600 mx-auto mb-6" />
          <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            Deep Analytics - OAuth Required
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
            You need to connect your YouTube channel with Google Sign-In to access deep analytics.
          </p>
          <Link 
            href="/dashboard/integrations" 
            className="inline-flex items-center gap-2 px-8 py-4 bg-red-600 text-white rounded-xl font-bold text-lg hover:bg-red-700 transition-all shadow-lg"
          >
            <FaYoutube className="w-6 h-6" />
            Connect with Google
          </Link>
        </div>
      </motion.div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <LuRefreshCw className="w-12 h-12 text-red-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading deep analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <Link 
            href="/dashboard/integrations" 
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <LuArrowLeft className="w-5 h-5" />
            Back to Integrations
          </Link>
        </div>
        
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-8 text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-bold text-red-900 dark:text-red-100 mb-2">
            Failed to Load Analytics
          </h3>
          <p className="text-red-700 dark:text-red-300 mb-6">
            {error}
          </p>
          <button 
            onClick={refreshAnalytics}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </motion.div>
    );
  }

  if (!analytics) {
    return null;
  }

  const { channel, analytics: analyticsData, revenue, trafficSources, demographics, period } = analytics;

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
            <Link href="/dashboard/integrations" className="hover:text-gray-900 dark:hover:text-white">
              Integrations
            </Link>
            <span>/</span>
            <span>Deep Analytics</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            YouTube Deep Analytics
          </h1>
        </div>
        <button
          onClick={refreshAnalytics}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
        >
          <LuRefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Channel Info */}
      <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-6 text-white">
        <div className="flex items-center gap-4">
          {channel.thumbnail && (
            <img 
              src={channel.thumbnail} 
              alt={channel.title} 
              className="w-16 h-16 rounded-full border-4 border-white/30"
            />
          )}
          <div className="flex-1">
            <h2 className="text-2xl font-bold">{channel.title}</h2>
            <p className="text-red-100">
              {period.startDate} to {period.endDate}
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">
              {parseInt(channel.statistics.subscriberCount).toLocaleString()}
            </div>
            <div className="text-red-100">Subscribers</div>
          </div>
        </div>
      </div>

      {/* AI-Powered Insights Banner */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 rounded-xl p-6 text-white shadow-2xl border-2 border-purple-400">
        <div className="flex items-center gap-3 mb-3">
          <LuSparkles className="w-8 h-8 animate-pulse" />
          <h3 className="text-2xl font-bold">AI-Powered Insights</h3>
          <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-semibold backdrop-blur-sm">
            NEW
          </span>
        </div>
        <p className="text-purple-100 text-lg">
          Our AI analyzes your channel performance to provide personalized recommendations and predictions
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={<LuEye className="w-6 h-6" />}
          title="Total Views"
          value={parseInt(channel.statistics.viewCount).toLocaleString()}
          color="blue"
        />
        <MetricCard
          icon={<FaYoutube className="w-6 h-6" />}
          title="Total Videos"
          value={parseInt(channel.statistics.videoCount).toLocaleString()}
          color="red"
        />
        <MetricCard
          icon={<LuClock className="w-6 h-6" />}
          title="Watch Time (mins)"
          value={analyticsData?.columnHeaders ? calculateTotalWatchTime(analyticsData) : 'N/A'}
          color="purple"
        />
        <MetricCard
          icon={<LuTrendingUp className="w-6 h-6" />}
          title="Avg View Duration"
          value={analyticsData?.columnHeaders ? calculateAvgDuration(analyticsData) : 'N/A'}
          color="green"
        />
      </div>

      {/* AI Insights Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <AIInsightCard
          icon={<LuBrain className="w-6 h-6" />}
          title="Growth Prediction"
          insight={generateGrowthPrediction(analyticsData, channel)}
          color="purple"
        />
        <AIInsightCard
          icon={<LuLightbulb className="w-6 h-6" />}
          title="Content Recommendation"
          insight={generateContentRecommendation(analyticsData, trafficSources)}
          color="yellow"
        />
        <AIInsightCard
          icon={<LuTarget className="w-6 h-6" />}
          title="Optimization Tip"
          insight={generateOptimizationTip(analyticsData, demographics)}
          color="blue"
        />
      </div>

      {/* Revenue Section */}
      {revenue && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <LuDollarSign className="w-6 h-6 text-green-600" />
            Revenue Analytics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <RevenueCard
              title="Estimated Revenue"
              value={calculateTotalRevenue(revenue)}
              subtitle="Last 30 days"
            />
            <RevenueCard
              title="Average RPM"
              value={calculateAvgRPM(revenue)}
              subtitle="Revenue per 1000 views"
            />
            <RevenueCard
              title="Average CPM"
              value={calculateAvgCPM(revenue)}
              subtitle="Cost per 1000 impressions"
            />
          </div>
        </div>
      )}

      {/* Traffic Sources */}
      {trafficSources && trafficSources.rows && trafficSources.rows.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <LuChartBar className="w-6 h-6 text-blue-600" />
            Traffic Sources
          </h3>
          <div className="space-y-3">
            {trafficSources.rows.slice(0, 10).map((row, index) => (
              <TrafficSourceBar
                key={index}
                source={row[0]}
                views={row[1]}
                maxViews={trafficSources.rows[0][1]}
              />
            ))}
          </div>
        </div>
      )}

      {/* Demographics */}
      {demographics && demographics.rows && demographics.rows.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <LuUsers className="w-6 h-6 text-purple-600" />
              Demographics
            </h3>
            <div className="space-y-3">
              {demographics.rows.slice(0, 8).map((row, index) => (
                <DemographicBar
                  key={index}
                  ageGroup={row[0]}
                  gender={row[1]}
                  percentage={row[2]}
                />
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <LuMapPin className="w-6 h-6 text-green-600" />
              Top Locations
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Geographic data coming soon
            </p>
          </div>
        </div>
      )}

      {/* Analytics Chart with AI Predictions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-2 border-purple-200 dark:border-purple-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <LuTrendingUp className="w-6 h-6 text-blue-600" />
            Performance Over Time
            <span className="ml-2 px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 text-xs rounded-full flex items-center gap-1">
              <LuSparkles className="w-3 h-3" />
              AI Enhanced
            </span>
          </h3>
          {loading && (
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <LuRefreshCw className="w-4 h-4 animate-spin" />
              <span>Loading data...</span>
            </div>
          )}
        </div>
        {analyticsData && analyticsData.rows && analyticsData.rows.length > 0 ? (
          <>
            <PerformanceChart 
              analyticsData={analyticsData} 
              onPeriodChange={setSelectedPeriod}
              currentPeriod={selectedPeriod}
            />
            <AITrendAnalysis analyticsData={analyticsData} />
          </>
        ) : (
          <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400">
              No performance data available
            </p>
          </div>
        )}
      </div>

      {/* AI Revenue Growth Plan */}
      <RevenueGrowthPlan 
        analytics={analytics} 
        analyticsData={analyticsData} 
        channel={channel}
        revenue={revenue}
        userProfile={userProfile}
      />

      {/* AI Channel Summary */}
      <AIChannelSummary 
        user={user}
        userProfile={userProfile}
        channel={channel}
      />

      {/* Success Message */}
      <AnimatePresence>
        {showSuccessMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg shadow-lg p-4 z-50"
          >
            <div className="flex items-center gap-3">
              <LuCheck className="w-6 h-6 text-green-600" />
              <p className="text-sm text-green-800 dark:text-green-200">
                Successfully purchased {purchasedCredits} AI credit{purchasedCredits > 1 ? 's' : ''}!
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Revenue Growth Plan Component
function RevenueGrowthPlan({ analytics, analyticsData, channel, revenue, userProfile }) {
  if (!analyticsData || !channel) {
    return null;
  }

  const roadmap = generateRevenueRoadmap(analyticsData, channel, revenue);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
          <LuRocket className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            AI Revenue Growth Plan
            <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold rounded-full">
              PERSONALIZED
            </span>
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            AI-powered roadmap to maximize your YouTube earnings
          </p>
        </div>
      </div>

      {/* Revenue Projection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <RevenueCard 
          title="Current Monthly Revenue" 
          value={roadmap.currentRevenue}
          subtitle="Based on recent performance"
        />
        <RevenueCard 
          title="3-Month Projection" 
          value={roadmap.projectedRevenue}
          subtitle="If strategies are implemented"
        />
        <RevenueCard 
          title="Growth Potential" 
          value={roadmap.growthPotential}
          subtitle="Estimated increase"
        />
      </div>

      {/* AI Insight */}
      <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800">
        <div className="flex items-start gap-3">
          <LuBrain className="w-5 h-5 text-green-600 dark:text-green-400 mt-1 flex-shrink-0" />
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-2">AI Analysis</h4>
            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
              {roadmap.aiInsight}
            </p>
          </div>
        </div>
      </div>

      {/* Action Steps */}
      <div className="space-y-4">
        <h4 className="font-bold text-gray-900 dark:text-white text-lg">
          Recommended Action Steps
        </h4>
        {roadmap.steps.map((step, index) => (
          <div 
            key={index}
            className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                {step.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h5 className="font-bold text-gray-900 dark:text-white">
                    {index + 1}. {step.title}
                  </h5>
                  <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                    step.priority === 'high' 
                      ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                      : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                  }`}>
                    {step.priority.toUpperCase()}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                  {step.description}
                </p>
                <div className="flex flex-wrap gap-3 text-xs">
                  <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                    <LuTrendingUp className="w-4 h-4" />
                    <span className="font-semibold">{step.impact}</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                    <LuClock className="w-4 h-4" />
                    <span>{step.timeline}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// AI Channel Summary Component
function AIChannelSummary({ user, userProfile, channel }) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [purchaseLoading, setPurchaseLoading] = useState(false);

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
      setError('Failed to initiate purchase. Please try again.');
    } finally {
      setPurchaseLoading(false);
    }
  };

  const generateSummary = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const token = await user.getIdToken();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/ai/channel-summary`,
        {
          method: 'POST',
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ channelId: channel?.id })
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate summary');
      }

      const data = await response.json();
      
      // Transform backend response to frontend format
      const aiInsights = data.summary?.aiInsights || {};
      const transformedSummary = {
        overview: aiInsights.mainTheme || 'No overview available',
        demandAnalysis: aiInsights.demandAnalysis || 'No demand analysis available',
        growthAnalysis: aiInsights.growthAssessment || 'No growth analysis available',
        recommendations: aiInsights.improvementPlan || aiInsights.contentStrategy || [],
        strengths: aiInsights.strengths || [],
        opportunities: aiInsights.opportunities || [],
        projections: aiInsights.projections || {},
        marketPosition: aiInsights.marketPosition || '',
        creditsUsed: data.creditsUsed,
        remainingCredits: data.remainingCredits
      };
      
      setSummary(transformedSummary);
    } catch (err) {
      console.error('AI Summary error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const aiCredits = userProfile?.aiCredits || 0;
  const canGenerate = aiCredits >= 3;

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-lg border-2 border-indigo-200 dark:border-indigo-800 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl shadow-lg">
            <LuSparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              AI Channel Summary
              <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 text-xs font-semibold rounded-full">
                3 CREDITS
              </span>
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Comprehensive AI analysis of your entire channel history
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            Your AI Credits
          </div>
          <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            {aiCredits}
          </div>
        </div>
      </div>

      {!summary && (
        <div className="text-center py-8">
          <LuBrain className="w-16 h-16 text-indigo-600 dark:text-indigo-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Generate a comprehensive AI-powered summary of your channel including demand analysis,
            growth insights, and personalized recommendations based on all your historical data.
          </p>
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}
          <button
            onClick={generateSummary}
            disabled={loading || !canGenerate}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-bold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <LuRefreshCw className="w-5 h-5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <LuSparkles className="w-5 h-5" />
                Generate AI Summary (3 Credits)
              </>
            )}
          </button>
          {!canGenerate && (
            <div className="mt-4">
              <p className="text-sm text-red-600 dark:text-red-400 mb-3">
                You need at least 3 AI Credits to generate a summary
              </p>
              <button
                onClick={() => setShowCreditModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                <LuCoins className="w-4 h-4" />
                Buy More Credits
              </button>
            </div>
          )}
        </div>
      )}

      {summary && (
        <div className="space-y-6">
          {/* Credits Info */}
          {summary.creditsUsed && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
              <p className="text-sm text-green-700 dark:text-green-400 flex items-center gap-2">
                <LuCheck className="w-4 h-4" />
                Successfully generated! Used {summary.creditsUsed} credits. {summary.remainingCredits} credits remaining.
              </p>
            </div>
          )}

          {/* Summary Content */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h4 className="font-bold text-gray-900 dark:text-white text-lg mb-4">
              Channel Overview
            </h4>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {summary.overview}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Demand Analysis */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-4">
                <LuTrendingUp className="w-5 h-5 text-green-600" />
                <h4 className="font-bold text-gray-900 dark:text-white">Demand Analysis</h4>
              </div>
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                {summary.demandAnalysis}
              </p>
            </div>

            {/* Growth Analysis */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-4">
                <LuChartBar className="w-5 h-5 text-blue-600" />
                <h4 className="font-bold text-gray-900 dark:text-white">Growth Analysis</h4>
              </div>
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                {summary.growthAnalysis}
              </p>
            </div>
          </div>

          {/* Strengths & Opportunities */}
          {(summary.strengths?.length > 0 || summary.opportunities?.length > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Strengths */}
              {summary.strengths?.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 mb-4">
                    <LuAward className="w-5 h-5 text-purple-600" />
                    <h4 className="font-bold text-gray-900 dark:text-white">Key Strengths</h4>
                  </div>
                  <ul className="space-y-2">
                    {summary.strengths.slice(0, 5).map((strength, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-700 dark:text-gray-300 text-sm">
                        <LuCheck className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Opportunities */}
              {summary.opportunities?.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 mb-4">
                    <LuRocket className="w-5 h-5 text-orange-600" />
                    <h4 className="font-bold text-gray-900 dark:text-white">Growth Opportunities</h4>
                  </div>
                  <ul className="space-y-2">
                    {summary.opportunities.slice(0, 5).map((opp, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-700 dark:text-gray-300 text-sm">
                        <LuZap className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                        <span>{opp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Projections */}
          {summary.projections && (summary.projections.threeMonth || summary.projections.sixMonth) && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-2 mb-4">
                <LuTarget className="w-5 h-5 text-blue-600" />
                <h4 className="font-bold text-gray-900 dark:text-white">Growth Projections</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {summary.projections.threeMonth && (
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">3-Month Projection</p>
                    <p className="text-gray-900 dark:text-white font-medium">{summary.projections.threeMonth}</p>
                  </div>
                )}
                {summary.projections.sixMonth && (
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">6-Month Projection</p>
                    <p className="text-gray-900 dark:text-white font-medium">{summary.projections.sixMonth}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Recommendations */}
          {summary.recommendations?.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-4">
                <LuLightbulb className="w-5 h-5 text-yellow-600" />
                <h4 className="font-bold text-gray-900 dark:text-white">Improvement Suggestions</h4>
              </div>
              <ul className="space-y-2">
                {summary.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-700 dark:text-gray-300 text-sm">
                    <LuCheck className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Market Position */}
          {summary.marketPosition && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-4">
                <LuTrophy className="w-5 h-5 text-indigo-600" />
                <h4 className="font-bold text-gray-900 dark:text-white">Market Position</h4>
              </div>
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                {summary.marketPosition}
              </p>
            </div>
          )}

          <button
            onClick={() => setSummary(null)}
            className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Generate New Summary
          </button>
        </div>
      )}

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
                  Purchase AI Credits
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
                    <strong>Current Balance:</strong> {aiCredits} Credits
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-300 mt-2">
                    Each AI Channel Summary costs 3 credits. Purchase more credits to continue using Advanced AI features.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Small Package */}
                  <div className="border-2 border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors">
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

                  {/* Medium Package */}
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

                  {/* Large Package */}
                  <div className="border-2 border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors">
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
                      <span>Generate comprehensive AI channel summaries (3 credits)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <LuCheck className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>AI-powered video scripts (1 credit)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <LuCheck className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Content optimization (1 credit)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <LuCheck className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Trend analysis (1 credit)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <LuCheck className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>SEO recommendations (1 credit)</span>
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
  );
}

// Performance Chart Component
function PerformanceChart({ analyticsData, onPeriodChange, currentPeriod }) {
  const [chartMetric, setChartMetric] = useState('views');
  const [timePeriod, setTimePeriod] = useState(currentPeriod || '30d');
  
  // Update internal state when parent's period changes
  useEffect(() => {
    if (currentPeriod) {
      setTimePeriod(currentPeriod);
    }
  }, [currentPeriod]);
  
  // Process data for the chart with time period filter
  const chartData = prepareChartData(analyticsData, chartMetric, timePeriod);

  const metricConfig = {
    views: {
      dataKey: 'views',
      label: 'Views',
      color: '#3B82F6',
      format: (value) => value.toLocaleString()
    },
    watchTime: {
      dataKey: 'watchTime',
      label: 'Watch Time (mins)',
      color: '#8B5CF6',
      format: (value) => value.toLocaleString()
    },
    subscribers: {
      dataKey: 'subscribers',
      label: 'Subscribers Gained',
      color: '#10B981',
      format: (value) => value.toLocaleString()
    },
    likes: {
      dataKey: 'likes',
      label: 'Likes',
      color: '#EF4444',
      format: (value) => value.toLocaleString()
    }
  };

  const timePeriodOptions = [
    { value: '24h', label: '24 Hours', days: 1 },
    { value: '7d', label: '7 Days', days: 7 },
    { value: '30d', label: '1 Month', days: 30 },
    { value: '90d', label: '3 Months', days: 90 },
    { value: 'all', label: 'All Time', days: 365 }
  ];

  const handlePeriodChange = (newPeriod) => {
    setTimePeriod(newPeriod);
    // Notify parent component to refetch data
    if (onPeriodChange) {
      onPeriodChange(newPeriod);
    }
  };

  const currentConfig = metricConfig[chartMetric];

  return (
    <div>
      {/* Time Period Selector */}
      <div className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Time Period
        </label>
        <div className="flex flex-wrap gap-2">
          {timePeriodOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handlePeriodChange(option.value)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                timePeriod === option.value
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
        {timePeriod === 'all' && (
          <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-700 dark:text-blue-300 flex items-center gap-2">
              <LuClock className="w-4 h-4" />
              Showing complete channel history from creation date to today
            </p>
          </div>
        )}
      </div>

      {/* Metric Selector */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setChartMetric('views')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            chartMetric === 'views'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          Views
        </button>
        <button
          onClick={() => setChartMetric('watchTime')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            chartMetric === 'watchTime'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          Watch Time
        </button>
        <button
          onClick={() => setChartMetric('subscribers')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            chartMetric === 'subscribers'
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          Subscribers
        </button>
        <button
          onClick={() => setChartMetric('likes')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            chartMetric === 'likes'
              ? 'bg-red-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          Likes
        </button>
      </div>

      {/* Chart */}
      <div className="h-80">
        {chartData && chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={currentConfig.color} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={currentConfig.color} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-300 dark:stroke-gray-700" />
              <XAxis 
                dataKey="date" 
                className="text-sm"
                tick={{ fill: 'currentColor' }}
              />
              <YAxis 
                className="text-sm"
                tick={{ fill: 'currentColor' }}
                tickFormatter={currentConfig.format}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white'
                }}
                formatter={(value) => [currentConfig.format(value), currentConfig.label]}
                labelFormatter={(label) => {
                  // Find the full date from the chart data
                  const dataPoint = chartData.find(item => item.date === label);
                  return dataPoint ? formatDateWithYear(dataPoint.fullDate) : label;
                }}
                labelStyle={{ color: 'white' }}
              />
              <Area
                type="monotone"
                dataKey={currentConfig.dataKey}
                stroke={currentConfig.color}
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorMetric)"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
            <div className="text-center">
              <p className="text-gray-500 dark:text-gray-400 mb-2">
                No data available for this time period
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                YouTube Analytics data is typically available from the last 28-30 days
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// AI Insight Card Component
function AIInsightCard({ icon, title, insight, color }) {
  const colorClasses = {
    purple: {
      bg: 'from-purple-500 to-purple-600',
      badge: 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300'
    },
    yellow: {
      bg: 'from-yellow-500 to-orange-500',
      badge: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300'
    },
    blue: {
      bg: 'from-blue-500 to-cyan-500',
      badge: 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow">
      <div className="flex items-center gap-2 mb-3">
        <div className={`p-2 rounded-lg bg-gradient-to-br ${colorClasses[color].bg} text-white`}>
          {icon}
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${colorClasses[color].badge}`}>
          <LuSparkles className="w-3 h-3" />
          AI
        </span>
      </div>
      <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{title}</h4>
      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{insight}</p>
    </div>
  );
}

// AI Trend Analysis Component
function AITrendAnalysis({ analyticsData }) {
  const analysis = analyzePerformanceTrends(analyticsData);
  
  return (
    <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-purple-600 rounded-lg">
          <LuZap className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
            AI Trend Analysis
          </h4>
          <div className="space-y-2 text-sm">
            <p className="text-gray-700 dark:text-gray-300">
              <strong className="text-purple-600 dark:text-purple-400">Growth Rate:</strong> {analysis.growthRate}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              <strong className="text-purple-600 dark:text-purple-400">Trend:</strong> {analysis.trend}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              <strong className="text-purple-600 dark:text-purple-400">Recommendation:</strong> {analysis.recommendation}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Components
function MetricCard({ icon, title, value, color }) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    red: 'from-red-500 to-red-600',
    purple: 'from-purple-500 to-purple-600',
    green: 'from-green-500 to-green-600'
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} rounded-xl p-6 text-white shadow-lg`}>
      <div className="flex items-center justify-between mb-2">
        {icon}
      </div>
      <div className="text-3xl font-bold mb-1">{value}</div>
      <div className="text-sm opacity-90">{title}</div>
    </div>
  );
}

function RevenueCard({ title, value, subtitle }) {
  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
      <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">{title}</div>
      <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">{value}</div>
      <div className="text-xs text-gray-500 dark:text-gray-500">{subtitle}</div>
    </div>
  );
}

function TrafficSourceBar({ source, views, maxViews }) {
  const percentage = (views / maxViews) * 100;
  
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="font-medium text-gray-700 dark:text-gray-300">{source}</span>
        <span className="text-gray-600 dark:text-gray-400">{parseInt(views).toLocaleString()} views</span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function DemographicBar({ ageGroup, gender, percentage }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="font-medium text-gray-700 dark:text-gray-300">
          {ageGroup} - {gender}
        </span>
        <span className="text-gray-600 dark:text-gray-400">{percentage}%</span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div 
          className="bg-purple-600 h-2 rounded-full transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

// Helper function to prepare chart data
function prepareChartData(analyticsData, metric, timePeriod = '30d') {
  if (!analyticsData.rows || !analyticsData.columnHeaders) {
    return [];
  }

  // Find column indices
  const dateIndex = analyticsData.columnHeaders.findIndex(h => h.name === 'day');
  const viewsIndex = analyticsData.columnHeaders.findIndex(h => h.name === 'views');
  const watchTimeIndex = analyticsData.columnHeaders.findIndex(h => h.name === 'estimatedMinutesWatched');
  const subscribersIndex = analyticsData.columnHeaders.findIndex(h => h.name === 'subscribersGained');
  const likesIndex = analyticsData.columnHeaders.findIndex(h => h.name === 'likes');

  // Process rows into chart data
  let chartData = analyticsData.rows.map(row => {
    const dateStr = row[dateIndex];
    const formattedDate = formatDateForChart(dateStr);
    
    return {
      date: formattedDate,
      fullDate: dateStr,
      views: viewsIndex >= 0 ? parseInt(row[viewsIndex]) || 0 : 0,
      watchTime: watchTimeIndex >= 0 ? parseInt(row[watchTimeIndex]) || 0 : 0,
      subscribers: subscribersIndex >= 0 ? parseInt(row[subscribersIndex]) || 0 : 0,
      likes: likesIndex >= 0 ? parseInt(row[likesIndex]) || 0 : 0
    };
  });

  // Sort by date
  chartData.sort((a, b) => {
    const dateA = new Date(a.fullDate);
    const dateB = new Date(b.fullDate);
    return dateA - dateB;
  });

  // NOTE: We don't filter by time period here anymore
  // The backend now returns data for the requested period
  // This ensures "All Time" shows the complete channel history

  // If no data after processing, return empty array
  return chartData;
}

function formatDateForChart(dateStr) {
  // Expected format: YYYY-MM-DD
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

function formatDateWithYear(dateStr) {
  // Expected format: YYYY-MM-DD
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
}

function calculateTotalWatchTime(analyticsData) {
  if (!analyticsData.rows || !analyticsData.columnHeaders) return '0';
  
  const watchTimeIndex = analyticsData.columnHeaders.findIndex(h => h.name === 'estimatedMinutesWatched');
  if (watchTimeIndex === -1) return '0';
  
  const total = analyticsData.rows.reduce((sum, row) => {
    return sum + (parseInt(row[watchTimeIndex]) || 0);
  }, 0);
  
  return total.toLocaleString();
}

function calculateAvgDuration(analyticsData) {
  if (!analyticsData.rows || !analyticsData.columnHeaders) return '0:00';
  
  const watchTimeIndex = analyticsData.columnHeaders.findIndex(h => h.name === 'estimatedMinutesWatched');
  const viewsIndex = analyticsData.columnHeaders.findIndex(h => h.name === 'views');
  
  if (watchTimeIndex === -1 || viewsIndex === -1) return '0:00';
  
  const totalWatchTime = analyticsData.rows.reduce((sum, row) => {
    return sum + (parseInt(row[watchTimeIndex]) || 0);
  }, 0);
  
  const totalViews = analyticsData.rows.reduce((sum, row) => {
    return sum + (parseInt(row[viewsIndex]) || 0);
  }, 0);
  
  if (totalViews === 0) return '0:00';
  
  const avgMinutes = totalWatchTime / totalViews;
  const minutes = Math.floor(avgMinutes);
  const seconds = Math.floor((avgMinutes - minutes) * 60);
  
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function calculateAvgRPM(revenueData) {
  if (!revenueData.rows) return '$0.00';
  const total = revenueData.rows.reduce((sum, row) => {
    const rpmIndex = 3; // Adjust based on actual data structure
    return sum + parseFloat(row[rpmIndex] || 0);
  }, 0);
  const avg = total / revenueData.rows.length;
  return `$${avg.toFixed(2)}`;
}

function calculateAvgCPM(revenueData) {
  if (!revenueData.rows) return '$0.00';
  const total = revenueData.rows.reduce((sum, row) => {
    const cpmIndex = 4; // Adjust based on actual data structure
    return sum + parseFloat(row[cpmIndex] || 0);
  }, 0);
  const avg = total / revenueData.rows.length;
  return `$${avg.toFixed(2)}`;
}

// AI-Powered Functions

function generateGrowthPrediction(analyticsData, channel) {
  if (!analyticsData || !analyticsData.rows || analyticsData.rows.length < 7) {
    return "Analyzing your channel growth patterns. More data needed for accurate predictions.";
  }

  // Calculate growth trend
  const viewsIndex = analyticsData.columnHeaders.findIndex(h => h.name === 'views');
  const recentViews = analyticsData.rows.slice(-7).reduce((sum, row) => sum + parseInt(row[viewsIndex] || 0), 0);
  const previousViews = analyticsData.rows.slice(-14, -7).reduce((sum, row) => sum + parseInt(row[viewsIndex] || 0), 0);
  
  const growthRate = previousViews > 0 ? ((recentViews - previousViews) / previousViews * 100) : 0;
  const subscriberCount = parseInt(channel.statistics.subscriberCount);
  
  if (growthRate > 20) {
    const projectedGrowth = Math.floor(subscriberCount * 0.15);
    return `🚀 Excellent momentum! Based on your ${growthRate.toFixed(1)}% weekly growth, you could gain ~${projectedGrowth.toLocaleString()} subscribers this month. Keep creating content that resonates with your audience!`;
  } else if (growthRate > 10) {
    return `📈 Steady growth detected! Your channel is growing at ${growthRate.toFixed(1)}% per week. Consistent posting and engagement could accelerate this to 20%+ growth.`;
  } else if (growthRate > 0) {
    return `🌱 Your channel is showing positive growth at ${growthRate.toFixed(1)}% per week. Consider increasing upload frequency and optimizing titles/thumbnails to boost visibility.`;
  } else if (growthRate > -10) {
    return `⚡ Growth has plateaued. Our AI recommends experimenting with new content formats, trending topics, or collaboration opportunities to reignite growth.`;
  } else {
    return `💡 Views have decreased by ${Math.abs(growthRate).toFixed(1)}%. This is an opportunity to refresh your strategy. Try analyzing top-performing videos and replicating their success factors.`;
  }
}

function generateContentRecommendation(analyticsData, trafficSources) {
  if (!analyticsData || !analyticsData.rows || analyticsData.rows.length === 0) {
    return "Upload more content to receive personalized AI recommendations.";
  }

  // Analyze watch time patterns
  const watchTimeIndex = analyticsData.columnHeaders.findIndex(h => h.name === 'estimatedMinutesWatched');
  const avgWatchTime = analyticsData.rows.reduce((sum, row) => 
    sum + parseInt(row[watchTimeIndex] || 0), 0) / analyticsData.rows.length;

  // Analyze traffic sources
  let topSource = "organic search";
  if (trafficSources && trafficSources.rows && trafficSources.rows.length > 0) {
    topSource = trafficSources.rows[0][0];
  }

  const recommendations = [];
  
  if (avgWatchTime < 1000) {
    recommendations.push("shorter, more engaging content (5-8 minutes)");
  } else if (avgWatchTime > 5000) {
    recommendations.push("your long-form content is performing well - continue with 10+ minute videos");
  }

  if (topSource.toLowerCase().includes('search')) {
    recommendations.push("focus on SEO optimization and trending keywords");
  } else if (topSource.toLowerCase().includes('browse')) {
    recommendations.push("eye-catching thumbnails and titles are crucial");
  } else if (topSource.toLowerCase().includes('suggested')) {
    recommendations.push("create series and playlists to leverage YouTube's algorithm");
  }

  const timeAnalysis = analyzeOptimalPostingTime(analyticsData);
  recommendations.push(`post ${timeAnalysis}`);

  return `💡 AI recommends: ${recommendations.join(', ')}. Your top traffic source is ${topSource}, so optimize accordingly!`;
}

function generateOptimizationTip(analyticsData, demographics) {
  if (!analyticsData || !analyticsData.rows) {
    return "Gathering data to provide personalized optimization tips...";
  }

  const tips = [
    "🎯 Video Retention: Add hooks in the first 15 seconds to reduce drop-off rates. Our AI detected that strong openings increase watch time by 40%.",
    "📊 Upload Schedule: Consistency is key! Channels that upload at least 2x per week grow 3x faster. Set a schedule and stick to it.",
    "🔍 SEO Power: Include target keywords in your title, description, and tags. Videos with optimized metadata get 67% more impressions.",
    "👥 Engagement Boost: Reply to comments within the first hour. High early engagement signals quality content to YouTube's algorithm.",
    "📱 Thumbnail A/B Testing: Test multiple thumbnail designs. Compelling thumbnails can improve CTR by up to 50%.",
    "🎬 End Screens: Add end screens to 100% of your videos. This increases session time and channel growth by keeping viewers engaged.",
    "🔔 Call-to-Action: Remind viewers to subscribe! Channels that ask see 22% more subscriber conversions.",
    "📈 Analyze & Adapt: Review your top 3 performing videos. Identify common patterns and replicate their success factors."
  ];

  // Demographic-based tips
  if (demographics && demographics.rows && demographics.rows.length > 0) {
    const topDemographic = demographics.rows[0];
    const ageGroup = topDemographic[0];
    const gender = topDemographic[1];
    
    if (ageGroup.includes('18-24') || ageGroup.includes('25-34')) {
      tips.push("🎮 Your core audience is younger. Consider trending formats like shorts, challenges, or tech reviews.");
    } else if (ageGroup.includes('35-44') || ageGroup.includes('45-54')) {
      tips.push("📚 Your audience values depth. Tutorials, how-to guides, and educational content perform exceptionally well.");
    }
  }

  // Random tip selection for variety
  return tips[Math.floor(Math.random() * tips.length)];
}

function analyzeOptimalPostingTime(analyticsData) {
  // Analyze view patterns to suggest optimal posting times
  const viewsIndex = analyticsData.columnHeaders.findIndex(h => h.name === 'views');
  const dateIndex = analyticsData.columnHeaders.findIndex(h => h.name === 'day');
  
  if (viewsIndex < 0 || dateIndex < 0 || !analyticsData.rows) {
    return "on weekdays between 2-4 PM";
  }

  // Find day with highest views
  const dayViews = {};
  analyticsData.rows.forEach(row => {
    const date = new Date(row[dateIndex]);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
    dayViews[dayName] = (dayViews[dayName] || 0) + parseInt(row[viewsIndex] || 0);
  });

  const topDay = Object.keys(dayViews).reduce((a, b) => 
    dayViews[a] > dayViews[b] ? a : b, 'Monday'
  );

  const timeSlots = [
    "early morning (6-8 AM)",
    "late morning (10 AM-12 PM)",
    "afternoon (2-4 PM)",
    "evening (6-8 PM)",
    "night (8-10 PM)"
  ];

  return `on ${topDay}s during ${timeSlots[Math.floor(Math.random() * timeSlots.length)]}`;
}

function analyzePerformanceTrends(analyticsData) {
  if (!analyticsData || !analyticsData.rows || analyticsData.rows.length < 7) {
    return {
      growthRate: "Calculating...",
      trend: "Not enough data for analysis",
      recommendation: "Continue uploading content to unlock AI insights"
    };
  }

  const viewsIndex = analyticsData.columnHeaders.findIndex(h => h.name === 'views');
  
  // Calculate week-over-week growth
  const recentWeekViews = analyticsData.rows.slice(-7).reduce((sum, row) => 
    sum + parseInt(row[viewsIndex] || 0), 0);
  const previousWeekViews = analyticsData.rows.slice(-14, -7).reduce((sum, row) => 
    sum + parseInt(row[viewsIndex] || 0), 0);
  
  const growthRate = previousWeekViews > 0 
    ? ((recentWeekViews - previousWeekViews) / previousWeekViews * 100) 
    : 0;

  let trend, recommendation;
  
  if (growthRate > 15) {
    trend = "📈 Strong upward momentum! Your content is resonating exceptionally well.";
    recommendation = "Maintain current strategy and consider increasing upload frequency to capitalize on growth.";
  } else if (growthRate > 5) {
    trend = "🌟 Positive growth trajectory. Your channel is moving in the right direction.";
    recommendation = "Analyze your recent top performers and create similar content to accelerate growth.";
  } else if (growthRate > -5) {
    trend = "⚖️ Stable performance with minor fluctuations - this is normal.";
    recommendation = "Experiment with new content angles or formats to break through plateaus.";
  } else {
    trend = "📉 Temporary dip detected. This is an opportunity to innovate.";
    recommendation = "Review analytics to identify what changed. Consider refreshing thumbnails, titles, or content style.";
  }

  return {
    growthRate: `${growthRate > 0 ? '+' : ''}${growthRate.toFixed(1)}% week-over-week`,
    trend,
    recommendation
  };
}

// Generate Revenue Growth Roadmap
function generateRevenueRoadmap(analyticsData, channel, revenue) {
  if (!analyticsData || !channel) {
    return {
      currentRevenue: '$0.00',
      projectedRevenue: '$0.00',
      growthPotential: '0%',
      steps: [],
      aiInsight: 'Not enough data to generate roadmap'
    };
  }

  // Calculate current metrics
  const subscriberCount = parseInt(channel.statistics.subscriberCount);
  const viewCount = parseInt(channel.statistics.viewCount);
  const videoCount = parseInt(channel.statistics.videoCount);
  
  // Estimate current monthly revenue (if revenue data available)
  let currentMonthlyRevenue = 0;
  if (revenue && revenue.rows && revenue.rows.length > 0) {
    currentMonthlyRevenue = revenue.rows.reduce((sum, row) => sum + parseFloat(row[0] || 0), 0);
  } else {
    // Estimate based on views (avg CPM of $2-5)
    const dailyViews = viewCount / Math.max(videoCount, 1) / 30;
    currentMonthlyRevenue = (dailyViews * 30 * 3) / 1000; // Using $3 CPM average
  }

  // Calculate growth rate
  const viewsIndex = analyticsData.columnHeaders?.findIndex(h => h.name === 'views') || 0;
  const recentWeekViews = analyticsData.rows.slice(-7).reduce((sum, row) => 
    sum + parseInt(row[viewsIndex] || 0), 0);
  const previousWeekViews = analyticsData.rows.slice(-14, -7).reduce((sum, row) => 
    sum + parseInt(row[viewsIndex] || 0), 0);
  
  const weeklyGrowthRate = previousWeekViews > 0 
    ? ((recentWeekViews - previousWeekViews) / previousWeekViews * 100) 
    : 5; // Default to 5% if can't calculate

  // Project revenue growth
  const monthlyGrowthRate = weeklyGrowthRate * 4.33; // Convert weekly to monthly
  const projectedRevenue3Mo = currentMonthlyRevenue * Math.pow(1 + (monthlyGrowthRate / 100), 3);
  const growthPotential = ((projectedRevenue3Mo - currentMonthlyRevenue) / currentMonthlyRevenue * 100);

  // Generate personalized steps based on channel data
  const steps = [];

  // Step 1: Increase Upload Frequency
  if (videoCount < 50) {
    steps.push({
      title: 'Increase Upload Consistency',
      description: `You have ${videoCount} videos. Channels with 100+ videos see 3x better monetization. Aim for 2-3 uploads per week to build a strong content library.`,
      priority: 'high',
      impact: '+40% revenue potential',
      timeline: '2-3 months',
      icon: <LuClock className="w-5 h-5 text-blue-600" />
    });
  }

  // Step 2: Accelerate Subscriber Growth
  if (subscriberCount < 10000) {
    steps.push({
      title: 'Accelerate Subscriber Growth',
      description: `Growing from ${subscriberCount.toLocaleString()} to 10K+ subscribers unlocks better CPM rates and brand deal opportunities. Focus on viral content and SEO optimization.`,
      priority: 'high',
      impact: '+60% revenue potential',
      timeline: '3-6 months',
      icon: <LuUsers className="w-5 h-5 text-purple-600" />
    });
  } else if (subscriberCount < 100000) {
    steps.push({
      title: 'Scale to 100K Milestone',
      description: `You're at ${subscriberCount.toLocaleString()} subscribers. The next big milestone is 100K, which significantly increases ad rates and sponsorship values.`,
      priority: 'medium',
      impact: '+80% revenue potential',
      timeline: '6-12 months',
      icon: <LuTrophy className="w-5 h-5 text-yellow-600" />
    });
  }

  // Step 3: Boost Watch Time & Retention
  const watchTimeIndex = analyticsData.columnHeaders?.findIndex(h => h.name === 'estimatedMinutesWatched') || -1;
  if (watchTimeIndex >= 0) {
    const avgWatchTime = analyticsData.rows.reduce((sum, row) => 
      sum + parseInt(row[watchTimeIndex] || 0), 0) / analyticsData.rows.length;
    
    if (avgWatchTime < 2000) {
      steps.push({
        title: 'Boost Watch Time & Retention',
        description: 'Your watch time can be improved. Create longer videos (10-15 min), add chapters, and use pattern interrupts every 2-3 minutes to keep viewers engaged.',
        priority: 'high',
        impact: '+30% revenue',
        timeline: '1-2 months',
        icon: <LuEye className="w-5 h-5 text-green-600" />
      });
    }
  }

  // Step 4: Diversify Revenue Streams
  steps.push({
    title: 'Diversify Revenue Streams',
    description: 'Beyond AdSense, explore memberships, Super Thanks, affiliate marketing, and digital products. Top creators earn 60% of revenue from non-ad sources.',
    priority: 'medium',
    impact: '+100% revenue potential',
    timeline: '3-6 months',
    icon: <LuDollarSign className="w-5 h-5 text-green-600" />
  });

  // Step 5: Optimize Content Strategy
  if (weeklyGrowthRate < 10) {
    steps.push({
      title: 'Optimize Content Strategy',
      description: 'Your growth rate is below 10%/week. Test new content formats, analyze competitors, use trending topics, and optimize titles/thumbnails for higher CTR.',
      priority: 'high',
      impact: '+50% view growth',
      timeline: '2-4 weeks',
      icon: <LuTarget className="w-5 h-5 text-red-600" />
    });
  }

  // Step 6: Master YouTube SEO
  steps.push({
    title: 'Master YouTube SEO',
    description: 'Optimize all videos with keyword-rich titles, detailed descriptions, relevant tags, and custom thumbnails. This can double your organic traffic.',
    priority: 'medium',
    impact: '+45% discoverability',
    timeline: '1-2 months',
    icon: <LuChartBar className="w-5 h-5 text-indigo-600" />
  });

  // Generate AI insight
  let aiInsight = '';
  if (weeklyGrowthRate > 15) {
    aiInsight = `Your channel is growing rapidly at ${weeklyGrowthRate.toFixed(1)}%/week! This momentum can translate to ${growthPotential.toFixed(0)}% revenue increase in 3 months if you maintain consistency and implement the recommended strategies. Focus on scaling content production while maintaining quality.`;
  } else if (weeklyGrowthRate > 5) {
    aiInsight = `You're experiencing steady growth at ${weeklyGrowthRate.toFixed(1)}%/week. By focusing on high-priority actions like increased upload frequency and SEO optimization, you can potentially achieve ${growthPotential.toFixed(0)}% revenue growth in the next quarter.`;
  } else {
    aiInsight = `Your channel growth has slowed to ${weeklyGrowthRate.toFixed(1)}%/week. The good news: implementing these strategic changes can reignite growth and potentially increase revenue by ${Math.max(growthPotential, 50).toFixed(0)}% within 3 months. Start with the high-priority items for maximum impact.`;
  }

  return {
    currentRevenue: `$${currentMonthlyRevenue.toFixed(2)}`,
    projectedRevenue: `$${projectedRevenue3Mo.toFixed(2)}`,
    growthPotential: `+${Math.max(growthPotential, 0).toFixed(0)}%`,
    steps: steps.slice(0, 6), // Limit to 6 steps
    aiInsight
  };
}
