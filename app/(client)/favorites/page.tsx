"use client";

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ProductGrid } from '@/components/ui/product-grid';
import { FavoritesToolbar } from '@/components/ui/favorites-toolbar';
import { NavigationButtons } from '@/components/ui/navigation-buttons';
import { useFavorites } from '@/hooks/useFavorites';
import { useProducts } from '@/hooks/useProducts';
import { Product } from '@/lib/types/product';

export default function FavoritesPage() {
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 12;
    const { favorites, toggleFavorite, isLoaded: favoritesLoaded } = useFavorites();
    const { products: allProducts, isLoading: productsLoading } = useProducts();

    const isLoaded = favoritesLoaded && !productsLoading;

    const favoriteProducts = useMemo(() => {
        return allProducts.filter((product: Product) => favorites.includes(product.id));
    }, [favorites, allProducts]);

    const totalPages = Math.ceil(favoriteProducts.length / productsPerPage);
    const paginatedProducts = useMemo(() => {
        const startIndex = (currentPage - 1) * productsPerPage;
        return favoriteProducts.slice(startIndex, startIndex + productsPerPage);
    }, [favoriteProducts, currentPage]);

    const handleContinueShopping = () => {
        router.push('/products');
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <FavoritesToolbar onContinueShopping={handleContinueShopping} />

            {!isLoaded ? (
                <div className="w-full py-20 text-center text-neutral-500">
                    Loading...
                </div>
            ) : favoriteProducts.length === 0 ? (
                <div className="w-full py-20 text-center">
                    <p className="text-neutral-500 text-lg mb-4">No favorite products yet.</p>
                    <p className="text-neutral-400">Start adding products to your favorites!</p>
                </div>
            ) : (
                <>
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
                </>
            )}
        </div>
    );
}
