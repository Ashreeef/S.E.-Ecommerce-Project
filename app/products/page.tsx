"use client";

import React, { useState, useMemo } from 'react';
import { NavBar } from '@/components/ui';
import { Footer } from '@/components/ui/footer';
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
        <div className="min-h-screen flex flex-col bg-white">
            <NavBar />

            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* <div className="mb-8">
                    <h1 className="text-3xl font-bold text-neutral-900 mb-2">Women&apos;s Clothing</h1>
                    <p className="text-neutral-500">Explore our latest collection of trendy outfits.</p>
                </div> */}

                <ProductsToolbar
                    totalProducts={sortedProducts.length}
                    currentSort={sortOption}
                    onSortChange={setSortOption}
                />

                <ProductGrid 
                    products={paginatedProducts}
                    favoriteIds={favorites}
                    onFavoriteToggle={toggleFavorite}
                    onAddToCart={(id) => console.log('Add to cart:', id)}
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
            </main>

            <Footer />
        </div>
    );
}
