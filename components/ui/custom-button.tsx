"use client";

import React, { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';


export type ButtonVariant = 'filled' | 'outlined' | 'link';

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  /** Controls the enabled/disabled state of the button @default true */
  state?: boolean;
  /** Visual style variant of the button @default 'filled' */
  variant?: ButtonVariant;
  /** Icon to display on the left side of the button text */
  leftIcon?: ReactNode;
  /** Icon to display on the right side of the button text */
  rightIcon?: ReactNode;
  /** Button text content */
  text: string;
  /** Additional CSS classes to apply to the button */
  className?: string;
  /** Click event handler */
  onClick?: () => void;
  /** Loading state - displays spinner and disables interaction @default false */
  loading?: boolean;
  /** HTML button type attribute @default 'button' */
  htmlType?: 'button' | 'submit' | 'reset';
  /** Disabled state - overrides the state prop @default false */
  disabled?: boolean;
}

export const CustomButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    state = true,
    variant = 'filled',
    leftIcon,
    rightIcon,
    text,
    className,
    onClick,
    loading = false,
    htmlType = 'button',
    disabled,
    ...props
  }, ref) => {
    
    const isDisabled = disabled || !state || loading;
    
    // Base styles that apply to all buttons
    const baseStyles = cn(
      // Layout
      'inline-flex items-center justify-center',
      // Spacing
      'px-6 py-3 sm:px-10 sm:py-4',
      'gap-2 sm:gap-3',
      // Typography
      'text-sm sm:text-base font-medium',
      // Visual
      'rounded-full',
      'whitespace-nowrap select-none',
      // Interactions
      'transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      // Cursor
      isDisabled ? 'cursor-not-allowed' : loading ? 'cursor-wait' : 'cursor-pointer'
    );

    // Variant-specific styles
    const variantStyles = {
      filled: isDisabled
        ? 'bg-neutral-300 text-neutral-500 border-transparent'
        : cn(
            'bg-black text-neutral-100 border-transparent',
            'hover:bg-neutral-700 hover:shadow-md',
            'focus:ring-neutral-500',
            'active:bg-neutral-800'
          ),
      outlined: isDisabled
        ? 'bg-transparent text-neutral-300 border border-neutral-300'
        : cn(
            'bg-white text-neutral-600 border border-neutral-300',
            'hover:bg-neutral-50 hover:border-neutral-400 hover:shadow-sm',
            'focus:ring-neutral-500 focus:border-neutral-500',
            'active:bg-neutral-100'
          ),
      link: isDisabled
        ? 'bg-transparent text-neutral-400 border-transparent'
        : cn(
            'bg-transparent text-error-400 border-transparent',
            'hover:text-error-500 hover:underline',
            'focus:ring-error-400',
            'active:text-error-600'
          ),
    };

    const buttonClasses = cn(
      baseStyles,
      variantStyles[variant],
      className
    );
    
    const LoadingSpinner = () => (
      <svg
        className="animate-spin w-4 h-4 sm:w-5 sm:h-5"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="2"
          strokeOpacity="0.3"
        />
        <path
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          fill="currentColor"
        />
      </svg>
    );

    const IconContainer = ({ children }: { children: React.ReactNode }) => (
      <span 
        className="flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center" 
        aria-hidden="true"
      >
        {children}
      </span>
    );

    // Render
    return (
      <button
        ref={ref}
        type={htmlType}
        className={buttonClasses}
        onClick={!isDisabled ? onClick : undefined}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        aria-busy={loading}
        aria-label={loading ? `${text} - Loading` : text}
        {...props}
      >
        {loading ? (
          <IconContainer>
            <LoadingSpinner />
          </IconContainer>
        ) : (
          leftIcon && <IconContainer>{leftIcon}</IconContainer>
        )}

        <span className="flex-1 text-center">
          {loading ? 'Loading...' : text}
        </span>

        {rightIcon && !loading && (
          <IconContainer>{rightIcon}</IconContainer>
        )}
      </button>
    );
  }
);

CustomButton.displayName = 'CustomButton';

export default CustomButton;
