"use client";

import React, { useState, useMemo } from 'react';
import { ProductGrid } from '@/components/ui/product-grid';
import { ProductsToolbar } from '@/components/ui/products-toolbar';
import { NavigationButtons } from '@/components/ui/navigation-buttons';
import { useFavorites } from '@/hooks/useFavorites';
import { useProducts } from '@/hooks/useProductsApi';
import { SortOption } from '@/components/ui/sort-control';

export default function ProductsPage() {
    const [sortOption, setSortOption] = useState<SortOption>('default');
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 12;
    const { favorites, toggleFavorite } = useFavorites();
    const { data, isLoading, isError } = useProducts();

    // Transform API data to match component format
    const products = useMemo(() => {
        return (data?.data || []).map((product: any) => ({
            id: product.id,
            title: product.name,
            image: product.images?.[0] || '',
            price: product.price,
            originalPrice: product.original_price,
            rating: product.rating,
            category: product.category,
            availableSizes: product.available_sizes || [],
            description: '',
            isAvailable: product.is_available,
            images: product.images?.map((url: string, index: number) => ({ 
                id: `${product.id}-${index}`, 
                url, 
                alt: product.name 
            })) || [],
            availableColors: product.available_colors?.map((color: string) => ({ 
                name: color, 
                hex: '#000000' 
            })) || [],
            gender: 'UNISEX' as const,
            stock: 10,
            date: product.created_at,
            sales: 0,
            status: product.is_available ? 'Available' as const : 'Out-of-stock' as const,
            reviewCount: product.review_count,
        }));
    }, [data]);

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

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">Loading products...</div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center text-red-500">Error loading products</div>
            </div>
        );
    }

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
