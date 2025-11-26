const OpenAI = require('openai');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generate an email for brand deal communications
 * @param {string} type - Type of email (negotiation, follow-up, payment-request, deliverable-submission)
 * @param {object} context - Context data for the email
 * @returns {Promise<object>} Generated email with subject and body
 */
async function generateBrandDealEmail(type, context) {
  const { brandName, dealName, dealValue, contactPerson, platforms, deliverables, customNotes } = context;

  const emailPrompts = {
    'negotiation': `Generate a professional negotiation email for a brand deal with ${brandName}. 
      Deal: ${dealName}
      Proposed Value: $${dealValue}
      Platforms: ${platforms?.join(', ') || 'Not specified'}
      ${customNotes ? `Additional notes: ${customNotes}` : ''}
      
      The email should be confident, professional, and highlight the creator's value proposition.`,

    'follow-up': `Generate a friendly follow-up email for a brand deal with ${brandName}.
      Deal: ${dealName}
      Contact: ${contactPerson || 'Brand Representative'}
      ${customNotes ? `Additional context: ${customNotes}` : ''}
      
      The email should be polite, remind them of the previous discussion, and express continued interest.`,

    'payment-request': `Generate a professional payment request email for a brand deal with ${brandName}.
      Deal: ${dealName}
      Amount Due: $${dealValue}
      ${customNotes ? `Payment details: ${customNotes}` : ''}
      
      The email should be professional, include payment details, and provide clear next steps.`,

    'deliverable-submission': `Generate a professional deliverable submission email for a brand deal with ${brandName}.
      Deal: ${dealName}
      Deliverables: ${deliverables || 'Content deliverables'}
      ${customNotes ? `Submission notes: ${customNotes}` : ''}
      
      The email should be professional, summarize what's being submitted, and request feedback/approval.`
  };

  const prompt = emailPrompts[type] || emailPrompts['follow-up'];

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a professional email writer for content creators. Generate concise, professional emails for brand partnerships. Return your response as JSON with "subject" and "body" fields.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      response_format: { type: 'json_object' },
      max_tokens: 500,
      temperature: 0.7,
    });

    const result = JSON.parse(response.choices[0].message.content);
    return {
      success: true,
      email: {
        subject: result.subject,
        body: result.body
      }
    };
  } catch (error) {
    console.error('Error generating email:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Analyze a contract for key terms and potential risks
 * @param {string} contractText - The contract text to analyze
 * @returns {Promise<object>} Analysis results
 */
async function analyzeContract(contractText) {
  if (!contractText || contractText.length < 100) {
    return {
      success: false,
      error: 'Contract text is too short to analyze'
    };
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a legal contract analyzer for content creators. Analyze brand deal contracts and identify:
            1. Key terms and conditions
            2. Payment terms
            3. Deliverables required
            4. Exclusivity clauses
            5. Potential risks or red flags
            6. Suggested improvements
            
            Return your analysis as JSON with the following fields:
            - summary (brief overview)
            - keyTerms (array of important terms)
            - paymentTerms (object with amount, schedule, conditions)
            - deliverables (array of required deliverables)
            - exclusivityClauses (any exclusivity requirements)
            - risks (array of potential issues with severity: low/medium/high)
            - suggestions (array of recommendations)`
        },
        {
          role: 'user',
          content: `Analyze this brand deal contract:\n\n${contractText.substring(0, 4000)}`
        }
      ],
      response_format: { type: 'json_object' },
      max_tokens: 1000,
      temperature: 0.3,
    });

    const result = JSON.parse(response.choices[0].message.content);
    return {
      success: true,
      analysis: result
    };
  } catch (error) {
    console.error('Error analyzing contract:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Generate pricing recommendations based on creator stats and deal details
 * @param {object} creatorStats - Creator's performance metrics
 * @param {object} dealDetails - Details of the brand deal
 * @returns {Promise<object>} Pricing recommendations
 */
async function generatePricingRecommendation(creatorStats, dealDetails) {
  const { followers, engagement, platform, niche, averageViews } = creatorStats;
  const { brandName, platforms, deliverables, campaignGoal } = dealDetails;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are an expert in influencer marketing pricing. Based on creator stats and campaign details, provide pricing recommendations. Return JSON with:
            - recommendedPrice (number)
            - priceRange (object with min and max)
            - breakdown (array of line items with description and price)
            - rationale (brief explanation)
            - negotiationTips (array of tips)`
        },
        {
          role: 'user',
          content: `Creator Stats:
            - Followers: ${followers || 'Unknown'}
            - Engagement Rate: ${engagement || 'Unknown'}
            - Platform: ${platform || 'Multiple'}
            - Niche: ${niche || 'General'}
            - Average Views: ${averageViews || 'Unknown'}
            
            Deal Details:
            - Brand: ${brandName}
            - Platforms: ${platforms?.join(', ') || 'Not specified'}
            - Deliverables: ${deliverables || 'Not specified'}
            - Campaign Goal: ${campaignGoal || 'Brand awareness'}`
        }
      ],
      response_format: { type: 'json_object' },
      max_tokens: 500,
      temperature: 0.5,
    });

    const result = JSON.parse(response.choices[0].message.content);
    return {
      success: true,
      recommendation: result
    };
  } catch (error) {
    console.error('Error generating pricing recommendation:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Generate insights for a brand deal
 * @param {object} deal - The brand deal data
 * @returns {Promise<object>} Generated insights
 */
async function generateDealInsights(deal) {
  const { brandName, dealName, amount, stage, deliverables, paymentDueDate, communications } = deal;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are an AI assistant for content creators managing brand deals. Analyze the deal and provide actionable insights. Return JSON with an array of insights, each with:
            - type (negotiation, pricing, deadline, follow-up, risk, general)
            - message (actionable insight)
            - priority (high, medium, low)`
        },
        {
          role: 'user',
          content: `Analyze this brand deal and provide insights:
            - Brand: ${brandName}
            - Deal: ${dealName}
            - Value: $${amount}
            - Stage: ${stage}
            - Deliverables: ${deliverables?.length || 0} items
            - Payment Due: ${paymentDueDate ? new Date(paymentDueDate).toLocaleDateString() : 'Not set'}
            - Communications: ${communications?.length || 0} messages`
        }
      ],
      response_format: { type: 'json_object' },
      max_tokens: 500,
      temperature: 0.6,
    });

    const result = JSON.parse(response.choices[0].message.content);
    return {
      success: true,
      insights: result.insights || []
    };
  } catch (error) {
    console.error('Error generating deal insights:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

module.exports = {
  generateBrandDealEmail,
  analyzeContract,
  generatePricingRecommendation,
  generateDealInsights
};
