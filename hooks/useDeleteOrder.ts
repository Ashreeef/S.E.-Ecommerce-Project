"use client";

import { useState } from 'react';
import { orders } from '@/lib/types/orders';

export default function useDeleteOrder() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  async function deleteOrder(id: string) {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setIsLoading(false);
        return true;
      }

      // fallback: remove from mock orders
      const idx = orders.findIndex(o => o.id === id);
      if (idx !== -1) orders.splice(idx, 1);
      setIsLoading(false);
      return true;
    } catch (err: any) {
      const idx = orders.findIndex(o => o.id === id);
      if (idx !== -1) orders.splice(idx, 1);
      setError(err instanceof Error ? err : new Error(String(err)));
      setIsLoading(false);
      return true;
    }
  }

  return { isLoading, error, deleteOrder } as const;
}
