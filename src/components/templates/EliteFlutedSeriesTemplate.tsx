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
  Calculator,
  Truck,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from 'lucide-react';

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

  // Before / After slider state (0 to 100)
  const [sliderPosition, setSliderPosition] = useState<number>(50);

  // Estimator calculator state
  const [calcWidth, setCalcWidth] = useState<number>(10);
  const [calcHeight, setCalcHeight] = useState<number>(9.5);

  // FAQ accordion state
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq-1');

  // Quote modal state
  const [quoteModalOpen, setQuoteModalOpen] = useState<boolean>(false);
  const [quoteModalSource, setQuoteModalSource] = useState<string>('Elite Fluted Series');

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

  // Calculator outputs
  const safeWidth = Math.max(1, isNaN(calcWidth) ? 1 : calcWidth);
  const safeHeight = Math.max(1, isNaN(calcHeight) ? 1 : calcHeight);
  const totalSqFt = Math.round(safeWidth * safeHeight * 10) / 10;
  const rawPanels = Math.ceil(totalSqFt / 9.52);
  const recommendedPanels = Math.ceil(rawPanels * 1.1); // 10% cutting wastage
  const boxesNeeded = Math.ceil(recommendedPanels / 10);
  const estimatedWholesaleCost = recommendedPanels * 599;
  const estimatedRetailCost = recommendedPanels * 1290;
  const estimatedSavings = estimatedRetailCost - estimatedWholesaleCost;

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
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-wider uppercase text-transparent bg-clip-text bg-gradient-to-b from-white via-stone-100 to-stone-400 drop-shadow-[0_15px_40px_rgba(0,0,0,0.9)] select-none">
            ELITE FLUTED
          </h1>
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
      {/* SECTION A — THE RHYTHM OF THE WALL                            */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section className="w-full px-4 sm:px-8 lg:px-12 py-20 sm:py-28 bg-stone-900 text-stone-100 border-b border-stone-800 relative overflow-hidden">
        {/* Subtle background vertical flute rhythm lines */}
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: 'repeating-linear-gradient(90deg, #ffffff 0, #ffffff 1px, transparent 1px, transparent 24px)',
          }}
        />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center relative z-10">
          {/* Left Column: Close-up Immersive Panel Visual */}
          <div className="lg:col-span-6 flex flex-col items-center">
            <div className="relative w-full max-w-md h-[460px] sm:h-[540px] rounded-3xl overflow-hidden shadow-2xl border border-stone-800 bg-stone-950 group">
              <Image
                src="https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/Fluted_Panel_FP_-_714.png"
                alt="Elite fluted panel texture close-up showing 9mm architectural vertical groove depth and timber grain"
                fill
                sizes="(max-width: 768px) 100vw, 500px"
                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent opacity-80" />
              
              {/* Overlay Flute Spec Tag */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-stone-900/90 backdrop-blur-md border border-stone-700/60 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 block font-bold">
                    Profile Gauge
                  </span>
                  <p className="text-sm font-bold text-white">9MM Deep Shadow Louvers</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-stone-400 block">
                    Width Ratio
                  </span>
                  <p className="text-sm font-mono text-stone-200">300 MM Interlock</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Typography */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-500 mb-3 block">
              [ THE RHYTHM OF THE WALL ]
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-6 leading-tight">
              Vertical rhythm. <br />
              Architectural depth. <br />
              <span className="text-stone-400">A wall with dimension.</span>
            </h2>
            <p className="text-sm sm:text-base text-stone-300 font-light leading-relaxed mb-6">
              A flat wall is passive; it absorbs room light without contribution. The Elite Fluted profile breaks static drywall monotony by introducing rhythmic vertical grooves that catch natural daylight and directional ceiling illumination.
            </p>
            <p className="text-sm sm:text-base text-stone-400 font-light leading-relaxed mb-8">
              Calibrated to a rigid 9.0 MM depth, each flute casts a sharp, linear shadow-line that stretches floor-to-ceiling. Whether installed as an expansive living room feature or a focused TV backdrop, the wall becomes an architectural sculpture of tactile wood tones and architectural warmth.
            </p>

            {/* 3 Micro-Attributes */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-stone-800">
              <div>
                <span className="text-xl font-black text-amber-400 block font-mono">01</span>
                <h3 className="text-xs font-bold uppercase tracking-wider text-white mt-1">Light & Shadow</h3>
                <p className="text-xs text-stone-400 mt-1 leading-relaxed">Shifting shadows that evolve with natural room daylight.</p>
              </div>
              <div>
                <span className="text-xl font-black text-amber-400 block font-mono">02</span>
                <h3 className="text-xs font-bold uppercase tracking-wider text-white mt-1">Ceiling Lift</h3>
                <p className="text-xs text-stone-400 mt-1 leading-relaxed">Vertical continuity creates an optical illusion of higher ceilings.</p>
              </div>
              <div>
                <span className="text-xl font-black text-amber-400 block font-mono">03</span>
                <h3 className="text-xs font-bold uppercase tracking-wider text-white mt-1">Tactile Finish</h3>
                <p className="text-xs text-stone-400 mt-1 leading-relaxed">Micro-textured architectural foil with authentic timber warmth.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION B — ONE PROFILE. MANY SPACES. (MAGAZINE SHOWCASE)     */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section className="w-full px-4 sm:px-8 lg:px-12 py-20 sm:py-28 bg-stone-50 dark:bg-stone-950 border-b border-stone-200 dark:border-stone-800">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-600 dark:text-amber-500 mb-2 block">
                [ SPATIAL ARCHITECTURE ]
              </span>
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-stone-900 dark:text-white">
                One Profile. Many Spaces.
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 max-w-md font-light leading-relaxed">
              Explore how the single 9MM Elite Fluted profile adapts seamlessly across residential living spaces, executive offices, and hospitality settings.
            </p>
          </div>

          {/* Space Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
            {ELITE_FLUTED_SPACES.map((space, idx) => (
              <button
                key={space.id}
                onClick={() => setActiveSpaceIndex(idx)}
                className={`px-4 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  activeSpaceIndex === idx
                    ? 'bg-stone-900 dark:bg-white text-white dark:text-stone-900 shadow-md scale-105'
                    : 'bg-stone-200/80 dark:bg-stone-900 text-stone-600 dark:text-stone-400 hover:bg-stone-300 dark:hover:bg-stone-800'
                }`}
              >
                {space.spaceType}
              </button>
            ))}
          </div>

          {/* Active Space Magazine Display */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center bg-white dark:bg-stone-900/60 p-6 sm:p-10 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xl">
            {/* Visual Column */}
            <div className="lg:col-span-7 relative h-[380px] sm:h-[480px] w-full rounded-2xl overflow-hidden bg-stone-200 dark:bg-stone-950 shadow-inner group">
              <Image
                src={currentSpace.image}
                alt={currentSpace.altText}
                fill
                sizes="(max-width: 1024px) 100vw, 700px"
                className="object-cover object-center transition-all duration-700 ease-out group-hover:scale-105"
                priority
              />
              <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-stone-950/80 backdrop-blur-md text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold border border-amber-500/30">
                {currentSpace.category} • {currentSpace.keyFeature}
              </div>
            </div>

            {/* Content Column */}
            <div className="lg:col-span-5 flex flex-col justify-between h-full">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-stone-400 dark:text-stone-500 block mb-2">
                  Space 0{activeSpaceIndex + 1} of 0{ELITE_FLUTED_SPACES.length}
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white mb-2">
                  {currentSpace.title}
                </h3>
                <h4 className="text-sm font-semibold text-amber-600 dark:text-amber-400 mb-4">
                  {currentSpace.headline}
                </h4>
                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 font-light leading-relaxed mb-6">
                  {currentSpace.description}
                </p>

                <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 mb-6">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-stone-500">Specified Shade:</span>
                    <span className="font-bold text-stone-900 dark:text-white">{currentSpace.panelCode} — {currentSpace.panelName}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono mt-2 pt-2 border-t border-stone-200 dark:border-stone-800/80">
                    <span className="text-stone-500">Core Performance:</span>
                    <span className="text-amber-600 dark:text-amber-400 font-semibold">{currentSpace.keyFeature}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => handleInspectShadeInShowcase(currentSpace.panelCode)}
                  className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-md flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <span>Inspect {currentSpace.panelCode} in Showcase</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    setQuoteModalSource(`Spatial Showcase: ${currentSpace.title} (${currentSpace.panelCode})`);
                    setQuoteModalOpen(true);
                  }}
                  className="px-4 py-3 rounded-xl border border-stone-300 dark:border-stone-700 hover:border-amber-500 text-stone-800 dark:text-stone-200 font-semibold text-xs tracking-wider transition-colors cursor-pointer"
                >
                  Request Sample
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION C — WHY FLUTED? (PRACTICAL ARCHITECTURAL ADVANTAGES)  */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section className="w-full px-4 sm:px-8 lg:px-12 py-20 sm:py-28 bg-white dark:bg-stone-900/30 border-b border-stone-200 dark:border-stone-800 relative">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-600 dark:text-amber-500 mb-2 block">
              [ DESIGN RATIONALE ]
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-stone-900 dark:text-white mb-4">
              Why Architectural Fluting?
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 font-light leading-relaxed">
              Interior designers and architects specify fluted wall panels not as mere decorative ornaments, but to solve fundamental spatial, lighting, and moisture challenges in contemporary buildings.
            </p>
          </div>

          {/* 5 Architectural Reason Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ELITE_FLUTED_WHY_POINTS.map((reason) => (
              <div
                key={reason.number}
                className="p-8 rounded-3xl bg-stone-50 dark:bg-stone-900/80 border border-stone-200/80 dark:border-stone-800 hover:border-amber-500/50 transition-all duration-300 flex flex-col justify-between group shadow-sm hover:shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-3xl font-black font-mono text-stone-300 dark:text-stone-700 group-hover:text-amber-500 transition-colors">
                      {reason.number}
                    </span>
                    <span className="px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold border border-amber-500/20">
                      {reason.stat}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-3">
                    {reason.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 font-light leading-relaxed">
                    {reason.description}
                  </p>
                </div>
              </div>
            ))}

            {/* 6th Card: Verified Technical Certification Summary */}
            <div className="p-8 rounded-3xl bg-stone-900 text-white border border-stone-800 flex flex-col justify-between shadow-xl">
              <div>
                <div className="flex items-center gap-2 mb-4 text-amber-400">
                  <ShieldCheck className="w-6 h-6" />
                  <span className="text-xs font-mono font-bold uppercase tracking-widest">
                    Verified Quality
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-3">
                  Tested Composite Performance
                </h3>
                <ul className="space-y-2 text-xs text-stone-300">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                    <span>Class B1 Self-Extinguishing Flame Retardant</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                    <span>0.0% Water Absorption (Seelan Barrier)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                    <span>Zero Edible Cellulose (100% Termite Proof)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                    <span>Zero Formaldehyde Off-Gassing (Safe Indoors)</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-stone-800">
                <a
                  href="https://wa.me/919999999999?text=Please%20send%20technical%20compliance%20certificates%20for%20Elite%20Fluted%20Panels"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-mono font-bold text-amber-400 hover:text-amber-300 inline-flex items-center gap-1.5"
                >
                  <span>Request Compliance Test Reports</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION D — FLUTED PANEL ANATOMY (BLUEPRINT SPECIFICATION)    */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section className="w-full px-4 sm:px-8 lg:px-12 py-20 sm:py-28 bg-stone-900 text-stone-100 border-b border-stone-800 relative">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-400 mb-2 block">
              [ TECHNICAL SPECIFICATION ]
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-4">
              Fluted Panel Anatomy
            </h2>
            <p className="text-xs sm:text-sm text-stone-400 font-light leading-relaxed">
              Every curve, bevel, and tongue-and-groove tolerance of the 9mm Elite Fluted panel is calibrated for seamless commercial and residential installation.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Visual Panel Callout Column */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="relative w-full max-w-sm h-[480px] sm:h-[560px] rounded-3xl overflow-hidden bg-stone-950 border border-stone-800 shadow-2xl p-6 flex flex-col items-center justify-between">
                <div className="w-full text-center border-b border-stone-800 pb-3">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold block">
                    Profile Drawing FP-714
                  </span>
                  <p className="text-xs text-stone-400">Scale 1:1 Architectural Flute</p>
                </div>

                <div className="relative w-full h-[360px] my-auto">
                  <Image
                    src="https://res.cloudinary.com/dcezlxt8r/image/upload/f_auto,q_auto/Fluted_Panel_FP_-_714.png"
                    alt="Elite fluted panel blueprint anatomy showing 300mm module width and 9mm profile thickness"
                    fill
                    sizes="350px"
                    className="object-contain"
                  />
                </div>

                <div className="w-full pt-3 border-t border-stone-800 flex justify-between text-[11px] font-mono text-stone-400">
                  <span>W: 300 MM</span>
                  <span className="text-amber-400 font-bold">H: 2950 MM</span>
                  <span>T: 9.0 MM</span>
                </div>
              </div>
            </div>

            {/* Specification Callouts Grid */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {ELITE_FLUTED_ANATOMY_SPECS.map((spec, i) => (
                <div
                  key={i}
                  className="p-5 rounded-2xl bg-stone-950/70 border border-stone-800 hover:border-amber-500/40 transition-colors"
                >
                  <span className="text-[10px] font-mono uppercase tracking-widest text-stone-400 block mb-1">
                    {spec.label}
                  </span>
                  <h4 className="text-sm font-bold text-white mb-2">
                    {spec.value}
                  </h4>
                  <p className="text-xs text-stone-400 font-light leading-relaxed">
                    {spec.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION E — WHERE IT WORKS (HIGH-INTENT SEARCH USE CASES)     */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section className="w-full px-4 sm:px-8 lg:px-12 py-20 sm:py-28 bg-stone-50 dark:bg-stone-950 border-b border-stone-200 dark:border-stone-800">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-600 dark:text-amber-500 mb-2 block">
              [ HIGH-INTENT APPLICATIONS ]
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-stone-900 dark:text-white mb-4">
              Where Fluted Panels Excel
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 font-light leading-relaxed">
              Explore residential room transformations, high-traffic commercial interiors, and professional architect specification requirements.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex justify-center gap-3 mb-10">
            {[
              { id: 'residential', label: 'Residential Interiors', icon: Home },
              { id: 'commercial', label: 'Commercial & Office', icon: Building2 },
              { id: 'professional', label: 'Architect & Contractor', icon: Briefcase },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveUseCaseTab(tab.id as 'residential' | 'commercial' | 'professional')}
                  className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all duration-200 cursor-pointer ${
                    activeUseCaseTab === tab.id
                      ? 'bg-amber-500 text-stone-950 shadow-lg scale-105'
                      : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-800 hover:border-amber-500'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content Display */}
          {activeUseCaseTab === 'residential' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-8 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-amber-600 dark:text-amber-400 font-bold block mb-2">
                    LIVING ROOM ACCENT WALL
                  </span>
                  <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-3">
                    Fluted Panels for Living Room
                  </h3>
                  <p className="text-xs text-stone-600 dark:text-stone-400 font-light leading-relaxed mb-4">
                    Replaces dull painted accent walls behind modular sofas. The vertical 9mm grooves catch daylight grazing from living room balconies, imparting high-end villa warmth.
                  </p>
                </div>
                <div className="pt-4 border-t border-stone-200 dark:border-stone-800 text-xs font-mono text-stone-500">
                  Recommended: FP-714 (Premium Wood) or FP-716
                </div>
              </div>

              <div className="p-8 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-amber-600 dark:text-amber-400 font-bold block mb-2">
                    TV MEDIA WALL
                  </span>
                  <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-3">
                    Fluted TV Wall Panels
                  </h3>
                  <p className="text-xs text-stone-600 dark:text-stone-400 font-light leading-relaxed mb-4">
                    Eliminates harsh glare behind OLED TV screens. Rear hollow channels permit concealed running of HDMI and power cables without wall chipping or masonry grooving.
                  </p>
                </div>
                <div className="pt-4 border-t border-stone-200 dark:border-stone-800 text-xs font-mono text-stone-500">
                  Recommended: FP-717 (Architectural Wood) or FP-722
                </div>
              </div>

              <div className="p-8 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-amber-600 dark:text-amber-400 font-bold block mb-2">
                    BEDROOM HEADBOARD
                  </span>
                  <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-3">
                    Fluted Panels for Bedroom
                  </h3>
                  <p className="text-xs text-stone-600 dark:text-stone-400 font-light leading-relaxed mb-4">
                    Zero volatile organic compound (VOC) emissions guarantee clean bedroom air quality. Deep louvers dampen harsh room reverberations, creating a restful retreat.
                  </p>
                </div>
                <div className="pt-4 border-t border-stone-200 dark:border-stone-800 text-xs font-mono text-stone-500">
                  Recommended: FP-718 (Light Wood) or FP-721
                </div>
              </div>
            </div>
          )}

          {activeUseCaseTab === 'commercial' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-8 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-amber-600 dark:text-amber-400 font-bold block mb-2">
                    EXECUTIVE CABINS
                  </span>
                  <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-3">
                    Fluted Wall Panels for Office
                  </h3>
                  <p className="text-xs text-stone-600 dark:text-stone-400 font-light leading-relaxed mb-4">
                    Projects quiet corporate authority in director cabins and boardroom suites. Certified Class B1 flame retardant compliant with commercial building fire inspection codes.
                  </p>
                </div>
                <div className="pt-4 border-t border-stone-200 dark:border-stone-800 text-xs font-mono text-stone-500">
                  Compliance: Class B1 Flame Retardant
                </div>
              </div>

              <div className="p-8 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-amber-600 dark:text-amber-400 font-bold block mb-2">
                    RECEPTION & FOYER
                  </span>
                  <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-3">
                    Corporate Welcome Louvers
                  </h3>
                  <p className="text-xs text-stone-600 dark:text-stone-400 font-light leading-relaxed mb-4">
                    Resists heavy foot-traffic scuffs, handbag bumps, and luggage contact. Wipes clean daily without water damage, staining, or finish peeling.
                  </p>
                </div>
                <div className="pt-4 border-t border-stone-200 dark:border-stone-800 text-xs font-mono text-stone-500">
                  Feature: High Traffic Scuff Resistance
                </div>
              </div>

              <div className="p-8 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-amber-600 dark:text-amber-400 font-bold block mb-2">
                    RETAIL & HOSPITALITY
                  </span>
                  <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-3">
                    Showrooms & Boutiques
                  </h3>
                  <p className="text-xs text-stone-600 dark:text-stone-400 font-light leading-relaxed mb-4">
                    Ideal backdrop for jewelry showrooms, apparel boutiques, luxury spas, and cafe counter facades. Easy installation allows fast commercial store fitouts.
                  </p>
                </div>
                <div className="pt-4 border-t border-stone-200 dark:border-stone-800 text-xs font-mono text-stone-500">
                  Feature: Fast-Track Store Fitouts
                </div>
              </div>
            </div>
          )}

          {activeUseCaseTab === 'professional' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-8 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-amber-600 dark:text-amber-400 font-bold block mb-2">
                    ARCHITECTURAL SPECIFICATION
                  </span>
                  <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-3">
                    Fluted Panels for Architects
                  </h3>
                  <p className="text-xs text-stone-600 dark:text-stone-400 font-light leading-relaxed mb-4">
                    Full CAD profile cross-sections, high-resolution seamless texture maps for 3ds Max/SketchUp rendering, and physical architectural sample folders dispatched to your studio.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setQuoteModalSource('Architect Specification Inquiry');
                    setQuoteModalOpen(true);
                  }}
                  className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 hover:underline inline-flex items-center gap-1"
                >
                  <span>Request Architect Folder</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-8 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-amber-600 dark:text-amber-400 font-bold block mb-2">
                    PROJECT BOQ SUPPLY
                  </span>
                  <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-3">
                    Fluted Panels for Contractors
                  </h3>
                  <p className="text-xs text-stone-600 dark:text-stone-400 font-light leading-relaxed mb-4">
                    Direct mill rate (₹599/pc). Share your site Bill of Quantities for instant area take-off, scheduled deliveries, and dedicated contractor project support.
                  </p>
                </div>
                <a
                  href="https://wa.me/919999999999?text=Hello%20WholesalerJi,%20I%20am%20a%20Contractor%20requesting%20project%20BOQ%20pricing%20for%20Elite%20Fluted%20Panels"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 hover:underline inline-flex items-center gap-1"
                >
                  <span>Share Site BOQ on WhatsApp</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="p-8 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-amber-600 dark:text-amber-400 font-bold block mb-2">
                    WHOLESALE DISTRIBUTORSHIP
                  </span>
                  <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-3">
                    Fluted Panels for Dealers
                  </h3>
                  <p className="text-xs text-stone-600 dark:text-stone-400 font-light leading-relaxed mb-4">
                    Factory-direct carton MOQ (10 pcs / box). Protected dealer margins, compact showroom display stands, and pan-India insured truckload delivery.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setQuoteModalSource('Dealer Distributorship Inquiry');
                    setQuoteModalOpen(true);
                  }}
                  className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 hover:underline inline-flex items-center gap-1"
                >
                  <span>Inquire Dealer Distributorship</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION F — FLUTED PANEL VS A PLAIN WALL (BEFORE / AFTER)     */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section className="w-full px-4 sm:px-8 lg:px-12 py-20 sm:py-28 bg-white dark:bg-stone-900/40 border-b border-stone-200 dark:border-stone-800">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-600 dark:text-amber-500 mb-2 block">
              [ THE TRANSFORMATION ]
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-stone-900 dark:text-white mb-4">
              Fluted Panel vs. A Plain Wall
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 font-light leading-relaxed">
              Compare the visual texture, moisture resistance, and architectural longevity between standard painted drywall and an Elite Fluted feature wall.
            </p>
          </div>

          {/* Interactive Comparison Splitter */}
          <div className="relative w-full max-w-4xl mx-auto h-[380px] sm:h-[480px] rounded-3xl overflow-hidden shadow-2xl border border-stone-200 dark:border-stone-800 mb-12 select-none">
            {/* Background Layer: Elite Fluted Feature Wall */}
            <div className="absolute inset-0 w-full h-full">
              <Image
                src="https://res.cloudinary.com/def2qsxjg/image/upload/v1790929841/FP-702_installed_image_in_room.jpg"
                alt="Elite fluted wall panel installed with dynamic 3D shadow grooves and timber warmth"
                fill
                sizes="(max-width: 1024px) 100vw, 900px"
                className="object-cover object-center"
              />
              <div className="absolute bottom-6 right-6 px-4 py-2 rounded-xl bg-stone-950/80 backdrop-blur-md text-white border border-amber-500/40 text-xs font-mono font-bold uppercase tracking-wider">
                Elite Fluted 9MM Wall
              </div>
            </div>

            {/* Foreground Layer: Clipped Plain Drywall View */}
            <div
              className="absolute inset-0 h-full overflow-hidden bg-stone-300 dark:bg-stone-800"
              style={{ width: `${sliderPosition}%` }}
            >
              <div className="relative w-full h-full min-w-[700px] sm:min-w-[900px] flex items-center justify-center bg-gradient-to-br from-stone-200 to-stone-400 dark:from-stone-800 dark:to-stone-900">
                {/* Flat wall graphic representation */}
                <div className="p-8 text-center max-w-sm">
                  <span className="text-xs font-mono uppercase tracking-widest text-stone-500 dark:text-stone-400 block mb-2 font-bold">
                    Standard Flat Drywall
                  </span>
                  <p className="text-sm font-light text-stone-700 dark:text-stone-300">
                    Flat 2D paint finish • Prone to monsoon paint bubbling • Requires repainting every 2 years
                  </p>
                </div>
              </div>
              <div className="absolute bottom-6 left-6 px-4 py-2 rounded-xl bg-stone-900/80 backdrop-blur-md text-white border border-stone-700 text-xs font-mono font-bold uppercase tracking-wider">
                Flat Painted Wall
              </div>
            </div>

            {/* Draggable Divider Line */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-amber-500 cursor-ew-resize flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.8)]"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="w-8 h-8 rounded-full bg-amber-500 text-stone-950 font-bold flex items-center justify-center shadow-lg text-xs">
                ⇄
              </div>
            </div>

            {/* Invisible Range Slider Overlay for effortless touch & drag */}
            <input
              type="range"
              min="5"
              max="95"
              value={sliderPosition}
              onChange={(e) => setSliderPosition(Number(e.target.value))}
              aria-label="Comparison slider between flat drywall and Elite Fluted wall"
              className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
            />
          </div>

          {/* Quick Slider Helper Buttons */}
          <div className="flex justify-center gap-3 mb-16">
            <button
              onClick={() => setSliderPosition(20)}
              className="px-4 py-1.5 rounded-full text-xs font-mono bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 transition-colors cursor-pointer"
            >
              More Fluted (80%)
            </button>
            <button
              onClick={() => setSliderPosition(50)}
              className="px-4 py-1.5 rounded-full text-xs font-mono bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 transition-colors cursor-pointer"
            >
              50 / 50 Split
            </button>
            <button
              onClick={() => setSliderPosition(80)}
              className="px-4 py-1.5 rounded-full text-xs font-mono bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 transition-colors cursor-pointer"
            >
              More Plain (80%)
            </button>
          </div>

          {/* Detailed Side-by-Side Comparison Matrix */}
          <div className="max-w-4xl mx-auto border border-stone-200 dark:border-stone-800 rounded-3xl overflow-hidden shadow-lg">
            <div className="grid grid-cols-12 bg-stone-100 dark:bg-stone-900 p-4 sm:p-5 border-b border-stone-200 dark:border-stone-800 font-mono text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
              <div className="col-span-4 sm:col-span-3">Performance Metric</div>
              <div className="col-span-4 sm:col-span-4 text-stone-500">Standard Plain Wall</div>
              <div className="col-span-4 sm:col-span-5 text-amber-600 dark:text-amber-400">Elite Fluted Series (9MM)</div>
            </div>

            <div className="divide-y divide-stone-200 dark:divide-stone-800 bg-white dark:bg-stone-950">
              {ELITE_FLUTED_COMPARISON.map((row, i) => (
                <div key={i} className="grid grid-cols-12 p-4 sm:p-5 text-xs sm:text-sm items-center hover:bg-stone-50 dark:hover:bg-stone-900/50 transition-colors">
                  <div className="col-span-4 sm:col-span-3 font-semibold text-stone-900 dark:text-white">
                    {row.feature}
                  </div>
                  <div className="col-span-4 sm:col-span-4 text-stone-500 dark:text-stone-400 font-light pr-2">
                    {row.plainWall}
                  </div>
                  <div className="col-span-4 sm:col-span-5 text-stone-900 dark:text-stone-100 font-medium pl-2 border-l border-stone-200 dark:border-stone-800">
                    {row.eliteFluted}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION G — FLUTED PANEL BUYER GUIDE & LIVE ESTIMATOR         */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section className="w-full px-4 sm:px-8 lg:px-12 py-20 sm:py-28 bg-stone-50 dark:bg-stone-950 border-b border-stone-200 dark:border-stone-800">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-600 dark:text-amber-500 mb-2 block">
              [ BUYER ROADMAP & TOOL ]
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-stone-900 dark:text-white mb-4">
              Fluted Panel Buyer Guide
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 font-light leading-relaxed">
              Step-by-step guidance on estimating required panels, preparing masonry walls, and calculating wholesale project costs.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-16">
            {/* Left: 6-Step Roadmap */}
            <div className="lg:col-span-7 space-y-4">
              {ELITE_FLUTED_BUYER_STEPS.map((step) => (
                <div
                  key={step.step}
                  className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm flex items-start gap-5"
                >
                  <span className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 font-mono font-bold text-sm flex items-center justify-center flex-shrink-0 border border-amber-500/20">
                    {step.step}
                  </span>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-stone-900 dark:text-white mb-1.5">
                      {step.title}
                    </h3>
                    <p className="text-xs text-stone-600 dark:text-stone-400 font-light leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Right: Live Interactive Square Foot Calculator */}
            <div className="lg:col-span-5 p-8 rounded-3xl bg-stone-900 text-white border border-stone-800 shadow-2xl sticky top-24">
              <div className="flex items-center gap-2 mb-6 text-amber-400 font-mono text-xs uppercase tracking-widest font-bold">
                <Calculator className="w-5 h-5" />
                <span>Instant Area & Cost Estimator</span>
              </div>

              <div className="space-y-5 mb-8">
                <div>
                  <label className="text-xs font-mono text-stone-400 block mb-2">
                    Wall Width (Feet): <span className="text-white font-bold">{safeWidth} FT</span>
                  </label>
                  <input
                    type="range"
                    min="3"
                    max="50"
                    step="0.5"
                    value={safeWidth}
                    onChange={(e) => setCalcWidth(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-stone-400 block mb-2">
                    Wall Height (Feet): <span className="text-white font-bold">{safeHeight} FT</span>
                  </label>
                  <input
                    type="range"
                    min="6"
                    max="14"
                    step="0.5"
                    value={safeHeight}
                    onChange={(e) => setCalcHeight(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Calculator Output Card */}
              <div className="p-5 rounded-2xl bg-stone-950 border border-stone-800 space-y-3 font-mono text-xs mb-8">
                <div className="flex justify-between text-stone-400">
                  <span>Gross Wall Area:</span>
                  <span className="text-white font-bold">{totalSqFt} SQ FT</span>
                </div>
                <div className="flex justify-between text-stone-400">
                  <span>Panels Required (+10% cut waste):</span>
                  <span className="text-amber-400 font-bold">{recommendedPanels} PCS</span>
                </div>
                <div className="flex justify-between text-stone-400">
                  <span>Factory Boxes (10 pcs / box):</span>
                  <span className="text-white font-bold">{boxesNeeded} BOXES</span>
                </div>
                <div className="pt-3 border-t border-stone-800 flex justify-between items-baseline">
                  <span className="text-stone-300">Estimated Mill Cost:</span>
                  <span className="text-lg font-black text-amber-400 font-sans">
                    ₹{estimatedWholesaleCost.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-emerald-400 pt-1">
                  <span>Contractor Direct Savings:</span>
                  <span>₹{estimatedSavings.toLocaleString('en-IN')} Saved</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setQuoteModalSource(`Calculator Estimate: ${totalSqFt} sq ft (${recommendedPanels} panels)`);
                  setQuoteModalOpen(true);
                }}
                className="w-full py-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs uppercase tracking-widest text-center transition-all duration-200 shadow-xl shadow-amber-500/20 active:scale-95 cursor-pointer block"
              >
                Lock In Wholesale Rate for {recommendedPanels} Panels →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION H — GURGAON & DELHI NCR LOGISTICS                     */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section className="w-full px-4 sm:px-8 lg:px-12 py-20 sm:py-28 bg-white dark:bg-stone-900/30 border-b border-stone-200 dark:border-stone-800">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-600 dark:text-amber-500 mb-2 block">
              [ DIRECT MILL SUPPLY NETWORK ]
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-stone-900 dark:text-white mb-4">
              Gurugram Hub & Pan-India Dispatch
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 font-light leading-relaxed">
              WholesalerJi operates an architectural material fulfillment hub in Gurugram, delivering direct factory consignments with zero middleman markups.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-6">
                  <Truck className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-stone-400 block mb-1">
                  Local Express
                </span>
                <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-3">
                  Gurgaon & Gurugram
                </h3>
                <p className="text-xs text-stone-600 dark:text-stone-400 font-light leading-relaxed">
                  Same-day job-site delivery or direct warehouse pickup from Sector 34, Gurugram. Fast local dispatch across DLF Phase 1–5, Golf Course Road, Sohna Road, and Dwarka Expressway.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-stone-200 dark:border-stone-800 text-xs font-mono text-amber-600 dark:text-amber-400 font-bold">
                2-Hour Dispatch Window
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-6">
                  <Building2 className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-stone-400 block mb-1">
                  Capital Region
                </span>
                <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-3">
                  Delhi NCR Project Logistics
                </h3>
                <p className="text-xs text-stone-600 dark:text-stone-400 font-light leading-relaxed">
                  Scheduled 24-hour deliveries across South Delhi, West Delhi, Central Delhi, Noida, Greater Noida, and Faridabad. Dedicated site coordination for interior fitout teams.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-stone-200 dark:border-stone-800 text-xs font-mono text-amber-600 dark:text-amber-400 font-bold">
                24-Hour Job-Site Delivery
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-6">
                  <Layers className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-stone-400 block mb-1">
                  National Freight
                </span>
                <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-3">
                  Pan-India Palletized Cargo
                </h3>
                <p className="text-xs text-stone-600 dark:text-stone-400 font-light leading-relaxed">
                  Containerized road freight to Mumbai, Bengaluru, Hyderabad, Kolkata, Chennai, and Pune within 48–72 hours with robust edge protectors, wooden pallet strapping, and transit insurance.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-stone-200 dark:border-stone-800 text-xs font-mono text-amber-600 dark:text-amber-400 font-bold">
                48–72 Hours Pan-India Delivery
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION I — ARCHITECT / CONTRACTOR / DEALER PATHWAYS          */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section className="w-full px-4 sm:px-8 lg:px-12 py-20 sm:py-28 bg-stone-900 text-stone-100 border-b border-stone-800">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-400 mb-2 block">
              [ PROFESSIONAL CHANNELS ]
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-4">
              Tailored Buyer Pathways
            </h2>
            <p className="text-xs sm:text-sm text-stone-400 font-light leading-relaxed">
              Whether you are an architect curating material schedules, a contractor running multiple residential fitouts, or a retail showroom stockist, we have dedicated trade pathways.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {ELITE_FLUTED_PERSONAS.map((persona) => (
              <div
                key={persona.id}
                className="p-8 rounded-3xl bg-stone-950 border border-stone-800 hover:border-amber-500/50 transition-all flex flex-col justify-between shadow-xl"
              >
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold block mb-2">
                    {persona.tagline}
                  </span>
                  <h3 className="text-xl font-bold text-white mb-4">
                    {persona.role}
                  </h3>
                  <p className="text-xs text-stone-400 font-light leading-relaxed mb-6">
                    {persona.description}
                  </p>

                  <ul className="space-y-2 mb-8">
                    {persona.perks.map((perk, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-xs text-stone-300 font-mono">
                        <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
                        <span>{perk}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <a
                  href={`https://wa.me/919999999999?text=${encodeURIComponent(persona.whatsappMessage)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 rounded-xl bg-stone-900 hover:bg-amber-500 hover:text-stone-950 text-white font-bold text-xs uppercase tracking-wider text-center transition-all duration-200 border border-stone-700 hover:border-amber-500 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{persona.ctaText}</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION J — FLUTED PANEL FAQ ACCORDION                        */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section id="faq" className="w-full px-4 sm:px-8 lg:px-12 py-20 sm:py-28 bg-stone-50 dark:bg-stone-950 border-b border-stone-200 dark:border-stone-800">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-600 dark:text-amber-500 mb-2 block">
              [ BUYER FAQS ]
            </span>
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

                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-stone-600 dark:text-stone-300 font-light leading-relaxed border-t border-stone-100 dark:border-stone-800/80">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION K — SISTER & COMPLEMENTARY COLLECTIONS                */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section className="w-full px-4 sm:px-8 lg:px-12 py-20 sm:py-28 bg-white dark:bg-stone-900/40 border-b border-stone-200 dark:border-stone-800">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-600 dark:text-amber-500 mb-2 block">
                [ COMPLETE CLADDING PORTFOLIO ]
              </span>
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
      {/* SECTION L — RFQ SPECIFICATION LEAD FORM                       */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section id="rfq-section" className="w-full px-4 sm:px-8 lg:px-12 py-20 sm:py-28 bg-stone-100 dark:bg-stone-950 border-t border-stone-200 dark:border-stone-800 relative overflow-hidden">
        {/* Subtle architectural grid lines */}
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(90deg, currentColor 1px, transparent 1px), linear-gradient(currentColor 1px, transparent 1px)',
            backgroundSize: '100px 100px',
          }}
        />

        <div className="max-w-4xl mx-auto relative z-10 mb-12 text-center">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-600 dark:text-amber-500 mb-2 block">
            [ DIRECT MILL PROCUREMENT ]
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-stone-900 dark:text-white tracking-tight mb-4">
            Specify the Elite Fluted Series
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 font-light max-w-2xl mx-auto">
            Submit your square footage or site Bill of Quantities. Our Gurugram commercial desk will provide factory-direct invoicing with 18% GST input credit and physical sample dispatch.
          </p>
        </div>

        <div className="max-w-3xl mx-auto relative z-10 bg-white dark:bg-stone-900 shadow-2xl p-6 sm:p-10 rounded-3xl border border-stone-200 dark:border-stone-800">
          <LeadForm
            initialProductName={selectedPanel.name}
            initialProductSku={selectedPanel.code}
            initialMaterial="Elite Fluted 9mm WPC Wall Panels"
          />
        </div>

        {/* Localized Semantic B2B Anchor Bar */}
        <div className="max-w-4xl mx-auto mt-14 pt-8 border-t border-stone-300 dark:border-stone-800 text-center text-[11px] font-mono text-stone-500 space-y-2">
          <p>
            WholesalerJi Architectural Materials Depot • Sector 34, Gurugram, Haryana 122001
          </p>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-stone-600 dark:text-stone-400">
            <Link href="/wall-panels" className="hover:text-amber-500 transition-colors">All Wall Panels</Link>
            <span>•</span>
            <Link href="/wall-panels/primo-fluted" className="hover:text-amber-500 transition-colors">Primo Fluted Panels</Link>
            <span>•</span>
            <Link href="/wall-panels/elite" className="hover:text-amber-500 transition-colors">Elite Marble Panels</Link>
            <span>•</span>
            <Link href="/wall-panels/primo" className="hover:text-amber-500 transition-colors">Primo PVC Panels</Link>
            <span>•</span>
            <Link href="/about" className="hover:text-amber-500 transition-colors">About WholesalerJi</Link>
            <span>•</span>
            <Link href="/contact" className="hover:text-amber-500 transition-colors">Gurugram Experience Center</Link>
          </div>
        </div>
      </section>

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
    </div>
  );
}
