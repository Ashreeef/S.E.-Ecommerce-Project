"use client";

import React from 'react';
import { NavBar } from '@/components/ui';
import { Footer } from '@/components/ui/footer';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <NavBar />
      
      <main className="flex-grow">
        {children}
      </main>
      
      <Footer />
    </div>
  );
}
