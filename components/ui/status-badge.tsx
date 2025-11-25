"use client";

import React, { forwardRef, HTMLAttributes } from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

export type BadgeState = 
  | 'delivered' 
  | 'available' 
  | 'confirmed' 
  | 'pending' 
  | 'sent' 
  | 'cancelled' 
  | 'out-of-stock' 
  | 'returned';

export interface StatusBadgeProps extends HTMLAttributes<HTMLDivElement> {
  state: BadgeState;
  text?: string;
  showDot?: boolean;
  interactive?: boolean;
  loading?: boolean;
}


const statusBadgeVariants = cva(
  [
    "inline-flex items-center justify-center rounded-full",
    "whitespace-nowrap font-normal leading-normal",
    "transition-all duration-200",
    "select-none"
  ],
  {
    variants: {
      state: {
        delivered: [
          "bg-success-100 text-success-400",
          "[&>div]:bg-success-400"
        ],
        available: [
          "bg-success-100 text-success-400",
          "[&>div]:bg-success-400"
        ],
        confirmed: [
          "bg-second01-50 text-second01-200",
          "[&>div]:bg-second01-200"
        ],
        pending: [
          "bg-neutral-200 text-neutral-400",
          "[&>div]:bg-neutral-400"
        ],
        sent: [
          "bg-[#FFCCA6] text-[#C9640C]",
          "[&>div]:bg-[#C9640C]"
        ],
        cancelled: [
          "bg-[#FFB2B2] text-error-300",
          "[&>div]:bg-error-300"
        ],
        "out-of-stock": [
          "bg-[#FFB2B2] text-error-300",
          "[&>div]:bg-error-300"
        ],
        returned: [
          "bg-warning-100 text-warning-400",
          "[&>div]:bg-warning-400"
        ],
      },
      interactive: {
        true: [
          "cursor-pointer",
          "focus:outline-none focus:ring-2 focus:ring-offset-1",
          "hover:opacity-90 hover:scale-[1.02]"
        ],
        false: ""
      },
      loading: {
        true: "animate-pulse",
        false: ""
      }
    },
    defaultVariants: {
      state: "pending",
      interactive: false,
      loading: false
    }
  }
);

const STATE_TEXT_MAP: Record<BadgeState, string> = {
  'delivered': 'Delivered',
  'available': 'Available', 
  'confirmed': 'Confirmed',
  'pending': 'Pending',
  'sent': 'Sent',
  'cancelled': 'Cancelled',
  'out-of-stock': 'Out of stock',
  'returned': 'Returned'
};

const StatusBadge = forwardRef<HTMLDivElement, StatusBadgeProps>(
  ({
    state,
    text,
    showDot = true,
    interactive = false,
    loading = false,
    className,
    ...props
  }, ref) => {

    const displayText = text || STATE_TEXT_MAP[state];

    return (
      <div
        ref={ref}
        className={cn(
          statusBadgeVariants({ state, interactive, loading }),
          "px-2 py-1 sm:px-3 sm:py-1.5",
          "text-xs",
          state === 'confirmed' ? "gap-1 sm:gap-1.5" : "gap-0.5 sm:gap-1",
          className
        )}
        role={interactive ? "button" : "status"}
        tabIndex={interactive ? 0 : undefined}
        aria-label={`Status: ${displayText}`}
        {...props}
      >
        {showDot && (
          <div 
            className="rounded-full aspect-square flex-shrink-0 w-[5px] h-[5px] sm:w-[6px] sm:h-[6px]"
            aria-hidden="true" 
          />
        )}
        <span>{displayText}</span>
      </div>
    );
  }
);

StatusBadge.displayName = 'StatusBadge';

export { StatusBadge, statusBadgeVariants };
