"use client";

import React from 'react';
import { CustomButton } from './custom-button';
import { cn } from '@/lib/utils';
import { ArrowLeft } from 'lucide-react';

interface FavoritesToolbarProps {
    onContinueShopping?: () => void;
    className?: string;
}

export function FavoritesToolbar({
    onContinueShopping,
    className
}: FavoritesToolbarProps) {
    return (
        <div className={cn("flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-6", className)}>
            <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">
                My Favourite Products
            </h1>

            <CustomButton
                variant="outlined"
                text="Continue Shopping"
                leftIcon={<ArrowLeft className="w-4 h-4" />}
                className="bg-white"
                onClick={onContinueShopping}
            />
        </div>
    );
}
