import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { ShoppingBag, Clock, CheckCircle, Package, Truck, User, MapPin, Phone, CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders/all');
      setOrders(res.data);
      setLoading(false);
    } catch (err) {
      toast.error('Failed to fetch orders');
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const updateStatus = async (id, status) => {
    try {
      const res = await api.put(`/orders/status/${id}`, { status });
      toast.success(`Order set to ${status}`);
      fetchOrders();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock size={16} className="text-accent" />;
      case 'processing': return <Package size={16} className="text-primary" />;
      case 'shipped': return <Truck size={16} className="text-primary" />;
      case 'delivered': return <CheckCircle size={16} className="text-success" />;
      default: return null;
    }
  };

  if (loading) return <div className="loading-screen"><div className="spinner"></div></div>;

  return (
    <div className="admin-orders">
      <div className="section-header">
        <div>
          <h1>Customer Orders</h1>
          <p className="section-subtitle">Manage fulfillment and track deliveries</p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="empty-state-card glass-panel">
          <ShoppingBag size={48} />
          <h3>No orders yet</h3>
          <p>Orders from customers will appear here.</p>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <div key={order._id} className="order-card glass-panel">
              <div className="order-card-header">
                <div className="order-meta">
                  <span className="order-id">ORDER #{order._id.slice(-6).toUpperCase()}</span>
                  <span className="order-date">{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
                <div className={`order-status-badge status-${order.status}`}>
                  {getStatusIcon(order.status)}
                  {order.status.toUpperCase()}
                </div>
              </div>

              <div className="order-card-body">
                <div className="order-customer-info">
                  <div className="info-section">
                    <label><User size={14} /> Customer</label>
                    <p>{order.user?.name}</p>
                    <p className="text-xs text-soft">{order.user?.email}</p>
                  </div>
                  <div className="info-section">
                    <label><MapPin size={14} /> Shipping Address</label>
                    <p>{order.address?.fullname}</p>
                    <p className="text-xs text-soft">
                      {order.address?.street}, {order.address?.city}, {order.address?.state} - {order.address?.zipCode}
                    </p>
                    <p className="text-xs text-soft"><Phone size={12} /> {order.address?.phone}</p>
                  </div>
                  <div className="info-section">
                    <label><CreditCard size={14} /> Payment</label>
                    <p className="text-accent">{order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</p>
                    <p className="total-amount">Total: ₹{order.totalAmount}</p>
                  </div>
                </div>

                <div className="order-items-list">
                  <label>Items ({order.items.length})</label>
                  {order.items.map((item, idx) => (
                    <div key={idx} className="order-item-row">
                      <div className="order-item-img">
                        {item.image ? <img src={item.image} alt="" /> : <span>✦</span>}
                      </div>
                      <div className="order-item-details">
                        <span className="name">{item.name}</span>
                        <span className="price">₹{item.price} x {item.quantity}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="order-card-actions">
                <label>Update Delivery Status:</label>
                <div className="status-btns">
                  <button 
                    className={`status-btn processing ${order.status === 'processing' ? 'active' : ''}`}
                    onClick={() => updateStatus(order._id, 'processing')}
                  >
                    Processing
                  </button>
                  <button 
                    className={`status-btn shipped ${order.status === 'shipped' ? 'active' : ''}`}
                    onClick={() => updateStatus(order._id, 'shipped')}
                  >
                    Shipped
                  </button>
                  <button 
                    className={`status-btn delivered ${order.status === 'delivered' ? 'active' : ''}`}
                    onClick={() => updateStatus(order._id, 'delivered')}
                  >
                    Delivered
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
