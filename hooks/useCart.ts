"use client";

import { useCartContext } from '@/context/CartContext';
import { QUANTITY_LIMITS } from '@/types/checkout';
import { DELIVERY_CITIES } from '@/lib/constants/delivery-cities';

export interface ApiCartItem {
  id: string;
  productId: string;
  name: string;
  size: string;
  color: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  image: string;
}

export const useCart = () => {
  const context = useCartContext();

  const calculateSubtotal = () => {
    return context.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const calculateShippingCost = (city: string, method: string) => {
    const cityData = DELIVERY_CITIES.find(c => c.name === city);
    if (!cityData) return 0;

    if (method.includes('domicile') || method.toLowerCase().includes('home')) {
      return cityData.home_delivery;
    }
    if (method.includes('yalidine') || method.toLowerCase().includes('bureau') || method.toLowerCase().includes('desk')) {
      return cityData.desk_delivery ?? cityData.home_delivery;
    }
    return 0;
  };

  const calculateTotal = (city: string, method: string) => {
    return calculateSubtotal() + calculateShippingCost(city, method);
  };

  return {
    ...context,
    subtotal: calculateSubtotal(),
    calculateShippingCost,
    calculateTotal,
  };
};
