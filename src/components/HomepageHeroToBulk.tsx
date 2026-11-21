'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { ALL_WALL_PANELS } from '../data/wallPanelsData';

const WA_NUMBER = '919217400163';

// ------------------------------------------------------------------
// Image lookup from the repo's own data (no invented URLs)
// ------------------------------------------------------------------
type Panel = {
  code?: string;
  id?: string;
  sku?: string;
  name?: string;
  title?: string;
  imageUrl?: string;
  image?: string;
  swatch?: string;
  thumbnail?: string;
  installedImage?: string;
  installed?: string;
  roomImage?: string;
  [key: string]: unknown;
};

function findPanel(code: string): Panel | undefined {
  const needle = code.toLowerCase();
  return (ALL_WALL_PANELS as unknown as Panel[]).find((p) => {
    const fields = [p.code, p.id, p.sku, p.name, p.title];
    return fields.some(
      (v) => typeof v === 'string' && v.toLowerCase().includes(needle),
    );
  });
}

function pickImage(panel: Panel | undefined, keys: string[]): string {
  if (!panel) return '';
  for (const key of keys) {
    const value = panel[key];
    if (typeof value === 'string' && value.trim() !== '') return value;
  }
  return '';
}

// 10 Flat architectural panels ONLY for the Hero background (zero fluted panels)
// Exact Swaps Applied:
// - Left 4th (GF-403) <-> Right 2nd (GF-306)
// - Left 2nd (GF-401) <-> Right 4th (GF-305)
const SLAT_PANEL_CODES = [
  'GF-301', // Pos 1 (index 0) - White Nordic Ash Wood
  'GF-305', // Pos 2 (index 1) - Travertine Beige Marble (swapped with right 4th)
  'GF-302', // Pos 3 (index 2) - Cream European Oak
  'GF-306', // Pos 4 (index 3) - Honey Golden Oak (swapped with right 2nd)
  'GF-304', // Pos 5 (index 4) - Natural Burmese Teak Wood
  'GF-404', // Pos 6 (index 5) - Royal Gold Floral Filigree
  'GF-401', // Pos 7 (index 6) - Calacatta Gold UV Marble (swapped with left 2nd)
  'GF-405', // Pos 8 (index 7) - Italian Statuario White Marble
  'GF-403', // Pos 9 (index 8) - Brushed Silver Metallic Luster (swapped with left 4th)
  'GF-407', // Pos 10 (index 9) - Golden Amber Onyx Translucent
];

// The 6 Ranges with authentic installed room scenes & exact specifications
const RANGES_DATA = [
  {
    no: '01',
    name: 'Primo PVC Wall Panels',
    designsCount: '24 designs',
    specs: 'GF-301 – GF-324 · 2950 × 300 mm',
    link: '/wall-panels/primo',
    installedImage:
      '/images/def2qsxjg/f_auto,q_auto/v1790874187/GF-302_Premium_Pvc_Panel_Primo_Series_in_living_room.jpg',
  },
  {
    no: '02',
    name: 'Elite UV Wall Panels',
    designsCount: '12 designs',
    specs: 'GF-401 – GF-412 · High-gloss marble',
    link: '/wall-panels/elite',
    installedImage:
      '/images/def2qsxjg/f_auto,q_auto/v1790401394/GF-401_Premium_Pvc_Panel_In_Gurgaon_installed_image.jpg',
  },
  {
    no: '03',
    name: 'Primo Fluted Panels',
    designsCount: '13 designs',
    specs: 'FP-701 – FP-713 · Wood louvers',
    link: '/wall-panels/primo-fluted',
    installedImage:
      '/images/def2qsxjg/f_auto,q_auto/v1790929796/FP-701_installed_image_in_reception_area.jpg',
  },
  {
    no: '04',
    name: 'Elite Fluted Panels',
    designsCount: '9 designs',
    specs: 'FP-714 – FP-722 · Premium texture',
    link: '/wall-panels/elite-fluted',
    installedImage:
      '/images/def2qsxjg/f_auto,q_auto/v1793531236/FP-714_Modern_Reception_Lobby_with_Vertical_Wood_Panelling.jpg',
  },
  {
    no: '05',
    name: 'SPC Flooring',
    designsCount: '15 shades',
    specs: '100% waterproof click-lock planks',
    link: '/spc-flooring',
    installedImage:
      '/images/def2qsxjg/f_auto,q_auto/v1792831101/spc-flooring-295-natural-warm-oak-installed-wholesalerji-gurgaon.jpg',
  },
  {
    no: '06',
    name: 'Artificial Grass',
    designsCount: '8 options',
    specs: 'Landscape & designer patterns',
    link: '/artificial-grass',
    installedImage: '/assets/grass/review_normal_lawn.jpg',
  },
];

// Grass / SPC only: fill these 4 URLs from the repo's own product data
const IMAGE_OVERRIDES: Record<string, { swatch?: string; installed?: string }> = {
  'GRASS-35': {
    swatch: '/images/dcezlxt8r/f_auto,q_auto/v1787308036/35mm_Artificial_Grass.png',
    installed: '/images/dcezlxt8r/f_auto,q_auto/v1772476497/artificial_grass_wholesaler_in_delhi.jpg',
  },
  'GRASS-50': {
    swatch: '/images/dcezlxt8r/f_auto,q_auto/v1787308036/50mm_Artificial_Grass_Goals_FLoors.png',
    installed: '/images/dcezlxt8r/f_auto,q_auto/v1772476418/premium_Artificial_grass_installed_photo.jpg',
  },
  'SPC-OAK': {
    swatch: '/images/dcezlxt8r/f_auto,q_auto/v1775452465/G-F_SPC_295.jpg',
    installed: '/images/def2qsxjg/f_auto,q_auto/v1792831101/spc-flooring-295-natural-warm-oak-installed-wholesalerji-gurgaon.jpg',
  },
  'SPC-GREY': {
    swatch: '/images/dcezlxt8r/f_auto,q_auto/v1775453460/H-GREY.jpg',
    installed: '/images/def2qsxjg/f_auto,q_auto/v1792831569/spc_archived_301_grey_lounge.jpg',
  },
};

