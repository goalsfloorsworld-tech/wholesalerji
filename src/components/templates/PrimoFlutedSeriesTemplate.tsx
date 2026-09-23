'use client';

import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { PanelProduct } from '@/data/types';
import {
  PRIMO_FLUTED_WALL_PANELS,
  PRIMO_FLUTED_ACRONYM_DATA,
  PRIMO_FLUTED_FAQS,
} from '@/data/primoFlutedPanelsData';
import ProductShowcase from '@/components/ProductShowcase';
import LeadForm from '@/components/client/LeadForm';
import FAQ from '@/components/FAQ';

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
uniform float uOpacity, uNoiseAmount, uRotation, uRingGap;
uniform float uFadeIn, uFadeOut;
uniform float uMouseInfluence, uHoverAmount, uHoverScale, uParallax, uBurst;
uniform float uCoverageAlpha;
uniform vec2 uResolution, uMouse;
uniform vec3 uColor, uColorTwo;
uniform int uRingCount;

const float HP = 1.5707963;
const float CYCLE = 3.45;

float fade(float t) {
  return t < uFadeIn ? smoothstep(0.0, uFadeIn, t) : 1.0 - smoothstep(uFadeOut, CYCLE - 0.2, t);
}

float ring(vec2 p, float ri, float cut, float t0, float px) {
  float t = mod(uTime + t0, CYCLE);
  float r = ri + t / CYCLE * uScaleRate;
  float d = abs(length(p) - r);
  float a = atan(abs(p.y), abs(p.x)) / HP;
  float th = max(1.0 - a, 0.5) * px * uLineThickness;
  float h = (1.0 - smoothstep(th, th * 1.5, d)) + 1.0;
  d += pow(cut * a, 3.0) * r;
  return h * exp(-uAttenuation * d) * fade(t);
}

void main() {
  float px = 1.0 / min(uResolution.x, uResolution.y);
  vec2 p = (gl_FragCoord.xy - 0.5 * uResolution.xy) * px;
  float cr = cos(uRotation), sr = sin(uRotation);
  p = mat2(cr, -sr, sr, cr) * p;
  p -= uMouse * uMouseInfluence;
  float sc = mix(1.0, uHoverScale, uHoverAmount) + uBurst * 0.3;
  p /= sc;
  vec3 c = vec3(0.0);
  float coverage = 0.0;
  float rcf = max(float(uRingCount) - 1.0, 1.0);
  for (int i = 0; i < 10; i++) {
    if (i >= uRingCount) break;
    float fi = float(i);
    vec2 pr = p - fi * uParallax * uMouse;
    vec3 rc = mix(uColor, uColorTwo, fi / rcf);
    float ringAmount = ring(pr, uBaseRadius + fi * uRadiusStep, pow(uRingGap, fi), i == 0 ? 0.0 : 2.95 * fi, px);
    c = mix(c, rc, vec3(ringAmount));
    coverage = max(coverage, ringAmount);
  }
  c *= 1.0 + uBurst * 2.0;
  float n = fract(sin(dot(gl_FragCoord.xy + uTime * 100.0, vec2(12.9898, 78.233))) * 43758.5453);
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
  ringGap?: number;
  fadeIn?: number;
  fadeOut?: number;
  followMouse?: boolean;
  mouseInfluence?: number;
  hoverScale?: number;
  parallax?: number;
  clickBurst?: boolean;
  alphaMode?: 'luminance' | 'coverage';
  className?: string;
}

