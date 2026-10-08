'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import * as THREE from 'three';
import { PanelProduct } from '@/data/types';
import {
  PRIMO_FLUTED_WALL_PANELS,
  PRIMO_FLUTED_ACRONYM_DATA,
  PRIMO_FLUTED_FAQS,
  PRIMO_FLUTED_SPATIAL_SHOWCASE,
  PRIMO_FLUTED_COMPARISON_DATA,
  PRIMO_FLUTED_SISTER_COLLECTIONS,
} from '@/data/primoFlutedPanelsData';
import ProductShowcase from '@/components/ProductShowcase';
import CraterBurst from '@/components/originkit/ui/crater-burst';
import GetQuoteModal from '@/components/GetQuoteModal';
import FAQ from '@/components/FAQ';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Phone,
  ArrowRight,
  X,
  Check,
  CheckCircle2,
  Sparkles,
  Eye,
  ShieldCheck,
  Flame,
  Droplets,
  Volume2,
  FileText,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// MAGIC RINGS THREE.JS SHADER ENGINE (EMBEDDED DIRECTLY, ZERO EXTERNAL CSS)
// ─────────────────────────────────────────────────────────────────────────────
const vertexShader = `
void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
precision highp float;

uniform float uTime, uAttenuation, uLineThickness;
uniform float uBaseRadius, uRadiusStep, uScaleRate;
uniform float uOpacity, uNoiseAmount, uRotation;
uniform float uFadeIn, uFadeOut;
uniform float uCoverageAlpha;
uniform vec2 uResolution;
uniform vec3 uColor, uColorTwo;
uniform int uRingCount;

const float HP = 1.5707963;
const float CYCLE = 3.45;

float fade(float t) {
  return t < uFadeIn ? smoothstep(0.0, uFadeIn, t) : 1.0 - smoothstep(uFadeOut, CYCLE - 0.2, t);
}

// 360-degree luminous neon ring radiating across all quadrants without top/bottom cutoff
float ring(vec2 p, float ri, float t0, float px) {
  float t = mod(uTime + t0, CYCLE);
  float r = ri + (t / CYCLE) * uScaleRate;
  float d = abs(length(p) - r);
  float a = atan(abs(p.y), abs(p.x)) / HP;
  float th = mix(0.8, 1.2, 1.0 - a * 0.3) * px * uLineThickness;
  float h = (1.0 - smoothstep(th, th * 1.5, d)) + 1.0;
  return h * exp(-uAttenuation * d) * fade(t);
}

void main() {
  float px = 1.0 / min(uResolution.x, uResolution.y);
  vec2 p = (gl_FragCoord.xy - 0.5 * uResolution.xy) * px;

  float cr = cos(uRotation), sr = sin(uRotation);
  p = mat2(cr, -sr, sr, cr) * p;

  vec3 c = vec3(0.0);
  float coverage = 0.0;
  float rcf = max(float(uRingCount) - 1.0, 1.0);

  for (int i = 0; i < 10; i++) {
    if (i >= uRingCount) break;
    float fi = float(i);
    vec3 rc = mix(uColor, uColorTwo, fi / rcf);
    // Staggered harmonic phase offset restores the organic undulating ripple rhythm
    float ringAmount = ring(p, uBaseRadius + fi * uRadiusStep, i == 0 ? 0.0 : 2.85 * fi, px);
    c = mix(c, rc, vec3(ringAmount));
    coverage = max(coverage, ringAmount);
  }

  // Subtle film grain
  float n = fract(sin(dot(gl_FragCoord.xy + uTime * 50.0, vec2(12.9898, 78.233))) * 43758.5453);
  c += (n - 0.5) * uNoiseAmount;

  float intensity = max(c.r, max(c.g, c.b));
  vec3 emissiveColor = intensity > 0.0001 ? clamp(c / intensity, 0.0, 1.0) : vec3(0.0);
  vec3 outputColor = mix(emissiveColor, clamp(c, 0.0, 1.0), uCoverageAlpha);
  float outputAlpha = mix(intensity, coverage, uCoverageAlpha);
  gl_FragColor = vec4(outputColor, clamp(outputAlpha * uOpacity, 0.0, 1.0));
}
`;

