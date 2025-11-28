"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
}

export interface ProductImageGalleryProps {
  images: ProductImage[];
  productName: string;
  className?: string;
}

export function ProductImageGallery({
  images,
  productName,
  className,
}: ProductImageGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  return (
    <div className={cn('flex flex-col items-start gap-2 sm:gap-3 w-full lg:w-auto', className)}>
      {/* Main Image */}
      <div className="relative aspect-square bg-neutral-100 rounded-lg overflow-hidden w-full max-w-[600px] lg:w-[500px] xl:w-[625px]">
        <Image
          src={images[selectedImageIndex].url}
          alt={images[selectedImageIndex].alt || `${productName} - Image ${selectedImageIndex + 1}`}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 1024px) 100vw, 625px"
        />
      </div>

      {/* Thumbnail Images */}
      <div className="flex items-center gap-2 sm:gap-3 w-full overflow-x-auto pb-2">
        {images.map((image, index) => (
          <button
            key={image.id}
            onClick={() => setSelectedImageIndex(index)}
            className={cn(
              'relative aspect-square bg-neutral-100 rounded-lg overflow-hidden transition-all flex-shrink-0 cursor-pointer',
              'w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 xl:w-[147px] xl:h-[147px]',
              selectedImageIndex === index
                ? 'border-2 border-neutral-900 ring-2 ring-neutral-300'
                : 'border-2 border-transparent hover:border-neutral-300'
            )}
            aria-label={`View image ${index + 1}`}
          >
            <Image
              src={image.url}
              alt={image.alt || `${productName} - Thumbnail ${index + 1}`}
              fill
              className="object-cover"
              sizes="147px"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