const MagicRings = React.memo(function MagicRings({
  color = '#fc42ff',
  colorTwo = '#42fcff',
  speed = 1,
  ringCount = 6,
  attenuation = 10,
  lineThickness = 2,
  baseRadius = 0.35,
  radiusStep = 0.1,
  scaleRate = 0.1,
  opacity = 1,
  blur = 0,
  noiseAmount = 0.1,
  rotation = 0,
  ringGap = 1.5,
  fadeIn = 0.7,
  fadeOut = 0.5,
  followMouse = true,
  mouseInfluence = 0.25,
  hoverScale = 1.2,
  parallax = 0.05,
  clickBurst = true,
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
    ringGap,
    fadeIn,
    fadeOut,
    followMouse,
    mouseInfluence,
    hoverScale,
    parallax,
    clickBurst,
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
      ringGap,
      fadeIn,
      fadeOut,
      followMouse,
      mouseInfluence,
      hoverScale,
      parallax,
      clickBurst,
      alphaMode,
    };
  }, [
    color, colorTwo, speed, ringCount, attenuation, lineThickness, 
    baseRadius, radiusStep, scaleRate, opacity, blur, noiseAmount, 
    rotation, ringGap, fadeIn, fadeOut, followMouse, mouseInfluence, 
    hoverScale, parallax, clickBurst, alphaMode
  ]);

  const mouseRef = useRef<[number, number]>([0, 0]);
  const smoothMouseRef = useRef<[number, number]>([0, 0]);
  const hoverAmountRef = useRef<number>(0);
  const isHoveredRef = useRef<boolean>(false);
  const burstRef = useRef<number>(0);

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
      uRingGap: { value: 1.6 },
      uFadeIn: { value: 0.5 },
      uFadeOut: { value: 0.75 },
      uMouse: { value: new THREE.Vector2() },
      uMouseInfluence: { value: 0 },
      uHoverAmount: { value: 0 },
      uHoverScale: { value: 1 },
      uParallax: { value: 0 },
      uBurst: { value: 0 },
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

    const onMouseMove = (e: MouseEvent) => {
      const rect = mount.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      mouseRef.current[0] = (e.clientX - rect.left) / rect.width - 0.5;
      mouseRef.current[1] = -((e.clientY - rect.top) / rect.height - 0.5);
    };
    const onMouseEnter = () => {
      isHoveredRef.current = true;
    };
    const onMouseLeave = () => {
      isHoveredRef.current = false;
      mouseRef.current[0] = 0;
      mouseRef.current[1] = 0;
    };
    const onClick = () => {
      burstRef.current = 1;
    };

    mount.addEventListener('mousemove', onMouseMove);
    mount.addEventListener('mouseenter', onMouseEnter);
    mount.addEventListener('mouseleave', onMouseLeave);
    mount.addEventListener('click', onClick);

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

      smoothMouseRef.current[0] += (mouseRef.current[0] - smoothMouseRef.current[0]) * 0.08;
      smoothMouseRef.current[1] += (mouseRef.current[1] - smoothMouseRef.current[1]) * 0.08;
      hoverAmountRef.current += ((isHoveredRef.current ? 1 : 0) - hoverAmountRef.current) * 0.08;
      burstRef.current *= 0.95;
      if (burstRef.current < 0.001) burstRef.current = 0;

      uniforms.uTime.value = elapsed;
      uniforms.uAttenuation.value = p.attenuation ?? 10;
      uniforms.uColor.value.set(p.color ?? '#fc42ff');
      uniforms.uColorTwo.value.set(p.colorTwo ?? '#42fcff');
      uniforms.uLineThickness.value = p.lineThickness ?? 2;
      uniforms.uBaseRadius.value = p.baseRadius ?? 0.35;
      uniforms.uRadiusStep.value = p.radiusStep ?? 0.1;
      uniforms.uScaleRate.value = p.scaleRate ?? 0.1;
      uniforms.uRingCount.value = p.ringCount ?? 6;
      uniforms.uOpacity.value = p.opacity ?? 1;
      uniforms.uNoiseAmount.value = p.noiseAmount ?? 0.1;
      uniforms.uRotation.value = ((p.rotation ?? 0) * Math.PI) / 180;
      uniforms.uRingGap.value = p.ringGap ?? 1.5;
      uniforms.uFadeIn.value = p.fadeIn ?? 0.7;
      uniforms.uFadeOut.value = p.fadeOut ?? 0.5;
      uniforms.uMouse.value.set(smoothMouseRef.current[0], smoothMouseRef.current[1]);
      uniforms.uMouseInfluence.value = p.followMouse ? (p.mouseInfluence ?? 0.25) : 0;
      uniforms.uHoverAmount.value = hoverAmountRef.current;
      uniforms.uHoverScale.value = p.hoverScale ?? 1.2;
      uniforms.uParallax.value = p.parallax ?? 0.05;
      uniforms.uBurst.value = p.clickBurst ? burstRef.current : 0;
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
        isVisible ? tryStart() : tryStop();
      },
      { threshold: 0 }
    );
    io.observe(mount);

    const onVisibility = () => {
      isPageVisible = !document.hidden;
      isPageVisible ? tryStart() : tryStop();
    };
    document.addEventListener('visibilitychange', onVisibility);

    tryStart();

    return () => {
      tryStop();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('resize', resize);
      ro.disconnect();
      mount.removeEventListener('mousemove', onMouseMove);
      mount.removeEventListener('mouseenter', onMouseEnter);
      mount.removeEventListener('mouseleave', onMouseLeave);
      mount.removeEventListener('click', onClick);
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
      className={`w-full h-full ${className}`}
      style={blur > 0 ? { filter: `blur(${blur}px)` } : undefined}
    />
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// COLOR THEME PRESETS FOR MAGIC RINGS HERO
// ─────────────────────────────────────────────────────────────────────────────
const RING_PALETTES = [
  { id: 'cyber', name: 'Cyber Neon', color: '#fc42ff', colorTwo: '#42fcff' },
  { id: 'gold', name: 'Architectural Amber', color: 'var(--color-amber-500, #F5AB40)', colorTwo: '#38bdf8' },
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
  const [activePaletteIndex, setActivePaletteIndex] = useState(0);
  const [activeAcronymStep, setActiveAcronymStep] = useState(0);
  const [selectedPanel, setSelectedPanel] = useState<PanelProduct>(shades[0]);

  const currentPalette = RING_PALETTES[activePaletteIndex];

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
              name: 'Goals Floors / Wholesaleji',
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
      {/* SECTION 1: HERO WITH MAGIC RINGS & CENTER "PRIMO FLUTED"      */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section className="relative w-full min-h-[calc(100vh-4rem)] flex flex-col justify-between items-center bg-stone-950 text-white overflow-hidden select-none border-b border-stone-800">
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(245,171,64,0.08)_0%,rgba(10,10,10,0.85)_65%,#0a0a0a_100%)] pointer-events-none z-0" />

        {/* Top Spacer & Palette Switcher */}
        <div className="w-full z-20 pt-4 sm:pt-6 px-4 flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-xs text-stone-400 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="hidden sm:inline">THREE.JS WEBGL RINGS</span>
            <span className="text-stone-600 sm:inline hidden">•</span>
            <span className="text-amber-400 font-semibold">9MM FLUTED SERIES</span>
          </div>

          {/* Palette Selector Pill */}
          <div className="flex items-center gap-1.5 p-1 rounded-full bg-stone-900/90 border border-stone-800 backdrop-blur-md">
            {RING_PALETTES.map((pal, idx) => (
              <button
                key={pal.id}
                onClick={() => setActivePaletteIndex(idx)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                  activePaletteIndex === idx
                    ? 'bg-stone-800 text-white shadow-sm border border-stone-700'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <span className="inline-block w-2 h-2 rounded-full mr-1.5" style={{ backgroundColor: pal.color }} />
                {pal.name}
              </button>
            ))}
          </div>
        </div>

        {/* Magic Rings Canvas Background */}
        <div className="absolute inset-0 z-0">
          <MagicRings
            color={currentPalette.color}
            colorTwo={currentPalette.colorTwo}
            ringCount={6}
            speed={1}
            attenuation={10}
            lineThickness={2}
            baseRadius={0.35}
            radiusStep={0.1}
            scaleRate={0.1}
            opacity={1}
            blur={0}
            noiseAmount={0.1}
            rotation={0}
            ringGap={1.5}
            fadeIn={0.7}
            fadeOut={0.5}
            followMouse={true}
            mouseInfluence={0.25}
            hoverScale={1.2}
            parallax={0.05}
            clickBurst={true}
          />
        </div>

        {/* Center Typography: "PRIMO FLUTED" in center on page load */}
        <div className="relative z-10 w-full flex-1 flex flex-col items-center justify-center px-4 text-center pointer-events-none">
          {/* Subtle architectural pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-900/80 backdrop-blur-md border border-amber-500/30 text-xs font-semibold tracking-widest text-amber-300 uppercase mb-4 shadow-lg shadow-black/60 pointer-events-auto">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
            Classic Wood Architectural Fluted Series
          </div>

          {/* Primary Centered Display Heading */}
          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight uppercase text-transparent bg-clip-text bg-gradient-to-b from-white via-stone-100 to-stone-400 drop-shadow-[0_12px_45px_rgba(0,0,0,0.95)]">
            PRIMO FLUTED
          </h1>

          {/* Subtitle */}
          <p className="mt-4 text-base sm:text-xl md:text-2xl text-stone-200 font-light tracking-wide max-w-2xl mx-auto drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">
            13 Architectural Louver Finishes • 9MM WPC Profile • 2950 × 300 MM
          </p>

          {/* Interactive CTAs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5 pointer-events-auto">
            <a
              href="#showcase"
              className="px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm sm:text-base tracking-wide transition-all duration-200 shadow-xl shadow-amber-500/25 hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              <span>Explore All 13 Shades</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </a>
            <a
              href={`https://wa.me/919999999999?text=Hello%20Wholesaleji,%20I%20am%20interested%20in%20Primo%20Fluted%20Panels%20(${selectedPanel?.code || 'FP-701'})`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-xl bg-stone-900/80 hover:bg-stone-800 text-white font-semibold text-sm sm:text-base tracking-wide border border-stone-700/80 backdrop-blur-md transition-all duration-200 hover:border-amber-400/50 flex items-center gap-2"
            >
              <span>Wholesale Rate: ₹599 / PC</span>
            </a>
          </div>

          {/* Interaction hint */}
          <div className="mt-6 flex items-center gap-2 text-xs text-stone-400/80 tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span>Move cursor or click anywhere to pulse the rings</span>
          </div>
        </div>

        {/* Bottom Hero Anchor Bar */}
        <div className="w-full z-10 pb-6 px-4 flex justify-between items-center max-w-7xl mx-auto text-xs text-stone-400 border-t border-stone-900/60 pt-4">
          <div className="flex items-center gap-4">
            <span className="font-semibold text-stone-200">100% Waterproof WPC Core</span>
            <span className="hidden sm:inline text-stone-700">•</span>
            <span className="hidden sm:inline">Termite & Borer Proof</span>
            <span className="hidden sm:inline text-stone-700">•</span>
            <span className="hidden sm:inline">Class B1 Fire Rated</span>
          </div>

          <a
            href="#showcase"
            className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-medium transition-colors"
          >
            <span>Scroll to Collection</span>
            <svg className="w-3.5 h-3.5 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </a>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION 2: SMART UNIVERSAL PRODUCT SHOWCASE COMPONENT         */}
      {/* Automatically loads correct shades, room scenes, and data     */}
      {/* ───────────────────────────────────────────────────────────── */}
      <ProductShowcase
        series="primo-fluted"
        initialShadeId={initialData?.code || initialData?.id}
        onShadeChange={(shade) => setSelectedPanel(shade)}
        sectionId="showcase"
      />

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION 3: P - R - I - M - O ACRONYM ARCHITECTURAL BREAKDOWN   */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section className="w-full py-16 bg-stone-100 dark:bg-stone-900/50 border-y border-stone-200 dark:border-stone-800 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-amber-600 dark:text-amber-400 font-semibold">
              The Engineering Standard
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-stone-900 dark:text-stone-100 tracking-tight">
              Why Choose Primo Fluted Panels
            </h2>
            <p className="text-sm text-stone-600 dark:text-stone-400">
              Every panel is crafted to perfection with micron-precision extrusion and authentic timber texture synchronization.
            </p>
          </div>

          {/* Acronym Stepper Grid */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {PRIMO_FLUTED_ACRONYM_DATA.map((item, idx) => {
              const isActive = activeAcronymStep === idx;
              return (
                <div
                  key={item.letter}
                  onMouseEnter={() => setActiveAcronymStep(idx)}
                  className={`p-6 rounded-3xl border transition-all duration-300 cursor-pointer space-y-4 ${
                    isActive
                      ? 'bg-white dark:bg-stone-950 border-amber-500 shadow-xl shadow-amber-500/10 -translate-y-1'
                      : 'bg-white/60 dark:bg-stone-900/40 border-stone-200 dark:border-stone-800/80 hover:border-stone-400'
                  }`}
                >
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center font-black text-2xl text-amber-600 dark:text-amber-400 font-mono">
                    {item.letter}
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-bold text-base text-stone-900 dark:text-stone-100">
                      {item.title}
                    </h4>
                    <span className="text-xs text-amber-600 dark:text-amber-400 font-medium block">
                      {item.tagline}
                    </span>
                  </div>

                  <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION 4: TECHNICAL SPECIFICATIONS TABLE                    */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section className="w-full py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-mono uppercase tracking-widest text-amber-600 dark:text-amber-400 font-semibold">
            Product Specifications
          </span>
          <h2 className="text-3xl font-black text-stone-900 dark:text-stone-100 tracking-tight">
            Factory Technical Data Sheet
          </h2>
        </div>

        <div className="overflow-hidden rounded-3xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-xl">
          <table className="w-full text-left text-sm">
            <tbody className="divide-y divide-stone-200 dark:divide-stone-800">
              <tr className="hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors">
                <td className="py-4 px-6 font-semibold text-stone-600 dark:text-stone-400 w-1/3">Product Series</td>
                <td className="py-4 px-6 font-bold text-stone-900 dark:text-stone-100">Primo Fluted Panels (Classic Wood Series)</td>
              </tr>
              <tr className="hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors">
                <td className="py-4 px-6 font-semibold text-stone-600 dark:text-stone-400">Dimensions (L × W)</td>
                <td className="py-4 px-6 text-stone-900 dark:text-stone-100 font-mono">2950 MM × 300 MM (9.6 ft × 1.0 ft)</td>
              </tr>
              <tr className="hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors">
                <td className="py-4 px-6 font-semibold text-stone-600 dark:text-stone-400">Profile Thickness / Depth</td>
                <td className="py-4 px-6 text-stone-900 dark:text-stone-100 font-mono">9 MM Architectural Deep Fluting</td>
              </tr>
              <tr className="hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors">
                <td className="py-4 px-6 font-semibold text-stone-600 dark:text-stone-400">Weight Per Panel</td>
                <td className="py-4 px-6 text-stone-900 dark:text-stone-100 font-mono">3.2 kg / Piece</td>
              </tr>
              <tr className="hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors">
                <td className="py-4 px-6 font-semibold text-stone-600 dark:text-stone-400">Core Formulation</td>
                <td className="py-4 px-6 text-stone-900 dark:text-stone-100">Virgin Wood Plastic Polymer Composite (WPC)</td>
              </tr>
              <tr className="hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors">
                <td className="py-4 px-6 font-semibold text-stone-600 dark:text-stone-400">Standard Box Packing</td>
                <td className="py-4 px-6 text-stone-900 dark:text-stone-100 font-mono">10 Panels per Carton (95.2 sq ft total coverage)</td>
              </tr>
              <tr className="hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors">
                <td className="py-4 px-6 font-semibold text-stone-600 dark:text-stone-400">Interlocking Mechanism</td>
                <td className="py-4 px-6 text-stone-900 dark:text-stone-100">Concealed Tongue & Groove with Stainless Hidden Clips</td>
              </tr>
              <tr className="hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors">
                <td className="py-4 px-6 font-semibold text-stone-600 dark:text-stone-400">Moisture & Pest Proofing</td>
                <td className="py-4 px-6 text-stone-900 dark:text-stone-100 font-semibold text-emerald-600 dark:text-emerald-400">
                  100% Water Impervious • Termite & Borer Proof
                </td>
              </tr>
              <tr className="hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors">
                <td className="py-4 px-6 font-semibold text-stone-600 dark:text-stone-400">Fire Safety Class</td>
                <td className="py-4 px-6 text-stone-900 dark:text-stone-100">Class B1 Flame Retardant (Self-Extinguishing)</td>
              </tr>
              <tr className="hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors">
                <td className="py-4 px-6 font-semibold text-stone-600 dark:text-stone-400">Recommended Applications</td>
                <td className="py-4 px-6 text-stone-900 dark:text-stone-100">
                  Living room TV media walls, bedroom accent backdrops, acoustic diffusion slats, commercial reception pillars
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION 5: FREQUENTLY ASKED QUESTIONS                         */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section className="w-full max-w-5xl mx-auto px-4 sm:px-8 lg:px-12 py-16 sm:py-20 border-t border-stone-200 dark:border-stone-800">
        <FAQ items={PRIMO_FLUTED_FAQS} />
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION 6: RFQ LEAD FORM & FOOTER                             */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section className="w-full px-4 sm:px-8 lg:px-12 py-16 bg-white dark:bg-stone-950 border-t border-stone-200 dark:border-stone-800">
        <div id="rfq-section" className="max-w-4xl mx-auto mb-12">
          <LeadForm
            initialProductName={selectedPanel.name}
            initialProductSku={selectedPanel.code}
            initialMaterial="Primo Fluted 9mm WPC Wall Panels"
          />
        </div>

        <div className="pt-12 border-t border-stone-200 dark:border-stone-800 text-center text-xs text-stone-500">
          <p>© 2026 Wholesaleji Technologies Pvt. Ltd. • Pan-India Architectural Cladding Marketplace • Gurugram Hub</p>
        </div>
      </section>
    </div>
  );
}
