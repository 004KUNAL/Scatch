import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Trash2, ShoppingBag, ArrowRight, MapPin, CreditCard, ChevronLeft, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function Cart() {
  const { cart, removeFromCart, fetchCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState('cart'); // 'cart' | 'checkout' | 'success'
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({
    fullname: '', street: '', city: '', state: '', zipCode: '', phone: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('cod');

  const handleRemove = async (id) => {
    await removeFromCart(id);
    toast.success('Removed from cart');
  };

  const handleAddressChange = (e) => setAddress({ ...address, [e.target.name]: e.target.value });

  // Filter out invalid items which can occur if products were deleted
  const validCart = cart.filter(item => item && item._id);

  const total = validCart.reduce((sum, item) => {
    const price = Number(item.price) - (Number(item.price) * (Number(item.discount || 0)) / 100);
    return sum + price;
  }, 0);

  const placeOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const orderData = {
        items: validCart.map(item => ({
          product: item._id,
          name: item.name,
          price: Number(item.price) - (Number(item.price) * (Number(item.discount || 0)) / 100),
          image: item.image,
          quantity: 1
        })),
        totalAmount: total,
        address,
        paymentMethod
      };

      await api.post('/orders/create', orderData);
      setStep('success');
      fetchCart(); // This will clear the cart in context
      toast.success('Order placed successfully!');
    } catch (err) {
      console.error('Checkout error:', err);
      const msg = err.response?.data?.message || 'Failed to place order';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (step === 'success') {
    return (
      <div className="cart-page">
        <div className="success-screen glass-panel">
          <CheckCircle2 size={80} className="text-success" />
          <h1>Order Confirmed!</h1>
          <p>Thank you for your purchase. Your order is being processed.</p>
          <div className="success-actions">
            <Link to="/shop" className="btn-primary">Continue Shopping</Link>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0 && step === 'cart') {
    return (
      <div className="cart-page">
        <div className="empty-cart">
          <ShoppingBag size={64} />
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added anything yet</p>
          <Link to="/shop" className="btn-primary">Start Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h1 className="page-title">
          {step === 'cart' ? <>Your <span className="gradient-text">Cart</span></> : 'Checkout'}
        </h1>
        {step === 'checkout' && (
          <button className="btn-back" onClick={() => setStep('cart')}>
            <ChevronLeft size={18} /> Back to Cart
          </button>
        )}
      </div>

      <div className="cart-layout">
        {step === 'cart' ? (
          <div className="cart-items">
            {validCart.map(item => {
              const discounted = Number(item.price) - (Number(item.price) * (Number(item.discount || 0)) / 100);
              return (
                <div key={item._id} className="cart-item glass-panel">
                  <div className="cart-item-image">
                    {item.image ? (
                      <img src={item.image} alt={item.name} />
                    ) : (
                      <div className="item-placeholder">✦</div>
                    )}
                  </div>
                  <div className="cart-item-info">
                    <h3>{item.name}</h3>
                    <div className="price-row">
                      <span className="price">₹{discounted.toFixed(0)}</span>
                      {item.discount > 0 && <span className="original-price">₹{item.price}</span>}
                    </div>
                    {item.discount > 0 && (
                      <span className="saving-badge">You save ₹{(item.price - discounted).toFixed(0)}</span>
                    )}
                  </div>
                  <button className="btn-remove" onClick={() => handleRemove(item._id)}>
                    <Trash2 size={18} />
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="checkout-form-container">
            <form id="checkout-form" onSubmit={placeOrder} className="glass-panel checkout-form">
              <div className="form-section">
                <h3><MapPin size={18} /> Shipping Address</h3>
                <div className="form-field">
                  <label>Full Name</label>
                  <input name="fullname" required value={address.fullname} onChange={handleAddressChange} placeholder="John Doe" />
                </div>
                <div className="form-field">
                  <label>Street Address</label>
                  <input name="street" required value={address.street} onChange={handleAddressChange} placeholder="123 Luxury St." />
                </div>
                <div className="form-2col">
                  <div className="form-field">
                    <label>City</label>
                    <input name="city" required value={address.city} onChange={handleAddressChange} placeholder="Mumbai" />
                  </div>
                  <div className="form-field">
                    <label>State</label>
                    <input name="state" required value={address.state} onChange={handleAddressChange} placeholder="Maharashtra" />
                  </div>
                </div>
                <div className="form-2col">
                  <div className="form-field">
                    <label>Zip Code</label>
                    <input name="zipCode" required value={address.zipCode} onChange={handleAddressChange} placeholder="400001" />
                  </div>
                  <div className="form-field">
                    <label>Phone Number</label>
                    <input name="phone" required value={address.phone} onChange={handleAddressChange} placeholder="9876543210" />
                  </div>
                </div>
              </div>

              <div className="form-section mt-4">
                <h3><CreditCard size={18} /> Payment Method</h3>
                <div className="payment-options">
                  <label className={`payment-option ${paymentMethod === 'cod' ? 'active' : ''}`}>
                    <input type="radio" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
                    <span>Cash on Delivery (COD)</span>
                  </label>
                  <label className={`payment-option ${paymentMethod === 'online' ? 'active' : ''}`}>
                    <input type="radio" value="online" checked={paymentMethod === 'online'} onChange={() => setPaymentMethod('online')} />
                    <span>Online Payment (Simulated)</span>
                  </label>
                </div>
              </div>
            </form>
          </div>
        )}

        <div className="cart-summary glass-panel">
          <h3>Order Summary</h3>
          <div className="summary-items">
            {validCart.map(item => (
              <div key={item._id} className="summary-item-mini">
                <span>{item.name}</span>
                <span>₹{(Number(item.price) - (Number(item.price) * (Number(item.discount || 0)) / 100)).toFixed(0)}</span>
              </div>
            ))}
          </div>
          <div className="summary-divider"></div>
          <div className="summary-row">
            <span>Items ({validCart.length})</span>
            <span>₹{total.toFixed(0)}</span>
          </div>
          <div className="summary-row">
            <span>Delivery</span>
            <span className="free-tag">FREE</span>
          </div>
          <div className="summary-divider"></div>
          <div className="summary-row total-row">
            <span>Total Amount</span>
            <span>₹{total.toFixed(0)}</span>
          </div>
          
          {step === 'cart' ? (
            <button className="btn-checkout" onClick={() => setStep('checkout')}>
              Proceed to Checkout <ArrowRight size={18} />
            </button>
          ) : (
            <button type="submit" form="checkout-form" className="btn-checkout" disabled={loading}>
              {loading ? <div className="btn-spinner"></div> : <>Place Order Now <CheckCircle2 size={18} /></>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
