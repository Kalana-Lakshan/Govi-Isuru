const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const User = require('../models/User');
const Session = require('../models/Session');
const { sendVerificationEmail, sendPasswordResetEmail, sendPasswordChangedEmail } = require('../services/emailService');

// Helper function to generate tokens
const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { 
      id: user._id, 
      username: user.username, 
      role: user.role,
      district: user.district,
      dsDivision: user.dsDivision,
      gnDivision: user.gnDivision
    }, 
    process.env.JWT_SECRET || 'govi_secret', 
    { expiresIn: '15m' } // Short-lived access token
  );

  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.REFRESH_TOKEN_SECRET || 'govi_refresh_secret',
    { expiresIn: '30d' } // Long-lived refresh token
  );

  return { accessToken, refreshToken };
};

// Helper function to extract device info from request
const getDeviceInfo = (req) => {
  const userAgent = req.headers['user-agent'] || '';
  return {
    userAgent,
    ip: req.ip || req.connection?.remoteAddress || '',
    browser: userAgent.includes('Chrome') ? 'Chrome' : 
             userAgent.includes('Firefox') ? 'Firefox' : 
             userAgent.includes('Safari') ? 'Safari' : 
             userAgent.includes('Edge') ? 'Edge' : 'Unknown',
    os: userAgent.includes('Windows') ? 'Windows' :
        userAgent.includes('Mac') ? 'MacOS' :
        userAgent.includes('Linux') ? 'Linux' :
        userAgent.includes('Android') ? 'Android' :
        userAgent.includes('iOS') ? 'iOS' : 'Unknown'
  };
};

// Auth middleware for protected routes
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'govi_secret');
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = user;
    req.token = token;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired', code: 'TOKEN_EXPIRED' });
    }
    res.status(401).json({ error: 'Invalid token' });
  }
};

// ==========================================
// PASSWORD VALIDATION HELPER
// ==========================================
const validatePassword = (password) => {
  const errors = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character (!@#$%^&*(),.?":{}|<>)');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// ==========================================
// REGISTER - With Email Verification
// ==========================================
router.post('/register', async (req, res) => {
  try {
    const { 
      fullName,
      username, 
      email, 
      password,
      confirmPassword,
      district, 
      dsDivision, 
      gnDivision, 
      phone,
      role, 
      officerId, 
      department, 
      designation 
    } = req.body;

    // Validate required fields
    if (!fullName) {
      return res.status(400).json({ msg: "Full name is required" });
    }

    if (!username) {
      return res.status(400).json({ msg: "Username is required" });
    }

    if (!email) {
      return res.status(400).json({ msg: "Email is required" });
    }

    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({ 
        msg: "Password does not meet requirements",
        errors: passwordValidation.errors
      });
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ msg: "Passwords do not match" });
    }

    // Check if user exists by username or email
    let existingUser = await User.findOne({ 
      $or: [{ username }, { email: email.toLowerCase() }] 
    });
    
    if (existingUser) {
      if (existingUser.username === username) {
        return res.status(400).json({ msg: "Username already exists" });
      }
      return res.status(400).json({ msg: "Email already registered" });
    }

    // Validate officer ID if role is officer
    if (role === 'officer') {
      if (!officerId) {
        return res.status(400).json({ msg: "Officer ID is required for government officers" });
      }
      const existingOfficer = await User.findOne({ officerId });
      if (existingOfficer) {
        return res.status(400).json({ msg: "Officer ID already registered" });
      }
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create user
    const userData = {
      fullName,
      username,
      email: email.toLowerCase(),
      password: hashedPassword,
      district,
      dsDivision,
      gnDivision,
      phone: phone || '',
      role: role || 'farmer',
      isEmailVerified: false,
      verificationToken,
      verificationTokenExpires
    };

    // Add officer-specific fields if applicable
    if (role === 'officer') {
      userData.officerId = officerId;
      userData.department = department || null;
      userData.designation = designation || null;
    }

    const user = new User(userData);
    await user.save();

    // Send verification email (using fullName for greeting)
    const emailResult = await sendVerificationEmail(email, fullName, verificationToken);
    
    if (!emailResult.success) {
      console.error('Failed to send verification email:', emailResult.error);
    }

    res.status(201).json({ 
      success: true,
      msg: "Registration successful! Please check your email to verify your account.",
      emailSent: emailResult.success
    });

  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ msg: "Server Error" });
  }
});

