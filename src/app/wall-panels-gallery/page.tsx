import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { ALL_GALLERY_ITEMS } from '@/data/galleryData';
import GalleryClient from './GalleryClient';

export const metadata: Metadata = {
  title: 'Wall Panels Installed Photos Gallery | Real Project Images Gurgaon | WholesalerJi',
  description:
    'Browse 49 real installed wall panel photos across Primo PVC flat panels, Elite UV marble sheets, and architectural WPC fluted louvers. Direct manufacturer & wholesale distributor in Gurgaon, Delhi NCR, India.',
  keywords: [
    'wall panel installed photos',
    'wall panels gallery gurgaon',
    'pvc wall panel installed images',
    'fluted panel living room photos',
    'uv marble sheet installation photos',
    'louvers wholesale delhi ncr',
    'wall panel wholesale manufacturer gurgaon',
    'pvc wall panel designs india',
    'goals floors wholesalerji',
    'wall cladding photos sector 34 gurugram',
  ],
  alternates: {
    canonical: 'https://wholesalerji.com/wall-panels-gallery',
  },
  openGraph: {
    title: 'Wall Panels Installed Photos & Design Gallery | WholesalerJi Gurgaon',
    description:
      '49 real installed wall panel project photos across Primo PVC, Elite UV marble, and architectural fluted louvers in Gurgaon and Delhi NCR.',
    url: 'https://wholesalerji.com/wall-panels-gallery',
    siteName: 'WholesalerJi',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: ALL_GALLERY_ITEMS[0]?.imageUrl || 'https://wholesalerji.com/assets/wholsalerji-logo.jpeg',
        width: 1200,
        height: 800,
        alt: 'WholesalerJi Wall Panels Installed Photos Gallery Gurgaon',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wall Panels Installed Photos Gallery | WholesalerJi Gurgaon',
    description:
      'Browse real installed photos of PVC wall panels, UV marble sheets, and WPC fluted louvers from actual sites across Delhi NCR.',
    images: [ALL_GALLERY_ITEMS[0]?.imageUrl || 'https://wholesalerji.com/assets/wholsalerji-logo.jpeg'],
  },
};

