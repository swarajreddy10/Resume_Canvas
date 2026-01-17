import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendResetEmail(email: string, resetToken: string) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${encodeURIComponent(resetToken)}`;

  console.log(`Sending email to: ${email}`);
  console.log(`Reset URL generated for email`);
  console.log(`NEXTAUTH_URL: ${process.env.NEXTAUTH_URL}`);

  const emailHtml = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Reset your password - ResumeCanvas</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
          
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #1f2937;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px 20px;
          }
          
          .container {
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 16px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
            overflow: hidden;
          }
          
          .header {
            background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
            padding: 40px 32px;
            text-align: center;
            position: relative;
          }
          
          .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="%23ffffff" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>') repeat;
          }
          
          .logo {
            position: relative;
            z-index: 1;
          }
          
          .logo-icon {
            display: inline-block;
            width: 48px;
            height: 48px;
            background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
            border-radius: 12px;
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            font-weight: 900;
            color: white;
            letter-spacing: -0.05em;
          }
          
          .logo-text {
            color: #ffffff;
            font-size: 32px;
            font-weight: 900;
            letter-spacing: -0.025em;
            margin: 0;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          
          .tagline {
            color: rgba(255, 255, 255, 0.8);
            font-size: 14px;
            font-weight: 500;
            margin-top: 8px;
          }
          
          .content {
            padding: 48px 32px;
          }
          
          .greeting {
            font-size: 24px;
            font-weight: 600;
            color: #111827;
            margin-bottom: 16px;
          }
          
          .message {
            font-size: 16px;
            color: #6b7280;
            margin-bottom: 32px;
            line-height: 1.7;
          }
          
          .cta-container {
            text-align: center;
            margin: 40px 0;
          }
          
          .cta-button {
            display: inline-block;
            background: #ffffff;
            color: #2563eb;
            text-decoration: none;
            padding: 16px 32px;
            border-radius: 12px;
            font-weight: 600;
            font-size: 16px;
            letter-spacing: -0.025em;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            border: 2px solid #2563eb;
            transition: all 0.2s ease;
          }
          
          .cta-button:hover {
            background: #f8fafc;
            transform: translateY(-1px);
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
          }
          
          .security-notice {
            background: #fef3c7;
            border: 1px solid #f59e0b;
            border-radius: 12px;
            padding: 20px;
            margin: 32px 0;
            display: flex;
            align-items: flex-start;
            gap: 12px;
          }
          
          .security-icon {
            color: #d97706;
            font-size: 20px;
            margin-top: 2px;
          }
          
          .security-text {
            flex: 1;
          }
          
          .security-title {
            font-weight: 600;
            color: #92400e;
            margin-bottom: 4px;
          }
          
          .security-desc {
            font-size: 14px;
            color: #a16207;
          }
          
          .help-section {
            background: #f8fafc;
            border-radius: 12px;
            padding: 24px;
            margin: 32px 0;
          }
          
          .help-title {
            font-weight: 600;
            color: #374151;
            margin-bottom: 12px;
          }
          
          .help-text {
            font-size: 14px;
            color: #6b7280;
            margin-bottom: 16px;
          }
          
          .help-link {
            color: #2563eb;
            text-decoration: none;
            font-weight: 500;
          }
          
          .footer {
            background: #f9fafb;
            padding: 32px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
          }
          
          .footer-text {
            font-size: 14px;
            color: #6b7280;
            margin-bottom: 16px;
          }
          
          .social-links {
            display: flex;
            justify-content: center;
            gap: 16px;
            margin-bottom: 16px;
          }
          
          .social-link {
            display: inline-block;
            width: 40px;
            height: 40px;
            background: #e5e7eb;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            text-decoration: none;
            color: #6b7280;
            transition: all 0.2s ease;
          }
          
          .social-link:hover {
            background: #2563eb;
            color: #ffffff;
          }
          
          .divider {
            height: 1px;
            background: linear-gradient(90deg, transparent, #e5e7eb, transparent);
            margin: 24px 0;
          }
          
          @media (max-width: 640px) {
            body {
              padding: 20px 10px;
            }
            
            .container {
              border-radius: 12px;
            }
            
            .header {
              padding: 32px 24px;
            }
            
            .content {
              padding: 32px 24px;
            }
            
            .footer {
              padding: 24px;
            }
            
            .cta-button {
              padding: 14px 28px;
              font-size: 15px;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">
              <h1 class="logo-text">ResumeCanvas</h1>
              <p class="tagline">Paint Your Professional Masterpiece</p>
            </div>
          </div>
          
          <div class="content">
            <h2 class="greeting">Reset Your Password</h2>
            <p class="message">
              We received a request to reset your password for your ResumeCanvas account. 
              Click the button below to create a new password and regain access to your professional resume builder.
            </p>
            
            <div class="cta-container">
              <a href="${resetUrl}" class="cta-button">
                Reset Password
              </a>
            </div>
            
            <div class="security-notice">
              <div class="security-icon">⚠️</div>
              <div class="security-text">
                <div class="security-title">Security Notice</div>
                <div class="security-desc">
                  This link expires in 15 minutes for your security. 
                  If you didn't request this reset, please ignore this email.
                </div>
              </div>
            </div>
            
            <div class="help-section">
              <div class="help-title">Need Help?</div>
              <p class="help-text">
                If you're having trouble clicking the button, copy and paste this URL into your browser:
              </p>
              <p style="word-break: break-all; font-size: 12px; color: #6b7280; background: #f3f4f6; padding: 12px; border-radius: 6px; font-family: monospace;">
                ${resetUrl}
              </p>
            </div>
          </div>
          
          <div class="footer">
            <p class="footer-text">
              This email was sent by ResumeCanvas. If you have any questions, 
              please contact our support team at <a href="mailto:support@resumecanvas.live" style="color: #2563eb; text-decoration: none;">support@resumecanvas.live</a>
            </p>
            
            <div class="divider"></div>
            
            <p style="font-size: 12px; color: #9ca3af;">
              © 2026 ResumeCanvas. All rights reserved.<br>
              Professional Resume Builder | AI-Powered ATS Optimization
            </p>
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    const { data, error } = await resend.emails.send({
      from: `${process.env.RESEND_FROM_NAME || 'ResumeCanvas'} <${process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'}>`,
      to: [email],
      subject: 'Reset your password - ResumeCanvas',
      html: emailHtml,
    });

    if (error) {
      console.error('Resend error:', error);
      throw new Error('Failed to send email');
    }

    console.log('Email sent successfully:', data);
  } catch (error) {
    console.error('Email send error:', error);
    throw error;
  }
}
