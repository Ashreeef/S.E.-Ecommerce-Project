"use client";

import React from 'react';
import { useParams } from 'next/navigation';

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-neutral-900 mb-4">Product Details</h1>
        <p className="text-xl text-neutral-500 mb-2">Product ID: {productId}</p>
        <p className="text-xl text-neutral-500">Coming Soon</p>
      </div>
    </div>
  );
}
