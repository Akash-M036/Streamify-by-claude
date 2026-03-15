import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import VideoCard from '../components/VideoCard';
import SkeletonGrid from '../components/SkeletonGrid';

const CATEGORIES = [
  { id: 'all', label: '🔥 All', emoji: '🔥' },
  { id: 'movies', label: '🎬 Movies', emoji: '🎬' },
  { id: 'gaming', label: '🎮 Gaming', emoji: '🎮' },
  { id: 'education', label: '📚 Education', emoji: '📚' },
  { id: 'music', label: '🎵 Music', emoji: '🎵' },
];

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchVideos = useCallback(async (category, isLoadMore = false) => {
    try {
      if (!isLoadMore) setLoading(true);
      else setLoadingMore(true);

      let url = category === 'all'
        ? `/api/videos/feed?page=${isLoadMore ? page + 1 : 1}`
        : `/api/videos/category/${category}`;

      const { data } = await axios.get(url);
      const newVideos = data.videos || [];

      if (isLoadMore) {
        setVideos(prev => [...prev, ...newVideos]);
        setPage(p => p + 1);
      } else {
        setVideos(newVideos);
        setPage(1);
      }
    } catch (err) {
      console.error('Failed to fetch videos:', err.message);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [page]);

  useEffect(() => {
    fetchVideos(activeCategory);
  }, [activeCategory]);

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
  };

  return (
    <div className="main-layout">
      {/* Category Tabs */}
      <div className="category-tabs">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            className={`cat-tab ${activeCategory === cat.id ? 'active' : ''}`}
            onClick={() => handleCategoryChange(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Section Header */}
      <div className="section-header">
        <h2 className="section-title">
          {activeCategory === 'all' ? <>🔥 <span>Trending</span> For You</> : <>{CATEGORIES.find(c => c.id === activeCategory)?.label} <span>Videos</span></>}
        </h2>
        <button
          onClick={() => fetchVideos(activeCategory)}
          style={{ background: 'none', border: '1px solid var(--border)', borderRadius: '8px', padding: '8px 16px', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.85rem' }}
        >
          🔄 Refresh
        </button>
      </div>

      {/* Video Grid */}
      {loading ? (
        <SkeletonGrid count={8} />
      ) : videos.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🎬</div>
          <div className="empty-title">No videos found</div>
          <div className="empty-text">Try refreshing or check your YouTube API key</div>
        </div>
      ) : (
        <>
          <div className="video-grid">
            {videos.map((video) => (
              <VideoCard key={`${video.videoId}-${Math.random()}`} video={video} />
            ))}
          </div>

          {/* Load More */}
          {activeCategory === 'all' && (
            <div style={{ textAlign: 'center', padding: '24px' }}>
              <button
                onClick={() => fetchVideos(activeCategory, true)}
                disabled={loadingMore}
                style={{
                  padding: '12px 32px', borderRadius: '100px',
                  background: 'var(--bg-card)', border: '1.5px solid var(--border)',
                  color: 'var(--text-primary)', cursor: 'pointer', fontSize: '0.95rem',
                  fontWeight: '600', fontFamily: 'Outfit, sans-serif', transition: 'all 0.2s'
                }}
              >
                {loadingMore ? '⏳ Loading...' : '⬇️ Load More'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Home;
