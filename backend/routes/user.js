const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// @POST /api/user/watch  - Add to watch history
router.post('/watch', protect, async (req, res) => {
  try {
    const { videoId, title, thumbnail, channelTitle, category } = req.body;
    const user = await User.findById(req.user._id);

    const existingIndex = user.watchHistory.findIndex(v => v.videoId === videoId);
    if (existingIndex > -1) {
      user.watchHistory[existingIndex].watchedAt = new Date();
      user.watchHistory[existingIndex].watchCount += 1;
    } else {
      user.watchHistory.unshift({ videoId, title, thumbnail, channelTitle, category });
    }

    // Keep only last 100
    if (user.watchHistory.length > 100) {
      user.watchHistory = user.watchHistory.slice(0, 100);
    }

    await user.save();
    res.json({ message: 'Watch history updated' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @POST /api/user/like
router.post('/like', protect, async (req, res) => {
  try {
    const { videoId, title, thumbnail, channelTitle, category } = req.body;
    const user = await User.findById(req.user._id);

    const isLiked = user.likedVideos.some(v => v.videoId === videoId);
    if (isLiked) {
      user.likedVideos = user.likedVideos.filter(v => v.videoId !== videoId);
    } else {
      user.likedVideos.unshift({ videoId, title, thumbnail, channelTitle, category });
    }

    await user.save();
    res.json({ liked: !isLiked, message: !isLiked ? 'Video liked' : 'Video unliked' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @POST /api/user/save
router.post('/save', protect, async (req, res) => {
  try {
    const { videoId, title, thumbnail, channelTitle, category } = req.body;
    const user = await User.findById(req.user._id);

    const isSaved = user.savedVideos.some(v => v.videoId === videoId);
    if (isSaved) {
      user.savedVideos = user.savedVideos.filter(v => v.videoId !== videoId);
    } else {
      user.savedVideos.unshift({ videoId, title, thumbnail, channelTitle, category });
    }

    await user.save();
    res.json({ saved: !isSaved, message: !isSaved ? 'Video saved' : 'Video unsaved' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @GET /api/user/history
router.get('/history', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('watchHistory');
    res.json({ history: user.watchHistory });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @GET /api/user/liked
router.get('/liked', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('likedVideos');
    res.json({ liked: user.likedVideos });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @GET /api/user/saved
router.get('/saved', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('savedVideos');
    res.json({ saved: user.savedVideos });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @PUT /api/user/preferences
router.put('/preferences', protect, async (req, res) => {
  try {
    const { categories } = req.body;
    const user = await User.findById(req.user._id);
    user.preferences.categories = categories;
    await user.save();
    res.json({ preferences: user.preferences });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
