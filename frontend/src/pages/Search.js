import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import VideoCard from '../components/VideoCard';
import SkeletonGrid from '../components/SkeletonGrid';

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) return;
    const fetchResults = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`/api/videos/search?q=${encodeURIComponent(query)}&maxResults=16`);
        setVideos(data.videos || []);
      } catch (err) {
        console.error('Search failed:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [query]);

  return (
    <div className="main-layout">
      <div className="section-header">
        <h2 className="section-title">
          🔍 Results for <span>"{query}"</span>
        </h2>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          {!loading && `${videos.length} videos found`}
        </span>
      </div>

      {loading ? (
        <SkeletonGrid count={8} />
      ) : videos.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <div className="empty-title">No results found</div>
          <div className="empty-text">Try a different search term</div>
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

export default Search;
