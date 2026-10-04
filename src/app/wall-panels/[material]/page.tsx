import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getMaterialBySlug, getMaterials, getProducts } from '@/sanity/client';
import ProductGrid from '@/components/server/ProductGrid';
import LeadForm from '@/components/client/LeadForm';
import Navbar from '@/components/Navbar';
import PrimoSeriesTemplate from '@/components/templates/PrimoSeriesTemplate';
import EliteSeriesTemplate from '@/components/templates/EliteSeriesTemplate';
import PrimoFlutedSeriesTemplate from '@/components/templates/PrimoFlutedSeriesTemplate';
import EliteFlutedSeriesTemplate from '@/components/templates/EliteFlutedSeriesTemplate';

import { PRIMO_WALL_PANELS } from '@/data/primoPanelsData';
import { ELITE_WALL_PANELS } from '@/data/elitePanelsData';
import { PRIMO_FLUTED_WALL_PANELS } from '@/data/primoFlutedPanelsData';
import { ELITE_FLUTED_WALL_PANELS, ELITE_FLUTED_FAQS } from '@/data/eliteFlutedPanelsData';



interface Props {
  params: Promise<{
    material: string;
  }>;
}

export async function generateStaticParams() {
  const materials = await getMaterials();
  return materials.map((m) => ({
    material: m.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { material: materialSlug } = await params;
  const material = await getMaterialBySlug(materialSlug);

  if (!material) {
    return {
      title: 'Material Not Found | WholesalerJi',
    };
  }

  if (materialSlug === 'primo') {
    return {
      title: 'Primo PVC Wall Panels Gurgaon | Wholesale 12" | WholesalerJi',
      description: 'Buy Primo PVC Wall Panels in Gurgaon at factory wholesale rates (₹499/pc). 100% waterproof virgin polymer, Class B1 fire retardant for projects & contractors.',
      alternates: {
        canonical: 'https://wholesalerji.com/wall-panels/primo',
      },
      openGraph: {
        title: 'Primo PVC Wall Panels Gurgaon | Wholesale 12" Architectural Cladding',
        description: 'Direct factory wholesale supply of 12-inch seamless Primo PVC wall panels in Gurgaon & Delhi NCR. 24 architectural wood & stone textures. 100% waterproof core.',
        images: [{ url: material.heroImage, width: 1200, height: 630, alt: 'Primo PVC Wall Panels Architectural Collection' }],
        type: 'website',
        url: 'https://wholesalerji.com/wall-panels/primo',
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Primo PVC Wall Panels Gurgaon | Wholesale 12" | WholesalerJi',
        description: 'Factory direct wholesale supply of 12-inch seamless Primo PVC wall panels in Gurgaon & Delhi NCR. 100% waterproof virgin polymer.',
        images: [material.heroImage],
      },
    };
  }

  if (materialSlug === 'elite') {
    const ogImage = 'https://res.cloudinary.com/def2qsxjg/image/upload/f_auto,q_auto/v1790908763/GF-401_installed_image_in_hall.png';
    return {
      title: 'Elite UV Marble Wall Panels Gurgaon | Wholesale 12" | WholesalerJi',
      description: 'Buy Elite UV High-Gloss Marble Wall Panels in Gurgaon at factory wholesale rates (₹549/pc). Italian Statuario & metallic 5mm sheets for luxury interiors.',
      alternates: {
        canonical: 'https://wholesalerji.com/wall-panels/elite',
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
        title: 'Elite UV Marble Wall Panels Gurgaon | Wholesale 12" Architectural Cladding',
        description: 'Direct factory wholesale supply of 12-inch seamless Elite UV high-gloss Italian marble and metallic wall panels in Gurgaon & Delhi NCR. 100% waterproof.',
        images: [{ url: ogImage, width: 1200, height: 630, alt: 'Elite UV High-Gloss Italian Marble Wall Panels Collection in Gurgaon' }],
        type: 'website',
        url: 'https://wholesalerji.com/wall-panels/elite',
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Elite UV Marble Wall Panels Gurgaon | Wholesale 12" | WholesalerJi',
        description: 'Factory direct wholesale supply of 12-inch seamless Elite UV marble wall panels in Gurgaon & Delhi NCR. 100% waterproof virgin polymer core.',
        images: [ogImage],
      },
    };
  }

  if (materialSlug === 'primo-fluted') {
    const ogImage = 'https://res.cloudinary.com/def2qsxjg/image/upload/v1790929848/FP-708_installed_image_in_office.png';
    return {
      title: 'Primo Fluted WPC Wall Panels Gurgaon | Wholesale 9mm Louvers | WholesalerJi',
      description: 'Buy Primo Fluted WPC Wall Panels in Gurgaon at factory wholesale rates (₹599/pc). 13 wood louvers, 100% waterproof, acoustic sound diffusing & Class B1 fire rated.',
      alternates: {
        canonical: 'https://wholesalerji.com/wall-panels/primo-fluted',
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
        title: 'Primo Fluted WPC Wall Panels Gurgaon | Wholesale 9mm Louver Cladding',
        description: 'Direct mill wholesale supply of 9mm Primo Fluted WPC wall panels in Gurgaon & Delhi NCR. 13 natural wood textures with concealed interlocking tongue & groove joints.',
        images: [{ url: ogImage, width: 1200, height: 630, alt: 'Primo Fluted 9mm WPC Wall Panels Architectural Louver Collection in Gurgaon' }],
        type: 'website',
        url: 'https://wholesalerji.com/wall-panels/primo-fluted',
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Primo Fluted WPC Wall Panels Gurgaon | Wholesale 9mm Louvers | WholesalerJi',
        description: 'Factory direct wholesale supply of 9mm Primo Fluted WPC wall louvers in Gurgaon & Delhi NCR. 100% waterproof virgin polymer core.',
        images: [ogImage],
      },
    };
  }

  if (materialSlug === 'elite-fluted') {
    const ogImage = 'https://res.cloudinary.com/def2qsxjg/image/upload/v1790929841/FP-702_installed_image_in_room.jpg';
    return {
      title: 'Elite Fluted Wall Panels Gurgaon | 9mm WPC Louvers Wholesale | WholesalerJi',
      description: 'Buy Elite Fluted Wall Panels in Gurgaon & Delhi NCR at direct factory wholesale rates (₹599/pc). 9mm architectural WPC louvers, 100% waterproof, 9.68ft height.',
      alternates: {
        canonical: 'https://wholesalerji.com/wall-panels/elite-fluted',
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
        title: 'Elite Fluted Wall Panels Gurgaon | 9mm Architectural WPC Louver Cladding',
        description: 'Direct mill wholesale supply of 9mm Elite Fluted WPC wall panels in Gurgaon & Delhi NCR. 9 rich architectural wood finishes with concealed interlocking joints.',
        images: [{ url: ogImage, width: 1200, height: 630, alt: 'Elite Fluted 9mm WPC Wall Panels Architectural Louver Collection in Gurgaon' }],
        type: 'website',
        url: 'https://wholesalerji.com/wall-panels/elite-fluted',
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Elite Fluted Wall Panels Gurgaon | 9mm WPC Louvers | WholesalerJi',
        description: 'Factory direct wholesale supply of 9mm Elite Fluted WPC wall louvers in Gurgaon & Delhi NCR. 100% waterproof virgin polymer core.',
        images: [ogImage],
      },
    };
  }

  return {
    title: `${material.seoTitle} | WholesalerJi B2B`,
    description: material.seoDescription,
    alternates: {
      canonical: `https://wholesalerji.com/wall-panels/${material.slug}`,
    },
    openGraph: {
      title: material.seoTitle,
      description: material.seoDescription,
      images: [{ url: material.heroImage, width: 1200, height: 630 }],
      type: 'website',
    },
  };
}

export default async function MaterialPillarPage({ params }: Props) {
  const { material: materialSlug } = await params;
  const material = await getMaterialBySlug(materialSlug);

  if (!material) {
    notFound();
  }

  const products = await getProducts(material.slug);
  const allMaterials = await getMaterials();

  const getFaqSchema = () => ({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": material.faq?.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer,
      },
    })) || [],
  });

  const getPrimoSchemas = () => {
    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://wholesalerji.com"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Wall Panels",
          "item": "https://wholesalerji.com/wall-panels"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Primo PVC Wall Panels",
          "item": "https://wholesalerji.com/wall-panels/primo"
        }
      ]
    };

    const productSchema = {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": "Primo PVC Wall Panels",
      "description": "12-inch (300mm) seamless flat PVC architectural wall panels in 24 wood grain, stone, and metallic finishes. 100% waterproof virgin polymer core, Class B1 flame retardant. Direct factory wholesale supply in Gurgaon, Delhi NCR, and India.",
      "image": "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1776780203/Primo_GF-301_Pvc_Panel_Goals_Floors.png",
      "sku": "GF-PRIMO-SERIES",
      "mpn": "PRIMO-300MM-5MM",
      "brand": {
        "@type": "Brand",
        "name": "WholesalerJi"
      },
      "material": "100% Virgin Polymer Matrix (PVC)",
      "color": "24 Curated Architectural Finishes",
      "offers": {
        "@type": "Offer",
        "price": "499",
        "priceCurrency": "INR",
        "priceValidUntil": "2027-12-31",
        "availability": "https://schema.org/InStock",
        "itemCondition": "https://schema.org/NewCondition",
        "url": "https://wholesalerji.com/wall-panels/primo",
        "seller": {
          "@type": "Organization",
          "name": "WholesalerJi"
        }
      }
    };

    return [breadcrumbSchema, productSchema, getFaqSchema()];
  };

  const getEliteSchemas = () => {
    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://wholesalerji.com"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Wall Panels",
          "item": "https://wholesalerji.com/wall-panels"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Elite UV Marble Wall Panels",
          "item": "https://wholesalerji.com/wall-panels/elite"
        }
      ]
    };

    const productSchema = {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": "Elite UV High-Gloss Marble Wall Panels",
      "description": "12-inch (300mm) seamless UV high-gloss Italian marble and metallic architectural wall panels. 5mm virgin polymer core, 100% waterproof, Class B1 flame retardant. Direct factory wholesale supply in Gurgaon, Delhi NCR, and India.",
      "image": "https://res.cloudinary.com/def2qsxjg/image/upload/f_auto,q_auto/v1790908763/GF-401_installed_image_in_hall.png",
      "sku": "GF-ELITE-SERIES",
      "mpn": "ELITE-300MM-5MM",
      "brand": {
        "@type": "Brand",
        "name": "WholesalerJi"
      },
      "material": "High-Gloss UV Cured Acrylic over Virgin Polymer Matrix",
      "color": "12 Curated Italian Marble & Metallic Finishes",
      "offers": {
        "@type": "Offer",
        "price": "549",
        "priceCurrency": "INR",
        "priceValidUntil": "2027-12-31",
        "availability": "https://schema.org/InStock",
        "itemCondition": "https://schema.org/NewCondition",
        "url": "https://wholesalerji.com/wall-panels/elite",
        "seller": {
          "@type": "Organization",
          "name": "WholesalerJi"
        }
      }
    };

    const itemListSchema = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "Elite UV High-Gloss Marble Wall Panels Collection",
      "numberOfItems": ELITE_WALL_PANELS.length,
      "itemListElement": ELITE_WALL_PANELS.map((p, idx) => ({
        "@type": "ListItem",
        "position": idx + 1,
        "item": {
          "@type": "Product",
          "name": p.name,
          "image": p.imageUrl,
          "sku": p.code,
          "offers": {
            "@type": "Offer",
            "price": p.pricePerPiece,
            "priceCurrency": "INR",
            "availability": "https://schema.org/InStock",
            "url": "https://wholesalerji.com/wall-panels/elite"
          }
        }
      }))
    };

    const localBusinessSchema = {
      "@context": "https://schema.org",
      "@type": "HomeGoodsStore",
      "name": "WholesalerJi — Elite UV Marble Wall Panels Depot",
      "image": "https://res.cloudinary.com/def2qsxjg/image/upload/f_auto,q_auto/v1790908763/GF-401_installed_image_in_hall.png",
      "telephone": "+919217400163",
      "url": "https://wholesalerji.com/wall-panels/elite",
      "priceRange": "₹₹",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Sector 34",
        "addressLocality": "Gurugram",
        "addressRegion": "Haryana",
        "postalCode": "122001",
        "addressCountry": "IN"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "28.4289",
        "longitude": "77.0175"
      },
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
          "opens": "09:30",
          "closes": "19:00"
        }
      ]
    };

    return [breadcrumbSchema, productSchema, itemListSchema, localBusinessSchema, getFaqSchema()];
  };

  const getPrimoFlutedSchemas = () => {
    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://wholesalerji.com"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Wall Panels",
          "item": "https://wholesalerji.com/wall-panels"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Primo Fluted WPC Wall Panels",
          "item": "https://wholesalerji.com/wall-panels/primo-fluted"
        }
      ]
    };

    const productSchema = {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": "Primo Fluted 9mm WPC Wall Panels",
      "description": "9mm architectural deep-rib wood plastic composite (WPC) wall louvers in 13 curated timber finishes. 100% waterproof, termite proof, Class B1 flame retardant with acoustic echo diffusion. Factory wholesale supply in Gurgaon, Delhi NCR, and India.",
      "image": "https://res.cloudinary.com/def2qsxjg/image/upload/v1790929848/FP-708_installed_image_in_office.png",
      "sku": "GF-PRIMO-FLUTED-SERIES",
      "mpn": "PRIMO-FLUTED-300MM-9MM",
      "brand": {
        "@type": "Brand",
        "name": "WholesalerJi"
      },
      "material": "Virgin Wood Plastic Polymer Composite (WPC)",
      "color": "13 Curated Architectural Fluted Finishes",
      "offers": {
        "@type": "Offer",
        "price": "599",
        "priceCurrency": "INR",
        "priceValidUntil": "2027-12-31",
        "availability": "https://schema.org/InStock",
        "itemCondition": "https://schema.org/NewCondition",
        "url": "https://wholesalerji.com/wall-panels/primo-fluted",
        "seller": {
          "@type": "Organization",
          "name": "WholesalerJi"
        }
      }
    };

    const itemListSchema = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "Primo Fluted WPC Wall Panels Architectural Collection",
      "numberOfItems": PRIMO_FLUTED_WALL_PANELS.length,
      "itemListElement": PRIMO_FLUTED_WALL_PANELS.map((p, idx) => ({
        "@type": "ListItem",
        "position": idx + 1,
        "item": {
          "@type": "Product",
          "name": p.name,
          "image": p.installedImage || p.imageUrl,
          "description": p.installedImageAlt || p.description,
          "sku": p.code,
          "offers": {
            "@type": "Offer",
            "price": p.pricePerPiece,
            "priceCurrency": "INR",
            "availability": "https://schema.org/InStock",
            "url": "https://wholesalerji.com/wall-panels/primo-fluted"
          }
        }
      }))
    };

    const localBusinessSchema = {
      "@context": "https://schema.org",
      "@type": "HomeGoodsStore",
      "name": "WholesalerJi — Primo Fluted WPC Wall Panels Depot",
      "image": "https://res.cloudinary.com/def2qsxjg/image/upload/v1790929848/FP-708_installed_image_in_office.png",
      "telephone": "+919217400163",
      "url": "https://wholesalerji.com/wall-panels/primo-fluted",
      "priceRange": "₹₹",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Sector 34",
        "addressLocality": "Gurugram",
        "addressRegion": "Haryana",
        "postalCode": "122001",
        "addressCountry": "IN"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "28.4289",
        "longitude": "77.0175"
      },
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
          "opens": "09:30",
          "closes": "19:00"
        }
      ]
    };

    return [breadcrumbSchema, productSchema, itemListSchema, localBusinessSchema, getFaqSchema()];
  };

  if (materialSlug === 'primo') {
    const schemas = getPrimoSchemas();
    return (
      <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col selection:bg-amber-500 selection:text-stone-950 transition-colors">
        {schemas.map((schema, idx) => (
          <script
            key={idx}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}
        <Navbar currentPath={`/wall-panels/${materialSlug}`} />
        <main className="flex-1">
          <PrimoSeriesTemplate initialData={PRIMO_WALL_PANELS[0]} allShades={PRIMO_WALL_PANELS} />
        </main>
      </div>
    );
  }

  if (materialSlug === 'elite') {
    const schemas = getEliteSchemas();
    return (
      <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col selection:bg-amber-500 selection:text-stone-950 transition-colors">
        {schemas.map((schema, idx) => (
          <script
            key={idx}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}
        <Navbar currentPath={`/wall-panels/${materialSlug}`} />
        <main className="flex-1">
          <EliteSeriesTemplate initialData={ELITE_WALL_PANELS[0]} allShades={ELITE_WALL_PANELS} />
        </main>
      </div>
    );
  }

  if (materialSlug === 'primo-fluted') {
    const schemas = getPrimoFlutedSchemas();
    return (
      <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col selection:bg-amber-500 selection:text-stone-950 transition-colors">
        {schemas.map((schema, idx) => (
          <script
            key={idx}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}
        <Navbar currentPath={`/wall-panels/${materialSlug}`} />
        <main className="flex-1">
          <PrimoFlutedSeriesTemplate initialData={PRIMO_FLUTED_WALL_PANELS[0]} allShades={PRIMO_FLUTED_WALL_PANELS} />
        </main>
      </div>
    );
  }

  const getEliteFlutedSchemas = () => {
    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://wholesalerji.com"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Wall Panels",
          "item": "https://wholesalerji.com/wall-panels"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Elite Fluted Wall Panels",
          "item": "https://wholesalerji.com/wall-panels/elite-fluted"
        }
      ]
    };

    const productSchema = {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": "Elite Fluted 9mm Architectural WPC Wall Panels",
      "description": "9mm heavy-duty architectural fluted wood plastic composite (WPC) wall louvers in 9 curated wood finishes. 100% waterproof, Class B1 fire retardant, termite proof with deep shadow grooves. Factory wholesale supply in Gurgaon, Delhi NCR, and India.",
      "image": "https://res.cloudinary.com/def2qsxjg/image/upload/v1790929841/FP-702_installed_image_in_room.jpg",
      "sku": "GF-ELITE-FLUTED-SERIES",
      "mpn": "ELITE-FLUTED-300MM-9MM",
      "brand": {
        "@type": "Brand",
        "name": "WholesalerJi"
      },
      "material": "Virgin Wood Plastic Polymer Composite (WPC)",
      "color": "9 Architectural Wood Finishes",
      "offers": {
        "@type": "Offer",
        "price": "599",
        "priceCurrency": "INR",
        "priceValidUntil": "2027-12-31",
        "availability": "https://schema.org/InStock",
        "itemCondition": "https://schema.org/NewCondition",
        "url": "https://wholesalerji.com/wall-panels/elite-fluted",
        "seller": {
          "@type": "Organization",
          "name": "WholesalerJi"
        }
      }
    };

    const itemListSchema = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "Elite Fluted Wall Panels Architectural Collection",
      "numberOfItems": ELITE_FLUTED_WALL_PANELS.length,
      "itemListElement": ELITE_FLUTED_WALL_PANELS.map((p, idx) => ({
        "@type": "ListItem",
        "position": idx + 1,
        "item": {
          "@type": "Product",
          "name": p.name,
          "image": p.imageUrl,
          "description": p.description,
          "sku": p.code,
          "offers": {
            "@type": "Offer",
            "price": p.pricePerPiece,
            "priceCurrency": "INR",
            "availability": "https://schema.org/InStock",
            "url": "https://wholesalerji.com/wall-panels/elite-fluted"
          }
        }
      }))
    };

    const localBusinessSchema = {
      "@context": "https://schema.org",
      "@type": "HomeGoodsStore",
      "name": "WholesalerJi — Elite Fluted Wall Panels Depot",
      "image": "https://res.cloudinary.com/def2qsxjg/image/upload/v1790929841/FP-702_installed_image_in_room.jpg",
      "telephone": "+919217400163",
      "url": "https://wholesalerji.com/wall-panels/elite-fluted",
      "priceRange": "₹₹",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Sector 34",
        "addressLocality": "Gurugram",
        "addressRegion": "Haryana",
        "postalCode": "122001",
        "addressCountry": "IN"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "28.4289",
        "longitude": "77.0175"
      },
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
          "opens": "09:30",
          "closes": "19:00"
        }
      ]
    };

    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": ELITE_FLUTED_FAQS.map((faq) => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer,
        },
      })),
    };

    return [breadcrumbSchema, productSchema, itemListSchema, localBusinessSchema, faqSchema];
  };

  if (materialSlug === 'elite-fluted') {
    const schemas = getEliteFlutedSchemas();
    return (
      <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col selection:bg-amber-500 selection:text-stone-950 transition-colors">
        {schemas.map((schema, idx) => (
          <script
            key={idx}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}
        <Navbar currentPath={`/wall-panels/${materialSlug}`} />
        <main className="flex-1">
          <EliteFlutedSeriesTemplate initialData={ELITE_FLUTED_WALL_PANELS[0]} allShades={ELITE_FLUTED_WALL_PANELS} />
        </main>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 font-sans selection:bg-amber-500 selection:text-stone-950">
      <Navbar currentPath={`/wall-panels/${materialSlug}`} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-stone-400 mb-6">
          <Link href="/" className="hover:text-amber-400">Home</Link>
          <span>/</span>
          <Link href="/#catalog" className="hover:text-amber-400">Wall Panels</Link>
          <span>/</span>
          <span className="text-white font-bold">{material.name}</span>
        </nav>

        {/* Pillar Header Hero */}
        <div className="relative rounded-3xl bg-stone-900 border border-stone-800 p-8 md:p-12 mb-12 overflow-hidden">
          <div className="relative z-10 max-w-3xl">
            <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full mb-3">
              Direct Mill Dispatch • Verified Wholesale Grade
            </span>
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
              {material.fullName}
            </h1>
            <p className="mt-4 text-sm md:text-base text-stone-300 leading-relaxed">
              {material.seoDescription}
            </p>

            {/* Quick Material Filter Pills */}
            <div className="flex flex-wrap gap-2 mt-6">
              {allMaterials.map((m) => (
                <Link
                  key={m.slug}
                  href={`/wall-panels/${m.slug}`}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-colors ${
                    m.slug === material.slug
                      ? 'bg-amber-500 text-stone-950 border-amber-400'
                      : 'bg-stone-950 text-stone-300 border-stone-800 hover:border-stone-600'
                  }`}
                >
                  {m.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="absolute right-0 top-0 w-1/3 h-full opacity-20 hidden md:block pointer-events-none">
            <Image
              src={material.heroImage}
              alt={material.name}
              fill
              className="object-cover object-center"
            />
          </div>
        </div>

        {/* Product Grid */}
        <section className="mb-16">
          <ProductGrid
            products={products}
            title={`${material.name} Product Range`}
            subtitle={`Showing ${products.length} standard commercial SKU(s) with tiered wholesale pricing.`}
          />
        </section>

        {/* Interactive RFQ Lead Drawer Section */}
        <section className="mb-16">
          <LeadForm
            initialMaterial={material.name}
            initialProductName={material.fullName}
          />
        </section>

        {/* Category FAQ Accordion (Pure Semantic HTML for SEO Schema) */}
        {material.faq && material.faq.length > 0 && (
          <section className="border-t border-stone-800 pt-12">
            <h3 className="text-xl md:text-2xl font-bold text-white mb-6">
              Frequently Asked Questions — {material.name}
            </h3>
            <div className="space-y-4">
              {material.faq.map((item, index) => (
                <details
                  key={index}
                  className="group bg-stone-900 border border-stone-800 rounded-xl p-5 open:border-amber-500/50 transition-colors"
                >
                  <summary className="font-semibold text-stone-200 cursor-pointer list-none flex items-center justify-between">
                    <span>{item.question}</span>
                    <span className="text-amber-400 font-bold transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-xs md:text-sm text-stone-400 leading-relaxed border-t border-stone-800/80 pt-3">
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-800 bg-stone-950 py-10 text-stone-400 text-xs text-center">
        <p>© 2026 WholesalerJi Technologies Pvt. Ltd. • Pan-India B2B Wall Panel Hub</p>
      </footer>
    </div>
  );
}
