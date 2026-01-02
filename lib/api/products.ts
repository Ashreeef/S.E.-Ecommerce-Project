import axios from 'axios';
import { ProductInput } from '@/hooks/useProductsApi';
import { supabase } from '@/lib/supabaseClient';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptor to include auth token in requests
apiClient.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  
  return config;
});

// Product API endpoints
export const productsApi = {
  // Get all products
  getAll: async () => {
    const response = await apiClient.get('/products');
    return response.data;
  },

  // Get single product by ID
  getById: async (id: string) => {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
  },

  // Create new product (admin)
  create: async (productData: ProductInput) => {
    const response = await apiClient.post('/products', productData);
    return response.data;
  },

  // Update product (admin)
  update: async (id: string, productData: ProductInput) => {
    const response = await apiClient.put(`/products/${id}`, productData);
    return response.data;
  },

  // Delete product (admin)
  delete: async (id: string) => {
    const response = await apiClient.delete(`/products/${id}`);
    return response.data;
  },
};

export default apiClient;
