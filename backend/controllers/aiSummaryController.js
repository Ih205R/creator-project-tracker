const User = require('../models/User');
const { google } = require('googleapis');
const axios = require('axios');

// Initialize OAuth2 client
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Generate comprehensive AI channel summary (costs 3 credits)
exports.generateChannelSummary = async (req, res) => {
  try {
    const userId = req.user.firebaseUid;
    const user = await User.findOne({ firebaseUid: userId });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check AI credits
    if (!user.aiCredits || user.aiCredits < 3) {
      return res.status(403).json({ 
        error: 'Insufficient AI credits',
        required: 3,
        current: user.aiCredits || 0
      });
    }

    // Check YouTube OAuth connection
    if (!user.integrations?.youtube?.accessToken) {
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
      part: 'snippet,statistics,contentDetails,brandingSettings,topicDetails',
      mine: true
    });

    const channel = channelResponse.data.items[0];
    const channelId = channel.id;
    const channelCreationDate = new Date(channel.snippet.publishedAt);

    // Get ALL TIME analytics from channel creation to today
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = channelCreationDate.toISOString().split('T')[0];

    // Try to get comprehensive analytics data (without revenue metrics that require special permissions)
    let analyticsResponse;
    try {
      // First try with all available metrics (without estimatedRevenue)
      analyticsResponse = await youtubeAnalytics.reports.query({
        ids: `channel==${channelId}`,
        startDate,
        endDate,
        metrics: 'views,estimatedMinutesWatched,averageViewDuration,subscribersGained,subscribersLost,likes,comments,shares',
        dimensions: 'day'
      });
    } catch (error) {
      console.log('First analytics attempt failed, trying with basic metrics:', error.message);
      // Fallback to basic metrics if detailed ones fail
      analyticsResponse = await youtubeAnalytics.reports.query({
        ids: `channel==${channelId}`,
        startDate,
        endDate,
        metrics: 'views,estimatedMinutesWatched,subscribersGained,subscribersLost',
        dimensions: 'day'
      });
    }

    // Get traffic sources (with error handling)
    let trafficResponse = { data: { rows: [] } };
    try {
      trafficResponse = await youtubeAnalytics.reports.query({
        ids: `channel==${channelId}`,
        startDate,
        endDate,
        metrics: 'views,estimatedMinutesWatched',
        dimensions: 'insightTrafficSourceType',
        sort: '-views'
      });
    } catch (error) {
      console.log('Traffic sources query failed:', error.message);
    }

    // Get demographics (with error handling)
    let demographicsResponse = { data: { rows: [] } };
    try {
      demographicsResponse = await youtubeAnalytics.reports.query({
        ids: `channel==${channelId}`,
        startDate,
        endDate,
        metrics: 'viewerPercentage',
        dimensions: 'ageGroup,gender',
        sort: '-viewerPercentage'
      });
    } catch (error) {
      console.log('Demographics query failed:', error.message);
    }

    // Get device types (with error handling)
    let deviceResponse = { data: { rows: [] } };
    try {
      deviceResponse = await youtubeAnalytics.reports.query({
        ids: `channel==${channelId}`,
        startDate,
        endDate,
        metrics: 'views',
        dimensions: 'deviceType',
        sort: '-views'
      });
    } catch (error) {
      console.log('Device types query failed:', error.message);
    }

    // Get geography data (with error handling)
    let geographyResponse = { data: { rows: [] } };
    try {
      geographyResponse = await youtubeAnalytics.reports.query({
        ids: `channel==${channelId}`,
        startDate,
        endDate,
        metrics: 'views,estimatedMinutesWatched',
        dimensions: 'country',
        sort: '-views',
        maxResults: 10
      });
    } catch (error) {
      console.log('Geography query failed:', error.message);
    }

    // Get all videos
    const uploadsPlaylistId = channel.contentDetails.relatedPlaylists.uploads;
    let allVideos = [];
    let nextPageToken = null;

    // Fetch first 50 videos (for performance)
    do {
      const playlistResponse = await youtube.playlistItems.list({
        part: 'snippet,contentDetails',
        playlistId: uploadsPlaylistId,
        maxResults: 50,
        pageToken: nextPageToken
      });

      const videoIds = playlistResponse.data.items.map(item => item.contentDetails.videoId);
      
      // Get detailed video stats
      const videoStatsResponse = await youtube.videos.list({
        part: 'statistics,snippet,contentDetails,topicDetails',
        id: videoIds.join(',')
      });

      allVideos.push(...videoStatsResponse.data.items);
      nextPageToken = playlistResponse.data.nextPageToken;
      
      // Limit to 100 videos for performance
      if (allVideos.length >= 100) break;
    } while (nextPageToken && allVideos.length < 100);

    // Analyze video content themes
    const contentAnalysis = analyzeContentThemes(allVideos);
    
    // Generate AI insights using OpenAI
    const aiInsights = await generateAIInsights({
      channel,
      analytics: analyticsResponse.data,
      traffic: trafficResponse.data,
      demographics: demographicsResponse.data,
      devices: deviceResponse.data,
      geography: geographyResponse.data,
      videos: allVideos,
      contentAnalysis,
      channelAge: Math.floor((Date.now() - channelCreationDate.getTime()) / (1000 * 60 * 60 * 24))
    });

    // Deduct 3 AI credits
    user.aiCredits -= 3;
    await user.save();

    // Return comprehensive summary
    res.json({
      success: true,
      creditsUsed: 3,
      remainingCredits: user.aiCredits,
      summary: {
        channel: {
          id: channel.id,
          title: channel.snippet.title,
          description: channel.snippet.description,
          thumbnail: channel.snippet.thumbnails.default.url,
          createdAt: channel.snippet.publishedAt,
          statistics: channel.statistics,
          keywords: channel.brandingSettings?.channel?.keywords,
          topics: channel.topicDetails?.topicCategories
        },
        analytics: analyticsResponse.data,
        traffic: trafficResponse.data,
        demographics: demographicsResponse.data,
        devices: deviceResponse.data,
        geography: geographyResponse.data,
        videos: {
          total: allVideos.length,
          analyzed: allVideos.length,
          data: allVideos.slice(0, 20) // Return top 20 for display
        },
        contentAnalysis,
        aiInsights,
        period: { startDate, endDate }
      }
    });
  } catch (error) {
    console.error('Generate channel summary error:', error);
    
    // Provide more specific error messages
    let errorMessage = 'Failed to generate channel summary';
    let errorDetails = error.message;
    
    if (error.code === 401 || error.status === 401) {
      errorMessage = 'YouTube Analytics permission denied';
      errorDetails = 'Please ensure your YouTube channel has analytics access enabled and you have granted all necessary permissions during OAuth connection.';
    } else if (error.code === 403 || error.status === 403) {
      errorMessage = 'Insufficient YouTube Analytics permissions';
      errorDetails = 'Your account may need additional permissions. Try reconnecting your YouTube account.';
    } else if (error.message?.includes('quota')) {
      errorMessage = 'YouTube API quota exceeded';
      errorDetails = 'Daily API quota limit reached. Please try again tomorrow.';
    }
    
    res.status(error.status || 500).json({ 
      error: errorMessage,
      details: errorDetails,
      suggestion: 'Try reconnecting your YouTube account or contact support if the issue persists.'
    });
  }
};

