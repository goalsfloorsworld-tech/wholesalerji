import React, { Suspense } from 'react';
import { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import WallPanelsExperience from '@/components/WallPanelsExperience';

export const metadata: Metadata = {
  title: 'Wall Panels in India | Manufacturer, Wholesale Supplier & Louvers | WholesalerJi',
  description:
    'Direct manufacturer and wholesale supplier of architectural wall panels in India. Explore 24+ colors across WPC fluted louvers, PVC marble sheets & seamless interior panels. 100% waterproof, Class B1 fire resistant. Pan-India factory dispatch.',
  alternates: {
    canonical: 'https://wholesalerji.com/wall-panels',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'Wall Panels in India | Manufacturer & Wholesale Supplier | WholesalerJi',
    description:
      'Buy direct manufacturer wall panels in India at factory wholesale rates. 24+ colors in Primo & Elite collections with pan-India supply for contractors, architects and dealers.',
    url: 'https://wholesalerji.com/wall-panels',
    type: 'website',
    images: [
      {
        url: 'https://wholesalerji.com/images/dcezlxt8r/f_auto,q_auto/v1776780203/Primo_GF-301_Pvc_Panel_Goals_Floors.png',
        width: 1200,
        height: 630,
        alt: 'WholesalerJi Architectural Wall Panels Collection in India',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wall Panels in India | Manufacturer & Wholesale Supplier | WholesalerJi',
    description:
      'Buy factory wholesale wall panels in India. 24+ colors in WPC fluted louvers and PVC marble sheets. Direct mill dispatch nationwide.',
    images: ['https://wholesalerji.com/images/dcezlxt8r/f_auto,q_auto/v1776780203/Primo_GF-301_Pvc_Panel_Goals_Floors.png'],
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

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Wall Panels in India | Manufacturer, Wholesale Supplier & Louvers | WholesalerJi',
    description: 'Direct manufacturer and wholesale supplier of architectural wall panels across India. Explore 24+ colors in Primo Series and Elite Series at factory mill wholesale rates.',
    url: 'https://wholesalerji.com/wall-panels',
    provider: {
      '@type': 'Organization',
      name: 'WholesalerJi',
      url: 'https://wholesalerji.com',
      areaServed: {
        '@type': 'Country',
        name: 'India'
      }
    },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          url: 'https://wholesalerji.com/wall-panels/primo',
          name: 'Primo Series Wall Panels'
        },
        {
          '@type': 'ListItem',
          position: 2,
          url: 'https://wholesalerji.com/wall-panels/elite',
          name: 'Elite Series Wall Panels'
        },
        {
          '@type': 'ListItem',
          position: 3,
          url: 'https://wholesalerji.com/wall-panels/primo-fluted',
          name: 'Primo Fluted Wall Panels'
        },
        {
          '@type': 'ListItem',
          position: 4,
          url: 'https://wholesalerji.com/wall-panels/elite-fluted',
          name: 'Elite Fluted Wall Panels'
        }
      ]
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col justify-between selection:bg-amber-500 selection:text-stone-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      
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
