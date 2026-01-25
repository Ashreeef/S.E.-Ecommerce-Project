'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  role?: string;
}

interface UseAuthOptions {
  redirectTo?: string;
  redirectIfFound?: boolean;
}

export function useAuth(options: UseAuthOptions = {}) {
  const { redirectTo = '/auth', redirectIfFound = false } = options;
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<AuthUser | null>(null);
  const router = useRouter();

  const checkAuth = useCallback(async () => {
    try {
      if (typeof window === 'undefined') {
        return { isValid: false, user: null };
      }
      
      // First check Supabase session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        const userData: AuthUser = {
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.name || 'Admin User',
          role: 'admin'
        };
        
        // Update localStorage for consistency
        localStorage.setItem('admin_token', session.access_token);
        localStorage.setItem('admin_user', JSON.stringify(userData));
        
        return { isValid: true, user: userData };
      }
      
      // Fallback to localStorage check
      const token = localStorage.getItem('admin_token');
      const userStr = localStorage.getItem('admin_user');
      
      if (token && userStr) {
        const parsedUser = JSON.parse(userStr);
        return { isValid: true, user: parsedUser };
      }
      
      return { isValid: false, user: null };
    } catch (error) {
      console.error('Auth check failed:', error);
      return { isValid: false, user: null };
    }
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      const { isValid, user: authUser } = await checkAuth();
      
      setUser(authUser);
      setIsAuthenticated(isValid);
      setIsLoading(false);

      // Handle redirects based on auth state
      if (!isValid && !redirectIfFound) {
        // Not authenticated and should be - redirect to login
        router.replace(redirectTo);
      } else if (isValid && redirectIfFound) {
        // Authenticated but shouldn't be on this page - redirect away
        router.replace(redirectTo);
      }
    };
    
    initAuth();
  }, [checkAuth, redirectTo, redirectIfFound, router]);

  const login = useCallback((token: string, userData: AuthUser) => {
    localStorage.setItem('admin_token', token);
    localStorage.setItem('admin_user', JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(async () => {
    // Sign out from Supabase
    await supabase.auth.signOut();
    
    // Clear localStorage
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    setUser(null);
    setIsAuthenticated(false);
    router.replace('/auth');
  }, [router]);

  return {
    isAuthenticated,
    isLoading,
    user,
    login,
    logout,
    checkAuth,
  };
}

/**
 * Hook specifically for protecting admin routes
 * Will redirect to /auth if not authenticated
 */
export function useRequireAuth() {
  return useAuth({ redirectTo: '/auth', redirectIfFound: false });
}

/**
 * Hook for auth page - redirects to /admin if already authenticated
 */
export function useRedirectIfAuthenticated() {
  return useAuth({ redirectTo: '/admin', redirectIfFound: true });
}
