import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(_req: NextRequest) {
  // TEMPORARILY DISABLED - Using client-side protection instead
  // Middleware can't access localStorage where Supabase stores sessions
  // Protection is handled in the layout.tsx files instead
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
