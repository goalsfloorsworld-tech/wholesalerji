'use client';

import React, { useRef, useState, useEffect, useLayoutEffect } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PanelProduct } from '@/data/types';
import {
  PRIMO_WALL_PANELS,
  PRIMO_HERO_TEXTURES as HERO_TEXTURES,
  PRIMO_ACRONYM_DATA as ACRONYM_DATA,
  PRIMO_FAQS,
} from '@/data/primoPanelsData';
import { WallPanelProduct } from '@/sanity/schemas/product';
import LeadForm from '@/components/client/LeadForm';
import ProductShowcase from '@/components/ProductShowcase';
import FAQ from '@/components/FAQ';

// ─────────────────────────────────────────────────────────────
// BESPOKE ARCHITECTURAL DATA STRUCTURES
// ─────────────────────────────────────────────────────────────
const APPLICATION_SPACES = [
  {
    id: 'living-room',
    name: 'Living Lounge',
    badge: 'Monolithic Span',
    shadeCode: 'GF-301',
    shadeName: 'Nordic Ash White',
    swatch: '#E2DDD9',
    headline: '12-Inch Seamless Architectural Canvas',
    description: 'Eliminates busy vertical joint lines behind luxury modular sofas. Replaces dusty paint with a wipe-clean Scandinavian wood grain finish.',
    image: 'https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1772477058/Premium_Black_Color_WPC_Louvers.png',
    stat: '66% Fewer Seam Lines',
  },
  {
    id: 'tv-wall',
    name: 'TV Media Console',
    badge: 'Cable Cavity',
    shadeCode: 'GF-308',
    shadeName: 'Royal Dark Walnut',
    swatch: '#3D2F27',
    headline: 'Concealed Wiring & Anti-Glare Backdrop',
    description: 'Deep mineral and walnut tones reduce reflection around OLED displays. The rear hollow channel hides HDMI and power cords with zero wall chiseling.',
    image: 'https://res.cloudinary.com/dcezlxt8r/image/upload/v1741639144/Charcoal_Louvers_124.png',
    stat: 'Zero Wall Chiseling',
  },
  {
    id: 'bedroom',
    name: 'Master Bedhead',
    badge: 'Zero Odor Bedhead',
    shadeCode: 'GF-302',
    shadeName: 'European Oak Natural',
    swatch: '#C2A382',
    headline: 'Tactile Wood Warmth with Zero Formaldehyde',
    description: 'Unlike VOC-heavy wallpapers and laminates, virgin polymer extrusion is completely odorless, ensuring clean indoor air quality from night one.',
    image: 'https://res.cloudinary.com/dcezlxt8r/image/upload/v1741639097/Fluted_Panel_FP_-_701.png',
    stat: '100% Odorless Air',
  },
  {
    id: 'office',
    name: 'Executive Boardroom',
    badge: 'Class B1 Fire Safe',
    shadeCode: 'GF-318',
    shadeName: 'Concrete Mineral Grey',
    swatch: '#9CA3AF',
    headline: 'Commercial Toughness with Zero Polish',
    description: 'Withstands accidental chair impacts and luggage scuffs in high-profile conference suites. Certified Class B1 flame retardant for commercial code compliance.',
    image: 'https://res.cloudinary.com/dcezlxt8r/image/upload/v1741639105/Fluted_Panel_FP_-_706.png',
    stat: 'Commercial Fire Safe',
  },
  {
    id: 'seelan',
    name: 'Damp Masonry Walls',
    badge: 'Permanent Seelan Seal',
    shadeCode: 'GF-313',
    shadeName: 'Pure Glacier White',
    swatch: '#F3F4F6',
    headline: '100% Moisture Barrier Over Peeling Walls',
    description: 'Permanently encapsulates monsoon efflorescence and bubbling paint. <0.2% water absorption ensures dampness never migrates to the surface.',
    image: 'https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/v1772477066/Wpc_Fluted_Panel.png',
    stat: '<0.2% Water Absorption',
  },
  {
    id: 'retail',
    name: 'Boutique Reception',
    badge: 'Heavy Footfall',
    shadeCode: 'GF-305',
    shadeName: 'Travertine Vein Light',
    swatch: '#DDD5C7',
    headline: 'High-End Architectural Reception Focal Point',
    description: 'Imparts stone-slab grandeur to retail cash desks and hospitality foyers at 80% lower weight and cost than natural Italian marble.',
    image: 'https://res.cloudinary.com/dcezlxt8r/image/upload/v1741639088/Charcoal_Louvers_122.png',
    stat: '80% Lighter Than Stone',
  },
];

const TRANSFORMATION_PHASES = [
  {
    phase: '01',
    name: 'Precision Extrusion',
    spec: '2950 × 300 × 5 mm',
    status: 'Solid Virgin Polymer',
    highlight: 'Rigid 2.8kg composite slab with high-tensile internal cellular webbing. Engineered for dead-flat wall planes without heavy deadweight.',
    metric: '9.52 Sq. Ft. Coverage / Panel',
  },
  {
    phase: '02',
    name: 'Concealed Interlocking',
    spec: 'Tongue & Groove Anchor',
    status: 'Zero Exposed Hardware',
    highlight: 'Consecutive panels click into the concealed rear lip. Screws are 100% hidden, enabling 400 sq ft/day installation velocity.',
    metric: 'Zero Visible Fasteners',
  },
  {
    phase: '03',
    name: 'Monolithic Living Wall',
    spec: 'Architectural Finish',
    status: 'Permanent Seelan Barrier',
    highlight: 'Forms an impermeable monolithic plane. Completely blocks dampness, resists Class B1 fire, and requires zero periodic repainting.',
    metric: 'Zero Maintenance Lifetime',
  },
];

const ENGINEERING_BENCHMARKS = [
  {
    title: 'Format Span',
    primoVal: '300mm (12" Wide)',
    altVal: '100mm Generic Slat',
    advantage: '66% Fewer Joints',
    primoBar: 'w-[92%]',
    altBar: 'w-[33%]',
  },
  {
    title: 'Water Absorption',
    primoVal: '<0.2% Impermeable',
    altVal: '18%–22% (Natural Wood)',
    advantage: '100% Seelan Proof',
    primoBar: 'w-[98%]',
    altBar: 'w-[18%]',
  },
  {
    title: 'Fire Safety Code',
    primoVal: 'Class B1 Flame Retardant',
    altVal: 'Combustible (Wood / Vinyl)',
    advantage: 'Commercial Safe',
    primoBar: 'w-[94%]',
    altBar: 'w-[25%]',
  },
  {
    title: 'Substrate Prep',
    primoVal: 'Direct Wall / Zero Framing',
    altVal: '₹70/sqft Plywood Grid',
    advantage: 'Saves ₹70/sq ft Framing',
    primoBar: 'w-[95%]',
    altBar: 'w-[30%]',
  },
  {
    title: 'Polymer Purity',
    primoVal: '100% Virgin Matrix',
    altVal: 'Recycled Regrind (Brittle)',
    advantage: 'Zero Impact Chipping',
    primoBar: 'w-[96%]',
    altBar: 'w-[40%]',
  },
  {
    title: 'Lifecycle Upkeep',
    primoVal: 'Zero (Microfiber Wipe)',
    altVal: 'Annual Varnish / Paint',
    advantage: '10-Year Clean Surface',
    primoBar: 'w-[99%]',
    altBar: 'w-[20%]',
  },
];

