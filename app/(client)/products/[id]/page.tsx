"use client";

import React, { useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ProductDetailsView } from '@/components/ui/product-details-view';
import { ProductGrid } from '@/components/ui/product-grid';
import { useFavorites } from '@/hooks/useFavorites';
import { mockProducts } from '@/lib/mock-data';
import { mapColorsToHex } from '@/lib/color-utils';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  const { favorites, toggleFavorite } = useFavorites();

  const product = useMemo(() => {
    const foundProduct = mockProducts.find(p => p.id === productId);
    if (!foundProduct) return null;

    return {
      id: foundProduct.id,
      name: foundProduct.title,
      category: foundProduct.category,
      type: 'Fashion',
      isAvailable: foundProduct.availability,
      rating: foundProduct.rating,
      reviewCount: 435,
      price: foundProduct.price,
      originalPrice: foundProduct.originalPrice,
      images: [
        { id: `${foundProduct.id}-1`, url: foundProduct.image, alt: foundProduct.title },
        { id: `${foundProduct.id}-2`, url: foundProduct.image, alt: `${foundProduct.title} - 2` },
        { id: `${foundProduct.id}-3`, url: foundProduct.image, alt: `${foundProduct.title} - 3` },
        { id: `${foundProduct.id}-4`, url: foundProduct.image, alt: `${foundProduct.title} - 4` },
      ],
      availableSizes: foundProduct.size,
      availableColors: mapColorsToHex(foundProduct.colors || ['Black', 'White', 'Gray']),
      description: foundProduct.description,
      fit: 'Regular fit - true to size',
      materials: 'Premium cotton blend. Machine wash cold. Tumble dry low.',
      delivery: 'Free shipping on orders over 10,000 DZD. Standard delivery 3-5 business days.',
    };
  }, [productId]);

  // Related products: randomly select 4 products excluding the current one
  const relatedProducts = useMemo(() => {
    return mockProducts
      .filter(p => p.id !== productId)
      .sort(() => Math.random() - 0.5)
      .slice(0, 4);
  }, [productId]);

  const handleAddToCart = (options: { size: string; color: string; quantity: number }) => {
    console.log('Add to cart:', { productId, ...options });
  };

  if (!product) {
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
          onAddToCart={(id) => console.log('Add to cart:', id)}
        />
      </section>
    </div>
  );
}
