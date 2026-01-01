"use client";

import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { productKeys } from './useProductsApi';

export default function useDeleteProduct() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const queryClient = useQueryClient();

  async function deleteProduct(id: string) {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/products/${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to delete product');
      }

      // Invalidate products cache to refetch the list
      await queryClient.invalidateQueries({ queryKey: productKeys.all });
      
      setIsLoading(false);
      return true;
    } catch (err: unknown) {
      const errorObj = err instanceof Error ? err : new Error(String(err));
      setError(errorObj);
      setIsLoading(false);
      return false;
    }
  }

  return { isLoading, error, deleteProduct } as const;
}
