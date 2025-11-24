'use client';

import { useState } from 'react';
import AdminSidebar from '@/features/admin/components/AdminSidebar';
import AdminHeader from '@/features/admin/components/AdminHeader';
import '@/styles/admin-layout.css';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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


