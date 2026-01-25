'use client';

import { useState } from 'react';
import { useRequireAuth } from '@/hooks/useAuth';
import AdminSidebar from '@/features/admin/components/AdminSidebar';
import AdminHeader from '@/features/admin/components/AdminHeader';
import '@/styles/admin-layout.css';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAuthenticated, isLoading } = useRequireAuth();

  // Show loading spinner while checking authentication
  if (isLoading || isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-neutral-200 border-t-neutral-900 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // Block rendering completely if not authenticated
  // The useRequireAuth hook handles the redirect
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-neutral-200 border-t-neutral-900 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="admin-main">
        <AdminHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="admin-content">
          {children}
        </main>
      </div>
    </div>
  );
}


