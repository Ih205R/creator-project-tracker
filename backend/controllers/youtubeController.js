const axios = require('axios');
const User = require('../models/User');
const { google } = require('googleapis');

// Initialize OAuth2 client
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI || `${process.env.API_URL}/api/youtube/oauth/callback`
);

// OAuth2 scopes for YouTube Analytics
const SCOPES = [
  'https://www.googleapis.com/auth/youtube.readonly',
  'https://www.googleapis.com/auth/yt-analytics.readonly'
];

// Get YouTube channel statistics
exports.getChannelStats = async (req, res) => {
  try {
    const { channelId } = req.params;
    const apiKey = process.env.YOUTUBE_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: 'YouTube API key not configured' });
    }

    // Fetch channel statistics
    const channelResponse = await axios.get(
      `https://www.googleapis.com/youtube/v3/channels`,
      {
        params: {
          part: 'snippet,statistics,contentDetails',
          id: channelId,
          key: apiKey
        }
      }
    );

    if (!channelResponse.data.items || channelResponse.data.items.length === 0) {
      return res.status(404).json({ error: 'Channel not found' });
    }

    const channel = channelResponse.data.items[0];
    
    res.json({
      success: true,
      channel: {
        id: channel.id,
        title: channel.snippet.title,
        description: channel.snippet.description,
        thumbnail: channel.snippet.thumbnails.default.url,
        customUrl: channel.snippet.customUrl,
        publishedAt: channel.snippet.publishedAt,
        statistics: {
          subscriberCount: parseInt(channel.statistics.subscriberCount || 0),
          viewCount: parseInt(channel.statistics.viewCount || 0),
          videoCount: parseInt(channel.statistics.videoCount || 0)
        }
      }
    });
  } catch (error) {
    console.error('YouTube API error:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Failed to fetch channel data',
      details: error.response?.data?.error?.message || error.message 
    });
  }
};

// Get channel videos
exports.getChannelVideos = async (req, res) => {
  try {
    const { channelId } = req.params;
    const { maxResults = 10 } = req.query;
    const apiKey = process.env.YOUTUBE_API_KEY;

    // Get uploads playlist
    const channelResponse = await axios.get(
      `https://www.googleapis.com/youtube/v3/channels`,
      {
        params: {
          part: 'contentDetails',
          id: channelId,
          key: apiKey
        }
      }
    );

    const uploadsPlaylistId = channelResponse.data.items[0].contentDetails.relatedPlaylists.uploads;

    // Get videos from uploads playlist
    const videosResponse = await axios.get(
      `https://www.googleapis.com/youtube/v3/playlistItems`,
      {
        params: {
          part: 'snippet',
          playlistId: uploadsPlaylistId,
          maxResults: maxResults,
          key: apiKey
        }
      }
    );

    const videoIds = videosResponse.data.items.map(item => item.snippet.resourceId.videoId).join(',');

    // Get video statistics
    const statsResponse = await axios.get(
      `https://www.googleapis.com/youtube/v3/videos`,
      {
        params: {
          part: 'statistics,contentDetails',
          id: videoIds,
          key: apiKey
        }
      }
    );

    const videos = videosResponse.data.items.map((item, index) => {
      const stats = statsResponse.data.items[index].statistics;
      return {
        id: item.snippet.resourceId.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.default.url,
        publishedAt: item.snippet.publishedAt,
        statistics: {
          viewCount: parseInt(stats.viewCount || 0),
          likeCount: parseInt(stats.likeCount || 0),
          commentCount: parseInt(stats.commentCount || 0)
        }
      };
    });

    res.json({
      success: true,
      videos
    });
  } catch (error) {
    console.error('YouTube videos error:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Failed to fetch videos',
      details: error.response?.data?.error?.message || error.message 
    });
  }
};

