"use client";

import React, { forwardRef, ButtonHTMLAttributes } from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

export interface NavigationButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  direction?: 'previous' | 'next';
  loading?: boolean;
}

const navigationButtonVariants = cva(
  [
    "inline-flex items-center justify-center",
    "bg-white rounded border aspect-square",
    "transition-all duration-200",
    "focus:outline-none focus:ring-2 focus:ring-neutral-300 focus:ring-offset-2"
  ],
  {
    variants: {
      disabled: {
        true: [
          "border-neutral-300 cursor-not-allowed opacity-60",
          "text-neutral-300"
        ],
        false: [
          "border-neutral-400 cursor-pointer",
          "hover:border-neutral-500 hover:bg-neutral-50",
          "active:bg-neutral-100",
          "text-neutral-500"
        ]
      }
    },
    defaultVariants: {
      disabled: false
    }
  }
);

const NavigationButton = forwardRef<HTMLButtonElement, NavigationButtonProps>(
  ({
    direction = 'next',
    loading = false,
    disabled = false,
    className,
    children,
    ...props
  }, ref) => {

    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          navigationButtonVariants({ disabled: isDisabled }),
          "p-3 sm:p-4",
          className
        )}
        disabled={isDisabled}
        aria-label={loading ? 'Loading' : direction === 'previous' ? 'Previous' : 'Next'}
        {...props}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
        ) : children ? children : direction === 'previous' ? (
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        ) : (
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        )}
      </button>
    );
  }
);

NavigationButton.displayName = 'NavigationButton';

export { NavigationButton, navigationButtonVariants };
