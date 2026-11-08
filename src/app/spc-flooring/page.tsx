'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import GrassShowcase from '@/components/artificial-grass/GrassShowcase';
import FAQ from '@/components/FAQ';
import QuickInquiryModal from '@/components/QuickInquiryModal';
import ContactForm from '@/components/ContactForm';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}
import {
  SPC_DESIGNS,
  SPC_SPECIFICATIONS,
  FLOORING_COMPARISONS,
  SPC_FAQS,
  APPLICATION_SPACES,
  SPC_META,
  SPC_LAYERS_DATA,
  SPC_HERO_SLIDES,
} from '@/data/spcFlooringData';
import {
  ArrowRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  ShieldCheck,
  Droplets,
  Layers,
  Volume2,
  Truck,
  Phone,
  Sparkles,
  Clock,
  Building2,
  Home,
  Check,
  Minus,
  Box,
  Link2,
  Flame,
} from 'lucide-react';

const SPEC_ICONS = [Layers, ShieldCheck, Box, Link2, Volume2, Flame];

export default function SpcFlooringPage() {
  const baseUrl = 'https://wholesalerji.com';

  // Modal State for Quick Inquiry & Lead Capture
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [activeProductCode, setActiveProductCode] = useState<string>('WJ-SPC-295');
  const [inquiryTitle, setInquiryTitle] = useState('Get SPC Flooring Quote');
  const [inquirySubtitle, setInquirySubtitle] = useState(
    'Direct factory wholesale rates & project estimates with pan-India dispatch.'
  );

  // Active Technical Specification Accordion Card State
  const [activeSpecIndex, setActiveSpecIndex] = useState<number>(0);

  // Active Installed Space Tab State (Residential vs Retail/Commercial)
  const [activeSpaceTab, setActiveSpaceTab] = useState<'residential' | 'retail'>('residential');

  // Hero Section Interactive Auto-Scroll Carousel State
  const [heroSlideIndex, setHeroSlideIndex] = useState(0);
  const [isHeroPaused, setIsHeroPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (isHeroPaused) return;
    const timer = setInterval(() => {
      setHeroSlideIndex((prev) => (prev + 1) % SPC_HERO_SLIDES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isHeroPaused]);

  const nextHeroSlide = () => {
    setHeroSlideIndex((prev) => (prev + 1) % SPC_HERO_SLIDES.length);
  };

  const prevHeroSlide = () => {
    setHeroSlideIndex((prev) => (prev - 1 + SPC_HERO_SLIDES.length) % SPC_HERO_SLIDES.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (diff > 45) {
      nextHeroSlide();
    } else if (diff < -45) {
      prevHeroSlide();
    }
    touchStartX.current = null;
  };



  const openQuoteModal = (source: string, productName?: string) => {
    setActiveProductCode(productName || 'General SPC Flooring');
    setInquiryTitle('Get SPC Flooring Price');
    setInquirySubtitle(
      productName
        ? `Direct factory rates for ${productName} (${source}) with nationwide project dispatch.`
        : 'Connect directly with our wholesale team for project rate cards and plank estimates.'
    );
    setIsInquiryModalOpen(true);
  };

  // Section 03 GSAP Pinned Scroll Timeline
  const anatomySectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>('.spc-anatomy-card');
      if (!cards || cards.length === 0) return;

      // Card 0 visible and in place, all other cards positioned below and hidden
      gsap.set(cards[0], { autoAlpha: 1, y: 0 });
      gsap.set(cards.slice(1), { autoAlpha: 0, y: 50 });

      // Pinned timeline with ScrollTrigger
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: anatomySectionRef.current,
          start: 'top top',
          end: `+=${cards.length * 650}`,
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      cards.forEach((card, i) => {
        if (i < cards.length - 1) {
          const nextCard = cards[i + 1];
          const stepTime = i * 2;

          tl.to(
            card,
            {
              autoAlpha: 0,
              y: -50,
              duration: 1,
              ease: 'power2.inOut',
            },
            stepTime + 1
          )
            .to(
              nextCard,
              {
                autoAlpha: 1,
                y: 0,
                duration: 1,
                ease: 'power2.inOut',
              },
              stepTime + 1
            )
            .to({}, { duration: 0.8 }); // read hold
        }
      });
    }, anatomySectionRef);

    return () => ctx.revert();
  }, []);



  // Structured Data Schemas
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
        name: 'SPC Flooring',
        item: `${baseUrl}/spc-flooring`,
      },
    ],
  };

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'WholesalerJi SPC Flooring Collections',
    description:
      'Curated catalogue of stone plastic composite rigid core flooring planks with wholesale pricing per sq.ft.',
    numberOfItems: SPC_DESIGNS.length,
    itemListElement: SPC_DESIGNS.map((product, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      item: {
        '@type': 'Product',
        name: product.name,
        sku: product.code,
        mpn: product.code,
        image: product.image.startsWith('http') ? product.image : `${baseUrl}${product.image}`,
        description: product.description,
        category: 'SPC Flooring Planks',
        brand: {
          '@type': 'Brand',
          name: 'WholesalerJi',
        },
        offers: {
          '@type': 'Offer',
          url: `${baseUrl}/spc-flooring#products`,
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

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: SPC_FAQS.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'WholesaleStore',
    name: 'WholesalerJi - SPC Flooring Manufacturer & Wholesale Supplier India',
    image: `${baseUrl}/assets/home-image.jpg`,
    '@id': `${baseUrl}/spc-flooring#depot`,
    url: `${baseUrl}/spc-flooring`,
    telephone: '+919217400163',
    priceRange: '₹65 - ₹110 per sq.ft',
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
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '09:00',
        closes: '19:30',
      },
    ],
    areaServed: {
      '@type': 'Country',
      name: 'India',
    },
  };

  return (
    <div className="w-full bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 overflow-x-hidden selection:bg-amber-500 selection:text-stone-950 transition-colors duration-300">
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
      <Navbar currentPath="/spc-flooring" />

      {/* ========================================================================= */}
      {/* 01. HERO SECTION                                                          */}
      {/* ========================================================================= */}
      <section className="relative min-h-[100svh] flex flex-col justify-center pt-16 sm:pt-20 pb-8 sm:pb-12 px-4 sm:px-8 lg:px-12 xl:px-16 border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 overflow-hidden">
        {/* Subtle Ambient Background Asset */}
        <div className="absolute inset-0 pointer-events-none select-none z-0 opacity-20 dark:opacity-15">
          <Image
            src="/assets/home-image.jpg"
            alt="SPC Flooring architectural texture"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center filter saturate-50"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-50 via-stone-50/95 to-transparent dark:from-stone-950 dark:via-stone-950/95 dark:to-transparent" />
        </div>

        <div className="max-w-[1440px] mx-auto w-full relative z-10 flex flex-col">
          {/* Breadcrumb Trail */}
          <div className="flex items-center justify-between gap-2 mb-6">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400 font-mono">
              <Link href="/" className="hover:text-amber-500 transition-colors">Home</Link>
              <span>/</span>
              <span className="text-amber-600 dark:text-amber-400 font-semibold">SPC Flooring</span>
            </nav>
          </div>

          {/* Main Hero Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Headline & Copy (Max 4 Text Elements per design guidelines) */}
            <div className="lg:col-span-7 flex flex-col">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 mb-3">
                Architectural Rigid Core Cladding
              </span>

              <h1 className="text-4xl sm:text-6xl lg:text-[68px] font-black text-stone-900 dark:text-white tracking-tight leading-[1.05] mb-5">
                SPC Flooring
              </h1>

              <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 font-light leading-relaxed max-w-[62ch] mb-8">
                Direct mill wholesale supply with nationwide express dispatch across India. 100% waterproof rigid limestone core with pre-attached IXPE acoustic underlay for quiet, floating click-lock installation over existing floors.
              </p>

              {/* Action Button: Single Primary CTA */}
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => openQuoteModal('Hero', 'General Wholesale Price Inquiry')}
                  className="px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs sm:text-sm tracking-wide shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2 cursor-pointer group"
                >
                  <span>Get SPC Flooring Price</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Right Architectural In-Situ Visual Carousel */}
            <div
              className="lg:col-span-5 relative w-full aspect-[4/3] rounded-3xl overflow-hidden border border-stone-200 dark:border-stone-800 shadow-2xl group select-none bg-stone-900"
              onMouseEnter={() => setIsHeroPaused(true)}
              onMouseLeave={() => setIsHeroPaused(false)}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {/* Slide Images */}
              {SPC_HERO_SLIDES.map((slide, index) => {
                const isActive = index === heroSlideIndex;
                return (
                  <div
                    key={slide.url}
                    className={`absolute inset-0 transition-all duration-700 ease-out ${
                      isActive
                        ? 'opacity-100 scale-100 z-10 pointer-events-auto'
                        : 'opacity-0 scale-105 z-0 pointer-events-none'
                    }`}
                  >
                    <Image
                      src={slide.url}
                      alt={slide.alt}
                      fill
                      priority={index === 0}
                      sizes="(max-width: 1024px) 100vw, 45vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                  </div>
                );
              })}

              {/* Prev / Next Navigation Arrows */}
              <button
                type="button"
                onClick={prevHeroSlide}
                aria-label="Previous room scene"
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/45 hover:bg-black/75 backdrop-blur-md text-white border border-white/20 flex items-center justify-center opacity-80 sm:opacity-0 sm:group-hover:opacity-100 transition-all cursor-pointer hover:scale-105"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={nextHeroSlide}
                aria-label="Next room scene"
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/45 hover:bg-black/75 backdrop-blur-md text-white border border-white/20 flex items-center justify-center opacity-80 sm:opacity-0 sm:group-hover:opacity-100 transition-all cursor-pointer hover:scale-105"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Centered Indicator Dots */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-black/55 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/15 shadow-lg">
                {SPC_HERO_SLIDES.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setHeroSlideIndex(i)}
                    aria-label={`Go to slide ${i + 1}`}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      i === heroSlideIndex ? 'w-5 bg-amber-400' : 'w-1.5 bg-white/40 hover:bg-white/70'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 02. DESIGN CATALOGUE (Reusing Existing GrassShowcase Component)           */}
      {/* ========================================================================= */}
      <GrassShowcase
        onOpenQuote={openQuoteModal}
        products={SPC_DESIGNS}
        singleLine={true}
        title={{
          srOnly: 'Wholesale Stone Plastic Composite (SPC) Flooring Manufacturer & Wholesale Supplier in India',
          line1: 'SPC Flooring',
          line2: 'Catalogue',
        }}
        subtitle="Experience live residential & commercial room scenes and inspect the dense 5mm rigid limestone core texture. Stocked with express freight dispatch across India."
        swatchDockLabel="Plank Shades"
        swatchDockAriaLabel="SPC Flooring Planks"
        trustPoints={[
          '100% Waterproof Limestone Core',
          'Pre-Attached 1mm IXPE Underlay',
          'Express Pan-India Dispatch',
        ]}
        themeColor="amber"
        srCatalogTitle="All Wholesale SPC Flooring Specifications & Plank Rates"
      />

      {/* ========================================================================= */}
      {/* 03. WHAT IS SPC FLOORING? (Pinned Scroll Multi-Layer Storytelling)        */}
      {/* ========================================================================= */}
      <section
        ref={anatomySectionRef}
        id="anatomy"
        className="relative w-full h-screen max-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 border-b border-stone-200 dark:border-stone-800 overflow-hidden flex flex-col justify-center"
      >
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 flex flex-col justify-center my-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-center">
            
            {/* ── LEFT COLUMN: FROZEN TITLE & SNUG FITTED 3D IMAGE ── */}
            <div className="lg:col-span-6 flex flex-col justify-center">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-600 dark:text-amber-500 mb-2 block">
                Core Material Science &amp; Anatomy
              </span>
              <h2 className="text-xl sm:text-2xl lg:text-[28px] font-bold text-stone-900 dark:text-white tracking-tight leading-snug mb-3">
                What Is Stone Plastic Composite (SPC) Flooring?
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 font-light leading-relaxed mb-6 max-w-lg">
                An advanced multi-layer rigid core matrix combining 70% natural crushed limestone and 30% virgin polymer resin for 100% waterproof stability.
              </p>

              {/* Clean Photorealistic 3D Exploded Diagram - Tightly Fitted Box, ZERO CAPSULES */}
              <div className="relative w-full max-w-[420px] aspect-[4/3] rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-xl dark:shadow-2xl flex items-center justify-center">
                <Image
                  src="/images/def2qsxjg/f_auto,q_auto/v1792831449/spc_layers_diagram.jpg"
                  alt="3D exploded cross section diagram of 5 Stone Plastic Composite flooring layers"
                  fill
                  sizes="(max-width: 1024px) 100vw, 420px"
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            {/* ── RIGHT COLUMN: ONE CARD AT A TIME (FADE IN/OUT ON SCROLL) ── */}
            <div className="lg:col-span-6 flex items-center justify-center relative w-full h-[320px] sm:h-[350px]">
              {SPC_LAYERS_DATA.map((layer) => (
                <div
                  key={layer.id}
                  className="spc-anatomy-card absolute inset-0 p-8 sm:p-10 rounded-3xl bg-white/95 dark:bg-stone-900/95 border border-stone-200 dark:border-stone-800/90 shadow-2xl flex flex-col justify-center backdrop-blur-sm"
                >
                  <h3 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white tracking-tight mb-2">
                    {layer.title}
                  </h3>
                  <p className="text-xs sm:text-sm font-mono text-amber-600 dark:text-amber-400 mb-4">
                    {layer.tagline}
                  </p>
                  <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 font-light leading-relaxed">
                    {layer.description}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* Complete SSR SEO Structured Copy for Googlebot & Screen Readers */}
        <div className="sr-only" aria-label="Stone Plastic Composite Technical Core Material Science">
          <h3>What Is Stone Plastic Composite (SPC) Rigid Core Flooring?</h3>
          <p>
            Stone Plastic Composite (SPC) flooring is an advanced rigid core luxury floating floor system engineered
            with approximately 70% crushed natural limestone (calcium carbonate) and 30% virgin PVC polymer resin.
            Unlike wood laminate, SPC contains zero wood dust or MDF, rendering it 100% waterproof, non-hygroscopic,
            and completely immune to buckling or swelling across extreme seasonal temperatures and humid Indian monsoons.
          </p>
          <ul>
            {SPC_LAYERS_DATA.map((l) => (
              <li key={`ssr-l-${l.id}`}>
                <h4>Layer {l.num}: {l.title} ({l.spec})</h4>
                <p>{l.tagline}</p>
                <p>{l.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 04. SPECIFICATIONS & BUYING FACTORS (Interactive Expanding Cards Deck)   */}
      {/* ========================================================================= */}
      <section className="py-12 lg:py-16 px-4 sm:px-8 lg:px-12 border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 text-stone-900 dark:text-stone-100">
        <div className="max-w-[1440px] mx-auto w-full">
          {/* Header: Title in single line with subtitle directly beneath */}
          <div className="mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-stone-900 dark:text-white tracking-tight">
              Technical Specifications &amp; Selection Factors
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 font-light leading-relaxed mt-2 max-w-2xl">
              Hover over each parameter to inspect core engineering specifications, tolerances, and installation requirements.
            </p>
          </div>

          {/* Interactive Expanding Flex Deck (Smooth Horizontal Expansion on Desktop / Accordion on Mobile) */}
          <div
            className="flex flex-col md:flex-row gap-3 w-full min-h-[380px] lg:h-[390px] items-stretch"
            role="tablist"
            aria-label="Technical Specifications & Selection Factors"
          >
            {SPC_SPECIFICATIONS.map((spec, index) => {
              const isActive = activeSpecIndex === index;
              const IconComp = SPEC_ICONS[index % SPEC_ICONS.length];

              return (
                <div
                  key={spec.shortTitle}
                  role="tab"
                  tabIndex={0}
                  aria-selected={isActive}
                  onMouseEnter={() => setActiveSpecIndex(index)}
                  onClick={() => setActiveSpecIndex(index)}
                  onFocus={() => setActiveSpecIndex(index)}
                  className={`group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] border ${
                    isActive
                      ? 'md:flex-[3] lg:flex-[3.2] bg-stone-50 dark:bg-stone-900/95 border-amber-500/60 dark:border-amber-500/50 shadow-2xl shadow-amber-500/10 ring-1 ring-amber-500/20'
                      : 'md:flex-1 bg-stone-100/60 hover:bg-stone-100 dark:bg-stone-900/40 dark:hover:bg-stone-900/70 border-stone-200 hover:border-stone-300 dark:border-stone-800 dark:hover:border-stone-700'
                  }`}
                >
                  {/* ── COLLAPSED DESKTOP VIEW (Horizontal text at all times - NO vertical rotation) ── */}
                  <div
                    className={`hidden md:flex flex-col items-center justify-center text-center h-full p-4 transition-opacity duration-300 ${
                      isActive ? 'opacity-0 pointer-events-none absolute inset-0' : 'opacity-100'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-stone-200/80 dark:bg-stone-800/80 border border-stone-300/80 dark:border-stone-700/60 text-stone-600 dark:text-stone-400 group-hover:text-amber-600 dark:group-hover:text-amber-400 group-hover:border-amber-500/40 flex items-center justify-center mb-4 transition-all">
                      <IconComp className="w-5 h-5" />
                    </div>

                    {/* Short Word Always Horizontal */}
                    <span className="text-xs sm:text-sm font-bold text-stone-700 group-hover:text-stone-950 dark:text-stone-300 dark:group-hover:text-white transition-colors leading-snug px-1">
                      {spec.shortTitle}
                    </span>

                    <div className="w-1.5 h-1.5 rounded-full bg-stone-300 dark:bg-stone-700 group-hover:bg-amber-500 transition-colors mt-4" />
                  </div>

                  {/* ── COLLAPSED MOBILE VIEW (Visible when inactive on <md) ── */}
                  <div
                    className={`flex md:hidden items-center justify-between px-5 py-4 transition-all ${
                      isActive ? 'hidden' : 'flex'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <IconComp className="w-4 h-4 text-amber-600 dark:text-amber-500/80" />
                      <span className="text-sm font-bold text-stone-700 dark:text-stone-300">
                        {spec.shortTitle}
                      </span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-stone-400 dark:text-stone-500 -rotate-90" />
                  </div>

                  {/* ── EXPANDED FULL VIEW (Active card content - Middle body placement, no bottom footer) ── */}
                  <div
                    className={`flex flex-col justify-center h-full p-6 sm:p-8 transition-opacity duration-300 ${
                      isActive ? 'opacity-100' : 'opacity-0 pointer-events-none hidden md:hidden'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3">
                      <IconComp className="w-4 h-4" />
                    </div>

                    {/* Main Title */}
                    <h3 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white tracking-tight mb-1.5">
                      {spec.title}
                    </h3>

                    {/* Spec Value: Pure typography, NO RED/AMBER CAPSULE PILL */}
                    <p className="text-amber-600 dark:text-amber-400 font-mono text-xs sm:text-sm font-semibold tracking-wide mb-3">
                      {spec.specValue}
                    </p>

                    {/* Guidance & Architectural Context in Middle Body */}
                    <p className="text-stone-700 dark:text-stone-300 text-xs sm:text-sm font-light leading-relaxed mb-2.5">
                      {spec.guidance}
                    </p>

                    <p className="text-stone-500 dark:text-stone-400 text-xs font-light leading-relaxed">
                      {spec.architecturalContext}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* SSR Accessibility and Search Engine Structure */}
          <div className="sr-only" aria-label="Stone Plastic Composite Technical Specifications Details">
            {SPC_SPECIFICATIONS.map((spec, i) => (
              <div key={`ssr-spec-${i}`}>
                <h3>{spec.title}</h3>
                <p>Specification: {spec.specValue}</p>
                <p>{spec.guidance}</p>
                <p>{spec.architecturalContext}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 05. VERIFIED PERFORMANCE & APPLICATION LIMITS (Architectural Bento Grid) */}
      {/* ========================================================================= */}
      <section className="py-12 lg:py-16 px-4 sm:px-8 lg:px-12 border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100">
        <div className="max-w-[1440px] mx-auto w-full">
          {/* Header: Clean Single-line Title and Subtitle */}
          <div className="mb-10 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-stone-900 dark:text-white tracking-tight">
              Verified Performance &amp; Material Limits
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 font-light leading-relaxed mt-2 max-w-3xl">
              Engineering performance metrics and environmental tolerances tested across North Indian seasonal extremes.
            </p>
          </div>

          {/* Bento Performance Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 mb-8">
            {/* ── CARD 1: HERO WATERPROOFING (Spans 7 cols on lg) ── */}
            <div className="lg:col-span-7 p-7 sm:p-8 rounded-3xl bg-white dark:bg-gradient-to-br dark:from-stone-900 dark:via-stone-900/90 dark:to-stone-950 border border-stone-200 dark:border-stone-800 hover:border-amber-500/40 shadow-xl shadow-stone-200/50 dark:shadow-none transition-all flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-amber-500/10 transition-colors" />

              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                    <Droplets className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono font-bold text-amber-700 dark:text-amber-400 uppercase tracking-widest bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 px-3 py-1 rounded-full">
                    100% Waterproof Matrix
                  </span>
                </div>

                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-4xl sm:text-5xl font-black text-stone-900 dark:text-white tracking-tight">
                    0.00%
                  </span>
                  <span className="text-sm font-mono text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                    Core Water Absorption
                  </span>
                </div>

                <h3 className="text-xl font-bold text-stone-800 dark:text-stone-200 mb-3">
                  Immune to Flood, Mopping &amp; Subfloor Sweating
                </h3>

                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 font-light leading-relaxed max-w-xl">
                  Formulated with zero organic wood pulp or hygroscopic fiberboard. Completely immune to standing water, basement dampness seepage, and humid monsoon air that permanently swells traditional laminate joints.
                </p>
              </div>

              {/* Comparative Swell Visual Indicator */}
              <div className="mt-8 pt-5 border-t border-stone-200 dark:border-stone-800/80 grid grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-amber-50/70 dark:bg-stone-950/60 border border-amber-200/70 dark:border-stone-800">
                  <span className="text-[11px] font-mono text-amber-700 dark:text-amber-400 font-bold block mb-1">
                    SPC Rigid Core
                  </span>
                  <span className="text-xs text-stone-700 dark:text-stone-300">0% Swelling / Zero Warping</span>
                </div>
                <div className="p-3 rounded-xl bg-stone-100/70 dark:bg-stone-950/60 border border-stone-200 dark:border-stone-800">
                  <span className="text-[11px] font-mono text-stone-600 dark:text-stone-500 font-bold block mb-1">
                    Standard MDF Laminate
                  </span>
                  <span className="text-xs text-stone-600 dark:text-stone-400">8%–12% Edge Swell &amp; Delamination</span>
                </div>
              </div>
            </div>

            {/* ── CARD 2: THERMAL STABILITY (Spans 5 cols on lg) ── */}
            <div className="lg:col-span-5 p-7 sm:p-8 rounded-3xl bg-white dark:bg-gradient-to-br dark:from-stone-900 dark:via-stone-900/90 dark:to-stone-950 border border-stone-200 dark:border-stone-800 hover:border-amber-500/40 shadow-xl shadow-stone-200/50 dark:shadow-none transition-all flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono font-bold text-amber-700 dark:text-amber-400 uppercase tracking-widest bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 px-3 py-1 rounded-full">
                    Thermal Rating
                  </span>
                </div>

                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-3xl sm:text-4xl font-black text-stone-900 dark:text-white tracking-tight">
                    4°C to 48°C
                  </span>
                  <span className="text-sm font-mono text-stone-500 dark:text-stone-400">
                    Cycle Tested
                  </span>
                </div>

                <h3 className="text-lg font-bold text-stone-800 dark:text-stone-200 mb-2">
                  All-Season Thermal Stability
                </h3>

                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 font-light leading-relaxed">
                  High-ratio limestone composite resists Indian seasonal temperature extremes between cold winters and 48°C peak summer heat without plank tenting or joint gap openings.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-stone-200 dark:border-stone-800/80 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 font-mono">
                <span>Dimensional Shift:</span>
                <span className="text-amber-700 dark:text-amber-400 font-bold">&le; 0.08% Tolerance</span>
              </div>
            </div>

            {/* ── CARD 3: ACOUSTIC DAMPING (Spans 3 cols on lg) ── */}
            <div className="lg:col-span-3 p-6 rounded-2xl bg-white dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700 shadow-sm dark:shadow-none transition-all flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4">
                  <Volume2 className="w-4 h-4" />
                </div>
                <span className="text-2xl font-black text-stone-900 dark:text-white block mb-1">
                  18–20 dB
                </span>
                <h4 className="text-sm font-bold text-stone-800 dark:text-stone-200 mb-2">
                  Impact Sound Damping
                </h4>
                <p className="text-xs text-stone-600 dark:text-stone-400 font-light leading-relaxed">
                  Pre-attached 1.0mm high-density IXPE foam deadens click-clack hollow sound and absorbs floor impact.
                </p>
              </div>
            </div>

            {/* ── CARD 4: TERMITE & BORER PROOF (Spans 3 cols on lg) ── */}
            <div className="lg:col-span-3 p-6 rounded-2xl bg-white dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700 shadow-sm dark:shadow-none transition-all flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span className="text-2xl font-black text-stone-900 dark:text-white block mb-1">
                  Zero Wood
                </span>
                <h4 className="text-sm font-bold text-stone-800 dark:text-stone-200 mb-2">
                  100% Termite &amp; Borer Proof
                </h4>
                <p className="text-xs text-stone-600 dark:text-stone-400 font-light leading-relaxed">
                  Pure mineral limestone and polymer resin matrix contains no cellulose for insects to digest or infest.
                </p>
              </div>
            </div>

            {/* ── CARD 5: RAPID 1-DAY INSTALL (Spans 3 cols on lg) ── */}
            <div className="lg:col-span-3 p-6 rounded-2xl bg-white dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700 shadow-sm dark:shadow-none transition-all flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4">
                  <Clock className="w-4 h-4" />
                </div>
                <span className="text-2xl font-black text-stone-900 dark:text-white block mb-1">
                  1-Day Dry
                </span>
                <h4 className="text-sm font-bold text-stone-800 dark:text-stone-200 mb-2">
                  Click-Lock Renovation
                </h4>
                <p className="text-xs text-stone-600 dark:text-stone-400 font-light leading-relaxed">
                  150–200 sq.ft per installer per day. Clicks directly over existing tile with zero demolition mess.
                </p>
              </div>
            </div>

            {/* ── CARD 6: ZERO WAXING OR BUFFING (Spans 3 cols on lg) ── */}
            <div className="lg:col-span-3 p-6 rounded-2xl bg-white dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700 shadow-sm dark:shadow-none transition-all flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span className="text-2xl font-black text-stone-900 dark:text-white block mb-1">
                  UV Ceramic
                </span>
                <h4 className="text-sm font-bold text-stone-800 dark:text-stone-200 mb-2">
                  Zero Waxing or Buffing
                </h4>
                <p className="text-xs text-stone-600 dark:text-stone-400 font-light leading-relaxed">
                  Factory cured wear topcoat cleans with neutral damp mopping. Never requires chemical polishing.
                </p>
              </div>
            </div>
          </div>

          {/* Qualified Engineering Application Boundaries */}
          <div className="p-5 rounded-2xl bg-white dark:bg-stone-900/50 border border-stone-200 dark:border-stone-800 text-xs text-stone-700 dark:text-stone-300 shadow-sm dark:shadow-none flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="font-mono font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider text-[11px] bg-amber-50 dark:bg-amber-500/10 px-2.5 py-1 rounded border border-amber-200 dark:border-amber-500/20 shrink-0">
                Application Limit
              </span>
              <span className="text-stone-600 dark:text-stone-300 font-light leading-relaxed">
                Engineered for indoor climate-controlled spaces. Not intended for outdoor open lawns or continuous direct monsoon rainwater exposure.
              </span>
            </div>
            <span className="font-mono text-[11px] text-stone-500 shrink-0">
              Subfloor Flatness: &plusmn;2mm / 2m
            </span>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 06. INSTALLED APPLICATIONS (Residential & Commercial Spaces)              */}
      {/* ========================================================================= */}
      <section className="py-12 lg:py-16 px-4 sm:px-8 lg:px-12 border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 text-stone-900 dark:text-stone-100">
        <div className="max-w-[1440px] mx-auto w-full">
          {/* Header: Single-line Title and Subtitle with Zero Logos/Eyebrows */}
          <div className="mb-10 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-stone-900 dark:text-white tracking-tight">
              Installed Applications &amp; Space Suitability
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 font-light leading-relaxed mt-2 max-w-3xl">
              Explore how rigid-core SPC flooring performs across residential master bedrooms, boutique retail stores, and commercial workspaces.
            </p>
          </div>

          {/* 2-Column Split: Left Side Real Installed Image & Right Side Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* ── LEFT COLUMN: REALISTIC INSTALLED PHOTOGRAPHY (No Toggle Bar) ── */}
            <div className="lg:col-span-6 flex flex-col gap-4">
              {/* Realistic Image Container */}
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-900 shadow-2xl">
                <Image
                  src={
                    activeSpaceTab === 'residential'
                      ? '/images/def2qsxjg/f_auto,q_auto/v1792831480/spc_installed_home.jpg'
                      : '/images/def2qsxjg/f_auto,q_auto/v1792831459/spc_installed_shop.jpg'
                  }
                  alt={
                    activeSpaceTab === 'residential'
                      ? 'Realistic modern apartment living room with authentic natural oak SPC click-lock rigid core flooring'
                      : 'Realistic neighborhood retail boutique store interior with warm woodgrain SPC rigid-core floor planks'
                  }
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs font-mono">
                  <span>
                    {activeSpaceTab === 'residential'
                      ? 'Real In-Situ: Apartment Living Space'
                      : 'Real In-Situ: Boutique Retail Store'}
                  </span>
                  <span className="text-amber-400 font-semibold">
                    {activeSpaceTab === 'residential' ? '5.0mm Plank • 0.30mm Wear Layer' : '5.0mm Plank • 0.50mm Wear Layer'}
                  </span>
                </div>
              </div>
            </div>

            {/* ── RIGHT COLUMN: CONTENT (No logos, clean typography) ── */}
            <div className="lg:col-span-6 flex flex-col gap-4">
              {[
                {
                  id: 'residential',
                  title: 'Master Suites & Living Rooms',
                  metric: '18 dB Sound Absorption',
                  desc: 'Warm barefoot surface eliminating the cold shock of vitrified tile during North Indian winters. The pre-laminated IXPE foam cushions footfalls and dampens room sound reverberations.',
                },
                {
                  id: 'retail',
                  title: 'Retail Stores & Boutiques',
                  metric: 'Zero-Downtime Install',
                  desc: 'Fast floating installation directly over old tenant tiles in a single weekend. No cement slurry, no drying wait, and no lost trading revenue for local shop owners.',
                },
                {
                  id: 'residential',
                  title: 'Modular Kitchens & Pantries',
                  metric: '100% Moisture Proof',
                  desc: 'Immune to boiling water splashes, oil splatters, and daily damp mopping. Does not harbor mold or rot beneath kitchen kickplates like conventional MDF wood laminate.',
                },
                {
                  id: 'retail',
                  title: 'Corporate Cabins & Workspaces',
                  metric: '0.50mm Castor Shield',
                  desc: 'High-density limestone core resists indentation from heavy executive desks and rolling office castor chairs without requiring unsightly plastic floor mats.',
                },
              ].map((space) => {
                const isMatchingTab = activeSpaceTab === space.id;
                return (
                  <div
                    key={space.title}
                    onClick={() => setActiveSpaceTab(space.id as 'residential' | 'retail')}
                    className={`p-5 rounded-2xl transition-all duration-300 cursor-pointer border ${
                      isMatchingTab
                        ? 'bg-amber-50/70 dark:bg-stone-900/90 border-amber-500/60 dark:border-amber-500/50 shadow-md ring-1 ring-amber-500/20'
                        : 'bg-stone-50 hover:bg-stone-100/80 dark:bg-stone-900/40 dark:hover:bg-stone-900/70 border-stone-200 hover:border-stone-300 dark:border-stone-800/80 dark:hover:border-stone-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <h3 className="text-base font-bold text-stone-900 dark:text-white tracking-tight">
                        {space.title}
                      </h3>
                      <span className="text-xs font-mono font-bold text-amber-700 dark:text-amber-400">
                        {space.metric}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 font-light leading-relaxed">
                      {space.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 07. SPC VS OTHER FLOORING COMPARISON TABLE                                */}
      {/* ========================================================================= */}
      <section className="py-12 lg:py-16 px-4 sm:px-8 lg:px-12 border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100">
        <div className="max-w-[1440px] mx-auto w-full">
          <div className="mb-10 sm:mb-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-stone-900 dark:text-white tracking-tight whitespace-nowrap overflow-x-auto pb-1">
              SPC vs. Laminate vs. Vitrified Tiles vs. Engineered Wood
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 font-light leading-relaxed mt-2 max-w-3xl">
              An objective architectural comparison of real flooring materials across Indian residential and commercial renovation conditions.
            </p>
          </div>

          {/* Accessible, Responsive Comparison Table */}
          <div className="w-full overflow-x-auto rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/60 shadow-xl">
            <table className="w-full text-left text-xs min-w-[720px]">
              <thead className="bg-stone-100 dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 font-bold uppercase font-mono tracking-wider">
                <tr>
                  <th className="py-4 px-5">Parameter</th>
                  <th className="py-4 px-5 text-amber-700 dark:text-amber-400 bg-amber-500/10">
                    SPC Flooring (Rigid Core)
                  </th>
                  <th className="py-4 px-5">Laminate Flooring</th>
                  <th className="py-4 px-5">Vitrified Tiles</th>
                  <th className="py-4 px-5">Engineered Wood</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 dark:divide-stone-800 font-light text-stone-600 dark:text-stone-300">
                {FLOORING_COMPARISONS.map((row, idx) => (
                  <tr
                    key={row.parameter}
                    className={idx % 2 === 0 ? 'bg-transparent' : 'bg-stone-50/70 dark:bg-stone-900/30'}
                  >
                    <td className="py-3.5 px-5 font-semibold text-stone-900 dark:text-white">
                      {row.parameter}
                    </td>
                    <td className="py-3.5 px-5 font-medium text-amber-950 dark:text-stone-100 bg-amber-500/10 dark:bg-amber-500/5">
                      {row.spc}
                    </td>
                    <td className="py-3.5 px-5">{row.laminate}</td>
                    <td className="py-3.5 px-5">{row.vitrifiedTiles}</td>
                    <td className="py-3.5 px-5">{row.engineeredWood}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 10. FAQS & FINAL ENQUIRY CTA                                              */}
      {/* ========================================================================= */}
      <section className="py-10 px-4 sm:px-8 lg:px-12 border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950">
        <div className="max-w-[1440px] mx-auto w-full">
          <FAQ
            title="Frequently Asked Questions"
            titleClassName="text-2xl sm:text-4xl font-black text-stone-900 dark:text-white tracking-tight"
            description="Find technical answers to critical project questions regarding moisture behavior, thickness selection, existing tile installation, and warranty maintenance."
            items={SPC_FAQS}
            align="center"
            className="w-full max-w-4xl mx-auto mb-10"
          />

          {/* Final Call to Action Banner */}
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-stone-900 via-stone-900 to-stone-950 text-white border border-stone-800 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 block mb-2">
                Start Your Flooring Project
              </span>
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">
                Order Physical Swatch Kits or Request Bulk Quotes
              </h3>
              <p className="text-xs sm:text-sm text-stone-400 font-light leading-relaxed">
                Connect directly with WholesalerJi&apos;s commercial flooring team for sample box dispatch, technical subfloor consultation, and project quantity billing.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => openQuoteModal('BottomBanner', 'General Project Rate Card')}
                className="py-3.5 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs sm:text-sm tracking-wide transition-colors flex items-center gap-2 cursor-pointer"
              >
                <span>Get Project Rate Card</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3-OPTION QUICK INQUIRY MODAL (WhatsApp, Direct Call, Digital Quote Form)  */}
      {/* ========================================================================= */}
      <QuickInquiryModal
        isOpen={isInquiryModalOpen}
        onClose={() => setIsInquiryModalOpen(false)}
        title={inquiryTitle}
        subtitle={inquirySubtitle}
        whatsappMessage={`Hi WholesalerJi, I want to inquire about SPC Flooring (${activeProductCode}) wholesale rates and nationwide project delivery.`}
        analyticsSource="spc-flooring-inquiry"
        panelCode={activeProductCode}
        onOpenForm={() => {
          setIsInquiryModalOpen(false);
          setIsFormModalOpen(true);
        }}
      />

      {/* ========================================================================= */}
      {/* LEAD FORM MODAL (When user selects Option 3: Request Official B2B Quote)   */}
      {/* ========================================================================= */}
      {isFormModalOpen && (
        <ContactForm
          isModal={true}
          onClose={() => setIsFormModalOpen(false)}
          initialPanelCode={activeProductCode}
          source={`SPC Flooring - ${activeProductCode}`}
          title={`Wholesale Quote: ${activeProductCode}`}
          subtitle="Direct factory pricing & plank specifications with pan-India dispatch"
        />
      )}
    </div>
  );
}
