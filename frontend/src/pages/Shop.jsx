import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, Search, SlidersHorizontal } from 'lucide-react';
import toast from 'react-hot-toast';

const ALL = 'All';

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState(ALL);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { user, role } = useAuth();

  useEffect(() => {
    api.get('/products').then(res => {
      setProducts(res.data);
      setFiltered(res.data);
      // Build unique category list
      const cats = [ALL, ...new Set(res.data.map(p => p.category).filter(Boolean))];
      setCategories(cats);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    let result = products;
    if (activeCategory !== ALL) {
      result = result.filter(p => p.category === activeCategory);
    }
    if (q) {
      result = result.filter(p => p.name?.toLowerCase().includes(q));
    }
    setFiltered(result);
  }, [search, activeCategory, products]);

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

      {/* Category Filter Pills */}
      {categories.length > 1 && (
        <div className="category-filter-bar">
          {categories.map(cat => (
            <button
              key={cat}
              className={`cat-pill ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat === ALL ? '🛍️ All' : cat}
            </button>
          ))}
        </div>
      )}

      {/* Results count */}
      {!loading && (
        <p className="results-count">
          {filtered.length} product{filtered.length !== 1 ? 's' : ''} found
          {activeCategory !== ALL && <> in <strong>{activeCategory}</strong></>}
          {search && <> for "<strong>{search}</strong>"</>}
        </p>
      )}

      {loading ? (
        <div className="loading-screen"><div className="spinner"></div></div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <SlidersHorizontal size={48} />
          <p>No products found</p>
          <button className="cat-pill active" style={{ marginTop: '1rem' }} onClick={() => { setSearch(''); setActiveCategory(ALL); }}>
            Clear Filters
          </button>
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
                    <div className="product-placeholder"><span>✦</span></div>
                  )}
                  {product.discount > 0 && (
                    <span className="discount-badge">-{product.discount}%</span>
                  )}
                  {product.category && (
                    <span className="category-tag" onClick={() => setActiveCategory(product.category)}>
                      {product.category}
                    </span>
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
