"use client";

import React, {
  forwardRef,
  useState,
  useRef,
  useEffect,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, Loader2 } from 'lucide-react';

/**
 * Input variant types
 */
export type InputVariant = 'text' | 'list';


export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value' | 'type'> {
  /** Input variant - TEXT for standard input, LIST for dropdown select @default 'text' */
  variant?: InputVariant;
  /** Label text displayed above the input */
  label?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Caption text displayed below the input (error message or helper text) */
  caption?: string;
  /** Icon to display on the left side of the input */
  leftIcon?: ReactNode;
  /** Icon to display on the right side of the input */
  rightIcon?: ReactNode;
  /** Current value of the input */
  value?: string;
  /** Change handler - receives the new value as a string */
  onChange?: (value: string) => void;
  /** Options for dropdown list variant @default [] */
  options?: string[];
  /** Loading state - displays spinner @default false */
  loading?: boolean;
  /** Error state - changes border and text colors @default false */
  error?: boolean;
  /** Disabled state @default false */
  disabled?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Input type attribute */
  type?: string;
  /** Focus event handler */
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  /** Blur event handler */
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}


const Input = forwardRef<HTMLInputElement, InputProps>(
  ({
    variant = 'text',
    label,
    placeholder,
    caption,
    leftIcon,
    rightIcon,
    value = '',
    onChange,
    options = [],
    loading = false,
    error = false,
    disabled = false,
    className,
    onFocus,
    onBlur,
    ...props
  }, ref) => {

    const [isFocused, setIsFocused] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [internalValue, setInternalValue] = useState(value);
    const [focusedOptionIndex, setFocusedOptionIndex] = useState(-1);

    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const blurTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const isListType = variant === 'list';
    const hasValue = Boolean(internalValue);
    const isError = error;
    const isActive = isFocused || (isListType && isDropdownOpen);

    // Sync internal value with prop
    useEffect(() => {
      if (value !== undefined && value !== internalValue) {
        setInternalValue(value);
      }
    }, [value, internalValue]);

    // Cleanup timeout on unmount
    useEffect(() => {
      return () => {
        if (blurTimeoutRef.current) {
          clearTimeout(blurTimeoutRef.current);
        }
      };
    }, []);

    const getInputBorderStyles = () => {
      if (isError) {
        return 'border-error-300 focus-within:ring-2 focus-within:ring-error-200';
      }
      if (isActive) {
        return 'border-neutral-400 focus-within:ring-2 focus-within:ring-neutral-300';
      }
      return 'border-neutral-300 focus-within:ring-2 focus-within:ring-neutral-200';
    };

    const getLabelColor = () => {
      if (isError) return 'text-error-300';
      if (isActive) return 'text-neutral-400';
      return 'text-neutral-500';
    };

    const getPlaceholderColor = () => {
      return hasValue || isActive ? 'text-neutral-500' : 'text-neutral-300';
    };

    const getCaptionColor = () => {
      return isError ? 'text-error-300' : 'text-neutral-400';
    };

    // Event Handlers
    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      // Clear any pending blur timeout
      if (blurTimeoutRef.current) {
        clearTimeout(blurTimeoutRef.current);
        blurTimeoutRef.current = null;
      }

      if (!disabled) {
        setIsFocused(true);
        if (isListType && !isDropdownOpen) {
          setIsDropdownOpen(true);
        }
      }
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      // Clear any existing timeout
      if (blurTimeoutRef.current) {
        clearTimeout(blurTimeoutRef.current);
      }

      // Set new timeout
      blurTimeoutRef.current = setTimeout(() => {
        // Check if we're still focused on an element within the container
        if (containerRef.current && !containerRef.current.contains(document.activeElement)) {
          setIsFocused(false);
          setIsDropdownOpen(false);
          setFocusedOptionIndex(-1);
        }
        blurTimeoutRef.current = null;
      }, 150);

      onBlur?.(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setInternalValue(newValue);
      onChange?.(newValue);
    };

    const handleOptionSelect = (option: string) => {
      setInternalValue(option);
      onChange?.(option);
      setIsDropdownOpen(false);
      setIsFocused(false);
      setFocusedOptionIndex(-1);
      inputRef.current?.blur();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (!isListType || !isDropdownOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setFocusedOptionIndex(prev =>
            prev < options.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setFocusedOptionIndex(prev =>
            prev > 0 ? prev - 1 : options.length - 1
          );
          break;
        case 'Enter':
          e.preventDefault();
          if (focusedOptionIndex >= 0 && options[focusedOptionIndex]) {
            handleOptionSelect(options[focusedOptionIndex]);
          }
          break;
        case 'Escape':
          e.preventDefault();
          setIsDropdownOpen(false);
          setFocusedOptionIndex(-1);
          inputRef.current?.blur();
          break;
      }
    };

    const handleInputClick = () => {
      if (isListType && !disabled && !loading) {
        // If dropdown is closed, open it; if open, keep it open
        if (!isDropdownOpen) {
          setIsDropdownOpen(true);
        }
        inputRef.current?.focus();
      }
    };

    // Close dropdown on outside click
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          if (blurTimeoutRef.current) {
            clearTimeout(blurTimeoutRef.current);
            blurTimeoutRef.current = null;
          }
          setIsDropdownOpen(false);
          setIsFocused(false);
          setFocusedOptionIndex(-1);
        }
      };

      if (isDropdownOpen) {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
      }
    }, [isDropdownOpen]);

    const renderIcon = (icon: React.ReactNode, size: string = 'w-5 h-5 sm:w-5 sm:h-5') => {
      if (React.isValidElement(icon)) {
        return (
          <span className={cn('flex-shrink-0 text-current', size)}>
            {icon}
          </span>
        );
      }
      return icon;
    };

    return (
      <div
        ref={containerRef}
        className={cn('flex flex-col items-start gap-2 w-full max-w-[385px] relative', className)}
      >
        {/* Label */}
        {label && (
          <label className={cn('font-normal text-sm sm:text-base leading-normal', getLabelColor())}>
            {label}
          </label>
        )}

        {/* Input Container */}
        <div
          className={cn(
            'flex items-center justify-between w-full bg-white',
            'border transition-all duration-200',
            isListType && isDropdownOpen ? 'rounded-t' : 'rounded',
            getInputBorderStyles()
          )}
        >
          <div className="flex items-center flex-1 gap-3 sm:gap-4 px-5 py-3.5 sm:px-6 sm:py-4">
            {/* Left Icon */}
            {leftIcon && (
              <div className="flex items-center">
                {renderIcon(leftIcon, 'w-4 h-4 sm:w-5 sm:h-5')}
              </div>
            )}

            {/* Input Field */}
            <input
              ref={ref || inputRef}
              type={isListType ? "text" : props.type ?? "text"}
              value={internalValue}
              onChange={isListType ? undefined : handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              onClick={handleInputClick}
              placeholder={placeholder}
              disabled={disabled || loading}
              readOnly={isListType}
              role={isListType ? "combobox" : undefined}
              className={cn(
                'flex-1 bg-transparent outline-none',
                'text-sm sm:text-base',
                'placeholder:transition-colors',
                `placeholder:${getPlaceholderColor()}`,
                disabled && 'cursor-not-allowed opacity-50',
                isListType && 'cursor-pointer'
              )}
              aria-invalid={isError}
              aria-describedby={caption ? 'input-caption' : undefined}
              aria-expanded={isListType ? isDropdownOpen : undefined}
              aria-haspopup={isListType ? "listbox" : undefined}
              {...props}
            />

            {/* Right Icon / Loading / Dropdown Arrow */}
            <div className="flex items-center">
              {loading ? (
                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin text-neutral-400" />
              ) : isListType ? (
                <ChevronDown
                  className={cn(
                    'w-4 h-4 sm:w-5 sm:h-5 text-neutral-400 transition-transform duration-200',
                    isDropdownOpen && 'rotate-180'
                  )}
                />
              ) : rightIcon ? (
                renderIcon(rightIcon, 'w-4 h-4 sm:w-5 sm:h-5')
              ) : null}
            </div>
          </div>
        </div>

        {/* Dropdown Options */}
        {isListType && isDropdownOpen && (
          <div
            className={cn(
              'absolute top-full left-0 right-0 z-50',
              'bg-white border-x border-b border-neutral-300 rounded-b',
              'max-h-60 overflow-y-auto shadow-lg'
            )}
            role="listbox"
            onMouseDown={(e) => {
              // Prevent blur when clicking inside dropdown
              e.preventDefault();
            }}
          >
            {options.length > 0 ? (
              options.map((option, index) => (
                <div
                  key={`${option}-${index}`}
                  role="option"
                  aria-selected={internalValue === option}
                  className={cn(
                    'px-3.5 py-2 text-sm sm:text-base cursor-pointer transition-colors duration-150',
                    'text-neutral-300 hover:bg-neutral-100 hover:text-neutral-600',
                    focusedOptionIndex === index && 'bg-neutral-100 text-neutral-600',
                    internalValue === option && 'bg-neutral-200 text-neutral-600'
                  )}
                  onClick={() => handleOptionSelect(option)}
                  onMouseEnter={() => setFocusedOptionIndex(index)}
                >
                  {option}
                </div>
              ))
            ) : (
              <div className="px-3.5 py-2 text-neutral-400 text-xs sm:text-sm">
                No options available
              </div>
            )}
          </div>
        )}

        {/* Caption */}
        {caption && (
          <div
            id="input-caption"
            className={cn('font-normal text-xs sm:text-sm', getCaptionColor())}
          >
            {caption}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
