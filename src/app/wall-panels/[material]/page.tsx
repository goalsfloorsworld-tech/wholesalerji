import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getMaterialBySlug, getMaterials, getProducts } from '@/sanity/client';
import ProductGrid from '@/components/server/ProductGrid';
import LeadForm from '@/components/client/LeadForm';

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
      title: 'Material Not Found | Wholesaleji',
    };
  }

  return {
    title: `${material.seoTitle} | Wholesaleji B2B`,
    description: material.seoDescription,
    alternates: {
      canonical: `https://wholesaleji.com/wall-panels/${material.slug}`,
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

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 font-sans selection:bg-amber-500 selection:text-stone-950">
      {/* Header / Nav */}
      <header className="sticky top-0 z-50 bg-stone-950/85 backdrop-blur-md border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="text-2xl font-black tracking-tight text-white">
            WHOLESALE<span className="text-amber-500">JI</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/#catalog" className="text-xs font-semibold text-stone-300 hover:text-white">
              All Materials
            </Link>
            <a
              href="https://wa.me/919999999999"
              className="px-3.5 py-1.5 text-xs font-bold uppercase rounded bg-emerald-600 hover:bg-emerald-500 text-white"
            >
              WhatsApp RFQ
            </a>
          </div>
        </div>
      </header>

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
        <p>© 2026 Wholesaleji Technologies Pvt. Ltd. • Pan-India B2B Wall Panel Hub</p>
      </footer>
    </div>
  );
}
