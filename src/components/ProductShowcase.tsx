'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { PanelProduct } from '@/data/types';
import { PRIMO_WALL_PANELS, PRIMO_ROOM_SCENES } from '@/data/primoPanelsData';
import { ELITE_WALL_PANELS, ELITE_ROOM_SCENES } from '@/data/elitePanelsData';
import { PRIMO_FLUTED_WALL_PANELS, PRIMO_FLUTED_ROOM_SCENES } from '@/data/primoFlutedPanelsData';
import GetQuoteModal from './GetQuoteModal';

export type ProductSeriesKey = 'primo' | 'elite' | 'primo-fluted' | 'elite-fluted';

export interface ProductShowcaseProps {
  series?: ProductSeriesKey;
  allShades?: PanelProduct[];
  roomScenes?: string[];
  initialShadeId?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  sectionId?: string;
  whatsappNumber?: string;
  onShadeChange?: (shade: PanelProduct, index: number) => void;
}

const SERIES_DEFAULTS: Record<
  ProductSeriesKey,
  {
    shades: PanelProduct[];
    roomScenes: string[];
    title: string;
    subtitle: string;
    description: string;
    mrp: number;
    seriesLabel: string;
  }
> = {
  primo: {
    shades: PRIMO_WALL_PANELS,
    roomScenes: PRIMO_ROOM_SCENES,
    title: 'Universal Shade Showcase',
    subtitle: 'Live Architectural Environments',
    description:
      'Direct mill polymer cladding. Browse live room environments and close-up 300mm interlock profiles.',
    mrp: 990,
    seriesLabel: 'Primo Wall Panels',
  },
  elite: {
    shades: ELITE_WALL_PANELS,
    roomScenes: ELITE_ROOM_SCENES,
    title: 'Elite Shade Showcase',
    subtitle: '12 UV High-Gloss Architectural Finishes',
    description:
      '12 Italian Marble & Metallic panels. Experience in-situ ambient lighting and inspect the 300mm seamless interlock slab.',
    mrp: 1290,
    seriesLabel: 'Elite UV High-Gloss Panels',
  },
  'primo-fluted': {
    shades: PRIMO_FLUTED_WALL_PANELS,
    roomScenes: PRIMO_FLUTED_ROOM_SCENES,
    title: 'Primo Fluted Shade Showcase',
    subtitle: '13 Architectural Timber Finishes',
    description:
      '13 authentic timber louver finishes in 9MM WPC profile. Experience in-situ ambient lighting and inspect the 300mm seamless interlock slab.',
    mrp: 1390,
    seriesLabel: 'Primo Fluted Louver Panels',
  },
  'elite-fluted': {
    shades: PRIMO_FLUTED_WALL_PANELS, // Fallback, data passed explicitly anyway
    roomScenes: PRIMO_FLUTED_ROOM_SCENES,
    title: 'Elite Fluted Showcase',
    subtitle: 'Premium Architectural Finishes',
    description: 'Experience the architectural depth of our 9MM fluted profile.',
    mrp: 1290,
    seriesLabel: 'Elite Fluted Panels',
  },
};

