"use client";

import React, { useState, useEffect, useRef } from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Menu, X, Search, Heart, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export interface NavBarProps {
  logo?: string;
  logoAlt?: string;
  categories?: Array<{ label: string; href: string }>;
  promoText?: string;
  cartItemCount?: number;
  onSearch?: (query: string) => void;
  className?: string;
}

const navBarVariants = cva(
  "w-full bg-white border-b border-slate-200",
  {
    variants: {
      sticky: {
        true: "sticky top-0 z-40",
        false: ""
      }
    },
    defaultVariants: {
      sticky: true
    }
  }
);

const NavBar: React.FC<NavBarProps> = ({
  logo = "/assets/logo.png",
  logoAlt = "Logo",
  categories = [
    { label: 'Clothing', href: '/clothing' },
    { label: 'Brands', href: '/brands' },
    { label: 'New in', href: '/new-in' },
    { label: 'Jewelry', href: '/jewelry' },
    { label: 'Accessories', href: '/accessories' },
    { label: 'Shoes', href: '/shoes' },
    { label: 'Bags', href: '/bags' },
    { label: 'Sale', href: '/sale' },
  ],
  promoText = "25% off for your first purchase - Back to school season",
  cartItemCount = 0,
  onSearch,
  className,
}) => {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false);
        setSearchOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <div ref={menuRef} className={cn(navBarVariants({ sticky: true }), className)}>
      {/* Promo Banner */}
      {promoText && (
        <div className="w-full bg-rose-50 px-4 py-2 text-center">
          <p className="text-rose-600 text-xs sm:text-sm font-normal">
            {promoText}
          </p>
        </div>
      )}

      {/* Desktop Navigation */}
      <nav className="hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Top Bar */}
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <Image
                src={logo}
                alt={logoAlt}
                width={140}
                height={40}
                className="h-8 sm:h-10 w-auto"
              />
            </Link>

            {/* Actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Search */}
              <div className={cn(
                "flex items-center transition-all duration-300",
                searchOpen ? "w-48 sm:w-64" : "w-auto"
              )}>
                {searchOpen ? (
                  <form onSubmit={handleSearchSubmit} className="relative w-full">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search..."
                      className="w-full pl-9 pr-9 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                      autoFocus
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <button
                      type="button"
                      onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </form>
                ) : (
                  <button
                    onClick={() => setSearchOpen(true)}
                    className="p-2 text-slate-600 hover:text-slate-900 rounded-md transition-colors cursor-pointer"
                    aria-label="Search"
                  >
                    <Search className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                )}
              </div>

              <button
                onClick={() => router.push('/favorites')}
                className="p-2 text-slate-600 hover:text-slate-900 rounded-md transition-colors cursor-pointer"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              <button
                onClick={() => router.push('/cart')}
                className="relative p-2 text-slate-600 hover:text-slate-900 rounded-md transition-colors cursor-pointer"
                aria-label="Shopping cart"
              >
                <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemCount > 99 ? '99+' : cartItemCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Categories */}
          <div className="border-t border-slate-200">
            <div className="flex items-center justify-center gap-4 sm:gap-6 py-3 sm:py-4">
              {categories.map((category) => (
                <Link
                  key={category.href}
                  href={category.href}
                  className="text-base sm:text-lg font-normal text-slate-600 hover:text-slate-900 transition-colors px-2 py-1"
                >
                  {category.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="md:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 text-slate-600 hover:text-slate-900 cursor-pointer"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          <Link href="/">
            <Image
              src={logo}
              alt={logoAlt}
              width={120}
              height={32}
              className="h-8 w-auto"
            />
          </Link>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 cursor-pointer"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            <button
              onClick={() => router.push('/cart')}
              className="relative p-2 text-slate-600 hover:text-slate-900 cursor-pointer"
              aria-label="Shopping cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount > 99 ? '99+' : cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        {searchOpen && (
          <div className="px-4 py-3 border-t border-slate-200">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full pl-9 pr-9 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                autoFocus
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <button
                type="button"
                onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </nav>

      {/* Mobile Menu */}
      <div  
        className={cn(
          "fixed inset-0 z-50 md:hidden",
          mobileMenuOpen ? "pointer-events-auto" : "pointer-events-none"
        )}
      >
        <div
          className={cn(
            "absolute inset-0 bg-black transition-opacity duration-300",
            mobileMenuOpen ? "opacity-50" : "opacity-0"
          )}
          onClick={() => setMobileMenuOpen(false)}
        />
        
        <div
          className={cn(
            "absolute left-0 top-0 bottom-0 w-80 bg-white shadow-2xl transition-transform duration-300",
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                <Image
                  src={logo}
                  alt={logoAlt}
                  width={120}
                  height={32}
                  className="h-8 w-auto"
                />
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-6 px-4">
              <nav className="space-y-1">
                {categories.map((category) => (
                  <Link
                    key={category.href}
                    href={category.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-3 px-4 text-base text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-md transition-colors"
                  >
                    {category.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

NavBar.displayName = 'NavBar';

export { NavBar };
