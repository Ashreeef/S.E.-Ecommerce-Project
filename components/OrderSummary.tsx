import React from 'react';
import CartItem from '@/components/ui/cartItem';
import type { CartItem as CartItemType } from '@/types/checkout';

interface OrderSummaryProps {
  cartItems: CartItemType[];
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  subtotal: number;
  shippingCost: number;
  total: number;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  cartItems,
  removeItem,
  updateQuantity,
  subtotal,
  shippingCost,
  total,
}) => {
  return (
    <div className="flex flex-col gap-6 p-6 border border-neutral-200 rounded-lg bg-white shadow-sm h-fit sticky top-8">
      <h2 className="text-xl sm:text-2xl font-semibold text-neutral-900">
        Order Summary
      </h2>

      {/* Cart Items */}
      <div className="flex flex-col gap-4">
        {cartItems.length === 0 ? (
          <div className="text-center py-8 text-neutral-500">
            No items in cart
          </div>
        ) : (
          cartItems.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              removeItem={removeItem}
              updateQuantity={updateQuantity}
            />
          ))
        )}
      </div>

      {/* Price Breakdown */}
      <div className="flex flex-col gap-4 pt-4 border-t border-neutral-200">
        <div className="flex justify-between items-center">
          <span className="text-base text-neutral-600">Subtotal</span>
          <span className="text-base font-medium text-neutral-900">
            {subtotal.toFixed(2)} DA
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-base text-neutral-600">Shipping</span>
          <span className="text-base font-medium text-neutral-900">
            {shippingCost > 0 ? `${shippingCost.toFixed(2)} DA` : 'Free'}
          </span>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-neutral-200">
          <span className="text-lg font-semibold text-neutral-900">Total</span>
          <span className="text-rose-400 text-2xl font-semibold">
            {total.toFixed(2)} DA
          </span>
        </div>
      </div>
    </div>
  );
};
