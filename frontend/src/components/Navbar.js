import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ onSearch }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState('');
  const [showMenu, setShowMenu] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const navLinks = [
    { label: '🏠 Home', path: '/' },
    { label: '⭐ For You', path: '/recommendations' },
    { label: '❤️ Liked', path: '/profile' },
  ];

  return (
    <nav className="navbar">
      <div className="nav-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
        STREAMIFY
      </div>

      <div className="nav-links">
        {navLinks.map(link => (
          <button
            key={link.path}
            className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
            onClick={() => navigate(link.path)}
          >
            {link.label}
          </button>
        ))}
      </div>

      <form className="nav-search" onSubmit={handleSearch}>
        <span>🔍</span>
        <input
          type="text"
          placeholder="Search movies, shows, gaming..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
      </form>

      <div style={{ position: 'relative' }}>
        <div className="nav-avatar" onClick={() => setShowMenu(!showMenu)}>
          {user?.username?.[0]?.toUpperCase() || 'U'}
        </div>
        {showMenu && (
          <div style={{
            position: 'absolute', right: 0, top: '48px',
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: '12px', padding: '8px', minWidth: '160px', zIndex: 100
          }}>
            <div style={{ padding: '8px 12px', fontSize: '0.85rem', color: 'var(--text-secondary)', borderBottom: '1px solid var(--border)', marginBottom: '4px' }}>
              @{user?.username}
            </div>
            <button className="nav-link" style={{ width: '100%', textAlign: 'left' }} onClick={() => { navigate('/profile'); setShowMenu(false); }}>
              👤 Profile
            </button>
            <button className="nav-link" style={{ width: '100%', textAlign: 'left', color: 'var(--accent)' }} onClick={() => { logout(); navigate('/login'); setShowMenu(false); }}>
              🚪 Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
