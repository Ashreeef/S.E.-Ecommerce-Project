import { NextResponse, NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { withAuth } from '@/lib/auth/apiAuth';

// GET all orders (admin only)
export async function GET(request: NextRequest) {
  return withAuth(request, async () => {
    try {
      // Get the full user session to check admin role
      const token = request.headers.get('authorization')?.replace('Bearer ', '') || '';
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          global: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        }
      );

      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }

      // Check if user has admin role
      const userRole = user.user_metadata?.role || user.app_metadata?.role;
      if (userRole !== 'admin') {
        return NextResponse.json(
          { error: 'Forbidden. Admin access required.' },
          { status: 403 }
        );
      }

      // Create Supabase client with service role key to bypass RLS
      const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
          auth: {
            autoRefreshToken: false,
            persistSession: false
          }
        }
      );

      // Fetch all orders (bypassing RLS with service role)
      const { data: orders, error } = await supabaseAdmin
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching orders:', error);
        return NextResponse.json(
          { error: 'Failed to fetch orders', details: error.message },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        data: orders,
        count: orders?.length || 0,
      });
    } catch (error) {
      console.error('Unexpected error:', error);
      return NextResponse.json(
        { error: 'An unexpected error occurred', details: error instanceof Error ? error.message : String(error) },
        { status: 500 }
      );
    }
  });
}
