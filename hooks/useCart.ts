"use client";

import { useState, useEffect, useCallback } from 'react';
import { CartItem, SHIPPING_COSTS, QUANTITY_LIMITS } from '@/types/checkout';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Get or create session ID for cart
function getSessionId(): string {
  if (typeof window === 'undefined') return '';

  let sessionId = localStorage.getItem('cart_session_id');
  if (!sessionId) {
    sessionId = 'sess_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
    localStorage.setItem('cart_session_id', sessionId);
  }
  return sessionId;
}

export interface ApiCartItem {
  id: string;
  productId: string;
  name: string;
  size: string;
  color: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  image: string;
}

export const useCart = () => {
  const [cartItems, setCartItems] = useState<ApiCartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch cart from API
  const fetchCart = useCallback(async () => {
    try {
      setIsLoading(true);
      const sessionId = getSessionId();

      const res = await fetch(`${API_BASE}/api/cart`, {
        headers: {
          'X-Session-ID': sessionId
        },
        credentials: 'include'
      });

      if (res.ok) {
        const data = await res.json();
        setCartItems(data);
      }
    } catch (err) {
      console.error('Failed to fetch cart:', err);
      setError('Failed to load cart');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Add item to cart
  const addItem = async (productId: string, size?: string, color?: string, quantity: number = 1) => {
    try {
      const sessionId = getSessionId();

      const res = await fetch(`${API_BASE}/api/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-ID': sessionId
        },
        credentials: 'include',
        body: JSON.stringify({ productId, size, color, quantity })
      });

      if (res.ok) {
        await fetchCart(); // Refresh cart
        return true;
      }
      return false;
    } catch (err) {
      console.error('Failed to add to cart:', err);
      return false;
    }
  };

  // Remove item from cart
  const removeItem = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/cart/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (res.ok) {
        setCartItems((items) => items.filter((item) => item.id !== id));
      }
    } catch (err) {
      console.error('Failed to remove from cart:', err);
    }
  };

  // Update item quantity
  const updateQuantity = async (id: string, newQuantity: number) => {
    if (newQuantity < QUANTITY_LIMITS.min || newQuantity > QUANTITY_LIMITS.max) return;

    try {
      const res = await fetch(`${API_BASE}/api/cart/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ quantity: newQuantity })
      });

      if (res.ok) {
        setCartItems((items) =>
          items.map((item) =>
            item.id === id ? { ...item, quantity: newQuantity } : item
          )
        );
      }
    } catch (err) {
      console.error('Failed to update quantity:', err);
    }
  };

  // Clear cart
  const clearCart = async () => {
    try {
      const sessionId = getSessionId();

      await fetch(`${API_BASE}/api/cart/clear`, {
        method: 'DELETE',
        headers: {
          'X-Session-ID': sessionId
        },
        credentials: 'include'
      });

      setCartItems([]);
    } catch (err) {
      console.error('Failed to clear cart:', err);
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const calculateShippingCost = (shippingMethod: string) => {
    if (shippingMethod.includes('domicile')) {
      return SHIPPING_COSTS.domicile;
    }
    if (shippingMethod.includes('yalidine')) {
      return SHIPPING_COSTS.yalidine;
    }
    return SHIPPING_COSTS.default;
  };

  const calculateTotal = (shippingMethod: string) => {
    return calculateSubtotal() + calculateShippingCost(shippingMethod);
  };

  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return {
    cartItems,
    isLoading,
    error,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    fetchCart,
    subtotal: calculateSubtotal(),
    calculateShippingCost,
    calculateTotal,
    itemCount
  };
};
