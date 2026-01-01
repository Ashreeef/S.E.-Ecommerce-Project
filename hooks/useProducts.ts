"use client";

import { useState, useEffect, useCallback } from 'react';
import { Product, products as mockProducts } from '@/lib/types/product';

export function useProduct(productId?: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = useCallback(async (id?: string) => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/products/${encodeURIComponent(id)}`);
      if (!res.ok) {
        // fallback to local mock
        const local = mockProducts.find(p => p.id === id) || null;
        setProduct(local);
        setIsLoading(false);
        return;
      }
      const response = await res.json();
      // Extract product from API response { success: true, data: product }
      setProduct(response.data || response);
    } catch {
      const local = mockProducts.find(p => p.id === id) || null;
      setProduct(local);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (productId) fetchProduct(productId);
  }, [productId, fetchProduct]);

  const refresh = () => {
    if (productId) fetchProduct(productId);
  };

  return { product, isLoading, error, fetchProduct, refresh, setProduct };
}
