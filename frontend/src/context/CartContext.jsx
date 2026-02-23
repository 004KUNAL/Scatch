import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);

  const fetchCart = async () => {
    if (!user) return setCart([]);
    try {
      const res = await api.get('/users/cart');
      setCart(res.data);
    } catch (_) { setCart([]); }
  };

  useEffect(() => { fetchCart(); }, [user]);

  const addToCart = async (productId) => {
    await api.post('/users/cart', { productId });
    fetchCart();
  };

  const removeFromCart = async (productId) => {
    await api.delete(`/users/cart/${productId}`);
    fetchCart();
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
