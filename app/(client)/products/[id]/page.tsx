"use client";

import React, { useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ProductDetailsView } from '@/components/ui/product-details-view';
import { ProductGrid } from '@/components/ui/product-grid';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useFavorites } from '@/hooks/useFavorites';
import { useProduct, useProducts, Product as ApiProduct } from '@/hooks/useProductsApi';
import { mapColorsToHex } from '@/lib/color-utils';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  const { favorites, toggleFavorite } = useFavorites();
  
  // Fetch single product
  const { data: productData, isLoading, isError } = useProduct(productId);
  
  // Fetch all products for related products
  const { data: allProductsData } = useProducts();

  const product = useMemo(() => {
    const apiProduct = productData?.data;
    if (!apiProduct) return null;

    return {
      id: apiProduct.id,
      name: apiProduct.name,
      category: apiProduct.category,
      type: apiProduct.type,
      isAvailable: apiProduct.is_available,
      rating: apiProduct.rating,
      reviewCount: apiProduct.review_count,
      price: apiProduct.price,
      originalPrice: apiProduct.original_price,
      images: apiProduct.images?.map((url: string, index: number) => ({
        id: `${apiProduct.id}-${index}`,
        url,
        alt: `${apiProduct.name} - ${index + 1}`,
      })) || [],
      availableSizes: apiProduct.available_sizes || [],
      availableColors: mapColorsToHex(apiProduct.available_colors || ['Black', 'White']),
      description: `${apiProduct.name} - Premium quality ${apiProduct.category.toLowerCase()} item.`,
      fit: 'Regular fit - true to size',
      materials: 'Premium materials. Machine wash cold. Tumble dry low.',
      delivery: 'Free shipping on orders over 10,000 DZD. Standard delivery 3-5 business days.',
    };
  }, [productData]);

  // Related products: randomly select 4 products excluding the current one
  const relatedProducts = useMemo(() => {
    const allProducts = allProductsData?.data || [];
    return allProducts
      .filter((p: ApiProduct) => p.id !== productId)
      .sort(() => Math.random() - 0.5)
      .slice(0, 4)
      .map((p: ApiProduct) => ({
        id: p.id,
        title: p.name,
        image: p.images?.[0] || '',
        price: p.price,
        originalPrice: p.original_price,
        rating: p.rating,
        category: p.category,
        availableSizes: p.available_sizes || [],
        description: '',
        isAvailable: p.is_available,
        images: p.images?.map((url: string, index: number) => ({ 
          id: `${p.id}-${index}`, 
          url, 
          alt: p.name 
        })) || [],
        availableColors: p.available_colors?.map((color: string) => ({ 
          name: color, 
          hex: '#000000' 
        })) || [],
        gender: (p.gender as 'MEN' | 'WOMEN' | 'UNISEX') || 'UNISEX',
        stock: p.stock,
        discount: p.discount,
        discountType: p.discount_type,
        fit: p.fit,
        modelDetails: p.model_details,
        date: p.created_at,
        sales: 0,
        status: p.is_available ? 'Available' as const : 'Out-of-stock' as const,
        reviewCount: p.review_count,
      }));
  }, [allProductsData, productId]);

  const handleAddToCart = (_options: { size: string; color: string; quantity: number }) => {
    // TODO: Implement add to cart functionality
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen text="Loading product details..." />;
  }

  if (isError || !product) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-900 mb-4">Product Not Found</h1>
          <button
            onClick={() => router.push('/products')}
            className="text-neutral-600 hover:text-neutral-900 underline"
          >
            Return to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ProductDetailsView
        product={product}
        isFavorite={favorites.includes(productId)}
        onFavoriteToggle={() => toggleFavorite(productId)}
        onAddToCart={handleAddToCart}
      />

      {/* Related Products Section */}
      <section className="mt-16 sm:mt-20 lg:mt-24">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-900 italic">
            You might also like
          </h2>
          <Link
            href="/products"
            className="text-neutral-600 hover:text-neutral-900 text-sm sm:text-base font-medium transition-colors"
          >
            View more
          </Link>
        </div>

        <ProductGrid
          products={relatedProducts}
          favoriteIds={favorites}
          onFavoriteToggle={toggleFavorite}
          onAddToCart={() => {}}
        />
      </section>
    </div>
  );
}
