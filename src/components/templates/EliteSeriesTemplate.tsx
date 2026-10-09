
'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PanelProduct } from '@/data/types';
import {
  ELITE_WALL_PANELS,
  ELITE_ACRONYM_DATA,
  ELITE_FAQS,
  ELITE_MATERIAL_IN_MOTION_CALLOUTS,
  ELITE_SPATIAL_SHOWCASE,
  ELITE_COMPARISON_DATA,
  ELITE_PROCESS_STAGES,
  ELITE_TRADE_PERSONAS,
  ELITE_SISTER_COLLECTIONS,
  ELITE_COLLECTION_META,
} from '@/data/elitePanelsData';
import ProductShowcase from '@/components/ProductShowcase';
import FAQ from '@/components/FAQ';
import {
  Phone,
  FileText,
  ArrowRight,
  X,
  Check,
  CheckCircle2,
  Sparkles,
  Eye,
  Building2,
} from 'lucide-react';


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
  color = '#F59E0B',
  highlightColor = '#FCD34D',
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
        ctx.shadowBlur = particleSize * 3;
        ctx.shadowColor = highlightColor || color || '#F5AB40';
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

      const baseRgb = hexToRgb(color) || { r: 245, g: 158, b: 11 };
      const highlightRgb = hexToRgb(highlightColor) || { r: 252, g: 211, b: 77 };
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
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [activeSpaceIndex, setActiveSpaceIndex] = useState(0);
  const [activeTradePersona, setActiveTradePersona] = useState(0);
  const [activeCalloutId, setActiveCalloutId] = useState<string>('pin-1');
  const [showcaseShadeId, setShowcaseShadeId] = useState<string | undefined>(undefined);

  // Smoothly inspect a specific shade in the universal showcase
  const handleInspectShadeInShowcase = (shadeCode: string) => {
    setShowcaseShadeId(shadeCode);
    const target = shades.find((s) => s.code.toLowerCase() === shadeCode.toLowerCase());
    if (target) setSelectedPanel(target);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('select-showcase-shade', { detail: { code: shadeCode } })
      );
    }
    const el = document.getElementById('showcase');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Dynamic Theme Accent Color (synced with Navbar ThemeToggle)
  const [themeAccent, setThemeAccent] = useState('#F5AB40');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const saved = localStorage.getItem('custom-theme-color');
    if (saved && saved.startsWith('#')) {
      requestAnimationFrame(() => setThemeAccent(saved));
    } else {
      const computed = getComputedStyle(document.documentElement).getPropertyValue('--color-amber-500').trim();
      if (computed && computed.startsWith('#')) {
        requestAnimationFrame(() => setThemeAccent(computed));
      }
    }

    const onThemeChange = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (customEvent.detail && typeof customEvent.detail === 'string' && customEvent.detail.startsWith('#')) {
        setThemeAccent(customEvent.detail);
      }
    };

    window.addEventListener('theme-color-changed', onThemeChange);
    return () => window.removeEventListener('theme-color-changed', onThemeChange);
  }, []);

  const themeHighlight = useMemo(() => {
    if (!themeAccent || !themeAccent.startsWith('#') || themeAccent.length < 7) return '#FCD34D';
    let r = parseInt(themeAccent.slice(1, 3), 16);
    let g = parseInt(themeAccent.slice(3, 5), 16);
    let b = parseInt(themeAccent.slice(5, 7), 16);
    r = Math.min(255, Math.round(r + (255 - r) * 0.25));
    g = Math.min(255, Math.round(g + (255 - g) * 0.25));
    b = Math.min(255, Math.round(b + (255 - b) * 0.25));
    const toHex = (n: number) => n.toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }, [themeAccent]);

  return (
    <div className="w-full bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 transition-colors selection:bg-amber-500 selection:text-stone-950 overflow-x-hidden">
      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION 1: HERO WITH PARTICLE TEXT                            */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section className="relative w-full h-[100dvh] min-h-[620px] flex flex-col justify-between items-center bg-stone-950 text-white overflow-hidden select-none border-b border-stone-800 pt-16 sm:pt-20">
        {/* Ambient Corner Warm Accent Lighting (Primo-Style Refined Ambient Theme) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
          {/* Top Edge Ambient Warm Spill */}
          <div
            className="absolute -top-20 left-0 right-0 h-32 blur-[80px] opacity-18 dark:opacity-12 transition-all duration-700 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at 50% 0%, var(--color-amber-500, #F5AB40) 0%, transparent 80%)',
            }}
          />
          {/* Top-Left Corner Warm Glow — Soft & Gentle */}
          <div
            className="absolute -top-20 sm:-top-32 -left-20 sm:-left-32 w-[38vw] h-[38vw] min-w-[220px] min-h-[220px] max-w-[440px] max-h-[440px] rounded-full blur-[90px] sm:blur-[120px] opacity-20 dark:opacity-15 transition-all duration-700 pointer-events-none"
            style={{
              background: 'radial-gradient(circle at 35% 35%, var(--color-amber-500, #F5AB40) 0%, var(--color-amber-400, #fbbf24) 45%, transparent 75%)',
            }}
          />
          {/* Top-Right Corner Warm Glow — Soft & Gentle */}
          <div
            className="absolute -top-20 sm:-top-32 -right-20 sm:-right-32 w-[38vw] h-[38vw] min-w-[220px] min-h-[220px] max-w-[440px] max-h-[440px] rounded-full blur-[90px] sm:blur-[120px] opacity-20 dark:opacity-15 transition-all duration-700 pointer-events-none"
            style={{
              background: 'radial-gradient(circle at 65% 35%, var(--color-amber-500, #F5AB40) 0%, var(--color-amber-400, #fbbf24) 45%, transparent 75%)',
            }}
          />
          {/* Bottom-Left Corner Warm Glow */}
          <div
            className="absolute -bottom-[15vw] -left-[15vw] w-[32vw] h-[32vw] min-w-[180px] min-h-[180px] max-w-[360px] max-h-[360px] rounded-full blur-[80px] sm:blur-[100px] opacity-15 dark:opacity-10 transition-all duration-700 pointer-events-none"
            style={{
              background: 'radial-gradient(circle at center, var(--color-amber-500, #F5AB40) 0%, var(--color-amber-400, #fbbf24) 40%, transparent 70%)',
            }}
          />
          {/* Bottom-Right Corner Warm Glow */}
          <div
            className="absolute -bottom-[15vw] -right-[15vw] w-[32vw] h-[32vw] min-w-[180px] min-h-[180px] max-w-[360px] max-h-[360px] rounded-full blur-[80px] sm:blur-[100px] opacity-15 dark:opacity-10 transition-all duration-700 pointer-events-none"
            style={{
              background: 'radial-gradient(circle at center, var(--color-amber-500, #F5AB40) 0%, var(--color-amber-400, #fbbf24) 40%, transparent 70%)',
            }}
          />
        </div>

        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="absolute left-4 sm:left-8 lg:left-12 top-16 sm:top-20 z-20 flex items-center gap-2 text-[11px] font-mono tracking-wider text-stone-500 select-auto"
        >
          <Link href="/" className="hover:text-amber-400 transition-colors">
            Home
          </Link>
          <span className="opacity-40">/</span>
          <Link href="/wall-panels" className="hover:text-amber-400 transition-colors">
            Wall Panels
          </Link>
          <span className="opacity-40">/</span>
          <span className="text-amber-500 font-bold">Elite Panels</span>
        </nav>

        {/* Semantic H1 for SEO */}
        <h1 className="sr-only">
          Elite Panels - Luxury UV High-Gloss Italian Marble & Metallic Wall Panels | WholesalerJi
        </h1>
        <div className="sr-only">
          <p>{ELITE_COLLECTION_META.description}</p>
          <p>Pricing starts at {ELITE_COLLECTION_META.priceStarting} for our {ELITE_COLLECTION_META.thickness}, {ELITE_COLLECTION_META.width} width panels.</p>
          <p>{ELITE_COLLECTION_META.tagline}</p>
        </div>

        {/* Top spacer for optical balance */}
        <div className="w-full pt-4 sm:pt-6" />

        {/* ParticleText Canvas - Expands to fill available viewport height */}
        <div className="relative z-10 w-full flex-1 flex items-center justify-center min-h-[360px] sm:min-h-[440px] md:min-h-[500px]">
          <ParticleText
            text="ELITE"
            particleSize={2.4}
            density={3.6}
            color={themeAccent}
            highlightColor={themeHighlight}
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

        {/* Subtle Architectural Editorial Badge */}
        <div className="relative z-10 px-4 text-center pb-2">
          <p className="text-[11px] sm:text-xs font-mono uppercase tracking-[0.25em] text-stone-400">
            
          </p>
          <div className="flex items-center justify-center gap-3 mt-1.5 text-[10px] sm:text-[11px] font-mono text-stone-500">
            <span>Direct Mill Supply</span>
            <span className="text-amber-500/60">•</span>
            <span>Sector 34 Gurugram Depot</span>
            <span className="text-amber-500/60">•</span>
            <span>Pan-India Logistics</span>
          </div>
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
        selectedShadeId={showcaseShadeId}
        onShadeChange={(shade) => {
          setSelectedPanel(shade);
          setShowcaseShadeId(undefined);
        }}
        sectionId="showcase"
      />

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION 3: MATERIAL IN MOTION (CINEMATIC DETAIL INSPECTOR)     */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section
        id="material-in-motion"
        className="w-full px-4 sm:px-8 lg:px-12 py-10 bg-white dark:bg-stone-950 text-stone-900 dark:text-white border-b border-stone-200 dark:border-stone-800 relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="max-w-3xl mb-8 sm:mb-10">
            
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-stone-900 dark:text-white">
              Tactile Precision. Specular High-Gloss.
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-2 font-light leading-relaxed">
              Inspect the 5.0mm unplasticized solid core, 98% specular Italian marble topcoat, and precision tongue &amp; groove interlock engineered for permanent interior walls. As the manufacturer of Elite UV high-gloss marble wall panels, WholesalerJi supplies architects, contractors, and dealers across India with factory-direct bulk pricing.
            </p>
          </div>

          {/* Interactive Inspection Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
            {/* Visual with Interactive Callout Pins */}
            <div className="lg:col-span-7 relative w-full h-[320px] sm:h-[420px] md:h-[480px] rounded-3xl overflow-hidden bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xl group">
              <Image
                src="https://res.cloudinary.com/def2qsxjg/image/upload/f_auto,q_auto/v1790401394/GF-401_Premium_Pvc_Panel_In_Gurgaon_installed_image.jpg"
                alt="Installed real-world view of Elite GF-401 high-gloss Italian Statuario marble wall panel in Gurgaon living room"
                fill
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />

              {/* Pulsing Coordinate Pins */}
              {ELITE_MATERIAL_IN_MOTION_CALLOUTS.map((callout, index) => {
                const isActive = activeCalloutId === callout.id;
                return (
                  <button
                    key={callout.id}
                    type="button"
                    onClick={() => setActiveCalloutId(callout.id)}
                    aria-label={`Inspect detail: ${callout.label}`}
                    style={{ top: callout.y, left: callout.x }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group/pin cursor-pointer focus:outline-none"
                  >
                    <span className="relative flex h-8 w-8 items-center justify-center">
                      <span
                        className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping ${
                          isActive ? 'bg-amber-400' : 'bg-stone-400'
                        }`}
                      />
                      <span
                        className={`relative inline-flex items-center justify-center rounded-full h-7 w-7 text-[10px] font-mono font-bold shadow-lg transition-all duration-300 ${
                          isActive
                            ? 'bg-amber-500 text-stone-950 scale-110 ring-4 ring-amber-500/40'
                            : 'bg-stone-900/90 text-stone-200 border border-stone-600 hover:scale-110'
                        }`}
                      >
                        0{index + 1}
                      </span>
                    </span>
                  </button>
                );
              })}

              {/* Bottom Visual Label */}
              <div className="absolute bottom-4 left-5 right-5 flex items-center justify-between text-[11px] font-mono text-stone-300">
                <span className="bg-stone-900/80 backdrop-blur-md px-3 py-1 rounded-full border border-stone-700">
                  Tap pins to inspect engineering anatomy
                </span>
                <span className="hidden sm:inline-block text-amber-400 font-bold">
                  GF-401 Statuario Slab • Living Room Installation
                </span>
              </div>
            </div>

            {/* Editorial Information Column */}
            <div className="lg:col-span-5 flex flex-col justify-center">
              {/* Quick Tab Selector for Callouts */}
              <div className="grid grid-cols-2 gap-2 mb-5">
                {ELITE_MATERIAL_IN_MOTION_CALLOUTS.map((c, idx) => {
                  const isActive = activeCalloutId === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setActiveCalloutId(c.id)}
                      className={`py-2 px-3 text-left rounded-xl text-xs font-mono transition-all border ${
                        isActive
                          ? 'bg-amber-500/15 border-amber-500 text-amber-600 dark:text-amber-400 font-bold shadow-xs'
                          : 'bg-stone-100 dark:bg-stone-900/50 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white hover:border-stone-300 dark:hover:border-stone-700'
                      }`}
                    >
                      <span className="text-[10px] text-stone-400 dark:text-stone-500 block">POINT 0{idx + 1}</span>
                      <span className="font-semibold truncate block">{c.label.split(' ')[0]} {c.label.split(' ')[1] || ''}</span>
                    </button>
                  );
                })}
              </div>

              {/* Active Callout Feature Card */}
              <div className="grid">
                {ELITE_MATERIAL_IN_MOTION_CALLOUTS.map((c) => {
                  const isActive = c.id === activeCalloutId;
                  return (
                    <div
                      key={c.id}
                      className={`col-start-1 row-start-1 p-5 sm:p-7 rounded-3xl bg-stone-50 dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800 shadow-md overflow-hidden transition-all duration-300 ${
                        isActive ? 'opacity-100 z-10 relative' : 'opacity-0 pointer-events-none z-0'
                      }`}
                      aria-hidden={!isActive}
                    >
                      <h3 className="text-lg sm:text-xl font-black text-stone-900 dark:text-white tracking-tight mb-2">
                        {c.label}
                      </h3>

                      <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 font-light leading-relaxed mb-5">
                        {c.description}
                      </p>

                      <div className="pt-3 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
                        <span>Tested for Seelan &amp; Fire Safety</span>
                        <a
                          href="#showcase"
                          className="text-amber-600 dark:text-amber-400 hover:underline font-mono inline-flex items-center gap-1 text-[11px]"
                        >
                          Inspect finishes in showcase <ArrowRight className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION 4: ONE PANEL, DIFFERENT SPACES (SPATIAL SHOWCASE)     */}
      {/* ───────────────────────────────────────────────────────────── */}
      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION 4: ONE PANEL, DIFFERENT SPACES (SPATIAL SHOWCASE)     */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section
        id="spatial-showcase"
        className="w-full px-4 sm:px-8 lg:px-12 py-10 bg-stone-50 dark:bg-stone-900/40 text-stone-900 dark:text-white border-b border-stone-200 dark:border-stone-800 relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 sm:mb-10">
            <div>
              
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-stone-900 dark:text-white">
                One Panel. Five Architectural Spaces.
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 max-w-md font-light leading-relaxed">
              Explore how interior architects deploy the Elite 12-inch UV high-gloss series across Delhi NCR residences and commercial headquarters.
            </p>
          </div>

          {/* Space Selector Tabs */}
          <div
            role="tablist"
            aria-label="Architectural spatial applications"
            className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-6"
          >
            {ELITE_SPATIAL_SHOWCASE.map((space, idx) => {
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
                      : 'bg-white dark:bg-stone-950/70 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white hover:border-stone-300 dark:hover:border-stone-700'
                  }`}
                >
                  <span className="opacity-70 mr-2">{space.category.split(' ')[0]}</span>
                  <span>{space.title}</span>
                </button>
              );
            })}
          </div>

          {/* Active Space Spotlight Composition */}
          <div className="grid">
            {ELITE_SPATIAL_SHOWCASE.map((currentSpace, idx) => {
              const isActive = activeSpaceIndex === idx;
              return (
                <div
                  key={currentSpace.id}
                  className={`col-start-1 row-start-1 rounded-3xl overflow-hidden bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 grid grid-cols-1 lg:grid-cols-12 shadow-xl transition-all duration-500 ${
                    isActive ? 'opacity-100 z-10 relative' : 'opacity-0 pointer-events-none z-0'
                  }`}
                  aria-hidden={!isActive}
                >
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
                          Installed Shade
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
                          <span>Architectural Lighting Effect:</span>
                        </div>
                        <p className="text-[11px] leading-relaxed">
                          98% high-gloss specular surface amplifies ambient cove lighting and downlights, expanding perceptual room depth without grout lines.
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
                        onClick={() => setIsInquiryModalOpen(true)}
                        className="w-full py-2.5 px-4 rounded-xl bg-stone-100 dark:bg-stone-900 hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 font-mono text-xs uppercase tracking-wider transition-colors border border-stone-200 dark:border-stone-800 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <span>Request Swatch for {currentSpace.title}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION 5: THE E.L.I.T.E. STANDARD (ACRONYM STAGE)            */}
      {/* ───────────────────────────────────────────────────────────── */}
      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION 5: THE E.L.I.T.E. STANDARD (ACRONYM STAGE)            */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section
        id="elite-standard"
        className="w-full px-4 sm:px-8 lg:px-12 py-10 bg-white dark:bg-stone-950 text-stone-900 dark:text-white border-b border-stone-200 dark:border-stone-800"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
            
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-stone-900 dark:text-white">
              Engineered Beyond Ordinary Cladding.
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-2 font-light leading-relaxed">
              Why leading luxury interior architects specify the Elite 12-inch UV high-gloss series for feature walls and ceilings.
            </p>
          </div>

          {/* Acronym Tabs */}
          <div
            role="tablist"
            aria-label="Elite series architectural standard"
            className="grid grid-cols-2 md:grid-cols-5 gap-2 sm:gap-3 mb-6"
          >
            {ELITE_ACRONYM_DATA.map((item, idx) => {
              const isSelected = activeAcronymStep === idx;
              return (
                <button
                  key={item.letter}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setActiveAcronymStep(idx)}
                  className={`relative p-4 sm:p-5 text-left transition-all duration-300 cursor-pointer overflow-hidden rounded-2xl border ${
                    isSelected
                      ? 'bg-stone-50 dark:bg-stone-900 border-amber-500 shadow-md shadow-amber-500/10'
                      : 'bg-stone-50/60 dark:bg-stone-900/40 border-stone-200 dark:border-stone-800/80 hover:bg-stone-100 dark:hover:bg-stone-900 hover:border-stone-300 dark:hover:border-stone-700'
                  }`}
                >
                  <div className="relative z-10">
                    <span
                      className={`text-3xl sm:text-4xl font-black block mb-1.5 transition-colors duration-300 ${
                        isSelected ? 'text-amber-600 dark:text-amber-400' : 'text-stone-400 dark:text-stone-600'
                      }`}
                    >
                      {item.letter}
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-stone-900 dark:text-white block mb-0.5">
                      {item.title}
                    </span>
                    <span
                      className={`text-[10px] sm:text-xs font-light leading-snug transition-colors duration-300 hidden sm:block ${
                        isSelected ? 'text-stone-600 dark:text-stone-300' : 'text-stone-500 dark:text-stone-500'
                      }`}
                    >
                      {item.tagline}
                    </span>
                  </div>
                  {isSelected && (
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent pointer-events-none" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Expanded Step Spotlight */}
          <div className="grid">
            {ELITE_ACRONYM_DATA.map((item, idx) => {
              const isActive = activeAcronymStep === idx;
              return (
                <div
                  key={item.title}
                  className={`col-start-1 row-start-1 overflow-hidden rounded-3xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 grid grid-cols-1 md:grid-cols-12 items-stretch min-h-[360px] shadow-xl transition-all duration-300 ${
                    isActive ? 'opacity-100 z-10 relative' : 'opacity-0 pointer-events-none z-0'
                  }`}
                  aria-hidden={!isActive}
                >
                  <div className="md:col-span-6 p-6 sm:p-10 lg:p-12 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-5xl font-black text-amber-600 dark:text-amber-500 leading-none">
                        {item.letter}
                      </span>
                      <div className="h-px w-10 bg-amber-500/30" />
                      <span className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-widest text-amber-600 dark:text-amber-500">
                        {item.tagline}
                      </span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white tracking-tight leading-tight mb-3">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 font-light leading-relaxed max-w-lg mb-5">
                      {item.description}
                    </p>
                    <div>
                      <button
                        type="button"
                        onClick={() => setIsInquiryModalOpen(true)}
                        className="inline-flex items-center gap-2 text-xs font-mono text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 uppercase tracking-widest font-bold cursor-pointer"
                      >
                        <span>Inquire about this specification</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="md:col-span-6 relative aspect-square md:aspect-auto min-h-[280px]">
                    <Image
                      src={item.image}
                      alt={
                        item.alt ||
                        `${item.title} - Elite Wall Panels Installed Scene`
                      }
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-stone-50 dark:from-stone-900 via-transparent to-transparent w-1/4 hidden md:block" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION 6: ELITE VS ORDINARY (COMPARATIVE BENCHMARK)          */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section
        id="comparison"
        className="w-full px-4 sm:px-8 lg:px-12 py-10 bg-stone-50 dark:bg-stone-900/40 border-b border-stone-200 dark:border-stone-800"
      >
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
            
            <h2 className="text-2xl sm:text-4xl font-black text-stone-900 dark:text-white tracking-tight leading-tight">
              Elite Panel System vs. Generic Alternatives
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-2 font-light leading-relaxed">
              A factual side-by-side engineering comparison of core density, optical finish, seelan immunity, and wholesale availability.
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
                  Generic Wall Cladding / Thin Film
                </div>
                <div className="col-span-4 p-4 sm:p-5 bg-amber-500/10 text-amber-600 dark:text-amber-400 border-l border-stone-200 dark:border-stone-800 flex items-center justify-between">
                  <span>WholesalerJi Elite 5mm System</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500 text-stone-950 font-black">
                    Recommended
                  </span>
                </div>
              </div>

              {/* Comparison Rows */}
              <div className="divide-y divide-stone-200 dark:divide-stone-800">
                {ELITE_COMPARISON_DATA.map((row, idx) => (
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
                      <span>{row.elite}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION 7: FROM SAMPLE TO PROJECT (PROCESS TIMELINE)          */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section
        id="procurement-path"
        className="w-full px-4 sm:px-8 lg:px-12 py-10 bg-white dark:bg-stone-950 text-stone-900 dark:text-white border-b border-stone-200 dark:border-stone-800"
      >
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
            
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-stone-900 dark:text-white">
              From Sample to Finished Project
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-2 font-light leading-relaxed">
              A transparent, friction-free procurement pipeline engineered for architects, turnkey contractors, and homeowners.
            </p>
          </div>

          {/* 5-Step Process Timeline */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5 relative">
            {ELITE_PROCESS_STAGES.map((stage) => (
              <div
                key={stage.step}
                className="p-5 rounded-3xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 flex flex-col justify-between hover:border-amber-500/50 hover:bg-stone-100 dark:hover:bg-stone-900 transition-all duration-300 relative group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-500 font-mono">
                      {stage.step}
                    </span>
                   
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-stone-900 dark:text-white mb-1.5 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    {stage.title}
                  </h3>

                  <p className="text-xs text-stone-600 dark:text-stone-400 font-light leading-relaxed">
                    {stage.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-stone-200 dark:border-stone-800/80 flex items-center gap-1.5 text-[11px] font-mono text-amber-600 dark:text-amber-400 font-medium">
                  <Check className="w-3.5 h-3.5" />
                  <span>{stage.subtitle}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION 8: TECHNICAL MATERIAL PASSPORT (ENGINEERING DOSSIER)   */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section
        id="technical-passport"
        className="w-full px-4 sm:px-8 lg:px-12 py-10 bg-stone-50 dark:bg-stone-900/40 border-b border-stone-200 dark:border-stone-800"
      >
        <div className="max-w-5xl mx-auto">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
            
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-stone-900 dark:text-white tracking-tight leading-tight">
              Elite Series Material Passport
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-2 font-light leading-relaxed">
              Standardized physical and mechanical metrics for architectural drafting, quantity surveying, and contractor BOQ estimations.
            </p>
          </div>

          {/* Dossier Specs Table */}
          <div className="rounded-3xl border border-stone-300 dark:border-stone-800 overflow-hidden bg-white dark:bg-stone-900 shadow-xl">
            <div className="p-5 sm:p-7 border-b border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-900/80">
              <h3 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white">
                12-Inch UV High-Gloss Cladding Profile
              </h3>
            </div>

            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <tbody className="divide-y divide-stone-200 dark:divide-stone-800">
                  {[
                    { label: 'Standard Dimensions', value: '2950 mm × 300 mm (9.68 ft × 0.98 ft / 12 Inch nominal)', highlight: false },
                    { label: 'Profile Core Thickness', value: '5.0 MM Solid Extrusion Matrix (Unplasticized Polymer)', highlight: true },
                    { label: 'Surface Optical Finish', value: '98% Specular Gloss Italian Marble & Metallic UV Barrier', highlight: false },
                    { label: 'Effective Coverage per Panel', value: '9.5 SQ FT / PC (Seamless Micro-V Interlock)', highlight: false },
                    { label: 'Box Packaging Standard', value: '10 Panels / Box (95 SQ FT Total Coverage)', highlight: false },
                    { label: 'Net Weight per Panel', value: '2.8 ±5% Kg / PC (28 Kg Gross Box Weight)', highlight: false },
                    { label: 'Flame Retardancy Rating', value: 'Class B1 (Self-Extinguishing, Zero Flame Spread)', highlight: true },
                    { label: 'Water Absorption Coefficient', value: '0.0% (100% Impermeable Damp/Seelan Wall Barrier)', highlight: true },
                    { label: 'Available Curated Finishes', value: '12 Finishes (Statuario, Marquina, Emperador, Armani, Floral)', highlight: false },
                    { label: 'Primary Depot Hub', value: 'Sector 34, Gurugram, Haryana — 2-Hour NCR Dispatch', highlight: false },
                  ].map((row, i) => (
                    <tr
                      key={i}
                      className="hover:bg-stone-50 dark:hover:bg-stone-800/40 transition-colors"
                    >
                      <td className="py-3 px-4 sm:px-6 font-semibold text-stone-600 dark:text-stone-400 w-5/12 sm:w-1/3 align-middle">
                        {row.label}
                      </td>
                      <td
                        className={`py-3 px-4 sm:px-6 font-mono text-xs sm:text-sm w-7/12 sm:w-2/3 sm:text-right align-middle ${
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
      {/* SECTION 9: DEDICATED TRADE SOLUTIONS (ARCHITECTS/CONTRACTORS) */}
      {/* ───────────────────────────────────────────────────────────── */}
      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION 9: DEDICATED TRADE SOLUTIONS (ARCHITECTS/CONTRACTORS) */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section
        id="trade-solutions"
        className="w-full px-4 sm:px-8 lg:px-12 py-10 bg-white dark:bg-stone-950 text-stone-900 dark:text-white border-b border-stone-200 dark:border-stone-800"
      >
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
            
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-stone-900 dark:text-white">
              Purpose-Built for Industry Professionals
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-2 font-light leading-relaxed">
              Dedicated procurement desks, volume-based mill rates, and technical site coordination for every project scale.
            </p>
          </div>

          {/* 3 Personas Tabs */}
          <div
            role="tablist"
            aria-label="Trade persona solutions"
            className="flex items-center justify-center gap-2.5 mb-8 overflow-x-auto no-scrollbar pb-2"
          >
            {ELITE_TRADE_PERSONAS.map((persona, idx) => {
              const isActive = activeTradePersona === idx;
              return (
                <button
                  key={persona.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveTradePersona(idx)}
                  className={`px-4 sm:px-5 py-2.5 rounded-2xl text-xs font-mono transition-all duration-300 border cursor-pointer ${
                    isActive
                      ? 'bg-amber-500 text-stone-950 font-bold border-amber-500 shadow-md shadow-amber-500/20'
                      : 'bg-stone-100 dark:bg-stone-900/60 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white hover:border-stone-300 dark:hover:border-stone-700'
                  }`}
                >
                  {persona.shortLabel}
                </button>
              );
            })}
          </div>

          {/* Active Persona Feature Showcase */}
          <div className="grid max-w-4xl mx-auto">
            {ELITE_TRADE_PERSONAS.map((persona, idx) => {
              const isActive = activeTradePersona === idx;
              return (
                <div
                  key={persona.id}
                  className={`col-start-1 row-start-1 rounded-3xl bg-stone-50 dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800 p-6 sm:p-10 lg:p-12 shadow-xl transition-all duration-300 ${
                    isActive ? 'opacity-100 z-10 relative' : 'opacity-0 pointer-events-none z-0'
                  }`}
                  aria-hidden={!isActive}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5 pb-5 border-b border-stone-200 dark:border-stone-800">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white">
                        {persona.role}
                      </h3>
                      <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-0.5">
                        {persona.headline}
                      </p>
                    </div>
                    <div className="w-11 h-11 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="space-y-3.5 mb-6">
                    {persona.features.map((feature: string, i: number) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3" />
                        </div>
                        <span className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 font-light leading-relaxed">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-5 border-t border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-xs text-stone-500 font-mono">
                      Direct Mill Coordination • B2B GST Invoicing
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsInquiryModalOpen(true)}
                      className="w-full sm:w-auto px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                    >
                      <span>{persona.actionLabel}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION 10: SISTER COLLECTIONS STRIP                          */}
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
            {ELITE_SISTER_COLLECTIONS.map((col) => (
              <Link
                key={col.id}
                href={col.url}
                className="group flex flex-col rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-amber-500/70 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
              >
                {/* 16:9 Installed Scene Image */}
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-stone-950">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={col.image}
                    alt={col.altText || col.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent" />
                  
                  {/* Top Category Tag */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-stone-950/80 backdrop-blur text-amber-400 border border-amber-500/30">
                      {col.tag}
                    </span>
                  </div>

                  {/* Bottom Shade Count Pill */}
                  <div className="absolute bottom-3 right-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-white/90 dark:bg-stone-900/90 text-stone-900 dark:text-white font-semibold">
                      {col.shades || col.shadesCount}
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
      {/* SECTION 11: FREQUENTLY ASKED QUESTIONS (CLEAN SINGLE H2)      */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section
        id="faq"
        className="w-full max-w-5xl mx-auto px-4 sm:px-8 lg:px-12 py-10 border-b border-stone-200 dark:border-stone-800"
      >
        
        <FAQ items={ELITE_FAQS} />
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION 12: FINAL ARCHITECTURAL CTA & PROCUREMENT DESK        */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section
        id="rfq-section"
        className="w-full px-4 sm:px-8 lg:px-12 py-10 bg-white dark:bg-stone-950 text-stone-900 dark:text-white relative overflow-hidden border-t border-stone-200 dark:border-stone-800"
      >
        {/* Subtle Architectural Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(90deg, currentColor 1px, transparent 1px), linear-gradient(currentColor 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />

        <div className="max-w-4xl mx-auto relative z-10 text-center mb-8">
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-stone-900 dark:text-white mb-4">
            Have a Wall in Mind?
          </h2>
          <p className="text-stone-600 dark:text-stone-400 font-light max-w-2xl mx-auto text-xs sm:text-sm leading-relaxed mb-6">
            Connect with our technical procurement desk in Gurgaon. Request mill-direct box pricing, physical Italian marble swatch deliveries, or custom BOQ estimates.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto">
            <button
              type="button"
              onClick={() => setIsInquiryModalOpen(true)}
              className="w-full sm:w-auto py-3.5 px-7 rounded-2xl bg-amber-500 hover:bg-amber-400 active:scale-98 text-stone-950 font-black text-xs sm:text-sm uppercase tracking-wider shadow-[0_10px_30px_rgba(245,158,11,0.35)] hover:shadow-[0_15px_40px_rgba(245,158,11,0.5)] transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer group"
            >
              <span>Connect with Procurement Desk</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </button>

            <a
              href="tel:+919217400163"
              className="w-full sm:w-auto py-3.5 px-5 rounded-2xl bg-stone-100 dark:bg-stone-900 hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-800 font-mono text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              <Phone className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>+91 92174 00163</span>
            </a>
          </div>
        </div>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* 3-OPTION PROCUREMENT INQUIRY MODAL (WHATSAPP / CALL / FORM)   */}
        {/* ───────────────────────────────────────────────────────────── */}
        {isInquiryModalOpen && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="elite-modal-title"
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
                <h3 id="elite-modal-title" className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Connect with Procurement
                </h3>
                <p className="text-xs sm:text-sm text-stone-400 mt-1 leading-relaxed">
                  Choose how you would like to connect for Elite UV Marble Panels factory rates, sample swatches, or project estimates.
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
                        body: JSON.stringify({ source: 'elite-inquiry-modal-whatsapp', panel: selectedPanel.code }),
                      }).catch(() => {});
                    } catch {}
                    const msg = `Hi WholesalerJi, I want to inquire about Elite UV High-Gloss Marble Panels (${selectedPanel.code} - ${selectedPanel.name}) wholesale rates and delivery in Gurgaon/Delhi NCR.`;
                    window.open(`https://wa.me/919217400163?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
                    setIsInquiryModalOpen(false);
                  }}
                  className="w-full p-4 rounded-2xl bg-stone-800/80 hover:bg-[#25D366]/10 border border-stone-700/60 hover:border-[#25D366] transition-all duration-200 flex items-center gap-4 text-left group cursor-pointer"
                >
                  {/* Authentic WhatsApp Official Vector */}
                  <div className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center drop-shadow-md group-hover:scale-105 transition-transform">
                    <svg
                      className="w-11 h-11 select-none"
                      viewBox="0 0 175.216 175.552"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <defs>
                        <linearGradient id="wa-modal-elite-desk" x1="85.915" x2="86.535" y1="32.567" y2="137.092" gradientUnits="userSpaceOnUse">
                          <stop offset="0" stopColor="#57d163" />
                          <stop offset="1" stopColor="#23b33a" />
                        </linearGradient>
                      </defs>
                      <path fill="#ffffff" d="m12.966 161.238 10.439-38.114a73.42 73.42 0 0 1-9.821-36.772c.017-40.556 33.021-73.55 73.578-73.55 19.681.01 38.154 7.669 52.047 21.572s21.537 32.383 21.53 52.037c-.018 40.553-33.027 73.553-73.578 73.553h-.032c-12.313-.005-24.412-3.094-35.159-8.954z"/>
                      <path fill="url(#wa-modal-elite-desk)" d="M87.184 25.227c-33.733 0-61.166 27.423-61.178 61.13a60.98 60.98 0 0 0 9.349 32.535l1.455 2.313-6.179 22.558 23.146-6.069 2.235 1.324c9.387 5.571 20.15 8.517 31.126 8.523h.023c33.707 0 61.14-27.426 61.153-61.135a60.75 60.75 0 0 0-17.895-43.251 60.75 60.75 0 0 0-43.235-17.928z"/>
                      <path fill="#ffffff" fillRule="evenodd" d="M68.772 55.603c-1.378-3.061-2.828-3.123-4.137-3.176l-3.524-.043c-1.226 0-3.218.46-4.902 2.3s-6.435 6.287-6.435 15.332 6.588 17.785 7.506 19.013 12.718 20.381 31.405 27.75c15.529 6.124 18.689 4.906 22.061 4.6s10.877-4.447 12.408-8.74 1.532-7.971 1.073-8.74-1.685-1.226-3.525-2.146-10.877-5.367-12.562-5.981-2.91-.919-4.137.921-4.746 5.979-5.819 7.206-2.144 1.381-3.984.462-7.76-2.861-14.784-9.124c-5.465-4.873-9.154-10.891-10.228-12.73s-.114-2.835.808-3.751c.825-.824 1.838-2.147 2.759-3.22s1.224-1.84 1.836-3.065.307-2.301-.153-3.22-4.032-10.011-5.666-13.647"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white group-hover:text-[#25D366] transition-colors text-sm sm:text-base">
                        Chat on WhatsApp
                      </span>
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-[#25D366]/20 text-[#25D366] font-bold">
                        Instant
                      </span>
                    </div>
                    <p className="text-xs text-stone-400 mt-0.5">
                      Live chat for instant quotes, live video swatches &amp; shade stock verification.
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-stone-500 group-hover:text-[#25D366] group-hover:translate-x-1 transition-all flex-shrink-0" />
                </button>

                {/* Option 2: Direct Call */}
                <a
                  href="tel:+919217400163"
                  onClick={() => {
                    try {
                      fetch('/api/analytics/whatsapp-clicks', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ source: 'elite-inquiry-modal-call', panel: selectedPanel.code }),
                      }).catch(() => {});
                    } catch {}
                    setIsInquiryModalOpen(false);
                  }}
                  className="w-full p-4 rounded-2xl bg-stone-800/80 hover:bg-amber-500/10 border border-stone-700/60 hover:border-amber-500 transition-all duration-200 flex items-center gap-4 text-left group cursor-pointer block"
                >
                  <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-500 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white group-hover:text-amber-400 transition-colors text-sm sm:text-base">
                        Direct Phone Call
                      </span>
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-bold">
                        +91 92174 00163
                      </span>
                    </div>
                    <p className="text-xs text-stone-400 mt-0.5">
                      Speak directly with our technical procurement manager in Gurgaon.
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-stone-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all flex-shrink-0" />
                </a>

                {/* Option 3: Online Quotation Form */}
                <button
                  type="button"
                  onClick={() => {
                    setIsInquiryModalOpen(false);
                    const showcase = document.getElementById('showcase');
                    if (showcase) {
                      showcase.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                    setTimeout(() => {
                      window.dispatchEvent(new CustomEvent('open-showcase-quote-modal'));
                      const btn = document.getElementById('showcase-get-quote-btn') as HTMLButtonElement;
                      if (btn) btn.click();
                    }, 600);
                  }}
                  className="w-full p-4 rounded-2xl bg-stone-800/80 hover:bg-stone-700/60 border border-stone-700/60 hover:border-stone-500 transition-all duration-200 flex items-center gap-4 text-left group cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-xl bg-stone-700/50 border border-stone-600/50 text-stone-200 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white group-hover:text-stone-200 transition-colors text-sm sm:text-base">
                        Online Quotation Form
                      </span>
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-stone-700 text-stone-300 font-bold">
                        BOQ Calculator
                      </span>
                    </div>
                    <p className="text-xs text-stone-400 mt-0.5">
                      Specify wall dimensions, pick multiple shades, and request formal GST quote.
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-stone-500 group-hover:text-white group-hover:translate-x-1 transition-all flex-shrink-0" />
                </button>
              </div>

              {/* Footer Assurance */}
              <div className="mt-6 pt-4 border-t border-stone-800 flex items-center justify-between text-[11px] text-stone-500 font-mono">
                <span>📍 Mill Depot: Sector 34, Gurugram</span>
                <span>⚡ 100% Factory Direct</span>
              </div>
            </div>
          </div>
        )}

        
      </section>
    </div>
  );
}
