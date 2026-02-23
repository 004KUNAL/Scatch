import { useEffect, useState } from 'react';
import api from '../api/axios';
import { Package, Clock, Truck, CheckCircle, ChevronRight, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyOrders = async () => {
    try {
      const res = await api.get('/orders/my-orders');
      setOrders(res.data);
      setLoading(false);
    } catch (err) {
      toast.error('Failed to fetch orders');
      setLoading(false);
    }
  };

  useEffect(() => { fetchMyOrders(); }, []);

  const getStatusDetails = (status) => {
    switch (status) {
      case 'pending': return { icon: <Clock size={18} />, label: 'Pending Approval', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' };
      case 'processing': return { icon: <Package size={18} />, label: 'Processing', color: '#6366f1', bg: 'rgba(99, 102, 241, 0.1)' };
      case 'shipped': return { icon: <Truck size={18} />, label: 'Shipped', color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' };
      case 'delivered': return { icon: <CheckCircle size={18} />, label: 'Delivered', color: '#10b981', bg: 'rgba(16, 185, 129, 0.2)' };
      case 'cancelled': return { icon: <Package size={18} />, label: 'Cancelled', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' };
      default: return { icon: <Clock size={18} />, label: status, color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.1)' };
    }
  };

  if (loading) return <div className="loading-screen"><div className="spinner"></div></div>;

  return (
    <div className="orders-page">
      <h1 className="page-title">My <span className="gradient-text">Orders</span></h1>
      
      {orders.length === 0 ? (
        <div className="empty-orders glass-panel">
          <ShoppingBag size={64} className="text-muted" />
          <h2>No orders yet</h2>
          <p>You haven't placed any orders yet. Start shopping to see them here!</p>
          <Link to="/shop" className="btn-primary mt-4">Browse Products</Link>
        </div>
      ) : (
        <div className="orders-container">
          {orders.map(order => {
            const status = getStatusDetails(order.status);
            return (
              <div key={order._id} className="user-order-card glass-panel">
                <div className="order-top">
                  <div className="order-info-main">
                    <span className="order-id-label">ORDER #</span>
                    <span className="order-id-val">{order._id.slice(-6).toUpperCase()}</span>
                    <span className="order-date-val">{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="order-status-pill" style={{ background: status.bg, color: status.color }}>
                    {status.icon}
                    <span>{status.label}</span>
                  </div>
                </div>

                <div className="order-items-preview">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="item-row">
                      <div className="item-img-sm">
                        {item.image ? <img src={item.image} alt="" /> : <span>✦</span>}
                      </div>
                      <div className="item-txt-sm">
                        <span className="item-name">{item.name}</span>
                        <span className="item-meta">₹{item.price} x {item.quantity || 1}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="order-bottom">
                  <div className="order-address-summary">
                    <span className="label">Shipping To:</span>
                    <span className="val">{order.address?.fullname} | {order.address?.city}</span>
                  </div>
                  <div className="order-total-summary">
                    <span className="label">Total Amount</span>
                    <span className="val">₹{order.totalAmount}</span>
                  </div>
                </div>
                
                {/* Visual Progress Bar */}
                <div className="order-progress-wrap">
                  <div className={`progress-step completed`}>
                    <div className="step-dot"></div>
                    <span>Placed</span>
                  </div>
                  <div className={`progress-step ${['processing', 'shipped', 'delivered'].includes(order.status) ? 'completed' : ''}`}>
                    <div className="step-dot"></div>
                    <span>Processing</span>
                  </div>
                  <div className={`progress-step ${['shipped', 'delivered'].includes(order.status) ? 'completed' : ''}`}>
                    <div className="step-dot"></div>
                    <span>Shipped</span>
                  </div>
                  <div className={`progress-step ${order.status === 'delivered' ? 'completed' : ''}`}>
                    <div className="step-dot"></div>
                    <span>Delivered</span>
                  </div>
                  <div className="progress-line">
                    <div className="progress-fill" style={{ 
                      width: order.status === 'delivered' ? '100%' : 
                             order.status === 'shipped' ? '66%' : 
                             order.status === 'processing' ? '33%' : '0%' 
                    }}></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
