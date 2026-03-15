import React, { useEffect } from 'react';

const VideoPlayer = ({ videoId, onClose }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  if (!videoId) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(0,0,0,0.97)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center'
    }}>
      {/* Close Button */}
      <button onClick={onClose} style={{
        position: 'absolute', top: '20px', right: '24px',
        background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
        color: 'white', fontSize: '1.5rem', width: '44px', height: '44px',
        borderRadius: '50%', cursor: 'pointer', zIndex: 10000,
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>✕</button>

      {/* YouTube Embed - Full Screen */}
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&fs=1&rel=0&modestbranding=1`}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        style={{
          width: '95vw',
          height: '85vh',
          border: 'none',
          borderRadius: '12px',
        }}
      />

      {/* Open in YouTube button */}
      
        href={`https://www.youtube.com/watch?v=${videoId}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          marginTop: '16px', color: 'rgba(255,255,255,0.6)',
          fontSize: '0.85rem', textDecoration: 'none',
          borderBottom: '1px solid rgba(255,255,255,0.2)',
          paddingBottom: '2px'
        }}
      >
        🔗 Open in YouTube
      </a>
    </div>
  );
};

export default VideoPlayer;