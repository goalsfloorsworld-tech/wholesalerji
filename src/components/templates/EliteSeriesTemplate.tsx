'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { PanelProduct } from '@/data/types';
import {
  ELITE_WALL_PANELS,
  ELITE_ACRONYM_DATA,
  ELITE_FAQS,
} from '@/data/elitePanelsData';
import ProductShowcase from '@/components/ProductShowcase';
import LeadForm from '@/components/client/LeadForm';
import FAQ from '@/components/FAQ';

// ─────────────────────────────────────────────────────────────────────────────
// PARTICLE TEXT ENGINE (EMBEDDED DIRECTLY IN TEMPLATE, ZERO EXTERNAL CSS)
// ─────────────────────────────────────────────────────────────────────────────
interface RgbColor {
  r: number;
  g: number;
  b: number;
}

const hexToRgb = (hex: string): RgbColor | null => {
  const clean = hex.replace('#', '').trim();
  if (!/^[0-9a-fA-F]{6}$/.test(clean)) return null;
  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16),
  };
};

const mixRgb = (from: RgbColor, to: RgbColor, amount: number): RgbColor => ({
  r: Math.round(from.r + (to.r - from.r) * amount),
  g: Math.round(from.g + (to.g - from.g) * amount),
  b: Math.round(from.b + (to.b - from.b) * amount),
});

