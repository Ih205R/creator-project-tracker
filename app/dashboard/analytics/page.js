'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { 
  LuTrendingUp, LuUsers, LuEye, LuVideo, LuCrown,
  LuRefreshCw, LuExternalLink, LuTriangleAlert
} from 'react-icons/lu';
import { FaYoutube } from 'react-icons/fa';

export default function AnalyticsPage() {
  const { isPro, user, userProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [channelStats, setChannelStats] = useState(null);
  const [recentVideos, setRecentVideos] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState('');

  const youtubeConnection = userProfile?.integrations?.youtube;
  const isConnected = youtubeConnection?.connected;
  const channelId = youtubeConnection?.channelId;

  useEffect(() => {
    if (isPro && isConnected && channelId) {
      fetchAnalyticsData();
    } else {
      setLoading(false);
    }
  }, [isPro, isConnected, channelId]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    setError('');
    try {
      const token = await user.getIdToken();
      
      // Fetch channel stats
      const statsResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/youtube/channel/${channelId}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      if (!statsResponse.ok) throw new Error('Failed to fetch channel stats');
      const statsData = await statsResponse.json();
      setChannelStats(statsData.channel);

      // Fetch recent videos
      const videosResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/youtube/channel/${channelId}/videos?maxResults=5`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      if (!videosResponse.ok) throw new Error('Failed to fetch videos');
      const videosData = await videosResponse.json();
      setRecentVideos(videosData.videos || []);

      // Fetch analytics
      const analyticsResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/youtube/channel/${channelId}/analytics`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      if (!analyticsResponse.ok) throw new Error('Failed to fetch analytics');
      const analyticsData = await analyticsResponse.json();
      setAnalytics(analyticsData.analytics);

    } catch (error) {
      console.error('Analytics error:', error);
      setError(error.message || 'Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  if (!isPro) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-2xl p-12 max-w-2xl mx-auto border border-purple-200 dark:border-purple-900">
          <div className="text-7xl mb-6">📊</div>
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Analytics Dashboard - Pro Feature
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
            Upgrade to Pro to unlock detailed analytics and insights!
          </p>
          <Link href="/upgrade" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg">
            <LuCrown className="w-6 h-6" />
            Upgrade to Pro
          </Link>
        </div>
      </motion.div>
    );
  }

  if (!isConnected) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 max-w-2xl mx-auto">
          <div className="text-6xl mb-6">
            <FaYoutube className="w-20 h-20 mx-auto text-red-600" />
          </div>
          <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
            Connect Your YouTube Channel
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
            Connect your YouTube channel to view detailed analytics and insights.
          </p>
          <Link href="/dashboard/integrations" className="inline-flex items-center gap-2 px-8 py-4 bg-red-600 text-white rounded-xl font-bold text-lg hover:bg-red-700 transition-all shadow-lg">
            <FaYoutube className="w-6 h-6" />
            Go to Integrations
          </Link>
        </div>
      </motion.div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <LuRefreshCw className="w-12 h-12 mx-auto mb-4 animate-spin text-purple-600" />
          <p className="text-gray-600 dark:text-gray-400">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
        <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl shadow-xl p-12 max-w-2xl mx-auto border border-red-200 dark:border-red-800">
          <LuTriangleAlert className="w-16 h-16 mx-auto mb-4 text-red-600" />
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
            Failed to Load Analytics
          </h2>
          <p className="text-red-600 dark:text-red-400 mb-8">{error}</p>
          <button onClick={fetchAnalyticsData} className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-all">
            <LuRefreshCw className="w-5 h-5" />
            Try Again
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Analytics Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Real-time insights from your YouTube channel</p>
        </div>
        <button onClick={fetchAnalyticsData} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all">
          <LuRefreshCw className="w-5 h-5" />
          Refresh
        </button>
      </div>

      {/* Channel Info */}
      {channelStats && (
        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center gap-4">
            <img src={channelStats.thumbnail} alt={channelStats.title} className="w-16 h-16 rounded-full border-4 border-white/30" />
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{channelStats.title}</h2>
              <p className="text-red-100 text-sm">{channelStats.customUrl || channelStats.id}</p>
            </div>
            <a href={`https://youtube.com/channel/${channelStats.id}`} target="_blank" rel="noopener noreferrer" 
              className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all">
              View Channel <LuExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}

      {/* Key Metrics */}
      {channelStats?.statistics && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div whileHover={{ scale: 1.02 }} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <LuUsers className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Subscribers</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {channelStats.statistics.subscriberCount.toLocaleString()}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <LuEye className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Views</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {channelStats.statistics.viewCount.toLocaleString()}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <LuVideo className="w-8 h-8 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Videos</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {channelStats.statistics.videoCount.toLocaleString()}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Analytics Overview */}
      {analytics && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <LuTrendingUp className="w-6 h-6 text-green-600" />
            Performance Metrics
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Avg Views/Video</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.avgViewsPerVideo.toLocaleString()}</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Avg Likes/Video</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.avgLikesPerVideo.toLocaleString()}</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Avg Comments/Video</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.avgCommentsPerVideo.toLocaleString()}</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Engagement Rate</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.engagementRate}%</p>
            </div>
          </div>
        </div>
      )}

      {/* Recent Videos */}
      {recentVideos.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <LuVideo className="w-6 h-6 text-red-600" />
            Recent Videos
          </h2>
          <div className="space-y-4">
            {recentVideos.map((video) => (
              <div key={video.id} className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <img src={video.thumbnail} alt={video.title} className="w-32 h-20 object-cover rounded-lg" />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{video.title}</h3>
                  <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <LuEye className="w-4 h-4" />
                      {video.statistics.viewCount.toLocaleString()} views
                    </span>
                    <span>👍 {video.statistics.likeCount.toLocaleString()}</span>
                    <span>💬 {video.statistics.commentCount.toLocaleString()}</span>
                  </div>
                </div>
                <a href={`https://youtube.com/watch?v=${video.id}`} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all">
                  Watch <LuExternalLink className="w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
