'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { GalleryImageItem, GalleryCollectionId, GALLERY_COLLECTION_FILTERS } from '@/data/galleryData';

interface GalleryClientProps {
  initialItems: GalleryImageItem[];
}

export default function GalleryClient({ initialItems }: GalleryClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<GalleryCollectionId>('all');
  const [activeModalItem, setActiveModalItem] = useState<GalleryImageItem | null>(null);

  // Active indicator position state for the sliding triangle
  const [indicatorLeft, setIndicatorLeft] = useState(0);
  const [indicatorWidth, setIndicatorWidth] = useState(0);
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);

  // Filter items by category
  const filteredItems = useMemo(() => {
    return initialItems.filter((item) => {
      return selectedCategory === 'all' || item.collection === selectedCategory;
    });
  }, [initialItems, selectedCategory]);

  // Update sliding indicator position on tab select or window resize
  useEffect(() => {
    const updateIndicator = () => {
      const activeIndex = GALLERY_COLLECTION_FILTERS.findIndex((f) => f.id === selectedCategory);
      const activeEl = tabsRef.current[activeIndex];
      if (activeEl) {
        setIndicatorLeft(activeEl.offsetLeft);
        setIndicatorWidth(activeEl.offsetWidth);
      }
    };

    updateIndicator();
    window.addEventListener('resize', updateIndicator);
    return () => window.removeEventListener('resize', updateIndicator);
  }, [selectedCategory]);

  // Keyboard navigation for Lightbox (ESC to close, Arrow keys to navigate)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveModalItem(null);
      }
      if (activeModalItem) {
        const currentIndex = filteredItems.findIndex((it) => it.id === activeModalItem.id);
        if (e.key === 'ArrowRight' && currentIndex < filteredItems.length - 1) {
          setActiveModalItem(filteredItems[currentIndex + 1]);
        } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
          setActiveModalItem(filteredItems[currentIndex - 1]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModalItem, filteredItems]);

  return (
    <div className="w-full">
      {/* ─── Filter Bar: Single Big Capsule with Accent Border & Upward-pointing Sliding Triangle ─── */}
      <div className="relative z-10 py-4 mb-10 flex justify-center w-full">
        <div className="relative inline-flex items-center rounded-full bg-white dark:bg-stone-900 border-2 border-amber-500/90 dark:border-amber-500/90 p-1.5 shadow-sm">
          {GALLERY_COLLECTION_FILTERS.map((filter, index) => {
            const isActive = selectedCategory === filter.id;
            return (
              <button
                key={filter.id}
                ref={(el) => {
                  tabsRef.current[index] = el;
                }}
                onClick={() => setSelectedCategory(filter.id as GalleryCollectionId)}
                className={`relative px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm tracking-wide transition-colors duration-200 cursor-pointer ${
                  isActive
                    ? 'text-amber-500 dark:text-amber-400 font-black'
                    : 'text-stone-600 hover:text-stone-950 dark:text-stone-400 dark:hover:text-stone-100 font-medium'
                }`}
                aria-pressed={isActive}
              >
                <span>{filter.label}</span>
              </button>
            );
          })}

          {/* ── Seamless Sliding Triangle Indicator pointing UP into the active tab ── */}
          <div
            className="absolute bottom-0 transition-all duration-300 ease-out pointer-events-none flex justify-center z-20"
            style={{
              left: `${indicatorLeft}px`,
              width: `${indicatorWidth}px`,
            }}
          >
            <svg
              width="16"
              height="7"
              viewBox="0 0 16 7"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="overflow-visible"
            >
              {/* Upward-pointing triangle: base rests on the border, top edge is smoothly curved */}
              <path
                d="M1 7 L6.2 1.4 C7.1 0.4 8.9 0.4 9.8 1.4 L15 7 Z"
                className="fill-amber-500 dark:fill-amber-500"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* ─── Responsive Image Grid with Warm Light Backlight Glow on Hover ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-5 sm:gap-6">
        {filteredItems.map((item, index) => (
          <article
            key={item.id}
            onClick={() => setActiveModalItem(item)}
            className="group relative cursor-pointer flex flex-col transition-all duration-300 select-none isolate"
            role="button"
            tabIndex={0}
            aria-label={`View photo for ${item.displayLabel}`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setActiveModalItem(item);
              }
            }}
          >
            {/* Warm Light Backlight radiating from behind the card on hover */}
            <div className="absolute -inset-2 rounded-3xl bg-amber-500/25 dark:bg-amber-500/30 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 pointer-events-none" />

            {/* Image Container — clean, zero overlays over the photo */}
            <div className="relative aspect-4/3 w-full rounded-2xl overflow-hidden bg-stone-200 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs group-hover:shadow-[0_0_25px_rgba(239,68,68,0.25)] group-hover:border-amber-500/60 transition-all duration-300">
              <Image
                src={item.imageUrl}
                alt={item.altText}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1536px) 25vw, 20vw"
                loading={index < 8 ? 'eager' : 'lazy'}
                priority={index < 4}
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            {/* Plain minimal text below card showing collection + code only */}
            <div className="pt-2.5 pb-1 px-0.5 flex items-center justify-between">
              <p className="text-xs sm:text-sm font-semibold tracking-tight text-stone-900 dark:text-stone-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                {item.displayLabel}
              </p>
              <span className="text-[11px] text-stone-400 dark:text-stone-500 opacity-0 group-hover:opacity-100 transition-opacity">
                Inspect ↗
              </span>
            </div>
          </article>
        ))}
      </div>

      {/* ─── Self-Adapting Lightbox Modal (Mobile: Fixed top image, only content scrolls; Desktop: Original inline-flex hugging image) ─── */}
      {activeModalItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setActiveModalItem(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="lightbox-title"
        >
          <div
            className="relative flex flex-col md:inline-flex md:flex-row max-w-[96vw] max-h-[90vh] md:max-h-[88vh] bg-white dark:bg-stone-900 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-stone-200 dark:border-stone-800"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveModalItem(null)}
              className="absolute top-3.5 right-3.5 z-30 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-stone-950/75 hover:bg-stone-950 text-white flex items-center justify-center backdrop-blur-md transition-colors cursor-pointer shadow-md"
              aria-label="Close photo preview"
            >
              ✕
            </button>

            {/* ── MOBILE: Stays fixed at top; DESKTOP: Left side naturally hugging image dimensions ── */}
            <div className="relative flex-shrink-0 w-full md:w-auto flex items-center justify-center bg-stone-100 dark:bg-stone-950 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeModalItem.imageUrl}
                alt={activeModalItem.altText}
                className="max-h-[38vh] sm:max-h-[44vh] md:max-h-[85vh] w-auto h-auto max-w-[94vw] md:max-w-[58vw] object-contain block mx-auto flex-shrink-0"
              />
            </div>

            {/* ── MOBILE: Only content scrolls below image; DESKTOP: Original compact right sidebar ── */}
            <div className="w-full md:w-[370px] lg:w-[400px] flex-1 min-h-0 md:flex-initial md:flex-shrink-0 p-5 sm:p-7 flex flex-col justify-between overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 md:max-h-[85vh]">
              <div className="space-y-4">
                {/* Collection & Code */}
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                    {activeModalItem.collectionLabel}
                  </span>
                  {activeModalItem.code && (
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-bold">
                      {activeModalItem.code}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 id="lightbox-title" className="text-xl sm:text-2xl font-black tracking-tight text-stone-950 dark:text-white leading-snug">
                  {activeModalItem.displayLabel}
                </h3>

                {/* Clear description text */}
                <p className="text-sm sm:text-[15px] text-stone-700 dark:text-stone-300 leading-relaxed font-normal">
                  {activeModalItem.popupDescription}
                </p>

                {/* Product Specifications with High-Contrast Dark Labels */}
                <div className="pt-3 border-t border-stone-200 dark:border-stone-800 space-y-2 text-xs sm:text-sm">
                  <div className="flex justify-between py-1 border-b border-stone-100 dark:border-stone-800/60">
                    <span className="font-bold text-stone-900 dark:text-stone-100">Profile</span>
                    <span className="font-semibold text-stone-800 dark:text-stone-200 text-right">{activeModalItem.materialType}</span>
                  </div>
                  {activeModalItem.colorName && (
                    <div className="flex justify-between py-1 border-b border-stone-100 dark:border-stone-800/60">
                      <span className="font-bold text-stone-900 dark:text-stone-100">Color / Finish</span>
                      <span className="font-semibold text-stone-800 dark:text-stone-200 text-right">{activeModalItem.colorName}</span>
                    </div>
                  )}
                  <div className="flex justify-between py-1 border-b border-stone-100 dark:border-stone-800/60">
                    <span className="font-bold text-stone-900 dark:text-stone-100">Dimensions</span>
                    <span className="font-semibold text-stone-800 dark:text-stone-200 text-right">{activeModalItem.dimensions}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="font-bold text-stone-900 dark:text-stone-100">Warehouse Supply</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 text-right">Sector 34, Gurugram</span>
                  </div>
                </div>

                {/* Location Context */}
                <div className="p-3 rounded-xl bg-stone-100 dark:bg-stone-800/60 text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
                  <span className="font-bold text-stone-950 dark:text-white">Location Context: </span>
                  {activeModalItem.altText}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 mt-4 border-t border-stone-200 dark:border-stone-800 space-y-2.5">
                <Link
                  href={activeModalItem.parentPath}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs sm:text-sm font-bold tracking-wide shadow-xs transition-colors cursor-pointer"
                >
                  <span>{activeModalItem.parentLabel}</span>
                </Link>

                <a
                  href={`https://wa.me/919217400163?text=Hi%20WholesalerJi,%20I%20am%20inquiring%20about%20the%20installed%20panel%20${encodeURIComponent(
                    activeModalItem.displayLabel
                  )}%20seen%20in%20your%20gallery.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-stone-300 dark:border-stone-700 hover:border-emerald-500 text-stone-800 dark:text-stone-200 hover:text-emerald-600 dark:hover:text-emerald-400 text-xs font-semibold transition-colors"
                >
                  <span>WhatsApp Quote</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
