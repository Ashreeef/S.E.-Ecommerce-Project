"use client";

import React, { useState } from 'react';
import { Heart, Star, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ProductImageGallery } from './product-image-gallery';
import { SizeSelector } from './size-selector';
import { ColorSelector } from './color-selector';
import { NumberInput } from './number-input';
import { CustomButton } from './custom-button';
import { ProductInfoAccordion } from './product-info-accordion';

export interface ProductDetailsViewProps {
  product: {
    id: string;
    name: string;
    category: string;
    type: string;
    isAvailable: boolean;
    rating: number;
    reviewCount: number;
    price: number;
    originalPrice?: number;
    images: Array<{ id: string; url: string; alt: string }>;
    availableSizes: string[];
    availableColors: Array<{ name: string; hex: string }>;
    description?: string;
    fit?: string;
    materials?: string;
    delivery?: string;
  };
  isFavorite?: boolean;
  onFavoriteToggle: () => void;
  onAddToCart: (options: { size: string; color: string; quantity: number }) => void;
  className?: string;
}

export function ProductDetailsView({
  product,
  isFavorite = false,
  onFavoriteToggle,
  onAddToCart,
  className,
}: ProductDetailsViewProps) {
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    if (selectedSize && selectedColor) {
      onAddToCart({ size: selectedSize, color: selectedColor, quantity });
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={`full-${i}`} className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-yellow-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative inline-block">
          <Star className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-300" />
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-yellow-400" />
          </div>
        </div>
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-300" />
      );
    }

    return stars;
  };

  const infoSections = [
    { key: 'description', title: 'Description', content: product.description || '' },
    { key: 'fit', title: 'Fit', content: product.fit || '' },
    { key: 'materials', title: 'Materials & Care', content: product.materials || '' },
    { key: 'delivery', title: 'Delivery & Returns', content: product.delivery || '' },
  ].filter(section => section.content);

  return (
    <div className={cn(
      'flex flex-col lg:flex-row justify-center items-start gap-6 sm:gap-8 lg:gap-12 w-full',
      className
    )}>
      {/* Image Gallery */}
      <ProductImageGallery
        images={product.images}
        productName={product.name}
      />

      {/* Product Details */}
      <div className="flex flex-col w-full lg:w-[500px] xl:w-[575px] gap-6 sm:gap-8">
        {/* Product Info */}
        <div className="flex flex-col items-start gap-3">
          {/* Availability */}
          <span className={cn(
            'text-sm sm:text-base font-medium',
            product.isAvailable ? 'text-green-600' : 'text-red-600'
          )}>
            {product.isAvailable ? 'Available' : 'Out of Stock'}
          </span>

          {/* Category */}
          <span className="text-neutral-400 text-xs sm:text-sm font-normal">
            {product.type} • {product.category}
          </span>

          {/* Title & Favorite */}
          <div className="flex items-start justify-between w-full gap-3">
            <h1 className="text-neutral-900 font-bold text-2xl sm:text-3xl lg:text-4xl xl:text-5xl leading-tight">
              {product.name}
            </h1>
            <button
              onClick={onFavoriteToggle}
              className="p-1 transition-all duration-200 cursor-pointer hover:scale-110 flex-shrink-0"
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart
                className={cn(
                  'w-6 h-6 transition-all duration-200',
                  isFavorite
                    ? 'text-red-500 fill-red-500'
                    : 'text-neutral-400 hover:text-red-400'
                )}
              />
            </button>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1">
              {renderStars(product.rating)}
            </div>
            <span className="text-neutral-400 text-xs sm:text-sm font-normal">
              {product.rating}/5 ({product.reviewCount} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <span className="text-neutral-900 text-xl sm:text-2xl lg:text-3xl font-semibold">
              {product.price.toFixed(2)} DZD
            </span>
            {product.originalPrice && (
              <span className="text-neutral-400 text-sm sm:text-base font-normal line-through">
                {product.originalPrice.toFixed(2)} DZD
              </span>
            )}
          </div>
        </div>

        {/* Size Selection */}
        <SizeSelector
          sizes={product.availableSizes}
          selectedSize={selectedSize}
          onSizeSelect={setSelectedSize}
        />

        {/* Color Selection */}
        <ColorSelector
          colors={product.availableColors}
          selectedColor={selectedColor}
          onColorSelect={setSelectedColor}
        />

        {/* Quantity & Add to Cart */}
        <div className="flex items-center gap-3 w-full">
          <NumberInput
            value={quantity}
            onChange={setQuantity}
            min={1}
            max={10}
            className="w-32"
          />
          
          <CustomButton
            variant="filled"
            text="Add to cart"
            leftIcon={<ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />}
            onClick={handleAddToCart}
            disabled={!product.isAvailable || !selectedSize || !selectedColor}
            className="flex-1"
          />
        </div>

        {/* Info Sections */}
        {infoSections.length > 0 && (
          <ProductInfoAccordion sections={infoSections} className="w-full" />
        )}
      </div>
    </div>
  );
}
