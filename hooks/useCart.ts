import { useState, useEffect } from 'react';
import { CartItem, SHIPPING_COSTS, QUANTITY_LIMITS } from '@/types/checkout';

const CART_STORAGE_KEY = 'ecommerce_cart';

// Helper function to generate unique cart item key
const getCartItemKey = (productId: string, size: string, color: string) => {
  return `${productId}-${size}-${color}`;
};

// Load cart from localStorage
const loadCartFromStorage = (): CartItem[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading cart:', error);
    return [];
  }
};

// Save cart to localStorage
const saveCartToStorage = (items: CartItem[]) => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error('Error saving cart:', error);
  }
};

export const useCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart on mount
  useEffect(() => {
    const items = loadCartFromStorage();
    setCartItems(items);
    setIsLoaded(true);
  }, []);

  // Save cart whenever it changes
  useEffect(() => {
    if (isLoaded) {
      saveCartToStorage(cartItems);
    }
  }, [cartItems, isLoaded]);

  const addItem = (item: Omit<CartItem, 'id'> & { productId: string; size: string; color: string }) => {
    const itemKey = getCartItemKey(item.productId, item.size, item.color);
    
    setCartItems((items) => {
      // Check if item with same product, size, and color already exists
      const existingIndex = items.findIndex(
        (i) => getCartItemKey(i.id.toString(), i.size, i.color) === itemKey
      );

      if (existingIndex !== -1) {
        // Update quantity of existing item
        const updatedItems = [...items];
        const newQuantity = Math.min(
          updatedItems[existingIndex].quantity + item.quantity,
          QUANTITY_LIMITS.max
        );
        updatedItems[existingIndex] = {
          ...updatedItems[existingIndex],
          quantity: newQuantity,
        };
        return updatedItems;
      } else {
        // Add new item
        const newItem: CartItem = {
          id: Date.now(), // Use timestamp as unique ID
          name: item.name,
          size: item.size,
          color: item.color,
          price: item.price,
          originalPrice: item.originalPrice,
          quantity: item.quantity,
          image: item.image,
        };
        return [...items, newItem];
      }
    });
  };

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

  const clearCart = () => {
    setCartItems([]);
  };

  const getItemCount = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const calculateShippingCost = (shippingMethod: string) => {
    if (shippingMethod.includes('domicile') || shippingMethod.includes('home')) {
      return SHIPPING_COSTS.domicile;
    }
    if (shippingMethod.includes('yalidine') || shippingMethod.includes('bureau')) {
      return SHIPPING_COSTS.yalidine;
    }
    return SHIPPING_COSTS.default;
  };

  const calculateTotal = (shippingMethod: string) => {
    return calculateSubtotal() + calculateShippingCost(shippingMethod);
  };

  return {
    cartItems,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getItemCount,
    subtotal: calculateSubtotal(),
    calculateShippingCost,
    calculateTotal,
    isLoaded,
  };
};
