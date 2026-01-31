const nodemailer = require('nodemailer');

// Create transporter using Gmail
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  },
  tls: {
    rejectUnauthorized: false // Helps with some self-signed cert issues during dev
  },
  debug: true, // Show debug output
  logger: true // Log information to console
});

// Verify transporter connection
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Email service error:', error.message);
  } else {
    console.log('✅ Email service ready');
  }
});

/**
 * Send verification email to new users
 */
const sendVerificationEmail = async (email, username, verificationToken) => {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  const verificationLink = `${frontendUrl}/verify-email?token=${verificationToken}`;

  const mailOptions = {
    from: `"Govi Isuru" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: '🌾 Verify Your Govi Isuru Account',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f4f7f6; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
          .header { background: linear-gradient(135deg, #2e7d32 0%, #4caf50 100%); padding: 30px; text-align: center; }
          .header h1 { color: #ffffff; margin: 0; font-size: 28px; }
          .header p { color: #e8f5e9; margin: 10px 0 0 0; }
          .content { padding: 40px 30px; }
          .welcome { font-size: 18px; color: #333; margin-bottom: 20px; }
          .message { color: #666; line-height: 1.6; margin-bottom: 30px; }
          .button { display: inline-block; background: linear-gradient(135deg, #2e7d32 0%, #4caf50 100%); color: #ffffff !important; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; }
          .button:hover { background: linear-gradient(135deg, #1b5e20 0%, #388e3c 100%); }
          .link-box { background-color: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0; word-break: break-all; font-size: 12px; color: #666; }
          .footer { background-color: #f8f9fa; padding: 20px 30px; text-align: center; color: #999; font-size: 12px; }
          .expire-notice { color: #ff9800; font-size: 14px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🌾 Govi Isuru</h1>
            <p>Sri Lanka's Agricultural Marketplace</p>
          </div>
          <div class="content">
            <p class="welcome">Welcome, <strong>${username}</strong>! 👋</p>
            <p class="message">
              Thank you for registering with Govi Isuru. To complete your registration and start connecting with farmers and buyers across Sri Lanka, please verify your email address.
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationLink}" class="button">✅ Verify My Email</a>
            </div>
            <p class="message">Or copy and paste this link in your browser:</p>
            <div class="link-box">${verificationLink}</div>
            <p class="expire-notice">⏰ This link will expire in 24 hours.</p>
          </div>
          <div class="footer">
            <p>If you didn't create an account with Govi Isuru, you can safely ignore this email.</p>
            <p>© 2026 Govi Isuru - Empowering Sri Lankan Agriculture</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`📧 Verification email sent to ${email}`);
    return { success: true };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send password reset email
 */
const sendPasswordResetEmail = async (email, username, resetToken) => {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  const resetLink = `${frontendUrl}/reset-password?token=${resetToken}`;

  const mailOptions = {
    from: `"Govi Isuru" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: '🔐 Reset Your Govi Isuru Password',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f4f7f6; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
          .header { background: linear-gradient(135deg, #1976d2 0%, #42a5f5 100%); padding: 30px; text-align: center; }
          .header h1 { color: #ffffff; margin: 0; font-size: 28px; }
          .header p { color: #e3f2fd; margin: 10px 0 0 0; }
          .content { padding: 40px 30px; }
          .welcome { font-size: 18px; color: #333; margin-bottom: 20px; }
          .message { color: #666; line-height: 1.6; margin-bottom: 30px; }
          .button { display: inline-block; background: linear-gradient(135deg, #1976d2 0%, #42a5f5 100%); color: #ffffff !important; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; }
          .link-box { background-color: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0; word-break: break-all; font-size: 12px; color: #666; }
          .footer { background-color: #f8f9fa; padding: 20px 30px; text-align: center; color: #999; font-size: 12px; }
          .expire-notice { color: #ff9800; font-size: 14px; margin-top: 20px; }
          .warning { background-color: #fff3e0; border-left: 4px solid #ff9800; padding: 15px; margin: 20px 0; color: #e65100; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Password Reset</h1>
            <p>Govi Isuru Account Recovery</p>
          </div>
          <div class="content">
            <p class="welcome">Hello, <strong>${username}</strong>! 👋</p>
            <p class="message">
              We received a request to reset your password for your Govi Isuru account. Click the button below to create a new password.
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}" class="button">🔑 Reset Password</a>
            </div>
            <p class="message">Or copy and paste this link in your browser:</p>
            <div class="link-box">${resetLink}</div>
            <p class="expire-notice">⏰ This link will expire in 1 hour for security.</p>
            <div class="warning">
              <strong>⚠️ Security Notice:</strong> If you didn't request a password reset, please ignore this email. Your password will remain unchanged.
            </div>
          </div>
          <div class="footer">
            <p>This is an automated message from Govi Isuru.</p>
            <p>© 2026 Govi Isuru - Empowering Sri Lankan Agriculture</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`📧 Password reset email sent to ${email}`);
    return { success: true };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send password changed confirmation email
 */
const sendPasswordChangedEmail = async (email, username) => {
  const mailOptions = {
    from: `"Govi Isuru" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: '✅ Your Govi Isuru Password Was Changed',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f4f7f6; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
          .header { background: linear-gradient(135deg, #2e7d32 0%, #4caf50 100%); padding: 30px; text-align: center; }
          .header h1 { color: #ffffff; margin: 0; font-size: 28px; }
          .content { padding: 40px 30px; }
          .message { color: #666; line-height: 1.6; margin-bottom: 20px; }
          .success-box { background-color: #e8f5e9; border-left: 4px solid #4caf50; padding: 15px; margin: 20px 0; color: #2e7d32; }
          .warning { background-color: #ffebee; border-left: 4px solid #f44336; padding: 15px; margin: 20px 0; color: #c62828; }
          .footer { background-color: #f8f9fa; padding: 20px 30px; text-align: center; color: #999; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Password Changed</h1>
          </div>
          <div class="content">
            <p class="message">Hello <strong>${username}</strong>,</p>
            <div class="success-box">
              <strong>✅ Success!</strong> Your Govi Isuru password has been successfully changed.
            </div>
            <p class="message">
              You can now log in with your new password.
            </p>
            <div class="warning">
              <strong>⚠️ Wasn't you?</strong> If you didn't change your password, please contact support immediately as your account may be compromised.
            </div>
          </div>
          <div class="footer">
            <p>© 2026 Govi Isuru - Empowering Sri Lankan Agriculture</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendPasswordChangedEmail
};
