'use client';

import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';
import CustomButton from '@/components/ui/custom-button';
import { useAuth } from '@/hooks/useAuth';

export default function UnauthorizedPage() {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50">
      <div className="max-w-md w-full px-6 py-12 bg-white rounded-2xl shadow-xl text-center space-y-6">
        <div className="flex justify-center">
          <div className="h-20 w-20 bg-error-100 text-error-400 rounded-full flex items-center justify-center">
            <ShieldAlert size={40} />
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-neutral-900">
            Access Denied
          </h1>
          <p className="text-neutral-600">
            You don&apos;t have permission to access this page.
          </p>
          <p className="text-sm text-neutral-500">
            This area is restricted to administrators only.
          </p>
        </div>

        <div className="pt-4 space-y-3">
          <Link href="/">
            <CustomButton
              text="Go to Home"
              variant="filled"
              className="w-full justify-center"
            />
          </Link>
          <CustomButton
            text="Logout"
            variant="outlined"
            className="w-full justify-center"
            onClick={logout}
          />
        </div>
      </div>
    </div>
  );
}
