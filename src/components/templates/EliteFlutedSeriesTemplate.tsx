'use client';

import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { PanelProduct } from '@/data/types';
import {
  ELITE_FLUTED_WALL_PANELS,
  ELITE_FLUTED_FAQS,
} from '@/data/eliteFlutedPanelsData';
import ProductShowcase from '@/components/ProductShowcase';
import LeadForm from '@/components/client/LeadForm';
import FAQ from '@/components/FAQ';

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
    vec3 bg = mix(vec3(0.03, 0.03, 0.03), vec3(0.1, 0.07, 0.04), uv.y);
    
    // Line color (amber / gold / wood tones)
    vec3 lineColor = vec3(0.8, 0.5, 0.2) * (0.5 + 0.5 * sin(n * 20.0 - uTime));

    // Combine
    vec3 col = mix(bg, lineColor, lines);
    
    // Add subtle vignette
    float vignette = 1.0 - smoothstep(0.5, 1.5, length(uv - 0.5));
    col *= vignette;
    
    gl_FragColor = vec4(col, 1.0);
}
`;

const TopoShader = React.memo(function TopoShader() {
  const mountRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef<[number, number]>([0.5, 0.5]);

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
    };

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
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

  return (
    <div className="w-full bg-white dark:bg-stone-950 text-stone-900 dark:text-stone-100 overflow-x-hidden">
      
      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION 1: TOPOGRAPHIC HERO SECTION                           */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section className="relative w-full min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center bg-stone-950 text-white overflow-hidden select-none border-b border-stone-800">
        
        {/* Topo Shader Canvas Background */}
        <div className="absolute inset-0 z-0">
          <TopoShader />
        </div>

        {/* Center Typography */}
        <div className="relative z-10 w-full flex-1 flex flex-col items-center justify-center px-4 text-center pointer-events-none">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-900/80 backdrop-blur-md border border-amber-500/30 text-xs font-semibold tracking-widest text-amber-300 uppercase mb-4 shadow-lg shadow-black/60 pointer-events-auto">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
            Fluted Design Series
          </div>

          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight uppercase text-transparent bg-clip-text bg-gradient-to-b from-white via-stone-100 to-stone-400 drop-shadow-[0_12px_45px_rgba(0,0,0,0.95)]">
            ELITE FLUTED
          </h1>

          <p className="mt-4 text-base sm:text-xl md:text-2xl text-stone-200 font-light tracking-wide max-w-2xl mx-auto drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">
            Premium Textured Interior Wall Cladding • 9MM Profile
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5 pointer-events-auto">
            <a
              href="#showcase"
              className="px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm sm:text-base tracking-wide transition-all duration-200 shadow-xl shadow-amber-500/25 hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              <span>Explore The Collection</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </a>
          </div>

          <div className="mt-6 flex items-center gap-2 text-xs text-stone-400/80 tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-stone-400 animate-pulse" />
            <span>Interactive Topographic Fluid Surface</span>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION 2: PRODUCT SHOWCASE                                   */}
      {/* ───────────────────────────────────────────────────────────── */}
      <ProductShowcase
        series="elite-fluted" // We'll need to make sure this key is handled, but ProductShowcase falls back gracefully. Wait, let's pass explicit props to bypass defaults.
        allShades={shades}
        title="Elite Fluted Series"
        subtitle="Premium Textured Finishes"
        description="Experience the architectural depth of our 9MM fluted profile. Browse through live room environments and examine the seamless interlocking system."
        initialShadeId={initialData?.code || initialData?.id}
        onShadeChange={(shade) => setSelectedPanel(shade)}
        sectionId="showcase"
      />

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION 3: MINIMALIST FAQ (EXCLUSIVE)                         */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-stone-950">
        <FAQ
          items={ELITE_FLUTED_FAQS}
          subtitle="Client Queries"
          title="Frequently Asked Questions"
        />
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION 4: RFQ LEAD FORM & FOOTER                             */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section className="w-full px-4 sm:px-8 lg:px-12 py-16 bg-stone-50 dark:bg-stone-900/50 border-t border-stone-200 dark:border-stone-800">
        <div id="rfq-section" className="max-w-4xl mx-auto mb-12">
          <LeadForm
            initialProductName={selectedPanel.name}
            initialProductSku={selectedPanel.code}
            initialMaterial="Elite Fluted 9mm WPC Wall Panels"
          />
        </div>

        <div className="pt-12 border-t border-stone-200 dark:border-stone-800 text-center text-xs text-stone-500">
          <p>© 2026 Wholesaleji Technologies Pvt. Ltd. • Pan-India Architectural Cladding Marketplace • Gurugram Hub</p>
        </div>
      </section>
    </div>
  );
}
