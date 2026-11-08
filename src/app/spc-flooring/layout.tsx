import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SPC Flooring in India | Manufacturer, Wholesale Supplier & Rigid Core | WholesalerJi',
  description:
    'Direct manufacturer and wholesale supplier of SPC flooring in India at factory rates (₹65–₹110/sq.ft). 100% waterproof 5mm rigid limestone core planks with pre-attached 1mm IXPE acoustic foam & Uniclic joint. Pan-India project dispatch for dealers, builders & contractors.',
  alternates: {
    canonical: 'https://wholesalerji.com/spc-flooring',
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
    title: 'SPC Flooring in India | Manufacturer & Wholesale Supplier | WholesalerJi',
    description:
      'Direct mill wholesale supply of rigid-core SPC flooring in India. 100% waterproof, 5.0mm total thickness, 0.30mm/0.50mm wear layer, Uniclic joint, pan-India project dispatch.',
    url: 'https://wholesalerji.com/spc-flooring',
    type: 'website',
    images: [
      {
        url: 'https://wholesalerji.com/assets/home-image.jpg',
        width: 1200,
        height: 630,
        alt: 'WholesalerJi Architectural SPC Flooring Collection in India',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SPC Flooring in India | Wholesale Rigid Core Flooring Manufacturer | WholesalerJi',
    description:
      'Buy wholesale SPC flooring in India at ₹65–₹110/sq.ft. Ready stock for residential, builder floors & commercial interiors nationwide.',
    images: ['https://wholesalerji.com/assets/home-image.jpg'],
  },
};

export default function SpcFlooringLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
