'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { isAdmin } from '@/lib/auth/roleUtils';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import AdminSidebar from '@/features/admin/components/AdminSidebar';
import AdminHeader from '@/features/admin/components/AdminHeader';
import '@/styles/admin-layout.css';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, loading } = useAuth();
  const router = useRouter();
  const hasRedirected = useRef(false);

  useEffect(() => {
    // Only redirect if we're done loading
    if (!loading) {
      if (!user && !hasRedirected.current) {
        hasRedirected.current = true;
        router.push('/auth');
      } else if (user && !isAdmin(user) && !hasRedirected.current) {
        hasRedirected.current = true;
        router.push('/unauthorized');
      } else if (user && isAdmin(user)) {
        hasRedirected.current = false; // Reset if user becomes available
      }
    }
  }, [user, loading, router]);

  // Show loading state while checking auth
  if (loading) {
    return <LoadingSpinner fullScreen text="Checking authentication..." />;
  }

  // Don't render admin content if not authenticated or not an admin
  if (!user || !isAdmin(user)) {
    return null;
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


