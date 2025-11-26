import React from 'react';
import Image from 'next/image';
import { CustomButton } from '@/components/ui';
import { ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  onGetStarted?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onGetStarted }) => {
  return (
    <section className="relative bg-gradient-to-br from-neutral-50 via-white to-primary-100 py-16 sm:py-20 lg:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="flex flex-col gap-6 text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-neutral-600 leading-tight">
              Every Piece is a{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-rose-300">
                Masterpiece
              </span>
            </h1>
            
            <p className="text-base sm:text-lg text-neutral-500 max-w-xl mx-auto lg:mx-0">
              Tuhfaaa - Where elegance meets style. 
              Discover our exclusive collection of women&apos;s fashion designed to celebrate your uniqueness. 
              Wear what defines you.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mt-4">
              <CustomButton
                variant="filled"
                text="Shop Now"
                rightIcon={<ArrowRight className="w-5 h-5" />}
                onClick={onGetStarted}
                className="px-8 py-4 text-base font-semibold"
              />
              <CustomButton
                variant="outlined"
                text="View Collection"
                onClick={onGetStarted}
                className="px-8 py-4 text-base font-semibold"
              />
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 justify-center lg:justify-start mt-8 pt-8 border-t border-neutral-200">
              <div className="text-center lg:text-left">
                <div className="text-3xl font-bold text-neutral-600">58</div>
                <div className="text-sm text-neutral-400">Wilayas</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-3xl font-bold text-neutral-600">500+</div>
                <div className="text-sm text-neutral-400">Pieces</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-3xl font-bold text-neutral-600">1K+</div>
                <div className="text-sm text-neutral-400">Customers</div>
              </div>
            </div>
          </div>

          {/* Image/Illustration */}
          <div className="relative">
            <div className="aspect-square bg-gradient-to-br from-rose-100 to-rose-50 rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="/assets/jupe.JPG"
                alt="Tuhfaaa Fashion Collection"
                width={800}
                height={800}
                className="w-full h-full object-cover"
                priority
              />
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-rose-200 rounded-full opacity-50 blur-2xl"></div>
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-primary-300 rounded-full opacity-30 blur-3xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};
