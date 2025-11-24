export interface ProductFormData {
  name: string;
  description: string;
  modelDetails: string;
  status: 'Available' | 'Unavailable' | 'Draft';
  size: string;
  color: string;
  gender: 'MEN' | 'WOMEN' | 'UNISEX';
  category: string;
  fit: string;
  basePrice: number;
  stock: number;
  discount: number; // percentage
  discountType: string;
  images: File[];
  imageUrls: string[]; // URLs after upload
}

export interface Product {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  image: string;
  images: string[];
  category: string;
  size: string[];
  description: string;
  availability: boolean;
  rating: number;
  modelDetails?: string;
  status?: 'Available' | 'Unavailable' | 'Draft';
  color?: string;
  gender?: 'MEN' | 'WOMEN' | 'UNISEX';
  fit?: string;
  stock?: number;
  discount?: number;
  discountType?: string;
}