// ------------------------------------------------------------------
// Bulk Order — 100 / 500 / 1000, each with its tailored WhatsApp message & specs
// ------------------------------------------------------------------
const BULK_CASES = [
  {
    qty: '100',
    unit: 'PIECES',
    headline: 'Trial lot — one design, one site',
    description:
      'Carton-packed with corner protection and dispatched within 2–3 working days. The standard first order for new dealers and single-site projects.',
    message:
      'Hi WholesalerJi, I want to place a trial bulk order of 100 pcs. Please share the sample box details and delivery timeline.',
  },
  {
    qty: '500',
    unit: 'PIECES',
    headline: 'Dealer stock — mix across 5 designs',
    description:
      'Consignment pack with custom box labeling, priority dispatch, and tiered volume discounts for stocking retail dealers.',
    message:
      'Hi WholesalerJi, I want to place a bulk order of 500 pcs (mixed designs). Please share the volume rate card and freight estimate.',
  },
  {
    qty: '1000',
    unit: 'PIECES',
    headline: 'Project lot — full commercial consignment',
    description:
      'Direct-from-mill dedicated truck dispatch, certified test reports, batch-matched dye lots, and pan-India site delivery.',
    message:
      'Hi WholesalerJi, I have a commercial project requirement for 1000+ pcs. Please share mill-direct dispatch rates and delivery schedule.',
  },
];

type TapDesign = {
  code: string;
  name: string;
  room: string;
  swatch: string;
  installed: string;
};

// 8 Curated architectural wall panels with verified real installed room scenes
const TAP_WALL_DESIGNS: TapDesign[] = [
  {
    code: 'GF-302',
    name: 'Cream European Oak',
    room: 'Living Room Feature Wall',
    swatch:
      '/images/dcezlxt8r/f_auto,q_auto/v1776780203/GF-302_Premium_Pvc_Panel_Primo_Series.png',
    installed:
      '/images/def2qsxjg/f_auto,q_auto/v1790874187/GF-302_Premium_Pvc_Panel_Primo_Series_in_living_room.jpg',
  },
  {
    code: 'GF-305',
    name: 'Travertine Beige Marble',
    room: 'Hall Feature Wall',
    swatch:
      '/images/dcezlxt8r/f_auto,q_auto/v1776780202/GF-305_Latest_Pvc_Panel_Design.png',
    installed:
      '/images/def2qsxjg/f_auto,q_auto/v1790874283/GF-305_Latest_Pvc_Panel_Design_in_hall.jpg',
  },
  {
    code: 'GF-401',
    name: 'Calacatta Gold Marble',
    room: 'Luxury Living Room Wall',
    swatch:
      '/images/dcezlxt8r/f_auto,q_auto/v1776777064/GF-401_Premium_Pvc_Panel_In_Gurgaon.png',
    installed:
      '/images/def2qsxjg/f_auto,q_auto/v1790401394/GF-401_Premium_Pvc_Panel_In_Gurgaon_installed_image.jpg',
  },
  {
    code: 'GF-404',
    name: 'Royal Gold Floral Filigree',
    room: 'Dining Console Backdrop',
    swatch:
      '/images/dcezlxt8r/f_auto,q_auto/v1776777061/GF-404_Gold_Flower_Design_Pvc_Panel.png',
    installed:
      '/images/def2qsxjg/f_auto,q_auto/v1790401403/GF-404_Gold_Flower_Design_Pvc_Panel_installed_image.jpg',
  },
  {
    code: 'GF-403',
    name: 'Brushed Silver Metallic',
    room: 'Modern Reception Lounge',
    swatch:
      '/images/dcezlxt8r/f_auto,q_auto/v1776777062/GF-403_Silver_Color_Pvc_Panel.png',
    installed:
      '/images/def2qsxjg/f_auto,q_auto/v1790401391/GF-403_Silver_Color_Pvc_Panel_installed_image.jpg',
  },
  {
    code: 'GF-304',
    name: 'Natural Burmese Teak',
    room: 'Executive Office Wall',
    swatch:
      '/images/dcezlxt8r/f_auto,q_auto/v1776780202/GF-304_New_Launch_Wall_Panel_Design.png',
    installed:
      '/images/def2qsxjg/f_auto,q_auto/v1790874235/GF-304_New_Launch_Wall_Panel_Design_in_office.jpg',
  },
  {
    code: 'FP-701',
    name: 'Primo Fluted Classic Wood',
    room: 'Corporate Reception Area',
    swatch: '/images/dcezlxt8r/f_auto,q_auto/Fluted_Panel_FP_-_701.png',
    installed:
      '/images/def2qsxjg/f_auto,q_auto/v1790929796/FP-701_installed_image_in_reception_area.jpg',
  },
  {
    code: 'FP-714',
    name: 'Elite Fluted Modern Walnut',
    room: 'Modern Lobby Louver Feature',
    swatch: '/images/dcezlxt8r/f_auto,q_auto/Fluted_Panel_FP_-_714.png',
    installed:
      '/images/def2qsxjg/f_auto,q_auto/v1793531236/FP-714_Modern_Reception_Lobby_with_Vertical_Wood_Panelling.jpg',
  },
];

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-5 w-5">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}

// ------------------------------------------------------------------
// Installed Work Bento Grid — Authentic finished room installations
// ------------------------------------------------------------------
const INSTALLED_BENTO_ITEMS = [
  {
    title: 'Corporate office lobby',
    subtitle: 'Charcoal fluted feature wall',
    image: '/images/def2qsxjg/f_auto,q_auto/v1791125624/charcoal_fluted_office_insitu.jpg',
    gridClass: 'col-span-2 aspect-[16/10] sm:aspect-auto sm:min-h-[300px] lg:col-span-2 lg:row-span-2 lg:min-h-[390px]',
  },
  {
    title: 'Reception',
    subtitle: 'GF-309 · Muted Sandstone',
    image: '/images/def2qsxjg/f_auto,q_auto/v1790874891/GF-309_Goals_Floors_Premium_Pvc_Panel_reception_installed_image.png',
    gridClass: 'col-span-1 aspect-[4/5] sm:aspect-auto sm:min-h-[170px] lg:col-span-1 lg:row-span-1 lg:min-h-[190px]',
  },
  {
    title: 'Master bedroom',
    subtitle: 'FP-703 · Premium Teak',
    image: '/images/def2qsxjg/f_auto,q_auto/v1790929811/FP-703_installed_image_in_bedroom.jpg',
    gridClass: 'col-span-1 aspect-[4/5] sm:aspect-auto sm:min-h-[170px] lg:col-span-1 lg:row-span-1 lg:min-h-[190px]',
  },
  {
    title: 'Retail shop',
    subtitle: 'GF-322 · Urban Slate Ash',
    image: '/images/def2qsxjg/f_auto,q_auto/v1790908348/GF-322_12_inch_Premium_Pvc_Panel_Grey_Colour_installed_image_in_shop.jpg',
    gridClass: 'col-span-1 aspect-[4/5] sm:aspect-auto sm:min-h-[170px] lg:col-span-1 lg:row-span-1 lg:min-h-[190px]',
  },
  {
    title: 'Apartment floor',
    subtitle: 'SPC · Natural Warm Oak',
    image: '/images/def2qsxjg/f_auto,q_auto/v1792831101/spc-flooring-295-natural-warm-oak-installed-wholesalerji-gurgaon.jpg',
    gridClass: 'col-span-1 aspect-[4/5] sm:aspect-auto sm:min-h-[170px] lg:col-span-1 lg:row-span-1 lg:min-h-[190px]',
  },
  {
    title: 'Villa garden lawn',
    subtitle: 'Landscape artificial grass turf',
    image: '/assets/grass/review_normal_lawn.jpg',
    gridClass: 'col-span-2 sm:col-span-1 lg:col-span-2 aspect-[16/9] sm:aspect-auto sm:min-h-[200px] lg:row-span-1 lg:min-h-[220px]',
  },
  {
    title: 'Premium residence',
    subtitle: 'GF-404 · Royal Gold Floral',
    image: '/images/def2qsxjg/f_auto,q_auto/v1790401403/GF-404_Gold_Flower_Design_Pvc_Panel_installed_image.jpg',
    gridClass: 'col-span-2 sm:col-span-1 lg:col-span-2 aspect-[16/9] sm:aspect-auto sm:min-h-[200px] lg:row-span-1 lg:min-h-[220px]',
  },
];

