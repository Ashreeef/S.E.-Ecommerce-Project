import React from 'react';
import Image from 'next/image';
import { ArrowRight, Star } from 'lucide-react';
import { CustomButton } from '@/components/ui';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  badge?: string;
}

const featuredProducts: Product[] = [
  {
    id: '1',
    name: 'Ensemble Élégant',
    price: 4500,
    originalPrice: 6000,
    rating: 4.9,
    reviews: 67,
    image: '/assets/outfit.JPG',
    badge: 'Best Seller',
  },
  {
    id: '2',
    name: 'Robe d\'Été Chic',
    price: 3200,
    rating: 4.8,
    reviews: 43,
    image: '/assets/dress.JPG',
    badge: 'New Arrival',
  },
  {
    id: '3',
    name: 'Veste Moderne',
    price: 3800,
    originalPrice: 5000,
    rating: 4.7,
    reviews: 52,
    image: '/assets/jacket.JPG',
  },
  {
    id: '4',
    name: 'Jupe Classique',
    price: 2900,
    rating: 4.8,
    reviews: 38,
    image: '/assets/skirt.JPG',
  },
];

interface FeaturedProductsSectionProps {
  onViewProduct?: (productId: string) => void;
  onViewAllProducts?: () => void;
}

export const FeaturedProductsSection: React.FC<FeaturedProductsSectionProps> = ({
  onViewProduct,
  onViewAllProducts,
}) => {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12 sm:mb-16">
          <div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-600 mb-2">
              Featured Pieces
            </h2>
            <p className="text-base sm:text-lg text-neutral-500">
              Handpicked masterpieces just for you
            </p>
          </div>
          <CustomButton
            variant="outlined"
            text="View All"
            rightIcon={<ArrowRight className="w-4 h-4" />}
            onClick={onViewAllProducts}
            className="self-start sm:self-auto"
          />
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => onViewProduct?.(product.id)}
              className="group cursor-pointer"
            >
              {/* Product Image */}
              <div className="relative aspect-square bg-neutral-100 rounded-2xl overflow-hidden mb-4 shadow-md group-hover:shadow-xl transition-shadow duration-300">
                {/* Badge */}
                {product.badge && (
                  <div className="absolute top-3 left-3 px-3 py-1 bg-rose-400 text-white text-xs font-semibold rounded-full z-10">
                    {product.badge}
                  </div>
                )}

                {/* Product Image */}
                <Image
                  src={product.image}
                  alt={product.name}
                  width={400}
                  height={400}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />

                {/* Quick View Overlay */}
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              </div>

              {/* Product Info */}
              <div className="space-y-2">
                <h3 className="text-base sm:text-lg font-semibold text-neutral-600 line-clamp-1">
                  {product.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm text-neutral-500">
                    {product.rating} ({product.reviews} reviews)
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-neutral-600">
                    {product.price.toFixed(2)} DA
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-neutral-400 line-through">
                      {product.originalPrice.toFixed(2)} DA
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