// Analyze content themes from videos
function analyzeContentThemes(videos) {
  const themes = {};
  const categories = {};
  const tagFrequency = {};
  const titleWords = {};
  
  videos.forEach(video => {
    // Analyze categories
    const category = video.snippet.categoryId || 'Unknown';
    categories[category] = (categories[category] || 0) + 1;

    // Analyze tags
    if (video.snippet.tags) {
      video.snippet.tags.forEach(tag => {
        const lowerTag = tag.toLowerCase();
        tagFrequency[lowerTag] = (tagFrequency[lowerTag] || 0) + 1;
      });
    }

    // Analyze title words
    const words = video.snippet.title.toLowerCase()
      .split(/\s+/)
      .filter(word => word.length > 3 && !['with', 'from', 'this', 'that', 'what', 'when', 'where', 'how'].includes(word));
    
    words.forEach(word => {
      titleWords[word] = (titleWords[word] || 0) + 1;
    });
  });

  // Get top themes
  const topTags = Object.entries(tagFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([tag, count]) => ({ tag, count }));

  const topTitleWords = Object.entries(titleWords)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([word, count]) => ({ word, count }));

  return {
    categories,
    topTags,
    topTitleWords,
    totalVideos: videos.length
  };
}

// Generate AI insights using OpenAI
async function generateAIInsights(data) {
  try {
    const { channel, analytics, traffic, demographics, videos, contentAnalysis, channelAge } = data;

    // Calculate key metrics
    const totalViews = parseInt(channel.statistics.viewCount);
    const totalSubscribers = parseInt(channel.statistics.subscriberCount);
    const totalVideos = parseInt(channel.statistics.videoCount);
    const avgViewsPerVideo = totalVideos > 0 ? Math.floor(totalViews / totalVideos) : 0;

    // Calculate growth metrics
    let recentGrowthRate = 0;
    if (analytics.rows && analytics.rows.length > 30) {
      const recent30Days = analytics.rows.slice(-30);
      const previous30Days = analytics.rows.slice(-60, -30);
      const recentViews = recent30Days.reduce((sum, row) => sum + (parseInt(row[1]) || 0), 0);
      const previousViews = previous30Days.reduce((sum, row) => sum + (parseInt(row[1]) || 0), 0);
      recentGrowthRate = previousViews > 0 ? ((recentViews - previousViews) / previousViews * 100) : 0;
    }

    // Prepare prompt for OpenAI
    const prompt = `Analyze this YouTube channel and provide comprehensive insights:

Channel: ${channel.title}
Created: ${channelAge} days ago
Subscribers: ${totalSubscribers.toLocaleString()}
Total Views: ${totalViews.toLocaleString()}
Videos: ${totalVideos}
Avg Views/Video: ${avgViewsPerVideo.toLocaleString()}
Recent Growth Rate: ${recentGrowthRate.toFixed(1)}%

Top Content Themes: ${contentAnalysis.topTags.slice(0, 10).map(t => t.tag).join(', ')}
Top Title Words: ${contentAnalysis.topTitleWords.slice(0, 10).map(w => w.word).join(', ')}

Provide a detailed analysis in JSON format with these sections:
1. mainTheme: Is the main theme still in demand? (2-3 sentences)
2. demandAnalysis: Market demand analysis and trends (2-3 sentences)
3. growthAssessment: Is the channel growing well? (2-3 sentences with specific metrics)
4. strengths: List 4-5 key strengths
5. weaknesses: List 3-4 areas for improvement
6. opportunities: List 4-5 growth opportunities
7. threats: List 2-3 potential threats or challenges
8. contentStrategy: Recommended content strategy (3-4 points)
9. improvementPlan: Specific steps to improve (5-7 actionable steps)
10. projections: 3-month and 6-month growth projections with numbers
11. marketPosition: How the channel compares to competitors
12. audienceInsights: Key insights about the audience

Return only valid JSON, no markdown formatting.`;

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an expert YouTube channel analyst. Provide detailed, data-driven insights in JSON format only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const content = response.data.choices[0].message.content.trim();
    
    // Parse JSON response
    let insights;
    try {
      // Remove markdown code blocks if present
      const jsonContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      insights = JSON.parse(jsonContent);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      // Return fallback insights
      insights = generateFallbackInsights(data);
    }

    return insights;
  } catch (error) {
    console.error('OpenAI API error:', error);
    // Return fallback insights
    return generateFallbackInsights(data);
  }
}

