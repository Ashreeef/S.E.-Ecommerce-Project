"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { authService } from '@/lib/auth/authService';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, name?: string) => Promise<{ success: boolean; error?: string; requiresConfirmation?: boolean }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;

    // Check active session on mount
    const initializeAuth = async () => {
      try {
        const { session, error } = await authService.getSession();
        console.log('[useAuth] Initial session check:', { 
          hasSession: !!session, 
          user: session?.user?.email,
          error 
        });
        
        if (mounted) {
          setUser(session?.user ?? null);
          setLoading(false);
        }
      } catch (error) {
        console.error('[useAuth] Error checking session:', error);
        if (mounted) {
          setUser(null);
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = authService.onAuthStateChange((user) => {
      console.log('[useAuth] Auth state changed:', user?.email || 'logged out');
      if (mounted) {
        setUser(user);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signup = async (email: string, password: string, name?: string) => {
    try {
      console.log('[useAuth] Signup attempt for:', email);
      const { user, error } = await authService.signup({ email, password, name });
      
      if (error) {
        console.error('[useAuth] Signup error:', error);
        return {
          success: false,
          error: error.message || 'Signup failed',
        };
      }

      if (!user) {
        console.error('[useAuth] No user returned from signup');
        return {
          success: false,
          error: 'Signup failed - no user returned',
        };
      }

      console.log('[useAuth] Signup successful:', user.email);
      
      // Check if email confirmation is required
      if (user.email_confirmed_at) {
        setUser(user);
        await new Promise(resolve => setTimeout(resolve, 100));
        return { success: true, requiresConfirmation: false };
      } else {
        // Email confirmation required
        return { success: true, requiresConfirmation: true };
      }
    } catch (error: any) {
      console.error('[useAuth] Unexpected signup error:', error);
      return {
        success: false,
        error: error?.message || 'An unexpected error occurred',
      };
    }
  };

  const login = async (email: string, password: string) => {
    try {
      console.log('[useAuth] Login attempt for:', email);
      const { user, error } = await authService.login({ email, password });
      
      if (error) {
        console.error('[useAuth] Login error:', error);
        return {
          success: false,
          error: error.message || 'Invalid credentials',
        };
      }

      if (!user) {
        console.error('[useAuth] No user returned from login');
        return {
          success: false,
          error: 'Login failed - no user returned',
        };
      }

      console.log('[useAuth] Login successful:', user.email);
      setUser(user);
      
      // Wait a bit for the session to be fully persisted
      await new Promise(resolve => setTimeout(resolve, 100));
      
      return { success: true };
    } catch (error: any) {
      console.error('[useAuth] Unexpected login error:', error);
      return {
        success: false,
        error: error?.message || 'An unexpected error occurred',
      };
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    router.push('/auth');
  };

  const resetPassword = async (email: string) => {
    const { error } = await authService.resetPassword(email);
    
    if (error) {
      return {
        success: false,
        error: error.message || 'Failed to send reset email',
      };
    }

    return { success: true };
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
