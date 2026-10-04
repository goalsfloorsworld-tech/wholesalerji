'use client';

import React, { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

interface FloatingWhatsAppProps {
  whatsappNumber?: string;
  defaultMessage?: string;
}

export default function FloatingWhatsApp({
  whatsappNumber = '919217400163',
  defaultMessage = 'Hi WholesalerJi, I am inquiring about Wall Panels wholesale rates for my project.',
}: FloatingWhatsAppProps) {
  const pathname = usePathname();
  const mobileBarRef = useRef<HTMLDivElement>(null);

  // Dynamic context-aware wholesale pricing for mobile bar
  const pricingInfo = React.useMemo(() => {
    if (!pathname) return { label: 'Wholesale Rate', price: 'Factory Direct', sub: 'Mill Dispatch' };
    const lower = pathname.toLowerCase();
    if (lower.includes('elite-fluted')) {
      return { label: 'Wholesale Rate', price: '₹799', sub: '/pc' };
    }
    if (lower.includes('primo-fluted')) {
      return { label: 'Wholesale Rate', price: '₹699', sub: '/pc' };
    }
    if (lower.includes('elite')) {
      return { label: 'Wholesale Rate', price: '₹549', sub: '/pc' };
    }
    if (lower.includes('primo')) {
      return { label: 'Wholesale Rate', price: '₹499', sub: '/pc' };
    }
    return { label: 'Wholesale Rate', price: 'Factory Direct', sub: 'Ready Stock' };
  }, [pathname]);

  // Instantaneous zero-lag footer docking physics on mobile via GPU compositor
  useEffect(() => {
    let rafId: number | null = null;

    const updatePosition = () => {
      const bar = mobileBarRef.current;
      if (!bar) return;
      const footer = document.querySelector('footer');
      if (!footer) {
        bar.style.transform = 'translate3d(0, 0, 0)';
        return;
      }
      const footerRect = footer.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      if (footerRect.top < windowHeight) {
        const overlap = Math.max(0, windowHeight - footerRect.top);
        bar.style.transform = `translate3d(0, -${overlap}px, 0)`;
      } else {
        bar.style.transform = 'translate3d(0, 0, 0)';
      }
    };

    const handleScrollOrResize = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        updatePosition();
        rafId = null;
      });
    };

    window.addEventListener('scroll', handleScrollOrResize, { passive: true });
    window.addEventListener('resize', handleScrollOrResize, { passive: true });
    updatePosition();

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', handleScrollOrResize);
      window.removeEventListener('resize', handleScrollOrResize);
    };
  }, []);

  const handleClick = () => {
    // Record event in custom tracker
    try {
      fetch('/api/analytics/whatsapp-clicks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source: 'floating-whatsapp-btn', path: pathname }),
      }).catch((e) => console.error('Tracking error:', e));
    } catch {
      // Non-blocking tracking
    }

    const effectiveMsg = pathname?.includes('primo')
      ? 'Hi WholesalerJi, I am inquiring about Primo Wall Panels wholesale rates.'
      : pathname?.includes('elite')
      ? 'Hi WholesalerJi, I am inquiring about Elite UV High-Gloss Wall Panels wholesale rates.'
      : defaultMessage;

    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(effectiveMsg)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      {/* ── DESKTOP: Floating WhatsApp Action Button (Hidden on Mobile) ── */}
      <aside
        aria-label="WhatsApp Support Desk"
        className="hidden md:block fixed bottom-8 right-6 z-50 select-none"
      >
        <div className="relative group">
          {/* Animated Radar Pulse Ring */}
          <span className="absolute -inset-1 rounded-full bg-[#25D366] opacity-35 animate-ping pointer-events-none" />

          {/* Floating Action Button with 100% Official Authentic WhatsApp Logo */}
          <button
            type="button"
            onClick={handleClick}
            aria-label="Direct WhatsApp Procurement Desk"
            title="Chat with WholesalerJi Mill Desk"
            className="relative w-14 h-14 rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer focus:outline-none focus:ring-4 focus:ring-[#25D366]/40 drop-shadow-[0_10px_25px_rgba(37,211,102,0.45)]"
          >
            {/* 100% Authentic Official Meta WhatsApp Vector */}
            <svg
              className="w-14 h-14 select-none"
              viewBox="0 0 175.216 175.552"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient
                  id="wa-grad-desktop"
                  x1="85.915"
                  x2="86.535"
                  y1="32.567"
                  y2="137.092"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0" stopColor="#57d163" />
                  <stop offset="1" stopColor="#23b33a" />
                </linearGradient>
              </defs>
              {/* Outer white bubble outline */}
              <path
                fill="#ffffff"
                d="m12.966 161.238 10.439-38.114a73.42 73.42 0 0 1-9.821-36.772c.017-40.556 33.021-73.55 73.578-73.55 19.681.01 38.154 7.669 52.047 21.572s21.537 32.383 21.53 52.037c-.018 40.553-33.027 73.553-73.578 73.553h-.032c-12.313-.005-24.412-3.094-35.159-8.954z"
              />
              {/* Official WhatsApp green body */}
              <path
                fill="url(#wa-grad-desktop)"
                d="M87.184 25.227c-33.733 0-61.166 27.423-61.178 61.13a60.98 60.98 0 0 0 9.349 32.535l1.455 2.313-6.179 22.558 23.146-6.069 2.235 1.324c9.387 5.571 20.15 8.517 31.126 8.523h.023c33.707 0 61.14-27.426 61.153-61.135a60.75 60.75 0 0 0-17.895-43.251 60.75 60.75 0 0 0-43.235-17.928z"
              />
              {/* Official WhatsApp white handset */}
              <path
                fill="#ffffff"
                fillRule="evenodd"
                d="M68.772 55.603c-1.378-3.061-2.828-3.123-4.137-3.176l-3.524-.043c-1.226 0-3.218.46-4.902 2.3s-6.435 6.287-6.435 15.332 6.588 17.785 7.506 19.013 12.718 20.381 31.405 27.75c15.529 6.124 18.689 4.906 22.061 4.6s10.877-4.447 12.408-8.74 1.532-7.971 1.073-8.74-1.685-1.226-3.525-2.146-10.877-5.367-12.562-5.981-2.91-.919-4.137.921-4.746 5.979-5.819 7.206-2.144 1.381-3.984.462-7.76-2.861-14.784-9.124c-5.465-4.873-9.154-10.891-10.228-12.73s-.114-2.835.808-3.751c.825-.824 1.838-2.147 2.759-3.22s1.224-1.84 1.836-3.065.307-2.301-.153-3.22-4.032-10.011-5.666-13.647"
              />
            </svg>
          </button>

          {/* Desktop Tooltip */}
          <div className="absolute right-full top-1/2 -translate-y-1/2 mr-3 px-3 py-1.5 rounded-xl bg-stone-900/90 text-white text-[11px] font-mono whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity border border-stone-800 shadow-xl backdrop-blur-md">
            Direct WhatsApp Procurement Desk
          </div>
        </div>
      </aside>

      {/* ── MOBILE: High-Conversion Sticky Bottom Bar with Instant Zero-Lag Docking ── */}
      <div
        ref={mobileBarRef}
        className="md:hidden fixed inset-x-0 bottom-0 z-40 bg-stone-950/95 backdrop-blur-xl border-t border-stone-800 py-2.5 px-4 sm:px-6 flex items-center justify-between gap-3 shadow-[0_-4px_20px_rgba(0,0,0,0.4)] will-change-transform"
        style={{ transform: 'translate3d(0, 0, 0)' }}
      >
        {/* Left Side: Wholesale Rate / Contextual Indicator */}
        <div className="flex flex-col">
          <span className="text-[9px] font-mono uppercase tracking-widest text-stone-400">
            {pricingInfo.label}
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-base font-black text-amber-500 tracking-tight">
              {pricingInfo.price}
            </span>
            <span className="text-[10px] text-stone-400 font-mono">
              {pricingInfo.sub}
            </span>
          </div>
        </div>

        {/* Right Side: Authentic Green WhatsApp Action Button */}
        <button
          type="button"
          onClick={handleClick}
          className="flex-1 max-w-[210px] py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] active:scale-95 text-stone-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(37,211,102,0.35)] transition-all cursor-pointer"
        >
          {/* Authentic WhatsApp Logo Icon on Mobile Button */}
          <svg
            className="w-5 h-5 select-none flex-shrink-0"
            viewBox="0 0 175.216 175.552"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="#ffffff"
              d="m12.966 161.238 10.439-38.114a73.42 73.42 0 0 1-9.821-36.772c.017-40.556 33.021-73.55 73.578-73.55 19.681.01 38.154 7.669 52.047 21.572s21.537 32.383 21.53 52.037c-.018 40.553-33.027 73.553-73.578 73.553h-.032c-12.313-.005-24.412-3.094-35.159-8.954z"
            />
            <path
              fill="#25D366"
              d="M87.184 25.227c-33.733 0-61.166 27.423-61.178 61.13a60.98 60.98 0 0 0 9.349 32.535l1.455 2.313-6.179 22.558 23.146-6.069 2.235 1.324c9.387 5.571 20.15 8.517 31.126 8.523h.023c33.707 0 61.14-27.426 61.153-61.135a60.75 60.75 0 0 0-17.895-43.251 60.75 60.75 0 0 0-43.235-17.928z"
            />
            <path
              fill="#ffffff"
              fillRule="evenodd"
              d="M68.772 55.603c-1.378-3.061-2.828-3.123-4.137-3.176l-3.524-.043c-1.226 0-3.218.46-4.902 2.3s-6.435 6.287-6.435 15.332 6.588 17.785 7.506 19.013 12.718 20.381 31.405 27.75c15.529 6.124 18.689 4.906 22.061 4.6s10.877-4.447 12.408-8.74 1.532-7.971 1.073-8.74-1.685-1.226-3.525-2.146-10.877-5.367-12.562-5.981-2.91-.919-4.137.921-4.746 5.979-5.819 7.206-2.144 1.381-3.984.462-7.76-2.861-14.784-9.124c-5.465-4.873-9.154-10.891-10.228-12.73s-.114-2.835.808-3.751c.825-.824 1.838-2.147 2.759-3.22s1.224-1.84 1.836-3.065.307-2.301-.153-3.22-4.032-10.011-5.666-13.647"
            />
          </svg>
          <span className="truncate">Instant RFQ</span>
        </button>
      </div>
    </>
  );
}