const TRADE_PERSONAS = [
  {
    id: 'architects',
    role: 'Architects & Interior Designers',
    shortLabel: 'Architects',
    docketTitle: 'Design Specification & Digital Assets',
    actionLabel: 'Order Architectural Swatch Kit',
    actionUrl: '#rfq-section',
    features: [
      '24 synchronized textures: Nordic Ash, Italian Travertine, Concrete, Deep Walnut.',
      'High-res PBR texture maps and CAD DWG profile files for SketchUp and 3ds Max.',
      'Full 2.95m physical panel specimens dispatched to design studios in Gurugram & Delhi.',
    ],
  },
  {
    id: 'contractors',
    role: 'Fit-Out Contractors & Carpenters',
    shortLabel: 'Contractors',
    docketTitle: 'Site Velocity & Labor Economics',
    actionLabel: 'Get Contractor Bulk Rate Card',
    actionUrl: '#pricing-wholesale',
    features: [
      '400 sq ft/day installation velocity with two-person carpenter teams.',
      'Direct wall adhesive fixing eliminates ₹60–₹80/sq ft secondary plywood framing.',
      'Clean hand-saw cuts with zero edge splintering and zero formaldehyde dust.',
    ],
  },
  {
    id: 'dealers',
    role: 'Building Material Stockists',
    shortLabel: 'Stockists',
    docketTitle: 'Wholesale Margins & Inventory Velocity',
    actionLabel: 'Apply for Gurugram Dealership',
    actionUrl: 'https://wa.me/919217400163?text=Hi%20WholesalerJi%2C%20I%20am%20interested%20in%20a%20stockist%20dealership%20for%20Primo%20Panels.',
    features: [
      'Pure mill-direct trade pricing starting at ₹499/pc (MRP ₹990) for high dealer margins.',
      'Compact 10-pc export cartons consume 70% less warehouse space than 8x4 sheets.',
      'Same-day stock replenishment directly from Sector 34 Gurugram central warehouse.',
    ],
  },
  {
    id: 'procurement',
    role: 'Commercial Builders & Developers',
    shortLabel: 'Commercial BOQ',
    docketTitle: 'Compliance, Tax Credits & Freight',
    actionLabel: 'Request Commercial Tender Quote',
    actionUrl: '#rfq-section',
    features: [
      'Class B1 self-extinguishing certification satisfies commercial fire inspector codes.',
      '100% virgin polymer with zero VOC off-gassing allows immediate tenant occupancy.',
      'Clean GST invoicing with exact HSN codes for seamless Input Tax Credit (ITC).',
    ],
  },
];

const INSTALL_STEPS = [
  {
    num: '01',
    title: 'Substrate Inspection',
    phase: 'Prep',
    proTip: 'Brush away peeling paint or loose plaster. Even damp masonry is 100% fine.',
    instruction: 'Primo can be mounted directly over cured masonry plaster, gypsum drywall, old ceramic tiles, or cement fiber boards.',
  },
  {
    num: '02',
    title: 'Adhesive vs Batten',
    phase: 'Fixing',
    proTip: 'Use serpentine beads of hybrid polyurethane or MS polymer adhesive for flat walls.',
    instruction: 'For walls with >10mm undulations or chronic seelan, fix 1-inch GI channels or timber battens spaced at 400mm centers.',
  },
  {
    num: '03',
    title: 'Concealed Interlocking',
    phase: 'Jointing',
    proTip: 'Fasten brad nails strictly at 45° through the rear flange lip.',
    instruction: 'Drive countersunk screws or headless brads through the rear flange. Slide the female groove of panel 2 over the tongue.',
  },
  {
    num: '04',
    title: 'Switchbox Cutouts',
    phase: 'Fitting',
    proTip: 'Use an oscillating multi-tool or hole saw for clean 90° corners.',
    instruction: 'Measure electrical conduit and switchboard centers. Trace directly onto panel face and cut using a fine-toothed hand saw or jigsaw.',
  },
  {
    num: '05',
    title: 'Perimeter Trim & Seal',
    phase: 'Finishing',
    proTip: 'Snap matching L-trim or end caps along floor skirting and ceiling joints.',
    instruction: 'Cap outer perimeter edges with matching Primo L-profiles or silicone beading. Clean surface with a damp microfiber cloth.',
  },
];