interface MagicRingsProps {
  color?: string;
  colorTwo?: string;
  speed?: number;
  ringCount?: number;
  attenuation?: number;
  lineThickness?: number;
  baseRadius?: number;
  radiusStep?: number;
  scaleRate?: number;
  opacity?: number;
  blur?: number;
  noiseAmount?: number;
  rotation?: number;
  fadeIn?: number;
  fadeOut?: number;
  alphaMode?: 'luminance' | 'coverage';
  className?: string;
}

const MagicRings = React.memo(function MagicRings({
  color = '#fc42ff',
  colorTwo = '#42fcff',
  speed = 1,
  ringCount = 6,
  attenuation = 11,
  lineThickness = 2.0,
  baseRadius = 0.10,
  radiusStep = 0.05,
  scaleRate = 0.18,
  opacity = 1.0,
  blur = 0,
  noiseAmount = 0.04,
  rotation = 0,
  fadeIn = 0.6,
  fadeOut = 3.2,
  alphaMode = 'luminance',
  className = '',
}: MagicRingsProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const propsRef = useRef<MagicRingsProps>({
    color,
    colorTwo,
    speed,
    ringCount,
    attenuation,
    lineThickness,
    baseRadius,
    radiusStep,
    scaleRate,
    opacity,
    blur,
    noiseAmount,
    rotation,
    fadeIn,
    fadeOut,
    alphaMode,
  });

  useEffect(() => {
    propsRef.current = {
      color,
      colorTwo,
      speed,
      ringCount,
      attenuation,
      lineThickness,
      baseRadius,
      radiusStep,
      scaleRate,
      opacity,
      blur,
      noiseAmount,
      rotation,
      fadeIn,
      fadeOut,
      alphaMode,
    };
  }, [
    color, colorTwo, speed, ringCount, attenuation, lineThickness, 
    baseRadius, radiusStep, scaleRate, opacity, blur, noiseAmount, 
    rotation, fadeIn, fadeOut, alphaMode
  ]);

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
      uAttenuation: { value: 0 },
      uResolution: { value: new THREE.Vector2() },
      uColor: { value: new THREE.Color() },
      uColorTwo: { value: new THREE.Color() },
      uLineThickness: { value: 0 },
      uBaseRadius: { value: 0 },
      uRadiusStep: { value: 0 },
      uScaleRate: { value: 0 },
      uRingCount: { value: 0 },
      uOpacity: { value: 1 },
      uNoiseAmount: { value: 0 },
      uRotation: { value: 0 },
      uFadeIn: { value: 0.6 },
      uFadeOut: { value: 3.8 },
      uCoverageAlpha: { value: 0 },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
    });
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

    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    let frameId = 0;
    let isVisible = false;
    let isPageVisible = !document.hidden;
    let elapsed = 0;
    let lastT = 0;

    const animate = (t: number) => {
      frameId = requestAnimationFrame(animate);
      const p = propsRef.current;

      const dt = lastT === 0 ? 0 : Math.min(t - lastT, 100);
      lastT = t;
      elapsed += dt * 0.001 * (p.speed ?? 1);

      uniforms.uTime.value = elapsed;
      uniforms.uAttenuation.value = p.attenuation ?? 11;
      uniforms.uColor.value.set(p.color ?? '#fc42ff');
      uniforms.uColorTwo.value.set(p.colorTwo ?? '#42fcff');
      uniforms.uLineThickness.value = p.lineThickness ?? 2.0;
      uniforms.uBaseRadius.value = p.baseRadius ?? 0.10;
      uniforms.uRadiusStep.value = p.radiusStep ?? 0.05;
      uniforms.uScaleRate.value = p.scaleRate ?? 0.18;
      uniforms.uRingCount.value = p.ringCount ?? 6;
      uniforms.uOpacity.value = p.opacity ?? 1.0;
      uniforms.uNoiseAmount.value = p.noiseAmount ?? 0.04;
      uniforms.uRotation.value = ((p.rotation ?? 0) * Math.PI) / 180;
      uniforms.uFadeIn.value = p.fadeIn ?? 0.6;
      uniforms.uFadeOut.value = p.fadeOut ?? 3.2;
      uniforms.uCoverageAlpha.value = p.alphaMode === 'coverage' ? 1 : 0;

      renderer.render(scene, camera);
    };

    const tryStart = () => {
      if (isVisible && isPageVisible && frameId === 0) {
        lastT = 0;
        frameId = requestAnimationFrame(animate);
      }
    };
    const tryStop = () => {
      if (frameId !== 0) {
        cancelAnimationFrame(frameId);
        frameId = 0;
      }
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          tryStart();
        } else {
          tryStop();
        }
      },
      { threshold: 0 }
    );
    io.observe(mount);

    const onVisibility = () => {
      isPageVisible = !document.hidden;
      if (isPageVisible) {
        tryStart();
      } else {
        tryStop();
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    tryStart();

    return () => {
      tryStop();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('resize', resize);
      ro.disconnect();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      quad.geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className={`w-full h-full pointer-events-none select-none ${className}`}
      style={blur > 0 ? { filter: `blur(${blur}px)` } : undefined}
    />
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// COLOR THEME PRESETS FOR MAGIC RINGS HERO
// ─────────────────────────────────────────────────────────────────────────────
const RING_PALETTES = [
  { id: 'gold', name: 'Architectural Amber', color: '#F5AB40', colorTwo: '#38bdf8' },
  { id: 'cyber', name: 'Cyber Neon', color: '#fc42ff', colorTwo: '#42fcff' },
  { id: 'emerald', name: 'Emerald Cyan', color: '#10b981', colorTwo: '#06b6d4' },
];

interface PrimoFlutedSeriesTemplateProps {
  initialData?: PanelProduct;
  allShades?: PanelProduct[];
}

export default function PrimoFlutedSeriesTemplate({
  initialData,
  allShades = PRIMO_FLUTED_WALL_PANELS,
}: PrimoFlutedSeriesTemplateProps) {
  const shades = allShades && allShades.length > 0 ? allShades : PRIMO_FLUTED_WALL_PANELS;
  const [activeSpaceIndex, setActiveSpaceIndex] = useState(0);
  const [activeAcronymStep, setActiveAcronymStep] = useState(0);
  const [selectedPanel, setSelectedPanel] = useState<PanelProduct>(shades[0]);
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [accentColor, setAccentColor] = useState<string>('#F5AB40');

  const acronymSectionRef = useRef<HTMLDivElement>(null);
  const acronymTrackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    const section = acronymSectionRef.current;
    const track = acronymTrackRef.current;
    if (!section || !track) return;

    const ctx = gsap.context(() => {
      const getScrollAmount = () => -(track.scrollWidth - window.innerWidth);

      gsap.to(track, {
        x: getScrollAmount,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${Math.max(track.scrollWidth - window.innerWidth, 1400)}`,
          pin: true,
          pinSpacing: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });
    }, section);

    return () => {
      ctx.revert();
    };
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('custom-theme-color');
      if (saved && saved.startsWith('#')) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setAccentColor(saved);
      } else {
        const rootStyle = getComputedStyle(document.documentElement);
        const computed = rootStyle.getPropertyValue('--color-amber-500').trim();
        if (computed && computed.startsWith('#')) {
          setAccentColor(computed);
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
    }
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

  return (
    <div className="w-full bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 transition-colors selection:bg-amber-500 selection:text-stone-950 overflow-x-hidden">
      {/* ───────────────────────────────────────────────────────────── */}
      {/* SEO: JSON-LD STRUCTURED DATA                                  */}
      {/* ───────────────────────────────────────────────────────────── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: 'Primo Fluted Panels - 9mm Architectural WPC Louver Wall Panels',
            description:
              'Upgrade interiors with Primo Fluted Panels from the Classic Wood Series. 9 MM thickness, 2950 x 300 MM dimensions, delivering 100% waterproof protection and authentic timber louver textures.',
            brand: {
              '@type': 'Brand',
              name: 'Goals Floors / WholesalerJi',
            },
            offers: {
              '@type': 'AggregateOffer',
              priceCurrency: 'INR',
              lowPrice: '599',
              highPrice: '599',
              offerCount: '13',
              availability: 'https://schema.org/InStock',
            },
          }),
        }}
      />

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION 1: FULLSCREEN HERO WITH AUTONOMOUS MAGIC RINGS        */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section className="relative w-full h-[100dvh] min-h-[100dvh] flex flex-col justify-between items-center bg-stone-950 text-white overflow-hidden select-none border-b border-stone-800">
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(245,171,64,0.06)_0%,rgba(10,10,10,0.85)_70%,#0a0a0a_100%)] pointer-events-none z-0" />

        {/* Top Minimal Navigation Bar: Breadcrumb */}
        <div className="w-full z-20 pt-5 sm:pt-7 px-4 sm:px-8 lg:px-12 flex justify-between items-center max-w-7xl mx-auto pointer-events-auto">
          {/* Minimal Breadcrumb */}
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
              Primo Fluted
            </span>
          </nav>
        </div>

        {/* Fullscreen Edge-to-Edge Crater Burst Animation Canvas (Covers ENTIRE Hero Section) */}
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
          <CraterBurst
            background="transparent"
            baseColor={accentColor}
            density={135}
            dotSize={110}
            speed={50}
            reach={65}
            scatter={25}
            crater={{ roughness: 55, lobes: 5 }}
            motion={{ damping: 28, streak: 90 }}
          />
        </div>

        {/* Center Typography: PRIMO FLUTED Placed Perfectly in the Center */}
        <div className="relative z-10 w-full flex-1 flex flex-col items-center justify-center px-4 text-center pointer-events-none">
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-wider uppercase text-transparent bg-clip-text bg-gradient-to-b from-white via-stone-100 to-stone-400 drop-shadow-[0_15px_40px_rgba(0,0,0,0.9)] select-none">
            PRIMO FLUTED
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
              <ArrowRight className="w-3.5 h-3.5 rotate-90 text-stone-400 group-hover:text-amber-400 group-hover:translate-y-0.5 transition-all" />
            </div>
          </a>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION 2: SMART UNIVERSAL PRODUCT SHOWCASE COMPONENT         */}
      {/* Automatically loads correct shades, room scenes, and data     */}
      {/* ───────────────────────────────────────────────────────────── */}
      <ProductShowcase
        series="primo-fluted"
        allShades={shades}
        initialShadeId={initialData?.code || initialData?.id}
        onShadeChange={(shade) => setSelectedPanel(shade)}
        sectionId="showcase"
      />

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION 3: SPATIAL SHOWCASE (INSTALLED ROOM ENVIRONMENTS)     */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section
        id="spatial-showcase"
        className="w-full px-4 sm:px-8 lg:px-12 py-10 bg-white dark:bg-stone-900/40 text-stone-900 dark:text-white border-b border-stone-200 dark:border-stone-800 relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto">
          {/* Section Header: Full Width without right-side subtitle */}
          <div className="mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight text-stone-900 dark:text-white w-full">
              One Louver Profile. Six Architectural Spaces.
            </h2>
          </div>

          {/* Space Selector Tabs */}
          <div
            role="tablist"
            aria-label="Architectural spatial applications"
            className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-6"
          >
            {PRIMO_FLUTED_SPATIAL_SHOWCASE.map((space, idx) => {
              const isActive = activeSpaceIndex === idx;
              return (
                <button
                  key={space.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveSpaceIndex(idx)}
                  className={`flex-shrink-0 px-4 sm:px-5 py-2.5 rounded-2xl text-xs font-mono transition-all duration-300 border cursor-pointer ${
                    isActive
                      ? 'bg-amber-500 text-stone-950 border-amber-500 font-bold shadow-md shadow-amber-500/20'
                      : 'bg-stone-100 dark:bg-stone-900/60 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white hover:border-stone-300 dark:hover:border-stone-700'
                  }`}
                >
                  <span className="opacity-70 mr-2">0{idx + 1}</span>
                  <span>{space.title}</span>
                </button>
              );
            })}
          </div>

          {/* Active Space Spotlight Composition */}
          {(() => {
            const currentSpace = PRIMO_FLUTED_SPATIAL_SHOWCASE[activeSpaceIndex];
            return (
              <div className="rounded-3xl overflow-hidden bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 grid grid-cols-1 lg:grid-cols-12 shadow-xl">
                {/* Immersive Space Photography */}
                <div className="lg:col-span-8 relative aspect-[4/3] sm:aspect-[16/10] lg:aspect-auto min-h-[300px] sm:min-h-[420px] overflow-hidden group">
                  <Image
                    key={`space-img-${currentSpace.id}`}
                    src={currentSpace.image}
                    alt={currentSpace.altText}
                    fill
                    sizes="(max-width: 1024px) 100vw, 66vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                  {/* Floating Space Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="px-3 py-1 rounded-full bg-stone-950/85 backdrop-blur-md text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-amber-400 border border-stone-700 shadow-md">
                      {currentSpace.stat}
                    </span>
                  </div>

                  {/* Bottom Image Caption */}
                  <div className="absolute bottom-4 left-4 right-4 z-10 flex items-end justify-between">
                    <div>
                      <div className="text-[10px] font-mono text-stone-400 uppercase tracking-widest">
                        Installed Louver Shade
                      </div>
                      <div className="text-sm sm:text-base font-bold text-white">
                        {currentSpace.panelCode} — {currentSpace.panelName}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Editorial Space Notes & CTA */}
                <div className="lg:col-span-4 p-5 sm:p-7 lg:p-8 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white tracking-tight mb-3">
                      {currentSpace.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 font-light leading-relaxed mb-5">
                      {currentSpace.description}
                    </p>

                    <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-xs text-stone-600 dark:text-stone-400 space-y-1.5 mb-5">
                      <div className="flex items-center gap-2 text-stone-900 dark:text-stone-200 font-semibold">
                        <Sparkles className="w-4 h-4 text-amber-500 flex-shrink-0" />
                        <span>Acoustic &amp; Lighting Synergy:</span>
                      </div>
                      <p className="text-[11px] leading-relaxed">
                        9mm deep vertical ribs break room flutter echoes while casting rich shadow lines under overhead downlights and linear magnetic architectural tracks.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2.5 pt-3 border-t border-stone-200 dark:border-stone-800/80">
                    <button
                      type="button"
                      onClick={() => handleInspectShadeInShowcase(currentSpace.panelCode)}
                      className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Inspect {currentSpace.panelCode} in Showcase</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const target = shades.find((s) => s.code.toLowerCase() === currentSpace.panelCode.toLowerCase());
                        if (target) setSelectedPanel(target);
                        setIsInquiryModalOpen(true);
                      }}
                      className="w-full py-2.5 px-4 rounded-xl bg-stone-100 dark:bg-stone-900 hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 font-mono text-xs uppercase tracking-wider transition-colors border border-stone-200 dark:border-stone-800 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Request Sample for {currentSpace.panelCode}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION 4: P - R - I - M - O PINNED HORIZONTAL SCROLL          */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section
        ref={acronymSectionRef}
        id="primo-breakdown"
        className="relative w-full h-[100dvh] min-h-[100dvh] bg-stone-950 text-white overflow-hidden flex items-center select-none border-b border-stone-800"
      >
        {/* Horizontal Track Container */}
        <div className="relative w-full h-full overflow-hidden flex items-center">
          <div
            ref={acronymTrackRef}
            className="flex flex-row items-stretch flex-nowrap h-full will-change-transform"
            style={{ width: `${PRIMO_FLUTED_ACRONYM_DATA.length * 100}vw` }}
          >
            {PRIMO_FLUTED_ACRONYM_DATA.map((item) => (
              <div
                key={item.letter}
                className="w-screen h-[100dvh] flex-shrink-0 flex items-center justify-center px-6 sm:px-12 lg:px-20 py-8"
              >
                <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
                  
                  {/* Left Column: Pure Monumental Architectural Letter */}
                  <div className="lg:col-span-4 flex items-center justify-center lg:justify-start">
                    <span className="text-9xl sm:text-[11rem] md:text-[13rem] lg:text-[15rem] font-black font-mono leading-none tracking-tighter text-amber-500 select-none drop-shadow-[0_0_60px_rgba(245,171,64,0.35)] transition-transform duration-500 hover:scale-105">
                      {item.letter}
                    </span>
                  </div>

                  {/* Right Column: Title, Detailed Copy & Visual Preview Card */}
                  <div className="lg:col-span-8 flex flex-col justify-center space-y-4 sm:space-y-5">
                    <div>
                      <h3 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
                        {item.letter} — {item.title}
                      </h3>
                    </div>

                    <p className="text-sm sm:text-base lg:text-lg text-stone-300 font-light leading-relaxed">
                      {item.description}
                    </p>

                    {/* Installed Room Texture Visual Card */}
                    <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full rounded-2xl overflow-hidden border border-stone-800 shadow-2xl group mt-2">
                      <Image
                        src={item.texture}
                        alt={`${item.title} architectural installed scene`}
                        fill
                        sizes="(max-width: 1024px) 100vw, 60vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />
                      <div className="absolute bottom-3.5 left-4 right-4 flex items-center justify-between text-xs text-stone-300 font-mono">
                        <span className="truncate mr-2">Installed Reference • Delhi NCR Hub</span>
                        <span className="text-amber-400 font-bold flex-shrink-0">Standard 9MM Ribs</span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION 5: COMPARATIVE BENCHMARK (FLUTED WPC VS ALTERNATIVES) */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section
        id="comparison"
        className="w-full px-4 sm:px-8 lg:px-12 py-10 bg-white dark:bg-stone-900/40 border-b border-stone-200 dark:border-stone-800"
      >
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-4xl font-black text-stone-900 dark:text-white tracking-tight leading-tight">
              Primo Fluted WPC vs. Generic Louver Alternatives
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-2 font-light leading-relaxed">
              A factual side-by-side engineering comparison of composite density, moisture immunity, acoustic performance, and wholesale pricing.
            </p>
          </div>

          {/* Split Screen Benchmark Table (Horizontal scroll on phone) */}
          <div className="overflow-x-auto w-full no-scrollbar pb-2">
            <div className="min-w-[620px] rounded-3xl border border-stone-300 dark:border-stone-800 overflow-hidden bg-white dark:bg-stone-900/60 shadow-xl">
              {/* Table Header */}
              <div className="grid grid-cols-12 border-b border-stone-200 dark:border-stone-800 text-xs font-mono font-bold uppercase tracking-wider">
                <div className="col-span-4 p-4 sm:p-5 bg-stone-100 dark:bg-stone-900 text-stone-700 dark:text-stone-300">
                  Evaluation Metric
                </div>
                <div className="col-span-4 p-4 sm:p-5 bg-stone-50 dark:bg-stone-950/70 text-stone-500 border-l border-stone-200 dark:border-stone-800">
                  Generic MDF / Charcoal Louvers
                </div>
                <div className="col-span-4 p-4 sm:p-5 bg-amber-500/10 text-amber-600 dark:text-amber-400 border-l border-stone-200 dark:border-stone-800 flex items-center justify-between">
                  <span>WholesalerJi Primo 9mm WPC</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500 text-stone-950 font-black">
                    Recommended
                  </span>
                </div>
              </div>

              {/* Comparison Rows */}
              <div className="divide-y divide-stone-200 dark:divide-stone-800">
                {PRIMO_FLUTED_COMPARISON_DATA.map((row, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-12 items-stretch hover:bg-stone-50/80 dark:hover:bg-stone-900/40 transition-colors"
                  >
                    <div className="col-span-4 p-4 sm:p-5 flex flex-col justify-center">
                      <span className="font-bold text-stone-900 dark:text-white text-sm">
                        {row.metric}
                      </span>
                      <span className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                        {row.advantage}
                      </span>
                    </div>

                    <div className="col-span-4 p-4 sm:p-5 bg-stone-50/50 dark:bg-stone-950/30 border-l border-stone-200 dark:border-stone-800 flex items-start gap-2.5 text-xs text-stone-600 dark:text-stone-400">
                      <X className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                      <span>{row.ordinary}</span>
                    </div>

                    <div className="col-span-4 p-4 sm:p-5 bg-amber-500/[0.03] dark:bg-amber-500/[0.04] border-l border-stone-200 dark:border-stone-800 flex items-start gap-2.5 text-xs text-stone-900 dark:text-stone-100 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                      <span>{row.fluted}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION 6: TECHNICAL SPECIFICATIONS (MATERIAL PASSPORT)       */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section
        id="technical-specs"
        className="w-full px-4 sm:px-8 lg:px-12 py-10 bg-stone-50 dark:bg-stone-900/40 border-b border-stone-200 dark:border-stone-800"
      >
        <div className="max-w-5xl mx-auto">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-stone-900 dark:text-white tracking-tight leading-tight">
              Primo Fluted Technical Data Sheet
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-2 font-light leading-relaxed">
              Standardized physical and mechanical metrics for architectural drafting, interior BOQs, and contractor site planning.
            </p>
          </div>

          {/* Dossier Specs Table */}
          <div className="rounded-3xl border border-stone-300 dark:border-stone-800 overflow-hidden bg-white dark:bg-stone-900 shadow-xl">
            <div className="p-5 sm:p-7 border-b border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-900/80">
              <h3 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white">
                9MM Architectural WPC Fluted Louver Profile
              </h3>
            </div>

            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <tbody className="divide-y divide-stone-200 dark:divide-stone-800">
                  {[
                    { label: 'Standard Dimensions (L × W)', value: '2950 mm × 300 mm (9.68 ft × 0.98 ft / 12 Inch nominal)', highlight: false },
                    { label: 'Profile Depth / Thickness', value: '9.0 MM Architectural Deep Rib Louvers', highlight: true },
                    { label: 'Core Formulation', value: 'Virgin Wood Plastic Polymer Composite (WPC)', highlight: false },
                    { label: 'Effective Coverage per Panel', value: '9.52 SQ FT / PC (Seamless Interlocking Joint)', highlight: false },
                    { label: 'Box Packaging Standard', value: '10 Panels / Carton (95.2 SQ FT Total Coverage)', highlight: false },
                    { label: 'Net Weight per Panel', value: '3.2 ±5% Kg / PC (32 Kg Gross Box Weight)', highlight: false },
                    { label: 'Flame Retardancy Rating', value: 'Class B1 (Self-Extinguishing, Zero Flame Spread)', highlight: true },
                    { label: 'Water Absorption Coefficient', value: '0.0% (100% Impermeable Seelan & Damp Barrier)', highlight: true },
                    { label: 'Interlocking Mechanism', value: 'Concealed Fastening Tongue & Groove with Stainless Steel Clips', highlight: false },
                    { label: 'Primary Depot Hub', value: 'Sector 34, Gurugram, Haryana — 2-Hour NCR Dispatch', highlight: false },
                  ].map((row, i) => (
                    <tr
                      key={i}
                      className="hover:bg-stone-50 dark:hover:bg-stone-800/40 transition-colors"
                    >
                      <td className="py-3.5 px-4 sm:px-6 font-semibold text-stone-600 dark:text-stone-400 w-5/12 sm:w-1/3 align-middle">
                        {row.label}
                      </td>
                      <td
                        className={`py-3.5 px-4 sm:px-6 font-mono text-xs sm:text-sm w-7/12 sm:w-2/3 sm:text-right align-middle ${
                          row.highlight
                            ? 'text-amber-600 dark:text-amber-400 font-bold'
                            : 'text-stone-900 dark:text-stone-100'
                        }`}
                      >
                        {row.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION 7: SISTER ARCHITECTURAL COLLECTIONS                   */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section
        id="collections-hub"
        className="w-full bg-stone-100/60 dark:bg-stone-900/40 py-10 px-4 sm:px-8 lg:px-12 border-t border-stone-200 dark:border-stone-800"
      >
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
            <Link
              href="/wall-panels"
              className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1.5 flex-shrink-0"
            >
              View All Wall Panel Series →
            </Link>
          </div>

          {/* Installed Image Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {PRIMO_FLUTED_SISTER_COLLECTIONS.map((col) => (
              <Link
                key={col.id}
                href={col.url}
                className="group flex flex-col rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-amber-500/70 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
              >
                {/* 16:9 Installed Scene Image */}
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-stone-950">
                  <Image
                    src={col.image}
                    alt={col.altText || col.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent" />
                  
                  {/* Top Category Tag */}
                  <div className="absolute top-3 left-3 z-10">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-stone-950/80 backdrop-blur text-amber-400 border border-amber-500/30">
                      {col.tag}
                    </span>
                  </div>

                  {/* Bottom Shade Count Pill */}
                  <div className="absolute bottom-3 right-3 z-10">
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
      {/* SECTION 8: FREQUENTLY ASKED QUESTIONS                         */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section className="w-full max-w-5xl mx-auto px-4 sm:px-8 lg:px-12 py-10 border-b border-stone-200 dark:border-stone-800">
        <FAQ items={PRIMO_FLUTED_FAQS} />
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION 9: PROCUREMENT CTA & WHATSAPP DESK                    */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section
        id="procurement-desk"
        className="w-full px-4 sm:px-8 lg:px-12 py-12 sm:py-16 bg-gradient-to-b from-stone-100 to-amber-50/30 dark:from-stone-900 dark:to-stone-950 text-stone-900 dark:text-white relative overflow-hidden"
      >
        <div className="max-w-4xl mx-auto relative z-10 text-center mb-8">
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-stone-900 dark:text-white mb-4">
            Have an Architectural Project in Mind?
          </h2>
          <p className="text-stone-600 dark:text-stone-400 font-light max-w-2xl mx-auto text-xs sm:text-sm leading-relaxed mb-6">
            Connect with our technical procurement desk in Gurgaon. Request mill-direct box pricing, physical timber louver swatch deliveries, or custom project estimations.
          </p>

          <div className="flex items-center justify-center max-w-md mx-auto">
            <button
              type="button"
              onClick={() => setIsInquiryModalOpen(true)}
              className="w-full sm:w-auto py-3.5 px-8 rounded-2xl bg-amber-500 hover:bg-amber-400 active:scale-98 text-stone-950 font-black text-xs sm:text-sm uppercase tracking-wider shadow-[0_10px_30px_rgba(245,158,11,0.35)] hover:shadow-[0_15px_40px_rgba(245,158,11,0.5)] transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer group"
            >
              <span>Get Free Sample &amp; Quote</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* 3-OPTION PROCUREMENT INQUIRY MODAL (WHATSAPP / CALL / FORM)   */}
        {/* ───────────────────────────────────────────────────────────── */}
        {isInquiryModalOpen && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="fluted-modal-title"
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
                        body: JSON.stringify({ source: 'fluted-inquiry-modal-whatsapp', panel: selectedPanel.code }),
                      }).catch(() => {});
                    } catch {}
                    const msg = `Hi WholesalerJi, I want to inquire about Primo Fluted 9mm WPC Panels (${selectedPanel.code} - ${selectedPanel.name}) wholesale rates and delivery in Gurgaon/Delhi NCR.`;
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
        )}

        {/* Universal Quote & Sample Form Modal */}
        <GetQuoteModal
          isOpen={isQuoteModalOpen}
          onClose={() => setIsQuoteModalOpen(false)}
          activePanel={selectedPanel}
          allPanels={shades}
          seriesLabel="Primo Fluted 9mm Wall Panels"
        />

        
      </section>
    </div>
  );
}
