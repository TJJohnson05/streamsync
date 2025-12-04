// routes/favorites.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Stream = require('../models/Stream');
const auth = require('../middleware/authMiddleware');

// GET /api/favorites
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('favorites');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ favorites: user.favorites });
  } catch (err) {
    console.error('Favorites fetch error:', err);
    res.status(500).json({ message: 'Failed to load favorites' });
  }
});

// POST /api/favorites/:streamId  (add)
router.post('/:streamId', auth, async (req, res) => {
  try {
    const { streamId } = req.params;
    const stream = await Stream.findById(streamId);
    if (!stream) return res.status(404).json({ message: 'Stream not found' });

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const already = user.favorites.some(
      (favId) => favId.toString() === stream._id.toString()
    );
    if (!already) {
      user.favorites.push(stream._id);
      await user.save();
    }

    res.json({ message: 'Added to favorites', favorites: user.favorites });
  } catch (err) {
    console.error('Favorites add error:', err);
    res.status(500).json({ message: 'Failed to add favorite' });
  }
});

// DELETE /api/favorites/:streamId  (remove)
router.delete('/:streamId', auth, async (req, res) => {
  try {
    const { streamId } = req.params;
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.favorites = user.favorites.filter(
      (favId) => favId.toString() !== streamId
    );
    await user.save();

    res.json({ message: 'Removed from favorites', favorites: user.favorites });
  } catch (err) {
    console.error('Favorites remove error:', err);
    res.status(500).json({ message: 'Failed to remove favorite' });
  }
});

module.exports = router;
