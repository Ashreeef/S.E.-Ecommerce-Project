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

export interface AdminOrderDetail {
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

export function useAdminOrder(orderId?: string) {
  const [order, setOrder] = useState<AdminOrderDetail | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = useCallback(async (id?: string) => {
    if (!id) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Get auth token
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token || '';

      if (!token) {
        setError('Please login to view order');
        setIsLoading(false);
        return;
      }

      const response = await fetch(`/api/admin/orders/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch order');
      }

      const result = await response.json();
      setOrder(result.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch order';
      setError(errorMessage);
      console.error('Error fetching admin order:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateStatus = useCallback(async (id: string, status: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Get auth token
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token || '';

      if (!token) {
        throw new Error('Please login to update order');
      }

      const response = await fetch(`/api/admin/orders/${id}`, {
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
      setOrder(result.data);
      
      return { success: true, data: result.data };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update order';
      setError(errorMessage);
      console.error('Error updating order:', err);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (orderId) {
      fetchOrder(orderId);
    }
  }, [orderId, fetchOrder]);

  return {
    order,
    isLoading,
    error,
    fetchOrder,
    updateStatus,
    setOrder,
  };
}
