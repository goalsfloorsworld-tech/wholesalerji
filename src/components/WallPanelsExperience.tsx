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
  const storyRefs = useRef<(HTMLDivElement | null)[]>([]);
  const heroRef = useRef<HTMLDivElement | null>(null);
  const introRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (initialCollection === 'primo' || initialCollection === 'elite') {
      setSelectedCollection(initialCollection);
    }
  }, [initialCollection]);

  // GSAP Animations setup
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Intro fade up
      if (introRef.current) {
        gsap.fromTo(
          introRef.current.children,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            stagger: 0.2,
            scrollTrigger: {
              trigger: introRef.current,
              start: 'top 80%',
            },
          }
        );
      }

      // Story split screens
      storyRefs.current.forEach((el) => {
        if (!el) return;
        const img = el.querySelector('.story-img');
        const text = el.querySelector('.story-text');
        
        gsap.fromTo(
          img,
          { opacity: 0, scale: 0.95, clipPath: 'inset(10% 10% 10% 10%)' },
          {
            opacity: 1,
            scale: 1,
            clipPath: 'inset(0% 0% 0% 0%)',
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 75%',
            },
          }
        );

        gsap.fromTo(
          text,
          { opacity: 0, x: 30 },
          {
            opacity: 1,
            x: 0,
            duration: 1,
            delay: 0.2,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 75%',
            },
          }
        );
      });
    }, pageContainerRef);

    return () => ctx.revert();
  }, []);

  // Filter Logic
  const filteredPanels = useMemo(() => {
    return ALL_WALL_PANELS.filter((p) => {
      if (selectedCollection !== 'all' && p.collection !== selectedCollection) return false;
      if (selectedFinish !== 'all' && p.finishType !== selectedFinish) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesCode = p.code.toLowerCase().includes(q);
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesColor = p.colorName.toLowerCase().includes(q);
        const matchesFinish = p.finishType.toLowerCase().includes(q);
        if (!matchesCode && !matchesName && !matchesColor && !matchesFinish) return false;
      }
      return true;
    });
  }, [selectedCollection, selectedFinish, searchQuery]);

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
      
      {/* 1. HERO */}
      <section ref={heroRef} className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-stone-950">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1776780203/Primo_GF-301_Pvc_Panel_Goals_Floors.png"
            alt="Architectural Wall Panels Installation"
            fill
            className="object-cover opacity-30 mix-blend-luminosity"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-stone-950/20 via-stone-950/60 to-stone-950" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center mt-16">
          <span className="text-amber-500 tracking-[0.2em] uppercase text-xs sm:text-sm font-semibold mb-6 block">WholesalerJi Architectural Materials</span>
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter leading-[1.05] max-w-5xl">
            Wholesale Wall Panels,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-stone-300 via-white to-stone-400 font-serif italic font-light">Made for Real Projects.</span>
          </h1>
          <p className="mt-8 text-base sm:text-lg text-stone-400 max-w-2xl mx-auto font-light leading-relaxed">
            Premium architectural wall panels for architects, contractors, and project buyers. Pan-India supply at pure direct mill wholesale rates.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
            <a href="#collections" className="px-8 py-4 rounded-full bg-white text-stone-950 font-bold text-sm tracking-wider uppercase hover:bg-stone-200 transition-colors">
              Explore Wall Panels
            </a>
            <a href="#rfq" className="px-8 py-4 rounded-full border border-stone-700 bg-stone-900/50 text-white font-bold text-sm tracking-wider uppercase hover:border-amber-500 hover:text-amber-500 transition-colors backdrop-blur-md">
              Request Wholesale Pricing
            </a>
          </div>
        </div>
      </section>

      {/* 2. MATERIAL SHOWCASE INTRO */}
      <section ref={introRef} className="py-24 sm:py-32 bg-stone-950 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-5xl font-light tracking-tight text-white leading-tight">
            More than a wall.<br />
            <span className="font-bold text-amber-500">A material system for the space.</span>
          </h2>
        </div>
      </section>

      {/* 3. FEATURED PANEL STORY EXPERIENCE */}
      <section className="bg-stone-950 relative z-10">
        {flagshipPanels.map((panel, idx) => {
          const isEven = idx % 2 === 0;
          return (
            <div 
              key={panel.id} 
              ref={(el) => { storyRefs.current[idx] = el; }}
              className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} min-h-[80vh] border-t border-stone-800/50`}
            >
              {/* Image Half */}
              <div className="w-full md:w-1/2 relative min-h-[50vh] md:min-h-full story-img">
                <Image
                  src={panel.imageUrl}
                  alt={panel.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/20" />
              </div>
              
              {/* Text Half */}
              <div className="w-full md:w-1/2 flex items-center justify-center p-8 sm:p-16 lg:p-24 bg-stone-950 story-text">
                <div className="max-w-md w-full">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="px-3 py-1 bg-stone-900 border border-stone-800 rounded-full text-[10px] uppercase tracking-widest text-amber-500 font-bold">
                      {panel.collectionLabel}
                    </span>
                    <span className="text-[10px] uppercase tracking-widest text-stone-500 font-semibold">
                      {panel.code}
                    </span>
                  </div>
                  
                  <h3 className="text-3xl sm:text-4xl font-black text-white mb-2 leading-tight">
                    {panel.name}
                  </h3>
                  <p className="text-sm font-semibold text-stone-400 mb-6 uppercase tracking-wider">
                    {panel.finishType} • {panel.colorName}
                  </p>
                  
                  <p className="text-stone-300 font-light leading-relaxed mb-8">
                    {panel.description}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-xs mb-10 pb-8 border-b border-stone-800/60">
                    <div>
                      <span className="block text-stone-500 mb-1">Dimensions</span>
                      <span className="font-bold text-stone-200">{panel.dimensions}</span>
                    </div>
                    <div>
                      <span className="block text-stone-500 mb-1">Thickness</span>
                      <span className="font-bold text-stone-200">{panel.thicknessMm} MM</span>
                    </div>
                    <div>
                      <span className="block text-stone-500 mb-1">Box Packing</span>
                      <span className="font-bold text-stone-200">{panel.boxPacking} PCS</span>
                    </div>
                    <div>
                      <span className="block text-stone-500 mb-1">Wholesale Rate</span>
                      <span className="font-bold text-amber-500">₹{panel.pricePerPiece} / PC</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button 
                      onClick={() => setActiveInspectorPanel(panel)}
                      className="px-6 py-3 bg-white text-stone-950 text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-stone-200 transition-colors w-full sm:w-auto"
                    >
                      View Specs
                    </button>
                    <a 
                      href="#rfq"
                      className="px-6 py-3 border border-stone-700 text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:border-amber-500 hover:text-amber-500 transition-colors text-center w-full sm:w-auto"
                    >
                      Request Quote
                    </a>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* 4. COLLECTION TRANSITION & 5. MATERIAL CATEGORIES */}
      <section id="collections" className="py-24 px-4 sm:px-6 lg:px-8 bg-stone-900 border-t border-stone-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-amber-500 text-xs uppercase tracking-widest font-bold block mb-2">Explore the Catalog</span>
            <h2 className="text-4xl font-black text-white">Collections & Materials</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* COLLECTIONS (Left side, takes more space) */}
            <div className="lg:col-span-8">
              <h3 className="text-sm text-stone-400 uppercase tracking-widest mb-6 font-semibold border-b border-stone-800 pb-4">Architectural Collections</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { name: 'Primo Series', href: '/wall-panels/primo', desc: 'Classic Wood & Warm Neutrals', img: 'https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1776780203/Primo_GF-301_Pvc_Panel_Goals_Floors.png' },
                  { name: 'Elite Series', href: '/wall-panels/elite', desc: 'UV High-Gloss Marble', img: 'https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1776777064/GF-401_Premium_Pvc_Panel_In_Gurgaon.png' },
                  { name: 'Primo Fluted', href: '/wall-panels/primo-fluted', desc: 'WPC Architectural Louvers', img: 'https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/Fluted_Panel_FP_-_701.png' },
                  { name: 'Elite Fluted', href: '/wall-panels/elite-fluted', desc: 'Premium WPC Texture', img: 'https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/Fluted_Panel_FP_-_714.png' }
                ].map(col => (
                  <a key={col.href} href={col.href} className="group relative h-48 rounded-2xl overflow-hidden bg-stone-950 border border-stone-800 hover:border-amber-500 transition-colors block">
                    <Image src={col.img} alt={col.name} fill sizes="(max-width: 640px) 100vw, 50vw" className="object-cover opacity-50 group-hover:opacity-70 transition-opacity" />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h4 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors">{col.name}</h4>
                      <p className="text-xs text-stone-300 mt-1">{col.desc}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
            
            {/* MATERIAL CATEGORIES (Right side) */}
            <div className="lg:col-span-4">
              <h3 className="text-sm text-stone-400 uppercase tracking-widest mb-6 font-semibold border-b border-stone-800 pb-4">Core Materials</h3>
              <div className="flex flex-col gap-4">
                {[
                  { name: 'WPC Louvers', href: '/wall-panels/wpc', tag: 'Exterior/Interior Grade' },
                  { name: 'PVC Marble', href: '/wall-panels/pvc', tag: 'High-Gloss Finish' },
                  { name: 'Charcoal Panels', href: '/wall-panels/charcoal', tag: 'Acoustic Fluted' }
                ].map(mat => (
                  <a key={mat.href} href={mat.href} className="flex items-center justify-between p-6 rounded-2xl bg-stone-950 border border-stone-800 hover:border-amber-500 group transition-colors">
                    <div>
                      <h4 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">{mat.name}</h4>
                      <p className="text-[10px] text-stone-400 uppercase tracking-wider mt-1">{mat.tag}</p>
                    </div>
                    <span className="text-stone-600 group-hover:text-amber-500 transform group-hover:translate-x-1 transition-all">→</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. COMPACT FULL CATALOG */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-stone-950 border-t border-stone-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">Complete Catalog</h2>
              <p className="text-stone-400 text-sm mt-2">Filter and inspect our full range of 24+ textures.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <select 
                value={selectedCollection}
                onChange={(e) => setSelectedCollection(e.target.value)}
                className="bg-stone-900 border border-stone-700 text-xs text-white rounded-lg px-3 py-2 focus:border-amber-500 outline-none w-full sm:w-auto"
              >
                <option value="all">All Collections</option>
                {WALL_PANEL_COLLECTIONS.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <select 
                value={selectedFinish}
                onChange={(e) => setSelectedFinish(e.target.value)}
                className="bg-stone-900 border border-stone-700 text-xs text-white rounded-lg px-3 py-2 focus:border-amber-500 outline-none w-full sm:w-auto"
              >
                <option value="all">All Finishes</option>
                <option value="Italian Marble">Italian Marble</option>
                <option value="Wood Grain">Wood Grain</option>
                <option value="Metallic">Metallic</option>
                <option value="Designer Floral">Designer Floral</option>
                <option value="Fabric Weave">Fabric Weave</option>
              </select>
            </div>
          </div>

          {/* Horizontal / Wrapped Compact Grid */}
          <div className="flex flex-wrap gap-4">
            {filteredPanels.map((panel) => (
              <div 
                key={panel.id} 
                onClick={() => setActiveInspectorPanel(panel)}
                className="group flex flex-col w-[150px] sm:w-[180px] bg-stone-900 border border-stone-800 rounded-xl overflow-hidden hover:border-amber-500 transition-colors cursor-pointer"
              >
                <div className="relative aspect-square bg-stone-950">
                  <Image src={panel.imageUrl} alt={panel.name} fill sizes="180px" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-2 left-2 bg-black/70 backdrop-blur px-1.5 py-0.5 rounded text-[9px] text-amber-400 font-bold border border-white/10">
                    {panel.code}
                  </div>
                </div>
                <div className="p-3">
                  <h4 className="text-xs font-bold text-white truncate">{panel.name}</h4>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-[10px] text-stone-400">{panel.finishType}</span>
                    <span className="w-3 h-3 rounded-full border border-white/20" style={{backgroundColor: panel.colorSwatch}}></span>
                  </div>
                </div>
              </div>
            ))}
            {filteredPanels.length === 0 && (
              <div className="w-full text-center py-12 text-stone-500 text-sm border border-dashed border-stone-800 rounded-xl">
                No panels match these filters.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 7. B2B PROJECT USE CASES */}
      <section className="py-24 bg-stone-100 text-stone-950 px-4 border-t border-stone-300">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black mb-4">Engineered for Project Success</h2>
            <p className="text-stone-600 max-w-2xl mx-auto font-medium">We partner with professionals across the construction and design industry to deliver reliable, high-volume material supply.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Architects & Designers', desc: 'Premium specifications for residential and commercial interiors.' },
              { title: 'Contractors', desc: 'Reliable inventory, fast dispatch, and competitive bulk pricing for execution.' },
              { title: 'Dealers', desc: 'Wholesale procurement margins and repeat supply for your local market.' },
              { title: 'Project Buyers', desc: 'Coordinated direct-to-site delivery for large scale requirements.' }
            ].map(usecase => (
              <div key={usecase.title} className="bg-white p-8 rounded-2xl shadow-sm border border-stone-200 hover:shadow-lg transition-shadow">
                <h3 className="text-lg font-black text-stone-900 mb-3">{usecase.title}</h3>
                <p className="text-sm text-stone-600 leading-relaxed">{usecase.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. WHOLESALERJI DIFFERENCE */}
      <section className="py-24 bg-stone-900 text-white px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-black mb-16 text-center">The WholesalerJi Difference</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
            {[
              { num: '01', title: 'Factory Direct Sourcing', desc: 'Eliminate middlemen with pure wholesale rates directly from the mill.' },
              { num: '02', title: 'Project-Oriented Supply', desc: 'Scalable inventory capable of supplying massive commercial projects without delays.' },
              { num: '03', title: 'Curated Selection', desc: '24+ architect-approved textures and finishes crafted for modern aesthetics.' },
              { num: '04', title: 'Dedicated Support', desc: 'A streamlined enquiry flow ensures you get quotes and technical specs instantly.' }
            ].map(diff => (
              <div key={diff.num} className="relative pl-6">
                <span className="text-5xl font-black text-stone-800 absolute -top-6 -left-2 z-0 opacity-40">{diff.num}</span>
                <div className="relative z-10">
                  <h3 className="text-lg font-bold text-amber-500 mb-2">{diff.title}</h3>
                  <p className="text-sm text-stone-400 leading-relaxed">{diff.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. FINAL RFQ CTA */}
      <section id="rfq" className="py-32 bg-stone-950 px-4 text-center border-t border-stone-800 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-amber-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight mb-6">
            Planning a project?
          </h2>
          <p className="text-lg text-stone-400 font-light mb-10 max-w-xl mx-auto">
            Tell us what you're building and we'll help you shortlist the right wall panels at factory direct rates.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a 
              href="#rfq"
              className="px-8 py-4 rounded-full bg-white text-stone-950 font-bold text-sm tracking-wider uppercase hover:bg-stone-200 transition-colors"
            >
              Request Wholesale Pricing
            </a>
            <a 
              href="https://wa.me/919999999999?text=Hi%2C%20I%20have%20a%20project%20and%20want%20to%20discuss%20wall%20panel%20wholesale%20rates."
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 rounded-full border border-stone-700 bg-stone-900 text-white font-bold text-sm tracking-wider uppercase hover:border-amber-500 hover:text-amber-500 transition-colors"
            >
              Talk on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* INTERACTIVE TEXTURE & SPECIFICATION INSPECTOR MODAL */}
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
                      Warm
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
                      Daylight
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
                      Cool
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
                    href={`https://wa.me/919999999999?text=Hi%20WholesalerJi%2C%20I%20am%20interested%20in%20${activeInspectorPanel.code}%20(${activeInspectorPanel.name})%20for%20approx%20${sqftInput}%20sqft%20(${requiredBoxes}%20boxes).%20Please%20share%20contractor%20dispatch%20rates.`}
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
