"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import KineticExperience from "@/components/KineticExperience";
import Navbar from "@/components/Navbar";
import GetQuoteModal from "@/components/GetQuoteModal";
import { ALL_WALL_PANELS } from "@/data/wallPanelsData";

export default function Home() {
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const observerRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    // Only run on mobile
    if (window.innerWidth >= 768) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.getAttribute("data-index"));
            setHoveredCategory(idx);
          }
        });
      },
      {
        root: null,
        rootMargin: "-25% 0px -25% 0px",
        threshold: 0.15,
      }
    );

    observerRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const categories = [
    {
      title: "Seamless Primo Panels",
      link: "/products/primo-panels",
      image: "/assets/panels/gf-402.jpg",
      color: "amber-500",
      children: [
        { id: "GF-301", img: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1776780203/Primo_GF-301_Pvc_Panel_Goals_Floors.png" },
        { id: "GF-302", img: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1776780203/GF-302_Premium_Pvc_Panel_Primo_Series.png" },
        { id: "GF-303", img: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1776780202/GF-303_Grey_Color_Pvc_Panel.png" },
        { id: "GF-304", img: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1776780202/GF-304_New_Launch_Wall_Panel_Design.png" }
      ]
    },
    {
      title: "Elite High-Gloss",
      link: "/products/elite-panels",
      image: "/assets/panels/pvc_marble_sheet.jpg",
      color: "sky-500",
      children: [
        { id: "GF-401", img: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1776777064/GF-401_Premium_Pvc_Panel_In_Gurgaon.png" },
        { id: "GF-402", img: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1776777063/Premium_Pvc_Panel_In_gurgaon.png" },
        { id: "GF-403", img: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1776777062/GF-403_Silver_Color_Pvc_Panel.png" },
        { id: "GF-404", img: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1776777061/GF-404_Gold_Flower_Design_Pvc_Panel.png" }
      ]
    },
    {
      title: "Classic Fluted WPC",
      link: "/products/primo-fluted-panels",
      image: "/assets/panels/wpc_louver_texture.jpg",
      color: "amber-600",
      children: [
        { id: "FP-701", img: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/Fluted_Panel_FP_-_701.png" },
        { id: "FP-702", img: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/Fluted_Panel_FP_-_702.png" },
        { id: "FP-703", img: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/Fluted_Panel_FP_-_703.png" },
        { id: "FP-704", img: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/Fluted_Panel_FP_-_704.png" }
      ]
    },
    {
      title: "Premium Fluted WPC",
      link: "/products/elite-fluted-panels",
      image: "/assets/panels/charcoal_fluted_office_insitu.jpg",
      color: "emerald-500",
      children: [
        { id: "FP-714", img: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/Fluted_Panel_FP_-_714.png" },
        { id: "FP-715", img: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/Fluted_Panel_FP_-_715.png" },
        { id: "FP-716", img: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/Fluted_Panel_FP_-_716.png" },
        { id: "FP-717", img: "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/Fluted_Panel_FP_-_717.png" }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 font-sans transition-colors selection:bg-amber-500 selection:text-stone-950">
      {/* ───────────────────────────────────────────────────────────── */}
      {/* 1. TOP ANNOUNCEMENT & B2B NAVBAR (WITH HOVER MEGA MENU)       */}
      {/* ───────────────────────────────────────────────────────────── */}
      <Navbar currentPath="/" />

      <main>
        {/* ───────────────────────────────────────────────────────────── */}
        {/* 2. KINETIC SPATIAL SCROLL EXPERIENCE (WITH ROCKET & WHY-US)   */}
        {/* ───────────────────────────────────────────────────────────── */}
        <div id="experience">
          <KineticExperience
            heroImage="/assets/home-image.jpg"
            teamImage="/assets/Goals_Floors_Wall_Panels.webp"
          />
        </div>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* 3. B2B TRUST METRICS & STATS BAR                              */}
        {/* ───────────────────────────────────────────────────────────── */}
        <section id="specs" className="border-y border-stone-200 dark:border-stone-800 bg-stone-100/70 dark:bg-stone-900/50 py-12 transition-colors">
          <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-24">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <p className="text-3xl md:text-4xl font-extrabold text-amber-600 dark:text-amber-400">500+</p>
                <p className="mt-1 text-xs uppercase tracking-wider text-stone-500 dark:text-stone-400">Authorized Dealers</p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-extrabold text-stone-900 dark:text-white">2.5M+</p>
                <p className="mt-1 text-xs uppercase tracking-wider text-stone-500 dark:text-stone-400">Sq Ft Delivered</p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-extrabold text-amber-600 dark:text-amber-400">18 States</p>
                <p className="mt-1 text-xs uppercase tracking-wider text-stone-500 dark:text-stone-400">Pan-India Logistics</p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-extrabold text-stone-900 dark:text-white">Class B1</p>
                <p className="mt-1 text-xs uppercase tracking-wider text-stone-500 dark:text-stone-400">Fire &amp; Termite Certified</p>
              </div>
            </div>
          </div>
        </section>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* NEW: INTERACTIVE EXPLORE WALL PANEL CATEGORIES                */}
        {/* ───────────────────────────────────────────────────────────── */}
        <section className="py-12 md:py-24 px-4 sm:px-8 lg:px-12 xl:px-24 w-full border-b border-stone-200 dark:border-stone-800 transition-colors overflow-x-clip">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-stone-900 dark:text-white mt-1">
              Explore Wall Panel Categories
            </h2>
            <p className="text-sm text-stone-600 dark:text-stone-400 mt-2 max-w-xl mx-auto">
              Discover our comprehensive range of commercial-grade cladding. Designed for modern architecture and luxury interiors.
            </p>
          </div>
          <div className="relative flex flex-col md:flex-row justify-center items-center gap-20 md:gap-16 h-auto md:h-[550px] w-full py-4 md:py-0">
            {categories.map((cat, i) => {
              // Calculate positioning logic
              const isHovered = hoveredCategory === i;
              const isAnyHovered = hoveredCategory !== null;
              
              // Shift logic to prevent overlapping and screen edge collisions on desktop
              let shiftX = 0;
              if (isAnyHovered && !isMobile) {
                if (isHovered) {
                  // If hovered is at the edges, shift inward so the fan doesn't hit the screen edge
                  if (i === 0) shiftX = 60;
                  if (i === 3) shiftX = -60;
                } else {
                  // Push immediate sibling away to clear the fan, and push further siblings less so they compress together
                  const direction = i < hoveredCategory ? -1 : 1;
                  const distance = Math.abs(i - hoveredCategory);
                  shiftX = direction * (250 - distance * 50);
                }
              }

              // Responsive fan transforms: sleek compact spread on mobile, wide peacock fan on desktop
              const fanTransforms = isMobile
                ? [
                    { rotate: -12, x: -42, y: 10 },
                    { rotate: -6,  x: -21, y: 4 },
                    { rotate: 6,   x: 21,  y: 4 },
                    { rotate: 12,  x: 42,  y: 10 },
                  ]
                : [
                    { rotate: -24, x: -140, y: 30 },
                    { rotate: -12, x: -70,  y: 10 },
                    { rotate: 12,  x: 70,   y: 10 },
                    { rotate: 24,  x: 140,  y: 30 },
                  ];

              return (
                <div 
                  key={i} 
                  ref={(el) => { observerRefs.current[i] = el; }}
                  data-index={i}
                  className={`relative w-40 sm:w-46 md:w-52 mx-auto md:mx-0 h-[365px] sm:h-[410px] md:h-[480px] flex-shrink-0 transition-all duration-700 ease-out md:translate-x-[var(--shift-x)] ${isHovered ? 'scale-[1.02] md:scale-105' : 'scale-100 md:scale-100'}`}
                  style={{
                    '--shift-x': `${shiftX}px`,
                    zIndex: isHovered ? 30 : 10
                  } as React.CSSProperties}
                  onMouseEnter={() => !isMobile && setHoveredCategory(i)}
                  onMouseLeave={() => !isMobile && setHoveredCategory(null)}
                >
                  {/* Peacock Fan Children (Spawn from behind) */}
                  {cat.children.map((child, childIdx) => {
                    const fan = fanTransforms[childIdx];
                    return (
                      <div
                        key={child.id}
                        className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden border border-stone-300 dark:border-stone-700 shadow-2xl transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] pointer-events-none scale-[0.95] md:scale-100 origin-bottom"
                        style={{
                          transformOrigin: '50% 90%',
                          transform: isHovered 
                            ? `translate(${fan.x}px, ${fan.y}px) rotate(${fan.rotate}deg)` 
                            : `translate(0px, 0px) rotate(0deg)`,
                          opacity: isHovered ? 1 : 0,
                          zIndex: (childIdx === 1 || childIdx === 2) ? 6 : 5
                        }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={child.img} alt={child.id} className="w-full h-full object-cover" />
                        <div className="absolute top-2 inset-x-2 flex justify-center">
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-black/80 text-white backdrop-blur-sm border border-white/20">
                            {child.id}
                          </span>
                        </div>
                      </div>
                    );
                  })}

                  {/* Main Category Card (In front) */}
                  <Link 
                    href={cat.link} 
                    onClick={(e) => {
                      // On mobile touch: if not opened yet, tap opens the peacock fan first
                      if (isMobile && hoveredCategory !== i) {
                        e.preventDefault();
                        setHoveredCategory(i);
                      }
                    }}
                    className={`relative w-full h-full group rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-800 shadow-lg transition-all duration-300 bg-stone-100 dark:bg-stone-900 block ${isHovered ? `border-${cat.color}` : 'hover:border-amber-500/50'}`}
                    style={{ zIndex: 20 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-900/90 via-stone-900/30 to-transparent z-10" />
                    <Image 
                      src={cat.image} 
                      alt={cat.title} 
                      fill 
                      sizes="(max-width: 768px) 100vw, 256px"
                      className={`object-cover transition-transform duration-700 ${isHovered ? 'scale-110' : ''}`} 
                    />
                    <div className="absolute bottom-6 left-5 right-5 z-20">
                      <h3 className="text-xl font-bold text-white leading-tight drop-shadow-md">{cat.title}</h3>
                      <span className={`text-xs text-${cat.color} font-semibold mt-2 block flex items-center gap-1`}>
                        Explore Series <span className={`transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`}>→</span>
                      </span>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <Link href="/wall-panels" className="inline-block px-8 py-3 rounded-full border border-stone-300 dark:border-stone-700 text-sm font-bold text-stone-700 dark:text-stone-300 hover:border-amber-500 hover:text-amber-500 transition-colors bg-white/50 dark:bg-stone-900/50 backdrop-blur-sm">
              View All Wall Panels →
            </Link>
          </div>
        </section>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* NEW: GURGAON / DELHI NCR RELEVANCE                            */}
        {/* ───────────────────────────────────────────────────────────── */}
        <section className="py-20 px-4 sm:px-8 lg:px-12 xl:px-24 w-full">
          <div className="bg-stone-900 rounded-3xl p-8 md:p-12 text-center shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(245,158,11,0.15)_0%,transparent_70%)] pointer-events-none" />
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-4 block relative z-10">
              Local Hubs & Logistics
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-white mt-1 mb-6 relative z-10">
              Wall Panel Supply in Gurgaon & Delhi NCR
            </h2>
            <p className="text-stone-300 text-sm md:text-base max-w-3xl mx-auto leading-relaxed relative z-10 font-light">
              WholesalerJi supplies wall panels for residential, commercial and interior projects across Gurgaon and Delhi NCR. Bulk requirements can be supported with project-based quotations, material guidance and delivery coordination.
            </p>
          </div>
        </section>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* 4. MASTER B2B CATALOG GRID                                    */}
        {/* ───────────────────────────────────────────────────────────── */}
        <section id="catalog" className="py-20 px-4 sm:px-8 lg:px-12 xl:px-24 w-full">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">
                Direct Mill Dispatch
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-stone-900 dark:text-white mt-1">
                Wholesale Wall Panel Catalog
              </h2>
              <p className="text-sm text-stone-600 dark:text-stone-400 mt-2 max-w-xl">
                Commercial-grade architectural cladding panels. Tiered discounts available for contractors, builders, and retailers.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 text-xs font-semibold rounded-md bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-300 dark:border-stone-700">
                All Materials
              </span>
              <span className="px-3 py-1.5 text-xs font-semibold rounded-md bg-stone-100 dark:bg-stone-900 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white border border-stone-200 dark:border-stone-800 cursor-pointer">
                WPC Fluted
              </span>
              <span className="px-3 py-1.5 text-xs font-semibold rounded-md bg-stone-100 dark:bg-stone-900 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white border border-stone-200 dark:border-stone-800 cursor-pointer">
                PVC Marble
              </span>
              <span className="px-3 py-1.5 text-xs font-semibold rounded-md bg-stone-100 dark:bg-stone-900 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white border border-stone-200 dark:border-stone-800 cursor-pointer">
                Charcoal Panels
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* PRODUCT CARD 1 */}
            <div className="group rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 overflow-hidden hover:border-amber-500/50 transition-all shadow-sm">
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100 dark:bg-stone-950">
                <Image
                  src="/assets/panels/wpc_louver_texture.jpg"
                  alt="Oak WPC Fluted Louver Panel"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-amber-500 text-stone-950 font-black text-[10px] uppercase px-2 py-0.5 rounded">
                  Best Seller
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 mb-1">
                  <span>WPC Fluted</span>
                  <span className="font-medium">MOQ: 300 sq ft</span>
                </div>
                <h3 className="text-lg font-bold text-stone-900 dark:text-white group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors">
                  Natural Oak WPC Louver Panel
                </h3>
                <p className="text-xs text-stone-600 dark:text-stone-400 mt-2 line-clamp-2">
                  12mm thickness with deep acoustic fluting. 100% waterproof, anti-termite, Class B1 fire resistant.
                </p>
                <div className="mt-4 pt-4 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase text-stone-400 block">Wholesale Rate</span>
                    <span className="text-base font-extrabold text-amber-600 dark:text-amber-400">₹65 - ₹85 <span className="text-xs font-normal text-stone-500">/sqft</span></span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsQuoteModalOpen(true)}
                    className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded bg-stone-100 hover:bg-amber-500 hover:text-stone-950 dark:bg-stone-800 dark:hover:bg-amber-500 dark:hover:text-stone-950 text-stone-800 dark:text-white transition-colors cursor-pointer"
                  >
                    Quick RFQ
                  </button>
                </div>
              </div>
            </div>

            {/* PRODUCT CARD 2 */}
            <div className="group rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 overflow-hidden hover:border-sky-500/50 transition-all shadow-sm">
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100 dark:bg-stone-950">
                <Image
                  src="/assets/pvc_marble_sheet.jpg"
                  alt="Calacatta Gold UV PVC Marble Sheet"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-sky-500 text-white font-black text-[10px] uppercase px-2 py-0.5 rounded">
                  High Gloss
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 mb-1">
                  <span>PVC Marble</span>
                  <span className="font-medium">MOQ: 20 Sheets</span>
                </div>
                <h3 className="text-lg font-bold text-stone-900 dark:text-white group-hover:text-sky-500 dark:group-hover:text-sky-400 transition-colors">
                  Calacatta Gold UV Marble Sheet
                </h3>
                <p className="text-xs text-stone-600 dark:text-stone-400 mt-2 line-clamp-2">
                  8x4 ft seamless high-gloss sheets with bookmatched marble veining and UV-hardened topcoat.
                </p>
                <div className="mt-4 pt-4 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase text-stone-400 block">Wholesale Rate</span>
                    <span className="text-base font-extrabold text-sky-600 dark:text-sky-400">₹32 - ₹48 <span className="text-xs font-normal text-stone-500">/sqft</span></span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsQuoteModalOpen(true)}
                    className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded bg-stone-100 hover:bg-sky-500 hover:text-white dark:bg-stone-800 dark:hover:bg-sky-400 dark:hover:text-stone-950 text-stone-800 dark:text-white transition-colors cursor-pointer"
                  >
                    Quick RFQ
                  </button>
                </div>
              </div>
            </div>

            {/* PRODUCT CARD 3 */}
            <div className="group rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 overflow-hidden hover:border-amber-500/50 transition-all shadow-sm">
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100 dark:bg-stone-950">
                <Image
                  src="/assets/charcoal_fluted_office_insitu.jpg"
                  alt="Architectural Charcoal Fluted Wall Panel"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-stone-800 text-white font-black text-[10px] uppercase px-2 py-0.5 rounded">
                  Commercial
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 mb-1">
                  <span>Charcoal Louvers</span>
                  <span className="font-medium">MOQ: 250 sq ft</span>
                </div>
                <h3 className="text-lg font-bold text-stone-900 dark:text-white group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors">
                  Matte Charcoal Architectural Louver
                </h3>
                <p className="text-xs text-stone-600 dark:text-stone-400 mt-2 line-clamp-2">
                  High-density charcoal composite panels engineered for corporate receptions, auditoriums, and luxury hospitality.
                </p>
                <div className="mt-4 pt-4 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase text-stone-400 block">Wholesale Rate</span>
                    <span className="text-base font-extrabold text-amber-600 dark:text-amber-400">₹75 - ₹95 <span className="text-xs font-normal text-stone-500">/sqft</span></span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsQuoteModalOpen(true)}
                    className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded bg-stone-100 hover:bg-amber-500 hover:text-stone-950 dark:bg-stone-800 dark:hover:bg-amber-500 dark:hover:text-stone-950 text-stone-800 dark:text-white transition-colors cursor-pointer"
                  >
                    Quick RFQ
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* 5. INSTANT TRADE QUOTATION & SAMPLES CTA                      */}
        {/* ───────────────────────────────────────────────────────────── */}
        <section id="rfq" className="py-16 md:py-24 border-t border-stone-200 dark:border-stone-800 bg-stone-100/60 dark:bg-stone-900/40 transition-colors">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-10 md:p-14 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600" />
              
              <span className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 mb-2 block">
                Instant Trade Rates &amp; Catalog
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-stone-900 dark:text-white">
                Request Volume Wholesale Rate Card
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 mt-2 max-w-xl mx-auto font-light leading-relaxed">
                Direct mill pricing for Contractors, Builders, Interior Designers &amp; Homeowners. Get formal quotes, material swatches &amp; dispatch timelines in 30 minutes.
              </p>

              {/* Quick Persona Highlights */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 my-6 max-w-2xl mx-auto text-left">
                <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-950/60 border border-stone-200 dark:border-stone-800">
                  <span className="text-[11px] font-bold text-stone-900 dark:text-white block">🏢 B2B &amp; Dealers</span>
                  <span className="text-[9px] sm:text-[10px] text-stone-500 dark:text-stone-400">Tiered bulk rates</span>
                </div>
                <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-950/60 border border-stone-200 dark:border-stone-800">
                  <span className="text-[11px] font-bold text-stone-900 dark:text-white block">🔨 Contractors</span>
                  <span className="text-[9px] sm:text-[10px] text-stone-500 dark:text-stone-400">Project-ready dispatch</span>
                </div>
                <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-950/60 border border-stone-200 dark:border-stone-800">
                  <span className="text-[11px] font-bold text-stone-900 dark:text-white block">📐 Architects</span>
                  <span className="text-[9px] sm:text-[10px] text-stone-500 dark:text-stone-400">Free sample swatches</span>
                </div>
                <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-950/60 border border-stone-200 dark:border-stone-800">
                  <span className="text-[11px] font-bold text-stone-900 dark:text-white block">🏡 Home Owners</span>
                  <span className="text-[9px] sm:text-[10px] text-stone-500 dark:text-stone-400">Zero markup prices</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsQuoteModalOpen(true)}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:brightness-110 text-stone-950 font-black text-xs sm:text-sm uppercase tracking-wider transition-all shadow-xl shadow-amber-500/25 cursor-pointer"
                >
                  Request Instant Quote / Rate Card →
                </button>
                <a
                  href="https://wa.me/919999999999?text=Hi%20Wholesaleji%2C%20I%20am%20interested%20in%20wall%20panels.%20Please%20share%20wholesale%20rate%20card."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-900 dark:text-white font-bold text-xs sm:text-sm transition-all text-center"
                >
                  💬 Chat on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* GetQuoteModal Integration */}
        {ALL_WALL_PANELS.length > 0 && (
          <GetQuoteModal
            isOpen={isQuoteModalOpen}
            onClose={() => setIsQuoteModalOpen(false)}
            activePanel={ALL_WALL_PANELS[0]}
            allPanels={ALL_WALL_PANELS}
            seriesLabel="Wholesale Architectural Panels"
          />
        )}
      </main>
    </div>
  );
}
