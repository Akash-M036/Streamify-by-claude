import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const TABS = [
  { id: 'liked', label: '❤️ Liked Videos' },
  { id: 'saved', label: '🔖 Saved / Watchlist' },
  { id: 'history', label: '🕐 Watch History' },
];

const MiniCard = ({ video, onPlay }) => (
  <div
    onClick={onPlay}
    style={{
      display: 'flex', gap: '12px', alignItems: 'center',
      padding: '12px', borderRadius: '12px', cursor: 'pointer',
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      transition: 'border-color 0.2s'
    }}
    onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
  >
    <img
      src={video.thumbnail || `https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg`}
      alt={video.title}
      style={{ width: '120px', height: '68px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }}
    />
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {video.title}
      </div>
      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{video.channelTitle}</div>
      {video.watchCount > 1 && (
        <div style={{ fontSize: '0.72rem', color: 'var(--accent)', marginTop: '4px' }}>▶ Watched {video.watchCount}x</div>
      )}
    </div>
    <div style={{ fontSize: '1.2rem' }}>▶</div>
  </div>
);

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('liked');
  const [data, setData] = useState({ liked: [], saved: [], history: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [likedRes, savedRes, histRes] = await Promise.all([
          axios.get('/api/user/liked'),
          axios.get('/api/user/saved'),
          axios.get('/api/user/history'),
        ]);
        setData({
          liked: likedRes.data.liked || [],
          saved: savedRes.data.saved || [],
          history: histRes.data.history || [],
        });
      } catch (err) {
        toast.error('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success('Logged out successfully');
  };

  const playVideo = async (video) => {
    try {
      await axios.post('/api/user/watch', {
        videoId: video.videoId,
        title: video.title,
        thumbnail: video.thumbnail,
        channelTitle: video.channelTitle,
        category: video.category
      });
    } catch (_) {}
    window.open(`https://www.youtube.com/watch?v=${video.videoId}`, '_blank', 'noopener,noreferrer');
  };

  const currentList = data[activeTab] || [];

  return (
    <div className="main-layout">
      <div className="page-container">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-avatar-big">
            {user?.username?.[0]?.toUpperCase()}
          </div>
          <div>
            <div className="profile-name">@{user?.username}</div>
            <div className="profile-email">{user?.email}</div>
            <div className="profile-stats">
              <div className="stat">
                <div className="stat-num">{data.history.length}</div>
                <div className="stat-label">Watched</div>
              </div>
              <div className="stat">
                <div className="stat-num">{data.liked.length}</div>
                <div className="stat-label">Liked</div>
              </div>
              <div className="stat">
                <div className="stat-num">{data.saved.length}</div>
                <div className="stat-label">Saved</div>
              </div>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>🚪 Logout</button>
        </div>

        {/* Preferences */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '10px', fontWeight: 600 }}>
            YOUR PREFERENCES
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {(user?.preferences?.categories || []).map(cat => (
              <span key={cat} style={{
                padding: '6px 16px', borderRadius: '100px',
                background: 'rgba(229,9,20,0.15)', border: '1px solid var(--accent)',
                fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 500
              }}>
                {cat === 'movies' ? '🎬' : cat === 'gaming' ? '🎮' : cat === 'education' ? '📚' : '🎵'} {cat}
              </span>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '0' }}>
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '12px 20px', background: 'none', border: 'none',
                borderBottom: activeTab === tab.id ? '2px solid var(--accent)' : '2px solid transparent',
                color: activeTab === tab.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontFamily: 'Outfit, sans-serif', fontSize: '0.9rem', fontWeight: 600,
                cursor: 'pointer', marginBottom: '-1px', transition: 'color 0.2s'
              }}
            >
              {tab.label}
              <span style={{ marginLeft: '8px', fontSize: '0.8rem', color: 'var(--accent)' }}>
                ({data[tab.id]?.length || 0})
              </span>
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '40px' }}>Loading...</div>
        ) : currentList.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">{activeTab === 'liked' ? '❤️' : activeTab === 'saved' ? '🔖' : '🕐'}</div>
            <div className="empty-title">Nothing here yet</div>
            <div className="empty-text">
              {activeTab === 'liked' ? 'Like videos to see them here' :
               activeTab === 'saved' ? 'Save videos to your watchlist' :
               'Start watching to build your history'}
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {currentList.map((video) => (
              <MiniCard key={video.videoId + video.watchedAt} video={video} onPlay={() => playVideo(video)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
