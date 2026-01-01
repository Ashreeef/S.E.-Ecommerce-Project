import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsApi } from '@/lib/api/products';

// Product types
export interface Product {
  id: string;
  name: string;
  category: string;
  type: string;
  price: number;
  original_price: number | null;
  is_available: boolean;
  rating: number;
  review_count: number;
  images: string[];
  available_sizes: string[];
  available_colors: string[];
  created_at: string;
  updated_at: string;
}

export interface ProductInput {
  name: string;
  category: string;
  type: string;
  price: number;
  original_price?: number | null;
  is_available?: boolean;
  rating?: number;
  review_count?: number;
  images?: string[];
  available_sizes?: string[];
  available_colors?: string[];
}

// Query keys for cache management
export const productKeys = {
  all: ['products'] as const,
  detail: (id: string) => ['products', id] as const,
};

// Hook to fetch all products
export function useProducts() {
  return useQuery({
    queryKey: productKeys.all,
    queryFn: productsApi.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook to fetch single product
export function useProduct(id: string) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => productsApi.getById(id),
    enabled: !!id,
  });
}

// Hook to create product (admin)
export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productsApi.create,
    onSuccess: () => {
      // Invalidate and refetch products list
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
}

// Hook to update product (admin)
export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ProductInput }) =>
      productsApi.update(id, data),
    onSuccess: (_, variables) => {
      // Invalidate both list and detail
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      queryClient.invalidateQueries({ queryKey: productKeys.detail(variables.id) });
    },
  });
}

// Hook to delete product (admin)
export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productsApi.delete,
    onSuccess: () => {
      // Invalidate products list
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
}
