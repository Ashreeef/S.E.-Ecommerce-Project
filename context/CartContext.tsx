"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { ApiCartItem } from '@/hooks/useCart';

interface CartContextType {
    cartItems: ApiCartItem[];
    itemCount: number;
    isLoading: boolean;
    error: string | null;
    addItem: (productId: string, size?: string, color?: string, quantity?: number) => Promise<boolean>;
    removeItem: (id: string | number) => Promise<void>;
    updateQuantity: (id: string | number, newQuantity: number) => Promise<void>;
    clearCart: () => Promise<void>;
    refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

function getSessionId(): string {
    if (typeof window === 'undefined') return '';
    let sessionId = localStorage.getItem('cart_session_id');
    if (!sessionId) {
        sessionId = 'sess_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
        localStorage.setItem('cart_session_id', sessionId);
    }
    return sessionId;
}

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [cartItems, setCartItems] = useState<ApiCartItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCart = useCallback(async () => {
        try {
            setIsLoading(true);
            const sessionId = getSessionId();
            const res = await fetch(`${API_BASE}/api/cart`, {
                headers: { 'X-Session-ID': sessionId },
                credentials: 'include'
            });
            if (res.ok) {
                const data = await res.json();
                setCartItems(data);
            }
        } catch (err) {
            console.error('Failed to fetch cart:', err);
            setError('Failed to load cart');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    const addItem = async (productId: string, size?: string, color?: string, quantity: number = 1) => {
        try {
            const sessionId = getSessionId();
            const res = await fetch(`${API_BASE}/api/cart`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Session-ID': sessionId
                },
                credentials: 'include',
                body: JSON.stringify({ productId, size, color, quantity })
            });
            if (res.ok) {
                await fetchCart();
                return true;
            }
            return false;
        } catch (err) {
            console.error('Failed to add to cart:', err);
            return false;
        }
    };

    const removeItem = async (id: string | number) => {
        try {
            const res = await fetch(`${API_BASE}/api/cart/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            if (res.ok) {
                setCartItems(items => items.filter(item => item.id !== id));
            }
        } catch (err) {
            console.error('Failed to remove from cart:', err);
        }
    };

    const updateQuantity = async (id: string | number, newQuantity: number) => {
        try {
            const res = await fetch(`${API_BASE}/api/cart/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ quantity: newQuantity })
            });
            if (res.ok) {
                setCartItems(items =>
                    items.map(item => item.id === id ? { ...item, quantity: newQuantity } : item)
                );
            }
        } catch (err) {
            console.error('Failed to update quantity:', err);
        }
    };

    const clearCart = async () => {
        try {
            const sessionId = getSessionId();
            await fetch(`${API_BASE}/api/cart/clear`, {
                method: 'DELETE',
                headers: { 'X-Session-ID': sessionId },
                credentials: 'include'
            });
            setCartItems([]);
        } catch (err) {
            console.error('Failed to clear cart:', err);
        }
    };

    const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <CartContext.Provider value={{
            cartItems,
            itemCount,
            isLoading,
            error,
            addItem,
            removeItem,
            updateQuantity,
            clearCart,
            refreshCart: fetchCart
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCartContext = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCartContext must be used within a CartProvider');
    }
    return context;
};
