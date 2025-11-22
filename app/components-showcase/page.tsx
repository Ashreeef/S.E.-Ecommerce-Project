"use client";

import React, { useState } from 'react';
import { NavBar, Footer, CustomButton, Input, StatusBadge, NumberInput, ProductCard, NavigationButton, NavigationButtons } from '@/components/ui';
import { ShoppingCart, Heart, Search } from 'lucide-react';

export default function ComponentsShowcasePage() {
  const [quantity, setQuantity] = useState(1);
  const [searchValue, setSearchValue] = useState('');

  const sampleProduct = {
    id: '1',
    title: 'Premium Wireless Headphones',
    image: '/assets/product.webp',
    price: 2900,
    originalPrice: 3900,
    rating: 4.5,
    isFavorite: false
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <NavBar 
        cartItemCount={quantity}
        onSearch={(query) => console.log('Search:', query)}
        onWishlist={() => console.log('Wishlist')}
        onCart={() => console.log('Cart')}
      />
      
      <div className="py-8 px-4 sm:py-12 sm:px-6">
        <div className="max-w-5xl mx-auto space-y-8">
        
        <header className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
            UI Components
          </h1>
        </header>

        <section className="bg-white rounded-lg p-6 sm:p-8 shadow border border-slate-200">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">CustomButton</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
            <CustomButton variant="filled" text="Filled" />
            <CustomButton variant="outlined" text="Outlined" />
            <CustomButton variant="filled" text="With Icon" leftIcon={<ShoppingCart className="w-4 h-4" />} />
            <CustomButton variant="outlined" text="Wishlist" leftIcon={<Heart className="w-4 h-4" />} />
          </div>
          <pre className="bg-slate-900 text-slate-100 p-4 rounded text-xs sm:text-sm overflow-x-auto">
{`<CustomButton variant="filled" text="Filled" />
<CustomButton variant="outlined" text="Outlined" />
<CustomButton 
  variant="filled" 
  text="With Icon" 
  leftIcon={<ShoppingCart />} 
/>`}
          </pre>
        </section>

        <section className="bg-white rounded-lg p-6 sm:p-8 shadow border border-slate-200">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">Input</h2>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <Input
              variant="text"
              label="Search"
              placeholder="Enter text..."
              value={searchValue}
              onChange={setSearchValue}
              leftIcon={<Search className="w-4 h-4" />}
            />
            <Input
              variant="list"
              label="Category"
              placeholder="Select..."
              options={['Electronics', 'Clothing', 'Books']}
            />
          </div>
          <pre className="bg-slate-900 text-slate-100 p-4 rounded text-xs sm:text-sm overflow-x-auto">
{`<Input
  variant="text"
  label="Search"
  placeholder="Enter text..."
  leftIcon={<Search />}
/>
<Input
  variant="list"
  label="Category"
  options={['Electronics', 'Clothing']}
/>`}
          </pre>
        </section>

        <section className="bg-white rounded-lg p-6 sm:p-8 shadow border border-slate-200">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">StatusBadge</h2>
          <div className="flex flex-wrap gap-3 mb-4">
            <StatusBadge state="delivered" />
            <StatusBadge state="pending" />
            <StatusBadge state="confirmed" />
            <StatusBadge state="cancelled" />
            <StatusBadge state="out-of-stock" />
          </div>
          <pre className="bg-slate-900 text-slate-100 p-4 rounded text-xs sm:text-sm overflow-x-auto">
{`<StatusBadge state="delivered" />
<StatusBadge state="pending" />
<StatusBadge state="confirmed" />
<StatusBadge state="cancelled" />
<StatusBadge state="out-of-stock" />`}
          </pre>
        </section>

        <section className="bg-white rounded-lg p-6 sm:p-8 shadow border border-slate-200">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">NumberInput</h2>
          <div className="grid sm:grid-cols-3 gap-6 mb-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Quantity</label>
              <NumberInput value={quantity} onChange={setQuantity} min={1} max={99} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Disabled</label>
              <NumberInput value={5} disabled />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Error</label>
              <NumberInput value={5} error />
            </div>
          </div>
          <pre className="bg-slate-900 text-slate-100 p-4 rounded text-xs sm:text-sm overflow-x-auto">
{`<NumberInput 
  value={quantity} 
  onChange={setQuantity} 
  min={1} 
  max={99} 
/>
<NumberInput value={5} disabled />
<NumberInput value={5} error />`}
          </pre>
        </section>

        <section className="bg-white rounded-lg p-6 sm:p-8 shadow border border-slate-200">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">ProductCard</h2>
          <div className="max-w-sm mb-4">
            <ProductCard product={sampleProduct} />
          </div>
          <pre className="bg-slate-900 text-slate-100 p-4 rounded text-xs sm:text-sm overflow-x-auto">
{`<ProductCard 
  product={{
    id: '1',
    title: 'Premium Wireless Headphones',
    image: '/assets/product.webp',
    price: 299.99,
    originalPrice: 399.99,
    rating: 4.5,
    isFavorite: false
  }}
  onFavoriteToggle={(id) => console.log(id)}
  onAddToCart={(id) => console.log(id)}
/>`}
          </pre>
        </section>

        <section className="bg-white rounded-lg p-6 sm:p-8 shadow border border-slate-200">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">Navigation Buttons</h2>
          <div className="space-y-6 mb-4">
            <div className="flex flex-wrap gap-6">
              <div>
                <p className="text-sm text-slate-600 mb-2">Single Buttons</p>
                <div className="flex gap-3">
                  <NavigationButton direction="previous" />
                  <NavigationButton direction="next" />
                  <NavigationButton direction="previous" disabled />
                  <NavigationButton direction="next" loading />
                </div>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-2">Button Group</p>
                <NavigationButtons 
                  onPrevious={() => console.log('prev')}
                  onNext={() => console.log('next')}
                />
              </div>
            </div>
          </div>
          <pre className="bg-slate-900 text-slate-100 p-4 rounded text-xs sm:text-sm overflow-x-auto">
{`<NavigationButton direction="previous" />
<NavigationButton direction="next" />

<NavigationButtons 
  onPrevious={() => handlePrev()}
  onNext={() => handleNext()}
  disablePrevious={false}
  disableNext={false}
/>`}
          </pre>
        </section>

      </div>
      </div>

      <Footer />
    </div>
  );
}
