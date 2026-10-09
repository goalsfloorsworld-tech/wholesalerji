'use client';

import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import Link from 'next/link';
import Image from 'next/image';
import { PanelProduct } from '@/data/types';
import {
  ELITE_FLUTED_WALL_PANELS,
  ELITE_FLUTED_FAQS,
  ELITE_FLUTED_SPACES,
  ELITE_FLUTED_WHY_POINTS,
  ELITE_FLUTED_ANATOMY_SPECS,
  ELITE_FLUTED_COMPARISON,
  ELITE_FLUTED_BUYER_STEPS,
  ELITE_FLUTED_PERSONAS,
  ELITE_FLUTED_SISTER_COLLECTIONS,
} from '@/data/eliteFlutedPanelsData';
import FAQ from '@/components/FAQ';
import ProductShowcase from '@/components/ProductShowcase';
import LeadForm from '@/components/client/LeadForm';
import GetQuoteModal from '@/components/GetQuoteModal';
import {
  Check,
  CheckCircle2,
  ArrowRight,
  Phone,
  ShieldCheck,
  Layers,
  Building2,
  Home,
  Briefcase,
  Truck,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  X,
  FileText,
  Droplets,
  Sparkles,
  Flame,
  Link2,
  Leaf,
  Volume2,
  Feather
} from 'lucide-react';
import {
  AnimatedLayers,
  AnimatedDroplet,
  AnimatedSparkle,
  AnimatedFlame,
  AnimatedInterlock,
  AnimatedLeaf,
  AnimatedAcoustic,
  AnimatedFeather
} from '@/components/AnimatedIcons';

// ─────────────────────────────────────────────────────────────────────────────
// TOPOGRAPHIC WAVE THREE.JS SHADER ENGINE
// ─────────────────────────────────────────────────────────────────────────────
const vertexShader = `
void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
precision highp float;
uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform vec3 uColor;

// Hash function
vec2 hash(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}

// Simplex noise
float noise(vec2 p) {
    const float K1 = 0.366025404;
    const float K2 = 0.211324865;
    vec2 i = floor(p + (p.x + p.y) * K1);
    vec2 a = p - i + (i.x + i.y) * K2;
    float m = step(a.y, a.x); 
    vec2 o = vec2(m, 1.0 - m);
    vec2 b = a - o + K2;
    vec2 c = a - 1.0 + 2.0 * K2;
    vec3 h = max(0.5 - vec3(dot(a,a), dot(b,b), dot(c,c)), 0.0);
    vec3 n = h * h * h * h * vec3(dot(a, hash(i+0.0)), dot(b, hash(i+o)), dot(c, hash(i+1.0)));
    return dot(n, vec3(70.0));
}

// Fractal Brownian Motion
float fbm(vec2 p) {
    float f = 0.0;
    float w = 0.5;
    for (int i = 0; i < 5; i++) {
        f += w * noise(p);
        p *= 2.0;
        w *= 0.5;
    }
    return f;
}

void main() {
    vec2 uv = gl_FragCoord.xy / uResolution.xy;
    vec2 p = uv * 2.0 - 1.0;
    p.x *= uResolution.x / uResolution.y;

    // Slow movement over time
    vec2 pos = p * 1.5 + vec2(uTime * 0.05, uTime * 0.08);

    // Mouse influence
    vec2 m = uMouse * 2.0 - 1.0;
    m.x *= uResolution.x / uResolution.y;
    float dist = length(p - m);
    pos += normalize(p - m) * exp(-dist * 2.0) * 0.2;

    float n = fbm(pos);
    
    // Topographic contour lines (looks like fluted grooves)
    float v = fract(n * 10.0);
    float lines = smoothstep(0.0, 0.05, v) - smoothstep(0.05, 0.1, v);

    // Background gradient (stone dark)
    vec3 bg = mix(vec3(0.03, 0.03, 0.03), vec3(0.08, 0.08, 0.09), uv.y);
    
    // Line color dynamic accent
    vec3 lineColor = uColor * (0.6 + 0.4 * sin(n * 20.0 - uTime));

    // Combine
    vec3 col = mix(bg, lineColor, lines);
    
    // Add subtle vignette
    float vignette = 1.0 - smoothstep(0.5, 1.5, length(uv - 0.5));
    col *= vignette;
    
    gl_FragColor = vec4(col, 1.0);
}
`;

const TopoShader = React.memo(function TopoShader({ color = '#f59e0b' }: { color?: string }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef<[number, number]>([0.5, 0.5]);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);

  useEffect(() => {
    if (materialRef.current) {
      try {
        materialRef.current.uniforms.uColor.value.set(color);
      } catch {
        // ignore fallback
      }
    }
  }, [color]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    } catch {
      return;
    }

    if (!renderer.capabilities.isWebGL2) {
      renderer.dispose();
      return;
    }

    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, 0.1, 10);
    camera.position.z = 1;

    const uniforms: Record<string, THREE.IUniform> = {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2() },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uColor: { value: new THREE.Color(color) },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
    });
    materialRef.current = material;
    const quad = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), material);
    scene.add(quad);

    const resize = () => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      if (w === 0 || h === 0) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      renderer.setSize(w, h);
      renderer.setPixelRatio(dpr);
      uniforms.uResolution.value.set(w * dpr, h * dpr);
    };
    resize();
    window.addEventListener('resize', resize);

    const onMouseMove = (e: MouseEvent) => {
      const rect = mount.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      mouseRef.current[0] = (e.clientX - rect.left) / rect.width;
      mouseRef.current[1] = 1.0 - (e.clientY - rect.top) / rect.height; // WebGL uses bottom-left origin
    };
    mount.addEventListener('mousemove', onMouseMove);

    let frameId = 0;
    let isVisible = false;
    let lastT = 0;
    let elapsed = 0;

    const animate = (t: number) => {
      frameId = requestAnimationFrame(animate);
      const dt = lastT === 0 ? 0 : Math.min(t - lastT, 100);
      lastT = t;
      elapsed += dt * 0.001;

      // Smooth mouse
      uniforms.uMouse.value.x += (mouseRef.current[0] - uniforms.uMouse.value.x) * 0.05;
      uniforms.uMouse.value.y += (mouseRef.current[1] - uniforms.uMouse.value.y) * 0.05;
      uniforms.uTime.value = elapsed;

      renderer.render(scene, camera);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible && frameId === 0) {
          lastT = 0;
          frameId = requestAnimationFrame(animate);
        } else if (!isVisible && frameId !== 0) {
          cancelAnimationFrame(frameId);
          frameId = 0;
        }
      },
      { threshold: 0 }
    );
    io.observe(mount);

    return () => {
      materialRef.current = null;
      if (frameId !== 0) cancelAnimationFrame(frameId);
      io.disconnect();
      window.removeEventListener('resize', resize);
      mount.removeEventListener('mousemove', onMouseMove);
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      quad.geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={mountRef} className="w-full h-full" />;
});

