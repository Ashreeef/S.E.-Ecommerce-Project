"use client";

import { useState, useEffect, useCallback } from 'react';
import { Order } from '@/lib/types/orders';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    const token = localStorage.getItem('admin_token');
    if (!token) {
      setError('Not authenticated - Missing admin token');
      setIsLoading(false);
      return;
    }

    try {
      console.log('Fetching orders from:', `${API_BASE}/api/orders`);
      const res = await fetch(`${API_BASE}/api/orders`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.status === 401) {
        localStorage.removeItem('admin_token'); // Clear expired token
        setError('Your session has expired. Please login again.');
        setIsLoading(false);
        return;
      }

      if (!res.ok) {
        const text = await res.text();
        let errorMsg = `Failed to fetch orders (${res.status})`;
        try {
          const errorData = JSON.parse(text);
          errorMsg = errorData.error || errorMsg;
          if (errorData.details) errorMsg += ` (${errorData.details})`;
        } catch {
          // If not JSON, use the status text if available
          if (text) errorMsg += `: ${text.slice(0, 100)}`;
        }
        throw new Error(errorMsg);
      }

      const text = await res.text();
      if (!text) {
        setOrders([]);
        setError(null);
        return;
      }

      const data = JSON.parse(text);

      console.log('Successfully fetched orders:', data.length);
      setOrders(data);
      setError(null);
    } catch (err) {
      console.error('Order fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch orders');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const updateOrderStatus = async (orderId: string, status: string) => {
    const token = localStorage.getItem('admin_token');
    try {
      const res = await fetch(`${API_BASE}/api/orders/${encodeURIComponent(orderId)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: status as any } : o));
        return { success: true };
      }
      return { success: false };
    } catch (err) {
      return { success: false, error: err };
    }
  };

  return {
    orders,
    isLoading,
    error,
    refresh: fetchOrders,
    updateOrderStatus
  };
}

export function useOrder(orderId?: string) {
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = useCallback(async () => {
    if (!orderId) return;
    setIsLoading(true);
    const token = localStorage.getItem('admin_token');

    try {
      // For now, since we don't have a single order GET, we filter the list or update API
      // Let's assume the API handles /api/orders/<id> if not I'll use the list
      const res = await fetch(`${API_BASE}/api/orders`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error('Failed to fetch order');

      const text = await res.text();
      if (!text) {
        setOrder(null);
        return;
      }

      const data: Order[] = JSON.parse(text);
      const found = data.find(o => o.id === orderId);
      setOrder(found || null);
    } catch (err) {
      setError('Failed to fetch order');
    } finally {
      setIsLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  const updateStatus = async (newStatus: string) => {
    if (!orderId) return;
    const token = localStorage.getItem('admin_token');
    try {
      const res = await fetch(`${API_BASE}/api/orders/${encodeURIComponent(orderId)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setOrder(prev => prev ? { ...prev, status: newStatus as any } : null);
        return { success: true };
      }
      return { success: false };
    } catch (e) {
      return { success: false };
    }
  };

  return { order, isLoading, error, updateStatus };
}
