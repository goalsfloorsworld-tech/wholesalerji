'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ThemeToggle from './ThemeToggle';

interface NavbarProps {
  currentPath?: string;
}

export default function Navbar({ currentPath = '/' }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHoveringPanels, setIsHoveringPanels] = useState(false);

  const isPanelsActive =
    currentPath.startsWith('/wall-panels') ||
    currentPath.startsWith('/products');

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-stone-950/90 backdrop-blur-md border-b border-stone-200 dark:border-stone-800/80 transition-colors select-none">
      <div className="w-full px-4 sm:px-8 lg:px-12 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <Link href="/" className="group flex items-center gap-2.5">
            <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-amber-500/40 shadow-sm flex-shrink-0 bg-[#1B222B]">
              <Image
                src="/assets/wholsalerji-logo.jpeg"
                alt="Wholesaleji Logo"
                fill
                sizes="32px"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                priority
              />
            </div>
            <span className="text-xl font-black tracking-tight text-stone-950 dark:text-white flex items-center">
              WHOLESALE<span className="text-amber-500 group-hover:text-amber-300 transition-colors">JI</span>
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-700 dark:text-stone-300">
          <Link href="/" className="hover:text-amber-500 transition-colors">
            Home
          </Link>

          {/* ========================================================= */}
          {/* WALL PANELS SIMPLE CLEAN DROPDOWN                         */}
          {/* ========================================================= */}
          <div
            className="relative py-4"
            onMouseEnter={() => setIsHoveringPanels(true)}
            onMouseLeave={() => setIsHoveringPanels(false)}
          >
            <Link
              href="/wall-panels"
              className={`inline-flex items-center gap-1.5 transition-colors font-semibold py-1 ${
                isPanelsActive
                  ? 'text-amber-500'
                  : 'text-stone-900 dark:text-white hover:text-amber-500'
              }`}
            >
              <span>Wall Panels</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className={`w-4 h-4 text-amber-500 transition-transform duration-200 ${
                  isHoveringPanels ? 'rotate-180' : ''
                }`}
              >
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>

            {/* Simple, Normal Dropdown Menu */}
            <div
              className={`absolute top-full left-0 w-52 pt-2 transition-all duration-200 ${
                isHoveringPanels
                  ? 'opacity-100 visible translate-y-0 pointer-events-auto'
                  : 'opacity-0 invisible -translate-y-1 pointer-events-none'
              }`}
            >
              <div className="rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-1.5 shadow-xl shadow-black/10 transition-colors">
                <Link
                  href="/products/primo-panels"
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-lg group transition-all"
                >
                  <span className="word-wipe-hover text-sm font-semibold text-stone-900 dark:text-stone-100">
                    Primo Panels
                  </span>
                  <span className="text-xs opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-amber-500">
                    →
                  </span>
                </Link>

                <Link
                  href="/products/elite-panels"
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-lg group transition-all"
                >
                  <span className="word-wipe-hover text-sm font-semibold text-stone-900 dark:text-stone-100">
                    Elite PVC Panels
                  </span>
                  <span className="text-xs opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-amber-500">
                    →
                  </span>
                </Link>

                <Link
                  href="/products/primo-fluted-panels"
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-lg group transition-all"
                >
                  <span className="word-wipe-hover text-sm font-semibold text-stone-900 dark:text-stone-100">
                    Primo Fluted Panels
                  </span>
                  <span className="text-xs opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-amber-500">
                    →
                  </span>
                </Link>

                <Link
                  href="/products/elite-fluted-panels"
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-lg group transition-all"
                >
                  <span className="word-wipe-hover text-sm font-semibold text-stone-900 dark:text-stone-100">
                    Elite Fluted Panels
                  </span>
                  <span className="text-xs opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-amber-500">
                    →
                  </span>
                </Link>

                <div className="my-1 border-t border-stone-100 dark:border-stone-800/80" />

                <Link
                  href="/wall-panels"
                  className="flex items-center justify-between px-3.5 py-2 rounded-lg group transition-all"
                >
                  <span className="word-wipe-hover text-xs font-semibold text-stone-600 dark:text-stone-400">
                    All Wall Panels
                  </span>
                  <span className="text-xs text-stone-400 group-hover:text-amber-500 transition-colors">
                    →
                  </span>
                </Link>
              </div>
            </div>
          </div>

          <Link href="/about" className="hover:text-amber-500 transition-colors">
            About
          </Link>

          <Link href="/blog" className="hover:text-amber-500 transition-colors">
            Blog
          </Link>

          <Link href="/contact" className="hover:text-amber-500 transition-colors">
            Contact
          </Link>
        </nav>

        {/* Right CTA */}
        <div className="flex items-center gap-2.5">
          {/* Theme Toggle (Dark / Light Mode) */}
          <ThemeToggle />



          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-stone-600 dark:text-stone-400 hover:text-stone-950 dark:hover:text-white rounded-lg focus:outline-none"
            aria-label="Toggle Menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 px-4 pt-3 pb-6 space-y-3 transition-colors">
          <Link
            href="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-sm font-semibold text-stone-800 dark:text-stone-200 py-1.5"
          >
            Home
          </Link>

          <div className="py-2 border-y border-stone-200 dark:border-stone-800/80 space-y-2">
            <span className="text-[10px] uppercase tracking-wider text-amber-600 dark:text-amber-400 font-bold block">
              Wall Panels
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <Link
                href="/products/primo-panels"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2.5 rounded-xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-xs font-bold text-stone-900 dark:text-white block hover:border-amber-500 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="truncate">Primo</span>
                  <span className="text-[7px] bg-amber-500/20 text-amber-700 dark:text-amber-300 px-1 py-0.5 rounded font-bold uppercase">Flat</span>
                </div>
                <div className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold mt-1">₹499</div>
              </Link>
              <Link
                href="/products/elite-panels"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2.5 rounded-xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-xs font-bold text-stone-900 dark:text-white block hover:border-amber-500 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="truncate">Elite PVC</span>
                  <span className="text-[7px] bg-purple-500/20 text-purple-700 dark:text-purple-300 px-1 py-0.5 rounded font-bold uppercase">UV</span>
                </div>
                <div className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold mt-1">₹549</div>
              </Link>
              <Link
                href="/products/primo-fluted-panels"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2.5 rounded-xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-xs font-bold text-stone-900 dark:text-white block hover:border-amber-500 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="truncate">Primo Fluted</span>
                  <span className="text-[7px] bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 px-1 py-0.5 rounded font-bold uppercase">9MM</span>
                </div>
                <div className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold mt-1">₹599</div>
              </Link>
              <Link
                href="/products/elite-fluted-panels"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2.5 rounded-xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-xs font-bold text-stone-900 dark:text-white block hover:border-amber-500 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="truncate">Elite Fluted</span>
                  <span className="text-[7px] bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 px-1 py-0.5 rounded font-bold uppercase">9MM</span>
                </div>
                <div className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold mt-1">₹599</div>
              </Link>
            </div>
            <Link
              href="/wall-panels"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-xs text-amber-600 dark:text-amber-400 font-semibold block pt-1 hover:underline"
            >
              View Full 24+ Colors Catalog →
            </Link>
          </div>

          <Link
            href="/about"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-sm font-medium text-stone-700 dark:text-stone-300 py-1"
          >
            About
          </Link>
          <Link
            href="/blog"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-sm font-medium text-stone-700 dark:text-stone-300 py-1"
          >
            Blog
          </Link>
          <Link
            href="/contact"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-sm font-medium text-stone-700 dark:text-stone-300 py-1"
          >
            Contact
          </Link>
        </div>
      )}
    </header>
  );
}
