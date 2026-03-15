import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const ALL_CATEGORIES = [
  { id: 'movies', label: '🎬 Movies & Web Series' },
  { id: 'gaming', label: '🎮 Gaming' },
  { id: 'education', label: '📚 Education' },
  { id: 'music', label: '🎵 Music Videos' },
];

const Register = () => {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [selectedCats, setSelectedCats] = useState(['movies', 'gaming']);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const toggleCat = (id) => {
    setSelectedCats(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.email || !form.password) return toast.error('Fill all fields');
    if (form.password.length < 6) return toast.error('Password must be 6+ characters');
    if (selectedCats.length === 0) return toast.error('Select at least one category');
    setLoading(true);
    try {
      await register(form.username, form.email, form.password, selectedCats);
      toast.success(`Account created! Let's stream! 🎉`);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">STREAMIFY</div>
        <div className="auth-subtitle">Create your account to get started</div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input className="form-input" name="username" placeholder="cooluser123" value={form.username} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" name="password" placeholder="Min 6 characters" value={form.password} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label className="form-label">What do you love watching? (Select all that apply)</label>
            <div className="category-select">
              {ALL_CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  className={`cat-option ${selectedCats.includes(cat.id) ? 'selected' : ''}`}
                  onClick={() => toggleCat(cat.id)}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <button className="submit-btn" type="submit" disabled={loading}>
            {loading ? '⏳ Creating...' : '🎬 Create Account'}
          </button>
        </form>

        <div className="auth-switch">
          Already have an account? <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 600 }}>Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
