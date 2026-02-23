import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Users, Search, Mail, Phone } from 'lucide-react';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/users').then(res => {
      setUsers(res.data);
      setFiltered(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(users.filter(u =>
      u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q)
    ));
  }, [search, users]);

  if (loading) return <div className="loading-screen"><div className="spinner"></div></div>;

  return (
    <div className="admin-users">
      <div className="section-header">
        <h1>Users <span className="count-badge">{users.length}</span></h1>
        <div className="search-bar small">
          <Search size={16} />
          <input placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <Users size={48} />
          <p>No users registered yet</p>
        </div>
      ) : (
        <div className="users-grid">
          {filtered.map(u => (
            <div key={u._id} className="user-card glass-panel">
              <div className="user-card-avatar">
                {u.name?.[0]?.toUpperCase()}
              </div>
              <div className="user-card-info">
                <h3>{u.name}</h3>
                <p><Mail size={13} /> {u.email}</p>
                {u.contact && <p><Phone size={13} /> {u.contact}</p>}
              </div>
              <div className="user-stats">
                <div className="user-stat">
                  <span className="stat-num">{u.cart?.length || 0}</span>
                  <span className="stat-lbl">In Cart</span>
                </div>
                <div className="user-stat">
                  <span className="stat-num">{u.orders?.length || 0}</span>
                  <span className="stat-lbl">Orders</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
