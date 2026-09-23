import React from 'react';
import Navbar from '@/components/Navbar';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog & Insights | Wholesaleji',
  description: 'Read the latest insights, interior design trends, and architectural cladding tips from Wholesaleji.',
};

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col selection:bg-amber-500 selection:text-stone-950 transition-colors">
      <Navbar currentPath="/blog" />
      <main className="flex-1 flex flex-col items-center justify-center py-20 px-4">
        <div className="max-w-4xl w-full text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-4 block">Knowledge Base</span>
          <h1 className="text-4xl md:text-6xl font-black text-stone-900 dark:text-white tracking-tight mb-6">
            Insights &amp; <span className="text-amber-500">Trends</span>
          </h1>
          <p className="text-lg text-stone-600 dark:text-stone-400 mb-12 max-w-2xl mx-auto">
            Stay updated with the latest in interior design, architectural cladding, and B2B wholesale market trends. Our editorial team is currently preparing our first publication.
          </p>
          
          <div className="bg-stone-100 dark:bg-stone-900/50 rounded-3xl p-12 border border-stone-200 dark:border-stone-800/80 inline-flex flex-col items-center">
            <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mb-6 animate-pulse">
              <span className="text-3xl">📰</span>
            </div>
            <h3 className="text-2xl font-bold mb-2">Coming Soon</h3>
            <p className="text-stone-500 dark:text-stone-400 text-sm">
              We are working hard to bring you high-quality content. Check back later!
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
