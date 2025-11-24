"use client";

import React from 'react';
import { cn } from '@/lib/utils';

export interface SizeOption {
  value: string;
  label: string;
  available?: boolean;
}

export interface SizeSelectorProps {
  sizes: string[];
  selectedSize: string;
  onSizeSelect: (size: string) => void;
  className?: string;
}

export function SizeSelector({
  sizes,
  selectedSize,
  onSizeSelect,
  className,
}: SizeSelectorProps) {
  return (
    <div className={cn('flex flex-col items-start gap-3 sm:gap-4', className)}>
      <h3 className="text-neutral-600 text-base sm:text-lg font-medium">Size</h3>
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        {sizes.map((size) => (
          <button
            key={size}
            onClick={() => onSizeSelect(size)}
            className={cn(
              'px-4 py-2 sm:px-6 sm:py-2.5 rounded-md border-2 transition-all duration-200',
              'text-sm sm:text-base font-medium cursor-pointer',
              'hover:border-neutral-400',
              'focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2',
              selectedSize === size
                ? 'border-neutral-900 bg-neutral-900 text-white'
                : 'border-neutral-300 bg-white text-neutral-600'
            )}
            aria-label={`Select size ${size}`}
            aria-pressed={selectedSize === size}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
}
