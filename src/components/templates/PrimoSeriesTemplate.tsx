'use client';

import React, { useRef, useState, useEffect, useLayoutEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PanelProduct } from '@/data/types';
import {
  PRIMO_WALL_PANELS,
  PRIMO_HERO_TEXTURES as HERO_TEXTURES,
  PRIMO_FAQS,
  PRIMO_ACRONYM_DATA,
} from '@/data/primoPanelsData';
import { WallPanelProduct } from '@/sanity/schemas/product';
import ProductShowcase from '@/components/ProductShowcase';
import FAQ from '@/components/FAQ';
import {
  Compass,
  Wrench,
  Store,
  Building2,
  Check,
  ArrowRight,
  Phone,
  FileText,
  X,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────
// BESPOKE ARCHITECTURAL DATA STRUCTURES
// ─────────────────────────────────────────────────────────────
const APPLICATION_SPACES = [
  {
    id: 'living-room',
    name: 'Living Lounge',
    badge: 'Living Lounge',
    shadeCode: 'GF-302',
    shadeName: 'Natural Warm Oak',
    swatch: '#C2A382',
    headline: '12-Inch Seamless Architectural Canvas',
    description: 'Eliminates busy vertical joint lines behind modular sofas, replacing maintenance-heavy paint with a durable Scandinavian wood grain.',
    image: 'https://res.cloudinary.com/def2qsxjg/image/upload/v1790874187/GF-302_Premium_Pvc_Panel_Primo_Series_in_living_room.jpg',
    altText: 'Primo GF-302 Natural Warm Oak PVC wall panel installed on living room feature wall',
    stat: 'Monolithic Wall Span',
  },
  {
    id: 'tv-wall',
    name: 'TV Media Console',
    badge: 'TV Unit Area',
    shadeCode: 'GF-308',
    shadeName: 'Royal Dark Walnut',
    swatch: '#3D2F27',
    headline: 'Concealed Wiring & Anti-Glare Backdrop',
    description: 'Deep mineral and walnut tones reduce reflection around OLED displays. The rear hollow channel hides cables with zero wall chiseling.',
    image: 'https://res.cloudinary.com/def2qsxjg/image/upload/v1790874900/GF-308_Premium_Pvc_Panel_Dark_Brown_behind_tv_unit.png',
    altText: 'Primo GF-308 Royal Dark Walnut wall panel installed behind TV media unit',
    stat: 'Zero Wall Chiseling',
  },
  {
    id: 'bedroom',
    name: 'Master Bedhead',
    badge: 'Bedroom Accent',
    shadeCode: 'GF-307',
    shadeName: 'Nordic Oak Fluted',
    swatch: '#B89B72',
    headline: 'Tactile Wood Warmth with Zero Formaldehyde',
    description: '100% virgin polymer extrusion is completely odorless, ensuring clean indoor air quality and luxury hotel-grade styling behind master beds.',
    image: 'https://res.cloudinary.com/def2qsxjg/image/upload/v1790874831/GF-307_Premium_Pvc_Panel_twelve_Inch_in_bedroom.png',
    altText: 'Primo GF-307 Nordic Oak Fluted panel installed behind master bedhead',
    stat: '100% Odorless Air',
  },
  {
    id: 'office',
    name: 'Executive Office',
    badge: 'Commercial Grade',
    shadeCode: 'GF-304',
    shadeName: 'Modern Teak Oak',
    swatch: '#A58E74',
    headline: 'Commercial Toughness with Zero Polish',
    description: 'Withstands accidental chair impacts and scuffs in high-profile office suites. Certified Class B1 flame retardant for commercial compliance.',
    image: 'https://res.cloudinary.com/def2qsxjg/image/upload/v1790874235/GF-304_New_Launch_Wall_Panel_Design_in_office.jpg',
    altText: 'Primo GF-304 Modern Teak Oak wall cladding installed in executive office suite',
    stat: 'Commercial Fire Safe',
  },
  {
    id: 'dining',
    name: 'Dining Hall',
    badge: 'Dining Area',
    shadeCode: 'GF-306',
    shadeName: 'Italian Fluted Grain',
    swatch: '#D8D0C5',
    headline: '100% Waterproof & Stain-Resistant Dining Space',
    description: 'Impervious to cooking steam and food splatters. Wipes completely clean with a microfiber cloth with zero water absorption.',
    image: 'https://res.cloudinary.com/def2qsxjg/image/upload/v1790907798/GF-306_Premium_Pvc_Panel_in_dining_hall.png',
    altText: 'Primo GF-306 Italian Fluted Grain waterproof wall panel installed in dining area',
    stat: '100% Stain Resistant',
  },
  {
    id: 'reception',
    name: 'Boutique Reception',
    badge: 'Foyer & Reception',
    shadeCode: 'GF-309',
    shadeName: 'Architectural Charcoal',
    swatch: '#4A433D',
    headline: 'High-End Architectural Reception Focal Point',
    description: 'Imparts monumental architectural depth to retail desks and corporate reception foyers with scuff-proof, durable polymer cladding.',
    image: 'https://res.cloudinary.com/def2qsxjg/image/upload/v1790874891/GF-309_Goals_Floors_Premium_Pvc_Panel_reception_installed_image.png',
    altText: 'Primo GF-309 Architectural Charcoal panel installed on corporate reception backdrop',
    stat: 'Heavy Footfall Proof',
  },
  {
    id: 'kitchen',
    name: 'Modular Kitchen',
    badge: 'Moisture Barrier',
    shadeCode: 'GF-323',
    shadeName: 'Modern Slate Charcoal',
    swatch: '#3E3B38',
    headline: 'Impervious To Steam, Splatters & Moisture',
    description: 'Zero water absorption (<0.2%) makes it impervious to steam and high humidity in modular kitchens, utility balconies, and pantries.',
    image: 'https://res.cloudinary.com/def2qsxjg/image/upload/v1790908350/GF-323_12_inch_Premium_Pvc_Panel_Latest_Color_installed_image_in_kitchen.jpg',
    altText: 'Primo GF-323 Modern Slate Charcoal moisture-proof wall panel installed in modular kitchen',
    stat: '<0.2% Water Absorption',
  },
];

const TRANSFORMATION_PHASES = [
  {
    phase: '01',
    name: 'Precision Extrusion Plank',
    stageLabel: 'Factory Calibration',
    spec: '2950 × 300 × 5 mm (9.6 Ft × 12 In)',
    status: '100% Virgin Polymer Matrix',
    highlight: 'Rigid 2.8kg composite slab with internal high-tensile cellular honeycomb ribs. Engineered for dead-flat vertical stability with zero sagging, zero warping, and zero toxic formaldehyde emissions.',
    metric: '9.52 Sq. Ft. / Single Panel',
    features: [
      'Dead-flat vertical stability without deflection',
      'Ultra-dense cellular core absorbs acoustic vibration',
      'Zero toxic VOC off-gassing or formaldehyde',
    ],
  },
  {
    phase: '02',
    name: 'Concealed Interlocking Joinery',
    stageLabel: 'On-Site Rapid Assembly',
    spec: 'Tongue & Groove Male/Female Lock',
    status: '100% Concealed Fasteners',
    highlight: 'Consecutive panels slide and lock seamlessly into the rear flange. Screws and adhesives are 100% concealed behind the overlap, clocking 400 sq ft/day installation velocity.',
    metric: '400 Sq. Ft. / Day Installation Velocity',
    features: [
      'Eliminates ₹60–₹80/sq ft secondary plywood framing',
      'Mounts directly over existing masonry, plaster, or tiles',
      'Clean hand-saw cuts with zero edge chipping or dust',
    ],
  },
  {
    phase: '03',
    name: 'Monolithic Living Wall',
    stageLabel: 'Installed Lifetime Finish',
    spec: 'Architectural Seamless Barrier',
    status: 'Permanent Seelan & Damp Shield',
    highlight: 'Forms an unbroken, impermeable surface. Shuts out wall dampness (seelan), resists Class B1 commercial fire, and stays showroom-new with just a routine microfiber wipe.',
    metric: '10-Year Zero Upkeep Lifetime',
    features: [
      '<0.2% water absorption permanently stops efflorescence',
      'Class B1 self-extinguishing commercial fire code',
      'Wipe clean forever with no polish, wax, or repainting',
    ],
  },
];

const ENGINEERING_BENCHMARKS = [
  {
    title: 'Format Span',
    primoVal: '300mm (12" Wide)',
    altVal: '100mm Generic Slat',
    advantage: '66% Fewer Joints',
    primoWidth: '79%',
    altWidth: '33%',
    primoBar: 'w-[92%]',
    altBar: 'w-[33%]',
  },
  {
    title: 'Water Absorption',
    primoVal: '<0.2% Impermeable',
    altVal: '18%–22% (Natural Wood)',
    advantage: '100% Seelan Proof',
    primoWidth: '82%',
    altWidth: '18%',
    primoBar: 'w-[98%]',
    altBar: 'w-[18%]',
  },
  {
    title: 'Fire Safety Code',
    primoVal: 'Class B1 Flame Retardant',
    altVal: 'Combustible (Wood / Vinyl)',
    advantage: 'Commercial Safe',
    primoWidth: '69%',
    altWidth: '25%',
    primoBar: 'w-[94%]',
    altBar: 'w-[25%]',
  },
  {
    title: 'Substrate Prep',
    primoVal: 'Direct Wall / Zero Framing',
    altVal: '₹70/sqft Plywood Grid',
    advantage: 'Saves ₹70/sq ft Framing',
    primoWidth: '75%',
    altWidth: '30%',
    primoBar: 'w-[95%]',
    altBar: 'w-[30%]',
  },
  {
    title: 'Polymer Purity',
    primoVal: '100% Virgin Matrix',
    altVal: 'Recycled Regrind (Brittle)',
    advantage: 'Zero Impact Chipping',
    primoWidth: '96%',
    altWidth: '40%',
    primoBar: 'w-[96%]',
    altBar: 'w-[40%]',
  },
  {
    title: 'Lifecycle Upkeep',
    primoVal: 'Zero (Microfiber Wipe)',
    altVal: 'Annual Varnish / Paint',
    advantage: '10-Year Clean Surface',
    primoWidth: '89%',
    altWidth: '20%',
    primoBar: 'w-[99%]',
    altBar: 'w-[20%]',
  },
];

const TRADE_PERSONAS = [
  {
    id: 'architects',
    role: 'Architects & Interior Designers',
    shortLabel: 'Architects',
    personaTag: 'Design Specification',
    headline: 'Physical Swatches & BIM/CAD Dockets',
    stat: '24 PBR Shakes',
    statLabel: 'Digital Textures',
    actionLabel: 'Order Swatch Kit',
    actionUrl: '#rfq-section',
    features: [
      '24 synchronized textures: Nordic Ash, Italian Travertine, Concrete, Deep Walnut.',
      'High-res PBR texture maps and CAD DWG profile files for SketchUp and 3ds Max.',
      'Full 2.95m physical panel specimens dispatched to design studios in Gurugram & Delhi NCR.',
    ],
  },
  {
    id: 'contractors',
    role: 'Fit-Out Contractors & Carpenters',
    shortLabel: 'Contractors',
    personaTag: 'Site Velocity & Labor',
    headline: 'High-Speed Dry Wall Mounting',
    stat: '400 Sq Ft / Day',
    statLabel: 'Execution Speed',
    actionLabel: 'Get Bulk Rate Card',
    actionUrl: '#rfq-section',
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
    personaTag: 'Wholesale Margins & Stock',
    headline: 'Mill-Direct Wholesale Supply',
    stat: 'From ₹499/pc',
    statLabel: 'Wholesale Base (MRP ₹990)',
    actionLabel: 'Apply for Dealership',
    actionUrl: 'https://wa.me/919217400163?text=Hi%20WholesalerJi%2C%20I%20am%20interested%20in%20a%20stockist%20dealership%20for%20Primo%20Panels.',
    features: [
      'Pure mill-direct trade pricing starting at ₹499/pc (MRP ₹990) for high dealer margins.',
      'We supply both direct dealers and regional distributors, with minimum order quantity (MOQ) options suited to showroom stocking and large-scale project supply.',
      'Compact 10-pc export cartons consume 70% less warehouse space than 8x4 sheets.',
      'Same-day stock replenishment directly from Sector 34 Gurugram central warehouse.',
    ],
  },
  {
    id: 'procurement',
    role: 'Commercial Builders & Developers',
    shortLabel: 'Commercial BOQ',
    personaTag: 'Tenders & Tax Credits',
    headline: 'Certified Fire & Tax Compliance',
    stat: 'Class B1 & 18% ITC',
    statLabel: 'Full Tax Credit',
    actionLabel: 'Request BOQ Tender Quote',
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
    image: '/assets/installation/step_1_substrate.jpg',
    altText: 'Substrate inspection and wall cleaning for Primo PVC panel installation',
    proTip: 'Brush away peeling paint or loose plaster. Even damp masonry is 100% fine.',
    instruction: 'Primo can be mounted directly over cured masonry plaster, gypsum drywall, old ceramic tiles, or cement fiber boards.',
  },
  {
    num: '02',
    title: 'Adhesive vs Batten',
    phase: 'Fixing',
    image: '/assets/installation/step_2_adhesive.jpg',
    altText: 'Applying polyurethane adhesive beads for direct wall panel fixing',
    proTip: 'Use serpentine beads of hybrid polyurethane or MS polymer adhesive for flat walls.',
    instruction: 'For walls with >10mm undulations or chronic seelan, fix 1-inch GI channels or timber battens spaced at 400mm centers.',
  },
  {
    num: '03',
    title: 'Concealed Interlocking',
    phase: 'Jointing',
    image: '/assets/installation/step_3_interlock.jpg',
    altText: 'Fastening Primo panel rear flange lip with concealed screw fixing',
    proTip: 'Fasten brad nails strictly at 45° through the rear flange lip.',
    instruction: 'Drive countersunk screws or headless brads through the rear flange. Slide the female groove of panel 2 over the tongue.',
  },
  {
    num: '04',
    title: 'Switchbox Cutouts',
    phase: 'Fitting',
    image: '/assets/installation/step_4_cutout.jpg',
    altText: 'Cutting electrical switchboard opening in Primo PVC wall panel',
    proTip: 'Use an oscillating multi-tool or hole saw for clean 90° corners.',
    instruction: 'Measure electrical conduit and switchboard centers. Trace directly onto panel face and cut using a fine-toothed hand saw or jigsaw.',
  },
  {
    num: '05',
    title: 'Perimeter Trim & Seal',
    phase: 'Finishing',
    image: '/assets/installation/step_5_finish.jpg',
    altText: 'Installing edge profile trim and silicone seal on finished Primo wall',
    proTip: 'Snap matching L-trim or end caps along floor skirting and ceiling joints.',
    instruction: 'Cap outer perimeter edges with matching Primo L-profiles or silicone beading. Clean surface with a damp microfiber cloth.',
  },
];

const SISTER_COLLECTIONS = [
  {
    id: 'elite',
    name: 'Elite Panels',
    subtitle: 'High-Gloss Italian Marble Slabs',
    specs: '5mm Profile • Mirror UV Coating',
    shades: '12 Shades',
    url: '/wall-panels/elite',
    image: 'https://res.cloudinary.com/def2qsxjg/image/upload/f_auto,q_auto/v1790908763/GF-401_installed_image_in_hall.png',
    altText: 'Elite high-gloss Italian marble PVC wall panels installed in luxury living space',
    tag: 'UV Marble Slabs',
  },
  {
    id: 'primo-fluted',
    name: 'Primo Fluted',
    subtitle: 'Architectural Wood Louvers',
    specs: '12mm Depth • Fluted Texture',
    shades: '13 Finishes',
    url: '/wall-panels/primo-fluted',
    image: 'https://res.cloudinary.com/def2qsxjg/image/upload/v1790929841/FP-702_installed_image_in_room.jpg',
    altText: 'Primo Fluted architectural wood composite louvers installed on accent wall',
    tag: 'Wood Louvers',
  },
  {
    id: 'elite-fluted',
    name: 'Elite Fluted',
    subtitle: 'Heavy Commercial WPC Louvers',
    specs: 'Deep Shadow Relief • Class B1 Fire',
    shades: 'Deep Shadow',
    url: '/wall-panels/elite-fluted',
    image: 'https://res.cloudinary.com/def2qsxjg/image/upload/v1791125624/charcoal_fluted_office_insitu.jpg',
    altText: 'Elite Fluted commercial-grade heavy WPC panels installed in corporate reception',
    tag: 'Commercial WPC',
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
  const [showcaseShadeId, setShowcaseShadeId] = useState<string | undefined>(undefined);
  const [activeSpaceIndex, setActiveSpaceIndex] = useState(0);
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);

  const handleInspectShade = (shadeCode: string) => {
    setShowcaseShadeId(shadeCode);
    const target = shades.find((s) => s.code.toLowerCase() === shadeCode.toLowerCase());
    if (target) {
      setSelectedPanel(target);
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('select-showcase-shade', { detail: { code: shadeCode } })
      );
      const el = document.getElementById('universal-showcase');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };
  const [hoveredPhase, setHoveredPhase] = useState<number | null>(null);
  const [activePersonaIndex, setActivePersonaIndex] = useState(0);
  const [activeInstallStep, setActiveInstallStep] = useState(0);
  const [scrolledPastNavbar, setScrolledPastNavbar] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (typeof window !== 'undefined') {
        setScrolledPastNavbar(window.scrollY > 80);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

        // Pin starting from top of viewport, seamless full-screen coverage
        const heroTl = gsap.timeline({
          scrollTrigger: {
            trigger: heroSectionRef.current,
            start: 'top top',
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

      // ─────────────────────────────────────────────────────────
      // 2. ENGINEERING BENCHMARKS (COMPARATIVE BARS SCROLL ANIMATION, ONCE)
      // ─────────────────────────────────────────────────────────
      const benchmarkRows = rootRef.current?.querySelectorAll<HTMLElement>('.benchmark-row');
      if (benchmarkRows && benchmarkRows.length > 0) {
        const benchmarkObserver = new IntersectionObserver(
          (entries, obs) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                obs.unobserve(entry.target);
                const row = entry.target as HTMLElement;
                const primoBar = row.querySelector<HTMLElement>('.benchmark-primo-bar');
                const altBar = row.querySelector<HTMLElement>('.benchmark-alt-bar');
                const primoTarget = primoBar?.getAttribute('data-width') || '90%';
                const altTarget = altBar?.getAttribute('data-width') || '30%';

                if (primoBar) {
                  gsap.fromTo(
                    primoBar,
                    { width: '0%' },
                    {
                      width: primoTarget,
                      duration: 1.25,
                      ease: 'power2.out',
                    }
                  );
                }

                if (altBar) {
                  gsap.fromTo(
                    altBar,
                    { width: '0%' },
                    {
                      width: altTarget,
                      duration: 1.05,
                      delay: 0.15,
                      ease: 'power2.out',
                    }
                  );
                }
              }
            });
          },
          {
            root: null,
            rootMargin: '0px 0px -10% 0px',
            threshold: 0.15,
          }
        );

        benchmarkRows.forEach((row) => benchmarkObserver.observe(row));
      }
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
        className="relative h-screen w-full flex items-center justify-center select-none overflow-hidden pt-16 sm:pt-20"
      >
        {/* Ambient Corner Warm Accent Lighting (Dynamic Navbar Accent Theme) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
          {/* Top Edge Ambient Warm Spill (Ensures no blank gap when navbar scrolls away) */}
          <div
            className="absolute -top-20 left-0 right-0 h-40 blur-[90px] opacity-35 dark:opacity-25 transition-all duration-700 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at 50% 0%, var(--color-amber-500, #F5AB40) 0%, transparent 80%)',
            }}
          />
          {/* Top-Left Corner Warm Glow */}
          <div
            className="absolute -top-24 sm:-top-40 -left-24 sm:-left-40 w-[55vw] h-[55vw] min-w-[320px] min-h-[320px] max-w-[650px] max-h-[650px] rounded-full blur-[80px] sm:blur-[110px] opacity-40 dark:opacity-30 transition-all duration-700 pointer-events-none"
            style={{
              background: 'radial-gradient(circle at 35% 35%, var(--color-amber-500, #F5AB40) 0%, var(--color-amber-400, #fbbf24) 45%, transparent 75%)',
            }}
          />
          {/* Top-Right Corner Warm Glow */}
          <div
            className="absolute -top-24 sm:-top-40 -right-24 sm:-right-40 w-[55vw] h-[55vw] min-w-[320px] min-h-[320px] max-w-[650px] max-h-[650px] rounded-full blur-[80px] sm:blur-[110px] opacity-40 dark:opacity-30 transition-all duration-700 pointer-events-none"
            style={{
              background: 'radial-gradient(circle at 65% 35%, var(--color-amber-500, #F5AB40) 0%, var(--color-amber-400, #fbbf24) 45%, transparent 75%)',
            }}
          />
          {/* Bottom-Left Corner Warm Glow */}
          <div
            className="absolute -bottom-[20vw] -left-[20vw] w-[45vw] h-[45vw] min-w-[280px] min-h-[280px] max-w-[550px] max-h-[550px] rounded-full blur-[80px] sm:blur-[100px] opacity-30 dark:opacity-20 transition-all duration-700 pointer-events-none"
            style={{
              background: 'radial-gradient(circle at center, var(--color-amber-500, #F5AB40) 0%, var(--color-amber-400, #fbbf24) 40%, transparent 70%)',
            }}
          />
          {/* Bottom-Right Corner Warm Glow */}
          <div
            className="absolute -bottom-[20vw] -right-[20vw] w-[45vw] h-[45vw] min-w-[280px] min-h-[280px] max-w-[550px] max-h-[550px] rounded-full blur-[80px] sm:blur-[100px] opacity-30 dark:opacity-20 transition-all duration-700 pointer-events-none"
            style={{
              background: 'radial-gradient(circle at center, var(--color-amber-500, #F5AB40) 0%, var(--color-amber-400, #fbbf24) 40%, transparent 70%)',
            }}
          />
        </div>

        {/* Breadcrumb Navigation (Smoothly glides up when navbar hides) */}
        <nav
          aria-label="Breadcrumb"
          className={`absolute left-4 sm:left-8 lg:left-12 z-20 flex items-center gap-2 text-[11px] font-mono tracking-wider text-stone-500 dark:text-stone-400 select-auto transition-all duration-500 ease-in-out ${
            scrolledPastNavbar ? 'top-4 sm:top-5' : 'top-16 sm:top-20'
          }`}
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
              <span className="text-[20vw] leading-none tracking-normal not-italic whitespace-nowrap block">
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
                  <span className="text-[20vw] leading-none tracking-normal not-italic whitespace-nowrap block">
                    PRIMO
                  </span>
                </div>
              </div>
            ))}
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
        selectedShadeId={showcaseShadeId}
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
            As the manufacturer of Primo PVC wall panels, WholesalerJi supplies architects, contractors, and dealers across India with factory-direct bulk pricing and consistent, in-house quality control. <strong>Primo</strong> is WholesalerJi’s flagship 12-inch (300mm) seamless flat interior cladding system. Extruded from an unadulterated virgin polymer matrix, Primo creates an impermeable, monolithic surface that permanently seals off chronic wall dampness (seelan), eliminates peeling paint, and reduces visible joints by 66% compared to conventional 100mm slats.
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

            {/* Mobile Scroll Indicator */}
            <div className="sm:hidden flex items-center justify-between text-[10px] font-mono text-stone-400 mb-2 px-1">
              <span>← Left Joint Profile</span>
              <span className="text-amber-500 font-semibold">Swipe to inspect</span>
              <span>Right Lip →</span>
            </div>

            {/* High-Precision Isometric 3D Cross-Section SVG Diagram */}
            <div className="relative z-10 w-full py-2 overflow-x-auto no-scrollbar scroll-smooth">
              <svg
                viewBox="0 0 1060 275"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="min-w-[860px] w-full max-w-[1040px] mx-auto block h-auto"
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
      {/* SECTION 3.5: THE PRIMO CORE FRAMEWORK (ACRONYM GRID)          */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section className="w-full bg-stone-950 text-white py-10 sm:py-14 px-4 sm:px-8 lg:px-12 border-t border-stone-800">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h2 className="text-xl sm:text-3xl font-black tracking-tight text-white">
              The <span className="text-amber-500">P.R.I.M.O.</span> Framework
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-stone-400 font-light max-w-2xl">
              Five core engineering pillars that make our flagship 12-inch cladding the definitive standard for interior projects.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {PRIMO_ACRONYM_DATA.map((item, idx) => (
              <div key={idx} className="relative rounded-2xl overflow-hidden bg-stone-900 border border-stone-800 p-5 group flex flex-col h-full hover:border-amber-500/50 transition-colors">
                {/* Background image fade */}
                <div 
                  className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none"
                  style={{
                    backgroundImage: `url(${item.texture})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />
                
                <div className="relative z-10 flex-1 flex flex-col">
                  <div className="text-4xl sm:text-5xl font-black text-stone-800 group-hover:text-amber-500/20 transition-colors mb-2 leading-none font-mono">
                    {item.letter}
                  </div>
                  
                  <h3 className="text-base font-bold text-white mb-1 tracking-tight">
                    {item.title}
                  </h3>
                  
                  <span className="text-[10px] font-mono text-amber-500 uppercase tracking-wider block mb-3">
                    {item.tagline}
                  </span>
                  
                  <p className="text-xs text-stone-400 font-light leading-relaxed mt-auto">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION 4: CURATED SPATIAL PERFORMANCE (PANORAMIC VIEWPORT)   */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section id="applications" className="w-full bg-white dark:bg-stone-950 py-8 sm:py-10 px-4 sm:px-8 lg:px-12 border-t border-stone-200 dark:border-stone-800">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-5">
            <h2 className="text-xl sm:text-3xl font-black text-stone-900 dark:text-white tracking-tight">
              Where Primo Performs: Curated Spaces
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-stone-500 dark:text-stone-400 font-light max-w-xl">
              Real installed fitments across living lounges, TV consoles, master bedheads, corporate offices, and kitchens.
            </p>
          </div>

          {/* Eager preloader for instant space switching */}
          <div className="sr-only select-none pointer-events-none w-0 h-0 overflow-hidden" aria-hidden="true">
            {APPLICATION_SPACES.map((sp) => (
              <img key={`preload-space-${sp.id}`} src={sp.image} alt="" loading="eager" decoding="async" />
            ))}
          </div>

          {/* Mobile Horizontal Pill Selector (< lg) */}
          <div role="tablist" aria-label="Curated application environments" className="lg:hidden flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 mb-3">
            {APPLICATION_SPACES.map((space, idx) => {
              const isActive = activeSpaceIndex === idx;
              return (
                <button
                  key={`mobile-${space.id}`}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-label={`${space.name} (${space.shadeCode})`}
                  onClick={() => setActiveSpaceIndex(idx)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all border flex-shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-amber-500 text-stone-950 border-amber-500 shadow-sm font-bold'
                      : 'bg-stone-100 dark:bg-stone-900 text-stone-600 dark:text-stone-300 border-stone-200 dark:border-stone-800'
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full border border-black/20 flex-shrink-0"
                    style={{ backgroundColor: space.swatch }}
                  />
                  <span>{space.name}</span>
                  <span className={`text-[10px] font-mono ${isActive ? 'text-stone-950 font-bold' : 'text-amber-600 dark:text-amber-400'}`}>
                    {space.shadeCode}
                  </span>
                </button>
              );
            })}
          </div>

          {/* 2-Column Split: Vertical Space Selector (Left, Desktop) + Installed Room Stage (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-stretch">
            
            {/* LEFT COLUMN: Vertical Space Selector List (Desktop Only) */}
            <div role="tablist" aria-label="Curated spaces selector" className="hidden lg:flex lg:col-span-4 flex-col gap-2">
              {APPLICATION_SPACES.map((space, idx) => {
                const isActive = activeSpaceIndex === idx;
                return (
                  <button
                    key={space.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-label={`${space.name} (${space.shadeCode})`}
                    onClick={() => setActiveSpaceIndex(idx)}
                    className={`w-full text-left px-3.5 py-3 rounded-xl transition-all duration-200 flex items-center justify-between cursor-pointer border ${
                      isActive
                        ? 'bg-amber-500/10 dark:bg-amber-500/15 border-amber-500 text-stone-900 dark:text-white shadow-xs'
                        : 'bg-stone-50 dark:bg-stone-900/50 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:border-stone-300 dark:hover:border-stone-700 hover:text-stone-900 dark:hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-black/20 flex-shrink-0 shadow-xs"
                        style={{ backgroundColor: space.swatch }}
                      />
                      <div className="min-w-0">
                        <div className={`text-xs font-bold truncate ${isActive ? 'text-amber-600 dark:text-amber-400' : ''}`}>
                          {space.name}
                        </div>
                        <div className="text-[10px] text-stone-400 dark:text-stone-500 truncate">
                          {space.badge}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <span className={`text-[11px] font-mono px-2 py-0.5 rounded-md ${
                        isActive
                          ? 'bg-amber-500 text-stone-950 font-bold'
                          : 'bg-stone-200/60 dark:bg-stone-800 text-stone-500 dark:text-stone-400 font-medium'
                      }`}>
                        {space.shadeCode}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* RIGHT COLUMN: Installed Image Stage + HUD */}
            <div className="col-span-12 lg:col-span-8 relative">
              {APPLICATION_SPACES.map((sp, idx) => {
                const isActive = activeSpaceIndex === idx;
                return (
                  <div
                    key={`installed-space-${sp.id}`}
                    className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
                      isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                    } rounded-2xl overflow-hidden h-[360px] sm:h-[420px] lg:h-[460px] w-full border border-stone-200 dark:border-stone-800 shadow-xl flex flex-col justify-between p-4 sm:p-6 bg-stone-900 group`}
                  >
                    {/* Background Installed Image with proper aspect coverage */}
                    <Image
                      src={sp.image}
                      alt={sp.altText || `Primo ${sp.shadeCode} ${sp.shadeName} PVC wall panel installed in ${sp.name}`}
                      fill
                      priority={idx === 0}
                      unoptimized
                      sizes="(max-width: 1024px) 100vw, 65vw"
                      className="object-cover object-center transition-transform duration-700 group-hover:scale-102"
                    />

                    {/* Gradient Overlay for contrast and readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-stone-950/20 pointer-events-none" />

                    {/* Top Floating Badge Strip */}
                    <div className="relative z-10 flex items-center justify-between gap-2.5 flex-wrap">
                      <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-500 text-stone-950 shadow">
                        {sp.badge}
                      </span>
                      <div className="flex items-center gap-2 bg-stone-950/85 backdrop-blur-md px-3 py-1 rounded-full border border-stone-700/60 text-[11px] font-mono text-stone-200 shadow">
                        <span className="w-2 h-2 rounded-full border border-white/30" style={{ backgroundColor: sp.swatch }} />
                        <span>Installed Shade: <strong className="text-amber-400 font-bold">{sp.shadeCode}</strong> {sp.shadeName}</span>
                      </div>
                    </div>

                    {/* Bottom Architectural HUD */}
                    <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-3 pt-3 border-t border-white/15">
                      <div className="max-w-xl">
                        <h3 className="text-base sm:text-xl font-black text-white tracking-tight mb-1 drop-shadow-md">
                          {sp.headline}
                        </h3>
                        <p className="text-xs sm:text-sm text-stone-200 font-light leading-relaxed drop-shadow line-clamp-2 sm:line-clamp-none">
                          {sp.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-2.5 flex-shrink-0">
                        <span className="text-[11px] font-mono text-emerald-400 font-bold bg-emerald-950/80 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-emerald-500/40">
                          {sp.stat}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleInspectShade(sp.shadeCode)}
                          className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold uppercase tracking-wider transition-all shadow-lg flex items-center gap-1.5 cursor-pointer active:scale-95"
                          title={`Inspect ${sp.shadeCode} in Universal Catalog`}
                        >
                          <span>Inspect Shade</span>
                          <span>↑</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
              {/* Invisible spacer to reserve height since children are absolute */}
              <div className="rounded-2xl h-[360px] sm:h-[420px] lg:h-[460px] w-full pointer-events-none invisible" aria-hidden="true" />
            </div>

          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION 5: 3-PHASE TRANSFORMATION LIFECYCLE                   */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section id="installed-storytelling" className="w-full bg-stone-100/60 dark:bg-stone-900/40 py-10 sm:py-14 px-4 sm:px-8 lg:px-12 border-t border-stone-200 dark:border-stone-800">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white tracking-tight">
                The 3-Phase Lifecycle: From Raw Plank to Living Surface
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-stone-600 dark:text-stone-400 font-light max-w-2xl leading-relaxed">
                How a factory-calibrated composite extrusion transforms into a seamless, 100% waterproof architectural room.
              </p>
            </div>
            <span className="text-xs font-mono text-stone-500 flex-shrink-0">
              Interactive 3-stage assembly lifecycle
            </span>
          </div>

          {/* Interactive Hover-Expandable Capsule Accordion (Single Active, Border-Radius Capsules) */}
          <div
            className="max-w-4xl mx-auto space-y-3 sm:space-y-4"
            onMouseLeave={() => setHoveredPhase(null)}
          >
            {TRANSFORMATION_PHASES.map((ph, idx) => {
              const isExpanded = hoveredPhase === idx;

              return (
                <div
                  key={ph.phase}
                  role="button"
                  tabIndex={0}
                  aria-expanded={isExpanded}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setHoveredPhase(isExpanded ? null : idx);
                    }
                  }}
                  onMouseEnter={() => setHoveredPhase(idx)}
                  onClick={() => setHoveredPhase(isExpanded ? null : idx)}
                  className={`rounded-2xl sm:rounded-[1.75rem] transition-[padding,box-shadow,border-color,background-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer overflow-hidden border ${
                    isExpanded
                      ? 'py-5 sm:py-6 px-5 sm:px-7 bg-white dark:bg-stone-950 border-amber-500 ring-2 ring-amber-500/20 shadow-xl'
                      : 'py-4 px-5 sm:px-7 bg-white dark:bg-stone-900/90 border-stone-200 dark:border-stone-800 hover:border-amber-500/50 shadow-xs'
                  }`}
                >
                  {/* Persistent Header Bar */}
                  <div className="flex items-center justify-between gap-3 select-none">
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className={`px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-bold tracking-wider uppercase transition-colors duration-300 flex-shrink-0 ${
                          isExpanded
                            ? 'bg-amber-500 text-stone-950 font-black shadow-xs'
                            : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        PHASE {ph.phase}
                      </span>
                      <h3
                        className={`font-bold transition-colors duration-300 truncate ${
                          isExpanded
                            ? 'text-base sm:text-lg text-stone-900 dark:text-white'
                            : 'text-sm sm:text-base text-stone-900 dark:text-white'
                        }`}
                      >
                        {ph.name}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2.5 flex-shrink-0">
                      <span
                        className={`hidden sm:inline-flex px-3 py-1 rounded-lg font-mono text-[11px] font-bold transition-all duration-300 ${
                          isExpanded
                            ? 'opacity-0 scale-95 pointer-events-none w-0 px-0 overflow-hidden'
                            : 'opacity-100 scale-100 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700'
                        }`}
                      >
                        {ph.metric}
                      </span>
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                          isExpanded
                            ? 'bg-amber-500 text-stone-950 rotate-180 shadow-xs'
                            : 'bg-stone-100 dark:bg-stone-800 text-amber-500 rotate-0'
                        }`}
                      >
                        <svg
                          width="14"
                          height="14"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          strokeWidth="2.5"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Expandable Body with CSS Grid height animation */}
                  <div
                    className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      isExpanded
                        ? 'grid-rows-[1fr] opacity-100'
                        : 'grid-rows-[0fr] opacity-0 pointer-events-none'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="pt-4 mt-3 border-t border-stone-100 dark:border-stone-800/80 space-y-3.5">
                        <div className="text-[11px] font-mono text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-2">
                          <span>{ph.spec}</span>
                          <span className="opacity-40">•</span>
                          <span>{ph.status}</span>
                        </div>

                        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 font-light leading-relaxed">
                          {ph.highlight}
                        </p>

                        <div className="space-y-2 pt-2 border-t border-stone-100/60 dark:border-stone-800/60">
                          {ph.features.map((feat, fIdx) => (
                            <div
                              key={fIdx}
                              className="flex items-start gap-2 text-xs text-stone-700 dark:text-stone-300"
                            >
                              <Check className="w-3.5 h-3.5 text-amber-500 mt-0.5 flex-shrink-0" />
                              <span>{feat}</span>
                            </div>
                          ))}
                        </div>

                        <div className="flex justify-end pt-2 border-t border-stone-100/60 dark:border-stone-800/60">
                          <span className="px-3.5 py-1 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 font-mono text-xs font-bold border border-amber-500/30">
                            {ph.metric}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION 6: WHY SPECIFY PRIMO (COMPARATIVE BAR MATRIX)         */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section id="why-primo" className="w-full bg-white dark:bg-stone-950 py-10 sm:py-14 px-4 sm:px-8 lg:px-12 border-t border-stone-200 dark:border-stone-800">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mb-8">
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
                className="benchmark-row py-4 sm:py-5 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
              >
                {/* Metric Title */}
                <div className="w-full md:w-1/3">
                  <strong className="text-sm font-bold text-stone-900 dark:text-white block">
                    {item.title}
                  </strong>
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
                      <div
                        className="benchmark-primo-bar h-full bg-gradient-to-r from-amber-600 to-amber-500 rounded-full"
                        style={{ width: '0%' }}
                        data-width={item.primoWidth}
                      />
                    </div>
                  </div>

                  {/* Standard Alternative Metric */}
                  <div>
                    <div className="flex justify-between text-[10px] mb-0.5 font-mono text-stone-500">
                      <span>Standard Alternative: {item.altVal}</span>
                    </div>
                    <div className="w-full h-1 rounded-full bg-stone-200 dark:bg-stone-800 overflow-hidden">
                      <div
                        className="benchmark-alt-bar h-full bg-stone-400 dark:bg-stone-600 rounded-full"
                        style={{ width: '0%' }}
                        data-width={item.altWidth}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION 8: FOR INDUSTRY PROFESSIONALS (TRADE SOLUTIONS HUB)   */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section id="b2b-personas" className="w-full bg-white dark:bg-stone-950 py-8 sm:py-12 px-4 sm:px-8 lg:px-12 border-t border-stone-200 dark:border-stone-800">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-xl sm:text-3xl font-black text-stone-900 dark:text-white tracking-tight">
              Dedicated Solutions for Trade & Industry Professionals
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-stone-600 dark:text-stone-400 font-light max-w-2xl leading-relaxed">
              Wholesale trade pricing, sample deliveries, and architectural assets tailored for every building stakeholder across Delhi NCR.
            </p>
          </div>

          {/* Interactive Role Segmented Switcher (No Box Grid) */}
          <div role="tablist" aria-label="Trade stakeholder solutions" className="grid grid-cols-2 md:grid-cols-4 gap-2 p-1.5 rounded-2xl bg-stone-100 dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800 mb-5">
            {TRADE_PERSONAS.map((p, idx) => {
              const isActive = activePersonaIndex === idx;
              const PersonaIcon =
                p.id === 'architects'
                  ? Compass
                  : p.id === 'contractors'
                  ? Wrench
                  : p.id === 'dealers'
                  ? Store
                  : Building2;

              return (
                <button
                  key={p.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-label={p.role}
                  onClick={() => setActivePersonaIndex(idx)}
                  className={`relative flex items-center justify-center gap-2.5 py-3 px-3 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer select-none ${
                    isActive
                      ? 'bg-white dark:bg-stone-950 text-stone-950 dark:text-white shadow-md border border-stone-200/90 dark:border-stone-700/80 scale-[1.01]'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-200/50 dark:hover:bg-stone-800/40 border border-transparent'
                  }`}
                >
                  <PersonaIcon className={`w-4 h-4 transition-colors ${isActive ? 'text-amber-500' : 'text-stone-400'}`} />
                  <span className="truncate">{p.shortLabel}</span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse hidden sm:inline-block" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Active Persona Specification Console */}
          <div className="relative">
            {TRADE_PERSONAS.map((p, idx) => {
              const isActive = activePersonaIndex === idx;
              const PersonaIcon =
                p.id === 'architects'
                  ? Compass
                  : p.id === 'contractors'
                  ? Wrench
                  : p.id === 'dealers'
                  ? Store
                  : Building2;

              return (
                <div
                  key={p.id}
                  className={`grid transition-[grid-template-rows,opacity] duration-500 ease-in-out ${
                    isActive
                      ? 'grid-rows-[1fr] opacity-100 relative z-10'
                      : 'grid-rows-[0fr] opacity-0 absolute inset-0 pointer-events-none z-0'
                  }`}
                >
                  <div className="overflow-hidden h-full">
                    <div className="relative rounded-3xl p-5 sm:p-8 bg-stone-50/80 dark:bg-stone-900/50 border border-stone-200 dark:border-stone-800/80 shadow-md backdrop-blur-xs transition-all duration-300 h-full">
                      {/* Subtle Ambient Radial Highlight */}
                      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 dark:bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch relative z-10 h-full">
                        {/* Left Column: Role Details & High-Density Deliverables (7 cols) */}
                        <div className="lg:col-span-7 flex flex-col justify-between">
                          <div>
                            <h3 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white tracking-tight mb-1 flex items-center gap-2.5">
                              <PersonaIcon className="w-5 h-5 text-amber-500 flex-shrink-0" />
                              <span>{p.role}</span>
                            </h3>

                            <p className="text-xs sm:text-sm font-medium text-amber-600 dark:text-amber-400 mb-5">
                              {p.headline}
                            </p>

                            {/* Numbered Architectural Feature Sequence */}
                            <div className="space-y-3">
                              {p.features.map((feat, i) => (
                                <div key={i} className="flex items-start gap-3 text-xs sm:text-sm text-stone-700 dark:text-stone-300">
                                  <span className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-md bg-stone-200 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 flex items-center justify-center font-mono text-[10px] font-bold">
                                    0{i + 1}
                                  </span>
                                  <span className="leading-relaxed font-light">{feat}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Right Column: Metric HUD & Direct Action Console (5 cols) */}
                        <div className="lg:col-span-5 flex flex-col justify-between rounded-2xl bg-white dark:bg-stone-950 p-5 sm:p-6 border border-stone-200 dark:border-stone-800 shadow-sm h-full">
                          <div>
                            <div className="text-[10px] font-mono uppercase tracking-widest text-stone-400 dark:text-stone-500 mb-1">
                              {p.statLabel}
                            </div>
                            <div className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-amber-600 dark:text-amber-400">
                              {p.stat}
                            </div>
                            <div className="mt-3 text-[11px] text-stone-500 dark:text-stone-400 border-t border-stone-100 dark:border-stone-800/80 pt-2.5 flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
                              <span>Same-Day Stock Replenishment · Sector 34 Gurugram</span>
                            </div>
                          </div>

                          <div className="mt-6 pt-4 border-t border-stone-100 dark:border-stone-800/80 flex flex-col gap-2">
                            <a
                              href={p.actionUrl}
                              className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs font-mono uppercase tracking-wider transition-all duration-200 shadow-sm active:scale-98"
                            >
                              <span>{p.actionLabel}</span>
                              <ArrowRight className="w-4 h-4" />
                            </a>
                            <a
                              href="https://wa.me/919217400163?text=Hi%20WholesalerJi%2C%20I%20am%20inquiring%20about%20Primo%20Panels."
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-stone-500 hover:text-stone-900 dark:hover:text-white text-[11px] font-mono transition-colors"
                            >
                              <span>Direct WhatsApp Procurement Desk</span>
                              <span>↗</span>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            {/* Invisible spacer to set height based on tallest element, avoiding layout shifts */}
            <div className="rounded-3xl h-full w-full pointer-events-none invisible" aria-hidden="true">
              <div className="p-5 sm:p-8"><div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8"><div className="lg:col-span-7 h-48"></div></div></div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION 9: INSTALLATION PROTOCOL (STEP SEQUENCE)              */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section id="installation-guide" className="w-full bg-stone-100/60 dark:bg-stone-900/40 py-10 sm:py-14 px-4 sm:px-8 lg:px-12 border-t border-stone-200 dark:border-stone-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
            <div>
              <h2 className="text-xl sm:text-3xl font-black text-stone-900 dark:text-white tracking-tight">
                Field-Tested Joinery & Installation Track
              </h2>
            </div>
            <span className="text-xs font-mono text-stone-500">
              Up to 400 sq ft / day execution velocity
            </span>
          </div>

          {/* Split-Screen Interactive Installation Track */}
          <div className="border border-stone-200 dark:border-stone-800 rounded-3xl bg-white dark:bg-stone-950 p-4 sm:p-7 shadow-sm overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
              {/* Left Column (5 cols): Dynamic High-Resolution Site Photography */}
              <div className="lg:col-span-5 relative">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-800 bg-stone-900 shadow-md group">
                  {INSTALL_STEPS.map((step, idx) => {
                    const isActive = activeInstallStep === idx;
                    return (
                      <div
                        key={step.num}
                        className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
                          isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                        }`}
                      >
                        <img
                          src={step.image}
                          alt={step.altText || step.title}
                          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                        />
                        {/* Subtle gradient vignette */}
                        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent pointer-events-none" />
                        
                        {/* Floating Step Pill Badge (Hidden on phone screen) */}
                        <div className="absolute top-3 left-3 hidden sm:flex items-center gap-2">
                          <span className="px-3 py-1 rounded-full text-[10px] font-mono font-black uppercase tracking-wider bg-amber-500 text-stone-950 shadow">
                            STEP {step.num}
                          </span>
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-mono uppercase bg-stone-950/80 backdrop-blur text-stone-200 border border-white/10">
                            PHASE: {step.phase}
                          </span>
                        </div>

                        {/* Bottom Caption Pill */}
                        <div className="absolute bottom-3 left-3 right-3 text-left">
                          <span className="text-[11px] font-mono text-stone-300 drop-shadow">
                            {step.title} • On-Site Execution
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column (7 cols): Step Selector & Active Instructions HUD */}
              <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
                {/* 5-Step Interactive Tabs */}
                <div role="tablist" aria-label="Installation sequence steps" className="grid grid-cols-5 gap-1.5 sm:gap-2">
                  {INSTALL_STEPS.map((st, i) => {
                    const isSelected = activeInstallStep === i;
                    return (
                      <button
                        key={st.num}
                        type="button"
                        role="tab"
                        aria-selected={isSelected}
                        onClick={() => setActiveInstallStep(i)}
                        className={`p-2 sm:p-2.5 rounded-xl text-center transition-all cursor-pointer flex flex-col items-center justify-center border ${
                          isSelected
                            ? 'bg-amber-500 text-stone-950 border-amber-500 font-bold shadow-sm'
                            : 'bg-stone-50 dark:bg-stone-900 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-stone-800 hover:border-amber-400/50 hover:bg-stone-100 dark:hover:bg-stone-800/60'
                        }`}
                      >
                        <span className="text-[10px] sm:text-xs font-mono font-black">{st.num}</span>
                        <span className="text-[9px] sm:text-[11px] font-medium truncate max-w-full hidden sm:inline">
                          {st.phase}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Active Step Detailed Content HUD */}
                <div className="relative">
                  {INSTALL_STEPS.map((step, idx) => {
                    const isActive = activeInstallStep === idx;
                    return (
                      <div
                        key={step.num}
                        className={`grid transition-[grid-template-rows,opacity] duration-500 ease-in-out ${
                          isActive
                            ? 'grid-rows-[1fr] opacity-100 relative z-10'
                            : 'grid-rows-[0fr] opacity-0 absolute inset-0 pointer-events-none z-0'
                        }`}
                      >
                        <div className="overflow-hidden">
                          <div className="p-4 sm:p-5 rounded-2xl bg-stone-50 dark:bg-stone-900/70 border border-stone-200/80 dark:border-stone-800 space-y-3 h-full">
                            <div className="flex items-center justify-between gap-2 border-b border-stone-200 dark:border-stone-800 pb-2.5">
                              <h3 className="text-base sm:text-lg font-bold text-stone-900 dark:text-white">
                                {step.title}
                              </h3>
                              <span className="text-xs font-mono text-stone-400">
                                Step {idx + 1} of 5
                              </span>
                            </div>

                            <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 font-light leading-relaxed">
                              {step.instruction}
                            </p>

                            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 font-mono text-xs flex items-start gap-2.5">
                              <span className="text-sm">💡</span>
                              <div>
                                <strong className="block text-[10px] uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-0.5">
                                  PRO CARPENTRY TIP:
                                </strong>
                                <span>{step.proTip}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {/* Spacer for layout stability */}
                  <div className="p-4 sm:p-5 rounded-2xl h-full w-full pointer-events-none invisible" aria-hidden="true">
                     <div className="h-32"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION 10: OBJECTIVE MATERIAL BENCHMARK (STICKY TABLE)       */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section id="comparison" className="w-full bg-white dark:bg-stone-950 pt-10 pb-12 sm:pb-16 px-4 sm:px-8 lg:px-12 border-t border-stone-200 dark:border-stone-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
            <div>
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
      <section id="collections-hub" className="w-full bg-stone-100/60 dark:bg-stone-900/40 py-10 sm:py-14 px-4 sm:px-8 lg:px-12 border-t border-stone-200 dark:border-stone-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h2 className="text-xl sm:text-3xl font-black text-stone-900 dark:text-white tracking-tight">
                Architectural Wall Panel Collections
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 font-light mt-0.5">
                Explore sister series engineered for bespoke luxury interiors across Delhi NCR
              </p>
            </div>
            <Link href="/wall-panels" className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1.5 flex-shrink-0">
              View All Wall Panel Series →
            </Link>
          </div>

          {/* Installed Image Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {SISTER_COLLECTIONS.map((col) => (
              <Link
                key={col.id}
                href={col.url}
                className="group flex flex-col rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-amber-500/70 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
              >
                {/* 16:9 Installed Scene Image */}
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-stone-950">
                  <img
                    src={col.image}
                    alt={col.altText || col.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent" />
                  
                  {/* Top Category Tag */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-stone-950/80 backdrop-blur text-amber-400 border border-amber-500/30">
                      {col.tag}
                    </span>
                  </div>

                  {/* Bottom Shade Count Pill */}
                  <div className="absolute bottom-3 right-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-white/90 dark:bg-stone-900/90 text-stone-900 dark:text-white font-semibold">
                      {col.shades}
                    </span>
                  </div>
                </div>

                {/* Card Info Body */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-stone-500 uppercase tracking-wider block mb-1">
                      {col.subtitle}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-stone-900 dark:text-white group-hover:text-amber-500 transition-colors flex items-center justify-between">
                      <span>{col.name}</span>
                      <span className="text-amber-500 text-sm transform transition-transform group-hover:translate-x-1">→</span>
                    </h3>
                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 font-mono">
                      {col.specs}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION 12: FREQUENTLY ASKED QUESTIONS                        */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section id="faq-section" className="w-full bg-white dark:bg-stone-950 pt-10 pb-12 sm:pb-16 px-4 sm:px-8 lg:px-12 border-t border-stone-200 dark:border-stone-800">
        <div className="max-w-4xl mx-auto">
          <FAQ
            title="Frequently Asked Questions — Primo Wall Panels"
            description="Clear, factual answers regarding Primo pricing, damp wall installation, fire certifications, and wholesale supply in Gurgaon and across India."
            items={PRIMO_FAQS}
            className="w-full pt-0 pb-4 px-0 max-w-4xl mx-auto"
          />
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION 13: SPECIFICATION & QUOTATION DESK                    */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section id="rfq-section" className="w-full px-4 sm:px-8 lg:px-12 py-12 sm:py-20 bg-stone-100/80 dark:bg-stone-900/60 border-t border-stone-200 dark:border-stone-800 relative overflow-hidden">
        <div className="max-w-3xl mx-auto relative z-10 text-center">
          <div className="mb-8">
            <span className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 mb-2 block">
              Architectural Consultation & Mill Dispatch
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-stone-900 dark:text-white tracking-tight mb-3">
              Ready to Specify Primo?
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 font-light leading-relaxed max-w-xl mx-auto">
              Request factory wholesale pricing, physical swatch deliveries in Gurgaon & Delhi NCR, or instant bill-of-quantities calculation for your project.
            </p>
          </div>

          {/* Single High-Conversion CTA Button */}
          <div className="flex justify-center max-w-md mx-auto">
            <button
              type="button"
              onClick={() => setIsInquiryModalOpen(true)}
              className="w-full py-4 px-8 rounded-2xl bg-amber-500 hover:bg-amber-400 active:scale-98 text-stone-950 font-black text-sm sm:text-base uppercase tracking-wider shadow-[0_10px_30px_rgba(245,158,11,0.35)] hover:shadow-[0_15px_40px_rgba(245,158,11,0.5)] transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer group"
            >
              <span>Connect with Procurement Desk</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 3-OPTION PROCUREMENT INQUIRY MODAL (WHATSAPP / CALL / FORM)   */}
      {/* ───────────────────────────────────────────────────────────── */}
      {isInquiryModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="inquiry-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md animate-in fade-in duration-200"
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
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-500 font-bold block mb-1">
                Direct Mill Desk • Gurugram Hub
              </span>
              <h3 id="inquiry-modal-title" className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Connect with Procurement
              </h3>
              <p className="text-xs sm:text-sm text-stone-400 mt-1 leading-relaxed">
                Choose how you would like to connect for Primo Panels factory rates, sample swatches, or project estimates.
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
                      body: JSON.stringify({ source: 'primo-inquiry-modal-whatsapp', panel: selectedPanel.code }),
                    }).catch(() => {});
                  } catch {}
                  const msg = `Hi WholesalerJi, I want to inquire about Primo Wall Panels (${selectedPanel.code} - ${selectedPanel.name}) wholesale rates and delivery in Gurgaon/Delhi NCR.`;
                  window.open(`https://wa.me/919217400163?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
                  setIsInquiryModalOpen(false);
                }}
                className="w-full p-4 rounded-2xl bg-stone-800/80 hover:bg-[#25D366]/10 border border-stone-700/60 hover:border-[#25D366] transition-all duration-200 flex items-center gap-4 text-left group cursor-pointer"
              >
                {/* Authentic WhatsApp Official Vector */}
                <div className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center drop-shadow-md group-hover:scale-105 transition-transform">
                  <svg
                    className="w-11 h-11 select-none"
                    viewBox="0 0 175.216 175.552"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      <linearGradient id="wa-modal-primo" x1="85.915" x2="86.535" y1="32.567" y2="137.092" gradientUnits="userSpaceOnUse">
                        <stop offset="0" stopColor="#57d163" />
                        <stop offset="1" stopColor="#23b33a" />
                      </linearGradient>
                    </defs>
                    <path fill="#ffffff" d="m12.966 161.238 10.439-38.114a73.42 73.42 0 0 1-9.821-36.772c.017-40.556 33.021-73.55 73.578-73.55 19.681.01 38.154 7.669 52.047 21.572s21.537 32.383 21.53 52.037c-.018 40.553-33.027 73.553-73.578 73.553h-.032c-12.313-.005-24.412-3.094-35.159-8.954z"/>
                    <path fill="url(#wa-modal-primo)" d="M87.184 25.227c-33.733 0-61.166 27.423-61.178 61.13a60.98 60.98 0 0 0 9.349 32.535l1.455 2.313-6.179 22.558 23.146-6.069 2.235 1.324c9.387 5.571 20.15 8.517 31.126 8.523h.023c33.707 0 61.14-27.426 61.153-61.135a60.75 60.75 0 0 0-17.895-43.251 60.75 60.75 0 0 0-43.235-17.928z"/>
                    <path fill="#ffffff" fillRule="evenodd" d="M68.772 55.603c-1.378-3.061-2.828-3.123-4.137-3.176l-3.524-.043c-1.226 0-3.218.46-4.902 2.3s-6.435 6.287-6.435 15.332 6.588 17.785 7.506 19.013 12.718 20.381 31.405 27.75c15.529 6.124 18.689 4.906 22.061 4.6s10.877-4.447 12.408-8.74 1.532-7.971 1.073-8.74-1.685-1.226-3.525-2.146-10.877-5.367-12.562-5.981-2.91-.919-4.137.921-4.746 5.979-5.819 7.206-2.144 1.381-3.984.462-7.76-2.861-14.784-9.124c-5.465-4.873-9.154-10.891-10.228-12.73s-.114-2.835.808-3.751c.825-.824 1.838-2.147 2.759-3.22s1.224-1.84 1.836-3.065.307-2.301-.153-3.22-4.032-10.011-5.666-13.647"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white group-hover:text-[#25D366] transition-colors text-sm sm:text-base">
                      Chat on WhatsApp
                    </span>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-[#25D366]/20 text-[#25D366] font-bold">
                      Instant
                    </span>
                  </div>
                  <p className="text-xs text-stone-400 mt-0.5">
                    Live chat for instant quotes, live video swatches & shade stock verification.
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-stone-500 group-hover:text-[#25D366] group-hover:translate-x-1 transition-all flex-shrink-0" />
              </button>

              {/* Option 2: Direct Call */}
              <a
                href="tel:+919217400163"
                onClick={() => {
                  try {
                    fetch('/api/analytics/whatsapp-clicks', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ source: 'primo-inquiry-modal-call', panel: selectedPanel.code }),
                    }).catch(() => {});
                  } catch {}
                  setIsInquiryModalOpen(false);
                }}
                className="w-full p-4 rounded-2xl bg-stone-800/80 hover:bg-amber-500/10 border border-stone-700/60 hover:border-amber-500 transition-all duration-200 flex items-center gap-4 text-left group cursor-pointer block"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-500 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                  <Phone className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white group-hover:text-amber-400 transition-colors text-sm sm:text-base">
                      Direct Phone Call
                    </span>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-bold">
                      +91 92174 00163
                    </span>
                  </div>
                  <p className="text-xs text-stone-400 mt-0.5">
                    Speak directly with our technical procurement manager in Gurgaon.
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-stone-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all flex-shrink-0" />
              </a>

              {/* Option 3: Online Quotation Form */}
              <button
                type="button"
                onClick={() => {
                  setIsInquiryModalOpen(false);
                  const showcase = document.getElementById('universal-showcase');
                  if (showcase) {
                    showcase.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                  setTimeout(() => {
                    window.dispatchEvent(new CustomEvent('open-showcase-quote-modal'));
                    const btn = document.getElementById('showcase-get-quote-btn') as HTMLButtonElement;
                    if (btn) btn.click();
                  }, 600);
                }}
                className="w-full p-4 rounded-2xl bg-stone-800/80 hover:bg-stone-700/60 border border-stone-700/60 hover:border-stone-500 transition-all duration-200 flex items-center gap-4 text-left group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-stone-700/50 border border-stone-600/50 text-stone-200 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white group-hover:text-stone-200 transition-colors text-sm sm:text-base">
                      Online Quotation Form
                    </span>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-stone-700 text-stone-300 font-bold">
                      BOQ Calculator
                    </span>
                  </div>
                  <p className="text-xs text-stone-400 mt-0.5">
                    Specify wall dimensions, pick multiple shades, and request formal GST quote.
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-stone-500 group-hover:text-white group-hover:translate-x-1 transition-all flex-shrink-0" />
              </button>
            </div>

            {/* Footer Assurance */}
            <div className="mt-6 pt-4 border-t border-stone-800 flex items-center justify-between text-[11px] text-stone-500 font-mono">
              <span>📍 Mill Depot: Sector 34, Gurugram</span>
              <span>⚡ 100% Factory Direct</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
