'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ProductForm from '@/features/admin/components/ProductForm';
import { Product } from '@/lib/types/product';

export default function EditProductPage() {
  const params = useParams();
  const productId = params.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/products/${productId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch product');
        }

        const data = await response.json();
        setProduct(data.product);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  if (loading) {
    return (
      <div className="page-container">
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="page-container">
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-red-600">{error || 'Product not found'}</p>
        </div>
      </div>
    );
  }

  // Convert Product to ProductFormData format
  const initialData = {
    name: product.title,
    description: product.description,
    modelDetails: product.modelDetails || '',
    status: product.status || (product.availability ? 'Available' : 'Unavailable'),
    size: Array.isArray(product.size) ? product.size.join(', ') : product.size || '',
    color: product.color || '',
    gender: product.gender || 'UNISEX',
    category: product.category || '',
    fit: product.fit || '',
    basePrice: product.originalPrice || product.price,
    stock: product.stock || 0,
    discount: product.discount || 0,
    discountType: product.discountType || '',
    imageUrls: product.images || (product.image ? [product.image] : []),
  };

  return <ProductForm productId={productId} initialData={initialData} isEdit={true} />;
}