function GoogleLogo({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-label="Google">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

export interface ProofOfWorkItem {
  id: string;
  name: string;
  role: string;
  firm: string;
  location: string;
  avatarColor: string;
  initials: string;
  rating: number;
  date: string;
  material: string;
  sitePhoto: string;
  siteTitle: string;
  siteStats: string;
  quote: string;
}

export const PROOF_OF_WORK_REVIEWS: ProofOfWorkItem[] = [
  {
    id: 'pow-1',
    name: 'Amit Verma',
    role: 'Interior Contractor',
    firm: 'Verma Luxury Interiors',
    location: 'Sector 54, Gurugram',
    avatarColor: 'from-amber-600 to-amber-800',
    initials: 'AV',
    rating: 5,
    date: '2 days ago',
    material: '12" Seamless Charcoal Fluted Louvers',
    sitePhoto: '/images/def2qsxjg/f_auto,q_auto/v1790410859/review_1.jpg',
    siteTitle: 'Luxury Penthouse Living Room TV Wall',
    siteStats: '450 sq.ft • 2-Hour Factory Dispatch',
    quote: 'I ordered 12-inch PVC panels for a site in Sector 54. The delivery was incredibly fast, reaching us within just 2 hours. Buying directly from the factory without middlemen saved us a lot of money. Highly recommend WholesalerJi for their pricing and speed.',
  },
  {
    id: 'pow-2',
    name: 'Neha Kapoor',
    role: 'Home Owner',
    firm: 'DLF Phase 2 Residence',
    location: 'DLF Phase 2, Gurugram',
    avatarColor: 'from-emerald-600 to-emerald-800',
    initials: 'NK',
    rating: 5,
    date: '5 days ago',
    material: 'Italian UV Marble & Charcoal Louvers',
    sitePhoto: '/images/def2qsxjg/f_auto,q_auto/v1790410887/review_2.jpg',
    siteTitle: 'High-Gloss Feature Wall & Console',
    siteStats: '620 sq.ft • Zero Visible Joints',
    quote: 'We installed charcoal louvers on our living room TV wall. The finish is seamless with absolutely no visible joints. It looks incredibly premium and is very easy to clean. I am really happy with the final result.',
  },
  {
    id: 'pow-3',
    name: 'Rajesh Malhotra',
    role: 'Builder & Developer',
    firm: 'Malhotra Constructions',
    location: 'Greater Kailash, South Delhi',
    avatarColor: 'from-blue-600 to-blue-800',
    initials: 'RM',
    rating: 5,
    date: '1 week ago',
    material: '100% Waterproof PVC Fluted Cladding',
    sitePhoto: '/images/def2qsxjg/f_auto,q_auto/v1790410828/review_3.jpg',
    siteTitle: 'Basement Seepage Proofing Solution',
    siteStats: '1,200 sq.ft • 100% Water Resistant',
    quote: 'We were struggling with basement wall seepage for over two years. Nothing seemed to work until we tried these waterproof PVC panels. They completely stopped the moisture and look absolutely flawless. A perfect, long-lasting solution for damp walls.',
  },
  {
    id: 'pow-4',
    name: 'Ar. Rohit Sen',
    role: 'Principal Architect',
    firm: 'Studio Sen Architecture',
    location: 'Sector 62, Noida',
    avatarColor: 'from-purple-600 to-purple-800',
    initials: 'RS',
    rating: 5,
    date: '2 weeks ago',
    material: 'Natural Fluted Oak & Statuario Profile',
    sitePhoto: '/images/def2qsxjg/f_auto,q_auto/v1790410833/review_4.jpg',
    siteTitle: 'Hospitality Suite Architectural Bedhead',
    siteStats: '850 sq.ft • Laser Precision Tongue & Groove',
    quote: 'The interlocking tongue and groove design is perfectly straight. My carpenters found it extremely easy to work with. We finished an 850 sqft wall cladding in less than two days. The quality is definitely up to professional architectural standards.',
  },
  {
    id: 'pow-5',
    name: 'Sneha Patel',
    role: 'Interior Designer',
    firm: 'Vibe Space Design',
    location: 'Bodakdev, Ahmedabad',
    avatarColor: 'from-rose-600 to-rose-800',
    initials: 'SP',
    rating: 5,
    date: '3 weeks ago',
    material: 'Golden Onyx Translucent & WPC Exterior',
    sitePhoto: '/images/def2qsxjg/f_auto,q_auto/v1790410838/review_5.jpg',
    siteTitle: 'Villa Exterior & Accent Passage Corridor',
    siteStats: '780 sq.ft • 1:1 Sample Texture Match',
    quote: 'I asked for a sample box to check the quality before ordering. It arrived the very next morning, which was impressive. The Golden Onyx sheet texture matched our 3D design perfectly. Great service and exact product representation.',
  },
  {
    id: 'pow-6',
    name: 'Vikram Singhal',
    role: 'Turnkey Contractor',
    firm: 'Singhal Projects',
    location: 'Andheri West, Mumbai',
    avatarColor: 'from-cyan-600 to-cyan-800',
    initials: 'VS',
    rating: 5,
    date: '1 month ago',
    material: 'Acoustic Commercial Fluted Paneling',
    sitePhoto: '/images/def2qsxjg/f_auto,q_auto/v1790410853/review_6.jpg',
    siteTitle: 'Commercial Studio Sound-Absorbing Wall',
    siteStats: '1,500 sq.ft • ₹1.4 Lakh Factory Savings',
    quote: 'Local dealers were asking for ₹95 per sqft for the same material. WholesalerJi provided direct factory rates at just ₹48 per sqft. We saved over ₹1.4 Lakh on our bulk commercial order. The best pricing I have found in the market.',
  },
];

export default function HomepageHeroToBulk() {
  // Live website accent color listener (syncs instantly when navbar color changes; default is #ef4444 red)
  const [accentColor, setAccentColor] = useState('#ef4444');

  // Track hover index for The Ranges section
  const [hoveredRange, setHoveredRange] = useState<number | null>(null);

  // Proof of work active carousel index & hover pause state
  const [activeProofIndex, setActiveProofIndex] = useState(0);
  const [isHoveringProofGallery, setIsHoveringProofGallery] = useState(false);

  // Active preview item for Installed Work Bento Grid on mobile/desktop tap
  const [previewInstalledItem, setPreviewInstalledItem] = useState<(typeof INSTALLED_BENTO_ITEMS)[0] | null>(null);

  // Auto-cycle through Proof of Work & Reviews when idle
  useEffect(() => {
    if (isHoveringProofGallery || PROOF_OF_WORK_REVIEWS.length === 0) return;
    const interval = setInterval(() => {
      setActiveProofIndex((prev) => (prev + 1) % PROOF_OF_WORK_REVIEWS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isHoveringProofGallery]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const saved = localStorage.getItem('custom-theme-color');
    if (saved && saved.startsWith('#')) {
      setAccentColor(saved);
    } else {
      const computed = getComputedStyle(document.documentElement)
        .getPropertyValue('--color-amber-500')
        .trim();
      if (computed && computed.startsWith('#')) {
        setAccentColor(computed);
      }
    }

    const onThemeChange = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (
        customEvent.detail &&
        typeof customEvent.detail === 'string' &&
        customEvent.detail.startsWith('#')
      ) {
        setAccentColor(customEvent.detail);
      }
    };

    window.addEventListener('theme-color-changed', onThemeChange);
    return () => window.removeEventListener('theme-color-changed', onThemeChange);
  }, []);

  // 10 Curated flat architectural panels for the Hero background (zero fluted panels)
  const heroSlats = useMemo(() => {
    return SLAT_PANEL_CODES.map((code, i) => {
      const panel = findPanel(code);
      const img = pickImage(panel, ['imageUrl', 'image', 'swatch', 'thumbnail']);
      if (img) return img;
      const fallback = (ALL_WALL_PANELS as unknown as Panel[])[i % 10];
      return pickImage(fallback, ['imageUrl', 'image', 'swatch', 'thumbnail']);
    });
  }, []);

  const [activeDesign, setActiveDesign] = useState<TapDesign>(
    TAP_WALL_DESIGNS[2] ?? TAP_WALL_DESIGNS[0],
  );
  const [bulkQty, setBulkQty] = useState(BULK_CASES[0]);

  return (
    <div className="w-full overflow-x-clip bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 transition-colors">
      {/* ───────────────────────────────────────────────────────────── */}
      {/* 1 — HERO: 100% Clear Panels (No Dark Overlay), Left-Aligned   */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section className="relative flex min-h-[85vh] sm:min-h-screen w-full items-center justify-start overflow-hidden pt-20 pb-16 sm:py-24">
        {/* 10 Architectural Slat Panels (Zero Dark Overlay, 100% Clear & Natural) */}
        <div className="absolute inset-0 flex" aria-hidden="true">
          {heroSlats.map((src, i) => (
            <div
              key={i}
              className="relative h-full flex-1 overflow-hidden border-r border-black/10 dark:border-white/10 bg-stone-200 dark:bg-stone-900"
            >
              {src && (
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-out hover:scale-105"
                  style={{ backgroundImage: `url(${src})` }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Subtle left scrim ensuring text has pristine contrast over lighter panels without tinting right side */}
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/75 via-stone-950/25 to-transparent pointer-events-none" />

        {/* Content Container Aligned Strictly to the LEFT */}
        <div className="relative z-10 w-full max-w-3xl lg:max-w-4xl px-4 sm:px-8 lg:px-16 flex flex-col items-start text-left">
          {/* Typographic Kicker */}
          <p
            className="text-xs sm:text-sm font-bold uppercase tracking-[0.25em] mb-3 sm:mb-4 transition-colors drop-shadow-sm"
            style={{ color: accentColor }}
          >
            Factory-Direct Wholesale • Pan-India Delivery
          </p>

          {/* Main H1 Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-7xl font-black text-white leading-[1.08] tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
            Wholesale Wall Panels for{' '}
            <span
              className="transition-colors"
              style={{ color: accentColor }}
            >
              Projects
            </span>
            , Retail &amp; Commercial Spaces
          </h1>

          {/* Subline */}
          <p className="mt-4 sm:mt-5 max-w-xl text-sm sm:text-lg lg:text-xl text-stone-100 font-semibold leading-relaxed drop-shadow-sm">
            One mill. No middlemen.
          </p>

          {/* Call to Actions (Mobile touch optimized) */}
          <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-4 w-full sm:w-auto">
            <a
              href="/wall-panels"
              className="rounded-full px-7 sm:px-8 py-3.5 sm:py-4 text-sm sm:text-base font-bold text-stone-950 transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl flex items-center justify-center gap-2 group cursor-pointer"
              style={{
                backgroundColor: accentColor,
                boxShadow: `0 0 35px ${accentColor}77`,
              }}
            >
              <span>Explore Wall Panels</span>
              <svg
                className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </a>
            <a
              href="#catalog"
              className="rounded-full border border-stone-300 dark:border-white/50 hover:border-stone-900 dark:hover:border-white bg-white/70 dark:bg-black/50 hover:bg-white dark:hover:bg-black/70 backdrop-blur-md px-7 sm:px-8 py-3.5 sm:py-4 text-sm sm:text-base font-bold text-stone-900 dark:text-white transition-all duration-300 shadow-lg text-center cursor-pointer"
            >
              See our work
            </a>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 2 — RANGES: Smooth Center-Expanding & Closing Circle Reveal   */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section className="w-full bg-white dark:bg-[#070D18] py-14 sm:py-20 lg:py-24 text-stone-900 dark:text-white transition-colors border-y border-stone-200 dark:border-white/10">
        <div className="w-full px-4 sm:px-8 lg:px-20 mb-8 sm:mb-10">
          <p
            className="text-xs sm:text-sm font-bold uppercase tracking-[0.25em] mb-2 sm:mb-3 transition-colors"
            style={{ color: accentColor }}
          >
            THE RANGES
          </p>
          <h2
            className="text-2xl sm:text-4xl lg:text-[42px] font-bold text-stone-900 dark:text-white tracking-tight leading-tight"
          >
            Six ranges. Eighty-one designs.
          </h2>
        </div>

        {/* Full-bleed rows covering the full screen width */}
        <div className="border-t border-stone-200 dark:border-white/10 w-full">
          {RANGES_DATA.map((r, idx) => {
            const isHovered = hoveredRange === idx;
            const isLast = idx === RANGES_DATA.length - 1;
            return (
              <a
                key={r.no}
                href={r.link}
                onMouseEnter={() => setHoveredRange(idx)}
                onMouseLeave={() => setHoveredRange(null)}
                className={`group relative flex w-full flex-col sm:flex-row sm:items-center justify-between px-4 sm:px-8 lg:px-20 py-5 sm:py-7 lg:py-8 text-left transition-colors overflow-hidden ${
                  isLast ? '' : 'border-b border-stone-200 dark:border-white/10'
                } hover:bg-stone-50/80 dark:hover:bg-white/[0.02] active:bg-stone-100 dark:active:bg-white/5`}
              >
                {/* Smooth Circular Growing & Closing Reveal strictly from the row's exact center (50% 50%) */}
                <div
                  className="pointer-events-none absolute inset-0 overflow-hidden"
                  style={{
                    clipPath: isHovered
                      ? 'circle(120% at 50% 50%)'
                      : 'circle(0% at 50% 50%)',
                    transition: isHovered
                      ? 'clip-path 850ms cubic-bezier(0.25, 0.1, 0.25, 1)'
                      : 'clip-path 650ms cubic-bezier(0.22, 1, 0.36, 1)',
                  }}
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${r.installedImage})`,
                      transform: isHovered ? 'scale(1.04)' : 'scale(1.0)',
                      transition: 'transform 900ms ease-out',
                    }}
                  />
                  {/* Subtle dark backdrop on hover so text remains crystal clear */}
                  <div className="absolute inset-0 bg-black/40 dark:bg-black/50" />
                </div>

                {/* Left: Number + Range Name in Bold Modern Sans */}
                <div className="relative z-10 flex items-baseline gap-3 sm:gap-6 lg:gap-8 transition-transform duration-500 group-hover:-translate-x-1">
                  <span
                    className="font-black text-base sm:text-2xl transition-colors shrink-0 tracking-wide"
                    style={{
                      color: accentColor,
                    }}
                  >
                    {r.no}
                  </span>
                  <h3
                    className="font-bold text-lg sm:text-3xl lg:text-4xl text-stone-900 dark:text-white group-hover:text-white transition-colors tracking-tight"
                  >
                    {r.name}
                  </h3>
                </div>

                {/* Right: Design count + specs + arrow */}
                <div className="relative z-10 flex items-center justify-between sm:justify-end gap-4 sm:gap-8 lg:gap-10 mt-2 sm:mt-0 transition-transform duration-500 group-hover:translate-x-1">
                  <div className="text-left sm:text-right">
                    <span className="block text-xs sm:text-base font-bold text-stone-900 dark:text-white/95 group-hover:text-white transition-colors">
                      {r.designsCount}
                    </span>
                    <span className="block text-[11px] sm:text-sm text-stone-500 dark:text-stone-400 group-hover:text-stone-200 transition-colors mt-0.5">
                      {r.specs}
                    </span>
                  </div>
                  <span
                    className="text-lg sm:text-2xl transition-all duration-300 transform group-hover:translate-x-1.5"
                    style={{ color: accentColor }}
                  >
                    →
                  </span>
                </div>
              </a>
            );
          })}
        </div>

        {/* Footer Note with Clickable Link matching reference design */}
        <div className="w-full px-4 sm:px-8 lg:px-20 pt-6 sm:pt-8 pb-2 sm:pb-4">
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300">
            Every design&apos;s rate is listed on its product page —{' '}
            <a
              href="/wall-panels"
              className="font-medium underline underline-offset-4 transition-opacity hover:opacity-80"
              style={{ color: accentColor }}
            >
              browse all wall panels →
            </a>
          </p>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 3 — TAP A DESIGN: Real Rooms, Instant Switch, Responsive View */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section className="w-full bg-stone-50/70 dark:bg-[#070D18] py-14 sm:py-20 text-stone-900 dark:text-white transition-colors border-t border-stone-200 dark:border-white/10">
        <div className="w-full px-4 sm:px-8 lg:px-20 mb-6 sm:mb-8">
          <p
            className="text-xs sm:text-sm font-bold uppercase tracking-[0.25em] mb-2 sm:mb-3 transition-colors"
            style={{ color: accentColor }}
          >
            TAP A DESIGN
          </p>
          <h2
            className="text-2xl sm:text-4xl lg:text-[42px] font-bold text-stone-900 dark:text-white tracking-tight leading-tight"
          >
            Tap a design. The wall changes — instantly.
          </h2>
        </div>

        {/* Room Viewport — Responsive height: h-[320px] on mobile, h-[440px] sm, h-[calc(55vh+50px)] on desktop */}
        <div className="relative h-[320px] sm:h-[440px] lg:h-[calc(55vh+50px)] min-h-[300px] max-h-[750px] w-full overflow-hidden border-y border-stone-200 dark:border-white/10 bg-stone-200 dark:bg-stone-900">
          {activeDesign?.installed ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={activeDesign.code}
              src={activeDesign.installed}
              alt={`${activeDesign.code} ${activeDesign.name} installed`}
              className="h-full w-full object-cover transition-opacity duration-700 ease-out"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-stone-200 dark:bg-stone-900 text-stone-500 dark:text-white/60 text-sm">
              Installed image — {activeDesign?.code} {activeDesign?.name}
            </div>
          )}

          {/* Floating Room Info Badge */}
          <div className="absolute bottom-3 left-3 sm:bottom-6 sm:left-6 rounded-xl sm:rounded-2xl bg-stone-950/85 dark:bg-[#070D18]/90 border border-white/15 px-3.5 py-2.5 sm:px-5 sm:py-4 backdrop-blur-md shadow-xl sm:shadow-2xl text-white">
            <p
              className="text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-colors"
              style={{ color: accentColor }}
            >
              {activeDesign?.code}
            </p>
            <p className="text-sm sm:text-xl font-bold text-white mt-0.5">{activeDesign?.name}</p>
            <p className="text-[11px] sm:text-sm text-stone-300 mt-0.5">{activeDesign?.room}</p>
          </div>
        </div>

        {/* Scrollable Swatch Deck with 8 Curated Architectural Panels (Clean, borderless cards) */}
        <div className="mt-6 sm:mt-8 flex gap-3 sm:gap-4 overflow-x-auto px-4 sm:px-8 lg:px-20 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden overscroll-x-contain touch-pan-x">
          {TAP_WALL_DESIGNS.map((d) => {
            const isSelected = activeDesign?.code === d.code;
            return (
              <button
                key={d.code}
                type="button"
                onClick={() => setActiveDesign(d)}
                aria-pressed={isSelected}
                className={`flex w-60 sm:w-72 shrink-0 items-center gap-3 sm:gap-3.5 rounded-2xl p-3 sm:p-3.5 text-left transition-all active:scale-[0.98] cursor-pointer shadow-sm hover:shadow-md ${
                  isSelected
                    ? 'bg-stone-100 dark:bg-stone-800'
                    : 'bg-white dark:bg-[#0a1122]/90 hover:bg-stone-50 dark:hover:bg-[#0e172a]'
                }`}
                style={
                  isSelected
                    ? { backgroundColor: `${accentColor}18` }
                    : undefined
                }
              >
                {d.swatch ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={d.swatch}
                    alt={`${d.code} ${d.name} closeup`}
                    className="h-12 w-12 sm:h-14 sm:w-14 shrink-0 rounded-xl object-cover"
                  />
                ) : (
                  <span
                    className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-xl text-xs font-black"
                    style={{ backgroundColor: `${accentColor}30`, color: accentColor }}
                  >
                    {d.code}
                  </span>
                )}
                <span className="min-w-0 flex-1">
                  <span
                    className="block text-xs sm:text-sm font-bold transition-colors"
                    style={{ color: isSelected ? accentColor : undefined }}
                  >
                    {d.code}
                  </span>
                  <span className="block text-xs sm:text-sm text-stone-800 dark:text-stone-200 truncate font-medium">{d.name}</span>
                  <span className="block text-[11px] sm:text-xs text-stone-500 dark:text-stone-400 truncate mt-0.5">{d.room}</span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-3 sm:mt-4 px-4 sm:px-8 lg:px-20 text-xs sm:text-sm">
          <a
            href="/wall-panels"
            className="transition-colors hover:underline font-semibold"
            style={{ color: accentColor }}
          >
            See this range &amp; its rates on the product page →
          </a>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 4 — BULK ORDERS: Stretched full-width with authentic photo    */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section
        id="bulk-orders"
        className="w-full bg-white dark:bg-[#070D18] py-14 sm:py-20 lg:py-24 text-stone-900 dark:text-white transition-colors border-t border-stone-200 dark:border-white/10"
      >
        <div className="w-full px-4 sm:px-8 lg:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center w-full">
            {/* Left Column: Typography + Lot Selector + Detail Box + WhatsApp */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              <p
                className="text-xs sm:text-sm font-bold uppercase tracking-[0.25em] mb-2 sm:mb-3 transition-colors"
                style={{ color: accentColor }}
              >
                BULK ORDERS
              </p>
              <h2
                className="text-2xl sm:text-4xl lg:text-[44px] font-bold text-stone-900 dark:text-white tracking-tight leading-[1.12]"
              >
                Order by the lot, not by the piece.
              </h2>
              <p className="mt-3 sm:mt-4 max-w-xl text-sm sm:text-base text-stone-600 dark:text-stone-300 leading-relaxed font-normal">
                Choose your lot size — designs can be mixed inside one consignment, so a dealer can stock a full range and a builder can cover a full site in a single dispatch. Rates for every design are listed on its product page.
              </p>

              {/* 3 Quantity Selector Cards */}
              <div className="mt-6 sm:mt-8 grid grid-cols-3 gap-2.5 sm:gap-4 w-full max-w-xl">
                {BULK_CASES.map((c) => {
                  const isSelected = bulkQty.qty === c.qty;
                  return (
                    <button
                      key={c.qty}
                      type="button"
                      onClick={() => setBulkQty(c)}
                      aria-pressed={isSelected}
                      className="rounded-2xl border p-3.5 sm:p-5 text-center transition-all bg-stone-50/80 dark:bg-[#0a1122]/90 hover:bg-stone-100 dark:hover:bg-[#0e172a] shadow-sm hover:shadow-md active:scale-95 border-stone-200 dark:border-white/10"
                      style={{
                        borderColor: isSelected ? accentColor : undefined,
                        borderWidth: isSelected ? '2px' : '1px',
                        backgroundColor: isSelected ? `${accentColor}0D` : undefined,
                      }}
                    >
                      <span
                        className="block text-xl sm:text-3xl font-extrabold transition-colors text-stone-900 dark:text-white"
                        style={{ color: isSelected ? accentColor : undefined }}
                      >
                        {c.qty}
                      </span>
                      <span className="block text-[10px] sm:text-xs uppercase tracking-wider text-stone-500 dark:text-stone-400 font-semibold mt-1">
                        {c.unit}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Dynamic Detail Box for Selected Lot */}
              <div className="mt-4 sm:mt-5 w-full max-w-xl rounded-2xl border border-stone-200 dark:border-white/10 bg-stone-50/80 dark:bg-[#0a1122]/80 p-4 sm:p-6 backdrop-blur-sm shadow-sm">
                <h3
                  className="text-base sm:text-lg font-bold text-stone-900 dark:text-white transition-colors tracking-tight"
                >
                  {bulkQty.headline}
                </h3>
                <p className="mt-1 sm:mt-1.5 text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                  {bulkQty.description}
                </p>
              </div>

              {/* WhatsApp Action Button with Live Theme Color */}
              <div className="mt-6 sm:mt-7 w-full sm:w-auto">
                <a
                  href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(bulkQty.message)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2.5 rounded-full px-7 sm:px-8 py-3.5 sm:py-4 text-sm sm:text-base font-bold text-stone-950 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl group w-full sm:w-auto cursor-pointer"
                  style={{
                    backgroundColor: accentColor,
                  }}
                >
                  <WhatsAppIcon />
                  <span>Send this quantity on WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Right Column: High-Res Image & Crisp Floating Badge */}
            <div className="lg:col-span-5 flex items-center justify-center lg:justify-end w-full">
              <div className="relative w-full max-w-[640px] rounded-2xl sm:rounded-3xl border border-stone-200 dark:border-white/20 overflow-hidden shadow-2xl bg-stone-100 dark:bg-[#0a1122] transition-transform duration-500 hover:scale-[1.01]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/def2qsxjg/f_auto,q_auto/v1791125482/designers.jpg"
                  alt="Architectural workspace with material samples, drawings and specs — Pehle sample lijiye, phir bulk order kijiye"
                  className="w-full h-auto min-h-[300px] sm:min-h-[410px] object-cover block"
                />

                {/* Floating Quote Badge with Crisp Native Typography — zero cut-offs, perfect margins */}
                <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 z-10 rounded-xl sm:rounded-2xl bg-stone-950/85 dark:bg-[#070D18]/90 border border-white/15 px-3.5 py-2.5 sm:px-5 sm:py-3.5 backdrop-blur-md shadow-2xl">
                  <p
                    className="text-xs sm:text-base font-bold text-white tracking-tight"
                  >
                    &ldquo;Pehle sample lijiye, phir bulk order kijiye.&rdquo;
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 5 — INSTALLED WORK: Screen-Fitting Bento Grid of Real Sites   */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section className="w-full bg-stone-50/70 dark:bg-[#070D18] pt-12 pb-14 sm:pt-14 sm:pb-18 text-stone-900 dark:text-white transition-colors border-t border-stone-200 dark:border-white/10">
        <div className="w-full px-4 sm:px-8 lg:px-20 mb-6 sm:mb-8">
          <p
            className="text-xs sm:text-sm font-bold uppercase tracking-[0.25em] mb-2 transition-colors"
            style={{ color: accentColor }}
          >
            INSTALLED WORK
          </p>
          <h2
            className="text-2xl sm:text-4xl lg:text-[40px] font-bold text-stone-900 dark:text-white tracking-tight leading-tight"
          >
            Already on walls across India.
          </h2>
        </div>

        {/* Full-Bleed Bento Grid with 2-Column Mobile Bento & 4-Column Desktop Layout */}
        <div className="w-full px-4 sm:px-8 lg:px-20">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5 w-full">
            {INSTALLED_BENTO_ITEMS.map((item) => (
              <div
                key={item.title}
                onClick={() => setPreviewInstalledItem(item)}
                className={`group relative overflow-hidden rounded-2xl border border-stone-200 dark:border-white/10 bg-stone-200 dark:bg-stone-900 shadow-sm hover:shadow-lg cursor-pointer active:scale-[0.98] transition-all duration-300 ${item.gridClass}`}
              >
                {/* Background Image with Hover Zoom */}
                <div className="absolute inset-0 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={`${item.title} — ${item.subtitle}`}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </div>

                {/* Subtle vignette for crisp text legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                {/* Floating Info Pill Badge — Compact, high-contrast dark glass pill on bottom-left */}
                <div className="absolute bottom-2.5 left-2.5 max-w-[calc(100%-20px)] z-10 rounded-xl bg-stone-950/80 border border-white/15 px-3 py-1.5 sm:px-3.5 sm:py-2 backdrop-blur-md shadow-lg transition-transform duration-300">
                  <p className="text-[11px] sm:text-sm font-bold text-white tracking-tight truncate">
                    {item.title}
                  </p>
                  <p className="text-[9px] sm:text-xs text-stone-300 font-medium truncate mt-0.5">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gallery Link */}
        <div className="mt-5 sm:mt-6 px-4 sm:px-8 lg:px-20 text-xs sm:text-sm">
          <a
            href="/wall-panels-gallery"
            className="transition-colors hover:underline font-semibold"
            style={{ color: accentColor }}
          >
            Browse all finished site installations across India →
          </a>
        </div>

        {/* Interactive Site Image Lightbox on Tap (Works seamlessly on mobile & desktop) */}
        {previewInstalledItem && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fade-in"
            onClick={() => setPreviewInstalledItem(null)}
          >
            <div
              className="relative max-w-4xl w-full rounded-2xl overflow-hidden bg-white dark:bg-stone-900 border border-stone-200 dark:border-white/20 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setPreviewInstalledItem(null)}
                className="absolute top-3 right-3 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center text-sm font-bold transition-all border border-white/20 cursor-pointer"
                aria-label="Close Preview"
              >
                ✕
              </button>
              <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full bg-stone-950">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewInstalledItem.image}
                  alt={`${previewInstalledItem.title} — ${previewInstalledItem.subtitle}`}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="p-4 sm:p-5 bg-stone-50 dark:bg-[#070D18] flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-stone-200 dark:border-white/10">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-stone-900 dark:text-white">
                    {previewInstalledItem.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 mt-0.5">
                    {previewInstalledItem.subtitle}
                  </p>
                </div>
                <a
                  href="/wall-panels-gallery"
                  className="text-xs sm:text-sm font-semibold hover:underline shrink-0"
                  style={{ color: accentColor }}
                >
                  View full site gallery →
                </a>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 6 — PROOF OF WORK & DIRECT MILL TRUST: Authentic Real Sites   */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section
        id="proof-of-work"
        className="w-full bg-white dark:bg-[#070D18] text-stone-900 dark:text-white pt-12 pb-16 sm:pt-14 sm:pb-20 border-t border-stone-200 dark:border-white/10 transition-colors"
        onPointerEnter={() => setIsHoveringProofGallery(true)}
        onPointerLeave={() => setIsHoveringProofGallery(false)}
      >
        {/* Gallery Header */}
        <div className="w-full px-4 sm:px-8 lg:px-20 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p
                className="text-xs font-bold tracking-[0.2em] uppercase mb-2 transition-colors"
                style={{ color: accentColor }}
              >
                VERIFIED SITE INSTALLATIONS &amp; CLIENT EXPERIENCE
              </p>
              <h2
                className="text-2xl sm:text-4xl lg:text-[40px] font-bold text-stone-900 dark:text-white tracking-tight leading-tight"
              >
                Proof of Work &amp; Direct Mill Trust
              </h2>
              <p className="mt-2 max-w-2xl text-sm sm:text-base text-stone-600 dark:text-stone-300 leading-relaxed font-normal">
                Real photos, verified square footage, and honest reviews from contractors, architects, and site owners across India.
              </p>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              {/* Google Verified 5.0 Rating Badge */}
              <div className="flex items-center gap-2 bg-stone-50 dark:bg-[#0B1322] border border-stone-200 dark:border-white/15 px-3.5 sm:px-4 py-2 rounded-full shadow-sm">
                <GoogleLogo className="w-4 h-4 flex-shrink-0" />
                <div className="flex items-center gap-1.5 text-xs font-semibold">
                  <span className="text-stone-900 dark:text-white font-bold">Google</span>
                  <span style={{ color: accentColor }}>★★★★★</span>
                  <span className="text-stone-600 dark:text-stone-300 font-bold">5.0</span>
                </div>
              </div>

              {/* Write Review Action (Static button with no link until GMB profile is ready) */}
              <button
                type="button"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-white px-4 py-2 rounded-full transition-all duration-200 shadow-md hover:brightness-110 cursor-pointer"
                style={{ backgroundColor: accentColor }}
              >
                <span>+</span> Write Review
              </button>
            </div>
          </div>
        </div>

        {/* Split Showcase Card (Desktop: 2 Columns, Mobile: Photo on top, Review below) */}
        <div className="w-full px-4 sm:px-8 lg:px-20">
          {(() => {
            const activeItem = PROOF_OF_WORK_REVIEWS[activeProofIndex] || PROOF_OF_WORK_REVIEWS[0];
            return (
              <div className="bg-stone-50/80 dark:bg-[#0b1424] border border-stone-200 dark:border-white/15 hover:border-stone-300 dark:hover:border-white/25 rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl backdrop-blur-xl flex flex-col-reverse lg:flex-row overflow-hidden transition-all duration-300 min-h-[380px] sm:min-h-[460px]">
                {/* Left Column: Review Details & Controls */}
                <div className="w-full lg:w-5/12 p-5 sm:p-7 lg:p-8 flex flex-col justify-between order-2 lg:order-1 border-t lg:border-t-0 lg:border-r border-stone-200 dark:border-white/10 bg-white dark:bg-[#070D18]/95">
                  <div className="space-y-3.5 sm:space-y-4">
                    {/* Stars & Verified Contractor Site Badge */}
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-1 text-sm sm:text-base" style={{ color: accentColor }}>
                        {'★'.repeat(activeItem.rating)}
                      </div>
                      <span
                        className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full border bg-stone-100 dark:bg-white/5 shadow-sm"
                        style={{ borderColor: `${accentColor}55`, color: accentColor }}
                      >
                        <span>✓</span> Verified Contractor Site
                      </span>
                    </div>

                    {/* Client Quote with Clean Modern Sans Typography */}
                    <div key={`review-quote-${activeProofIndex}`} className="animate-fade-in pt-1">
                      <p className="text-sm sm:text-[15px] lg:text-base text-stone-800 dark:text-stone-100 font-normal leading-relaxed tracking-normal">
                        &ldquo;{activeItem.quote}&rdquo;
                      </p>
                    </div>
                  </div>

                  {/* Reviewer Details & Navigation Controls */}
                  <div className="pt-5 sm:pt-6 mt-5 sm:mt-6 border-t border-stone-200 dark:border-white/10 space-y-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full bg-gradient-to-br ${activeItem.avatarColor} flex items-center justify-center text-xs font-bold text-white shadow-md flex-shrink-0`}
                      >
                        {activeItem.initials}
                      </div>
                      <div>
                        <h4 className="font-bold text-stone-900 dark:text-white text-sm sm:text-base leading-tight">
                          {activeItem.name}
                        </h4>
                        <p className="text-xs text-stone-600 dark:text-stone-300 mt-0.5 font-medium">
                          {activeItem.role} • {activeItem.firm}
                        </p>
                        <p className="text-[11px] text-stone-400 dark:text-stone-400 mt-0.5">
                          {activeItem.location} • {activeItem.date}
                        </p>
                      </div>
                    </div>

                    {/* Controls: Dots & Prev / Next */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold" style={{ color: accentColor }}>
                          {String(activeProofIndex + 1).padStart(2, '0')} / {String(PROOF_OF_WORK_REVIEWS.length).padStart(2, '0')}
                        </span>
                        <div className="flex items-center gap-1.5 ml-2">
                          {PROOF_OF_WORK_REVIEWS.map((_, idx) => (
                            <button
                              key={`nav-dot-${idx}`}
                              type="button"
                              onClick={() => setActiveProofIndex(idx)}
                              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                                activeProofIndex === idx
                                  ? 'w-6 shadow-[0_0_8px_currentColor]'
                                  : 'w-1.5 bg-stone-300 dark:bg-stone-700 hover:bg-stone-400 dark:hover:bg-stone-500'
                              }`}
                              style={activeProofIndex === idx ? { backgroundColor: accentColor, color: accentColor } : {}}
                              title={`View site ${idx + 1}`}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setActiveProofIndex((prev) => (prev === 0 ? PROOF_OF_WORK_REVIEWS.length - 1 : prev - 1))}
                          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 flex items-center justify-center cursor-pointer transition-all duration-200 border border-stone-200 dark:border-white/10"
                          title="Previous Site"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveProofIndex((prev) => (prev + 1) % PROOF_OF_WORK_REVIEWS.length)}
                          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 flex items-center justify-center cursor-pointer transition-all duration-200 border border-stone-200 dark:border-white/10"
                          title="Next Site"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: High-Res Site Photo + Badges */}
                <div className="w-full lg:w-7/12 relative bg-stone-900 group flex flex-col justify-end min-h-[260px] sm:min-h-[380px] lg:min-h-[460px] order-1 lg:order-2 overflow-hidden">
                  <div key={`photo-${activeProofIndex}`} className="absolute inset-0 w-full h-full animate-fade-in">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={activeItem.sitePhoto}
                      alt={activeItem.siteTitle}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/30 to-transparent" />
                    <div className="hidden lg:block absolute inset-0 bg-gradient-to-r from-stone-950/40 via-transparent to-transparent" />
                  </div>

                  {/* Top Left Proof Badge */}
                  <div className="absolute top-3.5 left-3.5 sm:top-4 sm:left-4 z-10 flex items-center gap-2 bg-stone-950/80 backdrop-blur-md border border-white/15 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full shadow-lg">
                    <span
                      className="w-2 h-2 rounded-full animate-pulse"
                      style={{ backgroundColor: accentColor }}
                    />
                    <span className="text-[11px] sm:text-xs font-bold text-white tracking-wide">
                      Proof of Work: Installed Site
                    </span>
                  </div>

                  {/* Bottom Metadata Overlay */}
                  <div className="relative z-10 p-4 sm:p-7 flex flex-col sm:flex-row sm:items-end justify-between gap-2 sm:gap-3">
                    <div>
                      <span
                        className="text-[10px] sm:text-xs font-bold uppercase tracking-wider block mb-1"
                        style={{ color: accentColor }}
                      >
                        {activeItem.material}
                      </span>
                      <h3 className="text-base sm:text-xl lg:text-2xl font-bold text-white leading-tight">
                        {activeItem.siteTitle}
                      </h3>
                      <p className="text-[11px] sm:text-sm text-stone-200 mt-0.5 sm:mt-1">
                        {activeItem.location} • {activeItem.siteStats}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </section>
    </div>
  );
}
