'use client';

import React, { useRef, useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

interface KineticExperienceProps {
  heroImage?: string;
  teamImage?: string;
}

// 5 Bespoke, Hardware-Accelerated Animated SVG Logos
function MillIcon() {
  return (
    <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-stone-900 border border-amber-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.15)] flex-shrink-0 group-hover:border-amber-400 group-hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all overflow-hidden">
      <svg viewBox="0 0 36 36" fill="none" className="w-6 h-6 text-amber-400">
        {/* Factory building outline */}
        <path d="M4 28V15L11 19V15L18 19V11L28 17V28H4Z" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
        {/* Chimney active smoke / forge sparks */}
        <circle cx="28" cy="7" r="1.5" fill="#fbbf24" className="[animation:sparkTwinklePulse_1.8s_ease-in-out_infinite]" />
        <circle cx="25" cy="4" r="1" fill="#f59e0b" className="[animation:sparkTwinklePulse_2.2s_ease-in-out_infinite_0.4s]" />
        {/* Primary Rotating Gear (Clockwise) */}
        <g className="origin-[13px_23px] [animation:spinClockwise_5s_linear_infinite]">
          <circle cx="13" cy="23" r="3.2" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="2 2" />
          <path d="M13 18.5v2M13 25.5v2M8.5 23h2M15.5 23h2" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" />
        </g>
        {/* Secondary Interlocking Gear (Counter-Clockwise) */}
        <g className="origin-[21px_23px] [animation:spinCounterClockwise_5s_linear_infinite]">
          <circle cx="21" cy="23" r="2.5" stroke="#f59e0b" strokeWidth="1.3" strokeDasharray="2 2" />
          <path d="M21 19.5v1.5M21 25v1.5M17.5 23h1.5M23 23h1.5" stroke="#f59e0b" strokeWidth="1.3" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
}

function DispatchIcon() {
  return (
    <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-stone-900 border border-amber-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.15)] flex-shrink-0 group-hover:border-amber-400 group-hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all overflow-hidden">
      <svg viewBox="0 0 36 36" fill="none" className="w-6 h-6 text-amber-400">
        {/* Speed Streaks behind truck */}
        <line x1="3" y1="12" x2="9" y2="12" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" className="[animation:speedDashMove_1.2s_linear_infinite]" strokeDasharray="6 6" />
        <line x1="1" y1="17" x2="10" y2="17" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" className="[animation:speedDashMove_0.9s_linear_infinite]" strokeDasharray="8 6" />
        <line x1="4" y1="22" x2="11" y2="22" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" className="[animation:speedDashMove_1.4s_linear_infinite]" strokeDasharray="6 6" />
        {/* Delivery Truck Body */}
        <g className="[animation:truckVibe_0.6s_ease-in-out_infinite]">
          <path d="M12 10H24V24H12V10Z" stroke="currentColor" strokeWidth="1.75" />
          <path d="M24 14H29L32 18V24H24V14Z" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
          <rect x="14" y="13" width="7" height="4" rx="0.5" fill="#f59e0b" fillOpacity="0.25" />
          {/* Front spinning wheel */}
          <g className="origin-[27px_25px] [animation:spinClockwise_1.5s_linear_infinite]">
            <circle cx="27" cy="25" r="3" stroke="#fbbf24" strokeWidth="1.75" />
            <line x1="27" y1="22" x2="27" y2="28" stroke="#fbbf24" strokeWidth="1" />
            <line x1="24" y1="25" x2="30" y2="25" stroke="#fbbf24" strokeWidth="1" />
          </g>
          {/* Rear spinning wheel */}
          <g className="origin-[16px_25px] [animation:spinClockwise_1.5s_linear_infinite]">
            <circle cx="16" cy="25" r="3" stroke="#fbbf24" strokeWidth="1.75" />
            <line x1="16" y1="22" x2="16" y2="28" stroke="#fbbf24" strokeWidth="1" />
            <line x1="13" y1="25" x2="19" y2="25" stroke="#fbbf24" strokeWidth="1" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function VarietyIcon() {
  return (
    <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-stone-900 border border-amber-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.15)] flex-shrink-0 group-hover:border-amber-400 group-hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all overflow-hidden">
      <svg viewBox="0 0 36 36" fill="none" className="w-6 h-6 text-amber-400">
        {/* Wall Louvers 3-Flute Profile */}
        <rect x="5" y="7" width="6" height="22" rx="1.5" stroke="currentColor" strokeWidth="1.5" className="opacity-50" />
        <rect x="15" y="5" width="6" height="26" rx="1.5" stroke="#fbbf24" strokeWidth="1.75" fill="#1c1917" />
        <rect x="25" y="7" width="6" height="22" rx="1.5" stroke="currentColor" strokeWidth="1.5" className="opacity-50" />
        <line x1="18" y1="8" x2="18" y2="28" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" />
        {/* Moving light reflection bar that sweeps across flutes */}
        <g className="[animation:shimmerSlideAcross_2.5s_ease-in-out_infinite]">
          <line x1="0" y1="4" x2="6" y2="32" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" className="opacity-75 blur-[0.5px]" />
        </g>
      </svg>
    </div>
  );
}

function QualityIcon() {
  return (
    <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-stone-900 border border-amber-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.15)] flex-shrink-0 group-hover:border-amber-400 group-hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all overflow-hidden">
      <svg viewBox="0 0 36 36" fill="none" className="w-6 h-6 text-amber-400">
        {/* Protective Shield */}
        <path d="M18 4L7 8.5V17C7 24.5 11.8 30.5 18 32C24.2 30.5 29 24.5 29 17V8.5L18 4Z" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
        {/* Verified Gold Checkmark */}
        <path d="M12.5 18L16.5 22L23.5 14" stroke="#fbbf24" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        {/* Laser Scanner Line moving up and down */}
        <g className="[animation:laserScanVertical_2s_ease-in-out_infinite]">
          <line x1="9" y1="12" x2="27" y2="12" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" className="shadow-[0_0_8px_#f59e0b]" />
          <circle cx="18" cy="12" r="2" fill="#ffffff" />
        </g>
        {/* Twinkling star */}
        <circle cx="28" cy="6" r="1.5" fill="#fbbf24" className="[animation:sparkTwinklePulse_1.5s_ease-in-out_infinite]" />
      </svg>
    </div>
  );
}

function ProjectsIcon() {
  return (
    <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-stone-900 border border-amber-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.15)] flex-shrink-0 group-hover:border-amber-400 group-hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all overflow-hidden">
      <svg viewBox="0 0 36 36" fill="none" className="w-6 h-6 text-amber-400">
        {/* Architectural Towers Silhouette */}
        <path d="M6 29V17H13V29H6Z" stroke="currentColor" strokeWidth="1.5" />
        <path d="M13 29V9H23V29H13Z" stroke="#fbbf24" strokeWidth="1.75" fill="#1c1917" />
        <path d="M23 29V15H30V29H23Z" stroke="currentColor" strokeWidth="1.5" />
        {/* Spire on Central Tower */}
        <line x1="18" y1="9" x2="18" y2="4" stroke="#fbbf24" strokeWidth="1.75" strokeLinecap="round" />
        {/* Central Beacon Spotlight rotating 360deg */}
        <g className="origin-[18px_4px] [animation:beaconRadarSweep_3s_linear_infinite]">
          <line x1="18" y1="4" x2="29" y2="0" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" className="opacity-75" />
        </g>
        {/* Sparkle Milestone Stars */}
        <circle cx="8" cy="9" r="1.2" fill="#fbbf24" className="[animation:sparkTwinklePulse_2s_ease-in-out_infinite]" />
      </svg>
    </div>
  );
}

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

const WHY_POINTS = [
  {
    icon: <MillIcon />,
    title: 'Gurgaon Mill Manufacturing',
    tag: 'Factory Direct',
    desc: 'Own manufacturing mill in Gurgaon. Pure factory-direct rates with zero middlemen margin.',
  },
  {
    icon: <DispatchIcon />,
    title: 'Pan-India Project Logistics',
    tag: 'Fast Delivery',
    desc: 'Express dispatch across Delhi-NCR & reliable direct transport delivery to all states.',
  },
  {
    icon: <VarietyIcon />,
    title: '200+ Architectural Textures',
    tag: 'Direct Stock',
    desc: 'Seamless PVC louvers, fluted WPC louvers & UV Italian marble sheets ready in stock.',
  },
  {
    icon: <QualityIcon />,
    title: '100% Quality Inspected',
    tag: 'Zero Defect',
    desc: 'Laser-straight tongue & groove interlock. Certified moisture-proof & termite-free.',
  },
];

// 5 Real Panel Products for Peacock Fan-Out & In-Situ Showcase
const FAN_PANELS = [
  {
    id: 'gf-402',
    code: 'GF-402',
    name: 'Elite PVC GF-402 Ivory Classic',
    badge: '12-Inch Seamless Ivory',
    thickness: '5mm Seamless Profile',
    dimensions: '2950 × 300 mm',
    textureUrl: '/assets/panels/gf-402.jpg',
    roomUrl: '/assets/panels/tour_living_charcoal.jpg',
    roomTitle: 'Minimalist Penthouse Living Wall',
    wholesaleRate: '₹42 - ₹58 / sqft',
    description: '12-inch wide seamless PVC panel. Sealed polymer core provides total immunity against peeling wall moisture.',
  },
  {
    id: 'gf-403',
    code: 'GF-403',
    name: 'Elite PVC GF-403 Silver Metallic',
    badge: '12-Inch Brushed Silver Luster',
    thickness: '5mm Seamless Profile',
    dimensions: '2950 × 300 mm',
    textureUrl: '/assets/panels/gf-403.jpg',
    roomUrl: '/assets/panels/tour_kitchen_marble.jpg',
    roomTitle: 'Executive Suite Reception Cladding',
    wholesaleRate: '₹45 - ₹62 / sqft',
    description: 'Reflective architectural sheen ideal for modern executive bedrooms, reception feature walls, and commercial lobbies.',
  },
  {
    id: 'gf-404',
    code: 'GF-404',
    name: 'Elite PVC GF-404 Gold Botanical Filigree',
    badge: '12-Inch Designer Gold Floral',
    thickness: '5mm Seamless Profile',
    dimensions: '2950 × 300 mm',
    textureUrl: '/assets/panels/gf-404.jpg',
    roomUrl: '/assets/home-image.jpg',
    roomTitle: 'Luxury Villa Accent Feature Wall',
    wholesaleRate: '₹48 - ₹68 / sqft',
    description: 'Intricate warm gold floral relief on a cream marble background, engineered for dramatic vertical illumination.',
  },
  {
    id: 'gf-405',
    code: 'GF-405',
    name: 'Elite PVC GF-405 Statuario Marble',
    badge: '12-Inch Italian Statuario Look',
    thickness: '5mm Seamless Profile',
    dimensions: '2950 × 300 mm',
    textureUrl: '/assets/panels/gf-405.jpg',
    roomUrl: '/assets/panels/oak_wall_panels_1787974809215.jpg',
    roomTitle: 'Modern Dining & Master Bed Cladding',
    wholesaleRate: '₹46 - ₹65 / sqft',
    description: 'High-definition grey Italian marble veins across an unbroken 300mm seamless breadth for hotel-grade luxury.',
  },
  {
    id: 'gf-407',
    code: 'GF-407',
    name: 'Elite PVC GF-407 Golden Onyx',
    badge: '12-Inch Golden Onyx Vein',
    thickness: '5mm Seamless Profile',
    dimensions: '2950 × 300 mm',
    textureUrl: '/assets/panels/gf-407.jpg',
    roomUrl: '/assets/panels/tour_exterior_wpc.jpg',
    roomTitle: 'Architectural Hospitality Corridor',
    wholesaleRate: '₹52 - ₹72 / sqft',
    description: 'Golden Onyx translucent stone style. Rich amber veining creates an opulent luxury atmosphere with zero stone weight.',
  },
];

