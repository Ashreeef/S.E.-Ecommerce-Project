"use client";

import { useState, useEffect, useCallback } from 'react';

const FAVORITES_KEY = 'favorite_products';

export function useFavorites() {
    const [favorites, setFavorites] = useState<string[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem(FAVORITES_KEY);
        if (stored) {
            try {
                setFavorites(JSON.parse(stored));
            } catch {
                setFavorites([]);
            }
        }
        setIsLoaded(true);
    }, []);

    const toggleFavorite = useCallback((productId: string) => {
        setFavorites(prev => {
            const newFavorites = prev.includes(productId)
                ? prev.filter(id => id !== productId)
                : [...prev, productId];
            
            localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
            return newFavorites;
        });
    }, []);

    const isFavorite = useCallback((productId: string) => {
        return favorites.includes(productId);
    }, [favorites]);

    const clearFavorites = useCallback(() => {
        setFavorites([]);
        localStorage.removeItem(FAVORITES_KEY);
    }, []);

    return {
        favorites,
        toggleFavorite,
        isFavorite,
        clearFavorites,
        isLoaded
    };
}
