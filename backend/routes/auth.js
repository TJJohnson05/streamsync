// routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth'); // ✅ make sure this matches filename
const { logToVM4 } = require('../server');  // ✅ ADD
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

// REGISTER
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
    const user = new User({ email, username, password: hashed });
    await user.save();

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });

    // ✅ AUTO LOG
    logToVM4(`User registered: email=${email}, username=${username}`);

    res.json({
      token,
      user: { id: user._id, email: user.email, username: user.username }
    });
  } catch (err) {
    console.error(err);
    logToVM4(`Register error: ${err.message}`); // ✅ AUTO LOG
    res.status(500).json({ message: 'Server error' });
  }
});

// LOGIN
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

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });

    // ✅ AUTO LOG
    logToVM4(`User login success: email=${email}`);

    res.json({
      token,
      user: { id: user._id, email: user.email, username: user.username }
    });
  } catch (err) {
    console.error(err);
    logToVM4(`Login error: ${err.message}`); // ✅ AUTO LOG
    res.status(500).json({ message: 'Server error' });
  }
});

// PROTECTED: get current user
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user });
  } catch (err) {
    console.error('Error in /me:', err);
    logToVM4(`Auth /me error: ${err.message}`); // ✅ AUTO LOG
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
