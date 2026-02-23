import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Package, Users, TrendingUp, RefreshCw } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadDashboard = () => {
    setLoading(true);
    api.get('/owners/dashboard').then(res => {
      setStats(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { loadDashboard(); }, []);

  if (loading) return <div className="loading-screen"><div className="spinner"></div></div>;

  return (
    <div className="admin-dashboard">
      <div className="dash-header">
        <h1>Dashboard</h1>
        <button className="btn-refresh" onClick={loadDashboard}><RefreshCw size={16} /> Refresh</button>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card glass-panel stat-products">
          <div className="stat-icon"><Package size={28} /></div>
          <div className="stat-info">
            <span className="stat-value">{stats?.totalProducts}</span>
            <span className="stat-label">Total Products</span>
          </div>
        </div>
        <div className="stat-card glass-panel stat-users">
          <div className="stat-icon"><Users size={28} /></div>
          <div className="stat-info">
            <span className="stat-value">{stats?.totalUsers}</span>
            <span className="stat-label">Registered Users</span>
          </div>
        </div>
        <div className="stat-card glass-panel stat-revenue">
          <div className="stat-icon"><TrendingUp size={28} /></div>
          <div className="stat-info">
            <span className="stat-value">₹{stats?.totalRevenue}</span>
            <span className="stat-label">Catalog Value</span>
          </div>
        </div>
      </div>

      {/* Recent Products */}
      <div className="dash-section">
        <h2>Recent Products</h2>
        <div className="recent-list">
          {stats?.recentProducts?.length === 0 && (
            <p className="no-data">No products yet</p>
          )}
          {stats?.recentProducts?.map(p => (
            <div key={p._id} className="recent-item glass-panel">
              <div className="recent-item-dot" style={{ background: p.panelcolor || '#6366f1' }}></div>
              <div className="recent-item-info">
                <span className="recent-name">{p.name}</span>
                <span className="recent-meta">₹{p.price} {p.discount > 0 ? `(-${p.discount}%)` : ''}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Users */}
      <div className="dash-section">
        <h2>Recent Users</h2>
        <div className="recent-list">
          {stats?.recentUsers?.length === 0 && (
            <p className="no-data">No users yet</p>
          )}
          {stats?.recentUsers?.map(u => (
            <div key={u._id} className="recent-item glass-panel">
              <div className="user-avatar-sm">{u.name?.[0]?.toUpperCase()}</div>
              <div className="recent-item-info">
                <span className="recent-name">{u.name}</span>
                <span className="recent-meta">{u.email}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
