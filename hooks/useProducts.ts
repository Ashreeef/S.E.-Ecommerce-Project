"use client";

import { useState, useEffect, useCallback } from 'react';
import { Product, products as mockProducts } from '@/lib/types/product';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Hook for fetching a single product
export function useProduct(productId?: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = useCallback(async (id?: string) => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/products/${encodeURIComponent(id)}`);
      if (!res.ok) {
        // fallback to local mock
        const local = mockProducts.find(p => p.id === id) || null;
        setProduct(local);
        setIsLoading(false);
        return;
      }
      const data = await res.json();
      setProduct(data as Product);
    } catch (err) {
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

// Hook for fetching all products
export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async (category?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const url = category
        ? `${API_BASE}/api/products?category=${encodeURIComponent(category)}`
        : `${API_BASE}/api/products`;

      const res = await fetch(url);
      if (!res.ok) {
        // fallback to local mock
        setProducts(mockProducts);
        setIsLoading(false);
        return;
      }
      const data = await res.json();
      setProducts(data as Product[]);
    } catch (err) {
      console.error('Failed to fetch products:', err);
      // fallback to local mock
      setProducts(mockProducts);
      setError('Failed to load products from server');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const refresh = () => {
    fetchProducts();
  };

  return { products, isLoading, error, fetchProducts, refresh };
}
