import { supabase } from '../../lib/supabaseClient';
import { Product } from '@/features/products/model';

export const getProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase.from('products').select('*');
  if (error) throw error;
  return data as Product[];
};

export const addProduct = async (product: Product) => {
  const { data, error } = await supabase.from('products').insert([product]);
  if (error) throw error;
  return data;
};
