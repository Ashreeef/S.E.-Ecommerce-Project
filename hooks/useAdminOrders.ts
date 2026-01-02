"use client";

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface OrderProduct {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  color?: string;
  size?: string;
  image?: string;
}

interface ShipmentTimelineEntry {
  title: string;
  date: string;
  location?: string;
}

export interface AdminOrder {
  id: string;
  customer_id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  address: string;
  wilaya: string;
  city: string;
  bureau: string | null;
  shipping_method: string;
  order_notes: string | null;
  status: string;
  total_amount: number;
  shipping_fee: number;
  tax: number;
  grand_total: number;
  payment_method: string;
  delivery_company: string;
  shipping_status: string;
  number_of_products: number;
  products: OrderProduct[];
  shipment_timeline: ShipmentTimelineEntry[];
  created_at: string;
  updated_at?: string;
}

export function useAdminOrders() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Get auth token
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token || '';

      if (!token) {
        setError('Please login to view orders');
        setIsLoading(false);
        return;
      }

      const response = await fetch('/api/admin/orders', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch orders');
      }

      const result = await response.json();
      setOrders(result.data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch orders';
      setError(errorMessage);
      console.error('Error fetching admin orders:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteOrder = useCallback(async (orderId: string) => {
    try {
      // Get auth token
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token || '';

      if (!token) {
        throw new Error('Please login to delete orders');
      }

      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete order');
      }

      // Remove from local state
      setOrders(prev => prev.filter(order => order.id !== orderId));
      
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete order';
      console.error('Error deleting order:', err);
      return { success: false, error: errorMessage };
    }
  }, []);

  const updateOrderStatus = useCallback(async (orderId: string, status: string) => {
    try {
      // Get auth token
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token || '';

      if (!token) {
        throw new Error('Please login to update orders');
      }

      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update order');
      }

      const result = await response.json();
      
      // Update local state
      setOrders(prev => prev.map(order => 
        order.id === orderId ? result.data : order
      ));
      
      return { success: true, data: result.data };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update order';
      console.error('Error updating order:', err);
      return { success: false, error: errorMessage };
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return {
    orders,
    isLoading,
    error,
    refetch: fetchOrders,
    deleteOrder,
    updateOrderStatus,
  };
}
