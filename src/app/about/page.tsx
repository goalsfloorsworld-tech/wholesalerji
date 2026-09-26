import React from 'react';
import type { Metadata } from 'next';
import AboutClient from './AboutClient';

export const metadata: Metadata = {
  title: 'About WholesalerJi | Wholesale Wall Panels & Project Supply',
  description: 'Discover WholesalerJi, a wholesale wall-panel supplier serving contractors, retailers, designers and projects with PVC, WPC, fluted and decorative wall-panel solutions.',
  alternates: {
    canonical: 'https://wholesaleji.com/about',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'About WholesalerJi | Wholesale Wall Panels & Project Supply',
    description: 'Discover WholesalerJi, a wholesale wall-panel supplier serving contractors, retailers, designers and projects with PVC, WPC, fluted and decorative wall-panel solutions.',
    url: 'https://wholesaleji.com/about',
    siteName: 'WholesalerJi',
    type: 'website',
  }
};

export default function AboutPage() {
  return <AboutClient />;
}
