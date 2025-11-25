const nodemailer = require('nodemailer');

// Validate email configuration
const validateEmailConfig = () => {
  if (process.env.EMAIL_SERVICE === 'gmail') {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.error('❌ Gmail configuration missing! Check EMAIL_USER and EMAIL_PASSWORD in .env');
      console.error('📖 See FIX_EMAIL_ERROR.md for setup instructions');
      return false;
    }
    if (process.env.EMAIL_PASSWORD.length < 16) {
      console.error('⚠️  EMAIL_PASSWORD looks too short. Did you use App Password instead of regular password?');
      console.error('📖 Gmail requires 16-character App Password. See: https://myaccount.google.com/apppasswords');
      return false;
    }
  } else if (process.env.EMAIL_SERVICE === 'smtp') {
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.error('❌ SMTP configuration missing! Check SMTP_HOST, SMTP_USER, SMTP_PASS in .env');
      return false;
    }
  }
  return true;
};

// Create transporter
const createTransporter = () => {
  // For development, use Gmail or a test account
  // For production, use a service like SendGrid, AWS SES, or Mailgun
  
  if (process.env.EMAIL_SERVICE === 'gmail') {
    console.log('📧 Using Gmail service for emails');
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD, // Use App Password for Gmail
      },
    });
  }
  
  if (process.env.EMAIL_SERVICE === 'smtp') {
    console.log(`📧 Using custom SMTP: ${process.env.SMTP_HOST}`);
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  
  // Default to console logging if no email service configured
  console.warn('⚠️  No email service configured. Emails will be logged to console only.');
  console.warn('📖 See FIX_EMAIL_ERROR.md to setup email service');
  return null;
};

// Send welcome email to new users
const sendWelcomeEmail = async (userEmail, userName) => {
  try {
    // Validate configuration first
    if (!validateEmailConfig()) {
      console.log(`⚠️  Email configuration invalid. Would have sent welcome email to: ${userEmail}`);
      console.log(`📝 Subject: Welcome to Creator Project Tracker!`);
      console.log(`👤 Recipient: ${userName} (${userEmail})`);
      return { success: false, message: 'Email configuration invalid' };
    }

    const transporter = createTransporter();
    
    if (!transporter) {
      console.log(`📧 [DEMO MODE] Welcome email for ${userName} (${userEmail})`);
      return { success: false, message: 'No email service configured' };
    }

    const mailOptions = {
      from: `"${process.env.NEXT_PUBLIC_APP_NAME || 'Creator Project Tracker'}" <${process.env.EMAIL_FROM || 'noreply@creatortracker.com'}>`,
      to: userEmail,
      subject: 'Welcome to Creator Project Tracker! 🎉',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
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
              color: white;
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
            .emoji {
              font-size: 24px;
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
              
              <p style="margin-top: 30px;">Need help? Check out our <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/help" style="color: #667eea;">Help Center</a> or reply to this email with any questions.</p>
              
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
      `,
      text: `
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
        
        Need help? Check out our Help Center or reply to this email with any questions.
        
        Happy creating!
        The Creator Project Tracker Team
        
        © ${new Date().getFullYear()} Creator Project Tracker. All rights reserved.
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Welcome email sent successfully to: ${userEmail}`);
    console.log(`📧 Message ID: ${info.messageId}`);
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    console.error(`⚠️  Failed to send welcome email: ${error.message}`);
    
    // Provide helpful error messages
    if (error.code === 'EAUTH') {
      console.error('\n❌ Authentication failed!');
      console.error('📖 If using Gmail:');
      console.error('   1. Enable 2-Step Verification: https://myaccount.google.com/security');
      console.error('   2. Generate App Password: https://myaccount.google.com/apppasswords');
      console.error('   3. Use the 16-character App Password in .env file');
      console.error('\n📖 Or try Mailtrap for testing: See FIX_EMAIL_ERROR.md\n');
    } else if (error.code === 'ESOCKET') {
      console.error('\n❌ Connection failed!');
      console.error('📖 Check your SMTP_HOST and SMTP_PORT settings\n');
    }
    
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendWelcomeEmail
};
