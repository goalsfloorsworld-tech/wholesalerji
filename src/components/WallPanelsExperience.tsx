'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ALL_WALL_PANELS, PanelProduct } from '@/data/wallPanelsData';
import GetQuoteModal from '@/components/GetQuoteModal';
import { Phone, ArrowRight, X, FileText } from 'lucide-react';

interface WallPanelsExperienceProps {
  initialCollection?: string;
}

export default function WallPanelsExperience({ initialCollection = 'all' }: WallPanelsExperienceProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedCollection, setSelectedCollection] = useState<string>(initialCollection);
  const [activeInspectorPanel, setActiveInspectorPanel] = useState<PanelProduct | null>(null);
  const [sqftInput, setSqftInput] = useState<number>(500);
  const [lightMode, setLightMode] = useState<'warm' | 'natural' | 'cool'>('natural');
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  // GSAP Refs
  const pageContainerRef = useRef<HTMLDivElement | null>(null);
  const storyRefs = useRef<(HTMLDivElement | null)[]>([]);
  const heroRef = useRef<HTMLDivElement | null>(null);
  const introRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (initialCollection === 'primo' || initialCollection === 'elite') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
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
          { opacity: 0, scale: 0.9, y: 40 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
            },
          }
        );

        gsap.fromTo(
          text,
          { opacity: 0, x: el.classList.contains('md:flex-row-reverse') ? -30 : 30 },
          {
            opacity: 1,
            x: 0,
            duration: 1,
            delay: 0.2,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
            },
          }
        );
      });
    }, pageContainerRef);

    return () => ctx.revert();
  }, []);

  // Show 5 panels instead of 4
  const flagshipPanels = useMemo(() => {
    return ALL_WALL_PANELS.filter((p) => p.isFeatured || p.bestseller).slice(0, 5);
  }, []);

  // Calculator helper
  const requiredBoxes = activeInspectorPanel
    ? Math.ceil(sqftInput / activeInspectorPanel.boxCoverageSqFt)
    : 0;
  const estimatedCost = activeInspectorPanel
    ? requiredBoxes * activeInspectorPanel.boxPacking * activeInspectorPanel.pricePerPiece
    : 0;

  return (
    <div ref={pageContainerRef} className="relative w-full bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 selection:bg-amber-500 selection:text-stone-950 transition-colors">
      
      {/* 1. HERO */}
      <section ref={heroRef} className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-stone-100 dark:bg-stone-950 transition-colors">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1776780203/Primo_GF-301_Pvc_Panel_Goals_Floors.png"
            alt="Architectural Wall Panels Installation"
            fill
            sizes="100vw"
            className="object-cover opacity-20 dark:opacity-30 mix-blend-luminosity dark:mix-blend-normal"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-stone-50/60 via-stone-50/80 to-stone-50 dark:from-stone-950/20 dark:via-stone-950/60 dark:to-stone-950" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center mt-16">
          <span className="text-amber-600 dark:text-amber-500 tracking-[0.2em] uppercase text-xs sm:text-sm font-semibold mb-6 block">WholesalerJi Architectural Materials</span>
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-stone-900 dark:text-white tracking-tighter leading-[1.05] max-w-5xl">
            Wholesale Wall Panels,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-stone-500 via-stone-800 to-stone-500 dark:from-stone-300 dark:via-white dark:to-stone-400 font-serif italic font-light">Made for Real Projects.</span>
          </h1>
          <p className="mt-8 text-base sm:text-lg text-stone-600 dark:text-stone-400 max-w-2xl mx-auto font-light leading-relaxed">
            Premium architectural wall panels for architects, contractors, and project buyers. Dispatched pan-India from our Gurgaon warehouse at pure direct mill wholesale rates.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
            <a href="#collections" className="px-8 py-4 rounded-full bg-stone-900 dark:bg-white text-white dark:text-stone-950 font-bold text-sm tracking-wider uppercase hover:bg-stone-700 dark:hover:bg-stone-200 transition-colors">
              Explore Wall Panels
            </a>
            <a href="#rfq" className="px-8 py-4 rounded-full border border-stone-300 dark:border-stone-700 bg-white/50 dark:bg-stone-900/50 text-stone-800 dark:text-white font-bold text-sm tracking-wider uppercase hover:border-amber-600 dark:hover:border-amber-500 hover:text-amber-600 dark:hover:text-amber-500 transition-colors backdrop-blur-md">
              Request Wholesale Pricing
            </a>
          </div>
        </div>
      </section>

      {/* 2. MATERIAL SHOWCASE INTRO */}
      <section ref={introRef} className="py-24 bg-stone-50 dark:bg-stone-950 px-4 transition-colors">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-5xl font-light tracking-tight text-stone-800 dark:text-white leading-tight">
            More than a wall.<br />
            <span className="font-bold text-amber-600 dark:text-amber-500">A material system for the space.</span>
          </h2>
        </div>
      </section>

      {/* 3. FEATURED PANEL STORY EXPERIENCE (ALTERNATING) */}
      <section className="bg-stone-50 dark:bg-stone-950 relative z-10 overflow-hidden transition-colors py-12 pb-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24 sm:space-y-32">
          {flagshipPanels.map((panel, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <div 
                key={panel.id} 
                ref={(el) => { storyRefs.current[idx] = el; }}
                className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-12 lg:gap-20`}
              >
                {/* Image Half with Warm Light Glow */}
                <div className="w-full md:w-1/2 relative flex justify-center story-img perspective-1000">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-amber-500/20 dark:bg-amber-500/15 blur-[60px] rounded-full pointer-events-none z-0" />
                  
                  <div 
                    className="panel-floating-img relative z-10 w-full max-w-[210px] sm:max-w-[240px] aspect-[1/2.2] rounded-2xl overflow-hidden shadow-2xl border border-stone-200 dark:border-stone-800 cursor-pointer hover:shadow-amber-500/20 transition-shadow animate-float-panel"
                    style={{ animationDelay: `-${idx * 1.5}s` }}
                    onClick={() => setActiveInspectorPanel(panel)}
                  >
                    <Image
                      src={panel.imageUrl}
                      alt={panel.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 250px"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/10 hover:bg-transparent transition-colors" />
                    <div className="absolute bottom-4 left-4">
                      <span className="inline-block px-3 py-1 bg-black/80 backdrop-blur-md rounded-md text-[11px] text-amber-400 font-bold border border-white/10">
                        {panel.code}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Text Half */}
                <div className="w-full md:w-1/2 story-text">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-stone-200 dark:bg-stone-900 border border-stone-300 dark:border-stone-800 rounded-full text-[10px] uppercase tracking-widest text-amber-600 dark:text-amber-500 font-bold">
                      {panel.collectionLabel}
                    </span>
                    <span className="text-[10px] uppercase tracking-widest text-stone-500 dark:text-stone-400 font-semibold">
                      {panel.finishType}
                    </span>
                  </div>
                  
                  <h3 className="text-3xl sm:text-4xl font-black text-stone-900 dark:text-white mb-4 leading-tight">
                    {panel.name}
                  </h3>
                  
                  <p className="text-stone-600 dark:text-stone-300 font-light leading-relaxed mb-8">
                    {panel.description}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-xs mb-8 pb-8 border-b border-stone-200 dark:border-stone-800/60">
                    <div>
                      <span className="block text-stone-500 mb-1">Dimensions</span>
                      <span className="font-bold text-stone-900 dark:text-stone-200">{panel.dimensions}</span>
                    </div>
                    <div>
                      <span className="block text-stone-500 mb-1">Thickness</span>
                      <span className="font-bold text-stone-900 dark:text-stone-200">{panel.thicknessMm} MM</span>
                    </div>
                    <div>
                      <span className="block text-stone-500 mb-1">Box Packing</span>
                      <span className="font-bold text-stone-900 dark:text-stone-200">{panel.boxPacking} PCS</span>
                    </div>
                    <div>
                      <span className="block text-stone-500 mb-1">Wholesale Rate</span>
                      <span className="font-bold text-amber-600 dark:text-amber-500">₹{panel.pricePerPiece} / PC</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button 
                      onClick={() => setActiveInspectorPanel(panel)}
                      className="px-6 py-3 bg-stone-900 dark:bg-white text-white dark:text-stone-950 text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-stone-700 dark:hover:bg-stone-200 transition-colors text-center w-full sm:w-auto"
                    >
                      View Specs
                    </button>
                    <a 
                      href="#rfq"
                      className="px-6 py-3 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:border-amber-600 dark:hover:border-amber-500 hover:text-amber-600 dark:hover:text-amber-500 transition-colors text-center w-full sm:w-auto"
                    >
                      Request Quote
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. COLLECTION TRANSITION & 5. MATERIAL CATEGORIES */}
      <section id="collections" className="py-32 px-4 sm:px-6 lg:px-8 bg-stone-100 dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 transition-colors overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <span className="text-amber-600 dark:text-amber-500 text-xs uppercase tracking-[0.3em] font-bold block mb-3">Explore the Catalog</span>
            <h2 className="text-5xl md:text-6xl font-black text-stone-900 dark:text-white tracking-tight">Collections</h2>
          </div>
          
          {/* ARCHITECTURAL FLEX ACCORDION FOR COLLECTIONS */}
          <div className="flex flex-col md:flex-row h-[500px] gap-3 md:gap-4 mb-32">
            {[
              { name: 'Primo Series', href: '/wall-panels/primo', desc: 'Classic Wood & Warm Neutrals', img: 'https://res.cloudinary.com/def2qsxjg/image/upload/v1790874187/GF-302_Premium_Pvc_Panel_Primo_Series_in_living_room.jpg' },
              { name: 'Elite Series', href: '/wall-panels/elite', desc: 'UV High-Gloss Marble', img: 'https://res.cloudinary.com/def2qsxjg/image/upload/f_auto,q_auto/v1790908763/GF-401_installed_image_in_hall.png' },
              { name: 'Primo Fluted', href: '/wall-panels/primo-fluted', desc: 'WPC Architectural Louvers', img: 'https://res.cloudinary.com/def2qsxjg/image/upload/v1790929841/FP-702_installed_image_in_room.jpg' },
              { name: 'Elite Fluted', href: '/wall-panels/elite-fluted', desc: 'Premium WPC Texture', img: 'https://res.cloudinary.com/def2qsxjg/image/upload/v1791125624/charcoal_fluted_office_insitu.jpg' }
            ].map((col) => (
              <a 
                key={col.href} 
                href={col.href} 
                className="group relative flex-1 md:hover:flex-[3] transition-all duration-[800ms] ease-[cubic-bezier(0.25,1,0.5,1)] rounded-3xl overflow-hidden bg-stone-950 block"
              >
                <Image 
                  src={col.img} 
                  alt={col.name} 
                  fill 
                  sizes="(max-width: 768px) 100vw, 33vw" 
                  className="object-cover opacity-60 md:opacity-40 group-hover:opacity-100 group-hover:scale-105 transition-all duration-[800ms]" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                
                <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 flex flex-col justify-end">
                  <h3 className="text-2xl md:text-3xl font-black text-white mb-2 whitespace-nowrap transform md:-translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    {col.name}
                  </h3>
                  <p className="text-sm text-stone-300 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 whitespace-nowrap font-medium">
                    {col.desc}
                  </p>
                </div>
              </a>
            ))}
          </div>
          
          {/* MASSIVE TYPOGRAPHY ROWS FOR MATERIALS */}
          <div className="max-w-5xl mx-auto">
            <h2 className="text-xs text-stone-500 dark:text-stone-400 uppercase tracking-[0.3em] mb-10 font-bold text-center">Core Materials</h2>
            <div className="border-t-2 border-stone-300 dark:border-stone-800/80">
              {[
                { name: 'WPC Louvers', href: '/wall-panels/wpc', tag: 'Exterior/Interior Grade' },
                { name: 'PVC Marble', href: '/wall-panels/pvc', tag: 'High-Gloss Finish' },
                { name: 'Charcoal Panels', href: '/wall-panels/charcoal', tag: 'Acoustic Fluted' }
              ].map(mat => (
                <a 
                  key={mat.href} 
                  href={mat.href} 
                  className="group block border-b-2 border-stone-300 dark:border-stone-800/80 relative overflow-hidden"
                >
                  {/* Hover background wipe */}
                  <div className="absolute inset-0 bg-amber-500 transform origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] z-0" />
                  
                  <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between py-10 px-4 sm:px-8 gap-4">
                    <h3 className="text-4xl sm:text-5xl md:text-7xl font-black text-stone-900 dark:text-white group-hover:text-stone-950 transition-colors duration-300 tracking-tighter">
                      {mat.name}
                    </h3>
                    <div className="flex items-center gap-6 justify-between md:justify-end w-full md:w-auto">
                      <span className="text-xs sm:text-sm uppercase tracking-[0.2em] text-stone-500 group-hover:text-stone-800 transition-colors duration-300 font-bold text-right">
                        {mat.tag}
                      </span>
                      <span className="text-3xl sm:text-4xl text-stone-300 dark:text-stone-700 group-hover:text-stone-950 transition-colors duration-300 transform group-hover:translate-x-4">
                        →
                      </span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* B2B PROJECT USE CASES */}
      <section className="py-24 bg-white dark:bg-stone-100 text-stone-950 px-4 border-t border-stone-200 dark:border-stone-300 transition-colors">
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
              <div key={usecase.title} className="bg-stone-50 dark:bg-white p-8 rounded-2xl shadow-sm border border-stone-100 dark:border-stone-200 hover:shadow-md transition-shadow">
                <h3 className="text-lg font-black text-stone-900 mb-3">{usecase.title}</h3>
                <p className="text-sm text-stone-600 leading-relaxed">{usecase.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHOLESALERJI DIFFERENCE */}
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
                <span className="text-5xl font-black text-stone-800 absolute -top-6 -left-2 z-0 opacity-60 dark:opacity-40">{diff.num}</span>
                <div className="relative z-10">
                  <h3 className="text-lg font-bold text-amber-400 dark:text-amber-500 mb-2">{diff.title}</h3>
                  <p className="text-sm text-stone-300 dark:text-stone-400 leading-relaxed">{diff.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL RFQ CTA */}
      <section id="rfq" className="py-32 bg-stone-950 px-4 text-center border-t border-stone-800 relative overflow-hidden text-stone-100">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-amber-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-6">
            Planning a project?
          </h2>
          <p className="text-lg text-stone-400 font-light mb-10 max-w-xl mx-auto">
            Tell us what you&apos;re building and we&apos;ll help you shortlist the right wall panels at factory direct rates.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              type="button"
              onClick={() => setIsInquiryModalOpen(true)}
              className="px-8 py-4 rounded-full bg-white text-stone-950 font-bold text-sm tracking-wider uppercase hover:bg-stone-200 transition-colors cursor-pointer"
            >
              Request Wholesale Pricing
            </button>
          </div>
        </div>
      </section>

      {/* INTERACTIVE TEXTURE & SPECIFICATION INSPECTOR MODAL */}
      {activeInspectorPanel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 dark:bg-black/85 backdrop-blur-md">
          <div className="relative max-w-4xl w-full max-h-[92vh] overflow-y-auto rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-amber-500/40 p-5 sm:p-8 shadow-2xl text-stone-900 dark:text-stone-100 flex flex-col">
            
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setActiveInspectorPanel(null)}
              className="absolute top-4 right-4 text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white text-xl p-2 cursor-pointer z-20"
              aria-label="Close Inspector"
            >
              ✕
            </button>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              {/* Left Column: Texture Preview with Lighting Simulation */}
              <div className="md:col-span-6 space-y-3">
                <div className={`relative aspect-[3/4] w-full rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-700 bg-stone-100 dark:bg-stone-950 transition-all duration-500 ${
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
                  <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-md px-3 py-1 rounded-full text-xs text-amber-400 font-bold border border-white/10 shadow-sm">
                    {activeInspectorPanel.code}
                  </div>
                </div>

                {/* Lighting Simulation Buttons */}
                <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-950/80 border border-stone-200 dark:border-stone-800 flex items-center justify-between">
                  <span className="text-[11px] text-stone-600 dark:text-stone-400 font-medium">Architectural Lighting:</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setLightMode('warm')}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors ${
                        lightMode === 'warm'
                          ? 'bg-amber-100 dark:bg-amber-500/30 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-400'
                          : 'text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                      }`}
                    >
                      Warm
                    </button>
                    <button
                      type="button"
                      onClick={() => setLightMode('natural')}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors ${
                        lightMode === 'natural'
                          ? 'bg-amber-100 dark:bg-amber-500/30 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-400'
                          : 'text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                      }`}
                    >
                      Daylight
                    </button>
                    <button
                      type="button"
                      onClick={() => setLightMode('cool')}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors ${
                        lightMode === 'cool'
                          ? 'bg-amber-100 dark:bg-amber-500/30 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-400'
                          : 'text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
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
                  <span className="text-xs text-amber-600 dark:text-amber-400 uppercase tracking-wider font-bold">
                    {activeInspectorPanel.collectionLabel} • {activeInspectorPanel.finishType}
                  </span>
                  <h2 className="text-2xl font-black text-stone-900 dark:text-white mt-1">
                    {activeInspectorPanel.name}
                  </h2>
                  <p className="text-xs text-stone-600 dark:text-stone-300 mt-2 leading-relaxed">
                    {activeInspectorPanel.description}
                  </p>
                </div>

                {/* Technical Specs Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800">
                    <span className="text-stone-500 block text-[10px]">Dimensions</span>
                    <span className="text-stone-800 dark:text-stone-200 font-bold">{activeInspectorPanel.dimensions}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800">
                    <span className="text-stone-500 block text-[10px]">Thickness Profile</span>
                    <span className="text-stone-800 dark:text-stone-200 font-bold">{activeInspectorPanel.thicknessMm} MM Seamless</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800">
                    <span className="text-stone-500 block text-[10px]">Coverage / Piece</span>
                    <span className="text-stone-800 dark:text-stone-200 font-bold">9.5 Sq. Ft</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800">
                    <span className="text-stone-500 block text-[10px]">Box Packing</span>
                    <span className="text-stone-800 dark:text-stone-200 font-bold">{activeInspectorPanel.boxPacking} PCS / Box (95 Sq.ft)</span>
                  </div>
                </div>

                {/* Wholesale Quantity & Cost Estimator */}
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 space-y-3">
                  <span className="text-xs font-bold text-amber-700 dark:text-amber-300 block uppercase tracking-wider">
                    Instant Mill Box Calculator
                  </span>
                  <div>
                    <label className="text-[11px] text-stone-600 dark:text-stone-300 block mb-1">
                      Enter Approximate Wall Area (Sq.Ft):
                    </label>
                    <input
                      type="number"
                      min={50}
                      step={25}
                      value={sqftInput}
                      onChange={(e) => setSqftInput(Math.max(10, parseInt(e.target.value) || 0))}
                      className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-700 text-xs text-stone-900 dark:text-white focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-amber-200 dark:border-amber-500/20">
                    <div>
                      <span className="text-stone-500 dark:text-stone-400 text-[10px] block">Boxes Needed:</span>
                      <span className="font-bold text-stone-900 dark:text-white">{requiredBoxes} Boxes ({requiredBoxes * activeInspectorPanel.boxPacking} Pcs)</span>
                    </div>
                    <div className="text-right">
                      <span className="text-stone-500 dark:text-stone-400 text-[10px] block">Estimated Wholesale Total:</span>
                      <span className="text-base font-black text-amber-600 dark:text-amber-400">
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

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 3-OPTION PROCUREMENT INQUIRY MODAL (WHATSAPP / CALL / FORM)   */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div
        role="dialog"
        aria-modal={isInquiryModalOpen ? 'true' : 'false'}
        aria-labelledby="wallpanels-modal-title"
        className={`fixed inset-0 z-[60] flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md transition-all duration-200 ${
          isInquiryModalOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsInquiryModalOpen(false)}
      >
        <div
          className="relative w-full max-w-lg rounded-3xl bg-stone-900 border border-stone-800 p-6 sm:p-8 shadow-2xl overflow-hidden text-left"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={() => setIsInquiryModalOpen(false)}
            aria-label="Close modal"
            className="absolute top-5 right-5 w-9 h-9 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="mb-6 pr-8">
            <h3 id="wallpanels-modal-title" className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Get Free Sample &amp; Quote
            </h3>
            <p className="text-xs sm:text-sm text-stone-400 mt-1 leading-relaxed">
              Choose how you would like to connect for factory rates, free swatches, or project estimates.
            </p>
          </div>

          {/* The 3 Options */}
          <div className="space-y-3">
            {/* Option 1: WhatsApp */}
            <button
              type="button"
              onClick={() => {
                try {
                  fetch('/api/analytics/whatsapp-clicks', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ source: 'wallpanels-inquiry-modal-whatsapp', panel: 'general' }),
                  }).catch(() => {});
                } catch {}
                const msg = `Hi WholesalerJi, I have a project and want to inquire about Wall Panels wholesale rates and delivery.`;
                window.open(`https://wa.me/919217400163?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
                setIsInquiryModalOpen(false);
              }}
              className="w-full p-4 rounded-2xl bg-stone-800/80 hover:bg-[#25D366]/10 border border-stone-700/60 hover:border-[#25D366] transition-all duration-200 flex items-center gap-4 text-left group cursor-pointer"
            >
              <div className="w-11 h-11 rounded-xl bg-[#25D366]/15 border border-[#25D366]/30 text-[#25D366] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="font-bold text-white text-sm flex items-center gap-2">
                  <span>WhatsApp Support</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#25D366]/20 text-[#25D366] font-bold">
                    FASTEST
                  </span>
                </div>
                <p className="text-xs text-stone-400 mt-0.5">
                  Receive live factory rates &amp; shade catalogues on WhatsApp
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-stone-500 group-hover:text-[#25D366] group-hover:translate-x-1 transition-all" />
            </button>

            {/* Option 2: Direct Call */}
            <a
              href="tel:+919217400163"
              className="w-full p-4 rounded-2xl bg-stone-800/80 hover:bg-amber-500/10 border border-stone-700/60 hover:border-amber-500 transition-all duration-200 flex items-center gap-4 text-left group cursor-pointer"
            >
              <div className="w-11 h-11 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-500 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                <Phone className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="font-bold text-white text-sm">
                  Call Technical Sales Hub
                </div>
                <p className="text-xs text-stone-400 mt-0.5">
                  Speak directly with our product specialist (+91 92174 00163)
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-stone-500 group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
            </a>

            {/* Option 3: Fill Request Form */}
            <button
              type="button"
              onClick={() => {
                setIsInquiryModalOpen(false);
                setTimeout(() => {
                  setIsQuoteModalOpen(true);
                }, 400);
              }}
              className="w-full p-4 rounded-2xl bg-stone-800/80 hover:bg-stone-700/80 border border-stone-700/60 hover:border-amber-500/70 transition-all duration-200 flex items-center gap-4 text-left group cursor-pointer"
            >
              <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/20 text-white flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                <FileText className="w-5 h-5 text-amber-400" />
              </div>
              <div className="flex-1">
                <div className="font-bold text-white text-sm flex items-center gap-2">
                  <span>Fill Sample &amp; Quote Form</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-bold">
                    ONLINE FORM
                  </span>
                </div>
                <p className="text-xs text-stone-400 mt-0.5">
                  Fill quick project details &amp; receive an automated wholesale estimate
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-stone-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
            </button>
          </div>
        </div>
      </div>

      <GetQuoteModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
      />
    </div>
  );
}
