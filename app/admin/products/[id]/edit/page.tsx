'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ProductForm from '@/features/admin/components/ProductForm';
import { Product } from '@/lib/types/product';
import { ProductFormData } from '@/hooks/useProductForm';
import { useProduct } from '@/hooks/useProducts';




export default function EditProductPage() {
  const params = useParams();
  const productId = params.id as string;
  const { product, isLoading, error } = useProduct(productId);

  if (isLoading) {
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
  const initialData: Partial<ProductFormData> = {
    name: product.name,
    description: product.description,
    modelDetails: product.modelDetails || '',
    availableSizes: product.availableSizes?.join(', ') || '',
    isAvailable: product.isAvailable,
    price: product.price,
    originalPrice: product.originalPrice,
    image: product.image,
    color: product.color || '',
    gender: product.gender || 'UNISEX',
    category: product.category || '',
    fit: product.fit || '',
    stock: product.stock || 0,
    discount: product.discount || 0,
    discountType: product.discountType || '',
    images: [],
    imageUrls: Array.isArray(product.images) 
      ? product.images.map(img => typeof img === 'string' ? img : img.url)
      : (product.image ? [product.image] : []),
  };

  return <ProductForm productId={productId} initialData={initialData} isEdit={true} />;
}

