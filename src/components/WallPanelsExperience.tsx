'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ALL_WALL_PANELS, PanelProduct, WALL_PANEL_COLLECTIONS } from '@/data/wallPanelsData';

interface WallPanelsExperienceProps {
  initialCollection?: string;
}

export default function WallPanelsExperience({ initialCollection = 'all' }: WallPanelsExperienceProps) {
  const [selectedCollection, setSelectedCollection] = useState<string>(initialCollection);
  const [selectedFinish, setSelectedFinish] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeInspectorPanel, setActiveInspectorPanel] = useState<PanelProduct | null>(null);
  const [sqftInput, setSqftInput] = useState<number>(500);
  const [lightMode, setLightMode] = useState<'warm' | 'natural' | 'cool'>('natural');

  // GSAP Refs
  const pageContainerRef = useRef<HTMLDivElement | null>(null);
  const heroSectionRef = useRef<HTMLDivElement | null>(null);
  const heroFanDeckRef = useRef<HTMLDivElement | null>(null);
  const heroPanelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const spotlightRef = useRef<HTMLDivElement | null>(null);
  const flagshipSectionRef = useRef<HTMLDivElement | null>(null);
  const flagshipCardsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Update selection if prop changes
  useEffect(() => {
    if (initialCollection === 'primo' || initialCollection === 'elite') {
      setSelectedCollection(initialCollection);
    }
  }, [initialCollection]);

  // GSAP Animations setup
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // 1. Hero 3D Fan Spread on Scroll
      if (heroFanDeckRef.current && heroPanelRefs.current.length > 0) {
        const spreadAngles = [-24, -12, 0, 12, 24];
        const spreadX = [-140, -70, 0, 70, 140];

        gsap.fromTo(
          heroPanelRefs.current,
          {
            rotation: 0,
            x: 0,
            y: 40,
            opacity: 0.7,
            transformOrigin: '50% 100%',
          },
          {
            rotation: (i) => spreadAngles[i] || 0,
            x: (i) => spreadX[i] || 0,
            y: 0,
            opacity: 1,
            duration: 1.2,
            stagger: 0.08,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: heroSectionRef.current,
              start: 'top 80%',
              end: 'bottom 40%',
              scrub: 0.8,
            },
          }
        );
      }

      // 2. Flagship Cards Stagger Reveal
      if (flagshipCardsRef.current.length > 0) {
        gsap.fromTo(
          flagshipCardsRef.current,
          { opacity: 0, y: 50, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: flagshipSectionRef.current,
              start: 'top 75%',
            },
          }
        );
      }
    }, pageContainerRef);

    return () => ctx.revert();
  }, []);

  // Track Mouse on Hero for Dynamic Lighting Sheen
  const handleHeroMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!heroSectionRef.current || !spotlightRef.current) return;
    const rect = heroSectionRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    spotlightRef.current.style.transform = `translate(${x - 200}px, ${y - 200}px)`;
  };

  // Filter Logic
  const filteredPanels = useMemo(() => {
    return ALL_WALL_PANELS.filter((p) => {
      // Collection filter
      if (selectedCollection !== 'all' && p.collection !== selectedCollection) {
        return false;
      }
      // Finish filter
      if (selectedFinish !== 'all' && p.finishType !== selectedFinish) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesCode = p.code.toLowerCase().includes(q);
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesColor = p.colorName.toLowerCase().includes(q);
        const matchesFinish = p.finishType.toLowerCase().includes(q);
        if (!matchesCode && !matchesName && !matchesColor && !matchesFinish) {
          return false;
        }
      }
      return true;
    });
  }, [selectedCollection, selectedFinish, searchQuery]);

  // Featured flagship showcases
  const flagshipPanels = useMemo(() => {
    return ALL_WALL_PANELS.filter((p) => p.isFeatured || p.bestseller).slice(0, 4);
  }, []);

  // Calculator helper
  const requiredBoxes = activeInspectorPanel
    ? Math.ceil(sqftInput / activeInspectorPanel.boxCoverageSqFt)
    : 0;
  const estimatedCost = activeInspectorPanel
    ? requiredBoxes * activeInspectorPanel.boxPacking * activeInspectorPanel.pricePerPiece
    : 0;

  return (
    <div ref={pageContainerRef} className="relative w-full bg-stone-950 text-stone-100 selection:bg-amber-500 selection:text-stone-950">
      
      {/* ───────────────────────────────────────────────────────────── */}
      {/* 1. ARCHITECTURAL 3D HERO SECTION (SCROLL-DRIVEN FAN SPREAD)   */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section
        ref={heroSectionRef}
        onMouseMove={handleHeroMouseMove}
        className="relative pt-12 pb-20 sm:pt-16 sm:pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-stone-800/80 bg-gradient-to-b from-stone-950 via-stone-900/60 to-stone-950"
      >
        {/* Dynamic Architectural Cursor Light Sheen */}
        <div
          ref={spotlightRef}
          className="absolute w-[400px] h-[400px] rounded-full bg-amber-500/10 blur-[100px] pointer-events-none transition-transform duration-75 ease-out"
          style={{ transform: 'translate(40vw, 15vh)' }}
        />

        <div className="relative max-w-7xl mx-auto flex flex-col items-center text-center z-10">
          
          {/* Top Breadcrumb & Status Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs uppercase tracking-wider font-semibold mb-5 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>Direct Mill Catalog • Goals Floors Universe</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white max-w-4xl leading-[1.1]">
            Architectural Wall Panels{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500">
              at Factory Direct Rates.
            </span>
          </h1>

          <p className="mt-4 text-sm sm:text-base text-stone-300 max-w-2xl font-light leading-relaxed">
            Explore 24+ high-definition textures across the <strong>Primo Series</strong> (Classic Wood & Warm Neutrals) and <strong>Elite Series</strong> (High-Gloss Italian Statuario, Gold Floral & Metallic Sheen). 100% waterproof and moisture-sealing.
          </p>

          {/* Quick Collection Nav Bar */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                setSelectedCollection('all');
                setSelectedFinish('all');
              }}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
                selectedCollection === 'all'
                  ? 'bg-amber-400 text-black shadow-lg shadow-amber-500/20 scale-105'
                  : 'bg-stone-900 border border-stone-800 text-stone-300 hover:border-stone-700 hover:text-white'
              }`}
            >
              All Panels (24 Colors)
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedCollection('primo');
                setSelectedFinish('all');
              }}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                selectedCollection === 'primo'
                  ? 'bg-amber-400 text-black shadow-lg shadow-amber-500/20 scale-105'
                  : 'bg-stone-900 border border-stone-800 text-stone-300 hover:border-amber-400/40 hover:text-white'
              }`}
            >
              <span>Primo Panels</span>
              <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-stone-950/40">
                ₹499 / PC
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedCollection('elite');
                setSelectedFinish('all');
              }}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                selectedCollection === 'elite'
                  ? 'bg-amber-400 text-black shadow-lg shadow-amber-500/20 scale-105'
                  : 'bg-stone-900 border border-stone-800 text-stone-300 hover:border-amber-400/40 hover:text-white'
              }`}
            >
              <span>Elite Panels</span>
              <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-stone-950/40">
                ₹549 / PC
              </span>
            </button>
          </div>

          {/* 3D Floating Fan of Flagship Panels */}
          <div
            ref={heroFanDeckRef}
            className="relative mt-12 w-full max-w-4xl h-64 sm:h-80 flex items-center justify-center pointer-events-none"
          >
            {flagshipPanels.slice(0, 5).map((panel, idx) => (
              <div
                key={`fan-${panel.id}`}
                ref={(el) => {
                  heroPanelRefs.current[idx] = el;
                }}
                className="absolute w-36 sm:w-48 h-56 sm:h-72 rounded-2xl overflow-hidden border-2 border-white/20 bg-stone-900 shadow-[0_20px_45px_rgba(0,0,0,0.9)] will-change-transform pointer-events-auto hover:border-amber-400 hover:scale-110 hover:z-30 transition-all cursor-pointer"
                onClick={() => setActiveInspectorPanel(panel)}
                title={`Click to inspect ${panel.name}`}
              >
                <Image
                  src={panel.imageUrl}
                  alt={panel.name}
                  fill
                  sizes="192px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 inset-x-3 text-left">
                  <span className="text-[10px] font-bold text-amber-400">
                    {panel.code}
                  </span>
                  <p className="text-xs font-bold text-white truncate">{panel.colorName}</p>
                  <p className="text-[10px] text-stone-300">₹{panel.pricePerPiece} / PC</p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-xs text-stone-400 mt-2">
            ↓ Scroll down to explore interactive textures, color swatches & factory wholesale calculator
          </p>

        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 2. COLLECTION COMPARISON BANNER                               */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {WALL_PANEL_COLLECTIONS.map((col) => {
            const isSelected = selectedCollection === col.id;
            return (
              <div
                key={col.id}
                onClick={() => setSelectedCollection(col.id)}
                className={`group relative rounded-3xl p-6 sm:p-8 border transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? 'bg-gradient-to-br from-amber-500/15 via-stone-900 to-stone-950 border-amber-400 shadow-2xl shadow-amber-500/10'
                    : 'bg-stone-900/70 border-stone-800 hover:border-amber-500/40 hover:bg-stone-900'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-stone-800 text-stone-300 text-[10px] uppercase tracking-wider font-medium mb-2">
                      <span>{col.thickness}</span>
                      <span>•</span>
                      <span>{col.width}</span>
                    </div>
                    <h3 className="text-2xl font-black text-white group-hover:text-amber-300 transition-colors">
                      {col.name}
                    </h3>
                    <p className="text-xs text-amber-400/90 font-medium mt-0.5">{col.tagline}</p>
                    <p className="text-xs text-stone-300 font-light mt-3 leading-relaxed max-w-md">
                      {col.description}
                    </p>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <span className="text-xs text-stone-400 block">Factory Rate</span>
                    <span className="text-xl sm:text-2xl font-black text-amber-400">
                      {col.priceStarting}
                    </span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-stone-800/80 flex items-center justify-between">
                  <span className="text-xs text-stone-400">
                    {col.count} Full Color Variants Available
                  </span>
                  <span className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1 ${
                    isSelected ? 'text-amber-400' : 'text-stone-400 group-hover:text-white'
                  }`}>
                    {isSelected ? 'Currently Viewing ✓' : 'Filter This Collection →'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 3. PINNED / HIGHLIGHT SPOTLIGHT OF BESTSELLERS               */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section
        ref={flagshipSectionRef}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-t border-stone-800/60"
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
          <div>
            <span className="text-xs uppercase tracking-wider text-amber-400 font-bold">
              Architectural Spotlight
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-0.5">
              Flagship Bestsellers Across India
            </h2>
          </div>
          <span className="text-xs text-stone-400">
            Click any panel to test in 3D Texture Inspector
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {flagshipPanels.map((panel, idx) => (
            <div
              key={`flagship-${panel.id}`}
              ref={(el) => {
                flagshipCardsRef.current[idx] = el;
              }}
              onClick={() => setActiveInspectorPanel(panel)}
              className="group relative rounded-2xl overflow-hidden bg-stone-900 border border-stone-800 hover:border-amber-400 p-3.5 transition-all duration-300 shadow-xl cursor-pointer flex flex-col justify-between"
            >
              <div className="relative aspect-[4/5] w-full rounded-xl overflow-hidden bg-stone-950">
                <Image
                  src={panel.imageUrl}
                  alt={panel.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2.5 left-2.5 bg-black/75 backdrop-blur-md px-2 py-0.5 rounded text-[10px] text-amber-400 font-bold border border-white/10">
                  {panel.code}
                </div>
                <div className="absolute top-2.5 right-2.5 bg-amber-500 text-stone-950 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider">
                  {panel.badge}
                </div>
                <div className="absolute bottom-2 inset-x-2 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-2 rounded-b-lg flex items-center justify-between">
                  <span className="text-[11px] text-stone-200 font-medium">
                    {panel.dimensions.split(' ')[0]}
                  </span>
                  <span className="text-xs font-bold text-amber-400">
                    ₹{panel.pricePerPiece} / PC
                  </span>
                </div>
              </div>

              <div className="mt-3">
                <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors truncate">
                  {panel.name}
                </h4>
                <p className="text-xs text-stone-400 mt-0.5 flex items-center gap-1.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full border border-white/20 inline-block flex-shrink-0"
                    style={{ backgroundColor: panel.colorSwatch }}
                  />
                  <span className="truncate">{panel.colorName}</span>
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-stone-800/80 flex items-center justify-between text-[11px]">
                <span className="text-stone-400 font-medium">₹{panel.pricePerSqFt}/sq.ft</span>
                <span className="text-amber-400 font-semibold group-hover:underline">
                  Inspect 3D →
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 4. COMPREHENSIVE FILTER & PRODUCT GRID (ALL 24 COLORS)         */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-stone-800">
        
        {/* Filter & Search Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-stone-800">
          
          {/* Finish Type Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
            {[
              { id: 'all', label: 'All Finishes' },
              { id: 'Italian Marble', label: 'Italian Marble' },
              { id: 'Wood Grain', label: 'Wood Grain' },
              { id: 'Metallic', label: 'Metallic' },
              { id: 'Designer Floral', label: 'Floral Relief' },
              { id: 'Fabric Weave', label: 'Fabric Weave' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedFinish(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedFinish === tab.id
                    ? 'bg-stone-100 text-stone-950 shadow'
                    : 'bg-stone-900 text-stone-400 hover:text-white border border-stone-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Box & Counter */}
          <div className="flex items-center gap-3">
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search code (e.g. GF-405, Statuario)..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-stone-900 border border-stone-700 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-400"
              />
              <svg
                className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <span className="text-xs text-stone-400 whitespace-nowrap">
              Showing <span className="text-amber-400 font-bold">{filteredPanels.length}</span> panels
            </span>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredPanels.map((panel) => (
            <div
              key={panel.id}
              className="group relative rounded-2xl bg-stone-900/90 border border-stone-800 hover:border-amber-500/50 p-4 transition-all duration-300 flex flex-col justify-between shadow-lg hover:shadow-2xl hover:shadow-black"
            >
              <div>
                {/* Image Container with Hover Zoom */}
                <div
                  className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-stone-950 cursor-pointer border border-stone-800/80"
                  onClick={() => setActiveInspectorPanel(panel)}
                >
                  <Image
                    src={panel.imageUrl}
                    alt={panel.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                  {/* Top Left Code Pill */}
                  <div className="absolute top-2.5 left-2.5 bg-black/80 backdrop-blur-md px-2.5 py-0.5 rounded-md text-[11px] text-amber-400 font-bold border border-white/10">
                    {panel.code}
                  </div>

                  {/* Collection Badge */}
                  <div className="absolute top-2.5 right-2.5 bg-stone-900/90 border border-white/10 px-2 py-0.5 rounded text-[10px] text-stone-300 font-medium">
                    {panel.collectionLabel}
                  </div>

                  {/* Bottom Bar overlay */}
                  <div className="absolute bottom-2.5 inset-x-2.5 flex items-center justify-between text-[11px] text-white">
                    <span className="font-medium bg-black/60 px-2 py-0.5 rounded">
                      {panel.dimensions.split(' ')[0]}
                    </span>
                    <span className="font-bold text-amber-400 bg-black/60 px-2 py-0.5 rounded">
                      ₹{panel.pricePerPiece} / PC
                    </span>
                  </div>
                </div>

                {/* Information */}
                <div className="mt-3.5 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-white/30 flex-shrink-0 shadow-sm"
                      style={{ backgroundColor: panel.colorSwatch }}
                      title={`Color: ${panel.colorName}`}
                    />
                    <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors truncate">
                      {panel.name}
                    </h3>
                  </div>

                  <p className="text-xs text-stone-400 font-light line-clamp-2 leading-relaxed">
                    {panel.description}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-stone-800/80 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveInspectorPanel(panel)}
                  className="flex-1 py-2 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold text-center transition-colors cursor-pointer"
                >
                  Inspect & Specs
                </button>

                <a
                  href={`https://wa.me/919999999999?text=Hi%2C%20I%20want%20to%20order%20samples%20or%20bulk%20quote%20for%20${panel.code}%20(${panel.name})`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shadow"
                  title="Inquire on WhatsApp"
                >
                  <span>RFQ</span>
                  <span>↗</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {filteredPanels.length === 0 && (
          <div className="text-center py-16 bg-stone-900/40 rounded-3xl border border-stone-800 my-8">
            <p className="text-stone-400 text-sm">No panels found matching your criteria.</p>
            <button
              type="button"
              onClick={() => {
                setSelectedCollection('all');
                setSelectedFinish('all');
                setSearchQuery('');
              }}
              className="mt-3 text-xs text-amber-400 underline font-bold cursor-pointer"
            >
              Reset all filters
            </button>
          </div>
        )}
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 5. INTERACTIVE TEXTURE & SPECIFICATION INSPECTOR MODAL        */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeInspectorPanel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md">
          <div className="relative max-w-4xl w-full max-h-[92vh] overflow-y-auto rounded-3xl bg-stone-900 border border-amber-500/40 p-5 sm:p-8 shadow-2xl text-stone-100 flex flex-col">
            
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setActiveInspectorPanel(null)}
              className="absolute top-4 right-4 text-stone-400 hover:text-white text-xl p-2 cursor-pointer z-20"
              aria-label="Close Inspector"
            >
              ✕
            </button>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: Texture Preview with Lighting Simulation */}
              <div className="md:col-span-6 space-y-3">
                <div className={`relative aspect-[3/4] w-full rounded-2xl overflow-hidden border border-stone-700 bg-stone-950 transition-all duration-500 ${
                  lightMode === 'warm'
                    ? 'brightness-105 sepia-[0.2]'
                    : lightMode === 'cool'
                    ? 'brightness-105 hue-rotate-15'
                    : 'brightness-100'
                }`}>
                  <Image
                    src={activeInspectorPanel.imageUrl}
                    alt={activeInspectorPanel.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-md px-3 py-1 rounded-full text-xs text-amber-400 font-bold border border-white/10">
                    {activeInspectorPanel.code}
                  </div>
                </div>

                {/* Lighting Simulation Buttons */}
                <div className="p-3 rounded-xl bg-stone-950/80 border border-stone-800 flex items-center justify-between">
                  <span className="text-[11px] text-stone-400 font-medium">Architectural Lighting:</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setLightMode('warm')}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors ${
                        lightMode === 'warm'
                          ? 'bg-amber-500/30 text-amber-300 border border-amber-400'
                          : 'text-stone-400 hover:text-white'
                      }`}
                    >
                      Warm (3000K)
                    </button>
                    <button
                      type="button"
                      onClick={() => setLightMode('natural')}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors ${
                        lightMode === 'natural'
                          ? 'bg-amber-500/30 text-amber-300 border border-amber-400'
                          : 'text-stone-400 hover:text-white'
                      }`}
                    >
                      Daylight (4000K)
                    </button>
                    <button
                      type="button"
                      onClick={() => setLightMode('cool')}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors ${
                        lightMode === 'cool'
                          ? 'bg-amber-500/30 text-amber-300 border border-amber-400'
                          : 'text-stone-400 hover:text-white'
                      }`}
                    >
                      Cool (6500K)
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: Architectural Specifications & Box Calculator */}
              <div className="md:col-span-6 space-y-5">
                <div>
                  <span className="text-xs text-amber-400 uppercase tracking-wider font-bold">
                    {activeInspectorPanel.collectionLabel} • {activeInspectorPanel.finishType}
                  </span>
                  <h2 className="text-2xl font-black text-white mt-1">
                    {activeInspectorPanel.name}
                  </h2>
                  <p className="text-xs text-stone-300 mt-2 leading-relaxed">
                    {activeInspectorPanel.description}
                  </p>
                </div>

                {/* Technical Specs Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-stone-950 border border-stone-800">
                    <span className="text-stone-500 block text-[10px]">Dimensions</span>
                    <span className="text-stone-200 font-bold">{activeInspectorPanel.dimensions}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-stone-950 border border-stone-800">
                    <span className="text-stone-500 block text-[10px]">Thickness Profile</span>
                    <span className="text-stone-200 font-bold">{activeInspectorPanel.thicknessMm} MM Seamless</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-stone-950 border border-stone-800">
                    <span className="text-stone-500 block text-[10px]">Coverage / Piece</span>
                    <span className="text-stone-200 font-bold">9.5 Sq. Ft</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-stone-950 border border-stone-800">
                    <span className="text-stone-500 block text-[10px]">Box Packing</span>
                    <span className="text-stone-200 font-bold">{activeInspectorPanel.boxPacking} PCS / Box (95 Sq.ft)</span>
                  </div>
                </div>

                {/* Wholesale Quantity & Cost Estimator */}
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3">
                  <span className="text-xs font-bold text-amber-300 block uppercase tracking-wider">
                    Instant Mill Box Calculator
                  </span>
                  <div>
                    <label className="text-[11px] text-stone-300 block mb-1">
                      Enter Approximate Wall Area (Sq.Ft):
                    </label>
                    <input
                      type="number"
                      min={50}
                      step={25}
                      value={sqftInput}
                      onChange={(e) => setSqftInput(Math.max(10, parseInt(e.target.value) || 0))}
                      className="w-full px-3 py-1.5 rounded-lg bg-stone-950 border border-stone-700 text-xs text-white focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-amber-500/20">
                    <div>
                      <span className="text-stone-400 text-[10px] block">Boxes Needed:</span>
                      <span className="font-bold text-white">{requiredBoxes} Boxes ({requiredBoxes * activeInspectorPanel.boxPacking} Pcs)</span>
                    </div>
                    <div className="text-right">
                      <span className="text-stone-400 text-[10px] block">Estimated Wholesale Total:</span>
                      <span className="text-base font-black text-amber-400">
                        ₹{estimatedCost.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex items-center gap-3 pt-2">
                  <a
                    href={`https://wa.me/919999999999?text=Hi%20Wholesaleji%2C%20I%20am%20interested%20in%20${activeInspectorPanel.code}%20(${activeInspectorPanel.name})%20for%20approx%20${sqftInput}%20sqft%20(${requiredBoxes}%20boxes).%20Please%20share%20contractor%20dispatch%20rates.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-stone-950 font-black text-xs uppercase tracking-wider text-center hover:brightness-110 shadow-lg shadow-amber-500/20 cursor-pointer"
                  >
                    Lock Direct Mill Rate on WhatsApp →
                  </a>
                </div>

              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