// Get channel analytics (30-day data)
exports.getChannelAnalytics = async (req, res) => {
  try {
    const { channelId } = req.params;
    const apiKey = process.env.YOUTUBE_API_KEY;

    // Get channel stats
    const channelResponse = await axios.get(
      `https://www.googleapis.com/youtube/v3/channels`,
      {
        params: {
          part: 'statistics',
          id: channelId,
          key: apiKey
        }
      }
    );

    const stats = channelResponse.data.items[0].statistics;

    // Get recent videos for engagement metrics
    const videosResponse = await axios.get(
      `https://www.googleapis.com/youtube/v3/search`,
      {
        params: {
          part: 'id',
          channelId: channelId,
          maxResults: 50,
          order: 'date',
          type: 'video',
          key: apiKey
        }
      }
    );

    const videoIds = videosResponse.data.items.map(item => item.id.videoId).join(',');

    // Get video statistics
    const videoStatsResponse = await axios.get(
      `https://www.googleapis.com/youtube/v3/videos`,
      {
        params: {
          part: 'statistics',
          id: videoIds,
          key: apiKey
        }
      }
    );

    // Calculate averages
    const videos = videoStatsResponse.data.items;
    const totalViews = videos.reduce((sum, video) => sum + parseInt(video.statistics.viewCount || 0), 0);
    const totalLikes = videos.reduce((sum, video) => sum + parseInt(video.statistics.likeCount || 0), 0);
    const totalComments = videos.reduce((sum, video) => sum + parseInt(video.statistics.commentCount || 0), 0);

    res.json({
      success: true,
      analytics: {
        totalSubscribers: parseInt(stats.subscriberCount || 0),
        totalViews: parseInt(stats.viewCount || 0),
        totalVideos: parseInt(stats.videoCount || 0),
        recentVideos: videos.length,
        avgViewsPerVideo: videos.length > 0 ? Math.round(totalViews / videos.length) : 0,
        avgLikesPerVideo: videos.length > 0 ? Math.round(totalLikes / videos.length) : 0,
        avgCommentsPerVideo: videos.length > 0 ? Math.round(totalComments / videos.length) : 0,
        engagementRate: totalViews > 0 ? ((totalLikes + totalComments) / totalViews * 100).toFixed(2) : 0
      }
    });
  } catch (error) {
    console.error('YouTube analytics error:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Failed to fetch analytics',
      details: error.response?.data?.error?.message || error.message 
    });
  }
};

// Search for channel by name or username
exports.searchChannel = async (req, res) => {
  try {
    const { query } = req.query;
    const apiKey = process.env.YOUTUBE_API_KEY;

    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    // Search for channels
    const searchResponse = await axios.get(
      `https://www.googleapis.com/youtube/v3/search`,
      {
        params: {
          part: 'snippet',
          q: query,
          type: 'channel',
          maxResults: 10,
          key: apiKey
        }
      }
    );

    const channels = searchResponse.data.items.map(item => ({
      id: item.snippet.channelId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.default.url
    }));

    res.json({
      success: true,
      channels
    });
  } catch (error) {
    console.error('YouTube search error:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Failed to search channels',
      details: error.response?.data?.error?.message || error.message 
    });
  }
};

