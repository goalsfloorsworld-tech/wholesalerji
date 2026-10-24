import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SPC Flooring Gurgaon | Wholesale Stone Plastic Composite Supplier India | WholesalerJi',
  description:
    'Buy direct manufacturer SPC flooring in Gurgaon, Delhi NCR & pan-India at factory wholesale rates (₹65–₹110/sq.ft). 100% waterproof 5mm rigid limestone core planks with pre-attached 1mm IXPE acoustic foam. Ready stock at Sector 34 Gurugram depot.',
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
    title: 'SPC Flooring Gurgaon | Wholesale Stone Plastic Composite Supplier India | WholesalerJi',
    description:
      'Direct mill wholesale supply of rigid-core SPC flooring in Gurgaon & Delhi NCR. 100% waterproof, 5.0mm total thickness, 0.30mm/0.50mm wear layer, Uniclic joint.',
    url: 'https://wholesalerji.com/spc-flooring',
    type: 'website',
    images: [
      {
        url: 'https://wholesalerji.com/assets/home-image.jpg',
        width: 1200,
        height: 630,
        alt: 'WholesalerJi Architectural SPC Flooring Collection in Gurgaon and Delhi NCR',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SPC Flooring Gurgaon | Wholesale Rigid Core Flooring India | WholesalerJi',
    description:
      'Buy wholesale SPC flooring in Gurgaon at ₹65–₹110/sq.ft. Ready stock for homes, builder floors & commercial interiors.',
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
