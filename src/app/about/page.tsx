import React from 'react';
import Navbar from '@/components/Navbar';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | Wholesaleji',
  description: 'Learn more about Wholesaleji, India\'s premier B2B direct-to-site panel distributor.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col selection:bg-amber-500 selection:text-stone-950 transition-colors">
      <Navbar currentPath="/about" />
      <main className="flex-1 flex flex-col items-center justify-center py-20 px-4">
        <div className="max-w-4xl w-full text-center">
          <h1 className="text-4xl md:text-6xl font-black text-stone-900 dark:text-white tracking-tight mb-6">
            About <span className="text-amber-500">Wholesaleji</span>
          </h1>
          <p className="text-lg md:text-xl text-stone-600 dark:text-stone-400 mb-12">
            We are India's leading B2B architectural wall panel distributor. Bypassing the middlemen to bring you direct factory rates on the highest quality WPC, PVC, and Charcoal panels.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="bg-white dark:bg-stone-900 p-8 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm">
              <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center mb-6">
                <span className="text-2xl">🏭</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Direct Sourcing</h3>
              <p className="text-sm text-stone-500 dark:text-stone-400">
                We work directly with top-tier manufacturing units to cut out retail markups and bring wholesale pricing straight to your site.
              </p>
            </div>
            
            <div className="bg-white dark:bg-stone-900 p-8 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm">
              <div className="w-12 h-12 bg-sky-500/10 rounded-xl flex items-center justify-center mb-6">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Same-Day Dispatch</h3>
              <p className="text-sm text-stone-500 dark:text-stone-400">
                Our central warehouse in Gurugram ensures lightning-fast delivery across the entire Delhi NCR region.
              </p>
            </div>
            
            <div className="bg-white dark:bg-stone-900 p-8 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-6">
                <span className="text-2xl">🛡️</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Premium Quality</h3>
              <p className="text-sm text-stone-500 dark:text-stone-400">
                From 100% waterproof virgin polymers to Class B1 fire retardant materials, we never compromise on quality.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
