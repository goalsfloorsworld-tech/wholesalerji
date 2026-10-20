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
    "@graph": [
      {
        "@type": "AboutPage",
        "@id": "https://wholesalerji.com/about#about",
        "url": "https://wholesalerji.com/about",
        "mainEntity": [
          { "@id": "https://wholesalerji.com/#organization" },
          { "@id": "https://wholesalerji.com/about#founder" },
          { "@id": "https://wholesalerji.com/about#ceo" }
        ]
      },
      {
        "@type": "Person",
        "@id": "https://wholesalerji.com/about#founder",
        "name": "Umesh Kumar",
        "jobTitle": "Founder & Managing Director",
        "url": "https://wholesalerji.com/about#founder",
        "image": {
          "@type": "ImageObject",
          "url": "https://res.cloudinary.com/def2qsxjg/image/upload/v1791631443/Umesh_Kumar.jpg",
          "caption": "Umesh Kumar, Founder & Managing Director of WholesalerJi"
        },
        "description": "Founded WholesalerJi to supply architectural panels directly from the Gurgaon factory to project sites and showrooms.",
        "worksFor": { "@id": "https://wholesalerji.com/#organization" }
      },
      {
        "@type": "Person",
        "@id": "https://wholesalerji.com/about#ceo",
        "name": "Shakti FTN",
        "jobTitle": "Chief Executive Officer",
        "url": "https://wholesalerji.com/about#ceo",
        "image": {
          "@type": "ImageObject",
          "url": "https://res.cloudinary.com/def2qsxjg/image/upload/v1791647297/shakti_ftn_ceo_of_goalsfloors_and_wholesalerji.png",
          "caption": "Shakti FTN, Chief Executive Officer of WholesalerJi"
        },
        "description": "Leads delivery operations and project support from dispatch through installation.",
        "worksFor": { "@id": "https://wholesalerji.com/#organization" }
      }
    ]
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
