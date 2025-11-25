"use client";

import React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Facebook, Instagram, Twitter } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterSection {
  title: string;
  links: FooterLink[];
}

export interface FooterProps {
  logo?: string;
  logoAlt?: string;
  description?: string;
  sections?: FooterSection[];
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
  copyrightText?: string;
  className?: string;
}

const footerVariants = cva(
  "w-full bg-white text-slate-600 border-t border-slate-200",
  {
    variants: {
      variant: {
        default: "",
        bordered: "border-t-2 border-slate-300"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

const Footer: React.FC<FooterProps> = ({
  logo = "/assets/logo.png",
  logoAlt = "Logo",
  description = "Your one-stop shop for fashion and lifestyle products.",
  sections = [
    {
      title: 'Shop',
      links: [
        { label: 'New Arrivals', href: '/new-arrivals' },
        { label: 'Best Sellers', href: '/best-sellers' },
        { label: 'Sale', href: '/sale' },
        { label: 'Collections', href: '/collections' },
      ]
    },
    {
      title: 'Support',
      links: [
        { label: 'Contact Us', href: '/contact' },
        { label: 'FAQs', href: '/faqs' },
        { label: 'Shipping', href: '/shipping' },
        { label: 'Returns', href: '/returns' },
      ]
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', href: '/about' },
        { label: 'Careers', href: '/careers' },
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Terms of Service', href: '/terms' },
      ]
    }
  ],
  socialLinks = {
    facebook: 'https://facebook.com',
    instagram: 'https://instagram.com',
    twitter: 'https://twitter.com',
  },
  copyrightText,
  className,
}) => {

  const currentYear = new Date().getFullYear();
  const copyright = copyrightText || `© ${currentYear} All rights reserved.`;

  return (
    <footer className={cn(footerVariants({ variant: "default" }), className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 mb-8 sm:mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <Image
                src={logo}
                alt={logoAlt}
                width={140}
                height={40}
                className="h-8 sm:h-10 w-auto"
              />
            </Link>
            <p className="text-sm sm:text-base text-slate-500 mb-4 max-w-sm">
              {description}
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.facebook && (
                <a
                  href={socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full transition-colors cursor-pointer"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
              )}
              {socialLinks.instagram && (
                <a
                  href={socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full transition-colors cursor-pointer"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              )}
              {socialLinks.twitter && (
                <a
                  href={socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full transition-colors cursor-pointer"
                  aria-label="Twitter"
                >
                  <Twitter className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>

          {/* Links Sections */}
          {sections.map((section) => (
            <div key={section.title}>
              <h3 className="text-slate-900 font-semibold text-sm sm:text-base mb-3 sm:mb-4">
                {section.title}
              </h3>
              <ul className="space-y-2 sm:space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Copyright */}
        <div className="border-t border-slate-200 pt-6 sm:pt-8 mt-8">
          <p className="text-center text-xs sm:text-sm text-slate-400">
            {copyright}
          </p>
        </div>
      </div>
    </footer>
  );
};

Footer.displayName = 'Footer';

export { Footer };
