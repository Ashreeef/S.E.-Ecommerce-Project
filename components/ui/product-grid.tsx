"use client";

import React from 'react';
import { ProductCard } from './product-card';
import { Product } from '@/lib/types/product';
import { cn } from '@/lib/utils';

interface ProductGridProps {
    products: Product[];
    favoriteIds?: string[];
    onFavoriteToggle?: (id: string) => void;
    onAddToCart?: (id: string) => void;
    className?: string;
}

export function ProductGrid({
    products,
    favoriteIds = [],
    onFavoriteToggle,
    onAddToCart,
    className
}: ProductGridProps) {
    if (products.length === 0) {
        return (
            <div className="w-full py-20 text-center text-neutral-500">
                No products found.
            </div>
        );
    }

    return (
        <div
            className={cn(
                "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10",
                className
            )}
        >
            {products.map((product) => (
                <ProductCard
                    key={product.id}
                    product={product}
                    isFavorite={favoriteIds.includes(product.id)}
                    onAddToCart={onAddToCart}
                    onFavoriteToggle={onFavoriteToggle}
                />
            ))}
        </div>
    );
}
