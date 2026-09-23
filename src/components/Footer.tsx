"use client";

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { Mesh, Program, Renderer, Triangle } from 'ogl';

const MAX_POINTS = 64;

const VERTEX_SHADER = `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `
precision highp float;

#define MAX_POINTS 64

uniform vec2 uResolution;
uniform vec2 uPoints[MAX_POINTS];
uniform float uPointCount;
uniform vec3 uColor;
uniform vec3 uSecondaryColor;
uniform float uTrailWidth;
uniform float uTaper;
uniform float uGlowIntensity;
uniform float uGlowSpread;
uniform float uHotspot;
uniform float uBrightness;
uniform float uOpacity;
uniform float uPulseSpeed;
uniform float uNoiseStrength;
uniform float uNormalBlend;
uniform float uTime;
uniform float uFade;

varying vec2 vUv;

float sRGB(float x) {
  if (x <= 0.00031308) return 12.92 * x;
  return 1.055 * pow(x, 1.0 / 2.4) - 0.055;
}

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float filmGrain(vec2 p, float time) {
  float frame = time * 18.0;
  float frameIndex = mod(floor(frame), 256.0);
  float nextFrameIndex = mod(frameIndex + 1.0, 256.0);
  float blend = fract(frame);
  blend = blend * blend * (3.0 - 2.0 * blend);
  vec2 pixel = floor(p);
  float current = hash(pixel + vec2(frameIndex * 17.0, frameIndex * 31.0));
  float next = hash(pixel + vec2(nextFrameIndex * 17.0, nextFrameIndex * 31.0));
  return mix(current, next, blend) * 2.0 - 1.0;
}

