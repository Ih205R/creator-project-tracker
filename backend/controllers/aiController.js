const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Generate content captions
exports.generateCaptions = async (req, res) => {
  try {
    const { title, description, platform, tone = 'professional' } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const prompt = `Generate 3 engaging social media captions for a ${platform} post.
Title: ${title}
Description: ${description || 'N/A'}
Tone: ${tone}

Make them compelling, include relevant emojis, and optimize for ${platform}. Each caption should be distinct.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are a social media expert helping content creators write engaging captions."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 500
    });

    const captionsText = completion.choices[0].message.content;
    const captions = captionsText.split('\n\n').filter(c => c.trim().length > 0);

    res.json({ captions });
  } catch (error) {
    console.error('Generate captions error:', error);
    res.status(500).json({ error: 'Failed to generate captions' });
  }
};

// Generate single caption from prompt
exports.generateCaption = async (req, res) => {
  try {
    const { prompt, tone = 'casual', length = 'medium', platform = 'instagram' } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const lengthInstructions = {
      short: 'Keep it brief and punchy (1-2 sentences)',
      medium: 'Make it engaging with 2-4 sentences',
      long: 'Create a detailed, storytelling caption (5-8 sentences)'
    };

    const toneInstructions = {
      casual: 'Use a friendly, conversational tone',
      professional: 'Use a professional, polished tone',
      funny: 'Make it humorous and entertaining',
      inspiring: 'Create an inspiring and motivational message',
      educational: 'Make it informative and educational'
    };

    const platformGuidelines = {
      instagram: 'Include relevant emojis and hashtags, optimized for Instagram',
      tiktok: 'Keep it trendy and viral-worthy for TikTok',
      youtube: 'Make it descriptive and SEO-friendly for YouTube',
      twitter: 'Keep it concise for Twitter/X (under 280 characters if short)',
      linkedin: 'Make it professional and value-driven for LinkedIn'
    };

    const systemPrompt = `You are a social media expert. ${toneInstructions[tone] || toneInstructions.casual}. ${lengthInstructions[length] || lengthInstructions.medium}. ${platformGuidelines[platform] || platformGuidelines.instagram}.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: `Create an engaging ${platform} caption for: ${prompt}`
        }
      ],
      temperature: 0.8,
      max_tokens: length === 'long' ? 500 : length === 'short' ? 150 : 300
    });

    const caption = completion.choices[0].message.content.trim();

    res.json({ caption });
  } catch (error) {
    console.error('Generate caption error:', error);
    res.status(500).json({ error: 'Failed to generate caption' });
  }
};

// Generate video/content titles
exports.generateTitles = async (req, res) => {
  try {
    const { topic, platform, keywords = [] } = req.body;

    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    const prompt = `Generate 5 catchy, SEO-optimized titles for ${platform} content about: ${topic}
${keywords.length > 0 ? `Keywords to include: ${keywords.join(', ')}` : ''}

Make them attention-grabbing and optimized for ${platform}'s algorithm.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are a content strategist specializing in viral content titles."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.9,
      max_tokens: 400
    });

    const titlesText = completion.choices[0].message.content;
    const titles = titlesText.split('\n').filter(t => t.trim().length > 0)
      .map(t => t.replace(/^\d+\.\s*/, '').replace(/^["']|["']$/g, ''));

    res.json({ titles });
  } catch (error) {
    console.error('Generate titles error:', error);
    res.status(500).json({ error: 'Failed to generate titles' });
  }
};

// Generate video script
exports.generateScript = async (req, res) => {
  try {
    const { topic, tone = 'casual', length = 'medium' } = req.body;

    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    const lengthInstructions = {
      short: 'Create a concise 30-second to 1-minute script',
      medium: 'Create a detailed 2-5 minute script with clear sections',
      long: 'Create a comprehensive 5-10 minute script with in-depth content'
    };

    const toneInstructions = {
      casual: 'Use a friendly, conversational tone',
      professional: 'Use a professional, authoritative tone',
      funny: 'Make it humorous and entertaining',
      inspiring: 'Create an inspiring and motivational script',
      educational: 'Make it informative and educational with clear explanations',
      storytelling: 'Use a narrative, storytelling approach'
    };

    const systemPrompt = `You are a professional video script writer. ${toneInstructions[tone] || toneInstructions.casual}. ${lengthInstructions[length] || lengthInstructions.medium}. Structure the script with clear sections: Hook/Intro, Main Content, and Call-to-Action/Outro.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: `Write a video script about: ${topic}`
        }
      ],
      temperature: 0.7,
      max_tokens: length === 'long' ? 2000 : length === 'short' ? 600 : 1200
    });

    const script = completion.choices[0].message.content.trim();

    res.json({ script });
  } catch (error) {
    console.error('Generate script error:', error);
    res.status(500).json({ error: 'Failed to generate script' });
  }
};

