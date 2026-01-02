"use client";

import React, { useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, Star, ShoppingCart } from 'lucide-react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Product } from '@/lib/types/product';
import { CustomButton } from './custom-button';

export interface ProductCardProps {
  product: Product;
  isFavorite?: boolean;
  onFavoriteToggle?: (id: string) => void;
  onAddToCart?: (id: string) => void;
  className?: string;
}

const productCardVariants = cva(
  [
    "bg-white flex flex-col overflow-hidden",
    "transition-all duration-300",
    "focus-within:ring-2 focus-within:ring-offset-2",
    "group"
  ],
  {
    variants: {
      hover: {
        true: "shadow-lg",
        false: "shadow-sm hover:shadow-lg"
      }
    },
    defaultVariants: {
      hover: false
    }
  }
);

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isFavorite = false,
  onFavoriteToggle,
  onAddToCart,
  className,
}) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [favoriteAnimation, setFavoriteAnimation] = useState(false);

  const handleImageLoad = useCallback(() => {
    setImageLoading(false);
  }, []);

  const handleImageError = useCallback(() => {
    setImageLoading(false);
    setImageError(true);
  }, []);

  const handleFavoriteClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setFavoriteAnimation(true);
    setTimeout(() => setFavoriteAnimation(false), 300);

    onFavoriteToggle?.(product.id);
  }, [product.id, onFavoriteToggle]);

  const handleAddToCart = useCallback(() => {
    onAddToCart?.(product.id);
  }, [product.id, onAddToCart]);

  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(product.rating);
    const hasHalfStar = product.rating % 1 !== 0;
    const emptyStars = 5 - Math.ceil(product.rating);

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star
          key={`full-${i}`}
          className="w-4 h-4 text-yellow-400 fill-yellow-400"
        />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative inline-block">
          <Star className="w-4 h-4 text-neutral-300" />
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          </div>
        </div>
      );
    }

    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star
          key={`empty-${i}`}
          className="w-4 h-4 text-neutral-300"
        />
      );
    }

    return stars;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'DZD',
      minimumFractionDigits: 2,
    }).format(price);
  };

  return (
    <Link
      href={`/products/${product.id}`}
      className={cn(
        productCardVariants({ hover: isHovered }),
        "gap-2 sm:gap-3 block",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-labelledby={`product-title-${product.id}`}
    >
      <div className={cn(
        "relative overflow-hidden bg-neutral-100",
        "transition-all duration-300 w-full aspect-square"
      )}>
        {!imageError ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={cn(
              "object-cover transition-all duration-300",
              imageLoading && "opacity-0",
              isHovered && "scale-105"
            )}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-neutral-200">
            <div className="text-neutral-400 text-center">
              <ShoppingCart className="w-12 h-12 mx-auto mb-2" />
              <span className="text-sm">Image unavailable</span>
            </div>
          </div>
        )}

        {imageLoading && (
          <div className="absolute inset-0 bg-neutral-100 animate-pulse" />
        )}

        <button
          type="button"
          onClick={handleFavoriteClick}
          className={cn(
            "absolute top-2 right-2 sm:top-3 sm:right-3",
            "w-8 h-8 sm:w-10 sm:h-10",
            "transition-all duration-200 cursor-pointer z-10",
            favoriteAnimation && "animate-ping"
          )}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart
            className={cn(
              "w-5 h-5 sm:w-6 sm:h-6 transition-all duration-200",
              isFavorite
                ? "text-red-500 fill-red-500"
                : "text-neutral-400 hover:text-red-400",
              favoriteAnimation && "scale-125"
            )}
          />
        </button>

        <div
          className={cn(
            "absolute inset-x-0 bottom-0 p-2 sm:p-3 md:p-4",
            "transition-all duration-300",
            isHovered
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4 pointer-events-none"
          )}
        >
          <CustomButton
            variant="filled"
            text="Add to cart"
            leftIcon={<ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />}
            onClick={handleAddToCart}
            className="w-full bg-white/95 backdrop-blur-sm text-neutral-600 hover:bg-white hover:shadow-md"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:gap-2.5 md:gap-3 px-2 pb-2 sm:px-3 sm:pb-3">
        <h3
          id={`product-title-${product.id}`}
          className="text-neutral-600 font-normal leading-snug line-clamp-2 text-sm sm:text-base"
          title={product.name}
        >
          {product.name}
        </h3>

        <div
          className="flex items-center gap-1 sm:gap-1.5"
          role="img"
          aria-label={`Rating: ${product.rating} out of 5 stars`}
        >
          <div className="flex items-center gap-0.5">
            {renderStars()}
          </div>
          <span className="text-neutral-400 text-xs sm:text-sm ml-1">
            ({product.rating})
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-neutral-600 text-base sm:text-lg md:text-xl font-semibold">
            {formatPrice(product.price)}
          </span>

          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-neutral-300 text-sm sm:text-base line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

ProductCard.displayName = 'ProductCard';

export { ProductCard };
