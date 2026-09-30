import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    if (!user || user.role !== 'buyer') {
      setCart(null);
      return;
    }
    try {
      setLoading(true);
      const res = await API.get('/cart');
      if (res.data.success) {
        setCart(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  const addToCart = async (productId, quantity = 1) => {
    try {
      const res = await API.post('/cart', { productId, quantity });
      if (res.data.success) {
        await fetchCart();
        return { success: true, message: res.data.message };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to add item to cart',
      };
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      const res = await API.put(`/cart/${itemId}`, { quantity });
      if (res.data.success) {
        await fetchCart();
        return { success: true };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update item quantity',
      };
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const res = await API.delete(`/cart/${itemId}`);
      if (res.data.success) {
        await fetchCart();
        return { success: true };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to remove item',
      };
    }
  };

  const itemCount = cart?.items ? cart.items.reduce((acc, item) => acc + item.quantity, 0) : 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        fetchCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