// Generate all suggestions at once
exports.generateAllSuggestions = async (req, res) => {
  try {
    const { title, description, platform } = req.body;

    const [captionsResult, titlesResult, scriptResult] = await Promise.allSettled([
      openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [{
          role: "system",
          content: "Generate 3 engaging social media captions."
        }, {
          role: "user",
          content: `Captions for ${platform}: ${title}. ${description || ''}`
        }],
        temperature: 0.8,
        max_tokens: 300
      }),
      openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [{
          role: "system",
          content: "Generate 5 catchy titles."
        }, {
          role: "user",
          content: `Titles for ${platform}: ${title}`
        }],
        temperature: 0.9,
        max_tokens: 300
      }),
      openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [{
          role: "system",
          content: "Generate a brief script outline."
        }, {
          role: "user",
          content: `Script outline for ${platform}: ${title}. ${description || ''}`
        }],
        temperature: 0.7,
        max_tokens: 500
      })
    ]);

    const suggestions = {
      captions: captionsResult.status === 'fulfilled' 
        ? captionsResult.value.choices[0].message.content.split('\n\n').filter(c => c.trim())
        : [],
      titles: titlesResult.status === 'fulfilled'
        ? titlesResult.value.choices[0].message.content.split('\n').filter(t => t.trim())
        : [],
      script: scriptResult.status === 'fulfilled'
        ? scriptResult.value.choices[0].message.content
        : ''
    };

    res.json({ suggestions });
  } catch (error) {
    console.error('Generate all suggestions error:', error);
    res.status(500).json({ error: 'Failed to generate suggestions' });
  }
};

// Optimize content
exports.optimizeContent = async (req, res) => {
  try {
    const { content, platform, goal } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    const goalInstructions = {
      engagement: 'Optimize for maximum engagement (likes, comments, shares)',
      reach: 'Optimize for maximum reach and visibility',
      conversions: 'Optimize for conversions and calls-to-action',
      awareness: 'Optimize for brand awareness and memorability'
    };

    const prompt = `As a content optimization expert, improve this ${platform} content to ${goalInstructions[goal] || goalInstructions.engagement}:

Original content:
${content}

Provide:
1. Optimized version of the content
2. Key improvements made
3. Recommended hashtags (if applicable)
4. Posting time suggestions`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are a content optimization expert specializing in social media marketing."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 800
    });

    const optimized = completion.choices[0].message.content;
    res.json({ optimized });
  } catch (error) {
    console.error('Optimize content error:', error);
    res.status(500).json({ error: 'Failed to optimize content' });
  }
};

// Analyze trends
exports.analyzeTrends = async (req, res) => {
  try {
    const { niche, region } = req.body;

    if (!niche) {
      return res.status(400).json({ error: 'Niche is required' });
    }

    const prompt = `As a trend analysis expert, provide current trends and insights for the ${niche} niche in ${region}:

Provide:
1. Top 5 trending topics right now
2. Emerging content formats
3. Popular hashtags and keywords
4. Content ideas based on current trends
5. Best practices for this niche`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are a trend analysis expert with deep knowledge of social media and content marketing."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    const trends = completion.choices[0].message.content;
    res.json({ trends });
  } catch (error) {
    console.error('Analyze trends error:', error);
    res.status(500).json({ error: 'Failed to analyze trends' });
  }
};

// SEO recommendations
exports.seoRecommendations = async (req, res) => {
  try {
    const { title, description, keywords } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const prompt = `As an SEO expert, provide recommendations for this content:

Title: ${title}
Description: ${description || 'N/A'}
Keywords: ${keywords || 'N/A'}

Provide:
1. Optimized title (SEO-friendly)
2. Optimized meta description
3. Recommended keywords and tags
4. Content structure suggestions
5. Search intent analysis
6. Competitor analysis tips`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are an SEO expert specializing in content optimization and search visibility."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    const recommendations = completion.choices[0].message.content;
    res.json({ recommendations });
  } catch (error) {
    console.error('SEO recommendations error:', error);
    res.status(500).json({ error: 'Failed to generate SEO recommendations' });
  }
};