// ==========================================
// VERIFY EMAIL
// ==========================================
router.get('/verify-email/:token', async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ 
        msg: "Invalid or expired verification link. Please request a new one." 
      });
    }

    // Update user as verified
    user.isEmailVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    res.json({ 
      success: true,
      msg: "Email verified successfully! You can now log in." 
    });

  } catch (err) {
    console.error('Email verification error:', err);
    res.status(500).json({ msg: "Server Error" });
  }
});

// ==========================================
// RESEND VERIFICATION EMAIL
// ==========================================
router.post('/resend-verification', async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      return res.status(404).json({ msg: "No account found with this email" });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ msg: "Email is already verified" });
    }

    // Generate new verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    user.verificationToken = verificationToken;
    user.verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await user.save();

    // Send new verification email (using fullName for greeting)
    const emailResult = await sendVerificationEmail(user.email, user.fullName || user.username, verificationToken);

    if (!emailResult.success) {
      return res.status(500).json({ msg: "Failed to send verification email. Please try again." });
    }

    res.json({ 
      success: true,
      msg: "Verification email sent! Please check your inbox." 
    });

  } catch (err) {
    console.error('Resend verification error:', err);
    res.status(500).json({ msg: "Server Error" });
  }
});

// ==========================================
// LOGIN - With Session Management
// ==========================================
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user by username or email
    const user = await User.findOne({
      $or: [
        { username },
        { email: username.toLowerCase() }
      ]
    });

    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      return res.status(403).json({ 
        msg: "Please verify your email before logging in",
        code: 'EMAIL_NOT_VERIFIED',
        email: user.email
      });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user);

    // Create session
    const session = new Session({
      userId: user._id,
      refreshToken,
      deviceInfo: getDeviceInfo(req)
    });
    await session.save();

    // Prepare user response
    const userResponse = { 
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      district: user.district, 
      dsDivision: user.dsDivision, 
      gnDivision: user.gnDivision,
      role: user.role || 'farmer'
    };

    // Include officer fields if user is an officer
    if (user.role === 'officer') {
      userResponse.officerId = user.officerId;
      userResponse.department = user.department;
      userResponse.designation = user.designation;
    }

    res.json({ 
      token: accessToken,  // For backward compatibility
      accessToken,
      refreshToken,
      user: userResponse,
      expiresIn: 900 // 15 minutes in seconds
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ msg: "Server Error" });
  }
});

// ==========================================
// REFRESH TOKEN
// ==========================================
router.post('/refresh-token', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ msg: "Refresh token required" });
    }

    // Verify refresh token
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET || 'govi_refresh_secret');
    } catch (err) {
      return res.status(401).json({ msg: "Invalid refresh token" });
    }

    // Check if session exists and is active
    const session = await Session.findOne({ 
      refreshToken, 
      userId: decoded.id,
      isActive: true 
    });

    if (!session) {
      return res.status(401).json({ msg: "Session expired. Please log in again." });
    }

    // Get user
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ msg: "User not found" });
    }

    // Generate new tokens
    const tokens = generateTokens(user);

    // Update session with new refresh token
    session.refreshToken = tokens.refreshToken;
    session.lastActivity = new Date();
    await session.save();

    res.json({
      token: tokens.accessToken,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresIn: 900
    });

  } catch (err) {
    console.error('Token refresh error:', err);
    res.status(500).json({ msg: "Server Error" });
  }
});

// ==========================================
// LOGOUT
// ==========================================
router.post('/logout', authMiddleware, async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      // Invalidate specific session
      await Session.findOneAndUpdate(
        { refreshToken, userId: req.user._id },
        { isActive: false }
      );
    }

    res.json({ success: true, msg: "Logged out successfully" });

  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({ msg: "Server Error" });
  }
});

// ==========================================
// LOGOUT ALL DEVICES
// ==========================================
router.post('/logout-all', authMiddleware, async (req, res) => {
  try {
    // Invalidate all sessions for this user
    await Session.updateMany(
      { userId: req.user._id },
      { isActive: false }
    );

    res.json({ success: true, msg: "Logged out from all devices" });

  } catch (err) {
    console.error('Logout all error:', err);
    res.status(500).json({ msg: "Server Error" });
  }
});

