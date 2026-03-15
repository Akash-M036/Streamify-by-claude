import React, { useState, useEffect } from 'react';
import axios from 'axios';
import VideoCard from '../components/VideoCard';
import SkeletonGrid from '../components/SkeletonGrid';

const Recommendations = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [basedOn, setBasedOn] = useState('');

  useEffect(() => {
    const fetchRecs = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get('/api/recommendations');
        setVideos(data.videos || []);
        setBasedOn(data.basedOn || '');
      } catch (err) {
        console.error('Recommendations failed:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRecs();
  }, []);

  return (
    <div className="main-layout">
      <div className="section-header">
        <div>
          <h2 className="section-title">⭐ <span>Personalized</span> For You</h2>
          {basedOn && <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>Based on your watch history & preferences</p>}
        </div>
      </div>

      {loading ? (
        <SkeletonGrid count={8} />
      ) : videos.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">⭐</div>
          <div className="empty-title">No recommendations yet</div>
          <div className="empty-text">Watch some videos first and we'll personalize your feed!</div>
        </div>
      ) : (
        <div className="video-grid">
          {videos.map((video) => (
            <VideoCard key={video.videoId} video={video} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Recommendations;