export default function WallPanelsGalleryPage() {
  const baseUrl = 'https://wholesalerji.com';

  // ─── ImageGallery JSON-LD Schema for Google Images Indexing ──
  const gallerySchema = {
    '@context': 'https://schema.org',
    '@type': 'ImageGallery',
    name: 'Installed Wall Panels Real Project Gallery — WholesalerJi',
    description:
      '49 verified real installation photos of PVC wall panels, UV marble sheets, and WPC fluted louvers across residential and commercial projects in Gurgaon and Delhi NCR.',
    url: `${baseUrl}/wall-panels-gallery`,
    provider: {
      '@type': 'Organization',
      name: 'WholesalerJi / Goals Floors',
      url: baseUrl,
      logo: `${baseUrl}/assets/wholsalerji-logo.jpeg`,
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'WholesalerJi Central Warehouse, Sector 34',
        addressLocality: 'Gurugram',
        addressRegion: 'Haryana',
        postalCode: '122004',
        addressCountry: 'IN',
      },
    },
    hasPart: ALL_GALLERY_ITEMS.map((item, index) => ({
      '@type': 'ImageObject',
      position: index + 1,
      contentUrl: item.imageUrl,
      url: `${baseUrl}/wall-panels-gallery#${item.id}`,
      name: item.displayLabel,
      description: item.altText,
      caption: item.altText,
      representativeOfPage: index === 0,
      creator: {
        '@type': 'Organization',
        name: 'WholesalerJi',
      },
      copyrightHolder: {
        '@type': 'Organization',
        name: 'WholesalerJi Private Limited',
      },
    })),
  };

  // ─── Breadcrumb JSON-LD Schema ───────────────────────────────
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: baseUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Wall Panels',
        item: `${baseUrl}/wall-panels`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Installed Gallery',
        item: `${baseUrl}/wall-panels-gallery`,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 transition-colors">
      {/* ─── Global Site Navbar ────────────────────────────────────── */}
      <Navbar currentPath="/wall-panels-gallery" />

      {/* Structured Data Scripts */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(gallerySchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <main className="w-full max-w-[1700px] mx-auto px-4 sm:px-8 lg:px-12 pt-20 sm:pt-24 pb-20">
        
        {/* ─── Breadcrumb Navigation (Visually hidden for users, preserved for SEO & AI crawlers) ─── */}
        <nav aria-label="Breadcrumb" className="sr-only">
          <ol className="inline-flex items-center space-x-2 text-xs text-stone-500 dark:text-stone-400">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>•</li>
            <li>
              <Link href="/wall-panels">Wall Panels</Link>
            </li>
            <li>•</li>
            <li aria-current="page">Installed Gallery</li>
          </ol>
        </nav>

        {/* ─── Hero Heading (Centered) ───────────────────────────────── */}
        <header className="mb-10 max-w-3xl mx-auto text-center flex flex-col items-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-stone-950 dark:text-white leading-[1.15] mb-3 text-center">
            Wall Panels Installed Photos & Design Gallery
          </h1>

          <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 leading-relaxed font-normal text-center max-w-2xl mx-auto">
            Real installation photography from residential villas, high-rise apartments, and corporate offices across Gurgaon, Delhi NCR, and pan-India dealer projects. Explore 12-inch seamless Primo PVC panels, Italian mirror-gloss Elite UV marble sheets, and architectural WPC fluted louvers.
          </p>
        </header>

        {/* ─── Interactive Gallery Grid with Client-Side Filtering ───── */}
        <GalleryClient initialItems={ALL_GALLERY_ITEMS} />

        {/* ─── Informational Material Specifications Grid (Responsive & Clean) ─── */}
        <section className="mt-20 pt-14 border-t border-stone-200 dark:border-stone-800 max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-stone-950 dark:text-white tracking-tight mb-3">
              Wholesale Wall Paneling Supply & Manufacturing in Gurgaon
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
              WholesalerJi operates as a direct manufacturer and distributor headquartered in Sector 34, Gurugram. Supplying certified waterproof interior cladding to contractors, builders, and architects across Delhi NCR.
            </p>
          </div>

          {/* 2-Column Responsive Cards: Unified in accent theme, zero distracting capsules */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            
            {/* Primo */}
            <div className="group p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 hover:border-amber-500/50 flex flex-col justify-between shadow-xs transition-all duration-300">
              <div>
                <div className="flex items-center justify-between gap-3 mb-2.5">
                  <h3 className="text-base sm:text-lg font-bold text-stone-950 dark:text-white">
                    Primo Flat PVC Panels
                  </h3>
                  <span className="text-xs font-black text-amber-500 dark:text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20 shrink-0">
                    ₹499 / PC
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed mb-5">
                  Full 300mm wide flat tongue-and-groove boards in natural wood grains and concrete textures. 100% waterproof solution for 1-day dry installation over damp (seelan) walls in Gurgaon apartments.
                </p>
              </div>
              <Link
                href="/wall-panels/primo"
                className="inline-flex items-center justify-between px-4 py-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-amber-500 hover:text-stone-950 dark:hover:bg-amber-500 dark:hover:text-stone-950 text-stone-800 dark:text-stone-200 text-xs font-bold transition-all"
              >
                <span>Explore Primo Catalog</span>
                <span className="text-amber-500 group-hover:text-stone-950 transition-colors">→</span>
              </Link>
            </div>

            {/* Elite UV Marble */}
            <div className="group p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 hover:border-amber-500/50 flex flex-col justify-between shadow-xs transition-all duration-300">
              <div>
                <div className="flex items-center justify-between gap-3 mb-2.5">
                  <h3 className="text-base sm:text-lg font-bold text-stone-950 dark:text-white">
                    Elite High-Gloss UV Sheets
                  </h3>
                  <span className="text-xs font-black text-amber-500 dark:text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20 shrink-0">
                    ₹549 / PC
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed mb-5">
                  Specular 98% mirror-gloss Calacatta and Statuario marble reproductions with multi-coat UV acrylic curing. Zero stone porosity and stain immunity for luxury dining halls and master suites.
                </p>
              </div>
              <Link
                href="/wall-panels/elite"
                className="inline-flex items-center justify-between px-4 py-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-amber-500 hover:text-stone-950 dark:hover:bg-amber-500 dark:hover:text-stone-950 text-stone-800 dark:text-stone-200 text-xs font-bold transition-all"
              >
                <span>Explore Elite Catalog</span>
                <span className="text-amber-500 group-hover:text-stone-950 transition-colors">→</span>
              </Link>
            </div>

            {/* Primo Fluted */}
            <div className="group p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 hover:border-amber-500/50 flex flex-col justify-between shadow-xs transition-all duration-300">
              <div>
                <div className="flex items-center justify-between gap-3 mb-2.5">
                  <h3 className="text-base sm:text-lg font-bold text-stone-950 dark:text-white">
                    Primo Fluted WPC Louvers
                  </h3>
                  <span className="text-xs font-black text-amber-500 dark:text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20 shrink-0">
                    ₹449 / PC
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed mb-5">
                  Extruded wood-polymer matrix with bold vertical shadow grooves and acoustic scattering. Class B1 flame-retardant louvers widely installed on bedhead walls and reception lobbies in Delhi NCR.
                </p>
              </div>
              <Link
                href="/wall-panels/primo-fluted"
                className="inline-flex items-center justify-between px-4 py-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-amber-500 hover:text-stone-950 dark:hover:bg-amber-500 dark:hover:text-stone-950 text-stone-800 dark:text-stone-200 text-xs font-bold transition-all"
              >
                <span>Explore Primo Fluted Catalog</span>
                <span className="text-amber-500 group-hover:text-stone-950 transition-colors">→</span>
              </Link>
            </div>

            {/* Elite Fluted */}
            <div className="group p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 hover:border-amber-500/50 flex flex-col justify-between shadow-xs transition-all duration-300">
              <div>
                <div className="flex items-center justify-between gap-3 mb-2.5">
                  <h3 className="text-base sm:text-lg font-bold text-stone-950 dark:text-white">
                    Elite Heavy-Duty Louvers
                  </h3>
                  <span className="text-xs font-black text-amber-500 dark:text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20 shrink-0">
                    ₹599 / PC
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed mb-5">
                  High-depth 9mm & 17mm architectural louvers for 2950mm floor-to-ceiling elevations without horizontal joint seams. Built for commercial director cabins, double-height foyers, and balconies.
                </p>
              </div>
              <Link
                href="/wall-panels/elite-fluted"
                className="inline-flex items-center justify-between px-4 py-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-amber-500 hover:text-stone-950 dark:hover:bg-amber-500 dark:hover:text-stone-950 text-stone-800 dark:text-stone-200 text-xs font-bold transition-all"
              >
                <span>Explore Elite Fluted Catalog</span>
                <span className="text-amber-500 group-hover:text-stone-950 transition-colors">→</span>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