// ==========================================
// GET ACTIVE SESSIONS
// ==========================================
router.get('/sessions', authMiddleware, async (req, res) => {
  try {
    const sessions = await Session.find({ 
      userId: req.user._id, 
      isActive: true 
    }).select('deviceInfo lastActivity createdAt');

    res.json({ sessions });

  } catch (err) {
    console.error('Get sessions error:', err);
    res.status(500).json({ msg: "Server Error" });
  }
});

// ==========================================
// FORGOT PASSWORD - Request Reset
// ==========================================
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    
    // Always return success to prevent email enumeration
    if (!user) {
      return res.json({ 
        success: true,
        msg: "If an account exists with this email, you will receive a password reset link." 
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    // Send reset email (using fullName for greeting)
    const emailResult = await sendPasswordResetEmail(user.email, user.fullName || user.username, resetToken);

    res.json({ 
      success: true,
      msg: "If an account exists with this email, you will receive a password reset link."
    });

  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ msg: "Server Error" });
  }
});

// ==========================================
// RESET PASSWORD
// ==========================================
router.post('/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ msg: "Token and new password are required" });
    }

    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({ 
        msg: "Password does not meet requirements",
        errors: passwordValidation.errors
      });
    }

    // Hash the token to compare with stored hash
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ msg: "Invalid or expired reset link. Please request a new one." });
    }

    // Check if new password is same as old password
    const isSamePassword = await bcrypt.compare(password, user.password);
    if (isSamePassword) {
      return res.status(400).json({ msg: "New password cannot be the same as your old password" });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // Invalidate all existing sessions for security
    await Session.updateMany(
      { userId: user._id },
      { isActive: false }
    );

    // Send confirmation email
    await sendPasswordChangedEmail(user.email, user.username);

    res.json({ 
      success: true,
      msg: "Password reset successful! You can now log in with your new password." 
    });

  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ msg: "Server Error" });
  }
});

// ==========================================
// CHANGE PASSWORD (Logged in user)
// ==========================================
router.post('/change-password', authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ msg: "Current and new password are required" });
    }

    // Validate password strength
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      return res.status(400).json({ 
        msg: "Password does not meet requirements",
        errors: passwordValidation.errors
      });
    }

    const user = await User.findById(req.user._id);

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Current password is incorrect" });
    }

    // Check if new password is same as current password
    if (currentPassword === newPassword) {
      return res.status(400).json({ msg: "New password cannot be the same as your current password" });
    }

    // Hash and save new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    // Invalidate all other sessions
    const currentRefreshToken = req.body.refreshToken;
    await Session.updateMany(
      { 
        userId: user._id,
        refreshToken: { $ne: currentRefreshToken }
      },
      { isActive: false }
    );

    // Send confirmation email
    await sendPasswordChangedEmail(user.email, user.username);

    res.json({ 
      success: true,
      msg: "Password changed successfully" 
    });

  } catch (err) {
    console.error('Change password error:', err);
    res.status(500).json({ msg: "Server Error" });
  }
});

// ==========================================
// GET CURRENT USER PROFILE
// ==========================================
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password -verificationToken -passwordResetToken');
    
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json({ user });

  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ msg: "Server Error" });
  }
});


// ==========================================
// USER PROFILE GET/UPDATE
// ==========================================
router.get('/user/profile', authMiddleware, async (req, res) => {
  try {
    const user = req.user;
    res.json({
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      district: user.district,
      dsDivision: user.dsDivision,
      gnDivision: user.gnDivision,
      role: user.role
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

router.put('/user/profile', authMiddleware, async (req, res) => {
  try {
    const user = req.user;
    const { fullName } = req.body;
    if (!fullName || fullName.length < 2) {
      return res.status(400).json({ error: 'Full name is required' });
    }
    user.fullName = fullName;
    await user.save();
    res.json({ msg: 'Profile updated', fullName: user.fullName });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// ==========================================
// VALIDATE TOKEN (Check if token is valid)
// ==========================================
router.get('/validate', authMiddleware, async (req, res) => {
  try {
    res.json({ 
      valid: true,
      user: {
        username: req.user.username,
        email: req.user.email,
        role: req.user.role
      }
    });
  } catch (err) {
    res.status(401).json({ valid: false });
  }
});

module.exports = router;
