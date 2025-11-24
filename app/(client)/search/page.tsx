"use client";

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductGrid } from '@/components/ui/product-grid';
import { ProductsToolbar } from '@/components/ui/products-toolbar';
import { NavigationButtons } from '@/components/ui/navigation-buttons';
import { useFavorites } from '@/hooks/useFavorites';
import { mockProducts } from '@/lib/mock-data';
import { SortOption } from '@/components/ui/sort-control';

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [sortOption, setSortOption] = useState<SortOption>('default');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;
  const { favorites, toggleFavorite } = useFavorites();

  // Reset page when query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [query]);

  const searchResults = useMemo(() => {
    // TODO: Replace with actual backend API call
    // const results = await fetch(`/api/search?q=${query}`).then(res => res.json());
    
    // For now: Filter products by title or description matching the query
    if (!query.trim()) {
      return mockProducts;
    }

    const searchLower = query.toLowerCase();
    return mockProducts.filter(product => 
      product.title.toLowerCase().includes(searchLower) ||
      product.description.toLowerCase().includes(searchLower) ||
      product.category.toLowerCase().includes(searchLower)
    );
  }, [query]);

  const sortedProducts = useMemo(() => {
    const products = [...searchResults];

    switch (sortOption) {
      case 'price-asc':
        return products.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return products.sort((a, b) => b.price - a.price);
      default:
        return products;
    }
  }, [searchResults, sortOption]);

  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * productsPerPage;
    return sortedProducts.slice(startIndex, startIndex + productsPerPage);
  }, [sortedProducts, currentPage]);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Search Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-2">
          {query ? `Search results for "${query}"` : 'Search Results'}
        </h1>
        {query && (
          <p className="text-neutral-500">
            Found {sortedProducts.length} {sortedProducts.length === 1 ? 'product' : 'products'}
          </p>
        )}
      </div>

      {sortedProducts.length > 0 ? (
        <>
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
        </>
      ) : (
        <div className="w-full py-20 text-center">
          <h2 className="text-xl font-semibold text-neutral-900 mb-2">No results found</h2>
          <p className="text-neutral-500">
            Try searching with different keywords or browse all products
          </p>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center text-neutral-500">Loading search results...</div>
      </div>
    }>
      <SearchResults />
    </Suspense>
  );
}
