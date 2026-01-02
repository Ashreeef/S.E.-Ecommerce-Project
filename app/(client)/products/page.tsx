"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { ProductGrid } from '@/components/ui/product-grid';
import { ProductsToolbar } from '@/components/ui/products-toolbar';
import { NavigationButtons } from '@/components/ui/navigation-buttons';
import { useFavorites } from '@/hooks/useFavorites';
import { useProducts } from '@/hooks/useProducts';
import { SortOption } from '@/components/ui/sort-control';

export default function ProductsPage() {
    const [sortOption, setSortOption] = useState<SortOption>('default');
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 12;
    const { favorites, toggleFavorite } = useFavorites();

    // Fetch products from API
    const { products, isLoading, error } = useProducts();

    const sortedProducts = useMemo(() => {
        const productsCopy = [...products];

        switch (sortOption) {
            case 'price-asc':
                return productsCopy.sort((a, b) => a.price - b.price);
            case 'price-desc':
                return productsCopy.sort((a, b) => b.price - a.price);
            default:
                return productsCopy;
        }
    }, [sortOption, products]);

    const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
    const paginatedProducts = useMemo(() => {
        const startIndex = (currentPage - 1) * productsPerPage;
        return sortedProducts.slice(startIndex, startIndex + productsPerPage);
    }, [sortedProducts, currentPage]);

    // Reset to page 1 when products change
    useEffect(() => {
        setCurrentPage(1);
    }, [products.length]);

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-center items-center min-h-[400px]">
                    <div className="text-lg text-neutral-500">Loading products...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {error && (
                <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700 text-sm">
                    {error} - Showing cached products
                </div>
            )}

            <ProductsToolbar
                totalProducts={sortedProducts.length}
                currentSort={sortOption}
                onSortChange={setSortOption}
            />

            <ProductGrid
                products={paginatedProducts}
                favoriteIds={favorites}
                onFavoriteToggle={toggleFavorite}
            />

            {totalPages > 1 && (
                <div className="flex justify-center mt-12">
                    <NavigationButtons
                        onPrevious={() => setCurrentPage(p => Math.max(1, p - 1))}
                        onNext={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disablePrevious={currentPage === 1}
                        disableNext={currentPage === totalPages}
                    />
                </div>
            )}
        </div>
    );
}
