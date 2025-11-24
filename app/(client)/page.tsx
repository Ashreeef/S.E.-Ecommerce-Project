"use client";

import React from 'react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-neutral-900 mb-4">
          Welcome to Our Store
        </h1>
        <p className="text-xl text-neutral-600 mb-8">
          Discover the latest fashion trends
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/products"
            className="bg-neutral-900 text-white px-8 py-3 rounded-md hover:bg-neutral-800 transition-colors"
          >
            Shop Now
          </Link>
        </div>
      </div>
    </div>
  );
}