// ─────────────────────────────────────────────────────────────────────────────
// ELITE FLUTED SERIES TEMPLATE
// ─────────────────────────────────────────────────────────────────────────────

interface EliteFlutedSeriesTemplateProps {
  initialData?: PanelProduct;
  allShades?: PanelProduct[];
}

export default function EliteFlutedSeriesTemplate({
  initialData,
  allShades = ELITE_FLUTED_WALL_PANELS,
}: EliteFlutedSeriesTemplateProps) {
  const shades = allShades && allShades.length > 0 ? allShades : ELITE_FLUTED_WALL_PANELS;
  const [selectedPanel, setSelectedPanel] = useState<PanelProduct>(shades[0]);
  const [accentColor, setAccentColor] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('custom-theme-color');
      if (saved && saved.startsWith('#')) return saved;
    }
    return '#f59e0b';
  });

  // Space showcase tab state
  const [activeSpaceIndex, setActiveSpaceIndex] = useState<number>(0);

  // Use case category tab state
  const [activeUseCaseTab, setActiveUseCaseTab] = useState<'residential' | 'commercial' | 'professional'>('residential');

  // Trade Hub tab state
  const [activeHubTab, setActiveHubTab] = useState<number>(0);

  // Before / After slider state (0 to 100)
  const [sliderPosition, setSliderPosition] = useState<number>(50);

  // Quote modal state
  const [quoteModalOpen, setQuoteModalOpen] = useState<boolean>(false);
  const [quoteModalSource, setQuoteModalSource] = useState<string>('Elite Fluted Series');
  
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState<boolean>(false);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check once after mount if computed style overrides default
    const saved = localStorage.getItem('custom-theme-color');
    if (!saved) {
      const rootStyle = getComputedStyle(document.documentElement);
      const computed = rootStyle.getPropertyValue('--color-amber-500').trim();
      if (computed && computed.startsWith('#')) {
        requestAnimationFrame(() => setAccentColor(computed));
      }
    }

    const handleThemeColorChange = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (customEvent.detail) {
        setAccentColor(customEvent.detail);
      }
    };

    window.addEventListener('theme-color-changed', handleThemeColorChange);
    return () => {
      window.removeEventListener('theme-color-changed', handleThemeColorChange);
    };
  }, []);

  const handleInspectShadeInShowcase = (code: string) => {
    const target = shades.find((s) => s.code.toLowerCase() === code.toLowerCase());
    if (target) {
      setSelectedPanel(target);
      window.dispatchEvent(
        new CustomEvent('wholesalerji:select-shade', {
          detail: { code: target.code, id: target.id },
        })
      );
      const el = document.getElementById('showcase');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const [activeWheelIndex, setActiveWheelIndex] = useState(0);

  const currentSpace = ELITE_FLUTED_SPACES[activeSpaceIndex] || ELITE_FLUTED_SPACES[0];

  return (
    <div className="w-full bg-white dark:bg-stone-950 text-stone-900 dark:text-stone-100 overflow-x-hidden selection:bg-amber-500 selection:text-stone-950">
      
      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION 1: TOPOGRAPHIC HERO SECTION (PROTECTED)               */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section className="relative w-full h-[100dvh] min-h-[100dvh] flex flex-col justify-between items-center bg-stone-950 text-white overflow-hidden select-none border-b border-stone-800">
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(245,171,64,0.06)_0%,rgba(10,10,10,0.85)_70%,#0a0a0a_100%)] pointer-events-none z-0" />

        {/* Top Minimal Navigation Bar: Breadcrumb */}
        <div className="w-full z-20 pt-5 sm:pt-7 px-4 sm:px-8 lg:px-12 flex justify-between items-center max-w-7xl mx-auto pointer-events-auto">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-mono tracking-wider text-stone-500">
            <Link href="/" className="hover:text-amber-400 transition-colors">
              Home
            </Link>
            <span className="opacity-40">/</span>
            <Link href="/wall-panels" className="hover:text-amber-400 transition-colors">
              Wall Panels
            </Link>
            <span className="opacity-40">/</span>
            <span className="font-bold transition-colors" style={{ color: accentColor }}>
              Elite Fluted
            </span>
          </nav>
        </div>

        {/* Topo Shader Canvas Background (Edge-to-Edge) */}
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
          <TopoShader color={accentColor} />
        </div>

        {/* Center Typography: ONLY ELITE FLUTED */}
        <div className="relative z-10 w-full flex-1 flex flex-col items-center justify-center px-4 text-center pointer-events-none">
          <h1 className="sr-only">Elite Fluted Wall Panels Gurgaon | 9mm WPC Louvers</h1>
          <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-wider uppercase text-transparent bg-clip-text bg-gradient-to-b from-white via-stone-100 to-stone-400 drop-shadow-[0_15px_40px_rgba(0,0,0,0.9)] select-none">
            ELITE FLUTED
          </h2>
        </div>

        {/* Bottom Minimal Scroll Indicator */}
        <div className="w-full z-10 pb-6 sm:pb-8 flex justify-center items-center pointer-events-auto">
          <a
            href="#showcase"
            aria-label="Scroll to collection showcase"
            className="flex flex-col items-center gap-1.5 text-stone-500 hover:text-amber-400 transition-colors group cursor-pointer"
          >
            <span className="text-[10px] font-mono uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-opacity">
              Explore Collection
            </span>
            <div className="w-8 h-8 rounded-full border border-stone-800 bg-stone-900/60 backdrop-blur-md flex items-center justify-center group-hover:border-amber-500/50 transition-colors shadow-lg">
              <svg className="w-3.5 h-3.5 rotate-90 text-stone-400 group-hover:text-amber-400 group-hover:translate-y-0.5 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
          </a>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION 2: PRODUCT SHOWCASE (PROTECTED)                       */}
      {/* ───────────────────────────────────────────────────────────── */}
      <ProductShowcase
        series="elite-fluted"
        allShades={shades}
        title="Elite Fluted Series"
        initialShadeId={initialData?.code || initialData?.id}
        onShadeChange={(shade) => setSelectedPanel(shade)}
        sectionId="showcase"
      />

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION A — THE RHYTHM OF THE WALL (INTERACTIVE HOTSPOTS)     */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section className="relative w-full h-[80vh] min-h-[600px] bg-stone-950 border-b border-stone-800 overflow-hidden">
        {/* Full width panoramic background */}
        <Image
          src="https://res.cloudinary.com/def2qsxjg/image/upload/v1790929841/FP-702_installed_image_in_room.jpg"
          alt="Warm timber-toned fluted wall panels installed as a vertical feature wall"
          fill
          className="object-cover object-center opacity-40 mix-blend-luminosity hover:mix-blend-normal hover:opacity-80 transition-all duration-1000"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent pointer-events-none" />

        <div className="absolute inset-0 max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 flex flex-col justify-end pb-20 pointer-events-none">
          <div className="max-w-3xl pointer-events-auto">
            <h2 className="text-4xl sm:text-6xl font-black tracking-tight text-white mb-6">
              Vertical rhythm. <br />
              <span className="text-amber-500">A wall with dimension.</span>
            </h2>
            <p className="text-stone-300 font-light max-w-xl text-sm sm:text-base leading-relaxed">
              A flat wall is passive; it absorbs room light without contribution. The Elite Fluted profile breaks static drywall monotony by introducing rhythmic vertical grooves that catch natural daylight and directional ceiling illumination.
              <span className="block mt-2 text-xs text-amber-500 font-mono tracking-widest">(HOVER OR TAP HOTSPOTS TO REVEAL)</span>
            </p>
          </div>
        </div>

        {/* Visually hidden but DOM-present SEO content: Why Choose Elite Fluted */}
        <div className="sr-only">
          <h3>Why Choose Elite Fluted Panels</h3>
          <ul>
            {ELITE_FLUTED_WHY_POINTS.map((point, idx) => (
              <li key={idx}>
                <h4>{point.number}. {point.title}</h4>
                <p>{point.description}</p>
                <p>Highlight: {point.stat}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Hotspot 1: Light & Shadow */}
        <div className="absolute top-[30%] left-[20%] sm:left-[30%] group pointer-events-auto">
          <button 
            type="button"
            className="relative w-8 h-8 rounded-full bg-amber-500 text-stone-950 font-bold flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.5)] cursor-pointer z-10 animate-pulse group-hover:animate-none focus:outline-none"
            aria-label="Toggle Light and Shadow details"
          >
            +
          </button>
          <div className="absolute top-1/2 left-10 -translate-y-1/2 w-64 p-4 rounded-2xl bg-stone-900/90 backdrop-blur-md border border-stone-800 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-all duration-300 z-20 translate-x-4 group-hover:translate-x-0 group-focus-within:translate-x-0 shadow-2xl">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-500 mb-1">01. Light & Shadow</h3>
            <p className="text-xs text-stone-300">Shifting shadows that evolve with natural room daylight, calibrated to a rigid 9.0 MM depth.</p>
          </div>
        </div>

        {/* Hotspot 2: Ceiling Lift */}
        <div className="absolute top-[50%] right-[15%] sm:right-[25%] group pointer-events-auto">
          <button 
            type="button"
            className="relative w-8 h-8 rounded-full bg-amber-500 text-stone-950 font-bold flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.5)] cursor-pointer z-10 animate-pulse group-hover:animate-none focus:outline-none"
            aria-label="Toggle Ceiling Lift details"
          >
            +
          </button>
          <div className="absolute top-1/2 right-10 -translate-y-1/2 w-64 p-4 rounded-2xl bg-stone-900/90 backdrop-blur-md border border-stone-800 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-all duration-300 z-20 -translate-x-4 group-hover:translate-x-0 group-focus-within:translate-x-0 shadow-2xl">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-500 mb-1">02. Ceiling Lift</h3>
            <p className="text-xs text-stone-300">Vertical continuity creates an optical illusion of higher ceilings, turning the wall into an architectural sculpture.</p>
          </div>
        </div>

        {/* Hotspot 3: Tactile Finish */}
        <div className="absolute bottom-[25%] left-[40%] sm:left-[50%] group pointer-events-auto">
          <button 
            type="button"
            className="relative w-8 h-8 rounded-full bg-amber-500 text-stone-950 font-bold flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.5)] cursor-pointer z-10 animate-pulse group-hover:animate-none focus:outline-none"
            aria-label="Toggle Tactile Finish details"
          >
            +
          </button>
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-64 p-4 rounded-2xl bg-stone-900/90 backdrop-blur-md border border-stone-800 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-all duration-300 z-20 translate-y-4 group-hover:translate-y-0 group-focus-within:translate-y-0 shadow-2xl">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-500 mb-1">03. Tactile Finish</h3>
            <p className="text-xs text-stone-300">Micro-textured architectural foil with authentic timber warmth.</p>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION B — ONE PROFILE. MANY SPACES. (ACCORDION)             */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section className="w-full px-4 sm:px-8 lg:px-12 py-16 sm:py-24 bg-stone-50 dark:bg-stone-950 border-b border-stone-200 dark:border-stone-800">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-stone-900 dark:text-white">
              One Profile. Many Spaces.
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 max-w-md font-light leading-relaxed mt-4">
              Explore how the single 9MM Elite Fluted profile adapts seamlessly across residential living spaces, executive offices, and hospitality settings.
              <span className="block mt-2 font-mono tracking-widest text-amber-600 dark:text-amber-500">(HOVER OR TAP TO EXPAND)</span>
            </p>
          </div>

          {/* Accordion Container */}
          <div className="flex flex-col lg:flex-row w-full gap-2 lg:h-[500px]">
            {ELITE_FLUTED_SPACES.map((space, idx) => {
              const isActive = activeSpaceIndex === idx;
              return (
                <div 
                  key={space.id}
                  onClick={() => setActiveSpaceIndex(idx)}
                  className={`group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] flex-shrink-0 ${
                    isActive 
                      ? 'h-[320px] sm:h-[360px] lg:h-full lg:flex-[4]' 
                      : 'h-[72px] sm:h-[80px] lg:h-full lg:flex-[1]'
                  }`}
                  tabIndex={0}
                >
                  <Image
                    src={space.image}
                    alt={space.altText}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className={`object-cover transition-transform duration-700 ${isActive ? 'scale-105' : 'scale-100 group-hover:scale-105'}`}
                  />
                  <div className={`absolute inset-0 transition-colors duration-500 ${isActive ? 'bg-gradient-to-t from-stone-950/95 via-stone-950/50 to-transparent' : 'bg-stone-950/60 group-hover:bg-stone-950/40'}`} />
                  
                  {/* Collapsed State Title */}
                  <div className={`absolute inset-0 flex items-end lg:items-center justify-center p-4 lg:p-0 transition-opacity duration-300 ${isActive ? 'opacity-0' : 'opacity-100'}`}>
                    <h3 className="text-white font-bold text-lg lg:-rotate-90 whitespace-nowrap">
                      {space.spaceType}
                    </h3>
                  </div>

                  {/* Expanded State Content */}
                  <div className={`absolute inset-0 p-6 sm:p-8 flex flex-col justify-end transition-opacity duration-500 delay-100 ${isActive ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                    <div className={`transition-transform duration-500 ${isActive ? 'translate-y-0' : 'translate-y-4'}`}>
                      <span className="inline-block px-3 py-1 bg-amber-500 text-stone-950 text-[10px] font-mono font-bold uppercase tracking-widest rounded-full mb-3 shadow-lg">
                        {space.category}
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-black text-white mb-2 leading-tight">{space.title}</h3>
                      <p className="text-stone-200 text-xs sm:text-sm font-light max-w-sm mb-5 line-clamp-3 sm:line-clamp-none leading-relaxed">
                        {space.description}
                      </p>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); handleInspectShadeInShowcase(space.panelCode); }}
                          className="px-5 py-2.5 bg-amber-500 hover:bg-white text-stone-950 rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xl flex items-center gap-2"
                        >
                          <span>Inspect {space.panelCode}</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
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
      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION D — FLUTED PANEL ANATOMY (INTERACTIVE WHEEL)          */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section className="w-full py-10 bg-stone-900 text-stone-100 border-b border-stone-800 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-4">
              Fluted Panel Anatomy
            </h2>
            <p className="text-xs sm:text-sm text-stone-400 font-light leading-relaxed">
              Hover or tap to inspect the engineering behind the 9mm Elite Fluted profile, calibrated for seamless commercial and residential installation.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Visual Wheel Column */}
            <div className="lg:col-span-7 flex items-center justify-center py-10 relative min-h-[500px]">
              
              <div className="relative w-[340px] h-[340px] sm:w-[460px] sm:h-[460px] flex items-center justify-center">
                {/* Rotating Ring / Wheel Container */}
                <div 
                  className="absolute inset-0 rounded-full border border-stone-800/80 transition-transform duration-1000 ease-out scale-[1.04]"
                  style={{ transform: `rotate(-${activeWheelIndex * 45}deg)` }}
                >
                  {/* 8 SVGs distributed evenly on the wheel */}
                  {[
                    { id: 'wpc', Icon: AnimatedLayers, color: 'text-amber-500' },
                    { id: 'water', Icon: AnimatedDroplet, color: 'text-blue-400' },
                    { id: 'foil', Icon: AnimatedSparkle, color: 'text-yellow-400' },
                    { id: 'fire', Icon: AnimatedFlame, color: 'text-red-500' },
                    { id: 'interlock', Icon: AnimatedInterlock, color: 'text-stone-300' },
                    { id: 'eco', Icon: AnimatedLeaf, color: 'text-emerald-400' },
                    { id: 'acoustic', Icon: AnimatedAcoustic, color: 'text-stone-400' },
                    { id: 'weight', Icon: AnimatedFeather, color: 'text-sky-300' },
                  ].map((item, idx) => {
                    const angle = idx * 45;
                    const rad = (angle * Math.PI) / 180;
                    const radius = 50; // 50% from center to edge
                    const top = 50 - Math.cos(rad) * radius;
                    const left = 50 + Math.sin(rad) * radius;
                    const isActive = activeWheelIndex === idx;

                    return (
                      <button
                        key={idx}
                        onClick={() => setActiveWheelIndex(idx)}
                        className={`absolute w-12 h-12 -ml-6 -mt-6 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg border-2 ${isActive ? 'border-stone-900 text-stone-950 scale-125' : 'bg-stone-900 border-stone-700 hover:bg-stone-800 ' + item.color}`}
                        style={{ 
                          top: `${top}%`, 
                          left: `${left}%`,
                          // Counter-rotate the icon so it stays upright
                          transform: `rotate(${activeWheelIndex * 45}deg)`,
                          backgroundColor: isActive ? accentColor : undefined
                        }}
                        aria-label={`View feature ${idx + 1}`}
                      >
                        <item.Icon className="w-5 h-5" />
                      </button>
                    );
                  })}
                </div>

                {/* Central Static Image */}
                <div className="relative w-[220px] h-[220px] sm:w-[300px] sm:h-[300px] rounded-3xl overflow-hidden bg-stone-950 border border-stone-800 shadow-[0_0_50px_rgba(245,158,11,0.05)] z-10 flex items-center justify-center pointer-events-none">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-stone-950 to-stone-950 opacity-50" />
                  <Image
                    src="https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/Fluted_Panel_FP_-_714.png"
                    alt="Elite fluted panel blueprint anatomy"
                    fill
                    sizes="300px"
                    className="object-contain p-4 drop-shadow-[0_0_30px_rgba(245,158,11,0.2)]"
                  />
                </div>
              </div>

            </div>

            {/* Right Side Content (Dynamic based on selected wheel index) */}
            <div className="lg:col-span-5 flex flex-col justify-center">
              <div className="bg-stone-950/70 border border-stone-800 p-8 sm:p-10 rounded-3xl min-h-[220px] flex flex-col justify-center relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-[50px] -mr-10 -mt-10 rounded-full" />
                
                {/* Content matches activeWheelIndex */}
                <div className="grid">
                  {[
                    { title: "WPC Core Engine", desc: "High-density 9mm Wood Polymer Composite core prevents structural warping and maintains absolute dimensional stability under varying temperatures." },
                    { title: "100% Waterproof", desc: "Zero water absorption means no peeling, no swelling, and no dampness. The perfect architectural solution for monsoon-prone walls and basements." },
                    { title: "Architectural Foil", desc: "High-fidelity 3D laminate foil replicating authentic timber grain and natural stone textures. Highly resistant to UV fading and daily scuffs." },
                    { title: "Class B1 Fire Rating", desc: "Self-extinguishing material property complies with commercial fire safety standards, making it ideal for retail showrooms and corporate cabins." },
                    { title: "Seamless Interlock", desc: "Precision tongue-and-groove joint system hides all installation fasteners. Creates an infinite, unbroken fluted facade across any wall width." },
                    { title: "Zero Formaldehyde", desc: "Tested and certified free from toxic emissions. A completely green, eco-friendly product that ensures healthy indoor air quality." },
                    { title: "Acoustic Refraction", desc: "The deep 9mm vertical fluting physically breaks up sound waves, significantly reducing room echo and improving overall acoustic comfort." },
                    { title: "Featherweight Density", desc: "Engineered for large-scale, rapid installation. The optimal weight-to-strength ratio removes the need for heavy machinery or complex framework." }
                  ].map((item, idx) => (
                    <div key={idx} className={`col-start-1 row-start-1 transition-all duration-500 ${activeWheelIndex === idx ? 'opacity-100 translate-x-0 z-10' : 'opacity-0 translate-x-8 pointer-events-none z-0'}`}>
                      <h3 className="text-2xl font-black text-amber-500 mb-3">{item.title}</h3>
                      <p className="text-stone-300 leading-relaxed font-light text-sm">{item.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 mt-8">
                  {[0,1,2,3,4,5,6,7].map(i => (
                    <div key={i} className={`h-1 rounded-full flex-1 transition-colors duration-500 ${activeWheelIndex === i ? 'bg-amber-500' : 'bg-stone-800'}`} />
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Visually hidden SEO content: Anatomy Specs */}
          <div className="sr-only">
            <h3>Technical Specifications</h3>
            <p>Elite Fluted panels are manufactured in-house at our Gurugram facility, with specifications engineered for both direct wholesale buyers and distributor-stocked inventory.</p>
            <dl>
              {ELITE_FLUTED_ANATOMY_SPECS.map((spec, idx) => (
                <div key={idx}>
                  <dt>{spec.label}: {spec.value}</dt>
                  <dd>{spec.detail}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION E — WHERE IT WORKS (BENTO HOVER-REVEAL GRID)            */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section className="w-full px-4 sm:px-8 lg:px-12 py-10 bg-stone-50 dark:bg-stone-950 border-b border-stone-200 dark:border-stone-800">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-stone-900 dark:text-white mb-4">
              Where Fluted Panels Excel
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 font-light leading-relaxed">
              Explore residential room transformations, high-traffic commercial interiors, and professional architect specification requirements.
            </p>
          </div>

            {/* Asymmetrical Bento Grid */}
          <div className="grid grid-cols-2 md:grid-cols-12 grid-rows-[auto] gap-3 sm:gap-6 auto-rows-[auto] md:auto-rows-[250px]">
            {/* Bento Item 1: Residential Accent Wall (Large - spans 8 cols, 2 rows) */}
            <div 
              className="col-span-2 md:col-span-8 md:row-span-2 relative group rounded-3xl overflow-hidden bg-stone-200 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm cursor-zoom-in h-[280px] md:h-full" 
              tabIndex={0}
              onClick={() => setZoomedImage("https://res.cloudinary.com/def2qsxjg/image/upload/v1790929841/FP-702_installed_image_in_room.jpg")}
            >
              <Image
                src="https://res.cloudinary.com/def2qsxjg/image/upload/v1790929841/FP-702_installed_image_in_room.jpg"
                alt="Living Room Accent Wall"
                fill
                sizes="(max-width: 768px) 100vw, 66vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105 group-focus-within:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/20 to-transparent pointer-events-none" />
              
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 transform translate-y-8 group-hover:translate-y-0 group-focus-within:translate-y-0 transition-transform duration-500 pointer-events-none">
                <h3 className="text-2xl sm:text-4xl font-black text-white mb-2">Living Room Accent Wall</h3>
                <p className="text-sm text-stone-300 font-light opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-500 delay-100 line-clamp-2 md:line-clamp-none max-w-lg">
                  Replaces dull painted accent walls behind modular sofas. The vertical 9mm grooves catch daylight grazing from living room balconies, imparting high-end villa warmth.
                </p>
              </div>
            </div>

            {/* Bento Item 2: TV Media Wall (Medium - spans 4 cols, 2 rows) */}
            <div 
              className="col-span-1 md:col-span-4 md:row-span-2 relative group rounded-3xl overflow-hidden bg-stone-950 border border-stone-800 shadow-sm cursor-zoom-in flex flex-col justify-end h-[250px] md:h-full" 
              tabIndex={0}
              onClick={() => setZoomedImage(ELITE_FLUTED_SPACES[1]?.image || "https://res.cloudinary.com/def2qsxjg/image/upload/v1790929841/FP-702_installed_image_in_room.jpg")}
            >
              <Image
                src={ELITE_FLUTED_SPACES[1]?.image || "https://res.cloudinary.com/def2qsxjg/image/upload/v1790929841/FP-702_installed_image_in_room.jpg"}
                alt="TV Media Wall"
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105 group-focus-within:scale-105 opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/95 via-stone-950/40 to-transparent pointer-events-none" />
              
              <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 transform translate-y-0 md:translate-y-8 group-hover:translate-y-0 group-focus-within:translate-y-0 transition-transform duration-500 pointer-events-none">
                <h3 className="text-2xl font-bold text-white mb-2">TV Media Wall</h3>
                <p className="hidden md:block text-xs text-stone-300 font-light opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-500 delay-100">
                  Eliminates harsh glare behind OLED TV screens. Rear hollow channels permit concealed running of HDMI and power cables without wall chipping.
                </p>
              </div>
            </div>

            {/* Bento Item 3: Executive Cabins (Small - spans 4 cols, 1 row) */}
            <div 
              className="col-span-1 md:col-span-4 md:row-span-1 relative group rounded-3xl overflow-hidden bg-stone-200 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm cursor-zoom-in h-[250px] md:h-full" 
              tabIndex={0}
              onClick={() => setZoomedImage("https://res.cloudinary.com/def2qsxjg/image/upload/v1791125624/charcoal_fluted_office_insitu.jpg")}
            >
              <Image
                src="https://res.cloudinary.com/def2qsxjg/image/upload/v1791125624/charcoal_fluted_office_insitu.jpg"
                alt="Executive Cabins"
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105 group-focus-within:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/20 to-transparent pointer-events-none" />
              
              <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 transform translate-y-0 md:translate-y-6 group-hover:translate-y-0 group-focus-within:translate-y-0 transition-transform duration-500 pointer-events-none">
                <h3 className="text-xl font-bold text-white">Executive Cabins</h3>
                <p className="hidden md:block text-xs text-stone-300 font-light mt-2 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-500 delay-100">
                  Projects quiet corporate authority.
                </p>
              </div>
            </div>
            
            {/* Bento Item 4: Retail Showrooms (Wide - spans 8 cols, 1 row) */}
            <div 
              className="col-span-2 md:col-span-8 md:row-span-1 relative group rounded-3xl overflow-hidden bg-stone-900 border border-stone-800 shadow-sm cursor-zoom-in h-[220px] md:h-full" 
              tabIndex={0}
              onClick={() => setZoomedImage(ELITE_FLUTED_SPACES[2]?.image || "https://res.cloudinary.com/def2qsxjg/image/upload/v1790929841/FP-702_installed_image_in_room.jpg")}
            >
              <Image
                src={ELITE_FLUTED_SPACES[2]?.image || "https://res.cloudinary.com/def2qsxjg/image/upload/v1790929841/FP-702_installed_image_in_room.jpg"}
                alt="Retail Showrooms"
                fill
                sizes="(max-width: 768px) 100vw, 66vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105 group-focus-within:scale-105 opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/40 to-transparent pointer-events-none" />

              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 transform translate-y-6 group-hover:translate-y-0 group-focus-within:translate-y-0 transition-transform duration-500 pointer-events-none">
                <h3 className="text-2xl font-bold text-white mb-2">Showrooms & Boutiques</h3>
                <p className="text-xs text-stone-300 font-light opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-500 delay-100 max-w-lg">
                  Ideal backdrop for jewelry showrooms and luxury boutiques. Full CAD profiles & high-res seamless texture maps available for specification.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION F — FLUTED PANEL VS A PLAIN WALL (RADAR CHART)        */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section className="w-full px-4 sm:px-8 lg:px-12 py-10 bg-white dark:bg-stone-900/40 border-b border-stone-200 dark:border-stone-800">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-stone-900 dark:text-white mb-4">
              Fluted Panel vs. A Plain Wall
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 font-light leading-relaxed">
              Compare the visual texture, moisture resistance, and architectural longevity between standard painted drywall and an Elite Fluted feature wall.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
            {/* Left: SVG Radar Chart */}
            <div className="w-full lg:w-1/2 flex flex-col items-center">
              <div className="relative w-full max-w-[400px] aspect-square rounded-full flex items-center justify-center">
                {/* Visual Chart */}
                <svg viewBox="0 0 300 300" className="w-full h-full overflow-visible font-mono text-[8px] uppercase font-bold tracking-widest fill-stone-500 dark:fill-stone-400 drop-shadow-xl">
                  {/* Grid / Web */}
                  <polygon points="150,50 236.6,100 236.6,200 150,250 63.4,200 63.4,100" fill="none" stroke="currentColor" strokeOpacity="0.4" strokeWidth="1.5" />
                  <polygon points="150,75 215,112.5 215,187.5 150,225 85,187.5 85,112.5" fill="none" stroke="currentColor" strokeOpacity="0.4" strokeWidth="1.5" />
                  <polygon points="150,100 193.3,125 193.3,175 150,200 106.7,175 106.7,125" fill="none" stroke="currentColor" strokeOpacity="0.4" strokeWidth="1.5" />
                  <polygon points="150,125 171.6,137.5 171.6,162.5 150,175 128.4,162.5 128.4,137.5" fill="none" stroke="currentColor" strokeOpacity="0.4" strokeWidth="1.5" />
                  
                  {/* Axes Lines */}
                  <line x1="150" y1="150" x2="150" y2="50" stroke="currentColor" strokeOpacity="0.4" strokeWidth="1.5" />
                  <line x1="150" y1="150" x2="236.6" y2="100" stroke="currentColor" strokeOpacity="0.4" strokeWidth="1.5" />
                  <line x1="150" y1="150" x2="236.6" y2="200" stroke="currentColor" strokeOpacity="0.4" strokeWidth="1.5" />
                  <line x1="150" y1="150" x2="150" y2="250" stroke="currentColor" strokeOpacity="0.4" strokeWidth="1.5" />
                  <line x1="150" y1="150" x2="63.4" y2="200" stroke="currentColor" strokeOpacity="0.4" strokeWidth="1.5" />
                  <line x1="150" y1="150" x2="63.4" y2="100" stroke="currentColor" strokeOpacity="0.4" strokeWidth="1.5" />

                  {/* Labels */}
                  <text x="150" y="40" textAnchor="middle" className="text-stone-900 dark:text-stone-300">Moisture Res</text>
                  <text x="245" y="95" textAnchor="start" className="text-stone-900 dark:text-stone-300">Acoustics</text>
                  <text x="245" y="210" textAnchor="start" className="text-stone-900 dark:text-stone-300">Impact Res</text>
                  <text x="150" y="265" textAnchor="middle" className="text-stone-900 dark:text-stone-300">Speed</text>
                  <text x="55" y="210" textAnchor="end" className="text-stone-900 dark:text-stone-300">Visual Depth</text>
                  <text x="55" y="95" textAnchor="end" className="text-stone-900 dark:text-stone-300">Lifespan</text>

                  {/* Data 1: Plain Wall */}
                  <polygon points="150,130 158.66,145 175.98,165 150,190 141.34,155 124.02,135" fill="currentColor" fillOpacity="0.6" stroke="currentColor" strokeWidth="2.5" className="text-stone-500 dark:text-stone-400" />
                  
                  {/* Data 2: Elite Fluted */}
                  <polygon points="150,50 223.61,107.5 227.94,195 150,245 63.4,200 67.73,102.5" fill="currentColor" fillOpacity="0.6" stroke="currentColor" strokeWidth="3" className="text-amber-500" />
                </svg>
              </div>

              {/* Chart Legend */}
              <div className="flex items-center justify-center gap-6 mt-8 text-xs font-mono font-bold uppercase tracking-wider">
                <div className="flex items-center gap-2 text-stone-500 dark:text-stone-400">
                  <div className="w-3 h-3 rounded-sm bg-stone-300 dark:bg-stone-700 border border-stone-400" />
                  <span>Plain Wall</span>
                </div>
                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-500">
                  <div className="w-3 h-3 rounded-sm bg-amber-500/40 border border-amber-500" />
                  <span>Elite Fluted</span>
                </div>
              </div>
            </div>

            {/* Right: Narrative Comparison & SEO Table */}
            <div className="w-full lg:w-1/2">
              <h3 className="text-2xl font-bold text-stone-900 dark:text-white mb-6">Beyond Aesthetics.</h3>
              <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed mb-6">
                While a painted wall offers a blank slate, it remains two-dimensional, requires biennial maintenance, and is highly susceptible to monsoon seepage and scuff marks. The Elite Fluted profile introduces architectural depth while sealing the wall behind a waterproof, impact-resistant composite shield.
              </p>

              {/* Visually hidden but DOM-present SEO Table for crawlers */}
              <div className="sr-only">
                <table>
                  <caption>Comparison: Standard Plain Wall vs. Elite Fluted Series (9MM)</caption>
                  <thead>
                    <tr>
                      <th scope="col">Performance Metric</th>
                      <th scope="col">Standard Plain Wall</th>
                      <th scope="col">Elite Fluted Series (9MM)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ELITE_FLUTED_COMPARISON.map((row, i) => (
                      <tr key={i}>
                        <th scope="row">{row.feature}</th>
                        <td>{row.plainWall}</td>
                        <td>{row.eliteFluted}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Visible Highlights List */}
              <ul className="space-y-4 border-t border-stone-200 dark:border-stone-800 pt-6">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-amber-500 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-stone-900 dark:text-white">Zero-Mess Installation</h4>
                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">Interlocking panels install over raw brick or old paint in hours, bypassing wet cement or putty.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-amber-500 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-stone-900 dark:text-white">Acoustic Refraction</h4>
                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">Deep 9mm grooves break up sound waves, significantly reducing echo in minimalist living spaces.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-amber-500 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-stone-900 dark:text-white">Immune to Monsoon Peeling</h4>
                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">100% waterproof WPC core ensures the finish never bubbles or flakes like traditional wall paint.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>


      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION H — PROFESSIONAL BUYER PATHWAYS (SPEC CARDS UI)       */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section className="w-full px-4 sm:px-8 lg:px-12 py-10 bg-white dark:bg-stone-900/20 border-b border-stone-200 dark:border-stone-800 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-stone-900 dark:text-white mb-4">
              Professional Trade Hub
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 font-light leading-relaxed">
              As a direct manufacturer of architectural wall panels, we serve architects, contractors, and retail dealers with dedicated B2B pathways, direct factory invoicing, and pan-India containerized dispatch from our Gurugram facility.
            </p>
          </div>

          {/* Interactive Trade Hub UI - Sleek Dashboard Vertical Tabs */}
          <div className="flex flex-col lg:flex-row gap-6 mb-16 h-auto lg:h-[550px]">
            {/* Sidebar Tabs */}
            <div className="w-full lg:w-1/3 flex flex-col gap-3">
              {ELITE_FLUTED_PERSONAS.map((persona, i) => {
                const isActive = activeHubTab === i;
                return (
                  <button
                    key={i}
                    onClick={() => setActiveHubTab(i)}
                    className={`flex-1 flex items-center justify-between p-5 xl:p-6 rounded-3xl border transition-all duration-300 text-left overflow-hidden ${
                      isActive 
                        ? 'bg-stone-900 border-stone-800 shadow-xl scale-[1.02]' 
                        : 'bg-stone-100 dark:bg-stone-900/40 border-stone-200 dark:border-stone-800/50 hover:bg-stone-200 dark:hover:bg-stone-900 hover:border-stone-300 dark:hover:border-stone-700'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors duration-300 ${isActive ? 'bg-amber-500 text-stone-950' : 'bg-stone-300 dark:bg-stone-800 text-stone-600 dark:text-stone-400'}`}>
                        {i === 0 ? <Briefcase className="w-5 h-5" /> : i === 1 ? <Layers className="w-5 h-5" /> : <Building2 className="w-5 h-5" />}
                      </div>
                      <div>
                        <h3 className={`text-xl font-black mb-1 transition-colors ${isActive ? 'text-white' : 'text-stone-900 dark:text-white'}`}>
                          {persona.role}
                        </h3>
                        <p className={`text-[10px] sm:text-xs font-mono transition-colors ${isActive ? 'text-amber-500' : 'text-stone-500 dark:text-stone-400'}`}>
                          {persona.tagline}
                        </p>
                      </div>
                    </div>
                    {isActive && <ArrowRight className="w-5 h-5 text-amber-500 hidden sm:block shrink-0 ml-2" />}
                  </button>
                );
              })}
            </div>

            {/* Main Content Area (Glassmorphism Window) */}
            <div className="w-full lg:w-2/3 h-full min-h-[550px] sm:min-h-[500px] lg:min-h-0 relative rounded-3xl overflow-hidden bg-stone-950 border border-stone-800 shadow-2xl flex flex-col justify-end group">
              {ELITE_FLUTED_PERSONAS.map((persona, i) => {
                const isActive = activeHubTab === i;
                return (
                  <div
                    key={i}
                    className={`absolute inset-0 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] flex flex-col justify-end p-6 md:p-10 ${
                      isActive ? 'opacity-100 translate-x-0 z-10' : 'opacity-0 translate-x-12 z-0 pointer-events-none'
                    }`}
                  >
                    {/* Background Image */}
                    <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
                      <Image 
                        src={i === 0 ? ELITE_FLUTED_SPACES[0]?.image || "https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/Fluted_Panel_FP_-_714.png" : i === 1 ? "https://res.cloudinary.com/def2qsxjg/image/upload/v1790929841/FP-702_installed_image_in_room.jpg" : "https://res.cloudinary.com/def2qsxjg/image/upload/v1791125624/charcoal_fluted_office_insitu.jpg"}
                        alt={persona.role}
                        fill
                        className="object-cover opacity-40 mix-blend-overlay group-hover:scale-105 transition-transform duration-1000"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-stone-950/95 via-stone-950/60 to-transparent" />
                      <div className="absolute inset-0 bg-gradient-to-r from-stone-950/80 via-transparent to-transparent hidden md:block" />
                    </div>
                    
                    <div className="relative z-10 max-w-xl">
                      <h4 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mb-3">
                        {persona.role} Portal
                      </h4>
                      <p className="text-sm text-stone-300 font-light mb-6 leading-relaxed line-clamp-2 sm:line-clamp-none">
                        {persona.description}
                        {i === 2 && (
                          <span className="block mt-2">
                            We work with distributors and dealers across North India who stock our Elite Fluted range for regional resale and project supply.
                          </span>
                        )}
                      </p>
                      
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                        {persona.perks.map((perk, idx) => (
                          <li key={idx} className="flex items-center gap-3 text-xs text-stone-200 font-medium bg-stone-900/60 backdrop-blur-sm p-3 rounded-xl border border-stone-800/50 hover:border-amber-500/50 transition-colors">
                            <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                            <span className="truncate">{perk}</span>
                          </li>
                        ))}
                      </ul>

                      <a
                        href={`https://wa.me/919999999999?text=${encodeURIComponent(persona.whatsappMessage)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs uppercase tracking-widest hover:bg-white transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 w-full sm:w-auto"
                      >
                        <Phone className="w-4 h-4" />
                        <span>{persona.ctaText}</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Minimal Logistics Bar */}
          <div className="bg-stone-950 rounded-3xl p-6 sm:p-8 border border-stone-800 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
            <div className="absolute -left-20 -top-20 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex-1 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left z-10 relative">
              <div className="w-16 h-16 rounded-2xl bg-stone-900 border border-stone-800 flex items-center justify-center text-amber-500 shrink-0 mx-auto sm:mx-0">
                <Truck className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white mb-1">Gurugram Hub Dispatch</h4>
                <p className="text-xs text-stone-400 font-light max-w-xl">
                  Local 2-hour dispatch across DLF Phase 1–5 & Sohna Road. Scheduled 24-hour delivery for Delhi NCR. Pan-India containerized freight to metros within 72 hours.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4 shrink-0 z-10 relative mx-auto md:mx-0">
              <div className="text-center px-4 border-r border-stone-800">
                <div className="text-xl font-black text-white">2H</div>
                <div className="text-[10px] font-mono text-stone-500 uppercase tracking-widest">Local</div>
              </div>
              <div className="text-center px-4 border-r border-stone-800">
                <div className="text-xl font-black text-white">24H</div>
                <div className="text-[10px] font-mono text-stone-500 uppercase tracking-widest">NCR</div>
              </div>
              <div className="text-center px-4">
                <div className="text-xl font-black text-white">72H</div>
                <div className="text-[10px] font-mono text-stone-500 uppercase tracking-widest">India</div>
              </div>
            </div>
          </div>

          {/* Visually hidden SEO content: Buyer Steps */}
          <div className="sr-only">
            <h3>Installation & Procurement Workflow</h3>
            <ol>
              {ELITE_FLUTED_BUYER_STEPS.map((step, idx) => (
                <li key={idx}>
                  <h4>Step {step.step}: {step.title}</h4>
                  <p>{step.description}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION J — FLUTED PANEL FAQ ACCORDION                        */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section id="faq" className="w-full px-4 sm:px-8 lg:px-12 py-10 bg-stone-50 dark:bg-stone-950 border-b border-stone-200 dark:border-stone-800">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-stone-900 dark:text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 font-light leading-relaxed">
              Clear, transparent answers regarding dimensions, moisture resistance, installation methods, and wholesale ordering.
            </p>
          </div>

          <div className="space-y-4">
            {ELITE_FLUTED_FAQS.map((faq) => {
              const isOpen = openFaqId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/60 overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                    aria-expanded={isOpen}
                  >
                    <span className="text-sm sm:text-base font-bold text-stone-900 dark:text-white pr-2">
                      {faq.question}
                    </span>
                    <span className="w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center flex-shrink-0 text-stone-500">
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </span>
                  </button>

                  <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                    <div className="overflow-hidden">
                      <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-stone-600 dark:text-stone-300 font-light leading-relaxed border-t border-stone-100 dark:border-stone-800/80">
                        {faq.answer}
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
      {/* SECTION K — SISTER & COMPLEMENTARY COLLECTIONS                */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section className="w-full px-4 sm:px-8 lg:px-12 py-10 bg-white dark:bg-stone-900/40 border-b border-stone-200 dark:border-stone-800">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-stone-900 dark:text-white">
                Complementary Collections
              </h2>
            </div>
            <Link
              href="/wall-panels"
              className="text-xs font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1.5"
            >
              <span>Explore All Wall Panels</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {ELITE_FLUTED_SISTER_COLLECTIONS.map((sister) => (
              <Link
                key={sister.id}
                href={sister.href}
                className="group rounded-3xl overflow-hidden bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-amber-500/50 transition-all duration-300 flex flex-col shadow-sm hover:shadow-xl"
              >
                <div className="relative w-full h-56 bg-stone-200 dark:bg-stone-950 overflow-hidden">
                  <Image
                    src={sister.image}
                    alt={`${sister.name} architectural wall cladding collection`}
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-stone-950/80 backdrop-blur-md text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider border border-amber-500/20">
                    {sister.badge}
                  </div>
                </div>

                <div className="p-6 flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="text-lg font-bold text-stone-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors mb-1">
                      {sister.name}
                    </h3>
                    <p className="text-xs text-stone-500 dark:text-stone-400 font-light mb-4">
                      {sister.tagline}
                    </p>
                  </div>
                  <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-stone-400 block uppercase">Wholesale Price</span>
                      <span className="text-sm font-bold text-stone-900 dark:text-white">{sister.price}</span>
                    </div>
                    <span className="text-xs font-mono text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      <span>View</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION L — PROCUREMENT CTA & WHATSAPP DESK                   */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section
        id="procurement-desk"
        className="w-full px-4 sm:px-8 lg:px-12 py-10 bg-gradient-to-b from-stone-100 to-amber-50/30 dark:from-stone-900 dark:to-stone-950 text-stone-900 dark:text-white relative overflow-hidden border-t border-stone-200 dark:border-stone-800"
      >
        <div className="max-w-4xl mx-auto relative z-10 text-center mb-8">
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-stone-900 dark:text-white mb-6">
            Have an Architectural Project in Mind?
          </h2>
          <p className="text-stone-600 dark:text-stone-400 font-light max-w-2xl mx-auto text-sm sm:text-base leading-relaxed mb-10">
            Connect with our technical procurement desk in Gurgaon. Request mill-direct box pricing, physical timber louver swatch deliveries, or custom project estimations.
          </p>

          {/* Animated Procurement Button (Ring) */}
          <div className="flex justify-center items-center pointer-events-auto">
            <button
              type="button"
              onClick={() => setIsInquiryModalOpen(true)}
              aria-label="Open Procurement Options"
              className="group relative flex items-center justify-center w-32 h-32 sm:w-40 sm:h-40 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-full"
            >
              {/* Spinning Rings */}
              <div className="absolute inset-0 rounded-full border-[3px] border-dashed border-amber-500/40 animate-[spin_8s_linear_infinite] group-hover:border-red-500/80 group-hover:animate-[spin_4s_linear_infinite] transition-colors duration-500" />
              <div className="absolute inset-2 rounded-full border-[2px] border-dotted border-amber-400/50 animate-[spin_12s_linear_infinite_reverse] group-hover:border-red-400/70 transition-colors duration-500" />
              
              {/* Ambient Warm Glow */}
              <div className="absolute inset-0 rounded-full bg-amber-500/10 blur-xl group-hover:bg-red-500/30 transition-colors duration-700" />
              
              {/* Center Core */}
              <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-stone-900/90 backdrop-blur-md border border-stone-800/80 flex flex-col items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.2)] group-hover:shadow-[0_0_40px_rgba(239,68,68,0.4)] group-hover:border-red-500/30 transition-all duration-500">
                <span className="text-xs sm:text-sm font-mono font-black uppercase tracking-widest text-amber-500 group-hover:text-red-400 transition-colors">
                  Contact
                </span>
                <svg className="w-5 h-5 sm:w-6 sm:h-6 mt-1.5 text-stone-400 group-hover:text-red-400 transition-colors animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
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
          aria-labelledby="fluted-modal-title"
          className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md animate-in fade-in duration-200"
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
              <h3 id="fluted-modal-title" className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Get Free Sample &amp; Quote
              </h3>
              <p className="text-xs sm:text-sm text-stone-400 mt-1 leading-relaxed">
                Choose how you would like to connect for {selectedPanel.code} ({selectedPanel.name}) factory rates, free swatches, or project estimates.
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
                      body: JSON.stringify({ source: 'elite-fluted-inquiry-whatsapp', panel: selectedPanel.code }),
                    }).catch(() => {});
                  } catch {}
                  const msg = `Hi WholesalerJi, I want to inquire about Elite Fluted 9mm WPC Panels (${selectedPanel.code} - ${selectedPanel.name}) wholesale rates and delivery in Gurgaon/Delhi NCR.`;
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
                  const el = document.getElementById('showcase');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth' });
                  }
                  setTimeout(() => {
                    setQuoteModalOpen(true);
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
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* GET QUOTE / SAMPLE POPUP MODAL                                */}
      {/* ───────────────────────────────────────────────────────────── */}
      <GetQuoteModal
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
        activePanel={selectedPanel}
        allPanels={shades}
        seriesLabel="Elite Fluted 9mm Wall Panels"
        source={quoteModalSource}
      />

      {/* ───────────────────────────────────────────────────────────── */}
      {/* FULLSCREEN IMAGE ZOOM MODAL                                     */}
      {/* ───────────────────────────────────────────────────────────── */}
      {zoomedImage && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 cursor-zoom-out backdrop-blur-sm"
          onClick={() => setZoomedImage(null)}
        >
          <div className="relative w-full max-w-6xl h-[85vh] rounded-2xl overflow-hidden">
            <Image
              src={zoomedImage}
              alt="Zoomed detailed view"
              fill
              sizes="100vw"
              className="object-contain"
            />
            <button 
              className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/80 transition-colors backdrop-blur-md border border-white/10"
              onClick={(e) => { e.stopPropagation(); setZoomedImage(null); }}
              aria-label="Close zoomed image"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