export default function ProductShowcase({
  series: explicitSeries,
  allShades,
  roomScenes: customRoomScenes,
  initialShadeId,
  title: customTitle,
  subtitle: customSubtitle,
  description: customDescription,
  sectionId = 'showcase',
  whatsappNumber = '919999999999',
  onShadeChange,
}: ProductShowcaseProps) {
  const pathname = usePathname();

  const series: ProductSeriesKey = useMemo(() => {
    if (explicitSeries) return explicitSeries;
    if (pathname) {
      const lower = pathname.toLowerCase();
      if (lower.includes('elite-fluted')) return 'elite-fluted';
      if (lower.includes('primo-fluted') || lower.includes('fluted')) return 'primo-fluted';
      if (lower.includes('elite')) return 'elite';
      if (lower.includes('primo')) return 'primo';
    }
    return 'primo';
  }, [explicitSeries, pathname]);

  const config = SERIES_DEFAULTS[series] || SERIES_DEFAULTS.primo;
  const shades = allShades && allShades.length > 0 ? allShades : config.shades;
  const roomScenes = customRoomScenes && customRoomScenes.length > 0 ? customRoomScenes : config.roomScenes;
  const title = customTitle || config.title;
  const subtitle = customSubtitle || config.subtitle;
  const description = customDescription || config.description;

  const resolvedInitialIndex = Math.max(
    0,
    shades.findIndex(
      (s) =>
        s.code.toLowerCase() === (initialShadeId || '').toLowerCase() ||
        s.id.toLowerCase() === (initialShadeId || '').toLowerCase()
    )
  );

  const [activeShadeIndex, setActiveShadeIndex] = useState(resolvedInitialIndex >= 0 ? resolvedInitialIndex : 0);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  const swatchScrollRef = useRef<HTMLDivElement>(null);
  const autoTimerRef = useRef<NodeJS.Timeout | null>(null);

  const scrollSwatchToCenter = useCallback((index: number) => {
    const container = swatchScrollRef.current;
    if (container) {
      // children[0] = leading spacer, so active swatch is at children[index + 1]
      const child = container.children[index + 1] as HTMLElement;
      if (child) {
        // Manually calculate horizontal scroll to avoid vertically jumping the page (which scrollIntoView does)
        const containerCenter = container.clientWidth / 2;
        const childCenter = child.offsetLeft + child.clientWidth / 2;
        container.scrollTo({
          left: childCenter - containerCenter,
          behavior: 'smooth'
        });
      }
    }
  }, []);

  const resetTimer = useCallback(() => {
    if (autoTimerRef.current) clearInterval(autoTimerRef.current);
    autoTimerRef.current = setInterval(() => {
      setActiveShadeIndex((prev) => (prev + 1) % shades.length);
    }, 4500);
  }, [shades.length]);

  useEffect(() => {
    resetTimer();
    return () => {
      if (autoTimerRef.current) clearInterval(autoTimerRef.current);
    };
  }, [resetTimer]);

  const handleSelectShade = (idx: number) => {
    setActiveShadeIndex(idx);
    resetTimer();
    scrollSwatchToCenter(idx);
    if (onShadeChange && shades[idx]) {
      onShadeChange(shades[idx], idx);
    }
  };

  useEffect(() => {
    scrollSwatchToCenter(activeShadeIndex);
  }, [activeShadeIndex, scrollSwatchToCenter]);

  if (!shades || shades.length === 0) return null;

  const activePanel = shades[activeShadeIndex] || shades[0];
  const activeRoomScene =
    roomScenes && roomScenes.length > 0
      ? roomScenes[activeShadeIndex % roomScenes.length]
      : activePanel.imageUrl;

  const effectiveMrp = activePanel.mrpPerPiece || config.mrp;
  const discountPct = Math.round(((effectiveMrp - activePanel.pricePerPiece) / effectiveMrp) * 100);

  return (
    <>
      <section
        id={sectionId}
        className="w-full px-4 sm:px-8 lg:px-12 py-14 sm:py-20 border-b border-stone-200 dark:border-stone-800/80 scroll-mt-16"
      >
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12 max-w-7xl mx-auto">
          <div>
            <div className="text-[10px] sm:text-xs uppercase tracking-widest font-bold text-amber-600 dark:text-amber-400 mb-1.5">
              {subtitle}
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-stone-900 dark:text-white">
              {title}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 max-w-md font-light leading-relaxed">
            {description}
          </p>
        </div>

        {/* 2-Column Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 w-full max-w-7xl mx-auto items-start">

          {/* ── LEFT COLUMN: Room Visual + Close-up Slab + Fisheye Dock ── */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="relative w-full h-[52vh] sm:h-[60vh] min-h-[420px] rounded-3xl overflow-visible group">

              {/* Main Room Environment */}
              <div className="relative w-full h-full rounded-3xl overflow-hidden bg-stone-200 dark:bg-stone-900 shadow-2xl">
                <Image
                  src={activeRoomScene}
                  alt={`Installed room environment for ${activePanel.name}`}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 text-white text-[11px] font-semibold tracking-wider uppercase drop-shadow z-10 opacity-80">
                  In-Situ Architectural Scale · {activePanel.name}
                </div>
              </div>

              {/* Close-Up Texture Slab — floats right */}
              <div className="absolute z-20 top-4 bottom-4 w-32 sm:w-40 rounded-2xl overflow-hidden border border-white/60 dark:border-amber-400/50 shadow-xl bg-white/90 dark:bg-stone-950/90 backdrop-blur-md p-1.5 flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300" style={{ right: '-18px' }}>
                <div className="relative w-full flex-1 rounded-xl overflow-hidden bg-stone-200 dark:bg-stone-950 min-h-0">
                  <Image
                    src={activePanel.imageUrl}
                    alt={`Close-up texture of ${activePanel.name}`}
                    fill
                    sizes="(max-width: 768px) 130px, 165px"
                    className="object-cover"
                  />
                </div>
                <div className="text-center py-1.5 px-1 flex-shrink-0">
                  <span className="text-[10px] font-black uppercase text-amber-600 dark:text-amber-400 tracking-wider block">
                    Close-Up Slab
                  </span>
                </div>
              </div>
            </div>

            {/* Swatch Selector Row */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                    {activeShadeIndex + 1} / {shades.length} Shades
                  </span>
                  <span className="text-[10px] font-mono font-bold text-amber-600 dark:text-amber-400">
                    {activePanel.code}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleSelectShade((activeShadeIndex - 1 + shades.length) % shades.length)}
                    className="w-7 h-7 flex items-center justify-center rounded-full bg-stone-200/80 dark:bg-stone-800/80 hover:bg-amber-500 hover:text-stone-950 text-stone-600 dark:text-stone-300 transition-colors"
                    aria-label="Previous shade"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectShade((activeShadeIndex + 1) % shades.length)}
                    className="w-7 h-7 flex items-center justify-center rounded-full bg-stone-200/80 dark:bg-stone-800/80 hover:bg-amber-500 hover:text-stone-950 text-stone-600 dark:text-stone-300 transition-colors"
                    aria-label="Next shade"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Fisheye Dock — edges fade with mask gradient */}
              <div
                ref={swatchScrollRef}
                className="w-full flex items-center overflow-x-scroll no-scrollbar py-3"
                style={{
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                  WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
                  maskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
                }}
              >
                {/* Leading spacer so first item can scroll to centre */}
                <div className="flex-shrink-0" style={{ width: 'calc(50% - 28px)' }} />
                {shades.map((panel, idx) => {
                  const distance = Math.abs(idx - activeShadeIndex);
                  const isActive = distance === 0;
                  const scale = distance === 0 ? 1 : distance === 1 ? 0.82 : distance === 2 ? 0.68 : 0.52;
                  const opacity = distance === 0 ? 1 : distance === 1 ? 0.78 : distance === 2 ? 0.48 : 0.25;

                  return (
                    <button
                      key={panel.id}
                      onClick={() => handleSelectShade(idx)}
                      style={{
                        transform: `scale(${scale})`,
                        opacity: opacity,
                        transition: 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.4s ease',
                      }}
                      className="w-14 sm:w-16 flex-shrink-0 flex flex-col items-center justify-center cursor-pointer select-none focus:outline-none origin-center group"
                      title={`${panel.code}: ${panel.name}`}
                    >
                      <div
                        className={`relative w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden transition-all duration-300 ${
                          isActive
                            ? 'ring-2 ring-amber-500 ring-offset-2 ring-offset-stone-50 dark:ring-offset-stone-950 border-2 border-white dark:border-stone-900 shadow-[0_0_20px_rgba(245,158,11,0.5)]'
                            : 'border border-stone-300 dark:border-stone-700 group-hover:border-amber-400'
                        }`}
                      >
                        <Image
                          src={panel.imageUrl}
                          alt={panel.name}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                        <span
                          className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border border-stone-900 shadow"
                          style={{ backgroundColor: panel.colorSwatch }}
                        />
                      </div>
                      <span
                        className={`mt-1.5 text-[10px] font-mono font-bold truncate max-w-full text-center transition-colors ${
                          isActive ? 'text-amber-600 dark:text-amber-400' : 'text-stone-500 dark:text-stone-400'
                        }`}
                      >
                        {panel.code}
                      </span>
                    </button>
                  );
                })}
                {/* Trailing spacer so last item can scroll to centre */}
                <div className="flex-shrink-0" style={{ width: 'calc(50% - 28px)' }} />
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN: Clean Product Details ── */}
          <div className="lg:col-span-5 flex flex-col pt-2">



            {/* Panel Name */}
            <div className="mb-5">
              <h3 className="text-3xl sm:text-4xl font-black text-stone-900 dark:text-white leading-tight">
                {activePanel.name}
              </h3>
            </div>

            {/* Price */}
            <div className="mb-5 pb-5 border-b border-stone-200 dark:border-stone-800">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-3xl sm:text-4xl font-black text-stone-900 dark:text-white tracking-tight">
                  ₹{activePanel.pricePerPiece}
                </span>
                <span className="text-xl line-through text-stone-400 dark:text-stone-500 font-medium">
                  ₹{effectiveMrp}
                </span>
                <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                  {discountPct}% OFF
                </span>
                <span className="px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                  Limited
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed mb-6">
              {activePanel.description}
            </p>

            {/* Technical Specs — clean divider list, no box wrappers */}
            <dl className="space-y-2.5 mb-7">
              {[
                { label: 'Dimensions', value: activePanel.dimensions },
                { label: 'Thickness', value: `${activePanel.thicknessMm} MM Profile` },
                { label: 'Weight', value: `${activePanel.weightKg} kg / piece` },
                { label: 'Box Coverage', value: `${activePanel.boxPacking} pcs · ${activePanel.boxCoverageSqFt} sq ft` },
                { label: 'Water Resistance', value: '100% Waterproof' },
                { label: 'Fire Rating', value: 'Class B1 Flame Retardant' },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-baseline justify-between text-xs border-b border-stone-100 dark:border-stone-800/60 pb-2.5">
                  <dt className="text-stone-500 dark:text-stone-400 font-medium">{label}</dt>
                  <dd className="font-bold text-stone-800 dark:text-stone-200 font-mono text-right">{value}</dd>
                </div>
              ))}
            </dl>



            {/* CTA Button */}
            <button
              type="button"
              onClick={() => setIsQuoteModalOpen(true)}
              className="w-full py-3.5 px-6 rounded-2xl bg-stone-900 dark:bg-white hover:bg-stone-800 dark:hover:bg-stone-100 text-white dark:text-stone-900 font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg"
            >
              <span>Get Quote</span>
              <span>→</span>
            </button>

          </div>
        </div>
      </section>

      {/* Get Quote Modal */}
      <GetQuoteModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        activePanel={activePanel}
        allPanels={shades}
        seriesLabel={config.seriesLabel}
        whatsappNumber={whatsappNumber}
      />
    </>
  );
}
