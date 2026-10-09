import React from 'react';
import type { Metadata } from 'next';
import AboutClient from './AboutClient';

export const metadata: Metadata = {
  title: 'About WholesalerJi | Wholesale Wall Panels & Project Supply',
  description: 'Discover WholesalerJi, a wholesale wall-panel supplier serving contractors, retailers, designers and projects with PVC, WPC, fluted and decorative wall-panel solutions.',
  alternates: {
    canonical: 'https://wholesalerji.com/about',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'About WholesalerJi | Wholesale Wall Panels & Project Supply',
    description: 'Discover WholesalerJi, a wholesale wall-panel supplier serving contractors, retailers, designers and projects with PVC, WPC, fluted and decorative wall-panel solutions.',
    url: 'https://wholesalerji.com/about',
    siteName: 'WholesalerJi',
    type: 'website',
  }
};

export default function AboutPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "mainEntity": {
      "@id": "https://wholesalerji.com/#organization"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AboutClient />
    </>
  );
}
