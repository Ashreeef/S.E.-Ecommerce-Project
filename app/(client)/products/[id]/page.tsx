"use client";

import React, { useMemo, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ProductDetailsView } from '@/components/ui/product-details-view';
import { ProductGrid } from '@/components/ui/product-grid';
import { useFavorites } from '@/hooks/useFavorites';
import { useProduct, useProducts } from '@/hooks/useProducts';
import { useCart } from '@/hooks/useCart';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  const { favorites, toggleFavorite } = useFavorites();
  const { addItem } = useCart();

  const { product: apiProduct, isLoading, error } = useProduct(productId);
  const { products: allProducts } = useProducts();

  const product = useMemo(() => {
    if (!apiProduct) return null;

    // Map API product to view model
    return {
      id: apiProduct.id,
      name: apiProduct.name,
      category: apiProduct.category,
      type: (apiProduct as any).gender || 'Fashion',
      isAvailable: apiProduct.isAvailable,
      rating: apiProduct.rating || 5,
      reviewCount: (apiProduct as any).reviewCount || 0,
      price: apiProduct.price,
      originalPrice: apiProduct.originalPrice,
      images: apiProduct.images && apiProduct.images.length > 0
        ? apiProduct.images.map((img: any, idx: number) => ({
          id: typeof img === 'string' ? `${apiProduct.id}-${idx}` : (img.id || `${apiProduct.id}-${idx}`),
          url: typeof img === 'string' ? img : img.url,
          alt: typeof img === 'string' ? apiProduct.name : (img.alt || apiProduct.name)
        }))
        : [{ id: `${apiProduct.id}-main`, url: apiProduct.image, alt: apiProduct.name }],
      availableSizes: apiProduct.availableSizes || [],
      availableColors: apiProduct.availableColors || [],
      description: apiProduct.description,
      fit: apiProduct.fit || 'Regular fit - true to size',
      materials: 'Premium cotton blend. Machine wash cold. Tumble dry low.',
      delivery: 'Free shipping on orders over 10,000 DZD. Standard delivery 3-5 business days.',
    };
  }, [apiProduct]);

  // Related products: items from same category excluding current one
  const relatedProducts = useMemo(() => {
    if (!apiProduct || !allProducts) return [];
    return allProducts
      .filter(p => p.id !== productId && p.category === apiProduct.category)
      .slice(0, 4);
  }, [apiProduct, allProducts, productId]);

  const handleAddToCart = async (options: { size: string; color: string; quantity: number }) => {
    try {
      await addItem(productId, options.size, options.color, options.quantity);
    } catch (err) {
      console.error('Error adding to cart:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-lg text-neutral-500">Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-900 mb-4">
            {error ? 'Error loading product' : 'Product Not Found'}
          </h1>
          <p className="mb-8 text-neutral-500">{error}</p>
          <Link
            href="/products"
            className="text-neutral-600 hover:text-neutral-900 underline"
          >
            Return to Products
          </Link>
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
      {relatedProducts.length > 0 && (
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
            onAddToCart={(id) => addItem(id, '', '', 1)}
          />
        </section>
      )}
    </div>
  );
}
