'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { ArrowRight, ZoomIn, X, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import {
  ALL_ARTIFICIAL_GRASS,
  ArtificialGrassProduct,
} from '@/data/artificialGrassData';

interface GrassShowcaseProps {
  onOpenQuote: (source: string, productName: string) => void;
}

export default function GrassShowcase({ onOpenQuote }: GrassShowcaseProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const swatchContainerRef = useRef<HTMLDivElement>(null);
  const autoTimerRef = useRef<NodeJS.Timeout | null>(null);

  const products = ALL_ARTIFICIAL_GRASS;
  const activeProduct: ArtificialGrassProduct = products[activeIndex] || products[0];

  // Center active swatch in scrollable dock
  const scrollSwatchToCenter = useCallback((targetIndex: number, behavior: ScrollBehavior = 'smooth') => {
    const container = swatchContainerRef.current;
    if (!container) return;
    const items = container.querySelectorAll<HTMLElement>('[role="tab"]');
    const targetItem = items[targetIndex];
    if (!targetItem) return;

    const containerWidth = container.offsetWidth;
    const itemLeft = targetItem.offsetLeft;
    const itemWidth = targetItem.offsetWidth;
    const targetScrollLeft = itemLeft - containerWidth / 2 + itemWidth / 2;

    container.scrollTo({
      left: targetScrollLeft,
      behavior,
    });
  }, []);

  const changeProduct = useCallback(
    (targetIndex: number) => {
      setActiveIndex(targetIndex);
      scrollSwatchToCenter(targetIndex, 'smooth');
    },
    [scrollSwatchToCenter]
  );

  // Auto-slide every 5 seconds unless hovered or zoomed
  useEffect(() => {
    if (autoTimerRef.current) clearInterval(autoTimerRef.current);
    if (isHovered || zoomedImage) return;

    autoTimerRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % products.length);
    }, 5000);

    return () => {
      if (autoTimerRef.current) clearInterval(autoTimerRef.current);
    };
  }, [products.length, isHovered, zoomedImage]);

  // Center on active index changes
  useEffect(() => {
    scrollSwatchToCenter(activeIndex, 'smooth');
  }, [activeIndex, scrollSwatchToCenter]);

  // Keyboard navigation for zoom modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setZoomedImage(null);
    };
    if (zoomedImage) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [zoomedImage]);

  const effectiveMrp = activeProduct.mrp || Math.round(activeProduct.price * 1.5);
  const discountPct = Math.round(((effectiveMrp - activeProduct.price) / effectiveMrp) * 100);

  const mainVisual = activeProduct.installedImage || activeProduct.image;
  const textureVisual = activeProduct.image;

  return (
    <section
      id="products"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="py-10 px-4 sm:px-8 lg:px-12 border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 transition-colors scroll-mt-16"
    >
      <div className="max-w-[1440px] mx-auto w-full">
        {/* Section Header: Title on Left, Description on Right */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-8 gap-6">
          <div className="flex-1 max-w-3xl">
            {/* Keyword rich heading for bots/Google without visual clutter */}
            <span className="sr-only">Wholesale Artificial Grass & Designer Turf Showcase</span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-[42px] font-black text-stone-900 dark:text-white tracking-tight leading-tight">
              <span className="block">Landscape Turf &amp;</span>
              <span className="block text-emerald-600 dark:text-emerald-400">Designer Pattern Showcase</span>
            </h2>
          </div>
          <div className="lg:max-w-sm xl:max-w-md shrink-0">
            <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed font-light">
              Experience both the in-situ outdoor landscape setting and the close-up tuft architecture simultaneously. Direct mill rolls and pre-cut lengths stocked in Sector 34 Gurugram.
            </p>
          </div>
        </div>

        {/* 2-Column Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          {/* ── LEFT COLUMN: Installed Landscape Visual + Square Close-up Swatch + Swatch Dock ── */}
          <div className="lg:col-span-7 flex flex-col">
            {/* Visual Container */}
            <div className="relative w-full h-[50vh] sm:h-[58vh] min-h-[400px] sm:min-h-[460px] rounded-3xl overflow-hidden group shadow-2xl">
              {/* Main Installed Environment Image */}
              <div
                className="relative w-full h-full overflow-hidden bg-stone-200 dark:bg-stone-900 cursor-zoom-in"
                onClick={() => setZoomedImage(mainVisual)}
              >
                <Image
                  key={`main-${activeProduct.code}`}
                  src={mainVisual}
                  alt={activeProduct.installedImageAlt || activeProduct.altText}
                  fill
                  priority
                  unoptimized
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 pointer-events-none" />

                {/* Click to Zoom indicator */}
                <div className="absolute top-4 left-4 px-2.5 py-1 rounded-full bg-black/50 text-white text-[10px] font-mono backdrop-blur-md flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <ZoomIn className="w-3 h-3 text-emerald-400" />
                  <span>Click to Expand</span>
                </div>
              </div>

              {/* Square Close-Up Texture Swatch (Larger on phone screen, bottom right) */}
              <div
                className="absolute z-20 bottom-3 right-3 sm:bottom-4 sm:right-4 w-40 sm:w-44 md:w-48 aspect-square rounded-2xl overflow-hidden border-2 border-white/90 dark:border-stone-800 shadow-2xl bg-white/95 dark:bg-stone-950/95 backdrop-blur-md p-1.5 cursor-zoom-in hover:scale-105 transition-transform duration-300 group/slab"
                onClick={(e) => {
                  e.stopPropagation();
                  setZoomedImage(textureVisual);
                }}
                title="Click to zoom close-up texture"
              >
                <div className="relative w-full h-full rounded-xl overflow-hidden bg-stone-200 dark:bg-stone-900">
                  <Image
                    key={`slab-${activeProduct.code}`}
                    src={textureVisual}
                    alt={activeProduct.altText}
                    fill
                    unoptimized
                    sizes="(max-width: 768px) 130px, 192px"
                    className="object-cover object-center group-hover/slab:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover/slab:opacity-100 transition-opacity" />
                  <div className="absolute top-2 right-2 p-1 rounded-full bg-black/60 text-white shadow">
                    <ZoomIn className="w-3 h-3 text-emerald-400" />
                  </div>
                  <div className="absolute bottom-2 left-2 right-2 text-center pointer-events-none">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-white drop-shadow bg-black/60 px-2 py-0.5 rounded-full backdrop-blur-sm">
                      {activeProduct.pileHeight}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Fisheye Circular Swatch Dock */}
            <div className="w-full mt-5 sm:mt-6">
              <div className="flex items-center justify-between mb-2 px-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                    {activeIndex + 1} / {products.length} Turf Options
                  </span>
                  <span className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {activeProduct.code}
                  </span>
                </div>

                {/* Left/Right Arrow Buttons */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() =>
                      changeProduct((activeIndex - 1 + products.length) % products.length)
                    }
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-stone-200/80 dark:bg-stone-800/80 hover:bg-emerald-500 hover:text-stone-950 text-stone-600 dark:text-stone-300 transition-colors cursor-pointer"
                    aria-label="Previous product"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => changeProduct((activeIndex + 1) % products.length)}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-stone-200/80 dark:bg-stone-800/80 hover:bg-emerald-500 hover:text-stone-950 text-stone-600 dark:text-stone-300 transition-colors cursor-pointer"
                    aria-label="Next product"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Horizontal Scroll Swatch Carousel */}
              <div
                ref={swatchContainerRef}
                role="tablist"
                aria-label="Artificial Grass Swatches"
                className="flex items-center gap-2 sm:gap-3 overflow-x-auto py-3 px-1 no-scrollbar scroll-smooth"
                style={{
                  maskImage:
                    'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)',
                  WebkitMaskImage:
                    'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)',
                }}
              >
                {/* Leading spacer for center alignment */}
                <div className="flex-shrink-0 w-[calc(50%-28px)] sm:w-[calc(50%-32px)]" />

                {products.map((product, idx) => {
                  const isActive = idx === activeIndex;
                  return (
                    <button
                      key={product.code}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      aria-label={`Select ${product.name}`}
                      onClick={() => changeProduct(idx)}
                      className="w-14 sm:w-16 flex-shrink-0 flex flex-col items-center justify-center cursor-pointer select-none focus:outline-none origin-center group"
                      title={`${product.code}: ${product.name}`}
                    >
                      <div
                        className={`relative w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden transition-all duration-300 ${
                          isActive
                            ? 'ring-2 ring-emerald-500 ring-offset-2 ring-offset-stone-50 dark:ring-offset-stone-950 border-2 border-white dark:border-stone-900 shadow-[0_0_20px_rgba(16,185,129,0.6)] scale-110'
                            : 'ring-2 ring-transparent ring-offset-2 ring-offset-transparent border border-stone-300 dark:border-stone-700 group-hover:border-emerald-400 opacity-75 group-hover:opacity-100'
                        }`}
                      >
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>
                      <span
                        className={`mt-1.5 text-[10px] font-mono font-bold truncate max-w-full text-center transition-colors ${
                          isActive ? 'text-emerald-600 dark:text-emerald-400 font-extrabold' : 'text-stone-500 dark:text-stone-400'
                        }`}
                      >
                        {product.code}
                      </span>
                    </button>
                  );
                })}

                {/* Trailing spacer */}
                <div className="flex-shrink-0 w-[calc(50%-28px)] sm:w-[calc(50%-32px)]" />
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN: Technical Specs & Wholesale Pricing (Capsules Cleaned) ── */}
          <div className="lg:col-span-5 flex flex-col pt-1">
            {/* Product Title (No extra capsules above) */}
            <h3 className="text-2xl sm:text-4xl font-black text-stone-900 dark:text-white leading-tight mb-3">
              {activeProduct.name}
            </h3>

            {/* Price Row: Keeping ONLY the discount percentage capsule */}
            <div className="mb-4 pb-4 border-b border-stone-200 dark:border-stone-800">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
                  ₹{activeProduct.price}
                  <span className="text-sm font-semibold text-stone-500 dark:text-stone-400 ml-1">/ sq.ft</span>
                </span>
                <span className="text-lg line-through text-stone-400 dark:text-stone-500 font-medium">
                  ₹{effectiveMrp}
                </span>
                {/* 34% OFF style capsule (Kept per instruction) */}
                <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  {discountPct}% OFF
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed mb-5 font-light">
              {activeProduct.description}
            </p>

            {/* Technical Specifications Divider List */}
            <dl className="space-y-2 mb-6 border-t border-b border-stone-200 dark:border-stone-800 py-3 text-xs">
              <div className="flex items-center justify-between py-1">
                <dt className="text-stone-500 dark:text-stone-400">Pile Height</dt>
                <dd className="font-mono font-bold text-stone-900 dark:text-white">{activeProduct.pileHeight}</dd>
              </div>
              <div className="flex items-center justify-between py-1">
                <dt className="text-stone-500 dark:text-stone-400">Tuft Density</dt>
                <dd className="font-mono font-bold text-stone-900 dark:text-white">{activeProduct.density}</dd>
              </div>
              <div className="flex items-center justify-between py-1">
                <dt className="text-stone-500 dark:text-stone-400">Stitch Rate</dt>
                <dd className="font-mono font-bold text-stone-900 dark:text-white">{activeProduct.stitches}</dd>
              </div>
              <div className="flex items-center justify-between py-1">
                <dt className="text-stone-500 dark:text-stone-400">Yarn Dtex</dt>
                <dd className="font-mono font-bold text-stone-900 dark:text-white">{activeProduct.dtex} Dtex</dd>
              </div>
              <div className="flex items-center justify-between py-1">
                <dt className="text-stone-500 dark:text-stone-400">Backing Type</dt>
                <dd className="font-mono font-bold text-stone-900 dark:text-white">{activeProduct.backing}</dd>
              </div>
              <div className="flex items-center justify-between py-1">
                <dt className="text-stone-500 dark:text-stone-400">Master Roll Coverage</dt>
                <dd className="font-mono font-bold text-stone-900 dark:text-white">{activeProduct.areaPerRoll} (2m × 25m)</dd>
              </div>
              <div className="flex items-start justify-between py-1 gap-4">
                <dt className="text-stone-500 dark:text-stone-400 shrink-0">Recommended Use</dt>
                <dd className="font-medium text-stone-800 dark:text-stone-200 text-right">
                  {'use' in activeProduct ? activeProduct.use : activeProduct.designConcept}
                </dd>
              </div>
            </dl>

            {/* Single Quote CTA Button (WhatsApp Stock button removed) */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => onOpenQuote('Showcase', `${activeProduct.name} (${activeProduct.code})`)}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-stone-950 font-bold text-xs sm:text-sm tracking-wide shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer group"
              >
                <span>Get Wholesale Quote</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Quick Trust Checklist */}
            <div className="flex items-center gap-4 text-[11px] text-stone-500 dark:text-stone-400 pt-4">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Full Roll & Cut Lengths</span>
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>GST Tax Invoice</span>
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Same-Day Gurugram Dispatch</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Complete Product Catalog for Googlebot, AI Search Crawlers & Screen Readers */}
      <div className="sr-only" aria-label="Complete Artificial Grass Master Catalog">
        <h3>All Wholesale Artificial Grass Specifications & Roll Rates</h3>
        <ul>
          {products.map((p) => (
            <li key={`ssr-bot-${p.code}`}>
              <h4>{p.name} ({p.code})</h4>
              <p>Category: {p.category === 'normal' ? 'Normal Landscape' : 'Designer Pattern'} Turf</p>
              <p>Wholesale Rate: ₹{p.price} per sq.ft (MRP ₹{p.mrp || Math.round(p.price * 1.5)})</p>
              <p>Pile Height: {p.pileHeight}</p>
              <p>Tuft Density: {p.density}</p>
              <p>Stitches: {p.stitches}</p>
              <p>Yarn Dtex: {p.dtex} Dtex</p>
              <p>Backing: {p.backing}</p>
              <p>Roll Coverage: {p.areaPerRoll} (2m × 25m)</p>
              <p>Description: {p.description}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Fullscreen Lightbox Zoom Modal */}
      {zoomedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setZoomedImage(null)}
        >
          <button
            type="button"
            onClick={() => setZoomedImage(null)}
            className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close zoom preview"
          >
            <X className="w-5 h-5" />
          </button>
          <div
            className="relative max-w-5xl max-h-[90vh] w-full h-[80vh] rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={zoomedImage}
              alt="Expanded high-resolution turf preview"
              fill
              unoptimized
              className="object-contain"
            />
          </div>
        </div>
      )}
    </section>
  );
}
