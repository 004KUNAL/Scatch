import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingCart, LogOut, Shield, Menu, X } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { user, role, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo">✦ Scatch</Link>

      <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
        <li><Link to="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
        <li><Link to="/shop" onClick={() => setMenuOpen(false)}>Shop</Link></li>

        {user && role !== 'owner' && (
          <>
            <li>
              <Link to="/orders" onClick={() => setMenuOpen(false)}>My Orders</Link>
            </li>
            <li>
              <Link to="/cart" className="cart-link" onClick={() => setMenuOpen(false)}>
                <ShoppingCart size={20} />
                {cart.length > 0 && <span className="cart-badge">{cart.length}</span>}
              </Link>
            </li>
          </>
        )}

        {user ? (
          <>
            {role === 'owner' && (
              <li>
                <Link to="/admin" className="admin-link" onClick={() => setMenuOpen(false)}>
                  <Shield size={16} /> Admin
                </Link>
              </li>
            )}
            <li>
              <button className="btn-logout" onClick={handleLogout}>
                <LogOut size={16} /> Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li><Link to="/login" className="btn-nav" onClick={() => setMenuOpen(false)}>Login</Link></li>
            <li><Link to="/register" className="btn-nav-outline" onClick={() => setMenuOpen(false)}>Register</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
}
