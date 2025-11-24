"use client";

import React, { useState, useMemo } from 'react';
import { ProductGrid } from '@/components/ui/product-grid';
import { ProductsToolbar } from '@/components/ui/products-toolbar';
import { NavigationButtons } from '@/components/ui/navigation-buttons';
import { useFavorites } from '@/hooks/useFavorites';
import { mockProducts } from '@/lib/mock-data';
import { SortOption } from '@/components/ui/sort-control';

export default function ProductsPage() {
    const [sortOption, setSortOption] = useState<SortOption>('default');
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 12;
    const { favorites, toggleFavorite } = useFavorites();

    const sortedProducts = useMemo(() => {
        const products = [...mockProducts];

        switch (sortOption) {
            case 'price-asc':
                return products.sort((a, b) => a.price - b.price);
            case 'price-desc':
                return products.sort((a, b) => b.price - a.price);
            default:
                return products;
        }
    }, [sortOption]);

    const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
    const paginatedProducts = useMemo(() => {
        const startIndex = (currentPage - 1) * productsPerPage;
        return sortedProducts.slice(startIndex, startIndex + productsPerPage);
    }, [sortedProducts, currentPage]);

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
