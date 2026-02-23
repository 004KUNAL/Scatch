import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminLogin() {
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
      const res = await api.post('/owners/login', form);
      login(res.data.owner, res.data.token, 'owner');
      toast.success('Welcome, Admin! 🔐');
      navigate('/admin');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Access denied');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page admin-auth-page">
      <div className="auth-card glass-panel">
        <div className="auth-header">
          <div className="auth-logo admin-logo"><Shield size={32} /></div>
          <h2>Admin Access</h2>
          <p>Owner-only restricted area</p>
        </div>
        <div className="admin-warning">
          <Shield size={14} /> Only authorized owners can access this panel
        </div>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <Mail size={18} />
            <input name="email" type="email" placeholder="Owner Email" value={form.email} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <Lock size={18} />
            <input name="password" type={showPass ? 'text' : 'password'} placeholder="Owner Password" value={form.password} onChange={handleChange} required />
            <button type="button" className="eye-btn" onClick={() => setShowPass(!showPass)}>
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <button type="submit" className="btn-auth btn-admin" disabled={loading}>
            {loading ? <div className="btn-spinner"></div> : 'Access Admin Panel'}
          </button>
        </form>
      </div>
    </div>
  );
}
