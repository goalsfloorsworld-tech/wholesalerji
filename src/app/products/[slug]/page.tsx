import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import PrimoSeriesTemplate from '@/components/templates/PrimoSeriesTemplate';
import EliteSeriesTemplate from '@/components/templates/EliteSeriesTemplate';
import PrimoFlutedSeriesTemplate from '@/components/templates/PrimoFlutedSeriesTemplate';
import EliteFlutedSeriesTemplate from '@/components/templates/EliteFlutedSeriesTemplate';
import { PRIMO_WALL_PANELS, PRIMO_FAQS } from '@/data/primoPanelsData';
import { ELITE_WALL_PANELS, ELITE_FAQS } from '@/data/elitePanelsData';
import { PRIMO_FLUTED_WALL_PANELS, PRIMO_FLUTED_FAQS } from '@/data/primoFlutedPanelsData';
import { ELITE_FLUTED_WALL_PANELS, ELITE_FLUTED_FAQS } from '@/data/eliteFlutedPanelsData';

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

// Supported collection / product series slugs
export async function generateStaticParams() {
  return [
    { slug: 'primo-panels' },
    { slug: 'primo' },
    { slug: 'elite-panels' },
    { slug: 'elite' },
    { slug: 'primo-fluted-panels' },
    { slug: 'primo-fluted' },
    { slug: 'fluted-panels' },
    { slug: 'elite-fluted-panels' },
  ];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const normalizedSlug = slug.toLowerCase();

  // Primo Series Metadata
  if (normalizedSlug === 'primo-panels' || normalizedSlug === 'primo') {
    return {
      title: 'Primo Panels | 24 Colors Architectural Wall Cladding | Wholesaleji',
      description:
        'Explore the flagship Primo Panels collection. 24 production shades (GF-301 to GF-324) engineered for moisture-proof interior cladding at direct mill wholesale rates.',
      alternates: {
        canonical: 'https://wholesaleji.com/products/primo-panels',
      },
      openGraph: {
        title: 'Primo Panels | 24 Colors Architectural Wall Cladding | Wholesaleji',
        description:
          'Direct manufacturer rates for Primo Wall Panels. 100% waterproof, tongue & groove interlocking profile.',
        url: 'https://wholesaleji.com/products/primo-panels',
        images: [
          {
            url: 'https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1776780203/Primo_GF-301_Pvc_Panel_Goals_Floors.png',
            width: 1200,
            height: 630,
          },
        ],
      },
    };
  }

  // Elite Series Metadata
  if (normalizedSlug === 'elite-panels' || normalizedSlug === 'elite') {
    return {
      title: 'Elite Panels | 12 UV High-Gloss Marble Wall Panels | Wholesaleji',
      description:
        'Explore Elite Panels. 12 UV high-gloss Italian Calacatta marble, black Portoro, and metallic wall panels in 12-inch wide seamless profiles at direct mill rates.',
      alternates: {
        canonical: 'https://wholesaleji.com/products/elite-panels',
      },
      openGraph: {
        title: 'Elite Panels | 12 UV High-Gloss Marble Wall Panels | Wholesaleji',
        description:
          'Direct manufacturer rates for Elite UV High-Gloss Wall Panels. 98% specular gloss, 100% waterproof seelan protection.',
        url: 'https://wholesaleji.com/products/elite-panels',
        images: [
          {
            url: 'https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1776777064/GF-401_Premium_Pvc_Panel_In_Gurgaon.png',
            width: 1200,
            height: 630,
          },
        ],
      },
    };
  }

  // Primo Fluted Series Metadata
  if (
    normalizedSlug === 'primo-fluted-panels' ||
    normalizedSlug === 'primo-fluted' ||
    normalizedSlug === 'fluted-panels'
  ) {
    return {
      title: 'Primo Fluted Panels | 13 Architectural Wood Finishes | Wholesaleji',
      description:
        'Explore Primo Fluted Panels from the Classic Wood Series. 13 authentic wood louver finishes (FP-701 to FP-713) in 9MM WPC profile at ₹599 direct mill rates.',
      alternates: {
        canonical: 'https://wholesaleji.com/products/primo-fluted-panels',
      },
      openGraph: {
        title: 'Primo Fluted Panels | 13 Architectural Wood Finishes | Wholesaleji',
        description:
          'Direct manufacturer rates for Primo Fluted Panels. 9MM profile, 100% waterproof WPC core, concealed interlocking joint.',
        url: 'https://wholesaleji.com/products/primo-fluted-panels',
        images: [
          {
            url: 'https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/Fluted_Panel_FP_-_701.png',
            width: 1200,
            height: 630,
          },
        ],
      },
    };
  }

  // Elite Fluted Series Metadata
  if (normalizedSlug === 'elite-fluted-panels') {
    return {
      title: 'Elite Fluted Panels | 9mm Premium Architectural WPC Panels | Wholesaleji',
      description:
        'Discover Elite Fluted Panels by Goals Floors. Featuring 9 MM thickness, 2950 x 300 MM dimensions, premium textured finish, and 100% waterproof WPC core for modern interior wall cladding.',
      alternates: {
        canonical: 'https://wholesaleji.com/products/elite-fluted-panels',
      },
      openGraph: {
        title: 'Elite Fluted Panels | Premium WPC Louver Wall Panels',
        description:
          'Transform interiors with Elite Fluted Panels. 9MM thickness, 100% waterproof, and zero maintenance. Factory rates available in Gurugram / Delhi NCR.',
        url: 'https://wholesaleji.com/products/elite-fluted-panels',
        images: [
          {
            url: ELITE_FLUTED_WALL_PANELS[0]?.imageUrl || 'https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/Fluted_Panel_FP_-_714.png',
            width: 1200,
            height: 630,
          },
        ],
      },
    };
  }

  return {
    title: 'Product Not Found | Wholesaleji',
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const normalizedSlug = slug.toLowerCase();

  // 1. Primo Series Template Routing
  if (normalizedSlug === 'primo-panels' || normalizedSlug === 'primo') {
    const initialPanel = PRIMO_WALL_PANELS[0];

    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": PRIMO_FAQS.map((faq) => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer,
        },
      })),
    };

    return (
      <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col selection:bg-amber-500 selection:text-stone-950 transition-colors">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
        <Navbar currentPath={`/products/${slug}`} />
        <main className="flex-1">
          <PrimoSeriesTemplate
            initialData={initialPanel}
            allShades={PRIMO_WALL_PANELS}
          />
        </main>
      </div>
    );
  }

  // 2. Elite Series Template Routing
  if (normalizedSlug === 'elite-panels' || normalizedSlug === 'elite') {
    const initialPanel = ELITE_WALL_PANELS[0];

    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": ELITE_FAQS.map((faq) => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer,
        },
      })),
    };

    return (
      <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col selection:bg-amber-500 selection:text-stone-950 transition-colors">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
        <Navbar currentPath={`/products/${slug}`} />
        <main className="flex-1">
          <EliteSeriesTemplate
            initialData={initialPanel}
            allShades={ELITE_WALL_PANELS}
          />
        </main>
      </div>
    );
  }

  // 3. Primo Fluted Series Template Routing
  if (
    normalizedSlug === 'primo-fluted-panels' ||
    normalizedSlug === 'primo-fluted' ||
    normalizedSlug === 'fluted-panels'
  ) {
    const initialPanel = PRIMO_FLUTED_WALL_PANELS[0];

    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": PRIMO_FLUTED_FAQS.map((faq) => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer,
        },
      })),
    };

    return (
      <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col selection:bg-amber-500 selection:text-stone-950 transition-colors">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
        <Navbar currentPath={`/products/${slug}`} />
        <main className="flex-1">
          <PrimoFlutedSeriesTemplate
            initialData={initialPanel}
            allShades={PRIMO_FLUTED_WALL_PANELS}
          />
        </main>
      </div>
    );
  }

  // 4. Elite Fluted Series Template Routing
  if (normalizedSlug === 'elite-fluted-panels') {
    const initialPanel = ELITE_FLUTED_WALL_PANELS[0];

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

    return (
      <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col selection:bg-amber-500 selection:text-stone-950 transition-colors">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
        <Navbar currentPath={`/products/${slug}`} />
        <main className="flex-1">
          <EliteFlutedSeriesTemplate
            initialData={initialPanel}
            allShades={ELITE_FLUTED_WALL_PANELS}
          />
        </main>
      </div>
    );
  }

  // If slug doesn't match any known collection/series template
  notFound();
}
