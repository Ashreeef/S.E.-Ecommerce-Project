import React from 'react';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

interface Category {
  name: string;
  itemCount: number;
  image: string;
  color: string;
}

const categories: Category[] = [
  {
    name: 'Skirts',
    itemCount: 85,
    image: '/assets/jupe.JPG',
    color: 'from-rose-100 to-rose-50',
  },
  {
    name: 'Dresses',
    itemCount: 120,
    image: '/assets/dress.JPG',
    color: 'from-purple-100 to-purple-50',
  },
  {
    name: 'Jackets',
    itemCount: 65,
    image: '/assets/jacket.JPG',
    color: 'from-pink-100 to-pink-50',
  },
  {
    name: 'Outfits',
    itemCount: 95,
    image: '/assets/outfit.JPG',
    color: 'from-primary-200 to-primary-100',
  },
  {
    name: 'Shirts',
    itemCount: 110,
    image: '/assets/chemise.JPG',
    color: 'from-blue-100 to-blue-50',
  },
  {
    name: 'Blouses',
    itemCount: 75,
    image: '/assets/camisa.JPG',
    color: 'from-green-100 to-green-50',
  },
];

interface CategoriesSectionProps {
  onViewCategory?: (category: string) => void;
}

export const CategoriesSection: React.FC<CategoriesSectionProps> = ({ 
  onViewCategory 
}) => {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-neutral-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-600 mb-4">
            Shop by Category
          </h2>
          <p className="text-base sm:text-lg text-neutral-500">
            Browse through our carefully curated collections
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <div
              key={index}
              onClick={() => onViewCategory?.(category.name)}
              className="group cursor-pointer"
            >
              <div className={`relative aspect-square bg-gradient-to-br ${category.color} rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 mb-4`}>
                {/* Category Image */}
                <Image
                  src={category.image}
                  alt={category.name}
                  width={400}
                  height={400}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-neutral-600 mb-1">
                    {category.name}
                  </h3>
                  <p className="text-sm text-neutral-400">
                    {category.itemCount} pieces
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-neutral-400 group-hover:text-rose-400 group-hover:translate-x-1 transition-all duration-300" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
