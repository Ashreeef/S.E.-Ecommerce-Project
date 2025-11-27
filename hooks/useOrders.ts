"use client";

import { useState, useEffect, useCallback } from 'react';
import { Order, orders as mockOrders } from '@/lib/types/orders';

export function useOrder(orderId?: string) {
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = useCallback(async (id?: string) => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/orders/${id}`);
      if (!res.ok) {
        // fallback to local mock data
        const local = mockOrders.find(o => o.id === id) || null;
        setOrder(local);
        setIsLoading(false);
        return;
      }
      const data = await res.json();
      setOrder(data as Order);
    } catch (err) {
      // fallback to local mock data
      const local = mockOrders.find(o => o.id === id) || null;
      setOrder(local);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (orderId) fetchOrder(orderId);
  }, [orderId, fetchOrder]);
  // update status in order detail page
  const updateStatus = useCallback(async (id: string, status: Order['status']) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        // update local mock as fallback
        const idx = mockOrders.findIndex(o => o.id === id);
        if (idx !== -1) {
          mockOrders[idx].status = status;
          setOrder({ ...mockOrders[idx] });
          setIsLoading(false);
          return { success: true };
        }
        setIsLoading(false);
        return { success: false, error: 'Failed to update order' };
      }
      const updated = await res.json();
      setOrder(updated as Order);
      setIsLoading(false);
      return { success: true };
    } catch (err) {
      setIsLoading(false);
      setError('Network error');
      return { success: false, error: 'Network error' };
    }
  }, []);

  return {
    order,
    isLoading,
    error,
    fetchOrder,
    updateStatus,
    setOrder,
  };
}
