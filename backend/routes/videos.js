const express = require('express');
const router = express.Router();
const axios = require('axios');
const { protect } = require('../middleware/auth');

const YT_API_BASE = 'https://www.googleapis.com/youtube/v3';

const CATEGORY_QUERIES = {
  movies: ['bollywood movies trailer', 'hollywood movies 2024', 'web series hindi', 'netflix original'],
  gaming: ['gameplay 2024', 'gaming highlights', 'game walkthrough', 'esports', 'minecraft gaming'],
  education: ['programming tutorial', 'learn javascript', 'data science', 'study motivation', 'physics explained'],
  music: ['music video 2024', 'bollywood songs', 'lo-fi music', 'remix songs', 'new song']
};

// Fetch YouTube videos by query
async function fetchYouTubeVideos(query, maxResults = 10, pageToken = '') {
  const params = {
    part: 'snippet',
    q: query,
    maxResults,
    type: 'video',
    key: process.env.YOUTUBE_API_KEY,
    videoEmbeddable: true,
    safeSearch: 'moderate',
    ...(pageToken && { pageToken })
  };

  const response = await axios.get(`${YT_API_BASE}/search`, { params });
  return response.data;
}

// @GET /api/videos/feed  - Main Instagram-style feed
router.get('/feed', protect, async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const userCategories = req.user.preferences?.categories || ['movies', 'gaming', 'education', 'music'];

    // Pick random queries from user's preferred categories
    const queries = [];
    userCategories.forEach(cat => {
      const catQueries = CATEGORY_QUERIES[cat] || [];
      if (catQueries.length > 0) {
        queries.push(catQueries[Math.floor(Math.random() * catQueries.length)]);
      }
    });

    const videoPromises = queries.map(q => fetchYouTubeVideos(q, 5));
    const results = await Promise.allSettled(videoPromises);

    let allVideos = [];
    results.forEach((result, idx) => {
      if (result.status === 'fulfilled') {
        const category = userCategories[idx] || 'general';
        const videos = result.value.items?.map(item => ({
          videoId: item.id?.videoId,
          title: item.snippet?.title,
          description: item.snippet?.description,
          thumbnail: item.snippet?.thumbnails?.high?.url || item.snippet?.thumbnails?.medium?.url,
          channelTitle: item.snippet?.channelTitle,
          publishedAt: item.snippet?.publishedAt,
          category
        })).filter(v => v.videoId) || [];
        allVideos = [...allVideos, ...videos];
      }
    });

    // Shuffle for Instagram-style variety
    allVideos = allVideos.sort(() => Math.random() - 0.5);

    res.json({ videos: allVideos, page });
  } catch (error) {
    console.error('Feed error:', error.message);
    res.status(500).json({ message: 'Failed to fetch videos', error: error.message });
  }
});

// @GET /api/videos/search
router.get('/search', protect, async (req, res) => {
  try {
    const { q, maxResults = 12 } = req.query;
    if (!q) return res.status(400).json({ message: 'Query is required' });

    const data = await fetchYouTubeVideos(q, maxResults);
    const videos = data.items?.map(item => ({
      videoId: item.id?.videoId,
      title: item.snippet?.title,
      description: item.snippet?.description,
      thumbnail: item.snippet?.thumbnails?.high?.url,
      channelTitle: item.snippet?.channelTitle,
      publishedAt: item.snippet?.publishedAt
    })).filter(v => v.videoId) || [];

    res.json({ videos });
  } catch (error) {
    res.status(500).json({ message: 'Search failed', error: error.message });
  }
});

// @GET /api/videos/category/:category
router.get('/category/:category', protect, async (req, res) => {
  try {
    const { category } = req.params;
    const queries = CATEGORY_QUERIES[category] || [category];
    const randomQuery = queries[Math.floor(Math.random() * queries.length)];

    const data = await fetchYouTubeVideos(randomQuery, 16);
    const videos = data.items?.map(item => ({
      videoId: item.id?.videoId,
      title: item.snippet?.title,
      description: item.snippet?.description,
      thumbnail: item.snippet?.thumbnails?.high?.url,
      channelTitle: item.snippet?.channelTitle,
      publishedAt: item.snippet?.publishedAt,
      category
    })).filter(v => v.videoId) || [];

    res.json({ videos, category });
  } catch (error) {
    res.status(500).json({ message: 'Category fetch failed', error: error.message });
  }
});

// @GET /api/videos/related/:videoId
router.get('/related/:videoId', protect, async (req, res) => {
  try {
    const { videoId } = req.params;
    const params = {
      part: 'snippet',
      relatedToVideoId: videoId,
      type: 'video',
      maxResults: 10,
      key: process.env.YOUTUBE_API_KEY
    };

    const response = await axios.get(`${YT_API_BASE}/search`, { params });
    const videos = response.data.items?.map(item => ({
      videoId: item.id?.videoId,
      title: item.snippet?.title,
      thumbnail: item.snippet?.thumbnails?.medium?.url,
      channelTitle: item.snippet?.channelTitle
    })).filter(v => v.videoId) || [];

    res.json({ videos });
  } catch (error) {
    res.status(500).json({ message: 'Related videos failed', error: error.message });
  }
});

module.exports = router;
