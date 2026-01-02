"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

export interface ColorSelectorProps {
  colors: Array<{ name: string; hex: string }>;
  selectedColor: string;
  onColorSelect: (color: string) => void;
  className?: string;
}

export function ColorSelector({
  colors,
  selectedColor,
  onColorSelect,
  className,
}: ColorSelectorProps) {
  return (
    <div className={cn('flex flex-col items-start gap-3 sm:gap-4', className)}>
      <h3 className="text-neutral-600 text-base sm:text-lg font-medium">Color</h3>
      <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
        {colors.map((color, index) => (
          <button
            key={`${color.name}-${index}`}
            onClick={() => onColorSelect(color.name)}
            className={cn(
              'w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 transition-all duration-200 cursor-pointer',
              'focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2',
              'hover:scale-105',
              selectedColor === color.name
                ? 'border-neutral-900 scale-110'
                : 'border-neutral-300'
            )}
            style={{ backgroundColor: color.hex }}
            aria-label={`Select ${color.name} color`}
            aria-pressed={selectedColor === color.name}
          >
            {selectedColor === color.name && (
              <Check
                className={cn(
                  "w-5 h-5 mx-auto",
                  color.hex === '#FFFFFF' || color.hex === '#ffffff'
                    ? 'text-neutral-900'
                    : 'text-white'
                )}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
