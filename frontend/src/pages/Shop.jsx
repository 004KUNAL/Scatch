import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, Search, SlidersHorizontal } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { user, role } = useAuth();

  useEffect(() => {
    api.get('/products').then(res => {
      setProducts(res.data);
      setFiltered(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(products.filter(p => p.name?.toLowerCase().includes(q)));
  }, [search, products]);

  const handleAddToCart = async (productId) => {
    if (!user) return toast.error('Please login to add items to cart');
    if (role === 'owner') return toast.error('Owners cannot add to cart');
    try {
      await addToCart(productId);
      toast.success('Added to cart!');
    } catch {
      toast.error('Failed to add to cart');
    }
  };

  return (
    <div className="shop-page">
      <div className="shop-header">
        <h1>Our <span className="gradient-text">Collection</span></h1>
        <p>Handpicked premium products just for you</p>
        <div className="search-bar">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="loading-screen"><div className="spinner"></div></div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <SlidersHorizontal size={48} />
          <p>No products found</p>
        </div>
      ) : (
        <div className="shop-grid">
          {filtered.map(product => {
            const discountedPrice = product.price - (product.price * (product.discount || 0) / 100);
            return (
              <div
                key={product._id}
                className="product-card"
                style={{ '--card-bg': product.bgc || '#1e293b', '--panel-color': product.panelcolor || '#6366f1', '--text-color': product.textcolor || '#ffffff' }}
              >
                <div className="product-image-wrap">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="product-image" />
                  ) : (
                    <div className="product-placeholder">
                      <span>✦</span>
                    </div>
                  )}
                  {product.discount > 0 && (
                    <span className="discount-badge">-{product.discount}%</span>
                  )}
                </div>
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <div className="price-row">
                    <span className="price">₹{discountedPrice.toFixed(0)}</span>
                    {product.discount > 0 && (
                      <span className="original-price">₹{product.price}</span>
                    )}
                  </div>
                  <button
                    className="btn-add-cart"
                    onClick={() => handleAddToCart(product._id)}
                  >
                    <ShoppingCart size={16} /> Add to Cart
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
