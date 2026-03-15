const express = require('express');
const router = express.Router();
const axios = require('axios');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const YT_API_BASE = 'https://www.googleapis.com/youtube/v3';

// Build smart query from user's most watched categories & liked videos
function buildSmartQuery(user) {
  const categoryCounts = {};
  
  user.watchHistory.forEach(v => {
    if (v.category) {
      categoryCounts[v.category] = (categoryCounts[v.category] || 0) + (v.watchCount || 1);
    }
  });

  user.likedVideos.forEach(v => {
    if (v.category) {
      categoryCounts[v.category] = (categoryCounts[v.category] || 0) + 3; // Likes weigh more
    }
  });

  const topCategory = Object.keys(categoryCounts).sort((a, b) => categoryCounts[b] - categoryCounts[a])[0];
  
  const categoryQueryMap = {
    movies: 'best movies 2024 trailer',
    gaming: 'best gaming videos 2024',
    education: 'top educational content',
    music: 'trending music 2024'
  };

  return categoryQueryMap[topCategory] || 'trending videos 2024';
}

// @GET /api/recommendations
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const smartQuery = buildSmartQuery(user);

    const params = {
      part: 'snippet',
      q: smartQuery,
      maxResults: 20,
      type: 'video',
      key: process.env.YOUTUBE_API_KEY,
      videoEmbeddable: true,
      order: 'relevance'
    };

    const response = await axios.get(`${YT_API_BASE}/search`, { params });
    
    const likedIds = new Set(user.likedVideos.map(v => v.videoId));
    const watchedIds = new Set(user.watchHistory.map(v => v.videoId));

    const videos = response.data.items?.map(item => ({
      videoId: item.id?.videoId,
      title: item.snippet?.title,
      description: item.snippet?.description,
      thumbnail: item.snippet?.thumbnails?.high?.url,
      channelTitle: item.snippet?.channelTitle,
      publishedAt: item.snippet?.publishedAt,
      isLiked: likedIds.has(item.id?.videoId),
      isWatched: watchedIds.has(item.id?.videoId)
    })).filter(v => v.videoId) || [];

    res.json({ videos, basedOn: smartQuery });
  } catch (error) {
    res.status(500).json({ message: 'Recommendations failed', error: error.message });
  }
});

module.exports = router;