// Rich texture library for 4 concentric rings
const RING_TEXTURES = [
  '/assets/panels/gf-402.jpg',
  '/assets/panels/gf-403.jpg',
  '/assets/panels/gf-404.jpg',
  '/assets/panels/gf-405.jpg',
  '/assets/panels/gf-406.jpg',
  '/assets/panels/gf-407.jpg',
  '/assets/panels/gf-408.jpg',
  '/assets/panels/wpc_louver_texture.jpg',
  '/assets/panels/pvc_marble_sheet.jpg',
  '/assets/panels/charcoal_fluted_office_insitu.jpg',
  '/assets/panels/marble_surface_flat_1787974989087.jpg',
  '/assets/panels/oak_wall_panels_1787974809215.jpg',
];

// Verified Proof of Work & Authentic Client Reviews
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
    sitePhoto: '/assets/panels/tour_living_charcoal.jpg',
    siteTitle: 'Luxury Penthouse Living Room TV Wall',
    siteStats: '450 sq.ft • 2-Hour Factory Dispatch',
    quote: 'Delivered 12-inch PVC panels within 2 hours directly to our Sector 54 site. Zero middlemen, pure factory pricing saved us a lot on contractor margins.',
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
    sitePhoto: '/assets/panels/tour_kitchen_marble.jpg',
    siteTitle: 'High-Gloss Feature Wall & Console',
    siteStats: '620 sq.ft • Zero Visible Joints',
    quote: 'Installed charcoal louvers in our TV feature wall. No visible joints and looks super premium. Very easy to clean.',
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
    sitePhoto: '/assets/panels/charcoal_fluted_office_insitu.jpg',
    siteTitle: 'Basement Seepage Proofing Solution',
    siteStats: '1,200 sq.ft • 100% Water Resistant',
    quote: 'Had major seepage problem on basement walls for 2 years. These waterproof PVC panels completely solved it. Dry and flawless.',
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
    sitePhoto: '/assets/panels/oak_wall_panels_1787974809215.jpg',
    siteTitle: 'Hospitality Suite Architectural Bedhead',
    siteStats: '850 sq.ft • Laser Precision Tongue & Groove',
    quote: 'Tongue & groove interlock is 100% laser straight. Carpenters completed 850 sqft cladding in less than 2 days.',
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
    sitePhoto: '/assets/panels/tour_exterior_wpc.jpg',
    siteTitle: 'Villa Exterior & Accent Passage Corridor',
    siteStats: '780 sq.ft • 1:1 Sample Texture Match',
    quote: 'Requested sample box first and it arrived next morning. Golden Onyx sheet texture matched our 3D render perfectly.',
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
    sitePhoto: '/assets/panels/tour_kids_acoustic.jpg',
    siteTitle: 'Commercial Studio Sound-Absorbing Wall',
    siteStats: '1,500 sq.ft • ₹1.4 Lakh Factory Savings',
    quote: 'Local dealers were quoting ₹95/sqft. Wholesaleji gave pure direct mill rate at ₹48/sqft. Saved more than ₹1.4 Lakh on bulk order.',
  },
];




