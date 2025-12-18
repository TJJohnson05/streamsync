// backend/routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const User = require('../models/User');
const auth = require('../middleware/authMiddleware');

const { sendVerifyEmail } = require('../utils/mailer');
const { logToVM4 } = require('../utils/logger');

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

// --------------------
// REGISTER (requires email verification)
// --------------------
router.post('/register', async (req, res) => {
  try {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) {
      return res.status(400).json({ message: 'Username or email already used' });
    }

    const hashed = await bcrypt.hash(password, 10);

    // Create user as unverified
    const user = new User({
      email,
      username,
      password: hashed,
      emailVerified: false,
    });

    // Create verification token (send raw token, store hash)
    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');

    user.emailVerifyTokenHash = tokenHash;
    user.emailVerifyTokenExpires = new Date(Date.now() + 1000 * 60 * 30); // 30 min

    await user.save();

    // Verify link goes to FRONTEND page that calls backend verify endpoint
    const frontendBase = process.env.FRONTEND_URL || 'http://localhost:3000';
    const verifyUrl = `${frontendBase}/verify-email?token=${rawToken}&email=${encodeURIComponent(
      user.email
    )}`;

    await fetch('http://192.168.10.10:5050/internal/send-verify-email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'X-INTERNAL-KEY': process.env.INTERNAL_KEY },
  body: JSON.stringify({ toEmail: user.email, verifyUrl })
});


    logToVM4(`Verification email sent: email=${user.email}, username=${user.username}`);

    // ✅ No token returned yet (registration not complete until verified)
    return res.status(201).json({
      message: 'Registration started. Please verify your email to complete registration.',
    });
  } catch (err) {
    console.error(err);
    logToVM4(`Register error: ${err.message}`);
    return res.status(500).json({ message: 'Server error' });
  }
});
// --------------------
// RESEND VERIFY EMAIL
// --------------------
router.post('/resend-verification', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) return res.status(400).json({ message: "Missing email" });

    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal whether an email exists (optional security)
      return res.json({ message: "If that email exists, a verification link was sent." });
    }

    if (user.emailVerified) {
      return res.status(400).json({ message: "Email is already verified. Please log in." });
    }

    // Create new verification token (send raw token, store hash)
    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

    user.emailVerifyTokenHash = tokenHash;
    user.emailVerifyTokenExpires = new Date(Date.now() + 1000 * 60 * 30); // 30 min
    await user.save();

    const frontendBase = process.env.FRONTEND_URL || "http://localhost:3000";
    const verifyUrl = `${frontendBase}/verify-email?token=${rawToken}&email=${encodeURIComponent(user.email)}`;

    // Send email through your FRONTEND email-gateway VM
    const body = JSON.stringify({
      toEmail: user.email,
      verifyUrl,
    });

    const emailGatewayUrl = process.env.EMAIL_GATEWAY_URL || "http://192.168.10.10:5050/internal/send-verify-email";

    const resp = await fetch(emailGatewayUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-INTERNAL-KEY": process.env.INTERNAL_KEY,
      },
      body,
    });

    if (!resp.ok) {
      const t = await resp.text().catch(() => "");
      logToVM4(`Resend verification failed: status=${resp.status} body=${t}`);
      return res.status(500).json({ message: "Failed to send verification email" });
    }

    logToVM4(`Verification email resent: email=${user.email}`);
    return res.json({ message: "Verification email sent. Check your inbox." });
  } catch (err) {
    console.error(err);
    logToVM4(`Resend verification error: ${err.message}`);
    return res.status(500).json({ message: "Server error" });
  }
});


// --------------------
// VERIFY EMAIL
// --------------------
router.get('/verify-email', async (req, res) => {
  try {
    const { token, email } = req.query;

    if (!token || !email) {
      return res.status(400).json({ message: 'Missing token or email' });
    }

    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      email,
      emailVerifyTokenHash: tokenHash,
      emailVerifyTokenExpires: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired verification link' });
    }

    user.emailVerified = true;
    user.emailVerifyTokenHash = null;
    user.emailVerifyTokenExpires = null;

    await user.save();

    logToVM4(`Email verified: email=${email}, userId=${user._id}`);

    return res.json({ message: 'Email verified successfully. You can now log in.' });
  } catch (err) {
    console.error(err);
    logToVM4(`Verify email error: ${err.message}`);
    return res.status(500).json({ message: 'Server error' });
  }
});

// --------------------
// RESEND VERIFY EMAIL
// --------------------
router.post('/resend-verification', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) return res.status(400).json({ message: "Missing email" });

    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal whether an email exists (optional security)
      return res.json({ message: "If that email exists, a verification link was sent." });
    }

    if (user.emailVerified) {
      return res.status(400).json({ message: "Email is already verified. Please log in." });
    }

    // Create new verification token (send raw token, store hash)
    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

    user.emailVerifyTokenHash = tokenHash;
    user.emailVerifyTokenExpires = new Date(Date.now() + 1000 * 60 * 30); // 30 min
    await user.save();

    const frontendBase = process.env.FRONTEND_URL || "http://localhost:3000";
    const verifyUrl = `${frontendBase}/verify-email?token=${rawToken}&email=${encodeURIComponent(user.email)}`;

    // Send email through your FRONTEND email-gateway VM
    const body = JSON.stringify({
      toEmail: user.email,
      verifyUrl,
    });

    const emailGatewayUrl = process.env.EMAIL_GATEWAY_URL || "http://192.168.10.10:5050/internal/send-verify-email";

    const resp = await fetch(emailGatewayUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-INTERNAL-KEY": process.env.INTERNAL_KEY,
      },
      body,
    });

    if (!resp.ok) {
      const t = await resp.text().catch(() => "");
      logToVM4(`Resend verification failed: status=${resp.status} body=${t}`);
      return res.status(500).json({ message: "Failed to send verification email" });
    }

    logToVM4(`Verification email resent: email=${user.email}`);
    return res.json({ message: "Verification email sent. Check your inbox." });
  } catch (err) {
    console.error(err);
    logToVM4(`Resend verification error: ${err.message}`);
    return res.status(500).json({ message: "Server error" });
  }
});


// --------------------
// LOGIN (blocked until verified)
// --------------------
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // ✅ Block login until email verification
    if (!user.emailVerified) {
      return res.status(403).json({ message: 'Please verify your email before logging in.' });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });

    logToVM4(`User login success: email=${email}`);

    return res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        quizCompleted: user.quizCompleted,
        interests: user.interests,
        emailVerified: user.emailVerified,
      },
    });
  } catch (err) {
    console.error(err);
    logToVM4(`Login error: ${err.message}`);
    return res.status(500).json({ message: 'Server error' });
  }
});

// --------------------
// PROTECTED: get current user
// --------------------
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.json({ user });
  } catch (err) {
    console.error('Error in /me:', err);
    logToVM4(`Auth /me error: ${err.message}`);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;




