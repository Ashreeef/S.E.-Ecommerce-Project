import { User } from '@supabase/supabase-js';

/**
 * Check if a user has admin role
 */
export function isAdmin(user: User | null): boolean {
  if (!user) return false;
  
  const userRole = user.user_metadata?.role;
  return userRole === 'admin' || userRole === 'super_admin';
}

/**
 * Check if a user is a client
 */
export function isClient(user: User | null): boolean {
  if (!user) return false;
  
  const userRole = user.user_metadata?.role;
  return userRole === 'client' || !userRole; // Default to client if no role
}

/**
 * Get user role
 */
export function getUserRole(user: User | null): string {
  if (!user) return 'guest';
  return user.user_metadata?.role || 'client';
}