export default function KineticExperience({
  heroImage = '/assets/home-image.jpg',
  teamImage = '/assets/Goals_Floors_Wall_Panels.webp',
}: KineticExperienceProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pinSectionRef = useRef<HTMLDivElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);

  // Stage 1 Refs (10 Slats Doorway)
  const stage1Ref = useRef<HTMLDivElement | null>(null);
  const slatRefs = useRef<(HTMLDivElement | null)[]>([]);
  const heroTextRef = useRef<HTMLDivElement | null>(null);

  // Stage 2 Refs (What is Wall Panel Showcase)
  const stage2Ref = useRef<HTMLDivElement | null>(null);
  const stage2ContentRef = useRef<HTMLDivElement | null>(null);

  // Stage 3 Refs (4 Concentric Orbit Rings)
  const stage3Ref = useRef<HTMLDivElement | null>(null);
  const ring1Ref = useRef<HTMLDivElement | null>(null);
  const ring2Ref = useRef<HTMLDivElement | null>(null);
  const ring3Ref = useRef<HTMLDivElement | null>(null);
  const ring4Ref = useRef<HTMLDivElement | null>(null);
  const ringsContainerRef = useRef<HTMLDivElement | null>(null);
  const stage3TextRef = useRef<HTMLDivElement | null>(null);

  // Stage 4 & 5 Refs (Peacock Fan-Out, In-Situ Showcase & Shuffle)
  const stage45Ref = useRef<HTMLDivElement | null>(null);
  const fanDeckMasterRef = useRef<HTMLDivElement | null>(null);
  const fanPanelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const uplightRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rocketFlameRef = useRef<HTMLDivElement | null>(null);
  const stage5RightRef = useRef<HTMLDivElement | null>(null);
  const roomSlideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const roomInfoRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Stage 7 Refs: Why Choose Us (Unified directly behind rocket blast-off)
  const stageWhyRef = useRef<HTMLDivElement | null>(null);
  const whyTitleWordsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const whyRopeBoardRef = useRef<HTMLDivElement | null>(null);
  const hangingSignRef = useRef<HTMLDivElement | null>(null);
  const whyPointsRef = useRef<(HTMLDivElement | null)[]>([]);
  const whyPhotoRef = useRef<HTMLDivElement | null>(null);

  // Stage 8 Refs: Cinematic Proof-of-Work & Verified Client Feedback Gallery
  const stageProofFeedbackRef = useRef<HTMLDivElement | null>(null);

  // Active Project & Review State
  const [clientReviews, setClientReviews] = useState<ProofOfWorkItem[]>(PROOF_OF_WORK_REVIEWS);
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const [isHoveringGallery, setIsHoveringGallery] = useState(false);

  // Auto-cycle through Proof of Work & Reviews when idle
  useEffect(() => {
    if (isHoveringGallery || clientReviews.length === 0) return;
    const interval = setInterval(() => {
      setActiveProjectIndex((prev) => (prev + 1) % clientReviews.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isHoveringGallery, clientReviews.length]);

  // Interactive Reviews State & Smart 1-Click GMB Funnel
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackHoverRating, setFeedbackHoverRating] = useState(0);
  const [feedbackName, setFeedbackName] = useState('');
  const [feedbackRole, setFeedbackRole] = useState('Architect');
  const [feedbackFirm, setFeedbackFirm] = useState('');
  const [feedbackLocation, setFeedbackLocation] = useState('');
  const [feedbackComment, setFeedbackComment] = useState('');
  const [feedbackMaterial, setFeedbackMaterial] = useState('PVC Fluted Louver Panels');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackName.trim() || !feedbackComment.trim()) return;

    const newRev: ProofOfWorkItem = {
      id: `pow-${Date.now()}`,
      name: feedbackName,
      role: feedbackRole,
      firm: feedbackFirm || 'Verified Client Studio',
      location: feedbackLocation || 'India',
      avatarColor: 'from-amber-600 to-amber-800',
      initials:
        feedbackName
          .split(' ')
          .map((n) => n[0])
          .join('')
          .slice(0, 2)
          .toUpperCase() || 'VP',
      rating: feedbackRating,
      date: 'Just now',
      material: feedbackMaterial,
      sitePhoto: '/assets/panels/tour_living_charcoal.jpg',
      siteTitle: 'Verified Client Installation',
      siteStats: 'Newly Verified Site',
      quote: feedbackComment,
    };

    setClientReviews((prev) => [newRev, ...prev]);
    setActiveProjectIndex(0);
    setFeedbackSubmitted(true);
  };

  const handlePostToGoogle = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(feedbackComment);
      setCopiedToClipboard(true);
    }
    const gmbReviewUrl = 'https://search.google.com/local/writereview?placeid=ChIJr89-5vP2DDkRxvO4kFm_VlM';
    window.open(gmbReviewUrl, '_blank', 'noopener,noreferrer');
  };


  // High-performance physics state for Hanging "WHY NOT?!" Board
  const boardPhysics = useRef({
    x: 0,
    y: 0,
    rot: 0,
    rotVel: 0,
    cursorAngleTarget: 0,
    cursorAngleCurrent: 0,
    isDragging: false,
    dragStartX: 0,
    dragStartY: 0,
    lastPointerX: 0,
    lastPointerTime: 0,
    dragVelX: 0,
  });

  // Track cursor across Stage 7 to induce dynamic wind sway
  const handleStagePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const bp = boardPhysics.current;
    if (bp.isDragging) {
      const now = Date.now();
      const dt = Math.max(1, now - bp.lastPointerTime);
      const dx = e.clientX - bp.lastPointerX;
      bp.dragVelX = (dx / dt) * 16;
      bp.lastPointerX = e.clientX;
      bp.lastPointerTime = now;

      bp.x = e.clientX - bp.dragStartX;
      bp.y = Math.max(-80, Math.min(180, e.clientY - bp.dragStartY));
      bp.rot = Math.max(-32, Math.min(32, bp.x * 0.12));
      return;
    }

    if (hangingSignRef.current) {
      const rect = hangingSignRef.current.getBoundingClientRect();
      const boardCenterX = rect.left + rect.width / 2;
      const dist = e.clientX - boardCenterX;
      // Proximity magnetic tilt within 600px of board
      if (Math.abs(dist) < 600) {
        const factor = dist / 400; // -1.5 to +1.5
        bp.cursorAngleTarget = Math.max(-8, Math.min(8, factor * 7));
      }
      // Speed of cursor movement imparts wind impulse
      if (e.movementX) {
        bp.rotVel += Math.max(-2.5, Math.min(2.5, e.movementX * 0.06));
      }
    }
  };

  const handleBoardPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const bp = boardPhysics.current;
    bp.isDragging = true;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    bp.dragStartX = e.clientX - bp.x;
    bp.dragStartY = e.clientY - bp.y;
    bp.lastPointerX = e.clientX;
    bp.lastPointerTime = Date.now();
    bp.dragVelX = 0;
  };

  const handleBoardPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const bp = boardPhysics.current;
    if (!bp.isDragging) return;
    bp.isDragging = false;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}

    // Fling impulse launches damped harmonic oscillation
    bp.rotVel = Math.max(-25, Math.min(25, bp.dragVelX * 0.6));
  };


  const [isClient, setIsClient] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const checkMobile = () => {
      setIsMobile(window.matchMedia('(max-width: 768px)').matches);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const ring1Items = useMemo(() => {
    const count = 8;
    return Array.from({ length: count }, (_, i) => ({
      id: `r1-${i}`,
      angle: (i / count) * 2 * Math.PI,
      img: RING_TEXTURES[i % RING_TEXTURES.length],
    }));
  }, []);

  const ring2Items = useMemo(() => {
    const count = 12;
    return Array.from({ length: count }, (_, i) => ({
      id: `r2-${i}`,
      angle: (i / count) * 2 * Math.PI,
      img: RING_TEXTURES[(i + 2) % RING_TEXTURES.length],
    }));
  }, []);

  const ring3Items = useMemo(() => {
    const count = 16;
    return Array.from({ length: count }, (_, i) => ({
      id: `r3-${i}`,
      angle: (i / count) * 2 * Math.PI,
      img: RING_TEXTURES[(i + 4) % RING_TEXTURES.length],
    }));
  }, []);

  const ring4Items = useMemo(() => {
    const count = 22;
    return Array.from({ length: count }, (_, i) => ({
      id: `r4-${i}`,
      angle: (i / count) * 2 * Math.PI,
      img: RING_TEXTURES[(i + 6) % RING_TEXTURES.length],
    }));
  }, []);

  useEffect(() => {
    if (!isClient) return;

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 0.9,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.7,
      touchMultiplier: 1.2,
    });

    lenis.on('scroll', ScrollTrigger.update);

    let isHangingSignVisible = true;
    const signObserver = new IntersectionObserver((entries) => {
      isHangingSignVisible = entries[0].isIntersecting;
    }, { rootMargin: '300px' });
    if (hangingSignRef.current) signObserver.observe(hangingSignRef.current);

    const tickerCb = (time: number) => {
      lenis.raf(time * 1000);

      // Continuous Physics & Sway Loop for Hanging Sign
      if (hangingSignRef.current && isHangingSignVisible) {
        const bp = boardPhysics.current;
        if (bp.isDragging) {
          hangingSignRef.current.style.transform = `translate3d(${bp.x}px, ${bp.y}px, 0) rotate(${bp.rot}deg)`;
        } else {
          // 1. Natural idle breeze pendulum oscillation (harmonic sine centered at 0deg)
          const ambient = Math.sin(time * 1.6) * 2.8;

          // 2. Cursor breeze spring
          bp.cursorAngleCurrent += (bp.cursorAngleTarget - bp.cursorAngleCurrent) * 0.08;
          bp.cursorAngleTarget *= 0.985;

          // 3. Harmonic spring damper for drag release & impulse
          bp.rotVel += -bp.rot * 0.08;
          bp.rotVel *= 0.92;
          bp.rot += bp.rotVel;
          bp.x += (0 - bp.x) * 0.1;
          bp.y += (0 - bp.y) * 0.1;

          const totalRot = bp.rot + ambient + bp.cursorAngleCurrent;
          hangingSignRef.current.style.transform = `translate3d(${bp.x}px, ${bp.y}px, 0) rotate(${totalRot}deg)`;
        }
      }
    };
    gsap.ticker.add(tickerCb);
    gsap.ticker.lagSmoothing(0);

    const ctx = gsap.context(() => {
      const isMobile = window.matchMedia('(max-width: 768px)').matches;

      // Master Timeline pinned across scroll distance (compact on mobile, cinematic on desktop)
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinSectionRef.current,
          start: 'top top',
          end: isMobile ? '+=360%' : '+=1750%',
          pin: true,
          scrub: isMobile ? 0.25 : 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (progressBarRef.current) {
              progressBarRef.current.style.width = `${Math.round(self.progress * 100)}%`;
            }
          },
        },
      });

      // ─────────────────────────────────────────────────────────────
      // STAGE 1: Hero Text Fade & 10-Panel Slat Doorway Split (0.00 -> 0.05)
      // ─────────────────────────────────────────────────────────────
      tl.to(
        heroTextRef.current,
        {
          opacity: 0,
          y: -35,
          duration: 0.02,
          ease: 'power2.out',
        },
        0
      );

      slatRefs.current.forEach((slat, index) => {
        if (!slat) return;
        const moveUp = index % 2 === 0;
        tl.to(
          slat,
          {
            yPercent: moveUp ? -112 : 112,
            duration: 0.045,
            ease: 'power2.inOut',
            force3D: true,
          },
          0.005
        );
      });

      tl.to(
        stage1Ref.current,
        {
          opacity: 0,
          duration: 0.015,
          ease: 'power1.in',
        },
        0.045
      );

      // ─────────────────────────────────────────────────────────────
      // STAGE 2: "What is Wall Panel?" Showcase (0.00 -> 0.12)
      // ─────────────────────────────────────────────────────────────
      tl.fromTo(
        stage2Ref.current,
        { opacity: 1, scale: 0.95, filter: 'blur(0px)' },
        {
          opacity: 1,
          scale: 1.0,
          filter: 'blur(0px)',
          duration: 0.055,
          ease: 'power1.out',
        },
        0
      );

      tl.to(
        stage2Ref.current,
        {
          scale: isMobile ? 1.35 : 1.85,
          opacity: 0,
          filter: 'blur(16px)',
          duration: 0.045,
          ease: 'power2.in',
        },
        0.075
      );

      // ─────────────────────────────────────────────────────────────
      // STAGE 3: 4 Concentric Orbit Rings (0.12 -> 0.25)
      // ─────────────────────────────────────────────────────────────
      tl.fromTo(
        stage3Ref.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.02, ease: 'power2.out' },
        0.12
      );

      tl.fromTo(
        stage3TextRef.current,
        { opacity: 0, scale: 0.85, y: 25 },
        { opacity: 1, scale: 1.0, y: 0, duration: 0.03, ease: 'back.out(1.4)' },
        0.125
      );

      // Rings 1 to 4: Rotates ±240deg
      tl.fromTo(ring1Ref.current, { rotation: 0 }, { rotation: 240, duration: 0.11, ease: 'none' }, 0.125);
      tl.fromTo(ring2Ref.current, { rotation: 0 }, { rotation: -240, duration: 0.11, ease: 'none' }, 0.125);
      tl.fromTo(ring3Ref.current, { rotation: 0 }, { rotation: 240, duration: 0.11, ease: 'none' }, 0.125);
      tl.fromTo(ring4Ref.current, { rotation: 0 }, { rotation: -240, duration: 0.11, ease: 'none' }, 0.125);

      tl.to(stage3TextRef.current, { opacity: 0, scale: 1.25, y: -20, duration: 0.02, ease: 'power2.in' }, 0.215);

      tl.to(
        ringsContainerRef.current,
        { scale: isMobile ? 2.2 : 2.7, opacity: 0, filter: 'blur(10px)', duration: 0.03, ease: 'power2.in' },
        0.225
      );

      tl.to(stage3Ref.current, { opacity: 0, duration: 0.015 }, 0.245);

      // ─────────────────────────────────────────────────────────────
      // STAGE 4: Center Panel Emerges DEAD-CENTER & Peacock Fan-Out (0.25 -> 0.32)
      // ─────────────────────────────────────────────────────────────
      tl.fromTo(stage45Ref.current, { opacity: 0 }, { opacity: 1, duration: 0.02, ease: 'power2.out' }, 0.25);

      tl.fromTo(
        fanDeckMasterRef.current,
        { x: 0, y: 0, scale: 0.25, opacity: 0 },
        { x: 0, y: 0, scale: 1.0, opacity: 1, duration: 0.035, ease: 'back.out(1.3)' },
        0.255
      );

      const fanConfigs = isMobile
        ? [
            { x: -75, rotate: -20, scale: 0.9 },
            { x: -38, rotate: -10, scale: 0.95 },
            { x: 0, rotate: 0, scale: 1.02 },
            { x: 38, rotate: 10, scale: 0.95 },
            { x: 75, rotate: 20, scale: 0.9 },
          ]
        : [
            { x: -145, rotate: -22, scale: 0.92 },
            { x: -72, rotate: -11, scale: 0.96 },
            { x: 0, rotate: 0, scale: 1.04 },
            { x: 72, rotate: 11, scale: 0.96 },
            { x: 145, rotate: 22, scale: 0.92 },
          ];

      fanPanelRefs.current.forEach((panelEl, idx) => {
        if (!panelEl) return;
        tl.fromTo(
          panelEl,
          { x: 0, rotation: 0, transformOrigin: '50% 95%' },
          { x: fanConfigs[idx].x, rotation: fanConfigs[idx].rotate, scale: fanConfigs[idx].scale, duration: 0.035, ease: 'power3.out' },
          0.29
        );
      });

      uplightRefs.current.forEach((lightEl) => {
        if (!lightEl) return;
        tl.fromTo(
          lightEl,
          { opacity: 0, scaleY: 0.2, transformOrigin: '50% 100%' },
          { opacity: 0.7, scaleY: 1.0, duration: 0.03, ease: 'power2.out' },
          0.29
        );
      });

      // ─────────────────────────────────────────────────────────────
      // STAGE 5: Deck Slides Left & 5-Step Card Shuffle (0.32 -> 0.49)
      // ─────────────────────────────────────────────────────────────
      tl.to(
        fanDeckMasterRef.current,
        { x: isMobile ? 0 : '-23vw', y: isMobile ? '-20vh' : 0, scale: isMobile ? 0.65 : 0.88, duration: 0.025, ease: 'power2.inOut' },
        0.32
      );

      tl.fromTo(
        stage5RightRef.current,
        { opacity: 0, x: isMobile ? 0 : 50, y: isMobile ? 25 : 0 },
        { opacity: 1, x: 0, y: 0, duration: 0.025, ease: 'power2.out' },
        0.325
      );

      // 5-Card Shuffle: each step 0.029 duration
      FAN_PANELS.forEach((_, stepIdx) => {
        const stepStart = 0.345 + stepIdx * 0.029;

        fanPanelRefs.current.forEach((panelEl, pIdx) => {
          if (!panelEl) return;
          const isActive = pIdx === stepIdx;
          tl.to(
            panelEl,
            {
              y: isActive ? -36 : 0,
              scale: isActive ? (isMobile ? 1.08 : 1.15) : fanConfigs[pIdx].scale * 0.95,
              borderColor: isActive ? 'rgba(245, 158, 11, 1)' : 'rgba(255, 255, 255, 0.2)',
              boxShadow: isActive ? '0 0 45px rgba(245, 158, 11, 0.75), 0 25px 45px rgba(0,0,0,0.95)' : '0 10px 25px rgba(0,0,0,0.7)',
              zIndex: isActive ? 45 : 10 + pIdx,
              duration: 0.025,
              ease: 'power2.out',
            },
            stepStart
          );
        });

        uplightRefs.current.forEach((lightEl, lIdx) => {
          if (!lightEl) return;
          const isActive = lIdx === stepIdx;
          tl.to(lightEl, { opacity: isActive ? 1.0 : 0.2, scale: isActive ? 1.2 : 0.8, duration: 0.025, ease: 'power2.out' }, stepStart);
        });

        roomSlideRefs.current.forEach((slideEl, sIdx) => {
          if (!slideEl) return;
          tl.to(slideEl, { opacity: sIdx === stepIdx ? 1 : 0, scale: sIdx === stepIdx ? 1.0 : 1.03, duration: 0.025, ease: 'power2.inOut' }, stepStart);
        });

        roomInfoRefs.current.forEach((infoEl, iIdx) => {
          if (!infoEl) return;
          tl.to(infoEl, { opacity: iIdx === stepIdx ? 1 : 0, y: iIdx === stepIdx ? 0 : 12, duration: 0.025, ease: 'power2.out' }, stepStart);
        });
      });

      // ─────────────────────────────────────────────────────────────
      // STAGE 6: ROCKET LAUNCH (0.49 -> 0.54)
      // ─────────────────────────────────────────────────────────────
      tl.to(stage5RightRef.current, { x: isMobile ? 0 : '100vw', y: isMobile ? 35 : 0, opacity: 0, duration: 0.02, ease: 'power2.in' }, 0.49);

      fanPanelRefs.current.forEach((panelEl) => {
        if (!panelEl) return;
        tl.to(
          panelEl,
          { x: 0, rotation: 0, scale: 1.0, y: 0, borderColor: 'rgba(255, 255, 255, 0.3)', boxShadow: '0 15px 35px rgba(0,0,0,0.8)', duration: 0.02, ease: 'power2.inOut' },
          0.49
        );
      });

      tl.to(fanDeckMasterRef.current, { x: 0, y: 0, scale: 1.0, duration: 0.02, ease: 'power2.inOut' }, 0.49);

      tl.fromTo(rocketFlameRef.current, { opacity: 0, scaleY: 0.2 }, { opacity: 1, scaleY: 1.35, duration: 0.01, ease: 'power2.out' }, 0.51);

      tl.to(fanDeckMasterRef.current, { y: isMobile ? '-140vh' : '-175vh', scaleY: 1.25, scaleX: 0.96, duration: 0.025, ease: 'power3.in' }, 0.515);

      tl.to(rocketFlameRef.current, { opacity: 0, duration: 0.01, ease: 'power1.in' }, 0.535);
      tl.to(stage45Ref.current, { opacity: 0, duration: 0.01, ease: 'power1.in' }, 0.535);

      // ─────────────────────────────────────────────────────────────
      // STAGE 7: "WHY CHOOSE US?" REVEAL & LONG HOLD (0.54 -> 0.72)
      // ─────────────────────────────────────────────────────────────
      tl.fromTo(stageWhyRef.current, { opacity: 0 }, { opacity: 1, duration: 0.025, ease: 'power1.out' }, 0.54);

      tl.fromTo(whyTitleWordsRef.current, { y: -70, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.008, duration: 0.025, ease: 'back.out(1.8)' }, 0.545);

      tl.fromTo(whyRopeBoardRef.current, { y: -160, opacity: 0 }, { y: 0, opacity: 1, duration: 0.025, ease: 'power2.out' }, 0.545);

      tl.fromTo(whyPointsRef.current, { x: -35, opacity: 0 }, { x: 0, opacity: 1, stagger: 0.008, duration: 0.025, ease: 'power2.out' }, 0.55);

      tl.fromTo(whyPhotoRef.current, { x: 35, opacity: 0, scale: 0.96 }, { x: 0, opacity: 1, scale: 1.0, duration: 0.025, ease: 'power2.out' }, 0.55);

      // Hold for Why Choose Us: 0.55 -> 0.59 on mobile, 0.55 -> 0.70 on desktop
      const stage8StartTime = isMobile ? 0.59 : 0.70;

      // ─────────────────────────────────────────────────────────────
      // STAGE 8: CINEMATIC CAMERA PAN INTO PROOF-OF-WORK & REVIEWS
      // Content glides smoothly left while camera tracks right to reveal
      // authentic completed site installations and verified client feedback!
      // ─────────────────────────────────────────────────────────────
      tl.to(
        stageWhyRef.current,
        {
          xPercent: isMobile ? -100 : -85,
          scale: 0.94,
          opacity: 0,
          duration: 0.04,
          ease: 'power2.inOut',
        },
        stage8StartTime
      );

      tl.fromTo(
        stageProofFeedbackRef.current,
        {
          xPercent: isMobile ? 100 : 75,
          scale: 0.95,
          opacity: 0,
        },
        {
          xPercent: 0,
          scale: 1.0,
          opacity: 1,
          duration: 0.04,
          ease: 'power2.inOut',
        },
        stage8StartTime
      );

      // 0.75 -> 1.00: Long pinned hold buffer where users inspect completed sites & reviews

    }, containerRef);



    return () => {
      ctx.revert();
      gsap.ticker.remove(tickerCb);
      signObserver.disconnect();
      lenis.destroy();
    };
  }, [isClient]);

  return (
    <div ref={containerRef} className="relative w-full bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 overflow-hidden select-none transition-colors">
      {/* PINNED VIEWPORT */}
      <section
        ref={pinSectionRef}
        className="relative w-full h-screen min-h-[640px] max-h-screen overflow-hidden flex items-center justify-center bg-stone-950 dark:bg-black transition-colors"
      >
        {/* ========================================================= */}
        {/* TOP STATUS HUD BAR                                        */}
        {/* ========================================================= */}
        <div className="absolute top-4 inset-x-3 sm:inset-x-8 z-50 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-2 sm:gap-3 bg-stone-900/90 dark:bg-stone-950/80 backdrop-blur-xl px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-stone-700/50 dark:border-white/10 shadow-2xl">
            <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-[10px] sm:text-xs uppercase tracking-wider font-semibold text-stone-200">
              Kinetic Spatial Gateway
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 bg-stone-900/90 dark:bg-stone-950/80 backdrop-blur-xl px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-stone-700/50 dark:border-white/10">
            <span className="text-[9px] sm:text-[11px] font-medium text-stone-400">Scroll to Explore</span>
            <div className="w-16 sm:w-28 h-1.5 bg-stone-800 rounded-full overflow-hidden">
              <div
                ref={progressBarRef}
                className="h-full bg-gradient-to-r from-amber-500 to-amber-300 w-0 transition-all duration-75"
              />
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* STAGE 1: 10-PANEL VERTICAL SLAT DOORWAY                   */}
        {/* ========================================================= */}
        <div
          ref={stage1Ref}
          className="absolute inset-0 z-30 w-full h-full flex overflow-hidden pointer-events-none"
        >
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={`slat-${i}`}
              ref={(el) => {
                slatRefs.current[i] = el;
              }}
              className="relative h-full overflow-hidden will-change-transform border-x border-black/30 shadow-[0_10px_35px_rgba(0,0,0,0.6)]"
              style={{ width: '10%' }}
            >
              <div
                className="absolute top-0 h-full max-w-none"
                style={{
                  width: '1000%',
                  left: `-${i * 100}%`,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={heroImage}
                  alt={`Wall Panel Slat ${i + 1}`}
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <div className="absolute inset-y-0 right-0 w-[1px] bg-gradient-to-b from-amber-400/20 via-black/50 to-black/80" />
            </div>
          ))}

          {/* Hero Prompt Text (Overlaid in Stage 1) */}
          <div
            ref={heroTextRef}
            className="absolute inset-0 flex flex-col items-center justify-between py-20 sm:py-24 px-4 sm:px-6 text-center z-40 pointer-events-auto"
          >
            <div className="max-w-4xl mx-auto pt-4 sm:pt-6">
              <span className="inline-block py-1 sm:py-1.5 px-3 sm:px-4 rounded-full text-[10px] sm:text-xs font-semibold uppercase tracking-widest bg-amber-500/20 text-amber-300 border border-amber-500/40 backdrop-blur-md mb-3 shadow-lg shadow-amber-500/10">
                Direct Mill Architectural Cladding
              </span>
              <h1 className="text-2xl sm:text-5xl lg:text-7xl font-black text-white tracking-tight leading-[1.1] drop-shadow-2xl">
                Wholesale Wall Panels for{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500">
                  Projects, Retail & Commercial Spaces
                </span>
              </h1>
              <p className="mt-3 text-[11px] sm:text-base text-stone-200 max-w-2xl mx-auto font-light leading-relaxed drop-shadow-lg">
                Premium PVC, WPC, fluted and decorative wall panels with bulk pricing and project-ready supply across Gurgaon, Delhi NCR and India.
              </p>
              
              <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                <Link href="/wall-panels" className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold uppercase tracking-wider text-xs sm:text-sm rounded-full transition-colors shadow-lg shadow-amber-500/20">Explore Wall Panels</Link>
                <a href="#rfq" className="px-6 py-3 bg-stone-900/80 hover:bg-stone-800 text-white font-bold uppercase tracking-wider text-xs sm:text-sm rounded-full transition-colors border border-stone-700 backdrop-blur-md">Get Wholesale Quote</a>
              </div>
            </div>

            <div className="flex flex-col items-center gap-1.5 sm:gap-2 text-stone-300 text-[10px] sm:text-xs font-semibold uppercase tracking-widest mt-8">
              <span>Scroll to Open Wall</span>
              <div className="w-4 sm:w-5 h-7 sm:h-9 rounded-full border-2 border-stone-300 flex items-start justify-center p-1 bg-black/40 backdrop-blur-sm">
                <div className="w-1.5 h-2 sm:h-2.5 bg-amber-400 rounded-full animate-bounce" />
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* STAGE 2: "WHAT IS A WALL PANEL?" SHOWCASE                 */}
        {/* ========================================================= */}
        <div
          ref={stage2Ref}
          className="absolute inset-0 z-20 w-full h-full flex items-center justify-center p-3 sm:p-6 md:p-12 pointer-events-auto"
        >
          <div
            ref={stage2ContentRef}
            className="max-w-5xl w-full max-h-[88vh] overflow-y-auto md:overflow-visible grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-8 items-center bg-white/95 dark:bg-stone-900/90 backdrop-blur-2xl border border-stone-200 dark:border-amber-500/30 p-4 sm:p-8 rounded-3xl shadow-xl dark:shadow-2xl dark:shadow-black/80"
          >
            {/* Left Column: Image Showcase of the Wall Panel */}
            <div className="md:col-span-5 relative aspect-[16/10] md:aspect-[3/4] w-full rounded-2xl overflow-hidden border border-stone-300 dark:border-white/20 shadow-xl group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={heroImage}
                alt="Architectural Wall Panel Texture"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
              <div className="absolute top-2.5 left-2.5 bg-amber-500 text-stone-950 font-black text-[9px] sm:text-[10px] uppercase tracking-wider px-2 py-0.5 rounded shadow">
                Premium Architectural Cladding
              </div>
              <div className="absolute bottom-3 inset-x-3 flex items-center justify-between text-[10px] sm:text-xs text-white">
                <span className="font-medium">Standard: 2950 × 300 mm</span>
                <span className="font-bold text-amber-400">Class B1 Fire Rated</span>
              </div>
            </div>

            {/* Right Column: Educational Narrative & B2B Features */}
            <div className="md:col-span-7 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
                <span className="px-2 py-0.5 text-[9px] sm:text-[10px] uppercase tracking-wider font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 rounded">
                  Architecture 101
                </span>
                <span className="text-[10px] sm:text-xs text-stone-500 dark:text-stone-400 font-medium">Definition & Engineering</span>
              </div>

              <h2 className="text-xl sm:text-3xl lg:text-4xl font-black text-stone-900 dark:text-white leading-tight mb-2 sm:mb-3">
                What is an Architectural Wall Panel?
              </h2>

              <p className="text-[11px] sm:text-sm text-stone-600 dark:text-stone-300 font-light leading-relaxed mb-4 sm:mb-6">
                Wall panels are precision-engineered surface cladding systems designed to replace traditional plaster, paint, and wallpaper. Built with seamless tongue-and-groove profiles, they provide 100% moisture barrier protection with zero masonry dust or curing time.
              </p>

              {/* 4 Feature Cards Grid */}
              <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4 sm:mb-6">
                <div className="p-2.5 sm:p-3 rounded-xl bg-stone-50 dark:bg-stone-950/60 border border-stone-200 dark:border-white/10">
                  <span className="text-amber-600 dark:text-amber-400 text-xs sm:text-sm font-bold block mb-0.5">🛡️ 100% Waterproof</span>
                  <p className="text-[10px] sm:text-[11px] text-stone-600 dark:text-stone-400 leading-snug">Zero warping, termite-proof, immune to seepage.</p>
                </div>
                <div className="p-2.5 sm:p-3 rounded-xl bg-stone-50 dark:bg-stone-950/60 border border-stone-200 dark:border-white/10">
                  <span className="text-amber-600 dark:text-amber-400 text-xs sm:text-sm font-bold block mb-0.5">⚡ Tongue & Groove</span>
                  <p className="text-[10px] sm:text-[11px] text-stone-600 dark:text-stone-400 leading-snug">Seamless interlocking fit. Dry install in 1/3 time.</p>
                </div>
                <div className="p-2.5 sm:p-3 rounded-xl bg-stone-50 dark:bg-stone-950/60 border border-stone-200 dark:border-white/10">
                  <span className="text-amber-600 dark:text-amber-400 text-xs sm:text-sm font-bold block mb-0.5">🎵 Thermal & Acoustic</span>
                  <p className="text-[10px] sm:text-[11px] text-stone-600 dark:text-stone-400 leading-snug">Hollow core chamber insulates sound and heat.</p>
                </div>
                <div className="p-2.5 sm:p-3 rounded-xl bg-stone-50 dark:bg-stone-950/60 border border-stone-200 dark:border-white/10">
                  <span className="text-amber-600 dark:text-amber-400 text-xs sm:text-sm font-bold block mb-0.5">💎 Direct Factory Rates</span>
                  <p className="text-[10px] sm:text-[11px] text-stone-600 dark:text-stone-400 leading-snug">Tiered bulk discounts for contractors & builders.</p>
                </div>
              </div>

              <div className="flex justify-center items-center pt-2">
                <a
                  href="#catalog"
                  className="py-2.5 px-6 sm:py-2.5 sm:px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:brightness-110 text-stone-950 text-xs sm:text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-amber-500/20 text-center"
                >
                  Explore Panel Types ↓
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* STAGE 3: 4 CONCENTRIC COUNTER-ROTATING ORBIT RINGS        */}
        {/* ========================================================= */}
        <div
          ref={stage3Ref}
          className="absolute inset-0 z-10 w-full h-full flex items-center justify-center overflow-hidden opacity-0 pointer-events-none"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.08)_0%,rgba(0,0,0,0.96)_70%,black_100%)]" />

          {/* Central Void Glowing Aperture - EXACT DEAD CENTER OF SCREEN */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-52 h-52 sm:w-64 sm:h-64 rounded-full border border-amber-500/40 shadow-[0_0_100px_rgba(245,158,11,0.3)] pointer-events-none animate-pulse" />

          {/* Center Floating Typography */}
          <div
            ref={stage3TextRef}
            className="absolute z-20 text-center px-4 max-w-[280px] sm:max-w-md pointer-events-auto left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/60 sm:bg-transparent backdrop-blur-md sm:backdrop-blur-none rounded-2xl py-3 border border-amber-500/20 sm:border-transparent shadow-2xl"
          >
            <span className="inline-block py-0.5 px-2.5 rounded-full text-[9px] sm:text-[11px] uppercase tracking-wider font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/40 mb-1.5 sm:mb-2">
              Exclusive Mill Stock
            </span>
            <h3 className="text-xl sm:text-4xl font-black text-white tracking-tight">
              Wide Range of Wall Panels
            </h3>
            <p className="text-[10px] sm:text-sm text-stone-300 mt-1.5 sm:mt-2 font-light leading-relaxed">
              Over 200+ architectural textures: fluted WPC louvers, seamless PVC &amp; high-gloss UV marble sheets.
            </p>
          </div>

          {/* 4 RINGS CONTAINER (Wide Radial Spacing on Mobile to Prevent Overlap) */}
          <div
            ref={ringsContainerRef}
            className="relative w-full h-full flex items-center justify-center will-change-transform"
          >
            {/* ── RING 1 (Inner) ── */}
            <div
              ref={ring1Ref}
              className="absolute w-[70vmin] h-[70vmin] md:w-[32vw] md:h-[32vw] rounded-full border border-amber-500/30 pointer-events-none will-change-transform"
            >
              {ring1Items.map((item) => {
                const angle = item.angle;
                return (
                  <div
                    key={item.id}
                    className="absolute w-9 h-9 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl overflow-hidden border border-amber-400/60 shadow-xl shadow-black bg-stone-900 pointer-events-auto hover:scale-125 transition-transform"
                    style={{
                      left: `calc(${(50 + Math.cos(angle) * 50).toFixed(4)}% - 18px)`,
                      top: `calc(${(50 + Math.sin(angle) * 50).toFixed(4)}% - 18px)`,
                    }}
                  >
                    <Image src={item.img} alt="Panel Texture" fill sizes="64px" className="object-cover" />
                  </div>
                );
              })}
            </div>

            {/* ── RING 2 ── */}
            <div
              ref={ring2Ref}
              className="absolute w-[106vmin] h-[106vmin] md:w-[54vw] md:h-[54vw] rounded-full border border-sky-500/25 pointer-events-none will-change-transform"
            >
              {ring2Items.map((item) => {
                const angle = item.angle;
                return (
                  <div
                    key={item.id}
                    className="absolute w-10 h-10 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border border-sky-400/40 shadow-2xl shadow-black bg-stone-900 pointer-events-auto hover:scale-125 transition-transform"
                    style={{
                      left: `calc(${(50 + Math.cos(angle) * 50).toFixed(4)}% - 20px)`,
                      top: `calc(${(50 + Math.sin(angle) * 50).toFixed(4)}% - 20px)`,
                    }}
                  >
                    <Image src={item.img} alt="Panel Texture" fill sizes="80px" className="object-cover" />
                  </div>
                );
              })}
            </div>

            {/* ── RING 3 ── */}
            <div
              ref={ring3Ref}
              className="absolute w-[144vmin] h-[144vmin] md:w-[78vw] md:h-[78vw] rounded-full border border-emerald-500/25 pointer-events-none will-change-transform"
            >
              {ring3Items.map((item) => {
                const angle = item.angle;
                return (
                  <div
                    key={item.id}
                    className="absolute w-11 h-11 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border border-emerald-400/40 shadow-2xl shadow-black bg-stone-900 pointer-events-auto hover:scale-125 transition-transform"
                    style={{
                      left: `calc(${(50 + Math.cos(angle) * 50).toFixed(4)}% - 22px)`,
                      top: `calc(${(50 + Math.sin(angle) * 50).toFixed(4)}% - 22px)`,
                    }}
                  >
                    <Image src={item.img} alt="Panel Texture" fill sizes="80px" className="object-cover" />
                  </div>
                );
              })}
            </div>

            {/* ── RING 4 (Outer Grand Arc into Screen Corners) ── */}
            <div
              ref={ring4Ref}
              className="absolute w-[184vmin] h-[184vmin] md:w-[108vw] md:h-[108vw] rounded-full border border-purple-500/25 pointer-events-none will-change-transform"
            >
              {ring4Items.map((item) => {
                const angle = item.angle;
                return (
                  <div
                    key={item.id}
                    className="absolute w-13 h-13 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden border border-purple-400/40 shadow-2xl shadow-black bg-stone-900 pointer-events-auto hover:scale-125 transition-transform"
                    style={{
                      left: `calc(${(50 + Math.cos(angle) * 50).toFixed(4)}% - 26px)`,
                      top: `calc(${(50 + Math.sin(angle) * 50).toFixed(4)}% - 26px)`,
                    }}
                  >
                    <Image src={item.img} alt="Panel Texture" fill sizes="96px" className="object-cover" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* STAGE 4 & 5: PEACOCK FAN-OUT & IN-SITU SHUFFLE SHOWCASE   */}
        {/* ========================================================= */}
        <div
          ref={stage45Ref}
          className="absolute inset-0 z-20 w-full h-full flex items-center justify-center opacity-0 pointer-events-auto overflow-hidden"
        >
          {/* Subtle Ambient Background Gradient */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_60%,rgba(245,158,11,0.06)_0%,transparent_65%)] pointer-events-none" />

          {/* ─────────────────────────────────────────────────────── */}
          {/* FAN DECK MASTER CONTAINER                               */}
          {/* (Starts DEAD-CENTER in the circle, then slides left)    */}
          {/* ALL UPLIGHTS ARE ANCHORED HERE SO THEY ONLY HIT PANELS  */}
          {/* ─────────────────────────────────────────────────────── */}
          <div
            ref={fanDeckMasterRef}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[360px] sm:w-[480px] md:w-[580px] h-[360px] sm:h-[450px] md:h-[520px] flex items-center justify-center will-change-transform z-20"
          >
            {/* THEATRICAL UPLIGHTS RIG (Strictly confined under the panels; zero spill to right side!) */}
            <div className="absolute -bottom-16 inset-x-0 flex justify-center items-end pointer-events-none z-0">
              {/* Local floor glow only directly under the fan */}
              <div className="absolute bottom-0 w-[85%] h-20 bg-gradient-to-t from-amber-500/28 via-amber-500/08 to-transparent blur-md rounded-full pointer-events-none" />

              {/* 5 Targeted Upward Volumetric Beams tracking each panel angle */}
              {FAN_PANELS.map((p, idx) => {
                const beamOffsets = isMobile ? [-75, -38, 0, 38, 75] : [-145, -72, 0, 72, 145];
                const beamAngles = isMobile ? [-18, -9, 0, 9, 18] : [-22, -11, 0, 11, 22];
                return (
                  <div
                    key={`uplight-${idx}`}
                    ref={(el) => {
                      uplightRefs.current[idx] = el;
                    }}
                    className="absolute bottom-3 flex flex-col items-center origin-bottom will-change-transform opacity-0"
                    style={{
                      transform: `translateX(${beamOffsets[idx]}px) rotate(${beamAngles[idx]}deg)`,
                    }}
                  >
                    {/* Projector Lamp Lens Emitter */}
                    <div className="w-12 h-2.5 rounded-full bg-gradient-to-r from-amber-400 via-white to-amber-400 blur-[1px] shadow-[0_0_25px_#f59e0b]" />

                    {/* Upward Volumetric Cone illuminating ONLY the panel */}
                    <div
                      className="w-32 sm:w-44 md:w-56 h-[420px] sm:h-[500px] md:h-[580px]"
                      style={{
                        background: 'radial-gradient(ellipse at bottom, rgba(245,158,11,0.52) 0%, rgba(251,191,36,0.18) 42%, rgba(245,158,11,0.02) 70%, transparent 85%)',
                        filter: 'blur(9px)',
                      }}
                    />
                  </div>
                );
              })}
            </div>

            {/* ROCKET THRUSTER FLAME (Ignites under center stack before launch) */}
            <div
              ref={rocketFlameRef}
              className="absolute -bottom-48 left-1/2 -translate-x-1/2 w-36 h-60 pointer-events-none opacity-0 will-change-transform flex flex-col items-center z-10 origin-top"
            >
              <div className="w-12 sm:w-16 h-48 bg-gradient-to-b from-white via-amber-400 to-transparent blur-sm rounded-full shadow-[0_0_50px_#f59e0b]" />
              <div className="w-24 sm:w-32 h-60 bg-gradient-to-b from-amber-500/80 via-amber-600/25 to-transparent blur-xl rounded-full -mt-44" />
            </div>

            {/* 5 Architectural Slabs (Slightly larger, majestic presence) */}
            {FAN_PANELS.map((panel, idx) => (
              <div
                key={panel.id}
                ref={(el) => {
                  fanPanelRefs.current[idx] = el;
                }}
                className="absolute bottom-0 w-[130px] sm:w-[168px] md:w-[205px] h-[285px] sm:h-[375px] md:h-[460px] rounded-2xl overflow-hidden border-2 border-white/20 bg-stone-900 shadow-2xl transition-all duration-300 will-change-transform cursor-pointer group"
                style={{
                  zIndex: idx === 2 ? 30 : 20 - Math.abs(idx - 2),
                  transformOrigin: '50% 95%',
                }}
              >
                {/* Panel Real Texture Image */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={panel.textureUrl}
                  alt={panel.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />

                {/* Surface sheen */}
                <div className="absolute inset-0 bg-gradient-to-tr from-black/50 via-transparent to-white/15 pointer-events-none" />

                {/* Micro Badge */}
                <div className="absolute top-2 inset-x-2 flex justify-center">
                  <span className="px-2 py-0.5 rounded-full text-[8px] sm:text-[9px] font-bold uppercase tracking-wider bg-black/75 text-amber-300 border border-amber-500/40 backdrop-blur-md">
                    {panel.code}
                  </span>
                </div>

                <div className="absolute bottom-2 inset-x-1.5 text-center">
                  <span className="text-[9px] sm:text-[10px] font-bold text-white block drop-shadow-md truncate">
                    {panel.badge}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* ─────────────────────────────────────────────────────── */}
          {/* RIGHT / BOTTOM: INSTALLED IN-SITU SHOWCASE & CLEAN TEXT  */}
          {/* Mobile: below the lifted deck; Desktop: on right side   */}
          {/* ─────────────────────────────────────────────────────── */}
          <div className="absolute inset-x-0 bottom-2 sm:bottom-4 md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:left-[54%] md:right-auto flex justify-center md:block pointer-events-none z-20">
            <div
              ref={stage5RightRef}
              className="w-[92vw] sm:w-[85vw] md:w-[40vw] max-w-sm md:max-w-xl flex flex-col justify-center will-change-transform opacity-0 pointer-events-auto"
            >
              {/* 1. Installed Room Frame (100% CLEAN, UNOBSTRUCTED IMAGE) */}
              <div className="relative aspect-[16/9] sm:aspect-[16/10] w-full max-h-[140px] sm:max-h-[220px] md:max-h-none rounded-xl sm:rounded-2xl overflow-hidden border border-amber-500/40 md:border-2 md:border-amber-500/30 shadow-2xl shadow-black/90 bg-stone-950">
                {FAN_PANELS.map((panel, idx) => (
                  <div
                    key={`room-${panel.id}`}
                    ref={(el) => {
                      roomSlideRefs.current[idx] = el;
                    }}
                    className="absolute inset-0 will-change-transform transition-opacity duration-300"
                    style={{ opacity: idx === 0 ? 1 : 0 }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={panel.roomUrl}
                      alt={panel.roomTitle}
                      className="w-full h-full object-cover object-center"
                    />
                    {/* Room badge */}
                    <div className="absolute top-2 left-2 bg-black/80 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-amber-500/30 text-[9px] sm:text-[10px] text-amber-300 font-bold">
                      Proof: Installed Room
                    </div>
                  </div>
                ))}
              </div>

              {/* 2. Details STRICTLY BELOW the Image */}
              <div className="relative mt-2 sm:mt-4 min-h-[50px] sm:min-h-[110px]">
                {FAN_PANELS.map((panel, idx) => (
                  <div
                    key={`info-${panel.id}`}
                    ref={(el) => {
                      roomInfoRefs.current[idx] = el;
                    }}
                    className="absolute inset-x-0 top-0 transition-opacity duration-300"
                    style={{ opacity: idx === 0 ? 1 : 0 }}
                  >
                    {/* Top Row: Code, Name & Wholesale Rate */}
                    <div className="flex items-baseline justify-between gap-2 mb-0.5 sm:mb-1">
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <span className="text-amber-600 dark:text-amber-400 font-black text-xs sm:text-sm uppercase tracking-wider">
                          {panel.code}
                        </span>
                        <h4 className="text-xs sm:text-lg font-black text-stone-900 dark:text-white truncate max-w-[180px] sm:max-w-sm">
                          {panel.name}
                        </h4>
                      </div>
                      <span className="text-xs sm:text-base font-black text-amber-600 dark:text-amber-400 whitespace-nowrap">
                        {panel.wholesaleRate}
                      </span>
                    </div>

                    {/* In-Situ Installation Context */}
                    <p className="text-[10px] sm:text-xs text-amber-600 dark:text-amber-300/90 font-medium mb-1">
                      In-Situ: {panel.roomTitle}
                    </p>

                    {/* Description (desktop) */}
                    <p className="hidden sm:block text-xs text-stone-600 dark:text-stone-300 font-light leading-relaxed mb-2 line-clamp-2">
                      {panel.description}
                    </p>

                    {/* Specifications Inline (desktop) */}
                    <div className="hidden sm:flex items-center gap-3 text-[11px] text-stone-500 dark:text-stone-400 font-medium pt-1.5 border-t border-stone-200 dark:border-stone-800/80">
                      <span>Dimensions: {panel.dimensions}</span>
                      <span>•</span>
                      <span>Profile: {panel.thickness}</span>
                      <span>•</span>
                      <a
                        href="#rfq"
                        className="text-amber-600 dark:text-amber-400 font-bold hover:underline"
                      >
                        Instant RFQ →
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* STAGE 7: "WHY CHOOSE US?" (EMERGES DIRECTLY BEHIND ROCKET) */}
        {/* ========================================================= */}
        <div
          ref={stageWhyRef}
          id="why-us"
          onPointerMove={handleStagePointerMove}
          className="absolute inset-0 z-20 w-full h-full flex flex-col justify-center px-3 sm:px-8 lg:px-14 opacity-0 pointer-events-auto overflow-hidden bg-stone-50/98 dark:bg-stone-950/95 text-stone-900 dark:text-stone-100 transition-colors pt-2 pb-2 sm:pt-0 sm:pb-0"
        >
          {/* Subtle Ambient Background */}
          <div className="absolute top-1/3 -left-32 w-80 h-80 bg-amber-500/08 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-1/3 -right-32 w-80 h-80 bg-amber-600/06 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl w-full mx-auto flex flex-col justify-center h-full max-h-[96vh] sm:max-h-[92vh]">
            {/* TOP HEADER: "WHY CHOOSE US?" + HANGING "WHY NOT?!" */}
            <div className="relative flex items-center justify-between gap-3 pb-1.5 sm:pb-5 border-b border-stone-200 dark:border-stone-800/60">
              <div>
                <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2 sm:px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-[9px] sm:text-xs uppercase tracking-wider font-semibold mb-1">
                  <span>★</span>
                  <span>The Wholesaleji Mill Advantage</span>
                </div>

                <h2 className="text-xl sm:text-4xl lg:text-5xl font-black text-stone-900 dark:text-white tracking-tight flex items-baseline gap-x-2 sm:gap-x-4">
                  <span
                    ref={(el) => {
                      whyTitleWordsRef.current[0] = el;
                    }}
                    className="inline-block will-change-transform"
                  >
                    WHY
                  </span>
                  <span
                    ref={(el) => {
                      whyTitleWordsRef.current[1] = el;
                    }}
                    className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 dark:from-amber-200 dark:via-amber-400 dark:to-amber-500 will-change-transform"
                  >
                    CHOOSE
                  </span>
                  <span
                    ref={(el) => {
                      whyTitleWordsRef.current[2] = el;
                    }}
                    className="inline-block text-stone-900 dark:text-white will-change-transform"
                  >
                    US?
                  </span>
                </h2>
              </div>

              {/* HANGING "WHY NOT?!" BOARD WITH INFINITE ROPES (Hidden on phone screens) */}
              <div
                ref={whyRopeBoardRef}
                className="hidden sm:flex relative flex-col items-center flex-shrink-0 z-30 scale-90 sm:scale-100"
              >
                <div
                  ref={hangingSignRef}
                  onPointerDown={handleBoardPointerDown}
                  onPointerUp={handleBoardPointerUp}
                  onPointerCancel={handleBoardPointerUp}
                  style={{
                    transformOrigin: '50% -180px',
                    touchAction: 'none',
                  }}
                  className="relative cursor-grab active:cursor-grabbing select-none group will-change-transform"
                  title="Hover cursor to swing, or drag & fling!"
                >
                  {/* Left Infinite Rope */}
                  <div
                    className="absolute bottom-full left-5 w-1.5 h-[150vh] bg-gradient-to-b from-amber-900 via-amber-700 to-amber-600 shadow-[0_2px_12px_rgba(0,0,0,0.95)] border-x border-amber-950/70 pointer-events-none"
                  />
                  {/* Right Infinite Rope */}
                  <div
                    className="absolute bottom-full right-5 w-1.5 h-[150vh] bg-gradient-to-b from-amber-900 via-amber-700 to-amber-600 shadow-[0_2px_12px_rgba(0,0,0,0.95)] border-x border-amber-950/70 pointer-events-none"
                  />

                  {/* Hanging Board Plaque */}
                  <div className="relative px-3.5 sm:px-7 py-2 sm:py-3 rounded-xl bg-white dark:bg-gradient-to-br dark:from-stone-900 dark:via-stone-900 dark:to-stone-950 border border-stone-200 dark:border-amber-500/50 shadow-xl dark:shadow-[0_15px_30px_rgba(0,0,0,0.9),0_0_20px_rgba(245,158,11,0.15)] group-hover:border-amber-400 transition-colors">
                    <div className="absolute -top-2 left-4 w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full border-2 border-amber-400 bg-stone-100 dark:bg-stone-950 shadow" />
                    <div className="absolute -top-2 right-4 w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full border-2 border-amber-400 bg-stone-100 dark:bg-stone-950 shadow" />

                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <span className="text-amber-600 dark:text-amber-400 text-[9px] sm:text-xs uppercase tracking-wider font-bold">
                        Honestly...
                      </span>
                      <div className="w-1 h-3 bg-amber-500/40 rounded" />
                      <span className="text-base sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-stone-800 to-amber-700 dark:from-amber-200 dark:via-white dark:to-amber-400 tracking-wider drop-shadow">
                        WHY NOT?!
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-0.5 text-[7px] sm:text-[9px] font-medium text-stone-500 dark:text-stone-400">
                      <span>Direct Mill Rates</span>
                      <span className="text-amber-600 dark:text-amber-400 font-bold hidden sm:inline">Cursor Sway &amp; Drag ⟳</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>


            {/* 2-COLUMN CONTENT: LEFT CLEAN LIST + RIGHT REAL 4:3 PHOTO */}
            <div className="mt-2 sm:mt-5 grid grid-cols-1 lg:grid-cols-12 gap-2 sm:gap-4 lg:gap-8 items-center overflow-y-auto lg:overflow-visible">
              {/* LEFT COLUMN: 4 REFINED VALUE POINTS */}
              <div className="lg:col-span-7 flex flex-col divide-y divide-stone-200 dark:divide-stone-800/60">
                {WHY_POINTS.map((point, idx) => (
                  <div
                    key={point.title}
                    ref={(el) => {
                      whyPointsRef.current[idx] = el;
                    }}
                    className="py-1 sm:py-3 flex items-start gap-2.5 sm:gap-4 group will-change-transform"
                  >
                    {/* Animated SVG Icon */}
                    <div className="pt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform scale-90 sm:scale-100">
                      {point.icon}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                        <h3 className="text-xs sm:text-base font-bold text-stone-900 dark:text-white group-hover:text-amber-500 dark:group-hover:text-amber-300 transition-colors truncate">
                          {point.title}
                        </h3>
                        <span className="px-1.5 py-0.2 rounded text-[8px] sm:text-[10px] uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-medium">
                          {point.tag}
                        </span>
                      </div>
                      <p className="text-[10px] sm:text-xs text-stone-600 dark:text-stone-300 font-light mt-0.5 leading-snug line-clamp-2">
                        {point.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>


              {/* RIGHT COLUMN: REAL GOALS FLOORS TEAM (FITS NATURALLY ON MOBILE) */}
              <div className="lg:col-span-5 flex flex-col mt-1 sm:mt-0">
                <div
                  ref={whyPhotoRef}
                  className="relative rounded-xl sm:rounded-2xl overflow-hidden border border-amber-500/40 bg-stone-900 shadow-xl sm:shadow-2xl shadow-black will-change-transform max-h-[160px] sm:max-h-none"
                >
                  {/* Photo: 16:9 on mobile for compact vertical footprint, 4:3 on desktop */}
                  <div className="relative aspect-[16/9] sm:aspect-[4/3] w-full overflow-hidden bg-stone-950">
                    <Image
                      src={teamImage}
                      alt="Goals Floors Team Presenting Luxury Wall Panels"
                      fill
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      priority
                      className="object-cover object-center"
                    />

                    {/* Subtle bottom gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent pointer-events-none" />

                    {/* Floating verified badge */}
                    <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-stone-950/85 backdrop-blur-md px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full border border-amber-500/40 shadow flex items-center gap-1.5 sm:gap-2">
                      <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-[9px] sm:text-[11px] font-bold text-amber-300 uppercase tracking-wider">
                        Goals Floors Team • We Care
                      </span>
                    </div>

                    <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-stone-950/85 backdrop-blur-md px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border border-white/20 shadow text-[9px] sm:text-[10px] text-white font-bold">
                      ⭐ 4.9 Rating
                    </div>

                    {/* Clean caption on bottom */}
                    <div className="absolute bottom-2 inset-x-2 sm:bottom-3 sm:inset-x-3 text-white">
                      <p className="text-[10px] sm:text-sm font-bold drop-shadow">
                        &ldquo;Aapke sapno ki diwaar, hamari zimmedari.&rdquo;
                      </p>
                      <div className="flex items-center justify-between mt-0.5 sm:mt-1 text-[9px] sm:text-xs text-stone-300 font-medium">
                        <span>Direct Mill Rate: ₹42 - ₹72/sqft</span>
                        <a
                          href="https://wa.me/919999999999?text=Hi%20Wholesaleji%20Team%2C%20I%20want%20to%20know%20more%20about%20wall%20panels."
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-amber-400 font-bold hover:underline"
                        >
                          Connect Now →
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>


        {/* ========================================================= */}
        {/* STAGE 8: PROOF OF WORK & VERIFIED CLIENT FEEDBACK GALLERY */}
        {/* (Cinematic camera pan transition from Why Choose Us)     */}
        {/* ========================================================= */}
        <div
          ref={stageProofFeedbackRef}
          id="proof-feedback"
          className="absolute inset-0 z-25 w-full h-full flex flex-col items-center justify-center pointer-events-auto opacity-0 overflow-hidden px-4 sm:px-8 lg:px-12 pt-16 sm:pt-4 pb-4"
          onPointerEnter={() => setIsHoveringGallery(true)}
          onPointerLeave={() => setIsHoveringGallery(false)}
        >
          {/* Subtle Ambient Architecture Backlighting */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.06)_0%,rgba(0,0,0,0.95)_75%,black_100%)] pointer-events-none" />

          <div className="relative w-full max-w-6xl mx-auto flex flex-col gap-3 sm:gap-6 z-10">
            {/* Gallery Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 sm:gap-3 pb-2 border-b border-stone-800/80">
              <div>
                <span className="text-[10px] sm:text-xs font-semibold text-amber-400/90 tracking-wide uppercase block">
                  Verified Site Installations & Client Experience
                </span>
                <h2 className="text-xl sm:text-3xl font-black tracking-tight text-white mt-0.5">
                  Proof of Work & Direct Mill Trust
                </h2>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3">
                <div className="flex items-center gap-1.5 sm:gap-2 bg-stone-900/90 border border-amber-500/30 px-2.5 sm:px-3.5 py-1 rounded-full shadow-lg">
                  <GoogleLogo className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                  <div className="flex items-center gap-1 text-[11px] sm:text-xs">
                    <span className="font-bold text-white">Google</span>
                    <span className="text-amber-400">★★★★★</span>
                    <span className="font-bold text-stone-200">5.0</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setIsFeedbackModalOpen(true);
                    setFeedbackSubmitted(false);
                    setCopiedToClipboard(false);
                  }}
                  className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-bold text-black bg-amber-400 hover:bg-amber-300 px-3 sm:px-4 py-1 rounded-full transition-all duration-200 shadow-md cursor-pointer"
                >
                  <span>+</span> Write Review
                </button>
              </div>
            </div>

            {/* Split Showcase: Client Review + Proof of Work Photo */}
            {(() => {
              const activeItem = clientReviews[activeProjectIndex] || clientReviews[0];
              if (!activeItem) return null;
              return (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-6 items-stretch min-h-[300px] sm:min-h-[440px]">
                  
                  {/* Left Column (5 Cols): Clean Client Review */}
                  <div className="lg:col-span-5 bg-stone-900/95 border border-stone-800 hover:border-amber-500/40 rounded-2xl sm:rounded-3xl p-4 sm:p-7 shadow-2xl backdrop-blur-xl flex flex-col justify-between transition-all duration-300">
                    <div className="space-y-2.5 sm:space-y-4">
                      {/* Review Badge & Verified Check */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-amber-400 text-xs sm:text-sm">
                          {'★'.repeat(activeItem.rating)}
                        </div>
                        <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-medium text-emerald-400 bg-emerald-950/40 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                          <span>✓</span> Verified Contractor Site
                        </span>
                      </div>

                      {/* Genuine Client Quote */}
                      <div key={`review-quote-${activeProjectIndex}`} className="animate-[fadeIn_0.35s_ease-out]">
                        <p className="text-xs sm:text-base text-stone-100 font-light leading-relaxed italic line-clamp-3 sm:line-clamp-none">
                          &ldquo;{activeItem.quote}&rdquo;
                        </p>
                      </div>

                      {/* Material Highlight */}
                      <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-stone-950/70 border border-stone-800/80 px-2.5 py-1 rounded-lg sm:rounded-xl text-[10px] sm:text-xs text-amber-300">
                        <span className="text-[9px] sm:text-[11px] text-stone-400">Material:</span>
                        <span className="font-semibold text-white truncate max-w-[200px] sm:max-w-none">{activeItem.material}</span>
                      </div>
                    </div>

                    {/* Reviewer Details & Navigation */}
                    <div className="pt-4 border-t border-stone-800/80 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${activeItem.avatarColor} flex items-center justify-center text-xs font-bold text-white shadow-md flex-shrink-0`}>
                            {activeItem.initials}
                          </div>
                          <div>
                            <h4 className="font-bold text-white text-sm leading-tight">{activeItem.name}</h4>
                            <p className="text-xs text-stone-400 mt-0.5">
                              {activeItem.role} • {activeItem.firm}
                            </p>
                            <p className="text-[11px] text-stone-500 mt-0.5">
                              {activeItem.location} • {activeItem.date}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Controls: Dots & Prev/Next */}
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-amber-400">
                            {String(activeProjectIndex + 1).padStart(2, '0')} / {String(clientReviews.length).padStart(2, '0')}
                          </span>
                          <div className="flex items-center gap-1.5 ml-2">
                            {clientReviews.map((_, idx) => (
                              <button
                                key={`nav-dot-${idx}`}
                                type="button"
                                onClick={() => setActiveProjectIndex(idx)}
                                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                                  activeProjectIndex === idx
                                    ? 'w-6 bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.7)]'
                                    : 'w-1.5 bg-stone-700 hover:bg-stone-500'
                                }`}
                                title={`View project ${idx + 1}`}
                              />
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setActiveProjectIndex((prev) => (prev === 0 ? clientReviews.length - 1 : prev - 1))}
                            className="w-8 h-8 rounded-full bg-stone-800/90 hover:bg-amber-400 hover:text-black text-stone-200 flex items-center justify-center text-sm font-bold cursor-pointer transition-all duration-200"
                            title="Previous Project"
                          >
                            ‹
                          </button>
                          <button
                            type="button"
                            onClick={() => setActiveProjectIndex((prev) => (prev + 1) % clientReviews.length)}
                            className="w-8 h-8 rounded-full bg-stone-800/90 hover:bg-amber-400 hover:text-black text-stone-200 flex items-center justify-center text-sm font-bold cursor-pointer transition-all duration-200"
                            title="Next Project"
                          >
                            ›
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column (7 Cols): Large "Proof of Work" Completed Site Photo */}
                  <div className="lg:col-span-7 relative rounded-3xl overflow-hidden border border-stone-800/90 bg-stone-950 shadow-2xl group flex flex-col justify-end min-h-[300px] sm:min-h-[420px]">
                    {/* Site Photo with smooth crossfade */}
                    <div key={`photo-${activeProjectIndex}`} className="absolute inset-0 w-full h-full animate-[fadeIn_0.5s_ease-out]">
                      <img
                        src={activeItem.sitePhoto}
                        alt={activeItem.siteTitle}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                      {/* Architectural Vignette Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/30 to-transparent" />
                      <div className="absolute inset-0 bg-gradient-to-r from-stone-950/40 via-transparent to-transparent" />
                    </div>

                    {/* Top Left Proof Badge */}
                    <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-black/75 backdrop-blur-md border border-white/10 px-3.5 py-1.5 rounded-full">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-xs font-semibold text-stone-100 tracking-wide">
                        Proof of Work: Installed Site
                      </span>
                    </div>

                    {/* Bottom Metadata Overlay */}
                    <div className="relative z-10 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                      <div>
                        <span className="text-[11px] font-semibold text-amber-400/90 uppercase tracking-wider block mb-1">
                          {activeItem.material}
                        </span>
                        <h3 className="text-lg sm:text-xl font-bold text-white leading-tight">
                          {activeItem.siteTitle}
                        </h3>
                        <p className="text-xs text-stone-300 mt-1">
                          {activeItem.location} • {activeItem.siteStats}
                        </p>
                      </div>

                      <div className="sm:hidden">
                        <button
                          type="button"
                          onClick={() => {
                            setIsFeedbackModalOpen(true);
                            setFeedbackSubmitted(false);
                            setCopiedToClipboard(false);
                          }}
                          className="w-full text-center text-xs font-bold text-black bg-amber-400 hover:bg-amber-300 px-4 py-2 rounded-full transition-all duration-200 cursor-pointer"
                        >
                          + Write Review
                        </button>
                      </div>
                    </div>
                  </div>

                </div>
              );
            })()}
          </div>
        </div>




        {/* ========================================================= */}
        {/* INTERACTIVE REVIEW MODAL & SMART 1-CLICK GMB FUNNEL       */}
        {/* ========================================================= */}
        {isFeedbackModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <div className="relative max-w-lg w-full rounded-2xl bg-stone-900 border border-amber-500/40 p-5 sm:p-7 shadow-2xl text-stone-100 animate-[pulseGlow_0.3s_ease-out]">
              {/* Close X button */}
              <button
                type="button"
                onClick={() => setIsFeedbackModalOpen(false)}
                className="absolute top-4 right-4 text-stone-400 hover:text-white text-lg p-1.5 cursor-pointer"
              >
                ✕
              </button>

              {!feedbackSubmitted ? (
                <form onSubmit={handleSubmitFeedback} className="space-y-4">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-amber-400 block mb-1">
                      Architect & Contractor Feedback
                    </span>
                    <h3 className="text-xl font-black text-white">
                      Leave Verified Site Experience
                    </h3>
                    <p className="text-xs text-stone-400 mt-0.5">
                      Your review will display on Wholesaleji and can be shared to Google Reviews in 1 click.
                    </p>
                  </div>

                  {/* Star Rating Interactive Selector */}
                  <div>
                    <label className="text-xs font-bold text-stone-300 block mb-1">
                      Rating:
                    </label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onMouseEnter={() => setFeedbackHoverRating(star)}
                          onMouseLeave={() => setFeedbackHoverRating(0)}
                          onClick={() => setFeedbackRating(star)}
                          className="text-2xl cursor-pointer transition-transform hover:scale-125 text-amber-400"
                        >
                          {(feedbackHoverRating || feedbackRating) >= star ? '★' : '☆'}
                        </button>
                      ))}
                      <span className="text-xs text-amber-400 ml-2 font-bold">
                        {feedbackRating === 5
                          ? '5.0 - Exceptional Quality'
                          : feedbackRating === 4
                          ? '4.0 - Highly Recommended'
                          : `${feedbackRating}.0 - Feedback`}
                      </span>
                    </div>
                  </div>

                  {/* Form Inputs Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-stone-300 block mb-1 font-medium">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={feedbackName}
                        onChange={(e) => setFeedbackName(e.target.value)}
                        placeholder="e.g. Ar. Rajesh Sharma"
                        className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-xs text-white focus:border-amber-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-stone-300 block mb-1 font-medium">
                        Your Professional Role
                      </label>
                      <select
                        value={feedbackRole}
                        onChange={(e) => setFeedbackRole(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-xs text-white focus:border-amber-400 focus:outline-none"
                      >
                        <option value="Architect">Architect / Firm Principal</option>
                        <option value="Interior Contractor">Turnkey Interior Contractor</option>
                        <option value="Interior Designer">Interior Designer</option>
                        <option value="Builder / Developer">Builder & Developer</option>
                        <option value="Luxury Home Owner">Luxury Home Owner</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] text-stone-300 block mb-1 font-medium">
                        Firm Name / Studio
                      </label>
                      <input
                        type="text"
                        value={feedbackFirm}
                        onChange={(e) => setFeedbackFirm(e.target.value)}
                        placeholder="e.g. Studio Design Works"
                        className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-xs text-white focus:border-amber-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-stone-300 block mb-1 font-medium">
                        Project City / Location
                      </label>
                      <input
                        type="text"
                        value={feedbackLocation}
                        onChange={(e) => setFeedbackLocation(e.target.value)}
                        placeholder="e.g. DLF Phase 5, Gurugram"
                        className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-xs text-white focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-stone-300 block mb-1 font-medium">
                      Material Installed
                    </label>
                    <select
                      value={feedbackMaterial}
                      onChange={(e) => setFeedbackMaterial(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-xs text-white focus:border-amber-400 focus:outline-none"
                    >
                      <option value="PVC Fluted Louver Panels">PVC Fluted Louver Panels</option>
                      <option value="Charcoal Architectural Slats">Charcoal Architectural Slats</option>
                      <option value="UV Marble Sheets (Italian Look)">UV Marble Sheets (Italian Look)</option>
                      <option value="Exterior WPC Cladding">Exterior WPC Cladding</option>
                      <option value="Mixed Commercial Cladding">Mixed Commercial Cladding</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] text-stone-300 block mb-1 font-medium">
                      Your Feedback / Review *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={feedbackComment}
                      onChange={(e) => setFeedbackComment(e.target.value)}
                      placeholder="Share your experience on tongue-and-groove fit, dispatch speed, moisture resistance, or mill pricing..."
                      className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-xs text-white focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsFeedbackModalOpen(false)}
                      className="px-4 py-2 rounded-xl text-stone-400 hover:text-white text-xs font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-stone-950 font-black text-xs uppercase tracking-wider hover:brightness-110 shadow-lg shadow-amber-500/25 cursor-pointer"
                    >
                      Submit Verified Review →
                    </button>
                  </div>
                </form>
              ) : (
                /* Success & 1-Click Smart GMB Funnel */
                <div className="text-center py-4 space-y-4">
                  <div className="w-14 h-14 mx-auto rounded-full bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-400 text-2xl">
                    ✓
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white">
                      Thank You, {feedbackName}! 🎉
                    </h3>
                    <p className="text-xs text-stone-300 mt-1 max-w-sm mx-auto">
                      Your review has been verified and added to Wholesaleji&apos;s site feed!
                    </p>
                  </div>

                  {feedbackRating >= 4 ? (
                    <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-left space-y-2.5">
                      <div className="flex items-center gap-2">
                        <span className="text-amber-400 font-bold text-xs">
                          ★ 1-Click Google Reviews Funnel
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-300">
                        Help other architects and builders discover factory-direct rates by posting your 5-star review directly on Google Maps!
                      </p>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handlePostToGoogle}
                          className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-stone-950 font-black text-xs uppercase tracking-wider hover:brightness-110 flex items-center justify-center gap-1.5 cursor-pointer shadow"
                        >
                          <span>Post to Google Reviews ↗</span>
                        </button>
                      </div>
                      {copiedToClipboard && (
                        <p className="text-[10px] text-emerald-400 text-center font-medium">
                          ✓ Review text copied to clipboard! Just paste (Ctrl+V) on Google.
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 text-left space-y-2">
                      <span className="text-amber-400 font-bold text-xs">
                        Direct Mill Care Escalation
                      </span>
                      <p className="text-[11px] text-stone-300">
                        Our Mill Quality Director will personally review your notes to ensure 100% satisfaction.
                      </p>
                      <a
                        href="https://wa.me/919999999999?text=Hi%2C%20I%20have%20feedback%20regarding%20my%20order"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block text-xs font-bold text-amber-400 hover:underline"
                      >
                        Chat Directly on WhatsApp →
                      </a>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => setIsFeedbackModalOpen(false)}
                    className="text-xs text-stone-400 hover:text-white underline cursor-pointer"
                  >
                    Close Window
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

