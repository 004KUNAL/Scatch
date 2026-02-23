import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, Phone, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', contact: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/users/register', form);
      login(res.data.user, res.data.token, 'user');
      toast.success('Account created! Welcome 🎉');
      navigate('/shop');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card glass-panel">
        <div className="auth-header">
          <div className="auth-logo">✦</div>
          <h2>Create Account</h2>
          <p>Join Scatch and start shopping</p>
        </div>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <User size={18} />
            <input name="name" type="text" placeholder="Full Name" value={form.name} onChange={handleChange} required />
          </div>
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
          <div className="input-group">
            <Phone size={18} />
            <input name="contact" type="number" placeholder="Phone Number (optional)" value={form.contact} onChange={handleChange} />
          </div>
          <button type="submit" className="btn-auth" disabled={loading}>
            {loading ? <div className="btn-spinner"></div> : 'Create Account'}
          </button>
        </form>
        <p className="auth-switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