const rgbToCss = (rgb: RgbColor): string => `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
const clamp = (value: number, min: number, max: number): number => Math.min(Math.max(value, min), max);
const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);
const easeOutQuart = (t: number): number => 1 - Math.pow(1 - t, 4);

const resolveFontSize = (
  value: number | string,
  container: HTMLElement,
  fontWeight: number | string,
  fontFamily: string
): number => {
  if (typeof value === 'number') return value;

  const probe = document.createElement('span');
  probe.textContent = 'M';
  probe.style.position = 'absolute';
  probe.style.visibility = 'hidden';
  probe.style.pointerEvents = 'none';
  probe.style.fontSize = value;
  probe.style.fontWeight = String(fontWeight);
  probe.style.fontFamily = fontFamily;
  container.appendChild(probe);
  const size = parseFloat(window.getComputedStyle(probe).fontSize) || 96;
  probe.remove();
  return size;
};

const waitForFonts = async (font: string): Promise<void> => {
  if (!('fonts' in document)) return;
  try {
    await document.fonts.load(font);
  } catch {}
  await document.fonts.ready;
};

interface Particle {
  x: number;
  y: number;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  size: number;
  color: string;
  seed: number;
  depth: number;
  delay: number;
}

interface ParticleTextProps {
  text?: string;
  particleSize?: number;
  density?: number;
  color?: string;
  highlightColor?: string;
  scatter?: number;
  gatherDuration?: number;
  stagger?: number;
  pointerRepel?: number;
  repelRadius?: number;
  idleDrift?: number;
  fontSize?: number | string;
  fontWeight?: number | string;
  fontFamily?: string;
  glow?: boolean;
  className?: string;
}

const ParticleText = React.memo(function ParticleText({
  text = 'ELITE',
  particleSize = 2.4,
  density = 3.2,
  color = '#ffffff',
  highlightColor = 'var(--color-amber-500, #F5AB40)',
  scatter = 260,
  gatherDuration = 1400,
  stagger = 300,
  pointerRepel = 72,
  repelRadius = 145,
  idleDrift = 0.45,
  fontSize = 'clamp(6rem, 24vw, 16rem)',
  fontWeight = 900,
  fontFamily = 'Arial, Helvetica, sans-serif',
  glow = true,
  className = '',
}: ParticleTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Strict one-time assembly animation on initial page load
  const hasGatheredRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return undefined;

    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    let particles: Particle[] = [];
    let animationFrame: number | null = null;
    let resizeFrame: number | null = null;
    let buildId = 0;
    let gathering = false;
    let gatherStart = 0;
    let reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    let width = 0;
    let height = 0;
    let dpr = 1;

    const pointer = {
      active: false,
      x: 0,
      y: 0,
      smoothX: 0,
      smoothY: 0,
    };

    // Gather once cleanly on mount from beyond the 4 outer screen borders
    const startGather = () => {
      if (!particles.length) return;

      const now = performance.now();
      const marginX = Math.max(200, width * 0.18);
      const marginY = Math.max(180, height * 0.3);

      particles.forEach((particle, index) => {
        if (reducedMotion) {
          particle.x = particle.targetX;
          particle.y = particle.targetY;
          particle.startX = particle.targetX;
          particle.startY = particle.targetY;
          particle.delay = 0;
          return;
        }

        // Evenly distribute particle origins well beyond the 4 outer screen borders:
        // 0 = Top, 1 = Right, 2 = Bottom, 3 = Left
        const edge = (index + Math.floor(particle.seed * 4)) % 4;
        let sx = 0;
        let sy = 0;

        if (edge === 0) {
          sx = -marginX + particle.seed * (width + marginX * 2);
          sy = -marginY - particle.depth * 260;
        } else if (edge === 1) {
          sx = width + marginX + particle.depth * 260;
          sy = -marginY + particle.seed * (height + marginY * 2);
        } else if (edge === 2) {
          sx = -marginX + particle.seed * (width + marginX * 2);
          sy = height + marginY + particle.depth * 260;
        } else {
          sx = -marginX - particle.depth * 260;
          sy = -marginY + particle.seed * (height + marginY * 2);
        }

        particle.x = sx;
        particle.y = sy;
        particle.startX = sx;
        particle.startY = sy;
        particle.delay = particle.seed * stagger;
      });

      gatherStart = now;
      gathering = true;
    };

    const drawParticle = (particle: Particle) => {
      const size = particle.size;
      ctx.fillStyle = particle.color;

      if (size <= 2.1) {
        ctx.fillRect(particle.x - size / 2, particle.y - size / 2, size, size);
        return;
      }

      ctx.beginPath();
      ctx.arc(particle.x, particle.y, size / 2, 0, Math.PI * 2);
      ctx.fill();
    };

    const render = (now: number) => {
      ctx.clearRect(0, 0, width, height);

      if (glow && !reducedMotion) {
        ctx.shadowBlur = particleSize * 2.5;
        ctx.shadowColor = highlightColor;
      } else {
        ctx.shadowBlur = 0;
      }

      // Smooth pointer tracking
      pointer.smoothX += (pointer.x - pointer.smoothX) * 0.12;
      pointer.smoothY += (pointer.y - pointer.smoothY) * 0.12;

      let complete = true;

      particles.forEach((particle) => {
        let baseX = particle.targetX;
        let baseY = particle.targetY;
        let progress = 1;

        if (gathering) {
          const local = (now - gatherStart - particle.delay) / Math.max(1, reducedMotion ? 1 : gatherDuration);
          progress = clamp(local, 0, 1);
          const eased = easeOutQuart(progress);
          baseX = particle.startX + (particle.targetX - particle.startX) * eased;
          baseY = particle.startY + (particle.targetY - particle.startY) * eased;
          if (progress < 1) complete = false;
        } else if (!reducedMotion && idleDrift > 0) {
          const driftTime = now * 0.0008;
          baseX += Math.sin(driftTime + particle.seed * 6.28) * idleDrift * particle.depth;
          baseY += Math.cos(driftTime * 0.8 + particle.depth * 6.28) * idleDrift * particle.depth;
        }

        // Ultra-smooth interactive magnetic cursor repel (Raised Cosine Hann Window)
        if (pointer.active && !reducedMotion && pointerRepel > 0 && repelRadius > 0) {
          const dx = baseX - pointer.smoothX;
          const dy = baseY - pointer.smoothY;
          const distance = Math.hypot(dx, dy);
          if (distance < repelRadius) {
            const ratio = distance / repelRadius;
            const smoothFactor = 0.5 * (1 + Math.cos(ratio * Math.PI));
            const safeDist = distance + 16;
            const force = smoothFactor * pointerRepel;
            baseX += (dx / safeDist) * force;
            baseY += (dy / safeDist) * force;
          }
        }

        // Silky particle easing: responsive while gathering, liquid-smooth during interaction
        const follow = reducedMotion ? 1 : (gathering ? 0.20 : 0.12);
        particle.x += (baseX - particle.x) * follow;
        particle.y += (baseY - particle.y) * follow;

        ctx.globalAlpha = clamp(0.35 + progress * 0.65, 0, 1);
        drawParticle(particle);
      });

      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;

      if (gathering && complete) {
        gathering = false;
      }

      animationFrame = window.requestAnimationFrame(render);
    };

    const ensureRenderLoop = () => {
      if (animationFrame === null) {
        animationFrame = window.requestAnimationFrame(render);
      }
    };

    const sampleText = async () => {
      const currentBuild = ++buildId;
      const rect = container.getBoundingClientRect();
      width = Math.floor(rect.width);
      height = Math.floor(rect.height);

      if (width <= 0 || height <= 0) return;

      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const computed = window.getComputedStyle(container);
      const resolvedFamily = fontFamily === 'inherit' ? computed.fontFamily || 'sans-serif' : fontFamily;
      let resolvedSize = resolveFontSize(fontSize, container, fontWeight, resolvedFamily);
      let font = `${fontWeight} ${resolvedSize}px ${resolvedFamily}`;

      await waitForFonts(font);
      if (currentBuild !== buildId) return;

      const offscreen = document.createElement('canvas');
      const offCtx = offscreen.getContext('2d', { willReadFrequently: true });
      if (!offCtx) return;

      const content = String(text || ' ');
      const maxTextWidth = width * 0.94;
      const maxTextHeight = height * 0.88;
      offCtx.font = font;
      let metrics = offCtx.measureText(content);
      const measuredWidth = Math.max(1, metrics.width);
      const approxHeight = resolvedSize * 1.05;

      const scaleW = measuredWidth > maxTextWidth ? maxTextWidth / measuredWidth : 1;
      const scaleH = approxHeight > maxTextHeight ? maxTextHeight / approxHeight : 1;
      const scale = Math.min(scaleW, scaleH);

      if (scale < 1) {
        resolvedSize = Math.max(24, Math.floor(resolvedSize * scale));
        font = `${fontWeight} ${resolvedSize}px ${resolvedFamily}`;
        await waitForFonts(font);
        if (currentBuild !== buildId) return;
        offCtx.font = font;
        metrics = offCtx.measureText(content);
      }

      const left = Math.ceil(metrics.actualBoundingBoxLeft || 0);
      const right = Math.ceil(metrics.actualBoundingBoxRight || metrics.width);
      const ascent = Math.ceil(metrics.actualBoundingBoxAscent || resolvedSize * 0.78);
      const descent = Math.ceil(metrics.actualBoundingBoxDescent || resolvedSize * 0.22);
      const padding = Math.max(16, Math.ceil(resolvedSize * 0.1));
      const textWidth = Math.max(1, left + right);
      const textHeight = Math.max(1, ascent + descent);

      offscreen.width = textWidth + padding * 2;
      offscreen.height = textHeight + padding * 2;
      offCtx.clearRect(0, 0, offscreen.width, offscreen.height);
      offCtx.font = font;
      offCtx.textAlign = 'left';
      offCtx.textBaseline = 'alphabetic';
      offCtx.fillStyle = '#ffffff';
      offCtx.fillText(content, padding - left, padding + ascent);

      const imageData = offCtx.getImageData(0, 0, offscreen.width, offscreen.height);
      const targets: { x: number; y: number; alpha: number }[] = [];
      // Uniform 2D grid spacing: ensures mathematically identical dot alignment across all rows and letters
      const gridSpacing = Math.max(3.6, Math.min(4.8, resolvedSize * 0.024));

      for (let y = 0; y < offscreen.height; y += gridSpacing) {
        const rowY = Math.floor(y);
        for (let x = 0; x < offscreen.width; x += gridSpacing) {
          const colX = Math.floor(x);
          const idx = (rowY * offscreen.width + colX) * 4;
          const alpha = imageData.data[idx + 3];
          if (alpha > 75) {
            targets.push({
              x: width / 2 - offscreen.width / 2 + x,
              y: height / 2 - offscreen.height / 2 + y,
              alpha: alpha / 255,
            });
          }
        }
      }

      const baseRgb = hexToRgb(color);
      const highlightRgb = hexToRgb(highlightColor);
      const isAlreadyGathered = hasGatheredRef.current;
      const marginX = Math.max(200, width * 0.18);
      const marginY = Math.max(180, height * 0.3);

      particles = targets.map((target, index) => {
        const seed = ((index * 9301 + 49297) % 233280) / 233280;
        const depth = 0.45 + (((index * 233 + 97) % 1000) / 1000) * 0.9;
        const blend = baseRgb && highlightRgb ? clamp(target.x / Math.max(1, width) + (seed - 0.5) * 0.35, 0, 1) : 0;
        const particleColor = baseRgb && highlightRgb ? rgbToCss(mixRgb(baseRgb, highlightRgb, blend)) : color;

        // Spawn positions along the 4 outer screen borders (Top, Right, Bottom, Left)
        const edge = (index + Math.floor(seed * 4)) % 4;
        let sx = 0;
        let sy = 0;

        if (edge === 0) {
          sx = -marginX + seed * (width + marginX * 2);
          sy = -marginY - depth * 260;
        } else if (edge === 1) {
          sx = width + marginX + depth * 260;
          sy = -marginY + seed * (height + marginY * 2);
        } else if (edge === 2) {
          sx = -marginX + seed * (width + marginX * 2);
          sy = height + marginY + depth * 260;
        } else {
          sx = -marginX - depth * 260;
          sy = -marginY + seed * (height + marginY * 2);
        }

        return {
          x: reducedMotion || isAlreadyGathered ? target.x : sx,
          y: reducedMotion || isAlreadyGathered ? target.y : sy,
          startX: sx,
          startY: sy,
          targetX: target.x,
          targetY: target.y,
          size: Math.max(0.8, particleSize * (0.8 + target.alpha * 0.4)),
          color: particleColor,
          seed,
          depth,
          delay: seed * stagger,
        };
      });

      if (reducedMotion) {
        particles.forEach((particle) => {
          particle.x = particle.targetX;
          particle.y = particle.targetY;
          particle.startX = particle.targetX;
          particle.startY = particle.targetY;
          particle.delay = 0;
        });
        gathering = false;
      } else if (!hasGatheredRef.current) {
        // ONLY ONE-TIME SCATTER/GATHER ON INITIAL PAGE LOAD
        hasGatheredRef.current = true;
        startGather();
      } else {
        // Keep particles assembled without re-scattering
        particles.forEach((particle) => {
          particle.x = particle.targetX;
          particle.y = particle.targetY;
          particle.startX = particle.targetX;
          particle.startY = particle.targetY;
        });
        gathering = false;
      }

      ensureRenderLoop();
    };

    const queueSample = () => {
      if (resizeFrame) window.cancelAnimationFrame(resizeFrame);
      resizeFrame = window.requestAnimationFrame(() => {
        if (!container) return;
        const rect = container.getBoundingClientRect();
        const newW = Math.floor(rect.width);
        const newH = Math.floor(rect.height);
        if (Math.abs(newW - width) > 2 || Math.abs(newH - height) > 2) {
          sampleText();
        }
      });
    };

    const handlePointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const px = event.clientX - rect.left;
      const py = event.clientY - rect.top;
      pointer.x = px;
      pointer.y = py;
      if (!pointer.active) {
        pointer.smoothX = px;
        pointer.smoothY = py;
      }
      pointer.active = true;
    };

    const handlePointerLeave = () => {
      pointer.active = false;
    };

    const handlePointerEnter = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const px = event.clientX - rect.left;
      const py = event.clientY - rect.top;
      pointer.x = px;
      pointer.y = py;
      pointer.smoothX = px; // Snap immediately so it doesn't sweep across the canvas
      pointer.smoothY = py;
      pointer.active = true;
    };

    const reduceMotionQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    const handleReduceMotionChange = (event: MediaQueryListEvent) => {
      reducedMotion = event.matches;
      sampleText();
    };

    reduceMotionQuery?.addEventListener('change', handleReduceMotionChange);
    canvas.addEventListener('pointerenter', handlePointerEnter);
    canvas.addEventListener('pointermove', handlePointerMove);
    canvas.addEventListener('pointerleave', handlePointerLeave);

    const resizeObserver = new ResizeObserver(queueSample);
    resizeObserver.observe(container);
    sampleText();

    return () => {
      buildId += 1;
      resizeObserver.disconnect();
      reduceMotionQuery?.removeEventListener('change', handleReduceMotionChange);
      canvas.removeEventListener('pointerenter', handlePointerEnter);
      canvas.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('pointerleave', handlePointerLeave);

      if (animationFrame !== null) window.cancelAnimationFrame(animationFrame);
      if (resizeFrame !== null) window.cancelAnimationFrame(resizeFrame);
    };
  }, [
    text,
    particleSize,
    density,
    color,
    highlightColor,
    scatter,
    gatherDuration,
    stagger,
    pointerRepel,
    repelRadius,
    idleDrift,
    fontSize,
    fontWeight,
    fontFamily,
    glow,
  ]);

  return (
    <div
      ref={containerRef}
      className={`relative block w-full h-full min-h-[280px] [touch-action:none] [isolation:isolate] ${className}`}
      aria-label={text}
    >
      <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full" aria-hidden="true" />
      <span className="sr-only">{text}</span>
    </div>
  );
});

interface EliteSeriesTemplateProps {
  initialData?: PanelProduct;
  allShades?: PanelProduct[];
}

export default function EliteSeriesTemplate({
  initialData,
  allShades = ELITE_WALL_PANELS,
}: EliteSeriesTemplateProps) {
  const shades = allShades && allShades.length > 0 ? allShades : ELITE_WALL_PANELS;

  // Resolve initial shade
  const initialIndex = Math.max(
    0,
    shades.findIndex(
      (s) =>
        s.code.toLowerCase() === (initialData?.code || '').toLowerCase() ||
        s.id.toLowerCase() === (initialData?.id || '').toLowerCase()
    )
  );

  const [selectedPanel, setSelectedPanel] = useState<PanelProduct>(shades[initialIndex >= 0 ? initialIndex : 0]);
  const [activeAcronymStep, setActiveAcronymStep] = useState(0);

  // Dynamic WhatsApp quotation link generator for catalog request
  const getWhatsAppRFQLink = (panel: PanelProduct, qty: number) => {
    const totalEst = qty * panel.pricePerPiece;
    const msg = encodeURIComponent(
      `Hello Wholesaleji Team,\n\nI want to place an RFQ / Sample Request for Elite Panels:\n\n• Panel Code: ${panel.code} (${panel.name})\n• Finish: ${panel.finishType} (12 Inch / 5mm High-Gloss)\n• Quantity: ${qty} pieces (~${Math.round(qty * 9.5)} sq ft)\n• Approx Value: ₹${totalEst.toLocaleString('en-IN')}\n\nPlease share delivery timeline and B2B GST invoice details.`
    );
    return `https://wa.me/919999999999?text=${msg}`;
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
            name: 'Elite Panels Series - 12 Inch UV High-Gloss Marble Wall Panels',
            description:
              'Elite PVC Wall Panels (5mm x 300mm) provide high-gloss Italian marble, metallic, and designer floral cladding with 100% moisture barrier protection.',
            brand: {
              '@type': 'Brand',
              name: 'Goals Floors / Wholesaleji',
            },
            offers: {
              '@type': 'AggregateOffer',
              priceCurrency: 'INR',
              lowPrice: '549',
              highPrice: '549',
              offerCount: '12',
              availability: 'https://schema.org/InStock',
            },
          }),
        }}
      />

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION 1: HERO WITH PARTICLE TEXT                            */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section className="relative w-full min-h-[calc(100vh-4rem)] flex flex-col justify-between items-center bg-stone-950 text-white overflow-hidden select-none border-b border-stone-800">
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(245,171,64,0.12)_0%,rgba(10,10,10,0.95)_75%,#0a0a0a_100%)] pointer-events-none" />

        {/* Semantic H1 for SEO */}
        <h1 className="sr-only">
          Elite Panels - Luxury UV High-Gloss Italian Marble & Metallic Wall Panels | Wholesaleji
        </h1>

        {/* Top spacer for optical balance */}
        <div className="w-full pt-4 sm:pt-6" />

        {/* ParticleText Canvas - Expands to fill available viewport height */}
        <div className="relative z-10 w-full flex-1 flex items-center justify-center min-h-[360px] sm:min-h-[440px] md:min-h-[500px]">
          <ParticleText
            text="ELITE"
            particleSize={2.4}
            density={3.6}
            color="#ffffff"
            highlightColor="var(--color-amber-500, #F5AB40)"
            scatter={260}
            gatherDuration={1600}
            stagger={350}
            pointerRepel={75}
            repelRadius={140}
            idleDrift={0.35}
            fontSize="clamp(6.5rem, 24vw, 17rem)"
            fontWeight={900}
            fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
            glow={true}
            className="w-full h-full"
          />
        </div>

        {/* Minimal Clean Scroll Down Indicator - Right at the bottom end of the screen */}
        <div className="relative z-10 pb-5 sm:pb-7 flex items-center justify-center">
          <a
            href="#showcase"
            className="inline-flex items-center gap-2 text-xs text-stone-500 hover:text-amber-400 transition-colors uppercase tracking-widest font-mono group"
          >
            <span>EXPLORE 12 ELITE SHADES</span>
            <span className="group-hover:translate-y-0.5 transition-transform text-amber-400">↓</span>
          </a>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION 2: SMART UNIVERSAL PRODUCT SHOWCASE COMPONENT         */}
      {/* ───────────────────────────────────────────────────────────── */}
      <ProductShowcase
        series="elite"
        allShades={shades}
        initialShadeId={initialData?.code || initialData?.id}
        onShadeChange={(shade) => setSelectedPanel(shade)}
        sectionId="showcase"
      />

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION 3: E.L.I.T.E. ARCHITECTURAL FEATURE STAGE             */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section className="w-full px-4 sm:px-8 lg:px-12 py-16 bg-stone-100 dark:bg-stone-900/50 border-b border-stone-200 dark:border-stone-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">
              [ THE E.L.I.T.E. STANDARD ]
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-stone-900 dark:text-white mt-1">
              Engineered Beyond Ordinary Cladding
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-2 font-light leading-relaxed">
              Why leading luxury interior architects specify the Elite 12-inch UV high-gloss series for feature walls and ceilings.
            </p>
          </div>

          {/* Acronym Tabs / Grid */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {ELITE_ACRONYM_DATA.map((item, idx) => {
              const isSelected = activeAcronymStep === idx;
              return (
                <button
                  key={item.letter}
                  type="button"
                  onClick={() => setActiveAcronymStep(idx)}
                  className={`p-5 rounded-2xl text-left transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-white dark:bg-stone-900 border-2 border-amber-500 shadow-xl shadow-amber-500/10'
                      : 'bg-white/60 dark:bg-stone-900/40 border border-stone-200 dark:border-stone-800 hover:border-stone-400'
                  }`}
                >
                  <div>
                    <span className={`text-4xl font-black block mb-2 transition-colors ${
                      isSelected ? 'text-amber-500' : 'text-stone-400 dark:text-stone-600'
                    }`}>
                      {item.letter}
                    </span>
                    <h4 className="text-sm font-bold text-stone-900 dark:text-white mb-1">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400 font-light leading-snug">
                      {item.tagline}
                    </p>
                  </div>
                  <span className={`mt-4 text-[10px] font-mono font-bold uppercase ${
                    isSelected ? 'text-amber-600 dark:text-amber-400' : 'text-stone-400'
                  }`}>
                    {isSelected ? '● Active Spec' : '○ View Spec'}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Expanded Step Spotlight */}
          <div className="mt-6 p-6 sm:p-8 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xl grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-7">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-8 h-8 rounded-xl bg-amber-500 text-stone-950 font-black text-lg flex items-center justify-center">
                  {ELITE_ACRONYM_DATA[activeAcronymStep].letter}
                </span>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  {ELITE_ACRONYM_DATA[activeAcronymStep].tagline}
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white mb-3">
                {ELITE_ACRONYM_DATA[activeAcronymStep].title}
              </h3>
              <p className="text-xs sm:text-base text-stone-600 dark:text-stone-300 font-light leading-relaxed">
                {ELITE_ACRONYM_DATA[activeAcronymStep].description}
              </p>
            </div>
            <div className="md:col-span-5 relative aspect-[16/10] rounded-2xl overflow-hidden shadow-lg border border-stone-200 dark:border-stone-800">
              <Image
                src={ELITE_ACRONYM_DATA[activeAcronymStep].image}
                alt={ELITE_ACRONYM_DATA[activeAcronymStep].title}
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION 4: TECHNICAL SPECIFICATIONS & FAQ ACCORDION           */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section className="w-full px-4 sm:px-8 lg:px-12 py-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Spec Table */}
          <div className="lg:col-span-7">
            <span className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">
              [ TECHNICAL DATASHEET ]
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white mt-1 mb-6">
              Elite Series Engineering Specifications
            </h2>

            <div className="overflow-hidden rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm">
              <table className="w-full text-xs text-left">
                <tbody className="divide-y divide-stone-200 dark:divide-stone-800">
                  <tr className="bg-stone-50 dark:bg-stone-900/40">
                    <td className="py-3 px-4 font-bold text-stone-700 dark:text-stone-300">Panel Dimensions</td>
                    <td className="py-3 px-4 font-mono text-stone-900 dark:text-white">2950 mm × 300 mm (9.6 ft × 1 ft / 12 Inch)</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold text-stone-700 dark:text-stone-300">Profile Thickness</td>
                    <td className="py-3 px-4 font-mono text-stone-900 dark:text-white">5.0 MM Solid UV High-Gloss Profile</td>
                  </tr>
                  <tr className="bg-stone-50 dark:bg-stone-900/40">
                    <td className="py-3 px-4 font-bold text-stone-700 dark:text-stone-300">Surface Finish</td>
                    <td className="py-3 px-4 text-stone-900 dark:text-white">98% Specular Mirror Italian Marble / Brushed Metallic</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold text-stone-700 dark:text-stone-300">Coverage per Panel</td>
                    <td className="py-3 px-4 font-mono text-stone-900 dark:text-white">9.5 SQ FT / PC</td>
                  </tr>
                  <tr className="bg-stone-50 dark:bg-stone-900/40">
                    <td className="py-3 px-4 font-bold text-stone-700 dark:text-stone-300">Box Packaging</td>
                    <td className="py-3 px-4 font-mono text-stone-900 dark:text-white">10 Panels / Box (95 SQ FT Total)</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold text-stone-700 dark:text-stone-300">Net Weight</td>
                    <td className="py-3 px-4 font-mono text-stone-900 dark:text-white">2.8 ±5% Kg / PC (28 Kg / Box)</td>
                  </tr>
                  <tr className="bg-stone-50 dark:bg-stone-900/40">
                    <td className="py-3 px-4 font-bold text-stone-700 dark:text-stone-300">Fire Rating</td>
                    <td className="py-3 px-4 text-emerald-600 dark:text-emerald-400 font-bold">Class B1 (Self-Extinguishing Flame Retardant)</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold text-stone-700 dark:text-stone-300">Water Absorption</td>
                    <td className="py-3 px-4 text-emerald-600 dark:text-emerald-400 font-bold">0.0% (100% Waterproof Seelan Immunity)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick FAQ / Mill Terms */}
          <div className="lg:col-span-5 p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xl">
            <h3 className="text-lg font-black text-stone-900 dark:text-white mb-4">
              Contractor & B2B Purchase FAQ
            </h3>
            
            <div className="space-y-3.5 text-xs">
              <div>
                <h4 className="font-bold text-stone-900 dark:text-white mb-1">
                  What is the Minimum Order Quantity (MOQ)?
                </h4>
                <p className="text-stone-600 dark:text-stone-400 font-light leading-relaxed">
                  Direct mill dispatch starts at 1 box (10 panels / 95 sq ft). For bulk projects exceeding 500 sq ft, custom tiered pricing applies.
                </p>
              </div>

              <div className="pt-3 border-t border-stone-100 dark:border-stone-800">
                <h4 className="font-bold text-stone-900 dark:text-white mb-1">
                  Can this be installed on wet/seelan walls?
                </h4>
                <p className="text-stone-600 dark:text-stone-400 font-light leading-relaxed">
                  Yes. The virgin polymer matrix is completely non-porous. It creates an impermeable barrier that permanently isolates peeling paint and damp moisture.
                </p>
              </div>

              <div className="pt-3 border-t border-stone-100 dark:border-stone-800">
                <h4 className="font-bold text-stone-900 dark:text-white mb-1">
                  How fast is dispatch across India?
                </h4>
                <p className="text-stone-600 dark:text-stone-400 font-light leading-relaxed">
                  Delhi-NCR orders dispatch within 2 hours. Pan-India shipments to Mumbai, Bangalore, Hyderabad, and Kolkata deliver within 48-72 hours.
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-stone-200 dark:border-stone-800">
              <a
                href={getWhatsAppRFQLink(selectedPanel, 50)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs uppercase tracking-wider text-center transition-colors block"
              >
                Request Physical Catalog & Swatch Box →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION 5: FREQUENTLY ASKED QUESTIONS                         */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section className="w-full max-w-5xl mx-auto px-4 sm:px-8 lg:px-12 py-16 sm:py-20 border-t border-stone-200 dark:border-stone-800">
        <FAQ items={ELITE_FAQS} />
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION 6: RFQ LEAD FORM & FOOTER                             */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section className="w-full px-4 sm:px-8 lg:px-12 py-16 bg-white dark:bg-stone-950 border-t border-stone-200 dark:border-stone-800">
        <div id="rfq-section" className="max-w-4xl mx-auto mb-12">
          <LeadForm
            initialProductName={selectedPanel.name}
            initialProductSku={selectedPanel.code}
            initialMaterial="Elite UV High-Gloss Wall Panels"
          />
        </div>

        <div className="pt-12 border-t border-stone-200 dark:border-stone-800 text-center text-xs text-stone-500">
          <p>© 2026 Wholesaleji Technologies Pvt. Ltd. • Pan-India Architectural Cladding Marketplace • Gurugram Hub</p>
        </div>
      </section>
    </div>
  );
}
