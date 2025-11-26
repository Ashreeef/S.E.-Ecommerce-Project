"use client";

import { useState } from 'react';
import { products } from '@/lib/types/product';

export default function useDeleteProduct() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  async function deleteProduct(id: string) {
    setIsLoading(true);
    setError(null);
    try {
      // Try server API first
      const res = await fetch(`/api/products/${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setIsLoading(false);
        return true;
      }

      // If server returns non-ok, fall back to local mock deletion
      const idx = products.findIndex(p => p.id === id);
      if (idx !== -1) products.splice(idx, 1);
      setIsLoading(false);
      return true;
    } catch (err: any) {
      // Network error or no API — mutate mock list so UI can reflect deletion
      const idx = products.findIndex(p => p.id === id);
      if (idx !== -1) products.splice(idx, 1);
      setError(err instanceof Error ? err : new Error(String(err)));
      setIsLoading(false);
      return true;
    }
  }

  return { isLoading, error, deleteProduct } as const;
}
