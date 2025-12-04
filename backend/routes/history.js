// routes/history.js
const express = require('express');
const router = express.Router();
const History = require('../models/History');
const Stream = require('../models/Stream');
const auth = require('../middleware/authMiddleware');

// GET /api/history
// Get the logged-in user's watch history, newest first
router.get('/', auth, async (req, res) => {
  try {
    const items = await History.find({ user: req.userId })
      .sort({ watchedAt: -1 })
      .limit(100)
      .populate('stream'); // gives full stream object

    res.json({ history: items });
  } catch (err) {
    console.error('History fetch error:', err);
    res.status(500).json({ message: 'Failed to load history' });
  }
});

// POST /api/history
// Body: { streamId }
router.post('/', auth, async (req, res) => {
  try {
    const { streamId } = req.body;
    if (!streamId) {
      return res.status(400).json({ message: 'streamId is required' });
    }

    const stream = await Stream.findById(streamId);
    if (!stream) {
      return res.status(404).json({ message: 'Stream not found' });
    }

    const historyItem = await History.create({
      user: req.userId,
      stream: stream._id
    });

    res.status(201).json({ historyItem });
  } catch (err) {
    console.error('History create error:', err);
    res.status(500).json({ message: 'Failed to save history' });
  }
});

// DELETE /api/history
// Clear the logged-in user's history
router.delete('/', auth, async (req, res) => {
  try {
    await History.deleteMany({ user: req.userId });
    res.json({ message: 'History cleared' });
  } catch (err) {
    console.error('History clear error:', err);
    res.status(500).json({ message: 'Failed to clear history' });
  }
});

module.exports = router;
