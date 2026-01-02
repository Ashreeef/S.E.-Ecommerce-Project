"use client";

import React from 'react';
import { NavBar } from '@/components/ui';
import { Footer } from '@/components/ui/footer';
import { useCart } from '@/hooks/useCart';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { getItemCount } = useCart();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <NavBar cartItemCount={getItemCount()} />
      
      <main className="flex-grow">
        {children}
      </main>
      
      <Footer />
    </div>
  );
}
