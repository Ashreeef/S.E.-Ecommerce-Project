"use client";

import React from 'react';
import { NavBar } from '@/components/ui';
import { Footer } from '@/components/ui/footer';
import { CartProvider, useCartContext } from '@/context/CartContext';

function NavBarWithCart() {
  const { itemCount } = useCartContext();
  return <NavBar cartItemCount={itemCount} />;
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col bg-white">
        <NavBarWithCart />

        <main className="flex-grow">
          {children}
        </main>

        <Footer />
      </div>
    </CartProvider>
  );
}
