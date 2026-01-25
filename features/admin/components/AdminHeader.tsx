'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import '@/styles/admin-header.css';


interface AdminHeaderProps {
  onMenuClick: () => void;
  onSearch?: (query: string) => void;
}

const pageTitles: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/orders': 'Orders',
  '/admin/products': 'Products',
  '/admin/products/new': 'Products',
  '/admin/statistics': 'Statistics',
  '/admin/customers': 'Customers',
  '/admin/reports': 'Reports',
  '/admin/discounts': 'Discounts',
  '/admin/help': 'Help',
  '/admin/settings': 'Admin settings - 01',
};

export default function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const [searchValue, setSearchValue] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const pathname = usePathname();
  const pageTitle = pageTitles[pathname] || 'Admin Dashboard';
  const { user, logout } = useAuth();

  const handleLogout = () => {
    setShowUserMenu(false);
    logout();
  };

  return (
    <header className="admin-header">
      <div className="header-left">
        {/* menu for mobile */}
        <button
          onClick={onMenuClick}
          className="header-menu-button"
          aria-label="Toggle menu"
        >
          <svg
            className="header-menu-icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        
        
      </div>

      {/* Search bar */}
      <div className="search-container">
        <div className="search-wrapper">
          <input
            type="text"
            placeholder="Search in the dashboard"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="search-input"
          />
          <svg
            className="search-icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          {searchValue && (
            <button
              onClick={() => setSearchValue('')}
              className="search-close-button"
            >
              <svg
                className="search-close-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Mobile search */}
      <div className="search-container-mobile">
        <div className="search-wrapper-mobile">
          <input
            type="text"
            placeholder="Search in ...."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="search-input-mobile"
          />
          {searchValue && (
            <button
              onClick={() => setSearchValue('')}
              className="search-close-button-mobile"
            >
              <svg
                className="search-close-icon-mobile"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Right side icons */}
      <div className="header-right">
        {/* Notifications */}
        <button className="notification-button">
          <svg
            className="notification-icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
        </button>

        {/* Profile with dropdown */}
        <div className="relative">
          <button 
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="profile-avatar cursor-pointer hover:ring-2 hover:ring-neutral-300 transition-all"
            title={user?.email || 'User'}
          >
            {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'A'}
          </button>
          
          {showUserMenu && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setShowUserMenu(false)}
              />
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-neutral-200 py-2 z-20">
                <div className="px-4 py-3 border-b border-neutral-100">
                  <p className="text-sm font-medium text-neutral-900">{user?.name || 'Admin User'}</p>
                  <p className="text-xs text-neutral-500 truncate">{user?.email || 'admin@example.com'}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