const COMPARISON_ROWS = [
  {
    metric: 'Core Composition',
    primo: '100% Virgin Polymer Matrix',
    wood: 'Natural Wood / Veneer',
    wpc: 'Wood Fiber Composite',
    wallpaper: 'Paper / Vinyl Substrate',
    paint: 'Acrylic Latex Emulsion',
  },
  {
    metric: 'Seelan Proofing',
    primo: '100% Impermeable (<0.2%)',
    wood: 'Rots, warps & swells',
    wpc: 'Moisture resistant (<1%)',
    wallpaper: 'Peels off with dampness',
    paint: 'Bubbles & flakes in 1 monsoon',
  },
  {
    metric: 'Trade Cost / Sq. Ft.',
    primo: '~₹52 / sq ft',
    wood: '₹250–₹500 / sq ft',
    wpc: '₹65–₹95 / sq ft',
    wallpaper: '₹40–₹120 / sq ft',
    paint: '₹15–₹35 / sq ft',
  },
  {
    metric: 'Substrate Framing',
    primo: 'Direct Wall / Zero Framing',
    wood: 'Requires ₹70/sqft Plywood',
    wpc: 'Direct or Batten Grid',
    wallpaper: 'Requires Smooth POP Wall',
    paint: 'Requires Putty & Primer',
  },
  {
    metric: 'Installation Velocity',
    primo: 'Up to 400 sq ft / day',
    wood: 'Slow (Multi-day Carpentry)',
    wpc: 'Up to 300 sq ft / day',
    wallpaper: 'Fast (Smooth Base Only)',
    paint: 'Multi-coat drying delays',
  },
  {
    metric: 'Routine Maintenance',
    primo: 'Zero (Wipe with microfiber)',
    wood: 'Periodic re-varnish & wax',
    wpc: 'Occasional surface dusting',
    wallpaper: 'Fragile (Cannot scrub)',
    paint: 'Repaint every 2–3 years',
  },
  {
    metric: 'Fire Safety Code',
    primo: 'Class B1 Flame Retardant',
    wood: 'Combustible timber hazard',
    wpc: 'Class B1 Flame Retardant',
    wallpaper: 'Flammable paper backing',
    paint: 'Non-combustible surface',
  },
];

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
  const [activeSpaceIndex, setActiveSpaceIndex] = useState(0);
  const [activeTimelinePhase, setActiveTimelinePhase] = useState(0);
  const [activePersonaIndex, setActivePersonaIndex] = useState(0);
  const [activeInstallStep, setActiveInstallStep] = useState(0);
  const [calcSqFt, setCalcSqFt] = useState<number>(200);

  // REFS FOR GSAP
  const rootRef = useRef<HTMLDivElement>(null);
  const heroSectionRef = useRef<HTMLElement>(null);
  const heroMaskContainerRef = useRef<HTMLDivElement>(null);



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

        // Initial setup: Layer 0 is fully visible (no ghost shadow underneath).
        // Layers 1 to 4 start clipped below and wipe in on scroll.
        layers.forEach((layer, i) => {
          if (i === 0) {
            gsap.set(layer, { clipPath: 'inset(0% 0 0 0)', opacity: 1 });
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

        // Subsequent scrolls wipe next texture from bottom to top cleanly
        for (let i = 1; i < layers.length; i++) {
          heroTl.to(layers[i], {
            clipPath: 'inset(0% 0 0 0)',
            duration: 1,
            ease: 'none',
          });
        }
      }

      // Acronym GSAP removed for an editorial scroll layout.
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
        {/* Breadcrumb Navigation (Subtle, architectural, top-left) */}
        <nav
          aria-label="Breadcrumb"
          className="absolute top-4 left-4 sm:left-8 lg:left-12 z-20 flex items-center gap-2 text-[11px] font-mono tracking-wider text-stone-500 dark:text-stone-400 select-auto"
        >
          <Link href="/" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
            Home
          </Link>
          <span className="opacity-40">/</span>
          <Link href="/wall-panels" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
            Wall Panels
          </Link>
          <span className="opacity-40">/</span>
          <span className="text-stone-800 dark:text-stone-200 font-semibold">
            Primo PVC Wall Panels
          </span>
        </nav>

        {/* Centered Massive 'PRIMO' Word */}
        <div className="relative w-full px-4 sm:px-8 lg:px-12 flex flex-col items-center justify-center my-auto">
          {/* Mobile Top Minimal Badge */}
          <div className="md:hidden mb-3 text-center">
            <span className="text-[10px] font-mono tracking-widest text-stone-400 dark:text-stone-500 uppercase font-semibold">
              [ PRIMO COLLECTION • 2026 ]
            </span>
          </div>

          {/* Mask Container: Clean, perfectly straight letters with zero shadow */}
          <div
            ref={heroMaskContainerRef}
            className="relative flex items-center justify-center select-none"
          >
            {/* Layer 0: Semantic H1, base visible texture, straight letters, zero shadow */}
            <h1
              className="hero-texture-layer relative font-black uppercase text-center select-none tracking-normal not-italic"
              style={{
                backgroundImage: `url(${HERO_TEXTURES[0]})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                color: 'transparent',
              }}
            >
              {/* Mobile Stacked Text */}
              <span className="flex md:hidden flex-col items-center justify-center text-[26vw] leading-[0.9] tracking-normal not-italic">
                <span>PRI</span>
                <span>MO</span>
              </span>
              {/* Desktop Single-Line Text: Straight, upright, no tilt, no shadow */}
              <span className="hidden md:block text-[20vw] leading-none tracking-normal not-italic">
                PRIMO
              </span>
              <span className="sr-only">
                Primo PVC Wall Panels — 12-Inch Architectural Seamless Wall Cladding in Gurgaon & Delhi NCR
              </span>
            </h1>

            {/* Layers 1 to 4: Subsequent scroll wipe layers */}
            {HERO_TEXTURES.slice(1).map((texUrl, idx) => (
              <div
                key={idx + 1}
                className="hero-texture-layer absolute inset-0 flex items-center justify-center pointer-events-none select-none not-italic"
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
                <div className="font-black uppercase text-center tracking-normal not-italic">
                  <span className="flex md:hidden flex-col items-center justify-center text-[26vw] leading-[0.9] tracking-normal not-italic">
                    <span>PRI</span>
                    <span>MO</span>
                  </span>
                  <span className="hidden md:block text-[20vw] leading-none tracking-normal not-italic">
                    PRIMO
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile Bottom Minimal Badge */}
          <div className="md:hidden mt-3 text-center">
            <span className="text-[9px] font-mono tracking-widest text-amber-600 dark:text-amber-400 uppercase font-semibold">
              [ SCROLL TO REVEAL SHADES ↓ ]
            </span>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION 2: SMART UNIVERSAL PRODUCT SHOWCASE COMPONENT         */}
      {/* ───────────────────────────────────────────────────────────── */}
      <ProductShowcase
        series="primo"
        allShades={shades}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        initialShadeId={('code' in (initialData || {}) && (initialData as any).code) || ('sku' in (initialData || {}) && (initialData as any).sku) || (initialData as any)?.id}
        onShadeChange={(shade) => setSelectedPanel(shade)}
        sectionId="universal-showcase"
      />

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION 3: TECHNICAL BLUEPRINT & ANATOMY (INSPECTION HUD)      */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section id="what-is-primo" className="w-full bg-stone-100/60 dark:bg-stone-900/60 py-10 sm:py-14 px-4 sm:px-8 lg:px-12 border-t border-stone-200 dark:border-stone-800">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6 pb-4 border-b border-stone-200 dark:border-stone-800">
            <h2 className="text-2xl sm:text-4xl font-black text-stone-900 dark:text-white tracking-tight">
              What is <span className="text-amber-600 dark:text-amber-400">Primo PVC</span> Wall Panel?
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed max-w-4xl mb-6 font-light">
            <strong>Primo</strong> is WholesalerJi’s flagship 12-inch (300mm) seamless flat interior cladding system. Extruded from an unadulterated virgin polymer matrix, Primo creates an impermeable, monolithic surface that permanently seals off chronic wall dampness (seelan), eliminates peeling paint, and reduces visible joints by 66% compared to conventional 100mm slats.
          </p>

          {/* Architectural Drafting Board with Isometric Vector Cross-Section */}
          <div className="relative bg-stone-950 text-stone-100 rounded-2xl p-4 sm:p-7 border border-stone-800/90 overflow-hidden font-mono shadow-2xl">
            {/* Subtle drafting grid background */}
            <div
              className="absolute inset-0 opacity-[0.06] pointer-events-none"
              style={{
                backgroundImage:
                  'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            />

            {/* High-Precision Isometric 3D Cross-Section SVG Diagram */}
            <div className="relative z-10 w-full py-3 flex items-center justify-center overflow-x-auto no-scrollbar">
              <svg
                viewBox="0 0 1060 275"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full min-w-[780px] max-w-[1040px] h-auto"
              >
                <defs>
                  {/* Surface woodgrain/warm architectural gradient */}
                  <linearGradient id="panelTopGrad1" x1="0" y1="0" x2="1" y2="0.6">
                    <stop offset="0%" stopColor="#9a6233" />
                    <stop offset="45%" stopColor="#7c4a22" />
                    <stop offset="100%" stopColor="#5c3414" />
                  </linearGradient>
                  <linearGradient id="panelTopGrad2" x1="0" y1="0" x2="1" y2="0.6">
                    <stop offset="0%" stopColor="#9a6233" />
                    <stop offset="55%" stopColor="#76451e" />
                    <stop offset="100%" stopColor="#522d10" />
                  </linearGradient>

                  {/* 3D Side faces gradients */}
                  <linearGradient id="panelSideLeft" x1="0" y1="0" x2="1" y2="0.8">
                    <stop offset="0%" stopColor="#5a3416" />
                    <stop offset="50%" stopColor="#3d210b" />
                    <stop offset="100%" stopColor="#241306" />
                  </linearGradient>
                  <linearGradient id="stepShadowGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1a120b" />
                    <stop offset="100%" stopColor="#120c07" />
                  </linearGradient>
                  <linearGradient id="flangeShelfGrad" x1="0" y1="0" x2="1" y2="0.6">
                    <stop offset="0%" stopColor="#8c582d" />
                    <stop offset="55%" stopColor="#6e3f1a" />
                    <stop offset="100%" stopColor="#4f2b0f" />
                  </linearGradient>

                  {/* Subtle woodgrain surface texture lines */}
                  <pattern id="woodGrain" width="40" height="20" patternUnits="userSpaceOnUse" patternTransform="rotate(15)">
                    <line x1="0" y1="5" x2="40" y2="5" stroke="#ffffff" strokeWidth="0.5" strokeOpacity="0.08" />
                    <line x1="0" y1="14" x2="40" y2="14" stroke="#000000" strokeWidth="0.5" strokeOpacity="0.15" />
                  </pattern>
                  {/* Inner chamber dark shadow gradient */}
                  <linearGradient id="chamberDark" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0d0b09" />
                    <stop offset="100%" stopColor="#1e1812" />
                  </linearGradient>
                </defs>

                {/* ── 1. DIMENSION ANNOTATIONS ── */}
                {/* 300mm Dimension line for Panel 1 */}
                <g stroke="#f59e0b" strokeWidth="1.5">
                  <line x1="75" y1="26" x2="475" y2="26" strokeDasharray="3 3" />
                  <line x1="75" y1="18" x2="75" y2="34" />
                  <line x1="475" y1="18" x2="475" y2="34" />
                  <circle cx="75" cy="26" r="3" fill="#f59e0b" />
                  <circle cx="475" cy="26" r="3" fill="#f59e0b" />
                </g>
                <rect x="185" y="15" width="180" height="22" rx="4" fill="#1c1917" stroke="#f59e0b" strokeWidth="1" />
                <text x="275" y="30" fill="#f59e0b" fontSize="10" textAnchor="middle" fontWeight="bold">
                  300 MM (12 INCH) SEAMLESS SPAN
                </text>

                {/* 5mm Thickness dimension indicator */}
                <g stroke="#a8a29e" strokeWidth="1.2">
                  <line x1="60" y1="78" x2="60" y2="106" />
                  <line x1="55" y1="78" x2="65" y2="78" />
                  <line x1="55" y1="106" x2="65" y2="106" />
                </g>
                <text x="50" y="95" fill="#a8a29e" fontSize="9" textAnchor="end" fontWeight="bold">
                  5MM PROFILE
                </text>

                {/* ── 2. 3D LATERAL SIDE FACES & RECEDING SURFACES ── */}
                {/* Left Side 3D Profile: Outer face of the top lip running back into perspective */}
                <polygon
                  points="75,78 140,44 140,62 75,96"
                  fill="url(#panelSideLeft)"
                  stroke="#3d210b"
                  strokeWidth="0.8"
                />
                {/* Left Side 3D Profile: Underside socket pocket shadow showing hollow groove */}
                <polygon
                  points="75,96 140,62 185,62 120,96"
                  fill="#120e0a"
                  opacity="0.95"
                  stroke="#3d210b"
                  strokeWidth="0.8"
                />

                {/* Panel 1 Top Surface */}
                <polygon
                  points="75,78 140,44 540,44 475,78"
                  fill="url(#panelTopGrad1)"
                  stroke="#45260d"
                  strokeWidth="0.8"
                />
                <polygon
                  points="75,78 140,44 540,44 475,78"
                  fill="url(#woodGrain)"
                />

                {/* Panel 2 Top Surface (Meets Panel 1 flush at x=475) */}
                <polygon
                  points="475,78 540,44 940,44 875,78"
                  fill="url(#panelTopGrad2)"
                  stroke="#45260d"
                  strokeWidth="0.8"
                />
                <polygon
                  points="475,78 540,44 940,44 875,78"
                  fill="url(#woodGrain)"
                />

                {/* Seamless Hairline Joint Line on Surface */}
                <line x1="475" y1="78" x2="540" y2="44" stroke="#f59e0b" strokeWidth="1.5" opacity="0.9" />

                {/* Right Side 3D Profile: Recessed Vertical Step Riser (dropping from top face to flange shelf) */}
                <polygon
                  points="875,78 940,44 940,62 875,96"
                  fill="url(#stepShadowGrad)"
                  stroke="#2b1a0e"
                  strokeWidth="0.8"
                />

                {/* Right Side 3D Profile: Continuous Horizontal L-Flange Fastener Shelf */}
                <polygon
                  points="875,96 940,62 985,62 920,96"
                  fill="url(#flangeShelfGrad)"
                  stroke="#3d210b"
                  strokeWidth="0.8"
                />
                <polygon
                  points="875,96 940,62 985,62 920,96"
                  fill="url(#woodGrain)"
                  opacity="0.3"
                />
                {/* Countersunk fastener hole on 3D flange shelf */}
                <ellipse cx="930" cy="79" rx="3" ry="1.8" fill="#140e0a" stroke="#d4a373" strokeWidth="0.8" />
                <ellipse cx="930" cy="79" rx="1.5" ry="0.9" fill="#000000" />

                {/* Right Side 3D Profile: Outer Rim Vertical Edge Face at x=920 */}
                <polygon
                  points="920,96 985,62 985,72 920,106"
                  fill="#231a14"
                  stroke="#2b1a0e"
                  strokeWidth="0.8"
                />

                {/* ── 3. FRONT ELEVATION PROFILE: WITH CLEAN 3PX ROUNDED CORNERS ── */}
                {/* Panel 1 Outer Shell:
                    - Left edge with 3px corner radius on top & bottom lip
                    - Underhang socket with smooth fillet
                    - Right edge with 3px corner radius on L-flange tip
                */}
                <path
                  d="
                    M 78 78
                    L 475 78
                    L 475 96
                    L 517 96
                    A 3 3 0 0 1 520 99
                    L 520 103
                    A 3 3 0 0 1 517 106
                    L 123 106
                    A 3 3 0 0 1 120 103
                    L 120 98.5
                    A 2.5 2.5 0 0 0 117.5 96
                    L 78 96
                    A 3 3 0 0 1 75 93
                    L 75 81
                    A 3 3 0 0 1 78 78
                    Z
                  "
                  fill="#2b231c"
                  stroke="#d97706"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />

                {/* Panel 1 Hollow Cellular Square Chambers (20px x 20px) */}
                {Array.from({ length: 13 }).map((_, i) => {
                  const cx = 132 + i * 26;
                  return (
                    <g key={`p1-cell-${i}`}>
                      <rect
                        x={cx}
                        y={82}
                        width={20}
                        height={20}
                        rx={2}
                        fill="url(#chamberDark)"
                        stroke="#d4a373"
                        strokeWidth="1.2"
                      />
                      <path
                        d={`M${cx} 82 L${cx + 3} 80 L${cx + 23} 80 L${cx + 20} 82 Z`}
                        fill="#080705"
                        opacity="0.85"
                      />
                    </g>
                  );
                })}

                {/* Panel 2 Outer Shell (IDENTICAL PROFILE, SHIFTED +400px):
                    - Left socket locks flush over Panel 1's L-flange
                    - Right L-flange with 3px corner radius on outer tips
                */}
                <path
                  d="
                    M 475 78
                    L 872 78
                    A 3 3 0 0 1 875 81
                    L 875 93.5
                    A 2.5 2.5 0 0 0 877.5 96
                    L 917 96
                    A 3 3 0 0 1 920 99
                    L 920 103
                    A 3 3 0 0 1 917 106
                    L 523 106
                    A 3 3 0 0 1 520 103
                    L 520 98.5
                    A 2.5 2.5 0 0 0 517.5 96
                    L 475 96
                    L 475 78
                    Z
                  "
                  fill="#241d17"
                  stroke="#f59e0b"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />

                {/* Panel 2 Hollow Cellular Square Chambers (20px x 20px) */}
                {Array.from({ length: 13 }).map((_, i) => {
                  const cx = 532 + i * 26;
                  return (
                    <g key={`p2-cell-${i}`}>
                      <rect
                        x={cx}
                        y={82}
                        width={20}
                        height={20}
                        rx={2}
                        fill="url(#chamberDark)"
                        stroke="#d4a373"
                        strokeWidth="1.2"
                      />
                      <path
                        d={`M${cx} 82 L${cx + 3} 80 L${cx + 23} 80 L${cx + 20} 82 Z`}
                        fill="#080705"
                        opacity="0.85"
                      />
                    </g>
                  );
                })}

                {/* Mechanical Screw / Fastener Points on the Right L-Flanges */}
                {/* Panel 1's L-flange screw (hidden beneath Panel 2) */}
                <circle cx="502" cy="101" r="2.5" fill="#34d399" stroke="#ffffff" strokeWidth="0.8" />
                <line x1="499" y1="101" x2="505" y2="101" stroke="#ffffff" strokeWidth="0.8" />
                <line x1="502" y1="98" x2="502" y2="104" stroke="#ffffff" strokeWidth="0.8" />

                {/* Panel 2's L-flange screw (ready for consecutive panel) */}
                <circle cx="902" cy="101" r="2.5" fill="#ef4444" stroke="#ffffff" strokeWidth="0.8" />
                <line x1="899" y1="101" x2="905" y2="101" stroke="#ffffff" strokeWidth="0.8" />
                <line x1="902" y1="98" x2="902" y2="104" stroke="#ffffff" strokeWidth="0.8" />

                {/* ── 4. ARCHITECTURAL TECHNICAL LEADER LINES & CALLOUTS ── */}
                {/* Callout 1: Cellular Honeycomb Core */}
                <g>
                  <circle cx="288" cy="92" r="5" fill="#f59e0b" />
                  <circle cx="288" cy="92" r="9" fill="none" stroke="#f59e0b" strokeWidth="1" strokeDasharray="2 2" className="animate-pulse" />
                  <path d="M288 106 L288 165 L200 165" stroke="#f59e0b" strokeWidth="1.5" fill="none" />
                  <circle cx="200" cy="165" r="3" fill="#f59e0b" />
                  <rect x="25" y="172" width="310" height="50" rx="6" fill="#14110e" stroke="#2e2720" strokeWidth="1" />
                  <text x="37" y="191" fill="#f59e0b" fontSize="10" fontWeight="bold">
                    EXTRUDED CELLULAR HONEYCOMB CORE
                  </text>
                  <text x="37" y="209" fill="#d6d3d1" fontSize="9" fontWeight="normal">
                    Multi-chamber hollow cells • High structural rigidity,
                  </text>
                  <text x="37" y="218" fill="#a8a29e" fontSize="8.5" fontWeight="normal">
                    thermal insulation & ultra-light 2.8kg profile weight.
                  </text>
                </g>

                {/* Callout 2: Seamless Interlock Joint */}
                <g>
                  <circle cx="475" cy="78" r="5" fill="#34d399" />
                  <circle cx="475" cy="78" r="9" fill="none" stroke="#34d399" strokeWidth="1" strokeDasharray="2 2" className="animate-pulse" />
                  <path d="M475 106 L475 210 L520 210" stroke="#34d399" strokeWidth="1.5" fill="none" />
                  <circle cx="520" cy="210" r="3" fill="#34d399" />
                  <rect x="355" y="216" width="320" height="50" rx="6" fill="#14110e" stroke="#2e2720" strokeWidth="1" />
                  <text x="367" y="235" fill="#34d399" fontSize="10" fontWeight="bold">
                    SEAMLESS L-FLANGE INTERLOCK
                  </text>
                  <text x="367" y="253" fill="#d6d3d1" fontSize="9" fontWeight="normal">
                    Panel 2 receiver locks flush over Panel 1 L-flange •
                  </text>
                  <text x="367" y="262" fill="#a8a29e" fontSize="8.5" fontWeight="normal">
                    100% moisture barrier; fastener screw is completely concealed.
                  </text>
                </g>

                {/* Callout 3: Concealed L-Shape Fastening Lip */}
                <g>
                  <circle cx="902" cy="101" r="5" fill="#ef4444" />
                  <circle cx="902" cy="101" r="9" fill="none" stroke="#ef4444" strokeWidth="1" strokeDasharray="2 2" className="animate-pulse" />
                  <path d="M902 106 L902 165 L840 165" stroke="#ef4444" strokeWidth="1.5" fill="none" />
                  <circle cx="840" cy="165" r="3" fill="#ef4444" />
                  <rect x="715" y="172" width="310" height="50" rx="6" fill="#14110e" stroke="#2e2720" strokeWidth="1" />
                  <text x="727" y="191" fill="#ef4444" fontSize="10" fontWeight="bold">
                    CONCEALED L-SHAPE FASTENING LIP
                  </text>
                  <text x="727" y="209" fill="#d6d3d1" fontSize="9" fontWeight="normal">
                    Extended horizontal flange with screw anchor point •
                  </text>
                  <text x="727" y="218" fill="#a8a29e" fontSize="8.5" fontWeight="normal">
                    100% hidden by consecutive panel overhang.
                  </text>
                </g>
              </svg>
            </div>
          </div>

          {/* High-Density Integrated Engineering Ticker Strip */}
          <div className="mt-4 pt-4 border-t border-stone-200 dark:border-stone-800 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4 text-[11px] font-mono">
            <div className="flex flex-col">
              <span className="text-stone-500 uppercase text-[9px]">PANEL LENGTH</span>
              <strong className="text-stone-900 dark:text-white">2950 mm (9.6 Ft)</strong>
            </div>
            <div className="flex flex-col">
              <span className="text-stone-500 uppercase text-[9px]">EFFECTIVE WIDTH</span>
              <strong className="text-stone-900 dark:text-white">300 mm (12 Inches)</strong>
            </div>
            <div className="flex flex-col">
              <span className="text-stone-500 uppercase text-[9px]">SOLID THICKNESS</span>
              <strong className="text-stone-900 dark:text-white">5 mm Calibration</strong>
            </div>
            <div className="flex flex-col">
              <span className="text-stone-500 uppercase text-[9px]">WATER ABSORPTION</span>
              <strong className="text-emerald-600 dark:text-emerald-400">&lt;0.2% (Impermeable)</strong>
            </div>
            <div className="flex flex-col">
              <span className="text-stone-500 uppercase text-[9px]">FIRE RATING</span>
              <strong className="text-amber-600 dark:text-amber-400">Class B1 Retardant</strong>
            </div>
            <div className="flex flex-col">
              <span className="text-stone-500 uppercase text-[9px]">EXPORT PACKAGING</span>
              <strong className="text-stone-900 dark:text-white">10 Pcs / Box (95.2 sq ft)</strong>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION 4: CURATED SPATIAL PERFORMANCE (PANORAMIC VIEWPORT)   */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section id="applications" className="w-full bg-white dark:bg-stone-950 py-10 sm:py-14 px-4 sm:px-8 lg:px-12 border-t border-stone-200 dark:border-stone-800">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 block mb-1">
                [ 02 • SPATIAL PERFORMANCE & ROOM ARCHITECTURES ]
              </span>
              <h2 className="text-xl sm:text-3xl font-black text-stone-900 dark:text-white tracking-tight">
                Where Primo Performs: Curated Spaces
              </h2>
            </div>
            <span className="text-xs font-mono text-stone-500">
              Select space to preview installed architectural fitment
            </span>
          </div>

          {/* Horizontal Architectural Lens Selector */}
          <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4 no-scrollbar">
            {APPLICATION_SPACES.map((space, idx) => {
              const isActive = activeSpaceIndex === idx;
              return (
                <button
                  key={space.id}
                  onClick={() => setActiveSpaceIndex(idx)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition-all whitespace-nowrap cursor-pointer flex-shrink-0 flex items-center gap-2 ${
                    isActive
                      ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                      : 'bg-stone-100 dark:bg-stone-900 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white border border-stone-200/80 dark:border-stone-800'
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full border border-black/20"
                    style={{ backgroundColor: space.swatch }}
                  />
                  <span>{space.name}</span>
                </button>
              );
            })}
          </div>

          {/* Panoramic Low-Profile Stage with Integrated HUD */}
          {(() => {
            const sp = APPLICATION_SPACES[activeSpaceIndex];
            return (
              <div className="relative rounded-2xl overflow-hidden h-64 sm:h-80 lg:h-96 w-full border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col justify-between p-4 sm:p-6 bg-stone-900">
                {/* Background Panoramic Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-all duration-700"
                  style={{ backgroundImage: `url(${sp.image})` }}
                />
                {/* Contrast Vignette Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-stone-950/20 pointer-events-none" />

                {/* Top Badge Strip */}
                <div className="relative z-10 flex items-center justify-between gap-3">
                  <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-500 text-stone-950">
                    {sp.badge}
                  </span>
                  <div className="flex items-center gap-2 bg-stone-950/80 backdrop-blur px-3 py-1 rounded-full border border-stone-800 text-[11px] font-mono text-stone-200">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: sp.swatch }} />
                    <span>Recommended: {sp.shadeCode} {sp.shadeName}</span>
                  </div>
                </div>

                {/* Bottom Architectural HUD */}
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-4 border-t border-white/10">
                  <div className="max-w-2xl">
                    <h3 className="text-lg sm:text-2xl font-black text-white tracking-tight mb-1">
                      {sp.headline}
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed">
                      {sp.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-[11px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/30">
                      {sp.stat}
                    </span>
                    <a
                      href="#universal-showcase"
                      className="px-3.5 py-1.5 rounded-lg bg-white/90 hover:bg-white text-stone-950 text-xs font-mono font-bold uppercase transition-colors"
                    >
                      Inspect in Catalog ↑
                    </a>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION 5: 3-STAGE TRANSFORMATION HORIZON                     */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section id="installed-storytelling" className="w-full bg-stone-100/60 dark:bg-stone-900/40 py-10 sm:py-14 px-4 sm:px-8 lg:px-12 border-t border-stone-200 dark:border-stone-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 block mb-1">
                [ 03 • PROGRESSION HORIZON ]
              </span>
              <h2 className="text-xl sm:text-3xl font-black text-stone-900 dark:text-white tracking-tight">
                Transformation: From Raw Slab to Living Surface
              </h2>
            </div>
            <span className="text-xs font-mono text-stone-500">
              Interactive 3-stage assembly lifecycle
            </span>
          </div>

          {/* Continuous Integrated Horizon Rail (No 3 Box Containers) */}
          <div className="relative border border-stone-200 dark:border-stone-800 rounded-2xl bg-white dark:bg-stone-950 p-4 sm:p-6 overflow-hidden">
            {/* Step Selector Horizontal Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
              {TRANSFORMATION_PHASES.map((ph, idx) => {
                const isActive = activeTimelinePhase === idx;
                return (
                  <button
                    key={ph.phase}
                    onClick={() => setActiveTimelinePhase(idx)}
                    className={`text-left p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      isActive
                        ? 'bg-amber-500/10 border-amber-500 text-stone-950 dark:text-white font-bold'
                        : 'bg-stone-50 dark:bg-stone-900/60 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:border-stone-400 dark:hover:border-stone-700'
                    }`}
                  >
                    <div>
                      <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400 block">
                        STAGE {ph.phase}
                      </span>
                      <strong className="text-xs sm:text-sm font-bold text-stone-900 dark:text-white">
                        {ph.name}
                      </strong>
                    </div>
                    <span className="text-[10px] font-mono opacity-80">{ph.status}</span>
                  </button>
                );
              })}
            </div>

            {/* Active Stage Inspection Pane */}
            {(() => {
              const active = TRANSFORMATION_PHASES[activeTimelinePhase];
              return (
                <div className="pt-4 border-t border-stone-100 dark:border-stone-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[11px] font-mono text-amber-600 dark:text-amber-400 font-bold block mb-1">
                      {active.spec} • {active.status}
                    </span>
                    <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 font-light max-w-3xl leading-relaxed">
                      {active.highlight}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <span className="px-3 py-1 rounded bg-stone-100 dark:bg-stone-900 border border-stone-300 dark:border-stone-800 text-stone-900 dark:text-white font-mono font-bold text-xs">
                      {active.metric}
                    </span>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION 6: WHY SPECIFY PRIMO (COMPARATIVE BAR MATRIX)         */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section id="why-primo" className="w-full bg-white dark:bg-stone-950 py-10 sm:py-14 px-4 sm:px-8 lg:px-12 border-t border-stone-200 dark:border-stone-800">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mb-8">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 block mb-1">
              [ 04 • FACTUAL DIFFERENTIATORS ]
            </span>
            <h2 className="text-xl sm:text-3xl font-black text-stone-900 dark:text-white tracking-tight">
              Why Specify Primo: Engineering Benchmarks
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-stone-600 dark:text-stone-400 font-light">
              Objective technical advantages over standard 100mm PVC slats, brittle recycled regrinds, and high-maintenance wood paneling.
            </p>
          </div>

          {/* Hairline Editorial Comparative Register (No 3x2 Rounded Card Boxes) */}
          <div className="border-t border-stone-200 dark:border-stone-800 divide-y divide-stone-200 dark:divide-stone-800">
            {ENGINEERING_BENCHMARKS.map((item, idx) => (
              <div
                key={idx}
                className="py-4 sm:py-5 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
              >
                {/* Metric Title & Advantage */}
                <div className="w-full md:w-1/3">
                  <span className="text-[10px] font-mono text-stone-400 block mb-0.5">
                    PARAM 0{idx + 1}
                  </span>
                  <strong className="text-sm font-bold text-stone-900 dark:text-white block">
                    {item.title}
                  </strong>
                  <span className="text-[11px] font-mono text-amber-600 dark:text-amber-400 font-semibold">
                    {item.advantage}
                  </span>
                </div>

                {/* Comparative Visual Bars */}
                <div className="w-full md:w-1/2 space-y-1.5">
                  {/* Primo Metric */}
                  <div>
                    <div className="flex justify-between text-[11px] mb-0.5 font-mono">
                      <span className="font-bold text-amber-600 dark:text-amber-400">PRIMO: {item.primoVal}</span>
                      <span className="text-stone-500">Benchmark Win</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-stone-200 dark:bg-stone-800 overflow-hidden">
                      <div className={`h-full bg-amber-500 rounded-full ${item.primoBar}`} />
                    </div>
                  </div>

                  {/* Standard Alternative Metric */}
                  <div>
                    <div className="flex justify-between text-[10px] mb-0.5 font-mono text-stone-500">
                      <span>Standard Alternative: {item.altVal}</span>
                    </div>
                    <div className="w-full h-1 rounded-full bg-stone-200 dark:bg-stone-800 overflow-hidden">
                      <div className={`h-full bg-stone-400 dark:bg-stone-600 rounded-full ${item.altBar}`} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION 7: WHOLESALE TRADE TERMINAL & BOQ ESTIMATOR           */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section id="pricing-wholesale" className="w-full bg-stone-100/60 dark:bg-stone-900/40 py-10 sm:py-14 px-4 sm:px-8 lg:px-12 border-t border-stone-200 dark:border-stone-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 block mb-1">
                [ 05 • TRADE TERMINAL & LOCAL NCR DISPATCH ]
              </span>
              <h2 className="text-xl sm:text-3xl font-black text-stone-900 dark:text-white tracking-tight">
                Wholesale Pricing & Real-Time BOQ Estimator
              </h2>
            </div>
            <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold">
              ● Sector 34 Gurugram Stockyard Active
            </span>
          </div>

          {/* Integrated Interactive Trade Dashboard (No giant empty boxes) */}
          <div className="border border-stone-200 dark:border-stone-800 rounded-2xl bg-white dark:bg-stone-950 p-4 sm:p-7 shadow-sm">
            {/* Top Base Price Strip */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200 dark:border-stone-800">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-black text-amber-600 dark:text-amber-400">
                  ₹499
                </span>
                <span className="text-xs font-mono text-stone-500">/ piece (2950 × 300 mm)</span>
                <span className="text-xs text-stone-400 line-through">MRP ₹990</span>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono text-stone-700 dark:text-stone-300">
                <span className="font-bold text-emerald-600 dark:text-emerald-400">~₹52 / Sq. Ft. Material</span>
                <span>•</span>
                <span>10 Pcs/Box (95.2 Sq. Ft. Coverage)</span>
              </div>
            </div>

            {/* Interactive BOQ Calculator Strip */}
            <div className="py-6 border-b border-stone-200 dark:border-stone-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <span className="text-xs font-mono font-bold text-stone-700 dark:text-stone-300 uppercase">
                  ENTER WALL AREA (SQ. FT.) TO ESTIMATE MATERIAL:
                </span>
                <div className="flex items-center gap-1.5">
                  {[100, 200, 500, 1000].map((preset) => (
                    <button
                      key={preset}
                      onClick={() => setCalcSqFt(preset)}
                      className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors cursor-pointer ${
                        calcSqFt === preset
                          ? 'bg-amber-500 text-stone-950 font-bold'
                          : 'bg-stone-100 dark:bg-stone-900 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-800'
                      }`}
                    >
                      {preset} sq ft
                    </button>
                  ))}
                </div>
              </div>

              {/* Input & Output HUD */}
              {(() => {
                const sqft = Math.max(10, calcSqFt || 0);
                const rawPanels = Math.ceil(sqft / 9.52);
                const panelsWithWastage = Math.ceil(rawPanels * 1.08); // 8% buffer
                const boxesNeeded = Math.ceil(panelsWithWastage / 10);
                const suppliedPanels = boxesNeeded * 10;
                const totalCost = suppliedPanels * 499;
                const framingSaving = Math.round(sqft * 70);

                return (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-stone-50 dark:bg-stone-900 p-4 rounded-xl text-xs font-mono">
                    <div>
                      <span className="text-[10px] text-stone-500 block mb-0.5">PANELS (INC 8% BUFFER)</span>
                      <strong className="text-base text-stone-900 dark:text-white block">
                        {panelsWithWastage} pcs
                      </strong>
                      <span className="text-[10px] text-stone-400">{rawPanels} net required</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-500 block mb-0.5">FULL EXPORT CARTONS</span>
                      <strong className="text-base text-stone-900 dark:text-white block">
                        {boxesNeeded} boxes
                      </strong>
                      <span className="text-[10px] text-stone-400">{suppliedPanels} pcs ({boxesNeeded * 95.2} sq ft)</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-500 block mb-0.5">ESTIMATED TRADE COST</span>
                      <strong className="text-base text-amber-600 dark:text-amber-400 block">
                        ₹{totalCost.toLocaleString('en-IN')}
                      </strong>
                      <span className="text-[10px] text-stone-400">+ GST (Input Credit Safe)</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block mb-0.5">
                        PLYWOOD FRAMING SAVED
                      </span>
                      <strong className="text-base text-emerald-600 dark:text-emerald-400 block">
                        ₹{framingSaving.toLocaleString('en-IN')}
                      </strong>
                      <span className="text-[10px] text-stone-400">Zero ₹70/sqft ply framing</span>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Bottom Gurugram Dispatch & Action Radar */}
            <div className="pt-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1 text-xs text-stone-600 dark:text-stone-400 font-light">
                <div className="flex items-center gap-2">
                  <span className="text-amber-500 font-bold">📍</span>
                  <span><strong>Central Stockyard:</strong> Sector 34, Gurugram, Haryana (Ready 2,400+ Boxes)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-500 font-bold">⚡</span>
                  <span><strong>24–48h NCR Express Zones:</strong> DLF 1–5, Golf Course Rd, Sohna Rd, Cyber Hub, Noida Sec 62.</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href={`https://wa.me/919217400163?text=Hi%20WholesalerJi%2C%20I%20need%20a%20wholesale%20quote%20for%20${calcSqFt}%20sq%20ft%20of%20Primo%20Panels%20in%20Gurgaon.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs uppercase tracking-wider transition-colors whitespace-nowrap"
                >
                  WhatsApp Stock Reservation →
                </a>
                <a
                  href="tel:+919217400163"
                  className="px-4 py-2.5 rounded-xl bg-stone-100 dark:bg-stone-900 text-stone-900 dark:text-white hover:bg-stone-200 dark:hover:bg-stone-800 font-mono font-bold text-xs uppercase tracking-wider transition-colors whitespace-nowrap"
                >
                  Call +91 92174 00163
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION 8: FOR INDUSTRY PROFESSIONALS (SPECIFIER CONSOLE)     */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section id="b2b-personas" className="w-full bg-white dark:bg-stone-950 py-10 sm:py-14 px-4 sm:px-8 lg:px-12 border-t border-stone-200 dark:border-stone-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 block mb-1">
                [ 06 • SPECIFIER CONSOLE ]
              </span>
              <h2 className="text-xl sm:text-3xl font-black text-stone-900 dark:text-white tracking-tight">
                Engineered for Industry Professionals
              </h2>
            </div>
            <span className="text-xs font-mono text-stone-500">
              Select category to view trade deliverables
            </span>
          </div>

          {/* Segmented Persona Control Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-4 no-scrollbar">
            {TRADE_PERSONAS.map((p, idx) => {
              const isActive = activePersonaIndex === idx;
              return (
                <button
                  key={p.id}
                  onClick={() => setActivePersonaIndex(idx)}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all whitespace-nowrap cursor-pointer flex-shrink-0 ${
                    isActive
                      ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                      : 'bg-stone-100 dark:bg-stone-900 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                  }`}
                >
                  {p.role}
                </button>
              );
            })}
          </div>

          {/* Specifier Docket (Integrated Compact Stage) */}
          {(() => {
            const persona = TRADE_PERSONAS[activePersonaIndex];
            return (
              <div className="border border-stone-200 dark:border-stone-800 rounded-2xl bg-stone-50 dark:bg-stone-900/60 p-4 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex-1">
                  <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400 uppercase font-bold tracking-wider block mb-1">
                    {persona.docketTitle}
                  </span>
                  <div className="space-y-2 text-xs sm:text-sm text-stone-700 dark:text-stone-300 font-light">
                    {persona.features.map((feat, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="text-amber-500 font-bold">✔</span>
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <a
                    href={persona.actionUrl}
                    className="inline-flex items-center px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-mono font-bold uppercase tracking-wider transition-colors whitespace-nowrap"
                  >
                    {persona.actionLabel} →
                  </a>
                </div>
              </div>
            );
          })()}
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION 9: INSTALLATION PROTOCOL (STEP SEQUENCE)              */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section id="installation-guide" className="w-full bg-stone-100/60 dark:bg-stone-900/40 py-10 sm:py-14 px-4 sm:px-8 lg:px-12 border-t border-stone-200 dark:border-stone-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 block mb-1">
                [ 07 • CARPENTRY ASSEMBLY PROTOCOL ]
              </span>
              <h2 className="text-xl sm:text-3xl font-black text-stone-900 dark:text-white tracking-tight">
                Field-Tested Joinery & Installation Track
              </h2>
            </div>
            <span className="text-xs font-mono text-stone-500">
              Up to 400 sq ft / day execution velocity
            </span>
          </div>

          {/* Interactive Horizontal 5-Step Stepper */}
          <div className="border border-stone-200 dark:border-stone-800 rounded-2xl bg-white dark:bg-stone-950 p-4 sm:p-6 shadow-sm">
            <div className="flex items-center gap-2 overflow-x-auto pb-4 border-b border-stone-200 dark:border-stone-800 no-scrollbar">
              {INSTALL_STEPS.map((st, i) => {
                const isSelected = activeInstallStep === i;
                return (
                  <button
                    key={st.num}
                    onClick={() => setActiveInstallStep(i)}
                    className={`px-3 py-2 rounded-xl text-left transition-all cursor-pointer flex-shrink-0 flex items-center gap-2 border ${
                      isSelected
                        ? 'bg-amber-500 text-stone-950 border-amber-500 font-bold shadow-sm'
                        : 'bg-stone-50 dark:bg-stone-900 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-stone-800 hover:border-stone-400'
                    }`}
                  >
                    <span className="text-xs font-mono font-black">{st.num}</span>
                    <span className="text-xs whitespace-nowrap">{st.title}</span>
                  </button>
                );
              })}
            </div>

            {/* Active Step Details */}
            {(() => {
              const active = INSTALL_STEPS[activeInstallStep];
              return (
                <div className="pt-4 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold">
                        PHASE: {active.phase}
                      </span>
                      <strong className="text-stone-900 dark:text-white font-mono text-sm">
                        Step {active.num}: {active.title}
                      </strong>
                    </div>
                    <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 font-light leading-relaxed max-w-3xl">
                      {active.instruction}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-mono text-xs max-w-sm flex-shrink-0">
                    <span className="font-bold block text-[10px] text-emerald-600 dark:text-emerald-400 uppercase">
                      PRO CARPENTRY TIP:
                    </span>
                    {active.proTip}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION 10: OBJECTIVE MATERIAL BENCHMARK (STICKY TABLE)       */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section id="comparison" className="w-full bg-white dark:bg-stone-950 py-10 sm:py-14 px-4 sm:px-8 lg:px-12 border-t border-stone-200 dark:border-stone-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 block mb-1">
                [ 08 • OBJECTIVE MATERIAL BENCHMARK ]
              </span>
              <h2 className="text-xl sm:text-3xl font-black text-stone-900 dark:text-white tracking-tight">
                Primo vs Alternatives: Factual Comparison
              </h2>
            </div>
            <span className="text-xs font-mono text-stone-500">
              Scroll horizontally on mobile to compare
            </span>
          </div>

          {/* Clean High-Density Table with Sticky First Column */}
          <div className="overflow-x-auto border border-stone-200 dark:border-stone-800 rounded-2xl bg-white dark:bg-stone-900 shadow-sm">
            <table className="w-full text-left text-xs border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-stone-200 dark:border-stone-800 bg-stone-100/70 dark:bg-stone-950/70 font-mono">
                  <th className="py-3 px-4 font-bold text-stone-900 dark:text-white sticky left-0 bg-stone-100 dark:bg-stone-950 z-10">
                    EVALUATION METRIC
                  </th>
                  <th className="py-3 px-4 font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10">
                    PRIMO PVC PANELS
                  </th>
                  <th className="py-3 px-4 font-medium text-stone-600 dark:text-stone-400">NATURAL TIMBER</th>
                  <th className="py-3 px-4 font-medium text-stone-600 dark:text-stone-400">WPC LOUVERS</th>
                  <th className="py-3 px-4 font-medium text-stone-600 dark:text-stone-400">WALLPAPER</th>
                  <th className="py-3 px-4 font-medium text-stone-600 dark:text-stone-400">WALL PAINT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 dark:divide-stone-800 font-light">
                {COMPARISON_ROWS.map((row, i) => (
                  <tr key={i} className="hover:bg-stone-50/50 dark:hover:bg-stone-800/30">
                    <td className="py-3 px-4 font-medium text-stone-900 dark:text-white sticky left-0 bg-white dark:bg-stone-900 z-10">
                      {row.metric}
                    </td>
                    <td className="py-3 px-4 font-bold text-amber-600 dark:text-amber-400 bg-amber-500/5 font-mono">
                      {row.primo}
                    </td>
                    <td className="py-3 px-4 text-stone-600 dark:text-stone-400">{row.wood}</td>
                    <td className="py-3 px-4 text-stone-600 dark:text-stone-400">{row.wpc}</td>
                    <td className="py-3 px-4 text-stone-600 dark:text-stone-400">{row.wallpaper}</td>
                    <td className="py-3 px-4 text-stone-600 dark:text-stone-400">{row.paint}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION 11: SISTER COLLECTIONS STRIP                          */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section id="collections-hub" className="w-full bg-stone-100/60 dark:bg-stone-900/40 py-8 sm:py-12 px-4 sm:px-8 lg:px-12 border-t border-stone-200 dark:border-stone-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">
              [ 09 • SISTER ARCHITECTURAL COLLECTIONS ]
            </span>
            <Link href="/wall-panels" className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 hover:underline">
              View All Wall Panel Series →
            </Link>
          </div>

          {/* Minimalist Horizontal Material Specimen Strip */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Link
              href="/wall-panels/elite"
              className="p-4 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-amber-500 transition-colors flex items-center justify-between group"
            >
              <div>
                <span className="text-[10px] font-mono text-stone-500 uppercase block">High-Gloss Marble Slabs</span>
                <strong className="text-sm font-bold text-stone-900 dark:text-white group-hover:text-amber-500 transition-colors">
                  Elite Panels →
                </strong>
              </div>
              <span className="text-xs font-mono text-stone-500">12 Shades</span>
            </Link>

            <Link
              href="/wall-panels/primo-fluted"
              className="p-4 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-amber-500 transition-colors flex items-center justify-between group"
            >
              <div>
                <span className="text-[10px] font-mono text-stone-500 uppercase block">Wood Fluted Louvers</span>
                <strong className="text-sm font-bold text-stone-900 dark:text-white group-hover:text-amber-500 transition-colors">
                  Primo Fluted →
                </strong>
              </div>
              <span className="text-xs font-mono text-stone-500">13 Finishes</span>
            </Link>

            <Link
              href="/wall-panels/elite-fluted"
              className="p-4 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-amber-500 transition-colors flex items-center justify-between group"
            >
              <div>
                <span className="text-[10px] font-mono text-stone-500 uppercase block">9mm Premium WPC Louver</span>
                <strong className="text-sm font-bold text-stone-900 dark:text-white group-hover:text-amber-500 transition-colors">
                  Elite Fluted →
                </strong>
              </div>
              <span className="text-xs font-mono text-stone-500">Deep Shadow</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION 12: FREQUENTLY ASKED QUESTIONS                        */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section id="faq-section" className="w-full bg-white dark:bg-stone-950 py-10 sm:py-16 px-4 sm:px-8 lg:px-12 border-t border-stone-200 dark:border-stone-800">
        <div className="max-w-4xl mx-auto">
          <FAQ
            title="Frequently Asked Questions — Primo Wall Panels"
            subtitle="[ 10 • SEARCH & TECHNICAL FAQ ]"
            description="Clear, factual answers regarding Primo pricing, damp wall installation, fire certifications, and wholesale supply in Gurgaon and across India."
            items={PRIMO_FAQS}
          />
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION 13: PROJECT RFQ DESK                                  */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section id="rfq-section" className="w-full px-4 sm:px-8 lg:px-12 py-10 sm:py-16 bg-stone-100/80 dark:bg-stone-900/60 border-t border-stone-200 dark:border-stone-800 relative overflow-hidden">
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="text-center mb-8">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 block mb-1">
              [ 11 • TRADE RFQ DESK ]
            </span>
            <h2 className="text-xl sm:text-3xl font-black text-stone-900 dark:text-white tracking-tight mb-1">
              Ready to Specify Primo?
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 font-light leading-relaxed">
              Request a B2B quotation, architectural swatch delivery in Gurgaon & NCR, or schedule bulk mill dispatch.
            </p>
          </div>
          <div className="shadow-lg rounded-2xl overflow-hidden">
            <LeadForm
              initialProductName={selectedPanel.name}
              initialProductSku={selectedPanel.code}
              initialMaterial="Primo Wall Panels"
            />
          </div>
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
            href={`https://wa.me/919217400163?text=Inquiring%20about%20Wholesale%20Rate%20for%20Primo%20${encodeURIComponent(selectedPanel.name)}%20(SKU:%20${selectedPanel.code})`}
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
