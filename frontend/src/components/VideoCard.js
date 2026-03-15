import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import VideoPlayer from './VideoPlayer';

const CATEGORY_COLORS = {
  movies: '#e50914', gaming: '#22c55e',
  education: '#3b82f6', music: '#a855f7', general: '#f59e0b'
};

const VideoCard = ({ video, initialLiked = false, initialSaved = false }) => {
  const [liked, setLiked] = useState(initialLiked || video.isLiked);
  const [saved, setSaved] = useState(initialSaved || video.isSaved);
  const [loading, setLoading] = useState({ like: false, save: false });
  const [playing, setPlaying] = useState(false);

  const { videoId, title, thumbnail, channelTitle, category } = video;
  const catColor = CATEGORY_COLORS[category] || CATEGORY_COLORS.general;

  const handleWatch = async () => {
    try {
      await axios.post('/api/user/watch', { videoId, title, thumbnail, channelTitle, category });
    } catch (_) {}
    setPlaying(true);
  };

  const handleLike = async (e) => {
    e.stopPropagation();
    if (loading.like) return;
    setLoading(l => ({ ...l, like: true }));
    try {
      const { data } = await axios.post('/api/user/like', { videoId, title, thumbnail, channelTitle, category });
      setLiked(data.liked);
      toast(data.liked ? '❤️ Added to liked videos' : '💔 Removed from liked', { autoClose: 1500 });
    } catch { toast.error('Failed to update'); }
    finally { setLoading(l => ({ ...l, like: false })); }
  };

  const handleSave = async (e) => {
    e.stopPropagation();
    if (loading.save) return;
    setLoading(l => ({ ...l, save: true }));
    try {
      const { data } = await axios.post('/api/user/save', { videoId, title, thumbnail, channelTitle, category });
      setSaved(data.saved);
      toast(data.saved ? '🔖 Saved to watchlist' : '📌 Removed from watchlist', { autoClose: 1500 });
    } catch { toast.error('Failed to update'); }
    finally { setLoading(l => ({ ...l, save: false })); }
  };

  return (
    <>
      {playing && (
        <VideoPlayer videoId={videoId} onClose={() => setPlaying(false)} />
      )}

      <div className="video-card" onClick={handleWatch}>
        <div className="thumbnail-wrap">
          <img
            src={thumbnail || `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
            alt={title} loading="lazy"
            onError={e => { e.target.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`; }}
          />
          <div className="play-overlay">
            <div className="play-btn-big">▶</div>
          </div>
          {category && (
            <span className="category-badge" style={{ color: catColor }}>
              {getCatEmoji(category)} {category}
            </span>
          )}
        </div>

        <div className="card-body">
          <div className="card-title" title={title}>{title}</div>
          <div className="card-channel">📺 {channelTitle}</div>
          <div className="card-actions" onClick={e => e.stopPropagation()}>
            <button className={`action-btn ${liked ? 'liked' : ''}`} onClick={handleLike}>
              {liked ? '❤️' : '🤍'} {liked ? 'Liked' : 'Like'}
            </button>
            <button className={`action-btn ${saved ? 'saved' : ''}`} onClick={handleSave}>
              {saved ? '🔖' : '📌'} {saved ? 'Saved' : 'Save'}
            </button>
            <button className="watch-btn" onClick={handleWatch}>▶ Watch</button>
          </div>
        </div>
      </div>
    </>
  );
};

function getCatEmoji(cat) {
  const map = { movies: '🎬', gaming: '🎮', education: '📚', music: '🎵' };
  return map[cat] || '📺';
}

export default VideoCard;