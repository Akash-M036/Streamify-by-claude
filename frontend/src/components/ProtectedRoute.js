import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', background: 'var(--bg-primary)', flexDirection: 'column', gap: '16px'
      }}>
        <div style={{
          fontFamily: 'Bebas Neue, sans-serif', fontSize: '2.5rem',
          letterSpacing: '3px', background: 'linear-gradient(135deg, #e50914, #ff6b35)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
        }}>
          STREAMIFY
        </div>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Loading...</div>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
