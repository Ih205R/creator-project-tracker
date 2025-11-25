'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { 
  LuCheck, LuExternalLink, LuRefreshCw, LuCrown,
  LuLink, LuInfo, LuSearch, LuChartBar, LuLock, LuLockOpen, LuTrendingUp
} from 'react-icons/lu';
import { FaYoutube, FaGoogle } from 'react-icons/fa';

export default function IntegrationsPage() {
  const { isPro, user, userProfile } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [youtubeConnection, setYoutubeConnection] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [selectedMode, setSelectedMode] = useState('public'); // 'public' or 'oauth'

  useEffect(() => {
    if (userProfile?.integrations?.youtube) {
      setYoutubeConnection(userProfile.integrations.youtube);
    }
  }, [userProfile]);

  const searchYouTubeChannels = async () => {
    if (!searchQuery.trim()) return;
    setSearching(true);
    setMessage({ type: '', text: '' });
    try {
      const token = await user.getIdToken();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/youtube/search?query=${encodeURIComponent(searchQuery)}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      if (!response.ok) throw new Error('Search failed');
      const data = await response.json();
      setSearchResults(data.channels || []);
      if (data.channels.length === 0) {
        setMessage({ type: 'info', text: 'No channels found. Try a different search term.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to search channels. Please try again.' });
    } finally {
      setSearching(false);
    }
  };

  const connectYouTubeChannel = async (channel) => {
    setConnecting(true);
    try {
      const token = await user.getIdToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/youtube/connect`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ channelId: channel.id, channelTitle: channel.title })
      });
      if (!response.ok) throw new Error('Connection failed');
      setMessage({ type: 'success', text: 'YouTube channel connected successfully!' });
      setTimeout(() => window.location.reload(), 1500);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to connect channel.' });
    } finally {
      setConnecting(false);
    }
  };

  const disconnectYouTube = async () => {
    if (!confirm('Disconnect YouTube channel?')) return;
    setConnecting(true);
    try {
      const token = await user.getIdToken();
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/youtube/disconnect`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setMessage({ type: 'success', text: 'YouTube channel disconnected.' });
      setTimeout(() => window.location.reload(), 1500);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to disconnect.' });
    } finally {
      setConnecting(false);
    }
  };

  const connectWithGoogle = async () => {
    setConnecting(true);
    setMessage({ type: '', text: '' });
    try {
      const token = await user.getIdToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/youtube/oauth/init`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('OAuth initialization failed');
      const data = await response.json();
      // Redirect to Google OAuth consent screen
      window.location.href = data.authUrl;
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to initialize Google Sign-In. Please try again.' });
      setConnecting(false);
    }
  };

  if (!isPro) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-2xl p-12 max-w-2xl mx-auto border border-purple-200 dark:border-purple-900">
          <div className="text-7xl mb-6">🔗</div>
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Platform Integrations - Pro Feature
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
            Upgrade to Pro to connect your social media platforms!
          </p>
          <Link href="/upgrade" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg">
            <LuCrown className="w-6 h-6" />
            Upgrade to Pro
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Platform Integrations</h1>
        <p className="text-gray-600 dark:text-gray-400">Connect your social media accounts to track analytics</p>
      </div>

      {message.text && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`rounded-lg p-4 ${
          message.type === 'success' ? 'bg-green-50 border-green-200 text-green-600' : 
          message.type === 'error' ? 'bg-red-50 border-red-200 text-red-600' : 'bg-blue-50 border-blue-200 text-blue-600'
        } border`}>
          {message.text}
        </motion.div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 text-white">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-white/20 rounded-lg">
              <FaYoutube className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">YouTube</h2>
              <p className="text-red-100">Connect your channel for analytics</p>
            </div>
            {youtubeConnection?.connected && (
              <span className="px-4 py-2 bg-green-500 rounded-lg flex items-center gap-2">
                <LuCheck className="w-5 h-5" /> Connected
              </span>
            )}
          </div>
        </div>

        <div className="p-6">
          {youtubeConnection?.connected ? (
            <div className="space-y-4">
              <div className="flex justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Connected Channel</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{youtubeConnection.channelTitle}</p>
                  {youtubeConnection.accessType && (
                    <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${
                      youtubeConnection.accessType === 'oauth' 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' 
                        : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                    }`}>
                      {youtubeConnection.accessType === 'oauth' ? '🔐 Full Access (OAuth)' : '🔓 Public Access'}
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <a href={`https://youtube.com/channel/${youtubeConnection.channelId}`} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-red-600 text-white rounded-lg flex items-center gap-2 hover:bg-red-700 transition-colors">
                    View <LuExternalLink className="w-4 h-4" />
                  </a>
                  <button onClick={disconnectYouTube} disabled={connecting} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                    Disconnect
                  </button>
                </div>
              </div>

              {/* Analytics Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link 
                  href="/dashboard/analytics"
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-2 border-blue-200 dark:border-blue-800 rounded-lg hover:border-blue-400 dark:hover:border-blue-600 transition-all group"
                >
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">View Analytics</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {youtubeConnection.accessType === 'oauth' 
                        ? 'Basic channel overview & stats' 
                        : 'Public metrics & statistics'}
                    </p>
                  </div>
                  <LuChartBar className="w-6 h-6 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
                </Link>

                {youtubeConnection.accessType === 'oauth' && (
                  <Link 
                    href="/dashboard/analytics/deep"
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-2 border-purple-200 dark:border-purple-800 rounded-lg hover:border-purple-400 dark:hover:border-purple-600 transition-all group"
                  >
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
                        View Deep Analytics
                        <span className="px-2 py-0.5 bg-purple-500 text-white text-[10px] rounded-full">OAuth</span>
                      </h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Revenue, retention, demographics & more
                      </p>
                    </div>
                    <LuTrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform" />
                  </Link>
                )}
              </div>

              {youtubeConnection.accessType === 'public' && (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <div className="flex items-start gap-3">
                    <LuInfo className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-blue-900 dark:text-blue-100 font-medium mb-2">
                        You're using Public Access - Limited Data
                      </p>
                      <p className="text-xs text-blue-700 dark:text-blue-300 mb-3">
                        Public access shows: channel name, subscriber count, total views, video list, engagement metrics, and upload frequency.
                      </p>
                      <button onClick={() => setSelectedMode('oauth')} className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline">
                        → Upgrade to Full Access for revenue, watch time, traffic sources, demographics & more
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Mode Selection */}
              <div className="grid md:grid-cols-2 gap-4">
                <button 
                  onClick={() => setSelectedMode('public')}
                  className={`p-6 rounded-xl border-2 transition-all text-left ${
                    selectedMode === 'public' 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`p-2 rounded-lg ${selectedMode === 'public' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>
                      <LuLockOpen className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 dark:text-white mb-1">Public Channel Search</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">No sign-in required</p>
                    </div>
                    {selectedMode === 'public' && <LuCheck className="w-6 h-6 text-blue-500" />}
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs text-gray-700 dark:text-gray-300 font-medium">Available Metrics:</p>
                    <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                      <li>✓ Channel name & subscriber count</li>
                      <li>✓ Total views & video list</li>
                      <li>✓ Engagement metrics</li>
                      <li>✓ Upload frequency</li>
                      <li>✓ Estimated statistics</li>
                    </ul>
                  </div>
                </button>

                <button 
                  onClick={() => setSelectedMode('oauth')}
                  className={`p-6 rounded-xl border-2 transition-all text-left ${
                    selectedMode === 'oauth' 
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`p-2 rounded-lg ${selectedMode === 'oauth' ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>
                      <LuLock className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 dark:text-white mb-1">Full Access with Google</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Your own channel only</p>
                    </div>
                    {selectedMode === 'oauth' && <LuCheck className="w-6 h-6 text-green-500" />}
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs text-gray-700 dark:text-gray-300 font-medium">Additional Metrics:</p>
                    <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                      <li>✓ Revenue data (RPM/CPM)</li>
                      <li>✓ Watch time & retention</li>
                      <li>✓ Traffic sources</li>
                      <li>✓ Search keywords</li>
                      <li>✓ Demographics & locations</li>
                      <li>✓ Monetization details</li>
                    </ul>
                  </div>
                </button>
              </div>

              {/* Connection Interface */}
              {selectedMode === 'public' ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <LuInfo className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <p className="text-sm text-blue-900 dark:text-blue-100">
                      Search for any public YouTube channel to view available analytics
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} 
                        onKeyPress={(e) => e.key === 'Enter' && searchYouTubeChannels()} 
                        placeholder="Enter channel name..." 
                        className="w-full px-4 py-3 pl-10 border rounded-lg dark:bg-gray-700 dark:border-gray-600" disabled={searching} />
                      <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                    <button onClick={searchYouTubeChannels} disabled={searching || !searchQuery.trim()} 
                      className="px-6 py-3 bg-red-600 text-white rounded-lg flex items-center gap-2 disabled:opacity-50 hover:bg-red-700 transition-colors">
                      {searching ? <><LuRefreshCw className="w-5 h-5 animate-spin" /> Searching...</> : <><LuSearch className="w-5 h-5" /> Search</>}
                    </button>
                  </div>

                  {searchResults.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Search Results:</p>
                      {searchResults.map((channel) => (
                        <div key={channel.id} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                          <img src={channel.thumbnail} alt={channel.title} className="w-12 h-12 rounded-full" />
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900 dark:text-white">{channel.title}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Public Access</p>
                          </div>
                          <button onClick={() => connectYouTubeChannel(channel)} disabled={connecting} 
                            className="px-4 py-2 bg-red-600 text-white rounded-lg flex items-center gap-2 hover:bg-red-700 transition-colors disabled:opacity-50">
                            <LuLink className="w-4 h-4" /> Connect
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <div className="flex items-start gap-3 mb-4">
                      <LuLock className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-green-900 dark:text-green-100 font-medium mb-2">
                          Connect Your YouTube Channel with Google Sign-In
                        </p>
                        <p className="text-xs text-green-700 dark:text-green-300">
                          Securely connect your YouTube channel using Google OAuth to access detailed analytics including revenue, watch time, traffic sources, and more. You'll only see data for channels you own.
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={connectWithGoogle}
                      disabled={connecting}
                      className="w-full px-6 py-3 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg flex items-center justify-center gap-3 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                    >
                      {connecting ? (
                        <>
                          <LuRefreshCw className="w-5 h-5 animate-spin" />
                          Connecting...
                        </>
                      ) : (
                        <>
                          <FaGoogle className="w-5 h-5 text-red-600" />
                          Sign in with Google
                        </>
                      )}
                    </button>
                  </div>

                  <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                      <strong>What happens next?</strong>
                    </p>
                    <ol className="text-xs text-gray-600 dark:text-gray-400 space-y-1 list-decimal list-inside">
                      <li>You'll be redirected to Google to sign in</li>
                      <li>Grant permission to access YouTube Analytics</li>
                      <li>We'll connect your channel automatically</li>
                      <li>Access full analytics on your Dashboard</li>
                    </ol>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
