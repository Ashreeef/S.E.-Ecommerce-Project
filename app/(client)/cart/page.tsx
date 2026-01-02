"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CartItem from '@/components/ui/cartItem';
import { CustomButton } from '@/components/ui';
import { ArrowLeft, ArrowRight, Ticket } from 'lucide-react';
import { useCart } from '@/hooks/useCart';

export default function CartPage() {
  const router = useRouter();
  const {
    cartItems,
    isLoading,
    removeItem,
    updateQuantity,
    subtotal
  } = useCart();

  const [couponCode, setCouponCode] = useState("");

  // Wrapper functions to handle the async nature
  const handleRemoveItem = (id: string | number) => {
    removeItem(String(id));
  };

  const handleUpdateQuantity = (id: string | number, newQuantity: number) => {
    updateQuantity(String(id), newQuantity);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-lg text-neutral-500">Loading cart...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold text-neutral-900">Shopping Cart</h1>
        <CustomButton
          variant="outlined"
          text="Continue Shopping"
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          onClick={() => router.push('/products')}
        />
      </div>

      {/* Cart Content */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Products List */}
        <div className="lg:col-span-3 space-y-2 p-4 border border-neutral-200 rounded-lg">
          {cartItems.length === 0 ? (
            <div className="text-center py-12 text-neutral-500">
              No items in the cart yet.
            </div>
          ) : (
            cartItems.map((item) => (
              <CartItem
                key={item.id}
                item={{
                  id: item.id,
                  name: item.name,
                  size: item.size,
                  color: item.color,
                  price: item.price,
                  originalPrice: item.originalPrice,
                  quantity: item.quantity,
                  image: item.image
                }}
                removeItem={handleRemoveItem}
                updateQuantity={handleUpdateQuantity}
              />
            ))
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-2">
          <div className="border border-neutral-200 rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-neutral-900">
                Order Summary
              </h2>
              <span className="text-xl text-neutral-900">
                {cartItems.length} item{cartItems.length !== 1 ? 's' : ''}
              </span>
            </div>

            <div className="flex justify-between items-center mb-3">
              <span className="text-neutral-500">Total amount:</span>
              <span className="text-rose-400 text-2xl font-semibold">
                {subtotal.toFixed(2)} DZD
              </span>
            </div>

            <hr className="my-4 border-neutral-200 w-full" />

            {/* Coupon Code Section */}
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">
              Coupon Code
            </h3>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="w-full border border-neutral-200 rounded-full px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-neutral-300"
                />
                <span className="absolute inset-y-0 right-4 flex items-center text-neutral-400">
                  <Ticket size={18} />
                </span>
              </div>
              <CustomButton
                variant="filled"
                text="Apply"
                onClick={() => console.log('Apply coupon:', couponCode)}
              />
            </div>
          </div>

          {/* Checkout Button */}
          <CustomButton
            variant="filled"
            text="Proceed to Checkout"
            className="w-full mt-4"
            rightIcon={<ArrowRight className="w-4 h-4" />}
            onClick={() => router.push('/checkout')}
          />
        </div>
      </div>
    </div>
  );
}