void main() {
  vec2 pixel = vUv * uResolution;
  float denominator = max(uPointCount - 1.0, 1.0);
  float strongest = 0.0;
  float strongestCore = 0.0;
  float colorWeight = 0.0;
  vec3 colorSum = vec3(0.0);

  for (int i = 0; i < MAX_POINTS - 1; i++) {
    float index = float(i);
    float active = 1.0 - step(uPointCount - 1.0, index);
    vec2 start = uPoints[i];
    vec2 end = uPoints[i + 1];
    vec2 toPixel = pixel - start;
    vec2 segment = end - start;
    float along = clamp(dot(toPixel, segment) / max(dot(segment, segment), 0.0001), 0.0, 1.0);
    float progress = clamp((index + along) / denominator, 0.0, 1.0);
    float life = pow(max(1.0 - progress, 0.0), mix(0.55, 1.25, uTaper));
    float width = uTrailWidth * mix(1.0, 0.25, pow(progress, mix(0.55, 1.6, uTaper)));
    float distanceToTrail = length(toPixel - segment * along);
    float falloff = max(width * (0.8 + uGlowSpread * 1.4), 0.5);
    float beam = min(1.0, (falloff * falloff) / (distanceToTrail * distanceToTrail + falloff * falloff));
    float core = exp(-pow(distanceToTrail / max(width, 0.5), 2.0) * 2.5);
    float pulseAmount = min(abs(uPulseSpeed), 1.0);
    float pulse = 1.0 + sin(uTime * uPulseSpeed * 3.0 - progress * 11.0) * 0.16 * pulseAmount;
    float intensity = (core + beam * uGlowIntensity * 0.55) * life * pulse * active;
    vec3 segmentColor = mix(uColor, uSecondaryColor, progress);

    strongest = max(strongest, intensity);
    strongestCore = max(strongestCore, core * life * active);
    colorSum += segmentColor * intensity;
    colorWeight += intensity;
  }

  float grain = filmGrain(pixel, uTime);
  float noiseAmount = (1.0 - exp(-uNoiseStrength * 2.2)) * 0.4;
  float alpha = clamp(strongest * uOpacity * uFade, 0.0, 1.0);
  if (alpha < 0.0005) discard;

  vec3 color = colorSum / max(colorWeight, 0.0001);
  color = mix(color, vec3(1.0), smoothstep(0.25, 0.95, strongestCore) * uHotspot);
  float luminance = sRGB(clamp(strongest * uBrightness, 0.0, 1.0));
  luminance *= 1.0 + grain * noiseAmount;
  vec3 additiveColor = color * luminance;
  float normalAlpha = clamp(strongest * uBrightness * uOpacity * uFade, 0.0, 1.0);
  vec3 normalColor = mix(color, vec3(1.0), smoothstep(0.45, 1.0, strongestCore) * uHotspot * 0.35);
  gl_FragColor = vec4(mix(additiveColor, normalColor, uNormalBlend), mix(alpha, normalAlpha, uNormalBlend));
}
`;

const hexToRgb = (hex: string) => {
  let value = (hex || '').replace('#', '').trim();
  if (value.length === 3)
    value = value
      .split('')
      .map(char => char + char)
      .join('');
  const parsed = Number.parseInt(value || '000000', 16);
  return [((parsed >> 16) & 255) / 255, ((parsed >> 8) & 255) / 255, (parsed & 255) / 255];
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const GlowCursor = ({
  color = '#F5AB40', // Brand Amber
  secondaryColor = '#67E8F9', // Cyan contrast or stick to amber? Let's use lighter amber/gold '#FDE68A'
  trailLength = 40,
  trailWidth = 10, // slightly thicker
  trailTaper = 0.8,
  followSpeed = 0.16,
  glowIntensity = 1.9,
  glowSpread = 1.2,
  hotspot = 0.65,
  brightness = 1.25,
  opacity = 1,
  pulseSpeed = 1.1,
  noiseStrength = 0.035,
  idleFade = true,
  idleTimeout = 700,
  fadeDuration = 900,
  blendMode = 'screen' as 'normal' | 'screen' | 'plus-lighter',
  maxDevicePixelRatio = 1.5,
  enabled = true,
  children,
  className = '',
  style,
  ...rest
}: any) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const propsRef = useRef<any>({});

  propsRef.current = {
    color,
    secondaryColor: '#FDE68A', // Custom secondary for brand
    trailLength,
    trailWidth,
    trailTaper,
    followSpeed,
    glowIntensity,
    glowSpread,
    hotspot,
    brightness,
    opacity,
    pulseSpeed,
    noiseStrength,
    idleFade,
    idleTimeout,
    fadeDuration,
    maxDevicePixelRatio,
    blendMode,
    enabled
  };

  useEffect(() => {
    const handleThemeChange = (e: any) => {
      if (propsRef.current) {
        const hex = e.detail;
        propsRef.current.color = hex;
        
        // Compute a lighter version for secondaryColor (similar to amber-200)
        let r = parseInt(hex.slice(1, 3), 16);
        let g = parseInt(hex.slice(3, 5), 16);
        let b = parseInt(hex.slice(5, 7), 16);
        r = Math.min(255, r + (255 - r) * 0.4);
        g = Math.min(255, g + (255 - g) * 0.4);
        b = Math.min(255, b + (255 - b) * 0.4);
        const toHex = (n: number) => Math.round(n).toString(16).padStart(2, '0');
        propsRef.current.secondaryColor = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
      }
    };
    
    // Set initial color if saved
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('custom-theme-color');
      if (saved) handleThemeChange({ detail: saved });
      window.addEventListener('theme-color-changed', handleThemeChange);
      return () => window.removeEventListener('theme-color-changed', handleThemeChange);
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const initialConfig = propsRef.current;
    const renderer = new Renderer({
      canvas,
      alpha: true,
      dpr: Math.min(window.devicePixelRatio || 1, initialConfig.maxDevicePixelRatio)
    });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);

    const pointData = Array(MAX_POINTS * 2).fill(0);
    const points = Array.from({ length: MAX_POINTS }, () => ({ x: 0, y: 0 }));
    const target = { x: 0, y: 0 };
    const head = { x: 0, y: 0 };

    const program = new Program(gl, {
      vertex: VERTEX_SHADER,
      fragment: FRAGMENT_SHADER,
      uniforms: {
        uResolution: { value: [1, 1] },
        uPoints: { value: pointData },
        uPointCount: { value: initialConfig.trailLength },
        uColor: { value: hexToRgb(initialConfig.color) },
        uSecondaryColor: { value: hexToRgb(initialConfig.secondaryColor) },
        uTrailWidth: { value: initialConfig.trailWidth },
        uTaper: { value: initialConfig.trailTaper },
        uGlowIntensity: { value: initialConfig.glowIntensity },
        uGlowSpread: { value: initialConfig.glowSpread },
        uHotspot: { value: initialConfig.hotspot },
        uBrightness: { value: initialConfig.brightness },
        uOpacity: { value: initialConfig.opacity },
        uPulseSpeed: { value: initialConfig.pulseSpeed },
        uNoiseStrength: { value: initialConfig.noiseStrength },
        uNormalBlend: { value: initialConfig.blendMode === 'normal' ? 1 : 0 },
        uTime: { value: 0 },
        uFade: { value: 0 }
      },
      transparent: true,
      depthTest: false,
      depthWrite: false
    });
    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });

    let width = 1;
    let height = 1;
    let initialized = false;
    let pointerInside = false;
    let fade = 0;
    let lastInputTime = performance.now();
    let lastFrameTime = performance.now();
    let raf = 0;
    let destroyed = false;
    let isVisible = true; // Start true, observer will correct it

    const observer = new IntersectionObserver((entries) => {
      isVisible = entries[0].isIntersecting;
      if (isVisible && !destroyed && !raf) {
        lastFrameTime = performance.now();
        lastInputTime = performance.now();
        raf = requestAnimationFrame(render);
      }
    }, { rootMargin: '200px' });
    observer.observe(container);

    const resize = () => {
      width = Math.max(container.clientWidth, 1);
      height = Math.max(container.clientHeight, 1);
      renderer.setSize(width, height);
      program.uniforms.uResolution.value = [width, height];
    };

    const initializeTrail = (x: number, y: number) => {
      target.x = x;
      target.y = y;
      head.x = x;
      head.y = y;
      for (const point of points) {
        point.x = x;
        point.y = y;
      }
      initialized = true;
      fade = 1;
    };

    const updatePointer = (event: any) => {
      const rect = container.getBoundingClientRect();
      const x = clamp(event.clientX - rect.left, 0, rect.width);
      const y = clamp(rect.height - (event.clientY - rect.top), 0, rect.height);
      if (!initialized) initializeTrail(x, y);
      target.x = x;
      target.y = y;
      pointerInside = true;
      lastInputTime = performance.now();
    };

    const onPointerLeave = () => {
      pointerInside = false;
      lastInputTime = performance.now();
    };

    const render = (now: number) => {
      if (destroyed || !isVisible) {
        raf = 0;
        return;
      }
      const config = propsRef.current;
      const delta = Math.min((now - lastFrameTime) / 16.667, 3);
      lastFrameTime = now;

      if (initialized) {
        const headEase = 1 - Math.pow(1 - clamp(config.followSpeed, 0.01, 0.99), delta);
        const chainBase = clamp(0.28 + config.followSpeed * 0.35, 0.08, 0.92);
        const chainEase = 1 - Math.pow(1 - chainBase, delta);
        head.x += (target.x - head.x) * headEase;
        head.y += (target.y - head.y) * headEase;
        points[0].x = head.x;
        points[0].y = head.y;

        for (let i = 1; i < MAX_POINTS; i++) {
          points[i].x += (points[i - 1].x - points[i].x) * chainEase;
          points[i].y += (points[i - 1].y - points[i].y) * chainEase;
        }

        for (let i = 0; i < MAX_POINTS; i++) {
          pointData[i * 2] = points[i].x;
          pointData[i * 2 + 1] = points[i].y;
        }
      }

      const idleFor = now - lastInputTime;
      const shouldFade = config.idleFade && (!pointerInside || idleFor > config.idleTimeout);
      const fadeStep = (16.667 * delta) / Math.max(config.fadeDuration, 16);
      const fadeTarget = initialized && config.enabled && !shouldFade ? 1 : 0;
      fade += (fadeTarget - fade) * Math.min(1, fadeStep * 7);

      program.uniforms.uPointCount.value = clamp(Math.round(config.trailLength), 2, MAX_POINTS);
      program.uniforms.uColor.value = hexToRgb(config.color);
      program.uniforms.uSecondaryColor.value = hexToRgb(config.secondaryColor);
      program.uniforms.uTrailWidth.value = Math.max(config.trailWidth, 0.1);
      program.uniforms.uTaper.value = clamp(config.trailTaper, 0, 1);
      program.uniforms.uGlowIntensity.value = Math.max(config.glowIntensity, 0);
      program.uniforms.uGlowSpread.value = Math.max(config.glowSpread, 0);
      program.uniforms.uHotspot.value = clamp(config.hotspot, 0, 1);
      program.uniforms.uBrightness.value = Math.max(config.brightness, 0);
      program.uniforms.uOpacity.value = clamp(config.opacity, 0, 1);
      program.uniforms.uPulseSpeed.value = config.pulseSpeed;
      program.uniforms.uNoiseStrength.value = clamp(config.noiseStrength, 0, 1);
      program.uniforms.uNormalBlend.value = config.blendMode === 'normal' ? 1 : 0;
      program.uniforms.uTime.value = now * 0.001;
      program.uniforms.uFade.value = fade;

      renderer.render({ scene: mesh });
      raf = requestAnimationFrame(render);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    container.addEventListener('pointermove', updatePointer);
    container.addEventListener('pointerenter', updatePointer);
    container.addEventListener('pointerleave', onPointerLeave);
    resize();
    raf = requestAnimationFrame(render);

    return () => {
      destroyed = true;
      cancelAnimationFrame(raf);
      observer.disconnect();
      resizeObserver.disconnect();
      container.removeEventListener('pointermove', updatePointer);
      container.removeEventListener('pointerenter', updatePointer);
      container.removeEventListener('pointerleave', onPointerLeave);
      mesh.geometry.remove();
      program.remove();
    };
  }, [maxDevicePixelRatio]);

  return (
    <div ref={containerRef} className={`glow-cursor${className ? ` ${className}` : ''}`} style={style} {...rest}>
      <canvas ref={canvasRef} className="glow-cursor__canvas" style={{ mixBlendMode: blendMode }} aria-hidden="true" />
      {children && <div className="glow-cursor__content">{children}</div>}
    </div>
  );
};


export default function Footer() {
  return (
    <footer className="relative bg-stone-950 text-stone-300 overflow-hidden border-t border-stone-800 selection:bg-amber-500 selection:text-stone-950 flex-shrink-0">
      <GlowCursor
        color="#F5AB40"
        secondaryColor="#FDE68A"
        trailLength={40}
        trailWidth={8}
        trailTaper={0.8}
        followSpeed={0.4} // Increased for faster response
        glowIntensity={1.9}
        glowSpread={1.2}
        hotspot={0.65}
        brightness={1.25}
        opacity={1}
        pulseSpeed={1.1}
        noiseStrength={0.035}
        idleFade
        idleTimeout={700}
        fadeDuration={900}
        blendMode="screen"
        className="pt-12 pb-6 w-full h-full"
      >
        <div className="absolute inset-0 bg-[url('/assets/noise.png')] opacity-[0.03] mix-blend-overlay pointer-events-none" />

        <div className="relative z-10 w-full px-4 sm:px-8 lg:px-12 mt-2 pointer-events-none">
          <div className="grid grid-cols-2 lg:grid-cols-12 gap-8 md:gap-10 lg:gap-8 mb-8">
            
            {/* 1. Brand Column (Left) */}
            <div className="col-span-2 lg:col-span-4 xl:col-span-4 flex flex-col items-start pointer-events-auto">
              <Link href="/" className="flex items-center gap-2.5 mb-6 group">
                <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-amber-500/40 shadow-sm flex-shrink-0 bg-[#1B222B]">
                  <img
                    src="/assets/wholsalerji-logo.jpeg"
                    alt="Wholesaleji Logo"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <span className="text-2xl font-black tracking-tight text-white flex items-center">
                  WHOLESALE<span className="text-amber-500 group-hover:text-amber-300 transition-colors">JI</span>
                </span>
              </Link>
              <p className="text-sm text-stone-400 leading-relaxed max-w-sm pointer-events-none">
                Transforming interiors across India with premium architectural wall panels. We bridge the gap between world-class manufacturing and your site, eliminating the middleman.
              </p>
            </div>

            {/* 2. Quick Links (Center-Left) */}
            <div className="col-span-1 lg:col-span-2 xl:col-span-2 pointer-events-auto">
              <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest relative inline-block">
                Company
                <span className="absolute -bottom-2 left-0 w-1/2 h-0.5 bg-amber-500 rounded-full" />
              </h4>
              <ul className="space-y-4 text-sm">
                <li>
                  <Link href="/about" className="text-stone-400 hover:text-amber-400 transition-colors inline-flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-stone-700 group-hover:bg-amber-500 transition-colors" />
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-stone-400 hover:text-amber-400 transition-colors inline-flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-stone-700 group-hover:bg-amber-500 transition-colors" />
                    Insights & Blog
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-stone-400 hover:text-amber-400 transition-colors inline-flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-stone-700 group-hover:bg-amber-500 transition-colors" />
                    Contact Support
                  </Link>
                </li>
              </ul>
            </div>

            {/* 3. Catalogs (Center-Right) */}
            <div className="col-span-1 lg:col-span-3 xl:col-span-3 pointer-events-auto">
               <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest relative inline-block">
                Collections
                <span className="absolute -bottom-2 left-0 w-1/2 h-0.5 bg-amber-500 rounded-full" />
              </h4>
              <ul className="space-y-4 text-sm">
                <li>
                  <Link href="/products/primo-panels" className="text-stone-400 hover:text-amber-400 transition-colors inline-flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-stone-700 group-hover:bg-amber-500 transition-colors" />
                    Primo Panels
                  </Link>
                </li>
                <li>
                  <Link href="/products/elite-panels" className="text-stone-400 hover:text-amber-400 transition-colors inline-flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-stone-700 group-hover:bg-amber-500 transition-colors" />
                    Elite PVC Panels
                  </Link>
                </li>
                <li>
                  <Link href="/products/primo-fluted-panels" className="text-stone-400 hover:text-amber-400 transition-colors inline-flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-stone-700 group-hover:bg-amber-500 transition-colors" />
                    Primo Fluted Panels
                  </Link>
                </li>
                <li>
                  <Link href="/products/elite-fluted-panels" className="text-stone-400 hover:text-amber-400 transition-colors inline-flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-stone-700 group-hover:bg-amber-500 transition-colors" />
                    Elite Fluted Panels
                  </Link>
                </li>
              </ul>
            </div>

            {/* 4. Contact Details (Extreme Right) */}
            <div className="col-span-2 lg:col-span-3 xl:col-span-3 flex flex-col items-start pointer-events-auto">
              <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest relative inline-block">
                Contact Us
                <span className="absolute -bottom-2 left-0 w-1/2 h-0.5 bg-amber-500 rounded-full" />
              </h4>
              <div className="space-y-4 text-sm flex flex-col items-start">
                <a href="tel:+919217400163" className="flex items-center gap-3 text-stone-300 hover:text-amber-400 transition-colors group">
                  <div className="w-8 h-8 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center group-hover:border-amber-500/50 transition-colors">
                    <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <span className="font-medium tracking-wide">+91 92174 00163</span>
                </a>
                <a href="mailto:sales@wholesaleji.com" className="flex items-center gap-3 text-stone-300 hover:text-amber-400 transition-colors group">
                  <div className="w-8 h-8 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center group-hover:border-amber-500/50 transition-colors">
                    <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="font-medium tracking-wide">sales@wholesaleji.com</span>
                </a>
                <div className="flex items-start gap-3 text-stone-300 group pt-1 pointer-events-none text-left">
                  <div className="w-8 h-8 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:border-amber-500/50 transition-colors">
                    <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <span className="font-medium leading-relaxed max-w-[200px] group-hover:text-amber-400 transition-colors">Wholesaleji Central Warehouse, Sector 34, Gurugram, Haryana 122004</span>
                </div>
              </div>
            </div>
          </div>

          {/* --- Massive Typography resting exactly on the thin line --- */}
          <div className="w-full flex justify-center mt-10 mb-0 select-none pointer-events-none relative top-[2px]">
            <span className="text-[11.5vw] sm:text-[10vw] md:text-[9vw] lg:text-[110px] xl:text-[120px] font-black uppercase tracking-tighter text-stone-800/50 dark:text-stone-800/60 leading-none whitespace-nowrap">
              WHOLESALEJI
            </span>
          </div>

          <div className="border-t border-stone-800/60 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 pointer-events-auto text-center md:text-left">
            <p className="text-xs text-stone-500">
              &copy; {new Date().getFullYear()} Wholesaleji Private Limited. All rights reserved.
            </p>
            <div className="flex items-center justify-center gap-4 text-xs text-stone-500">
              <span className="hover:text-amber-500 cursor-pointer transition-colors">Privacy Policy</span>
              <span>•</span>
              <span className="hover:text-amber-500 cursor-pointer transition-colors">Terms of Service</span>
            </div>
          </div>
        </div>
      </GlowCursor>
    </footer>
  );
}
