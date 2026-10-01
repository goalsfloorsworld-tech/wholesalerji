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
      {/* SECTION 3: TECHNICAL SPECIFICATIONS & FAQ ACCORDION           */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section className="w-full px-4 sm:px-8 lg:px-12 py-24 sm:py-32 bg-stone-50 dark:bg-stone-950 border-t border-stone-200 dark:border-stone-800">
        <div className="max-w-4xl mx-auto flex flex-col gap-16 lg:gap-24">
          
          {/* Spec Table */}
          <div className="w-full">
            <div className="mb-12">
              <span className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-widest text-stone-500 mb-2 block">
                [ TECHNICAL DATASHEET ]
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-stone-900 dark:text-white tracking-tighter">
                Elite Fluted Engineering Specifications
              </h2>
            </div>

            <div className="border-t border-stone-300 dark:border-stone-700">
              {[
                { label: 'Panel Dimensions', value: '2950 mm × 300 mm (9.6 ft × 1 ft / 12 Inch)' },
                { label: 'Profile Thickness', value: '9.0 MM Architectural Fluted Profile' },
                { label: 'Surface Finish', value: 'Textured Timber / Metallic / High-Gloss UV' },
                { label: 'Coverage per Panel', value: '9.5 SQ FT / PC' },
                { label: 'Box Packaging', value: '10 Panels / Box (95 SQ FT Total)' },
                { label: 'Net Weight', value: '3.2 ±5% Kg / PC (32 Kg / Box)' },
                { label: 'Fire Rating', value: 'Class B1 (Self-Extinguishing Flame Retardant)', highlight: true },
                { label: 'Water Absorption', value: '0.0% (100% Waterproof Seelan Immunity)', highlight: true },
              ].map((spec, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between py-5 border-b border-stone-200 dark:border-stone-800 group hover:bg-stone-100 dark:hover:bg-stone-900/60 transition-colors px-2">
                  <span className="text-sm font-semibold text-stone-600 dark:text-stone-400 mb-1 sm:mb-0 w-1/3">
                    {spec.label}
                  </span>
                  <span className={`text-sm sm:text-right font-medium sm:w-2/3 ${spec.highlight ? 'text-amber-600 dark:text-amber-400' : 'text-stone-900 dark:text-white'}`}>
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="mt-12 flex flex-col sm:flex-row gap-4 items-center sm:justify-end">
              <a
                href="https://wa.me/919999999999?text=Please%20send%20PDF%20Technical%20Data%20Sheet%20for%20Elite%20Fluted%20Panels"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-xs font-mono font-bold uppercase tracking-widest text-stone-600 dark:text-stone-400 hover:text-amber-500 transition-colors"
              >
                Request PDF Spec Sheet <span className="ml-2">→</span>
              </a>
            </div>
          </div>

          {/* Quick FAQ / Mill Terms */}
          <div className="w-full">
            <div className="p-8 sm:p-10 bg-stone-900 text-white shadow-2xl relative overflow-hidden rounded-3xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-bl-full pointer-events-none" />
              <h3 className="text-2xl font-black mb-8">
                Contractor & B2B Purchase Terms
              </h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-bold text-amber-400 mb-2">
                    What is the Minimum Order Quantity (MOQ)?
                  </h4>
                  <p className="text-stone-400 text-sm font-light leading-relaxed">
                    Direct mill dispatch starts at 1 box (10 panels / 95 sq ft). For bulk projects exceeding 500 sq ft, custom tiered pricing applies.
                  </p>
                </div>

                <div className="pt-6 border-t border-stone-800">
                  <h4 className="font-bold text-amber-400 mb-2">
                    Can this be installed on wet/seelan walls?
                  </h4>
                  <p className="text-stone-400 text-sm font-light leading-relaxed">
                    Yes. The virgin polymer matrix is completely non-porous. It creates an impermeable barrier that permanently isolates peeling paint and damp moisture.
                  </p>
                </div>

                <div className="pt-6 border-t border-stone-800">
                  <h4 className="font-bold text-amber-400 mb-2">
                    How fast is dispatch across India?
                  </h4>
                  <p className="text-stone-400 text-sm font-light leading-relaxed">
                    Delhi-NCR orders dispatch within 2 hours. Pan-India shipments to Mumbai, Bangalore, Hyderabad, and Kolkata deliver within 48-72 hours.
                  </p>
                </div>
              </div>

              <div className="mt-10 pt-8 border-t border-stone-800">
                <a
                  href={`https://wa.me/919999999999?text=Inquiring%20about%20Wholesale%20Rate%20for%20Elite%20Fluted%20${encodeURIComponent(selectedPanel?.name || '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 px-6 bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs uppercase tracking-widest text-center transition-colors block"
                >
                  Request Physical Catalog & Swatch Box →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION 4: FREQUENTLY ASKED QUESTIONS                         */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section className="w-full max-w-5xl mx-auto px-4 sm:px-8 lg:px-12 py-24 sm:py-32 border-t border-stone-200 dark:border-stone-800">
        <div className="text-center mb-16">
          <span className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-widest text-stone-500 mb-2 block">
            [ ELITE FLUTED FAQ ]
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-stone-900 dark:text-white tracking-tighter">
            Common Questions
          </h2>
        </div>
        <FAQ items={ELITE_FLUTED_FAQS} />
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION 5: RFQ LEAD FORM & FOOTER                             */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section id="rfq-section" className="w-full px-4 sm:px-8 lg:px-12 py-24 sm:py-32 bg-stone-100 dark:bg-stone-950 border-t border-stone-200 dark:border-stone-800 relative overflow-hidden">
        {/* Architectural abstract background lines */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'linear-gradient(90deg, currentColor 1px, transparent 1px), linear-gradient(currentColor 1px, transparent 1px)', backgroundSize: '100px 100px' }}></div>
        
        <div className="max-w-4xl mx-auto relative z-10 mb-16 text-center">
          <h2 className="text-3xl sm:text-5xl font-black text-stone-900 dark:text-white tracking-tighter mb-4">
            Specify the Elite Fluted Series
          </h2>
          <p className="text-stone-600 dark:text-stone-400 font-light max-w-2xl mx-auto">
            Request a comprehensive B2B quotation including factory-direct pricing, logistical details, and architectural physical samples.
          </p>
        </div>
        <div className="max-w-4xl mx-auto relative z-10 bg-white dark:bg-stone-900 shadow-2xl p-6 sm:p-10 border border-stone-200 dark:border-stone-800">
          <LeadForm
            initialProductName={selectedPanel.name}
            initialProductSku={selectedPanel.code}
            initialMaterial="Elite Fluted 9mm WPC Wall Panels"
          />
        </div>

        <div className="pt-24 text-center text-[10px] sm:text-xs font-mono uppercase tracking-widest text-stone-500">
          <p>© 2026 WholesalerJi Technologies Pvt. Ltd. • Pan-India Architectural Cladding Marketplace • Gurugram Hub</p>
        </div>
      </section>
    </div>
  );
}