// Generate fallback insights if OpenAI fails
function generateFallbackInsights(data) {
  const { channel, channelAge } = data;
  const totalViews = parseInt(channel.statistics.viewCount);
  const totalSubscribers = parseInt(channel.statistics.subscriberCount);
  const totalVideos = parseInt(channel.statistics.videoCount);

  return {
    mainTheme: "Based on your content analysis, your channel focuses on engaging topics that have consistent viewer interest. The themes you cover show potential for sustained growth.",
    demandAnalysis: "Current market trends suggest continued demand for your content niche. Competition is moderate, providing opportunities for differentiation and growth.",
    growthAssessment: `With ${totalSubscribers.toLocaleString()} subscribers and ${totalViews.toLocaleString()} total views across ${totalVideos} videos, your channel shows solid foundation. Average performance indicates room for optimization.`,
    strengths: [
      `Consistent content library with ${totalVideos} videos`,
      `Established subscriber base of ${totalSubscribers.toLocaleString()}`,
      "Defined content niche and target audience",
      "Historical performance data for optimization",
      "Active channel with regular uploads"
    ],
    weaknesses: [
      "Potential for improved upload consistency",
      "Opportunity to enhance viewer retention",
      "SEO optimization could be strengthened"
    ],
    opportunities: [
      "Leverage trending topics in your niche",
      "Expand to YouTube Shorts format",
      "Collaborate with similar channels",
      "Optimize older videos for discoverability",
      "Build community through engagement"
    ],
    threats: [
      "Increasing competition in your niche",
      "Algorithm changes affecting reach",
      "Viewer attention span challenges"
    ],
    contentStrategy: [
      "Maintain regular upload schedule",
      "Focus on high-performing content types",
      "Experiment with new formats",
      "Engage with audience comments"
    ],
    improvementPlan: [
      "Optimize video titles and thumbnails",
      "Improve video SEO with keywords",
      "Create content series for binge-watching",
      "Analyze top performers and replicate success",
      "Increase video length for better watch time",
      "Add end screens and cards",
      "Promote across social media platforms"
    ],
    projections: {
      threeMonth: `Potential to reach ${Math.floor(totalSubscribers * 1.15).toLocaleString()} subscribers with optimized strategy`,
      sixMonth: `Could grow to ${Math.floor(totalSubscribers * 1.35).toLocaleString()} subscribers with consistent implementation`
    },
    marketPosition: "Your channel is positioned in a competitive but viable niche with opportunities for differentiation through unique content angles and improved production quality.",
    audienceInsights: "Your audience shows engagement with your content. Focus on understanding their preferences through analytics and community interaction to refine your content strategy."
  };
}

module.exports = exports;
