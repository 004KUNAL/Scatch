import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/users/login', form);
      login(res.data.user, res.data.token, 'user');
      toast.success('Welcome back! 👋');
      navigate('/shop');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card glass-panel">
        <div className="auth-header">
          <div className="auth-logo">✦</div>
          <h2>Welcome Back</h2>
          <p>Sign in to your Scatch account</p>
        </div>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <Mail size={18} />
            <input name="email" type="email" placeholder="Email Address" value={form.email} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <Lock size={18} />
            <input name="password" type={showPass ? 'text' : 'password'} placeholder="Password" value={form.password} onChange={handleChange} required />
            <button type="button" className="eye-btn" onClick={() => setShowPass(!showPass)}>
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <button type="submit" className="btn-auth" disabled={loading}>
            {loading ? <div className="btn-spinner"></div> : 'Sign In'}
          </button>
        </form>
        <p className="auth-switch">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
        <div className="admin-hint">
          Are you the owner? <Link to="/admin/login">Admin Login →</Link>
        </div>
      </div>
    </div>
  );
}
