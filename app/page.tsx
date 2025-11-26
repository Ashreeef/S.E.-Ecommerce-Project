"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { NavBar, Footer } from '@/components/ui';
import { HeroSection } from '@/components/HeroSection';
import { FeaturesSection } from '@/components/FeaturesSection';
import { CategoriesSection } from '@/components/CategoriesSection';
import { FeaturedProductsSection } from '@/components/FeaturedProductsSection';
import { TestimonialsSection } from '@/components/TestimonialsSection';
import { CTASection } from '@/components/CTASection';

export default function LandingPage() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/products');
  };

  const handleViewCategory = (category: string) => {
    router.push(`/products?category=${encodeURIComponent(category)}`);
  };

  const handleViewProduct = (productId: string) => {
    router.push(`/products/${productId}`);
  };

  const handleViewAllProducts = () => {
    router.push('/products');
  };

  return (
    <div className="min-h-screen bg-white">
      <NavBar />
      
      <main>
        <HeroSection onGetStarted={handleGetStarted} />
        <FeaturesSection />
        <CategoriesSection onViewCategory={handleViewCategory} />
        <FeaturedProductsSection 
          onViewProduct={handleViewProduct}
          onViewAllProducts={handleViewAllProducts}
        />
        <TestimonialsSection />
        <CTASection onGetStarted={handleGetStarted} />
      </main>

      <Footer />
    </div>
  );
}
