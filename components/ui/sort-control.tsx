"use client";

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CustomButton } from './custom-button';

export type SortOption = 'price-asc' | 'price-desc' | 'default';

interface SortControlProps {
    currentSort: SortOption;
    onSortChange: (sort: SortOption) => void;
    className?: string;
}

export function SortControl({ currentSort, onSortChange, className }: SortControlProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const options: { value: SortOption; label: string }[] = [
        { value: 'default', label: 'Recommended' },
        { value: 'price-asc', label: 'Price: Low to High' },
        { value: 'price-desc', label: 'Price: High to Low' },
    ];

    const currentLabel = options.find(o => o.value === currentSort)?.label || 'Sort';

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className={cn("relative", className)} ref={dropdownRef}>
            <div className="flex items-center gap-2">
                <CustomButton
                    variant="outlined"
                    text={currentLabel}
                    rightIcon={<ChevronDown className={cn("w-4 h-4 transition-transform duration-200", isOpen && "rotate-180")} />}
                    onClick={() => setIsOpen(!isOpen)}
                    className="min-w-[200px] bg-white [&>span]:text-left justify-between px-4"
                />
            </div>

            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-full min-w-[200px] bg-white rounded-xl shadow-lg border border-neutral-100 py-1 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    {options.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => {
                                onSortChange(option.value);
                                setIsOpen(false);
                            }}
                            className={cn(
                                "w-full text-left px-4 py-2.5 text-md transition-colors",
                                currentSort === option.value
                                    ? "bg-neutral-50 text-neutral-900 font-medium"
                                    : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                            )}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