// Connect YouTube channel to user account
exports.connectChannel = async (req, res) => {
  try {
    const { channelId, channelTitle } = req.body;
    const userId = req.user.firebaseUid;

    const user = await User.findOne({ firebaseUid: userId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Initialize integrations if not exists
    if (!user.integrations) {
      user.integrations = {};
    }

    // Add YouTube integration (public mode)
    user.integrations.youtube = {
      connected: true,
      accessType: 'public',
      channelId,
      channelTitle,
      connectedAt: new Date(),
      lastSync: new Date()
    };

    await user.save();

    res.json({
      success: true,
      message: 'YouTube channel connected successfully',
      integration: user.integrations.youtube
    });
  } catch (error) {
    console.error('Connect channel error:', error);
    res.status(500).json({ 
      error: 'Failed to connect channel',
      details: error.message 
    });
  }
};

// Disconnect YouTube channel
exports.disconnectChannel = async (req, res) => {
  try {
    const userId = req.user.firebaseUid;

    const user = await User.findOne({ firebaseUid: userId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.integrations && user.integrations.youtube) {
      user.integrations.youtube.connected = false;
      user.integrations.youtube.disconnectedAt = new Date();
      await user.save();
    }

    res.json({
      success: true,
      message: 'YouTube channel disconnected successfully'
    });
  } catch (error) {
    console.error('Disconnect channel error:', error);
    res.status(500).json({ 
      error: 'Failed to disconnect channel',
      details: error.message 
    });
  }
};

// Initialize OAuth2 flow
exports.initOAuth = async (req, res) => {
  try {
    const userId = req.user.firebaseUid;
    
    // Generate auth URL with state parameter to identify user
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
      state: userId, // Pass user ID to callback
      prompt: 'consent'
    });

    res.json({
      success: true,
      authUrl
    });
  } catch (error) {
    console.error('OAuth init error:', error);
    res.status(500).json({ 
      error: 'Failed to initialize OAuth',
      details: error.message 
    });
  }
};

// Handle OAuth2 callback
exports.handleOAuthCallback = async (req, res) => {
  try {
    const { code, state } = req.query;
    const userId = state; // User ID from state parameter

    if (!code) {
      return res.redirect(`${process.env.FRONTEND_URL}/dashboard/integrations?error=oauth_failed`);
    }

    // Exchange code for tokens
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Get channel info
    const youtube = google.youtube({ version: 'v3', auth: oauth2Client });
    const channelResponse = await youtube.channels.list({
      part: 'snippet,statistics',
      mine: true
    });

    if (!channelResponse.data.items || channelResponse.data.items.length === 0) {
      return res.redirect(`${process.env.FRONTEND_URL}/dashboard/integrations?error=no_channel`);
    }

    const channel = channelResponse.data.items[0];

    // Save tokens and channel info to user
    const user = await User.findOne({ firebaseUid: userId });
    if (!user) {
      return res.redirect(`${process.env.FRONTEND_URL}/dashboard/integrations?error=user_not_found`);
    }

    if (!user.integrations) {
      user.integrations = {};
    }

    user.integrations.youtube = {
      connected: true,
      accessType: 'oauth',
      channelId: channel.id,
      channelTitle: channel.snippet.title,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      tokenExpiry: tokens.expiry_date,
      connectedAt: new Date(),
      lastSync: new Date()
    };

    await user.save();

    // Redirect to deep analytics page after successful connection
    res.redirect(`${process.env.FRONTEND_URL}/dashboard/analytics/deep?oauth=success`);
  } catch (error) {
    console.error('OAuth callback error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/dashboard/integrations?error=oauth_failed`);
  }
};

// Get authenticated channel analytics (OAuth required)
exports.getAuthenticatedAnalytics = async (req, res) => {
  try {
    const userId = req.user.firebaseUid;
    const user = await User.findOne({ firebaseUid: userId });

    if (!user || !user.integrations?.youtube?.accessToken) {
      return res.status(401).json({ error: 'YouTube account not connected' });
    }

    const integration = user.integrations.youtube;

    // Refresh token if needed
    if (integration.tokenExpiry && Date.now() >= integration.tokenExpiry) {
      oauth2Client.setCredentials({
        refresh_token: integration.refreshToken
      });
      const { credentials } = await oauth2Client.refreshAccessToken();
      integration.accessToken = credentials.access_token;
      integration.tokenExpiry = credentials.expiry_date;
      await user.save();
    }

    oauth2Client.setCredentials({
      access_token: integration.accessToken
    });

    const youtube = google.youtube({ version: 'v3', auth: oauth2Client });
    const youtubeAnalytics = google.youtubeAnalytics({ version: 'v2', auth: oauth2Client });

    // Get channel info
    const channelResponse = await youtube.channels.list({
      part: 'snippet,statistics,contentDetails',
      mine: true
    });

    const channel = channelResponse.data.items[0];

    // Get analytics data - support time period parameter
    const endDate = new Date().toISOString().split('T')[0];
    const { period } = req.query;
    
    let startDate;
    if (period === 'all') {
      // For "All Time", use channel creation date
      startDate = new Date(channel.snippet.publishedAt).toISOString().split('T')[0];
    } else if (period === '24h') {
      startDate = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    } else if (period === '7d') {
      startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    } else if (period === '90d') {
      startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    } else {
      // Default: 30 days
      startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    }

    const analyticsResponse = await youtubeAnalytics.reports.query({
      ids: `channel==${channel.id}`,
      startDate,
      endDate,
      metrics: 'views,estimatedMinutesWatched,averageViewDuration,averageViewPercentage,subscribersGained,subscribersLost',
      dimensions: 'day'
    });

    // Get revenue data (if monetized)
    let revenueData = null;
    try {
      const revenueResponse = await youtubeAnalytics.reports.query({
        ids: `channel==${channel.id}`,
        startDate,
        endDate,
        metrics: 'estimatedRevenue,estimatedAdRevenue,estimatedRedPartnerRevenue,cpm,grossRevenue',
        dimensions: 'day'
      });
      revenueData = revenueResponse.data;
    } catch (error) {
      console.log('Revenue data not available (channel may not be monetized)');
    }

    // Get traffic sources
    const trafficResponse = await youtubeAnalytics.reports.query({
      ids: `channel==${channel.id}`,
      startDate,
      endDate,
      metrics: 'views',
      dimensions: 'insightTrafficSourceType',
      sort: '-views'
    });

    // Get demographics
    const demographicsResponse = await youtubeAnalytics.reports.query({
      ids: `channel==${channel.id}`,
      startDate,
      endDate,
      metrics: 'viewerPercentage',
      dimensions: 'ageGroup,gender',
      sort: '-viewerPercentage'
    });

    res.json({
      success: true,
      channel: {
        id: channel.id,
        title: channel.snippet.title,
        description: channel.snippet.description,
        thumbnail: channel.snippet.thumbnails.default.url,
        statistics: channel.statistics
      },
      analytics: analyticsResponse.data,
      revenue: revenueData,
      trafficSources: trafficResponse.data,
      demographics: demographicsResponse.data,
      period: { startDate, endDate }
    });
  } catch (error) {
    console.error('Authenticated analytics error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch analytics',
      details: error.message 
    });
  }
};

// OAuth2 callback endpoint
exports.oauth2Callback = async (req, res) => {
  try {
    const { code } = req.query;

    // Get access and refresh tokens
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Get user info
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    const userInfo = await oauth2.userinfo.get();

    // Find or create user in the database
    let user = await User.findOne({ googleId: userInfo.data.id });
    if (!user) {
      user = new User({
        googleId: userInfo.data.id,
        email: userInfo.data.email,
        name: userInfo.data.name,
        picture: userInfo.data.picture,
        integrations: {
          youtube: {
            connected: true,
            channelId: null,
            channelTitle: null,
            connectedAt: new Date(),
            lastSync: new Date()
          }
        }
      });
    } else {
      // Update existing user
      user.googleId = userInfo.data.id;
      user.email = userInfo.data.email;
      user.name = userInfo.data.name;
      user.picture = userInfo.data.picture;
      if (!user.integrations) {
        user.integrations = {};
      }
      if (!user.integrations.youtube) {
        user.integrations.youtube = {
          connected: true,
          channelId: null,
          channelTitle: null,
          connectedAt: new Date(),
          lastSync: new Date()
        };
      } else {
        user.integrations.youtube.connected = true;
        user.integrations.youtube.connectedAt = new Date();
      }
    }

    await user.save();

    res.json({
      success: true,
      message: 'YouTube channel connected successfully',
      user
    });
  } catch (error) {
    console.error('OAuth2 callback error:', error);
    res.status(500).json({ 
      error: 'Failed to connect YouTube channel',
      details: error.message 
    });
  }
};

// Generate OAuth2 URL for YouTube authentication
exports.getAuthUrl = (req, res) => {
  try {
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES.join(' '),
      prompt: 'consent'
    });

    res.json({
      success: true,
      authUrl
    });
  } catch (error) {
    console.error('Generate auth URL error:', error);
    res.status(500).json({ 
      error: 'Failed to generate auth URL',
      details: error.message 
    });
  }
};
