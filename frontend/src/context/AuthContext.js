import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

// Set axios default headers
const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('ott_token', token);
  } else {
    delete axios.defaults.headers.common['Authorization'];
    localStorage.removeItem('ott_token');
    localStorage.removeItem('ott_user');
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('ott_token');
    const savedUser = localStorage.getItem('ott_user');
    if (token && savedUser) {
      setAuthToken(token);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const register = async (username, email, password, categories) => {
    const { data } = await axios.post('/api/auth/register', { username, email, password, categories });
    setAuthToken(data.token);
    setUser(data);
    localStorage.setItem('ott_user', JSON.stringify(data));
    return data;
  };

  const login = async (email, password) => {
    const { data } = await axios.post('/api/auth/login', { email, password });
    setAuthToken(data.token);
    setUser(data);
    localStorage.setItem('ott_user', JSON.stringify(data));
    return data;
  };

  const logout = () => {
    setUser(null);
    setAuthToken(null);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('ott_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
