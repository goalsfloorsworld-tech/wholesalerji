'use client';

import React, { useRef, useState, useEffect, useLayoutEffect, useCallback } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PanelProduct } from '@/data/types';
import {
  PRIMO_WALL_PANELS,
  PRIMO_HERO_TEXTURES as HERO_TEXTURES,
  PRIMO_ROOM_SCENES as ROOM_SCENES,
  PRIMO_ACRONYM_DATA as ACRONYM_DATA,
  PRIMO_FAQS,
} from '@/data/primoPanelsData';
import { WallPanelProduct } from '@/sanity/schemas/product';
import LeadForm from '@/components/client/LeadForm';
import ProductShowcase from '@/components/ProductShowcase';
import FAQ from '@/components/FAQ';

// Safe layout effect for Next.js SSR
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

interface PrimoSeriesTemplateProps {
  initialData?: WallPanelProduct | PanelProduct | null;
  allShades?: PanelProduct[];
}

export default function PrimoSeriesTemplate({
  initialData,
  allShades = PRIMO_WALL_PANELS,
}: PrimoSeriesTemplateProps) {
  const shades = allShades && allShades.length > 0 ? allShades : PRIMO_WALL_PANELS;

  // Resolve initial shade
  const initialIndex = Math.max(
    0,
    shades.findIndex(
      (s) =>
        ('code' in (initialData || {}) && s.code.toLowerCase() === ((initialData as PanelProduct)?.code || '').toLowerCase()) ||
        ('sku' in (initialData || {}) && s.code.toLowerCase() === ((initialData as WallPanelProduct)?.sku || '').toLowerCase()) ||
        ('id' in (initialData || {}) && s.id.toLowerCase() === ((initialData as PanelProduct)?.id || '').toLowerCase())
    )
  );

  const [selectedPanel, setSelectedPanel] = useState<PanelProduct>(shades[initialIndex >= 0 ? initialIndex : 0]);

  // REFS FOR GSAP
  const rootRef = useRef<HTMLDivElement>(null);
  const heroSectionRef = useRef<HTMLElement>(null);
  const heroMaskContainerRef = useRef<HTMLDivElement>(null);

  // Acronym refs
  const acronymSectionRef = useRef<HTMLElement>(null);
  const topWordContainerRef = useRef<HTMLDivElement>(null);
  const stageCardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const topLetterRefs = useRef<(HTMLSpanElement | null)[]>([]);

  // ─────────────────────────────────────────────────────────────
  // GSAP SCROLLTRIGGER ANIMATIONS
  // ─────────────────────────────────────────────────────────────
  useIsomorphicLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // ─────────────────────────────────────────────────────────
      // 1. HERO PINNED SECTION: ZERO INITIAL SHIFT + BOTTOM-TO-TOP WIPE
      // ─────────────────────────────────────────────────────────
      if (heroSectionRef.current && heroMaskContainerRef.current) {
        const layers = heroMaskContainerRef.current.querySelectorAll<HTMLElement>('.hero-texture-layer');

        // Initial setup: all layers start clipped below except first which fades in on scroll
        layers.forEach((layer, i) => {
          if (i === 0) {
            gsap.set(layer, { clipPath: 'inset(0% 0 0 0)', opacity: 0 });
          } else {
            gsap.set(layer, { clipPath: 'inset(100% 0 0 0)', opacity: 1 });
          }
        });

        // Pin starting right at the bottom of the 64px navbar, so there is ZERO initial jump!
        const heroTl = gsap.timeline({
          scrollTrigger: {
            trigger: heroSectionRef.current,
            start: 'top 64px',
            end: '+=2400',
            pin: true,
            pinSpacing: true,
            scrub: 0.8,
          },
        });

        // First scroll reveals texture 0 inside the faded PRIMO text
        if (layers[0]) {
          heroTl.to(layers[0], { opacity: 1, duration: 0.6, ease: 'none' });
        }

        // Subsequent scrolls wipe next texture from bottom to top
        for (let i = 1; i < layers.length; i++) {
          heroTl.to(layers[i], {
            clipPath: 'inset(0% 0 0 0)',
            duration: 1,
            ease: 'none',
          });
        }
      }

      // ─────────────────────────────────────────────────────────
      // 2. ACRONYM SECTION: PERFECT VERTICAL MIDLINE & NO NAVBAR OVERLAP
      // ─────────────────────────────────────────────────────────
      if (acronymSectionRef.current && topWordContainerRef.current) {
        stageCardRefs.current.forEach((card) => {
          if (card) {
            gsap.set(card, { y: 160, opacity: 0, pointerEvents: 'none' });
          }
        });

        topLetterRefs.current.forEach((el) => {
          if (el) {
            gsap.set(el, { opacity: 0.15, scale: 0.85 });
          }
        });

        // Starts pinning below navbar with no overlap
        const acronymTl = gsap.timeline({
          scrollTrigger: {
            trigger: acronymSectionRef.current,
            start: 'top 64px',
            end: '+=3800',
            pin: true,
            pinSpacing: true,
            scrub: 1,
          },
        });

        // Sequence through P, R, I, M, O
        ACRONYM_DATA.forEach((item, index) => {
          const stageCard = stageCardRefs.current[index];
          const topLetter = topLetterRefs.current[index];

          if (!stageCard || !topLetter) return;

          acronymTl
            // Step entrance: Letter on left & text on right slide up to center stage
            .to(stageCard, {
              y: 0,
              opacity: 1,
              pointerEvents: 'auto',
              duration: 1.2,
              ease: 'power2.out',
            })
            // Hold centered
            .to({}, { duration: 0.6 })
            // Step exit: Stage card fades up and away
            .to(stageCard, {
              y: -80,
              opacity: 0,
              pointerEvents: 'none',
              duration: 0.8,
              ease: 'power2.in',
            })
            // Simultaneously illuminate top letter
            .to(
              topLetter,
              {
                opacity: 1,
                scale: 1,
                duration: 0.6,
                ease: 'back.out(1.5)',
              },
              '<0.2'
            );
        });

        // Step 6: Assembled top word scales up 3x and dissolves cleanly
        acronymTl.to(topWordContainerRef.current, {
          scale: 3,
          opacity: 0,
          duration: 1.5,
          ease: 'power2.inOut',
        });
      }
    }, rootRef);

    return () => ctx.revert();
  }, []);



  return (
    <div
      ref={rootRef}
      className="w-full bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 transition-colors selection:bg-amber-500 selection:text-stone-950 overflow-x-hidden"
    >
      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION 1: THE 'PRIMO' MASK HERO (NO JUMP, SCROLL-DRIVEN)     */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section
        ref={heroSectionRef}
        className="relative h-[calc(100vh-64px)] w-full flex items-center justify-center select-none overflow-hidden"
      >
        {/* Centered Massive 'PRIMO' Word */}
        <div
          ref={heroMaskContainerRef}
          className="relative w-full px-4 sm:px-8 lg:px-12 flex flex-col items-center justify-center my-auto"
        >
          {/* Mobile Top Minimal Badge (Fills vertical void with subtle elegance) */}
          <div className="md:hidden mb-3 text-center">
            <span className="text-[10px] font-mono tracking-widest text-stone-400 dark:text-stone-500 uppercase font-semibold">
              [ PRIMO COLLECTION • 2026 ]
            </span>
          </div>

          {/* Base Faded Ghost Text (Clean razor-sharp letters, zero dark drop shadows) */}
          <div className="select-none transition-colors">
            {/* Mobile Stacked Typography (Fills mobile viewport height) */}
            <div className="flex md:hidden flex-col items-center justify-center font-black tracking-tighter text-[28vw] leading-[0.85] uppercase text-stone-300 dark:text-stone-800 text-center">
              <span>PRI</span>
              <span>MO</span>
            </div>
            {/* Desktop Single-Line Horizontal Display */}
            <h1 className="hidden md:block font-black tracking-tighter text-[22vw] leading-none uppercase text-stone-300 dark:text-stone-800 text-center">
              PRIMO
            </h1>
          </div>

          {/* Mobile Bottom Minimal Badge */}
          <div className="md:hidden mt-3 text-center">
            <span className="text-[9px] font-mono tracking-widest text-amber-600 dark:text-amber-400 uppercase font-semibold">
              [ SCROLL TO REVEAL SHADES ↓ ]
            </span>
          </div>

          {/* High-Resolution Installed Architectural Room Textures (Wiping bottom-to-top on scroll, ZERO dark shadow) */}
          {HERO_TEXTURES.map((texUrl, idx) => (
            <div
              key={idx}
              className="hero-texture-layer absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none"
              style={{
                backgroundImage: `url(${texUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                color: 'transparent',
              }}
            >
              {/* Mobile Stacked Text */}
              <div className="flex md:hidden flex-col items-center justify-center font-black tracking-tighter text-[28vw] leading-[0.85] uppercase text-center">
                <span>PRI</span>
                <span>MO</span>
              </div>
              {/* Desktop Single-Line Text */}
              <div className="hidden md:block font-black tracking-tighter text-[22vw] leading-none uppercase text-center">
                PRIMO
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION 2: SMART UNIVERSAL PRODUCT SHOWCASE COMPONENT         */}
      {/* ───────────────────────────────────────────────────────────── */}
      <ProductShowcase
        series="primo"
        allShades={shades}
        initialShadeId={('code' in (initialData || {}) && (initialData as any).code) || ('sku' in (initialData || {}) && (initialData as any).sku) || (initialData as any)?.id}
        onShadeChange={(shade) => setSelectedPanel(shade)}
        sectionId="universal-showcase"
      />

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION 3: THE ACRONYM SCROLL JOURNEY (P - R - I - M - O)     */}
      {/* Starts below 64px navbar, perfect midline horizontal axis     */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section
        ref={acronymSectionRef}
        className="relative h-[calc(100vh-64px)] w-full flex flex-col justify-between select-none overflow-hidden border-t border-stone-200 dark:border-stone-800/80"
      >
        {/* Top Centered Spelled Word Slot Header: 'P R I M O' (Padded down from navbar) */}
        <div className="w-full pt-8 sm:pt-10 flex justify-center z-30">
          <div
            ref={topWordContainerRef}
            className="flex items-center justify-center gap-4 sm:gap-8 md:gap-12 transition-transform"
          >
            {ACRONYM_DATA.map((item, idx) => (
              <span
                key={`top-${idx}`}
                ref={(el) => {
                  topLetterRefs.current[idx] = el;
                }}
                className="font-black text-3xl sm:text-5xl md:text-7xl uppercase tracking-tight text-stone-900 dark:text-white"
                style={{
                  backgroundImage: `url(${item.texture})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  color: 'transparent',
                }}
              >
                {item.letter}
              </span>
            ))}
          </div>
        </div>

        {/* Center Stage: Vertically Centered Left Letter with Text on Same Exact Midline Axis */}
        <div className="relative w-full px-4 sm:px-8 lg:px-12 flex-1 flex items-center justify-center">
          {ACRONYM_DATA.map((item, index) => (
            <div
              key={`stage-${index}`}
              ref={(el) => {
                stageCardRefs.current[index] = el;
              }}
              className="absolute inset-0 w-full px-4 sm:px-8 lg:px-12 flex items-center"
            >
              <div className="grid grid-cols-1 md:grid-cols-12 w-full items-center gap-8 md:gap-16">
                
                {/* Left Side: Large Centered Letter */}
                <div className="md:col-span-5 flex items-center justify-center md:justify-start">
                  <span
                    className="font-black text-[120px] sm:text-[160px] md:text-[220px] leading-none uppercase select-none drop-shadow-2xl"
                    style={{
                      backgroundImage: `url(${item.texture})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      WebkitBackgroundClip: 'text',
                      backgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      color: 'transparent',
                      filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.5))',
                    }}
                  >
                    {item.letter}
                  </span>
                </div>

                {/* Right Side: Data Exactly on the Same Midline Horizontal Axis */}
                <div className="md:col-span-7 flex flex-col justify-center text-left space-y-3">
                  <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">
                    [{item.letter}] Architectural Principle
                  </span>
                  <h3 className="text-2xl sm:text-4xl lg:text-5xl font-black text-stone-900 dark:text-white tracking-tight leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-sm sm:text-base font-medium text-amber-600 dark:text-amber-300">
                    {item.tagline}
                  </p>
                  <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 max-w-xl leading-relaxed font-light pt-1">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom spacer */}
        <div className="h-6 w-full pointer-events-none" />
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION 4: B2B DATA SHEET, FAQ & RFQ DESK                     */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section className="w-full px-4 sm:px-8 lg:px-12 py-20 border-t border-stone-200 dark:border-stone-800">
        
        {/* Technical Data Sheet */}
        <div className="mb-20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-4 border-b border-stone-200 dark:border-stone-800">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">
                Official Specifications
              </span>
              <h3 className="text-2xl sm:text-4xl font-black text-stone-900 dark:text-white mt-1">
                Technical Data Sheet
              </h3>
            </div>
            <a
              href="https://wa.me/919999999999?text=Please%20send%20PDF%20Technical%20Data%20Sheet%20for%20Primo%20Panels"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 hover:underline"
            >
              Request PDF Spec Sheet ↓
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-4 text-sm">
            <div className="flex justify-between py-3 border-b border-stone-200 dark:border-stone-800/80">
              <span className="text-stone-500 dark:text-stone-400">Core Material</span>
              <span className="font-semibold text-stone-900 dark:text-white">100% Virgin Polymer Matrix</span>
            </div>
            <div className="flex justify-between py-3 border-b border-stone-200 dark:border-stone-800/80">
              <span className="text-stone-500 dark:text-stone-400">Standard Length</span>
              <span className="font-semibold text-stone-900 dark:text-white">2950 mm (9.6 Feet)</span>
            </div>
            <div className="flex justify-between py-3 border-b border-stone-200 dark:border-stone-800/80">
              <span className="text-stone-500 dark:text-stone-400">Effective Width</span>
              <span className="font-semibold text-stone-900 dark:text-white">300 mm (12 Inches Seamless)</span>
            </div>
            <div className="flex justify-between py-3 border-b border-stone-200 dark:border-stone-800/80">
              <span className="text-stone-500 dark:text-stone-400">Profile Thickness</span>
              <span className="font-semibold text-stone-900 dark:text-white">5 mm Flat / 9 mm Fluted</span>
            </div>
            <div className="flex justify-between py-3 border-b border-stone-200 dark:border-stone-800/80">
              <span className="text-stone-500 dark:text-stone-400">Water Impermeability</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">100% Waterproof (&lt;0.2% absorption)</span>
            </div>
            <div className="flex justify-between py-3 border-b border-stone-200 dark:border-stone-800/80">
              <span className="text-stone-500 dark:text-stone-400">Anti-Termite Guarantee</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">100% Termite & Borer Proof Lifetime</span>
            </div>
            <div className="flex justify-between py-3 border-b border-stone-200 dark:border-stone-800/80">
              <span className="text-stone-500 dark:text-stone-400">Fire Rating</span>
              <span className="font-semibold text-stone-900 dark:text-white">Class B1 Flame Retardant</span>
            </div>
            <div className="flex justify-between py-3 border-b border-stone-200 dark:border-stone-800/80">
              <span className="text-stone-500 dark:text-stone-400">Factory Dispatch</span>
              <span className="font-semibold text-stone-900 dark:text-white">24 - 48 Hours Across NCR & Pan-India</span>
            </div>
          </div>
        </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION 5: FREQUENTLY ASKED QUESTIONS                         */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="mb-20 border-t border-stone-200 dark:border-stone-800/80">
        <FAQ items={PRIMO_FAQS} />
      </div>

        {/* RFQ Lead Form Anchor */}
        <div id="rfq-section" className="mb-12">
          <LeadForm
            initialProductName={selectedPanel.name}
            initialProductSku={selectedPanel.code}
            initialMaterial="Primo Wall Panels"
          />
        </div>

        {/* Global Footer Watermark */}
        <div className="pt-12 border-t border-stone-200 dark:border-stone-800 text-center text-xs text-stone-500">
          <p>© 2026 Wholesaleji Technologies Pvt. Ltd. • Pan-India Architectural Cladding Marketplace</p>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* MOBILE STICKY BOTTOM BAR                                      */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="fixed bottom-0 inset-x-0 z-50 md:hidden bg-white/95 dark:bg-stone-950/95 backdrop-blur-xl border-t border-stone-200 dark:border-stone-800 p-3 px-6 flex items-center justify-between gap-4 shadow-xl">
        <div>
          <span className="text-[9px] text-stone-500 uppercase block font-medium">Wholesale Rate</span>
          <p className="text-sm font-black text-amber-600 dark:text-amber-400">
            ₹{selectedPanel.pricePerPiece} <span className="text-[10px] font-normal text-stone-500">/pc</span>
          </p>
        </div>

        <div className="flex items-center gap-2 flex-1 justify-end">
          <a
            href={`https://wa.me/919999999999?text=Inquiring%20about%20Wholesale%20Rate%20for%20Primo%20${encodeURIComponent(selectedPanel.name)}%20(SKU:%20${selectedPanel.code})`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-lg bg-emerald-600 text-white text-[11px] font-bold uppercase transition-colors"
          >
            WhatsApp
          </a>
          <a
            href="#rfq-section"
            className="px-4 py-2 rounded-lg bg-amber-500 text-stone-950 text-[11px] font-bold uppercase tracking-wider font-bold"
          >
            Instant RFQ
          </a>
        </div>
      </div>
    </div>
  );
}
