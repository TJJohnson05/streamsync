// routes/streams.js
const express = require('express');
const router = express.Router();
const Stream = require('../models/Stream');
const auth = require('../middleware/authMiddleware');

// OPTIONAL: seed some example streams for dev/demo purposes
router.post('/seed', async (req, res) => {
  try {
    const sample = [
      {
        title: 'Chill Apex Ranked Grind',
        streamerName: 'TylerPlays',
        category: 'Apex Legends',
        thumbnailUrl: 'https://via.placeholder.com/320x180?text=Apex',
        isLive: true,
        tags: ['fps', 'ranked', 'competitive'],
        description: 'Road to Masters grind!'
      },
      {
        title: 'Cozy Factorio Factory Builds',
        streamerName: 'FactoryNerd',
        category: 'Factorio',
        thumbnailUrl: 'https://via.placeholder.com/320x180?text=Factorio',
        isLive: false,
        tags: ['chill', 'automation'],
        description: 'Mega-bus base, no spaghetti (probably).'
      }
    ];

    await Stream.deleteMany({});
    const docs = await Stream.insertMany(sample);
    res.json({ message: 'Seeded streams', streams: docs });
  } catch (err) {
    console.error('Seed error:', err);
    res.status(500).json({ message: 'Failed to seed streams' });
  }
});

// GET /api/streams/recommended
// Later you can filter by user preferences; for now: top by views or newest.
router.get('/recommended', auth, async (req, res) => {
  try {
    const streams = await Stream.find({})
      .sort({ views: -1, createdAt: -1 })
      .limit(20);

    res.json({ streams });
  } catch (err) {
    console.error('Recommended error:', err);
    res.status(500).json({ message: 'Failed to load recommended streams' });
  }
});

// GET /api/streams/search?q=...
router.get('/search', auth, async (req, res) => {
  try {
    const q = (req.query.q || '').trim();
    if (!q) {
      return res.json({ streams: [] });
    }

    const regex = new RegExp(q, 'i');
    const streams = await Stream.find({
      $or: [
        { title: regex },
        { streamerName: regex },
        { category: regex },
        { tags: regex }
      ]
    }).limit(30);

    res.json({ streams });
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ message: 'Failed to search streams' });
  }
});

// GET /api/streams/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const stream = await Stream.findById(req.params.id);
    if (!stream) return res.status(404).json({ message: 'Stream not found' });

    // Optionally bump view count
    stream.views += 1;
    await stream.save();

    res.json({ stream });
  } catch (err) {
    console.error('Get stream error:', err);
    res.status(500).json({ message: 'Failed to load stream' });
  }
});

module.exports = router;
