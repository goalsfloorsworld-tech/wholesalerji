'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { ArrowRight, MoveHorizontal, Sparkles } from 'lucide-react';

interface TurfBeforeAfterProps {
  onOpenQuote: (source: string, productName?: string) => void;
}

export default function TurfBeforeAfter({ onOpenQuote }: TurfBeforeAfterProps) {
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle position calculation
  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const clampedPct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(clampedPct);
  }, []);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches[0]) {
        handleMove(e.touches[0].clientX);
      }
    },
    [handleMove]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isDragging) {
        handleMove(e.clientX);
      }
    },
    [isDragging, handleMove]
  );

  // Global mouse up to release drag even outside container
  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDragging(false);
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, []);

  return (
    <section className="py-12 sm:py-16 px-4 sm:px-8 lg:px-12 border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 transition-colors">
      <div className="max-w-[1440px] mx-auto w-full">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-bold">
                Real Transformation
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-stone-900 dark:text-white tracking-tight">
              Before &amp; After: Concrete to Luxury
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 max-w-md font-light leading-relaxed">
            Drag the slider horizontally to see how Goals Floors 35mm turf transforms a raw, dusty Gurgaon balcony into an outdoor luxury retreat.
          </p>
        </div>

        {/* Interactive Comparison Container */}
        <div
          ref={containerRef}
          onClick={(e) => handleMove(e.clientX)}
          onMouseDown={(e) => {
            setIsDragging(true);
            handleMove(e.clientX);
          }}
          onMouseMove={handleMouseMove}
          onTouchStart={(e) => {
            if (e.touches[0]) handleMove(e.touches[0].clientX);
          }}
          onTouchMove={handleTouchMove}
          className="relative w-full h-[55vh] sm:h-[65vh] min-h-[380px] sm:min-h-[500px] rounded-3xl overflow-hidden shadow-2xl select-none cursor-ew-resize border border-stone-200 dark:border-stone-800"
        >
          {/* AFTER IMAGE (Full width base) */}
          <div className="absolute inset-0 w-full h-full">
            <Image
              src="/assets/grass/balcony_after_turf.jpg"
              alt="Balcony after Goals Floors Hexa pattern designer artificial grass installation"
              fill
              priority
              sizes="(max-width: 1440px) 100vw, 1440px"
              className="object-cover object-center"
            />
            {/* Top Right Label */}
            <div className="absolute top-4 right-4 z-10 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-xs font-semibold tracking-wide flex items-center gap-1.5 shadow-lg pointer-events-none">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>AFTER: Goals Floors Hexa Designer Turf</span>
            </div>
          </div>

          {/* BEFORE IMAGE (Clipped on top based on slider position) */}
          <div
            className="absolute inset-0 h-full overflow-hidden will-change-[clip-path]"
            style={{
              clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)`,
              WebkitClipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)`,
            }}
          >
            <Image
              src="/assets/grass/balcony_before_turf.jpg"
              alt="Balcony before artificial grass installation - plain bare concrete floor"
              fill
              priority
              sizes="(max-width: 1440px) 100vw, 1440px"
              className="object-cover object-center"
            />
            {/* Top Left Label */}
            <div className="absolute top-4 left-4 z-10 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-xs font-semibold tracking-wide flex items-center gap-1.5 shadow-lg pointer-events-none">
              <span className="w-2 h-2 rounded-full bg-stone-400" />
              <span>BEFORE: Raw Concrete Slab</span>
            </div>
          </div>

          {/* DRAGGABLE DIVIDER LINE & HANDLE */}
          <div
            className="absolute top-0 bottom-0 z-20 pointer-events-none will-change-[left]"
            style={{ left: `${sliderPos}%` }}
          >
            {/* Vertical glowing divider line */}
            <div className="absolute top-0 bottom-0 -left-[1.5px] w-[3px] bg-white shadow-[0_0_15px_rgba(255,255,255,0.8),0_0_30px_rgba(16,185,129,0.5)]" />

            {/* Circular Handle */}
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-white dark:bg-stone-900 border-2 border-emerald-500 shadow-[0_4px_25px_rgba(0,0,0,0.5)] flex items-center justify-center text-stone-800 dark:text-white transition-transform active:scale-95 group">
              <MoveHorizontal className="w-5 h-5 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
            </div>
          </div>

          {/* Subtle Bottom Instruction Hint */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 px-4 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white text-[11px] font-mono tracking-wider pointer-events-none uppercase flex items-center gap-2">
            <span>⟵ Drag to Compare ⟶</span>
          </div>
        </div>

        {/* Bottom Action Strip */}
        <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
          <div>
            <h4 className="text-sm sm:text-base font-bold text-stone-900 dark:text-white">
              Ready to transform your balcony or terrace?
            </h4>
            <p className="text-xs text-stone-500 dark:text-stone-400 font-light mt-0.5">
              Direct warehouse rolls delivered same-day across Gurgaon &amp; Delhi NCR.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onOpenQuote('BeforeAfter', 'Balcony Transformation Turf')}
            className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs uppercase tracking-wider transition-all transform hover:-translate-y-0.5 shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <span>Transform Your Space</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
}
