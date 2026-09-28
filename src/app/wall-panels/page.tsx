import React, { Suspense } from 'react';
import { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import WallPanelsExperience from '@/components/WallPanelsExperience';

export const metadata: Metadata = {
  title: 'Architectural Wall Panels | Primo & Elite Collections | WholesalerJi',
  description:
    'Buy direct manufacturer Wall Panels in Gurgaon, Delhi NCR & India. Explore 24+ colors in Primo Series (GF-301—312) and Elite Series (GF-401—412). 100% waterproof, Class B1 flame retardant.',
  alternates: {
    canonical: 'https://wholesalerji.com/wall-panels',
  },
  openGraph: {
    title: 'Architectural Wall Panels | Primo & Elite Collections | WholesalerJi',
    description:
      'Buy direct manufacturer Wall Panels. Explore 24+ authentic colors in Primo Series and Elite Series at pure mill wholesale rates.',
    url: 'https://wholesalerji.com/wall-panels',
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
    </div>
  );
}
