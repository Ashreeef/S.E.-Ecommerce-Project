"use client";

import React from 'react';
import { SortControl, SortOption } from './sort-control';
import { CustomButton } from './custom-button';
import { cn } from '@/lib/utils';
import { SlidersHorizontal } from 'lucide-react';

interface ProductsToolbarProps {
    totalProducts: number;
    currentSort: SortOption;
    onSortChange: (sort: SortOption) => void;
    className?: string;
}

export function ProductsToolbar({
    totalProducts,
    currentSort,
    onSortChange,
    className
}: ProductsToolbarProps) {
    return (
        <div className={cn("flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-6", className)}>
            <div className="text-neutral-600 font-medium">
                {totalProducts} {totalProducts === 1 ? 'result' : 'results'} found
            </div>

            <div className="flex items-center gap-3">
                <SortControl
                    currentSort={currentSort}
                    onSortChange={onSortChange}
                />

                <CustomButton
                    variant="outlined"
                    text="Filter"
                    rightIcon={<SlidersHorizontal className="w-4 h-4" />}
                    className="bg-white"
                />
            </div>
        </div>
    );
}
