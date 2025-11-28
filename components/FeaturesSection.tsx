import React from 'react';
import { Truck, Shield, Sparkles, HeartHandshake, Package, Clock } from 'lucide-react';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: <Truck className="w-8 h-8" />,
    title: 'Nationwide Delivery',
    description: 'We deliver to all 58 wilayas across Algeria',
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: 'Secure Payment',
    description: 'Multiple safe and secure payment options',
  },
  {
    icon: <Sparkles className="w-8 h-8" />,
    title: 'Premium Quality',
    description: 'Every piece carefully selected for excellence',
  },
  {
    icon: <HeartHandshake className="w-8 h-8" />,
    title: 'Customer Satisfaction',
    description: 'We prioritize your happiness with every purchase',
  },
  {
    icon: <Package className="w-8 h-8" />,
    title: 'Elegant Packaging',
    description: 'Beautiful packaging worthy of a masterpiece',
  },
  {
    icon: <Clock className="w-8 h-8" />,
    title: 'Exceptional Service',
    description: 'Our team is always here to help you',
  },
];

export const FeaturesSection: React.FC = () => {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-600 mb-4">
            Why Tuhfaaa?
          </h2>
          <p className="text-base sm:text-lg text-neutral-500">
            An exceptional shopping experience designed for you
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-6 sm:p-8 border border-neutral-200 rounded-2xl hover:border-rose-300 hover:shadow-lg transition-all duration-300 bg-white"
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center bg-rose-50 text-rose-400 rounded-xl mb-4 group-hover:bg-rose-400 group-hover:text-white transition-colors duration-300">
                {feature.icon}
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-neutral-600 mb-3">
                {feature.title}
              </h3>
              <p className="text-sm sm:text-base text-neutral-500 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
