import { useState } from 'react';
import { CartItem, SHIPPING_COSTS, QUANTITY_LIMITS } from '@/types/checkout';

const INITIAL_CART_ITEMS: CartItem[] = [
  {
    id: 1,
    name: 'Denim baggy jeans',
    size: 'XL',
    color: 'Navy blue',
    price: 3500.0,
    originalPrice: 4500.0,
    quantity: 1,
    image: '',
  },
  {
    id: 2,
    name: 'Denim baggy jeans',
    size: 'XL',
    color: 'Navy blue',
    price: 3500.0,
    originalPrice: 4500.0,
    quantity: 1,
    image: '',
  },
  {
    id: 3,
    name: 'Denim baggy jeans',
    size: 'XL',
    color: 'Navy blue',
    price: 3500.0,
    originalPrice: 4500.0,
    quantity: 2,
    image: '',
  },
];

export const useCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>(INITIAL_CART_ITEMS);

  const removeItem = (id: number) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < QUANTITY_LIMITS.min || newQuantity > QUANTITY_LIMITS.max) return;

    setCartItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const calculateShippingCost = (shippingMethod: string) => {
    if (shippingMethod.includes('domicile')) {
      return SHIPPING_COSTS.domicile;
    }
    if (shippingMethod.includes('yalidine')) {
      return SHIPPING_COSTS.yalidine;
    }
    return SHIPPING_COSTS.default;
  };

  const calculateTotal = (shippingMethod: string) => {
    return calculateSubtotal() + calculateShippingCost(shippingMethod);
  };

  return {
    cartItems,
    removeItem,
    updateQuantity,
    subtotal: calculateSubtotal(),
    calculateShippingCost,
    calculateTotal,
  };
};
