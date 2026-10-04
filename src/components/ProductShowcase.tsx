
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
  selectedShadeId?: string;
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
    subtitle: '',
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
  selectedShadeId,
  title: customTitle,
  sectionId = 'showcase',
  whatsappNumber = '919217400163',
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

  useEffect(() => {
    const handleOpenModal = () => setIsQuoteModalOpen(true);
    window.addEventListener('open-showcase-quote-modal', handleOpenModal);
    return () => window.removeEventListener('open-showcase-quote-modal', handleOpenModal);
  }, []);

  const swatchContainerRef = useRef<HTMLDivElement>(null);
  const autoTimerRef = useRef<NodeJS.Timeout | null>(null);
  const activeIndexRef = useRef(activeShadeIndex);

  useEffect(() => {
    activeIndexRef.current = activeShadeIndex;
  }, [activeShadeIndex]);

  const onShadeChangeRef = useRef(onShadeChange);
  useEffect(() => {
    onShadeChangeRef.current = onShadeChange;
  }, [onShadeChange]);

  const scrollSwatchToCenter = useCallback((index: number, behavior: ScrollBehavior = 'smooth') => {
    const container = swatchContainerRef.current;
    if (!container) return;
    const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 640;
    const itemWidth = isDesktop ? 64 : 56;
    const targetScrollLeft = index * itemWidth;

    container.scrollTo({
      left: targetScrollLeft,
      behavior,
    });
  }, []);

  const changeShade = useCallback(
    (targetIndex: number) => {
      setActiveShadeIndex(targetIndex);
      scrollSwatchToCenter(targetIndex, 'smooth');
      if (shades[targetIndex]) {
        onShadeChangeRef.current?.(shades[targetIndex], targetIndex);
      }
    },
    [scrollSwatchToCenter, shades]
  );

  const resetTimer = useCallback(() => {
    if (autoTimerRef.current) clearInterval(autoTimerRef.current);
    autoTimerRef.current = setInterval(() => {
      const next = (activeIndexRef.current + 1) % shades.length;
      changeShade(next);
    }, 4500);
  }, [changeShade, shades.length]);

  useEffect(() => {
    resetTimer();
    return () => {
      if (autoTimerRef.current) clearInterval(autoTimerRef.current);
    };
  }, [resetTimer]);

  const handleSelectShade = useCallback(
    (idx: number) => {
      resetTimer();
      changeShade(idx);
    },
    [changeShade, resetTimer]
  );

  // Center active swatch on mount and paint
  useEffect(() => {
    scrollSwatchToCenter(activeShadeIndex, 'auto');
    const timer = setTimeout(() => {
      scrollSwatchToCenter(activeShadeIndex, 'auto');
    }, 70);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Preload all installed room scene images and textures for instantaneous zero-lag switching
  useEffect(() => {
    if (typeof window === 'undefined') return;
    shades.forEach((s) => {
      if (s.installedImage) {
        const img = new window.Image();
        img.src = s.installedImage;
      }
      if (s.imageUrl) {
        const img2 = new window.Image();
        img2.src = s.imageUrl;
      }
    });
  }, [shades]);

  // Re-center on window resize
  useEffect(() => {
    const handleResize = () => {
      scrollSwatchToCenter(activeIndexRef.current, 'auto');
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [scrollSwatchToCenter]);

  // Programmatic shade selection via selectedShadeId prop
  const prevSelectedIdRef = useRef<string | undefined>(undefined);
  useEffect(() => {
    if (!selectedShadeId) return;
    if (selectedShadeId === prevSelectedIdRef.current) return;
    prevSelectedIdRef.current = selectedShadeId;

    const targetIdx = shades.findIndex(
      (s) =>
        s.code.toLowerCase() === selectedShadeId.toLowerCase() ||
        s.id.toLowerCase() === selectedShadeId.toLowerCase()
    );
    if (targetIdx !== -1) {
      const timer = setTimeout(() => {
        resetTimer();
        changeShade(targetIdx);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [selectedShadeId, shades, changeShade, resetTimer]);

  // Programmatic shade selection via custom window event
  useEffect(() => {
    const handleCustomSelect = (e: Event) => {
      const customEvent = e as CustomEvent<{ code?: string; id?: string }>;
      const codeOrId = customEvent.detail?.code || customEvent.detail?.id;
      if (!codeOrId) return;
      const targetIdx = shades.findIndex(
        (s) =>
          s.code.toLowerCase() === codeOrId.toLowerCase() ||
          s.id.toLowerCase() === codeOrId.toLowerCase()
      );
      if (targetIdx !== -1) {
        resetTimer();
        changeShade(targetIdx);
      }
    };
    window.addEventListener('select-showcase-shade', handleCustomSelect);
    return () => window.removeEventListener('select-showcase-shade', handleCustomSelect);
  }, [shades, changeShade, resetTimer]);

  if (!shades || shades.length === 0) return null;

  const activePanel = shades[activeShadeIndex] || shades[0];
  const activeRoomScene =
    activePanel?.installedImage ||
    (roomScenes && roomScenes.length > 0
      ? roomScenes[activeShadeIndex % roomScenes.length]
      : activePanel.imageUrl);

  const effectiveMrp = activePanel.mrpPerPiece || config.mrp;
  const discountPct = Math.round(((effectiveMrp - activePanel.pricePerPiece) / effectiveMrp) * 100);

  const renderSwatchSelector = () => (
    <div className="w-full mt-4 sm:mt-6">
      <div className="flex items-center justify-between mb-2 px-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
            {activeShadeIndex + 1} / {shades.length} Shades
          </span>
          <span className="text-[11px] font-mono font-bold text-amber-600 dark:text-amber-400">
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

      {/* Fisheye Dock — centered active circle with mask gradient */}
      <div
        ref={swatchContainerRef}
        onMouseEnter={() => {
          if (autoTimerRef.current) clearInterval(autoTimerRef.current);
        }}
        role="tablist"
        aria-label="Product shade selector"
        onMouseLeave={resetTimer}
        className="w-full relative flex items-center overflow-x-scroll no-scrollbar py-8 sm:py-9 select-none"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)',
          maskImage: 'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)',
        }}
      >
        {/* Leading spacer so first item can scroll to exact centre */}
        <div className="flex-shrink-0 w-[calc(50%-28px)] sm:w-[calc(50%-32px)]" />
        {shades.map((panel, idx) => {
          const distance = Math.abs(idx - activeShadeIndex);
          const isActive = distance === 0;
          const scale = isActive ? 1.25 : distance === 1 ? 0.92 : distance === 2 ? 0.78 : 0.68;
          const opacity = isActive ? 1 : distance === 1 ? 0.85 : distance === 2 ? 0.65 : 0.45;

          return (
            <button
              key={panel.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-label={`Select shade ${panel.code} ${panel.name}`}
              onClick={() => handleSelectShade(idx)}
              style={{
                transform: `scale(${scale})`,
                opacity: opacity,
                transition: 'transform 0.35s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.35s ease',
              }}
              className="w-14 sm:w-16 flex-shrink-0 flex flex-col items-center justify-center cursor-pointer select-none focus:outline-none origin-center group"
              title={`${panel.code}: ${panel.name}`}
            >
              <div
                className={`relative w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden transition-all duration-300 ${
                  isActive
                    ? 'ring-2 ring-amber-500 ring-offset-2 ring-offset-stone-50 dark:ring-offset-stone-950 border-2 border-white dark:border-stone-900 shadow-[0_0_24px_rgba(245,158,11,0.6)]'
                    : 'ring-2 ring-transparent ring-offset-2 ring-offset-transparent border border-stone-300 dark:border-stone-700 group-hover:border-amber-400 shadow-none'
                }`}
              >
                <Image
                  src={panel.imageUrl}
                  alt={`${panel.code} ${panel.name} finish swatch`}
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
        {/* Trailing spacer so last item can scroll to exact centre */}
        <div className="flex-shrink-0 w-[calc(50%-28px)] sm:w-[calc(50%-32px)]" />
      </div>
    </div>
  );

  return (
    <>
      {/* Hidden preloader for instant zero-lag switching across all installed room scenes */}
      <div className="sr-only select-none pointer-events-none w-0 h-0 overflow-hidden" aria-hidden="true">
        {shades.map((panel) => {
          const sceneUrl = panel.installedImage || panel.imageUrl;
          return sceneUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={`preload-scene-${panel.id}`}
              src={sceneUrl}
              alt={panel.installedImageAlt || `Preloaded installed setting for ${panel.code} ${panel.name}`}
              loading="eager"
              decoding="async"
            />
          ) : null;
        })}
      </div>

      <section
        id={sectionId}
        className="w-full px-4 sm:px-8 lg:px-12 pt-10 pb-14 sm:pb-20 border-b border-stone-200 dark:border-stone-800/80 scroll-mt-16"
      >
        {/* Section Header */}
        <div className="mb-8 sm:mb-10 max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-stone-900 dark:text-white">
            {title}
          </h2>
        </div>

        {/* 2-Column Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 w-full max-w-7xl mx-auto items-start">

          {/* ── LEFT COLUMN: Room Visual + Close-up Slab + Fisheye Dock ── */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="relative w-full h-[50vh] sm:h-[60vh] min-h-[410px] sm:min-h-[420px] rounded-3xl overflow-visible group">

              {/* Main Room Environment */}
              <div className="relative w-full h-full rounded-3xl overflow-hidden bg-stone-200 dark:bg-stone-900 shadow-2xl">
                <Image
                  key={`room-${activePanel.id}`}
                  src={activeRoomScene}
                  alt={
                    activePanel.installedImageAlt ||
                    `Installed room interior setting for ${activePanel.name} (${activePanel.code}) wall panel`
                  }
                  fill
                  priority
                  unoptimized
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 text-white text-[11px] font-semibold tracking-wider uppercase drop-shadow z-10 opacity-80">
                  In-Situ Architectural Scale · {activePanel.name}
                </div>
              </div>

              {/* Close-Up Texture Slab — floats right */}
              <div
                className="absolute z-20 top-4 bottom-4 w-32 sm:w-40 rounded-2xl overflow-hidden border border-white/60 dark:border-amber-400/50 shadow-xl bg-white/90 dark:bg-stone-950/90 backdrop-blur-md p-1.5 flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300"
                style={{ right: '-18px' }}
              >
                <div className="relative w-full flex-1 rounded-xl overflow-hidden bg-stone-200 dark:bg-stone-950 min-h-0">
                  <Image
                    key={`slab-${activePanel.id}`}
                    src={activePanel.imageUrl}
                    alt={`Close-up 300mm interlock texture slab of ${activePanel.name} (${activePanel.code})`}
                    fill
                    unoptimized
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

            {/* Swatch Selector (Directly under the big visual on the left side) */}
            {renderSwatchSelector()}
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
              id="showcase-get-quote-btn"
              data-quote-trigger="true"
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
