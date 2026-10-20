import React from 'react';
import { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import ArtificialGrassClient from '@/components/artificial-grass/ArtificialGrassClient';
import {
  ALL_ARTIFICIAL_GRASS,
  ARTIFICIAL_GRASS_FAQS
} from '@/data/artificialGrassData';
import { toAbsoluteImageUrl } from '@/lib/imageUtils';

export const metadata: Metadata = {
  title: 'Artificial Grass Gurgaon | Wholesale Turf Supplier & Manufacturer India | WholesalerJi',
  description:
    'Buy direct manufacturer artificial grass in Gurgaon, Delhi NCR & India at factory wholesale rates (₹45–₹110/sq.ft). 25mm to 50mm landscape turf & designer patterns. UV50+ heat tested, double backing, ready stock at Sector 34 Gurugram depot.',
  alternates: {
    canonical: 'https://wholesalerji.com/artificial-grass',
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
    title: 'Artificial Grass Gurgaon | Wholesale Turf Supplier & Manufacturer India | WholesalerJi',
    description:
      'Direct mill wholesale supply of synthetic landscape turf & designer artificial grass in Gurgaon & Delhi NCR. 25mm–50mm pile heights, double backing, UV50+ heat resistance.',
    url: 'https://wholesalerji.com/artificial-grass',
    type: 'website',
    images: [
      {
        url: 'https://wholesalerji.com/images/dcezlxt8r/f_auto,q_auto/v1787308036/35mm_Artificial_Grass.png',
        width: 1200,
        height: 630,
        alt: 'WholesalerJi Premium Artificial Grass Collection in Gurgaon and Delhi NCR',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Artificial Grass Gurgaon | Wholesale Turf Manufacturer India | WholesalerJi',
    description:
      'Buy wholesale artificial grass in Gurgaon at ₹45–₹110/sq.ft. Ready stock for balconies, rooftop terraces & commercial projects.',
    images: ['https://wholesalerji.com/images/dcezlxt8r/f_auto,q_auto/v1787308036/35mm_Artificial_Grass.png'],
  },
};

export default function ArtificialGrassPage() {
  const baseUrl = 'https://wholesalerji.com';

  // 1. BreadcrumbList Schema
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
        name: 'Artificial Grass',
        item: `${baseUrl}/artificial-grass`,
      },
    ],
  };

  // 2. ItemList Schema with all 8 Products & Prices
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'WholesalerJi Artificial Grass Collections',
    description:
      'Complete catalog of landscape artificial grass (25mm, 35mm, 40mm, 50mm) and designer pattern grass with wholesale per sq.ft pricing.',
    numberOfItems: ALL_ARTIFICIAL_GRASS.length,
    itemListElement: ALL_ARTIFICIAL_GRASS.map((product, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      item: {
        '@type': 'Product',
        name: product.name,
        sku: product.code,
        mpn: product.code,
        image: toAbsoluteImageUrl(product.image),
        description: product.description,
        category: 'Artificial Turf & Synthetic Grass',
        brand: {
          '@type': 'Brand',
          name: 'WholesalerJi',
        },
        offers: {
          '@type': 'Offer',
          url: `${baseUrl}/artificial-grass#${product.category === 'normal' ? 'normal-grass' : 'designer-grass'}`,
          priceCurrency: 'INR',
          price: product.price,
          priceValidUntil: '2027-12-31',
          itemCondition: 'https://schema.org/NewCondition',
          availability: 'https://schema.org/InStock',
          seller: {
            '@type': 'Organization',
            name: 'WholesalerJi',
          },
        },
      },
    })),
  };

  // 3. FAQPage Schema
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: ARTIFICIAL_GRASS_FAQS.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  // 4. LocalBusiness & WholesaleStore Schema for Sector 34 Gurugram Depot
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'WholesaleStore',
    name: 'WholesalerJi - Artificial Grass Wholesaler & Depot Gurgaon',
    image: 'https://wholesalerji.com/images/dcezlxt8r/f_auto,q_auto/v1787308036/35mm_Artificial_Grass.png',
    '@id': `${baseUrl}/artificial-grass#depot`,
    url: `${baseUrl}/artificial-grass`,
    telephone: '+919217400163',
    priceRange: '₹45 - ₹110 per sq.ft',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Sector 34',
      addressLocality: 'Gurugram',
      addressRegion: 'Haryana',
      postalCode: '122004',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 28.4312,
      longitude: 77.0177,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
        ],
        opens: '09:00',
        closes: '19:30',
      },
    ],
    areaServed: [
      'Gurugram',
      'Gurgaon',
      'Delhi NCR',
      'DLF Phase 1-5',
      'Golf Course Road',
      'Sohna Road',
      'Dwarka Expressway',
      'Noida',
      'Faridabad',
    ],
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-stone-950 transition-colors duration-300">
      {/* Structured Data Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />

      {/* Global Navigation */}
      <Navbar currentPath="/artificial-grass" />

      {/* Main Experience */}
      <main className="flex-1">
        <ArtificialGrassClient />
      </main>
    </div>
  );
}
