const sgMail = require('@sendgrid/mail');

// Configure SendGrid with API key
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  console.log('✅ SendGrid configured successfully');
} else {
  console.warn('⚠️  SENDGRID_API_KEY not found in environment variables');
}

// Send welcome email using SendGrid
const sendWelcomeEmail = async (userEmail, userName) => {
  try {
    console.log(`📧 Sending welcome email to: ${userEmail}`);
    
    // Prepare email data
    const msg = {
      to: userEmail,
      from: {
        email: process.env.EMAIL_FROM || 'ihorr30@gmail.com',
        name: process.env.NEXT_PUBLIC_APP_NAME || 'Creator Project Tracker'
      },
      replyTo: process.env.EMAIL_REPLY_TO || 'romanenkoihor8@gmail.com',
      templateId: process.env.SENDGRID_TEMPLATE_ID || 'd-6c5cddcc70064a589794b7746f203299',
      dynamicTemplateData: {
        userName: userName || 'there',
        appName: process.env.NEXT_PUBLIC_APP_NAME || 'Creator Project Tracker',
        dashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard`,
        year: new Date().getFullYear(),
      },
    };

    // If no template ID, send with HTML content
    if (!process.env.SENDGRID_TEMPLATE_ID) {
      msg.subject = 'Welcome to Creator Project Tracker! 🎉';
      msg.html = generateWelcomeEmailHTML(userName);
      msg.text = generateWelcomeEmailText(userName);
      delete msg.templateId;
      delete msg.dynamicTemplateData;
    }

    // Send email via SendGrid
    const response = await sgMail.send(msg);
    
    console.log('✅ Welcome email sent successfully via SendGrid:', {
      to: userEmail,
      statusCode: response[0].statusCode,
      messageId: response[0].headers['x-message-id'],
    });
    
    return { 
      success: true, 
      messageId: response[0].headers['x-message-id'],
      provider: 'sendgrid'
    };
  } catch (error) {
    console.error('❌ Error sending welcome email via SendGrid:', error);
    
    if (error.response) {
      console.error('SendGrid API Error:', {
        statusCode: error.response.statusCode,
        body: error.response.body,
      });
    }
    
    // Don't throw error - we don't want signup to fail if email fails
    return { 
      success: false, 
      error: error.message,
      provider: 'sendgrid'
    };
  }
};

// Generate HTML email content (fallback if no template)
const generateWelcomeEmailHTML = (userName) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 20px auto;
          background: white;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 40px 20px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 700;
        }
        .content {
          padding: 40px 30px;
        }
        .content h2 {
          color: #667eea;
          margin-top: 0;
        }
        .features {
          background: #f8f9ff;
          border-left: 4px solid #667eea;
          padding: 20px;
          margin: 20px 0;
          border-radius: 5px;
        }
        .features ul {
          margin: 10px 0;
          padding-left: 20px;
        }
        .features li {
          margin: 8px 0;
        }
        .cta-button {
          display: inline-block;
          padding: 15px 30px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white !important;
          text-decoration: none;
          border-radius: 5px;
          font-weight: bold;
          margin: 20px 0;
        }
        .footer {
          background: #f8f9fa;
          padding: 20px;
          text-align: center;
          color: #666;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Welcome to Creator Project Tracker!</h1>
        </div>
        <div class="content">
          <h2>Hi ${userName || 'there'}! 👋</h2>
          <p>We're thrilled to have you join our community of creative professionals!</p>
          
          <p>You've just taken the first step toward better content management and project organization. Here's what you can do now:</p>
          
          <div class="features">
            <ul>
              <li><strong>📋 Track Projects:</strong> Organize all your content projects in one place</li>
              <li><strong>🤝 Manage Brand Deals:</strong> Keep track of partnerships and collaborations</li>
              <li><strong>📅 Schedule Content:</strong> Plan your content calendar efficiently</li>
              <li><strong>🤖 AI Tools:</strong> Generate captions and scripts with AI assistance</li>
              <li><strong>📊 Analytics:</strong> Monitor your content performance</li>
            </ul>
          </div>
          
          <p>Ready to get started? Log in to your dashboard and create your first project!</p>
          
          <center>
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard" class="cta-button">
              Go to Dashboard →
            </a>
          </center>
          
          <p style="margin-top: 30px;">Need help? Reply to this email with any questions.</p>
          
          <p style="margin-top: 30px; color: #666;">
            Happy creating! ✨<br>
            <strong>The Creator Project Tracker Team</strong>
          </p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Creator Project Tracker. All rights reserved.</p>
          <p>You're receiving this email because you signed up for an account.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Generate plain text email content (fallback if no template)
const generateWelcomeEmailText = (userName) => {
  return `
Welcome to Creator Project Tracker!

Hi ${userName || 'there'}!

We're thrilled to have you join our community of creative professionals!

You've just taken the first step toward better content management and project organization.

What you can do now:
- Track Projects: Organize all your content projects in one place
- Manage Brand Deals: Keep track of partnerships and collaborations
- Schedule Content: Plan your content calendar efficiently
- AI Tools: Generate captions and scripts with AI assistance
- Analytics: Monitor your content performance

Ready to get started? Log in to your dashboard and create your first project!

Visit: ${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard

Need help? Reply to this email with any questions.

Happy creating!
The Creator Project Tracker Team

© ${new Date().getFullYear()} Creator Project Tracker. All rights reserved.
  `;
};

// Send other types of emails (can be expanded)
const sendPasswordResetEmail = async (userEmail, resetLink) => {
  console.log('Password reset email would be sent to:', userEmail);
  // TODO: Implement with SendGrid template
};

const sendSubscriptionConfirmation = async (userEmail, plan) => {
  console.log('Subscription confirmation email would be sent to:', userEmail);
  // TODO: Implement with SendGrid template
};

module.exports = {
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendSubscriptionConfirmation,
};
