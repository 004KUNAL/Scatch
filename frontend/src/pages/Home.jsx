import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Truck, Shield, Star, Smartphone, Watch, Headphones, Zap, Globe, Heart } from 'lucide-react';

export default function Home() {
  const cursorRef = useRef(null);
  const outlineRef = useRef(null);

  useEffect(() => {
    // Enable custom cursor for home page
    document.body.classList.add('has-custom-cursor');

    const moveCursor = (e) => {
      const { clientX: x, clientY: y } = e;
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }
      if (outlineRef.current) {
        outlineRef.current.style.transform = `translate3d(${x - 10}px, ${y - 10}px, 0)`;
      }
    };

    window.addEventListener('mousemove', moveCursor);

    const magneticElements = document.querySelectorAll('.btn-primary, .btn-secondary, .category-card');
    
    const applyMagnetic = (e) => {
      const el = e.currentTarget;
      const { left, top, width, height } = el.getBoundingClientRect();
      const x = e.clientX - (left + width / 2);
      const y = e.clientY - (top + height / 2);
      el.style.transform = `translate3d(${x * 0.3}px, ${y * 0.3}px, 0)`;
      if (outlineRef.current) {
        outlineRef.current.style.width = `${width + 20}px`;
        outlineRef.current.style.height = `${height + 20}px`;
        outlineRef.current.style.borderRadius = '12px';
        outlineRef.current.style.transform = `translate3d(${left - 10}px, ${top - 10}px, 0)`;
      }
    };

    const resetMagnetic = (e) => {
      const el = e.currentTarget;
      el.style.transform = `translate3d(0, 0, 0)`;
      if (outlineRef.current) {
        outlineRef.current.style.width = '40px';
        outlineRef.current.style.height = '40px';
        outlineRef.current.style.borderRadius = '50%';
      }
    };

    magneticElements.forEach(el => {
      el.addEventListener('mousemove', applyMagnetic);
      el.addEventListener('mouseleave', resetMagnetic);
    });

    return () => {
      document.body.classList.remove('has-custom-cursor');
      window.removeEventListener('mousemove', moveCursor);
      magneticElements.forEach(el => {
        el.removeEventListener('mousemove', applyMagnetic);
        el.removeEventListener('mouseleave', resetMagnetic);
      });
    };
  }, []);

  const categories = [
    { title: 'Next-Gen Gadgets', icon: <Smartphone size={32} />, count: '450+ Items', color: '#6366f1' },
    { title: 'Premium Accessories', icon: <Watch size={32} />, count: '800+ Items', color: '#ec4899' },
    { title: 'Audio & Sound', icon: <Headphones size={32} />, count: '200+ Items', color: '#8b5cf6' },
    { title: 'Daily Essentials', icon: <Zap size={32} />, count: '1200+ Items', color: '#f59e0b' },
  ];

  return (
    <div className="home">
      {/* Custom Cursor Elements */}
      <div ref={cursorRef} className="custom-cursor"></div>
      <div ref={outlineRef} className="custom-cursor-outline"></div>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">Everything Store 2026</div>
          <h1 className="hero-title">
            Everything You Need, <span className="gradient-text">Unimagined</span>
          </h1>
          <p className="hero-sub">
            From cutting-edge gadgets to premium accessories, Scatch is your one-stop destination for everything extraordinary. Explore a world of quality curated just for you.
          </p>
          <div className="hero-actions">
            <Link to="/shop" className="btn-primary large">
              <ShoppingBag size={20} /> Start Exploring
            </Link>
            <Link to="/shop" className="btn-secondary large">View All Categories</Link>
          </div>
          
          <div className="hero-stats">
            <div className="stat">
              <span className="num">50K+</span>
              <span className="lbl">Customers</span>
            </div>
            <div className="stat-sep"></div>
            <div className="stat">
              <span className="num">150+</span>
              <span className="lbl">Brands</span>
            </div>
            <div className="stat-sep"></div>
            <div className="stat">
              <span className="num">24H</span>
              <span className="lbl">Support</span>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-blob"></div>
          <div className="hero-mesh"></div>
          <div className="floating-card card-1">
            <Star size={16} fill="#f59e0b" color="#f59e0b" />
            <span>Top Rated Store</span>
          </div>
          <div className="floating-card card-2">
            <Zap size={16} color="#6366f1" />
            <span>Fastest Delivery</span>
          </div>
          <div className="main-visual-element">
            <div className="visual-core">
              <span>✦</span>
            </div>
            <div className="visual-ring"></div>
            <div className="visual-ring-2"></div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="categories-section">
        <div className="section-title">
          <h2>Trending <span className="gradient-text">Categories</span></h2>
          <p>Hand-picked selections to suit your modern lifestyle</p>
        </div>
        <div className="categories-grid">
          {categories.map((cat, i) => (
            <div key={i} className="category-card glass-panel" style={{ '--accent': cat.color }}>
              <div className="cat-icon-wrap">
                {cat.icon}
              </div>
              <div className="cat-info">
                <h3>{cat.title}</h3>
                <p>{cat.count}</p>
                <Link to="/shop" className="cat-link">Explore <ChevronRight size={14} /></Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="features-v2">
        <div className="feature-grid">
          <div className="feature-item">
            <div className="f-icon"><Globe size={32} /></div>
            <h3>Worldwide Shipping</h3>
            <p>Delivering quality products to your doorstep, anywhere in the world.</p>
          </div>
          <div className="feature-item">
            <div className="f-icon"><Shield size={32} /></div>
            <h3>Secured Checkout</h3>
            <p>Your security is our priority. Every transaction is 100% encrypted.</p>
          </div>
          <div className="feature-item">
            <div className="f-icon"><Heart size={32} /></div>
            <h3>Loved by Many</h3>
            <p>Join over 50,000 satisfied customers who trust Scatch.</p>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="cta-banner">
        <div className="cta-content">
          <div className="cta-badge">Limited Time Offer</div>
          <h2>Ready to upgrade your life?</h2>
          <p>Sign up today and get 15% off on your first purchase of any gadget or accessory.</p>
          <Link to="/register" className="btn-primary large">Join Scatch Now</Link>
        </div>
        <div className="cta-orbs">
          <div className="orb orb-1"></div>
          <div className="orb orb-2"></div>
        </div>
      </section>

      <footer className="home-footer">
        <div className="footer-content">
          <div className="footer-logo">✦ Scatch</div>
          <p>© 2026 Scatch Everything Store. All rights reserved.</p>
          <div className="footer-links">
            <Link to="/shop">Shop</Link>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ChevronRight({ size }) {
  return (
    <svg 
      width={size} height={size} 
      viewBox="0 0 24 24" fill="none" 
      stroke="currentColor" strokeWidth="2" 
      strokeLinecap="round" strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6"/>
    </svg>
  );
}
