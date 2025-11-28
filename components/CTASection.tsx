import React from 'react';
import { CustomButton } from '@/components/ui';
import { ArrowRight } from 'lucide-react';

interface CTASectionProps {
  onGetStarted?: () => void;
}

export const CTASection: React.FC<CTASectionProps> = ({ onGetStarted }) => {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-rose-400 via-rose-300 to-primary-400">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Content */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Refresh Your Wardrobe?
          </h2>
          
          <p className="text-base sm:text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands who discovered their perfect style. Start shopping today and enjoy exclusive offers!
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <CustomButton
              variant="filled"
              text="Start Shopping"
              rightIcon={<ArrowRight className="w-5 h-5" />}
              onClick={onGetStarted}
              className="px-8 py-4 text-base font-semibold bg-white text-rose-400 hover:bg-neutral-50"
            />
            <CustomButton
              variant="outlined"
              text="Browse Collections"
              onClick={onGetStarted}
              className="px-8 py-4 text-base font-semibold text-rose-400 border-white hover:bg-white/10"
            />
          </div>

          {/* Trust Badges */}
          <div className="mt-12 pt-8 border-t border-white/20">
            <div className="flex flex-wrap gap-8 justify-center items-center text-white/80">
              <div className="flex items-center gap-2">
                <span className="text-2xl">✓</span>
                <span className="text-sm sm:text-base">All Algeria Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">✓</span>
                <span className="text-sm sm:text-base">Secure Payment</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">✓</span>
                <span className="text-sm sm:text-base">Quality Guaranteed</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
