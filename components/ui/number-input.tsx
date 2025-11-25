"use client";

import React, { forwardRef, useState, useEffect, useRef, InputHTMLAttributes } from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Minus, Plus, Loader2 } from 'lucide-react';

export interface NumberInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value' | 'type' | 'min' | 'max' | 'step'> {
  value?: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  allowDecimals?: boolean;
  formatValue?: (value: number) => string;
  loading?: boolean;
  error?: boolean;
}


const numberInputContainerVariants = cva(
  [
    "inline-flex items-center rounded bg-white border",
    "transition-all duration-200"
  ],
  {
    variants: {
      error: {
        true: [
          "border-error-300",
          "focus-within:ring-2 focus-within:ring-error-200"
        ],
        false: [
          "border-neutral-400",
          "focus-within:ring-2 focus-within:ring-neutral-300"
        ]
      },
      disabled: {
        true: "opacity-50 cursor-not-allowed",
        false: ""
      }
    },
    defaultVariants: {
      error: false,
      disabled: false
    }
  }
);

const numberInputButtonVariants = cva(
  [
    "flex items-center justify-center aspect-square rounded",
    "transition-all duration-150",
    "focus:outline-none focus:ring-2 focus:ring-neutral-300"
  ],
  {
    variants: {
      disabled: {
        true: [
          "text-neutral-300 cursor-not-allowed",
          "hover:bg-transparent"
        ],
        false: [
          "text-neutral-600 cursor-pointer",
          "hover:bg-neutral-100 active:bg-neutral-200"
        ]
      }
    },
    defaultVariants: {
      disabled: false
    }
  }
);

const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  ({
    value,
    onChange,
    min = 0,
    max = 100,
    step = 1,
    disabled = false,
    allowDecimals = false,
    formatValue,
    loading = false,
    error = false,
    placeholder = "0",
    className,
    onFocus,
    onBlur,
    onKeyDown,
    ...props
  }, ref) => {

    const [internalValue, setInternalValue] = useState<number | undefined>(value);
    const [inputValue, setInputValue] = useState<string>('');
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const incrementTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
    const decrementTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

    useEffect(() => {
      setInternalValue(value);
      setInputValue(value !== undefined ? String(value) : '');
    }, [value]);

    const clampValue = (val: number): number => Math.max(min, Math.min(max, val));
    const isAtMin = internalValue !== undefined && internalValue <= min;
    const isAtMax = internalValue !== undefined && internalValue >= max;

    const getDisplayValue = (): string => {
      if (isFocused) return inputValue;
      if (internalValue === undefined) return '';
      if (formatValue) return formatValue(internalValue);
      return allowDecimals ? internalValue.toString() : Math.floor(internalValue).toString();
    };

    const handleValueChange = (newValue: number) => {
      const clampedValue = clampValue(newValue);
      setInternalValue(clampedValue);
      setInputValue(String(clampedValue));
      onChange?.(clampedValue);
    };

    const increment = () => {
      if (disabled || loading || isAtMax) return;
      
      const currentVal = internalValue ?? min;
      const newValue = allowDecimals ? currentVal + step : Math.floor(currentVal) + step;
      
      if (newValue <= max) {
        handleValueChange(newValue);
      }
    };

    const decrement = () => {
      if (disabled || loading || isAtMin) return;
      
      const currentVal = internalValue ?? min;
      const newValue = allowDecimals ? currentVal - step : Math.floor(currentVal) - step;
      
      if (newValue >= min) {
        handleValueChange(newValue);
      }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value;
      setInputValue(rawValue);

      if (rawValue === '') {
        setInternalValue(undefined);
        return;
      }

      const numericValue = allowDecimals ? parseFloat(rawValue) : parseInt(rawValue, 10);
      
      if (!isNaN(numericValue)) {
        const clampedValue = clampValue(numericValue);
        setInternalValue(clampedValue);
        onChange?.(clampedValue);
      }
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      
      if (internalValue === undefined) {
        const defaultValue = clampValue(min);
        setInternalValue(defaultValue);
        setInputValue(String(defaultValue));
        onChange?.(defaultValue);
      } else {
        setInputValue(String(internalValue));
      }
      
      onBlur?.(e);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          increment();
          break;
        case 'ArrowDown':
          e.preventDefault();
          decrement();
          break;
        case 'PageUp':
          e.preventDefault();
          handleValueChange(clampValue((internalValue ?? min) + step * 10));
          break;
        case 'PageDown':
          e.preventDefault();
          handleValueChange(clampValue((internalValue ?? min) - step * 10));
          break;
        case 'Home':
          e.preventDefault();
          handleValueChange(min);
          break;
        case 'End':
          e.preventDefault();
          handleValueChange(max);
          break;
      }
      
      onKeyDown?.(e);
    };

    const handleMouseDown = (action: 'increment' | 'decrement') => {
      const performAction = action === 'increment' ? increment : decrement;
      performAction();
      const timeoutRef = action === 'increment' ? incrementTimeoutRef : decrementTimeoutRef;
      
      timeoutRef.current = setTimeout(() => {
        const interval = setInterval(performAction, 100);
        
        const cleanup = () => {
          clearInterval(interval);
          document.removeEventListener('mouseup', cleanup);
          document.removeEventListener('mouseleave', cleanup);
        };
        
        document.addEventListener('mouseup', cleanup);
        document.addEventListener('mouseleave', cleanup);
      }, 500);
    };

    const handleMouseUp = () => {
      if (incrementTimeoutRef.current) {
        clearTimeout(incrementTimeoutRef.current);
      }
      if (decrementTimeoutRef.current) {
        clearTimeout(decrementTimeoutRef.current);
      }
    };

    useEffect(() => {
      const inc = incrementTimeoutRef.current;
      const dec = decrementTimeoutRef.current;
      return () => {
        if (inc) clearTimeout(inc);
        if (dec) clearTimeout(dec);
      };
    }, []);

    return (
      <div 
        className={cn(
          numberInputContainerVariants({ error, disabled }),
          "px-2 py-2 sm:px-3 sm:py-3",
          "gap-4 sm:gap-6",
          className
        )}
      >
        <button
          type="button"
          className={numberInputButtonVariants({ 
            disabled: disabled || loading || isAtMin 
          })}
          onClick={decrement}
          onMouseDown={() => handleMouseDown('decrement')}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          disabled={disabled || loading || isAtMin}
          aria-label="Decrease value"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 sm:w-[18px] sm:h-[18px] animate-spin" />
          ) : (
            <Minus className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
          )}
        </button>

        <input
          ref={ref || inputRef}
          type="text"
          inputMode="numeric"
          pattern={allowDecimals ? "[0-9]*\\.?[0-9]*" : "[0-9]*"}
          value={getDisplayValue()}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          disabled={disabled || loading}
          placeholder={placeholder}
          className={cn(
            "flex-1 bg-transparent text-center outline-none font-medium text-neutral-600",
            "text-sm sm:text-base",
            "min-w-0 w-8",
            disabled && "cursor-not-allowed"
          )}
          aria-label="Number input"
          {...props}
        />

        <button
          type="button"
          className={numberInputButtonVariants({ 
            disabled: disabled || loading || isAtMax 
          })}
          onClick={increment}
          onMouseDown={() => handleMouseDown('increment')}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          disabled={disabled || loading || isAtMax}
          aria-label="Increase value"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 sm:w-[18px] sm:h-[18px] animate-spin" />
          ) : (
            <Plus className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
          )}
        </button>

      </div>
    );
  }
);

NumberInput.displayName = 'NumberInput';

export { NumberInput, numberInputContainerVariants, numberInputButtonVariants };
