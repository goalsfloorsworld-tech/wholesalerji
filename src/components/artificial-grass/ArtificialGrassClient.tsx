'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ARTIFICIAL_GRASS_FAQS,
} from '@/data/artificialGrassData';
import ContactForm from '@/components/ContactForm';
import QuickInquiryModal from '@/components/QuickInquiryModal';
import GrassShowcase from './GrassShowcase';
import TurfBeforeAfter from './TurfBeforeAfter';
import TurfWholesaleHub from './TurfWholesaleHub';
import TurfProofFeedback from './TurfProofFeedback';
import {
  Truck,
  Droplets,
  Sun,
  ArrowRight,
  ChevronDown,
  Building,
} from 'lucide-react';

export default function ArtificialGrassClient() {
  // Modal State for 3-Option Quick Inquiry & Lead Capture Form
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [activeProductCode, setActiveProductCode] = useState<string>('General');
  const [inquiryTitle, setInquiryTitle] = useState('Get Quote');
  const [inquirySubtitle, setInquirySubtitle] = useState('Connect directly for wholesale rates and roll estimates.');

  // FAQ Accordion State
  const [openFaqId, setOpenFaqId] = useState<string | null>(ARTIFICIAL_GRASS_FAQS[0].id);

  const openQuoteModal = (productCode: string, productName?: string) => {
    setActiveProductCode(productCode);
    setInquiryTitle('Get Quote');
    setInquirySubtitle(productName ? `Connect directly for ${productName} (${productCode}) wholesale rates.` : 'Connect directly for wholesale rates and roll estimates.');
    setIsInquiryModalOpen(true);
  };

  return (
    <div className="w-full bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 overflow-x-hidden selection:bg-emerald-500 selection:text-stone-950 transition-colors duration-300">

      {/* ========================================================================= */}
      {/* 1. HERO SECTION                                                          */}
      {/* ========================================================================= */}
      <section className="relative min-h-[100svh] flex flex-col pt-20 pb-8 sm:pt-24 sm:pb-10 px-4 sm:px-8 lg:px-12 xl:px-16 border-b border-stone-200 dark:border-stone-800/80 overflow-hidden bg-stone-50 dark:bg-stone-950 transition-colors">
        <div className="absolute inset-0 sm:hidden pointer-events-none">
          <Image
            src="https://res.cloudinary.com/def2qsxjg/image/upload/v1792835887/leaf_grass_at_balcony.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-stone-950/55 via-stone-950/25 to-stone-950/95" />
        </div>

        {/* Desktop texture-led hero */}
        <div className="hidden sm:block absolute inset-0 pointer-events-none select-none overflow-hidden z-0">
          <div
            className="absolute inset-0 w-full h-full"
            style={{
              maskImage: 'linear-gradient(to right, transparent 0%, transparent 15%, rgba(0,0,0,0.18) 35%, rgba(0,0,0,0.65) 55%, rgba(0,0,0,0.95) 75%, black 100%)',
              WebkitMaskImage: 'linear-gradient(to right, transparent 0%, transparent 15%, rgba(0,0,0,0.18) 35%, rgba(0,0,0,0.65) 55%, rgba(0,0,0,0.95) 75%, black 100%)'
            }}
          >
            <Image
              src="/images/dcezlxt8r/f_auto,q_auto/v1787310353/wave_patter_upper_shot.jpg"
              alt="Architectural Wave Pattern Artificial Grass close-up texture"
              fill
              priority
              sizes="100vw"
              className="object-cover object-right sm:opacity-95 opacity-50 sm:brightness-[1.06] brightness-90 contrast-[1.03]"
            />
          </div>

          {/* Desktop Left-to-Right Fade */}
          <div className="hidden sm:block absolute inset-0 bg-gradient-to-r from-stone-50 from-20% via-stone-50/70 via-45% to-transparent to-75% dark:from-stone-950 dark:from-20% dark:via-stone-950/70 dark:via-45% dark:to-transparent dark:to-75%" />

          {/* Top and Bottom soft blend */}
          <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-stone-50 to-transparent dark:from-stone-950 dark:to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-stone-50 to-transparent dark:from-stone-950 dark:to-transparent pointer-events-none" />
        </div>

        <div className="max-w-[1440px] mx-auto w-full relative z-10 flex-1 flex flex-col">

          {/* Breadcrumb Trail & Quick Depot Badge */}
          <div className="flex items-center justify-between gap-2 mb-4 sm:mb-6">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-white/75 sm:text-stone-500 dark:sm:text-stone-400 font-mono">
              <Link href="/" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Home</Link>
              <span>/</span>
              <span className="text-emerald-300 sm:text-emerald-600 dark:sm:text-emerald-400 font-semibold">Artificial Grass</span>
            </nav>

            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 sm:bg-emerald-500/10 border border-white/25 sm:border-emerald-500/25 text-[10px] font-mono font-bold text-white sm:text-emerald-600 dark:sm:text-emerald-400 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Gurugram · Sec-34
            </span>
          </div>

          <div className="flex flex-1 items-center py-8 sm:py-0">
            <div className="w-full max-w-3xl space-y-4 sm:space-y-6 lg:max-w-4xl xl:max-w-5xl">

              {/* Visual H1: User sees bold 'Artificial Grass', Google gets full SEO phrase */}
              <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.24em] text-emerald-300 sm:text-emerald-700 dark:sm:text-emerald-400">
                Direct mill supply · Built for Indian weather
              </p>
              <h1 className="text-[3.25rem] sm:text-6xl lg:text-7xl xl:text-8xl font-black tracking-[-0.06em] leading-[0.9] sm:leading-[1.05] text-white sm:text-stone-900 dark:sm:text-white">
                <span className="block sm:inline">Artificial</span>{' '}
                <span className="block sm:inline text-emerald-300 sm:text-emerald-600 dark:sm:text-emerald-400">Grass.</span>
                <span className="sr-only"> Supplier & Manufacturer in Gurgaon & Delhi NCR - Direct Wholesale Turf Rates</span>
              </h1>

              {/* Responsive Paragraph: Concise on mobile, comprehensive on desktop */}
              <p className="text-sm sm:text-base text-white/80 sm:text-stone-600 dark:sm:text-stone-300 font-light leading-relaxed max-w-2xl">
                <span className="sm:hidden">
                  Make your balcony or rooftop feel like somewhere you want to stay. Premium turf, delivered direct from our Gurugram mill.
                </span>
                <span className="hidden sm:inline">
                  Direct factory wholesale landscape turf and designer pattern grass for balconies, terraces, and commercial spaces across Gurgaon &amp; Delhi NCR. Full master rolls and cut-lengths engineered with rapid drainage and 45°C+ summer UV heat tolerance.
                </span>
              </p>

              {/* Single Primary CTA */}
              <div className="pt-1 sm:pt-2">
                <button
                  type="button"
                  onClick={() => openQuoteModal('Hero', 'Artificial Grass Master Catalog')}
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-emerald-300 sm:bg-gradient-to-r sm:from-emerald-500 sm:to-emerald-600 hover:bg-emerald-200 sm:hover:from-emerald-400 sm:hover:to-emerald-500 text-stone-950 font-bold text-sm tracking-wide shadow-xl shadow-emerald-500/25 transition-all inline-flex items-center justify-center gap-2 cursor-pointer group"
                >
                  <span className="sm:hidden">Get your project quote</span>
                  <span className="hidden sm:inline">Get Wholesale Roll Rates</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2 sm:hidden">
              <div className="flex -space-x-2">
                <span className="w-7 h-7 rounded-full border-2 border-stone-950 bg-emerald-700" />
                <span className="w-7 h-7 rounded-full border-2 border-stone-950 bg-emerald-500" />
                <span className="w-7 h-7 rounded-full border-2 border-stone-950 bg-lime-300" />
              </div>
              <p className="text-[11px] text-white/80">
                <span className="font-bold text-white">From ₹45/sq.ft</span>
                <span className="mx-1.5 text-white/40">·</span>
                UV &amp; monsoon ready
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. TRUST & WHOLESALE SPEC STRIP                                          */}
      {/* ========================================================================= */}
      <section className="py-10 bg-white dark:bg-stone-900/90 border-b border-stone-200 dark:border-stone-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5">
                <Building className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-stone-900 dark:text-white uppercase tracking-wider">Direct Mill Pricing</p>
                <p className="text-xs text-stone-600 dark:text-stone-400 mt-1">₹45–₹110/sq.ft • Direct factory rates</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0 mt-0.5">
                <Sun className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-stone-900 dark:text-white uppercase tracking-wider">UV50+ Heat Tested</p>
                <p className="text-xs text-stone-600 dark:text-stone-400 mt-1">Tested for 45°C+ summer heat</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0 mt-0.5">
                <Droplets className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-stone-900 dark:text-white uppercase tracking-wider">Monsoon Proof Backing</p>
                <p className="text-xs text-stone-600 dark:text-stone-400 mt-1">60L/min/m² rapid water drainage</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5">
                <Truck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-stone-900 dark:text-white uppercase tracking-wider">Same-Day NCR Loading</p>
                <p className="text-xs text-stone-600 dark:text-stone-400 mt-1">Ready stock at Sec-34 Gurugram</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. UNIFIED ARTIFICIAL GRASS SHOWCASE (IN-SITU SCENE + CLOSE-UP TEXTURE)   */}
      {/* ========================================================================= */}
      <GrassShowcase onOpenQuote={openQuoteModal} />

      {/* ========================================================================= */}
      {/* 4. INTERACTIVE BEFORE & AFTER BALCONY TRANSFORMATION                      */}
      {/* ========================================================================= */}
      <TurfBeforeAfter onOpenQuote={openQuoteModal} />

      {/* ========================================================================= */}
      {/* 5. B2B WHOLESALE TRADE HUB (RATE MATRIX + SEC-34 GURUGRAM DEPOT)           */}
      {/* ========================================================================= */}
      <TurfWholesaleHub onOpenQuote={openQuoteModal} />

      {/* ========================================================================= */}
      {/* 6. VERIFIED SITE INSTALLATIONS & CLIENT FEEDBACK GALLERY                  */}
      {/* ========================================================================= */}
      <TurfProofFeedback />

      {/* ========================================================================= */}
      {/* 9. FAQ ACCORDION (100% IN SERVER DOM, CSS-EXPAND ONLY)                   */}
      {/* ========================================================================= */}
      <section className="py-10 px-4 sm:px-8 lg:px-12 border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 transition-colors">
        <div className="max-w-4xl mx-auto">

          <div className="mb-8 text-center">
            <h2 className="text-2xl sm:text-4xl font-black text-stone-900 dark:text-white tracking-tight">
              Frequently Asked Questions About Artificial Grass
            </h2>
            <p className="text-sm text-stone-600 dark:text-stone-400 mt-3 leading-relaxed">
              Transparent answers regarding wholesale rates in Gurgaon, Delhi NCR climate performance, roll sizing, and maintenance.
            </p>
          </div>

          <div className="divide-y divide-stone-200 dark:divide-stone-800 border-t border-b border-stone-200 dark:border-stone-800">
            {ARTIFICIAL_GRASS_FAQS.map((faq) => {
              const isOpen = openFaqId === faq.id;
              const qId = `faq-q-${faq.id}`;
              const aId = `faq-a-${faq.id}`;

              return (
                <div key={faq.id} className="py-5">
                  <button
                    type="button"
                    id={qId}
                    aria-expanded={isOpen}
                    aria-controls={aId}
                    onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                    className="w-full flex items-center justify-between text-left gap-4 focus:outline-none group cursor-pointer"
                  >
                    <div className="flex-1">
                      <h3 className={`text-base sm:text-lg font-bold transition-colors ${isOpen ? 'text-emerald-600 dark:text-emerald-400' : 'text-stone-800 dark:text-stone-200 group-hover:text-emerald-600 dark:group-hover:text-white'
                        }`}>
                        {faq.question}
                      </h3>
                    </div>
                    <span className={`w-8 h-8 rounded-full border border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-900 flex items-center justify-center shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 border-emerald-500/50 text-emerald-600 dark:text-emerald-400' : 'text-stone-500 dark:text-stone-400'
                      }`}>
                      <ChevronDown className="w-4 h-4" />
                    </span>
                  </button>

                  {/* CSS-expanding container: ALWAYS present in DOM */}
                  <div
                    id={aId}
                    role="region"
                    aria-labelledby={qId}
                    className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100 pt-4' : 'grid-rows-[0fr] opacity-0 pt-0'
                      }`}
                  >
                    <div className="overflow-hidden">
                      <p className="text-sm text-stone-600 dark:text-stone-300 font-light leading-relaxed pb-2">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 10. FINAL CONVERSION CTA STRIP                                            */}
      {/* ========================================================================= */}
      <section className="py-10 px-4 sm:px-8 lg:px-12 bg-gradient-to-r from-stone-100 via-stone-50 to-stone-100 dark:from-stone-900 dark:via-stone-950 dark:to-stone-900 border-b border-stone-200 dark:border-stone-800 transition-colors">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <h2 className="text-3xl sm:text-5xl font-black text-stone-900 dark:text-white tracking-tight">
            Transform Your Terrace or Balcony at Pure Wholesale Rates
          </h2>

          <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 font-light max-w-2xl mx-auto leading-relaxed">
            Connect directly with our Gurugram warehouse team for roll estimations, trade pricing, and delivery timelines across Delhi NCR and India.
          </p>

          <div className="flex items-center justify-center pt-3">
            <button
              type="button"
              onClick={() => openQuoteModal('FinalCTA', 'Artificial Grass Master Inquiry')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-stone-950 font-bold text-sm tracking-wide shadow-xl shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Get Wholesale Quote</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3-OPTION QUICK INQUIRY MODAL (WhatsApp, Call, Digital Form)               */}
      {/* ========================================================================= */}
      <QuickInquiryModal
        isOpen={isInquiryModalOpen}
        onClose={() => setIsInquiryModalOpen(false)}
        title={inquiryTitle}
        subtitle={inquirySubtitle}
        whatsappMessage={`Hi WholesalerJi, I want to inquire about Artificial Grass (${activeProductCode}) wholesale rates and delivery in Gurgaon/Delhi NCR.`}
        analyticsSource="artificial-grass-inquiry"
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
          source={`Artificial Grass - ${activeProductCode}`}
          title={`Wholesale Quote: ${activeProductCode}`}
          subtitle="Direct factory pricing & roll specifications from our Gurugram depot"
        />
      )}

    </div>
  );
}
