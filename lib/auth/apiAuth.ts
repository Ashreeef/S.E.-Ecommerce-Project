import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * Utility to protect API routes with authentication
 * Use this in your API route handlers to ensure users are authenticated
 */
export async function getAuthenticatedUser(req: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  // Get the Authorization header
  const authHeader = req.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { user: null, error: 'Missing or invalid authorization header' };
  }

  const token = authHeader.replace('Bearer ', '');

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  // Verify the token and get user
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  if (error || !user) {
    return { user: null, error: 'Invalid or expired token' };
  }

  return { user, error: null };
}

/**
 * Middleware wrapper to protect API routes
 * Usage:
 * 
 * export async function PUT(req: NextRequest) {
 *   return withAuth(req, async (user) => {
 *     // Your protected route logic here
 *     // user is guaranteed to be authenticated
 *     return NextResponse.json({ data: 'protected data' });
 *   });
 * }
 */
export async function withAuth(
  req: NextRequest,
  handler: (user: { id: string; email?: string }) => Promise<NextResponse>
) {
  const { user, error } = await getAuthenticatedUser(req);

  if (error || !user) {
    return NextResponse.json(
      { error: error || 'Unauthorized' },
      { status: 401 }
    );
  }

  return handler(user);
}

/**
 * Alternative: Check session from cookies (for API routes called from browser)
 */
export async function getSessionFromCookies(req: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  // Extract session token from cookies
  const accessToken = req.cookies.get('sb-access-token')?.value;

  if (!accessToken) {
    return { session: null, error: 'No session found' };
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error || !session) {
    return { session: null, error: 'Invalid session' };
  }

  return { session, error: null };
}
