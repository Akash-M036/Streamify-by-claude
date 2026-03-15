import React, { useEffect, useRef } from 'react';

const VideoPlayer = ({ videoId, onClose }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    // Force fullscreen using browser API
    const requestFullscreen = async () => {
      try {
        const el = containerRef.current;
        if (el) {
          if (el.requestFullscreen) await el.requestFullscreen();
          else if (el.webkitRequestFullscreen) await el.webkitRequestFullscreen();
          else if (el.mozRequestFullScreen) await el.mozRequestFullScreen();
          else if (el.msRequestFullscreen) await el.msRequestFullscreen();
        }
      } catch (err) {
        console.log('Fullscreen not available:', err);
      }
    };

    requestFullscreen();

    // Listen for fullscreen exit (user presses Escape)
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement &&
          !document.webkitFullscreenElement &&
          !document.mozFullScreenElement) {
        // User exited fullscreen - keep player open
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);

    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      // Exit fullscreen when closing
      if (document.fullscreenElement) document.exitFullscreen();
      else if (document.webkitFullscreenElement) document.webkitExitFullscreen();
    };
  }, []);

  const handleClose = () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else if (document.webkitFullscreenElement) document.webkitExitFullscreen();
    onClose();
  };

  if (!videoId) return null;

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: '#000',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100vw',
        height: '100vh',
      }}
    >
      {/* Close Button */}
      <button
        onClick={handleClose}
        style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          background: 'rgba(255,255,255,0.15)',
          border: '1px solid rgba(255,255,255,0.3)',
          color: 'white',
          fontSize: '1.2rem',
          width: '42px',
          height: '42px',
          borderRadius: '50%',
          cursor: 'pointer',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(8px)',
        }}
      >
        ✕
      </button>

      {/* YouTube Embed */}
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&fs=1&rel=0&modestbranding=1&playsinline=0`}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
        allowFullScreen
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
        }}
      />

      {/* Bottom bar */}
      <div style={{
        position: 'absolute',
        bottom: '16px',
        display: 'flex',
        gap: '16px',
        alignItems: 'center',
      }}>
        <a
          href={`https://www.youtube.com/watch?v=${videoId}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: 'rgba(255,255,255,0.7)',
            fontSize: '0.85rem',
            textDecoration: 'none',
            background: 'rgba(255,255,255,0.1)',
            padding: '8px 16px',
            borderRadius: '20px',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.2)',
          }}
        >
          🔗 Open in YouTube
        </a>
        <button
          onClick={handleClose}
          style={{
            color: 'rgba(255,255,255,0.7)',
            fontSize: '0.85rem',
            background: 'rgba(255,255,255,0.1)',
            padding: '8px 16px',
            borderRadius: '20px',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.2)',
            cursor: 'pointer',
          }}
        >
          ✕ Close
        </button>
      </div>
    </div>
  );
};

export default VideoPlayer;