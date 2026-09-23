import React, { Suspense } from 'react';
import { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import WallPanelsExperience from '@/components/WallPanelsExperience';

export const metadata: Metadata = {
  title: 'Architectural Wall Panels | Primo & Elite Collections | Wholesaleji',
  description:
    'Buy direct manufacturer Wall Panels in Gurgaon, Delhi NCR & India. Explore 24+ colors in Primo Series (GF-301—312) and Elite Series (GF-401—412). 100% waterproof, Class B1 flame retardant.',
  alternates: {
    canonical: 'https://wholesaleji.com/wall-panels',
  },
  openGraph: {
    title: 'Architectural Wall Panels | Primo & Elite Collections | Wholesaleji',
    description:
      'Buy direct manufacturer Wall Panels. Explore 24+ authentic colors in Primo Series and Elite Series at pure mill wholesale rates.',
    url: 'https://wholesaleji.com/wall-panels',
    type: 'website',
  },
};

interface WallPanelsPageProps {
  searchParams: Promise<{
    collection?: string;
  }>;
}

export default async function WallPanelsPage({ searchParams }: WallPanelsPageProps) {
  const { collection } = await searchParams;
  const initialCollection = collection === 'primo' || collection === 'elite' ? collection : 'all';

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col justify-between selection:bg-amber-500 selection:text-stone-950">
      
      {/* Global Navbar with Cursor-Hover Mega Menu */}
      <Navbar currentPath="/wall-panels" />

      {/* Main Dynamic Wall Panels Experience */}
      <main className="flex-1">
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-stone-500 text-xs">Loading Wall Panels Catalog...</div>}>
          <WallPanelsExperience initialCollection={initialCollection} />
        </Suspense>
      </main>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* FOOTER WITH GRAND ARCHITECTURAL "WHOLESALERJI" WATERMARK      */}
      {/* ───────────────────────────────────────────────────────────── */}
      <footer className="relative border-t border-stone-800/80 bg-stone-950 pt-16 pb-12 text-stone-400 text-xs overflow-hidden select-none">
        {/* Grand Full-Width Architectural Faded Background Watermark */}
        <div className="absolute top-0 inset-x-0 flex items-center justify-center pointer-events-none select-none overflow-hidden -translate-y-1/2">
          <span className="text-[13vw] sm:text-[14.5vw] font-black uppercase tracking-tight text-stone-700/30 leading-none whitespace-nowrap select-none font-sans">
            WHOLESALERJI
          </span>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <p>© 2026 Wholesaleji Technologies Pvt. Ltd. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="/" className="hover:text-white transition-colors">Home</a>
            <a href="/wall-panels?collection=primo" className="hover:text-white transition-colors">Primo Panels</a>
            <a href="/wall-panels?collection=elite" className="hover:text-white transition-colors">Elite Panels</a>
            <a href="/#rfq" className="hover:text-white transition-colors">Wholesale Inquiry</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
