"use client";

import { useState } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function useDeleteOrder() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  async function deleteOrder(id: string) {
    setIsLoading(true);
    setError(null);
    const token = localStorage.getItem('admin_token');

    try {
      const res = await fetch(`${API_BASE}/api/orders/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        setIsLoading(false);
        return true;
      }

      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || 'Failed to delete order');
    } catch (err: any) {
      setError(err instanceof Error ? err : new Error(String(err)));
      setIsLoading(false);
      return false;
    }
  }

  return { isLoading, error, deleteOrder } as const;
}
