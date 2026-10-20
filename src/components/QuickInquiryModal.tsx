'use client';

import React, { useEffect } from 'react';
import { Phone, ArrowRight, X, FileText } from 'lucide-react';

export interface QuickInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  whatsappMessage?: string;
  analyticsSource?: string;
  panelCode?: string;
  phoneNumber?: string;
  onOpenForm?: () => void;
}

export default function QuickInquiryModal({
  isOpen,
  onClose,
  title = 'Get Quote',
  subtitle = 'Connect directly for wholesale rates and project estimates.',
  whatsappMessage = 'Hi WholesalerJi, I want to inquire about Wall Panels wholesale rates and delivery.',
  analyticsSource = 'inquiry-modal',
  panelCode = 'general',
  phoneNumber = '+91 92174 00163',
  onOpenForm,
}: QuickInquiryModalProps) {
  // Lock body scroll and handle ESC key
  useEffect(() => {
    if (!isOpen) return;

    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Freeze content when modal opens so underlying parent re-renders never fluctuate the modal
  const [frozen, setFrozen] = React.useState({
    title,
    subtitle,
    whatsappMessage,
    panelCode,
    phoneNumber,
  });

  useEffect(() => {
    if (isOpen) {
      setFrozen({
        title,
        subtitle,
        whatsappMessage,
        panelCode,
        phoneNumber,
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const displayTitle = frozen.title || title;
  const displaySubtitle = frozen.subtitle || subtitle;
  const displayMessage = frozen.whatsappMessage || whatsappMessage;
  const displayCode = frozen.panelCode || panelCode;
  const displayPhone = frozen.phoneNumber || phoneNumber;
  const cleanPhone = displayPhone.replace(/[^0-9+]/g, '');

  const handleWhatsAppClick = () => {
    try {
      fetch('/api/analytics/whatsapp-clicks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source: `${analyticsSource}-whatsapp`, panel: displayCode }),
      }).catch(() => {});
    } catch {}

    const url = `https://wa.me/${cleanPhone.replace('+', '')}?text=${encodeURIComponent(displayMessage)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    onClose();
  };

  const handleCallClick = () => {
    try {
      fetch('/api/analytics/whatsapp-clicks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source: `${analyticsSource}-call`, panel: displayCode }),
      }).catch(() => {});
    } catch {}

    onClose();
  };

  const handleFormClick = () => {
    onClose();
    if (onOpenForm) {
      onOpenForm();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="quick-inquiry-modal-title"
      data-lenis-prevent="true"
      onWheel={(e) => e.stopPropagation()}
      className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        data-lenis-prevent="true"
        className="relative w-full max-w-md rounded-3xl bg-stone-900/95 border border-stone-800 p-6 sm:p-7 shadow-2xl overflow-hidden text-left animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle Ambient Gold Glow at Top */}
        <div className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-32 bg-amber-500/15 blur-3xl rounded-full" />

        {/* Close Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          aria-label="Close modal"
          className="absolute top-4 right-4 sm:top-5 sm:right-5 w-9 h-9 rounded-full bg-stone-800 hover:bg-stone-700 active:scale-95 text-stone-300 hover:text-white flex items-center justify-center transition-all cursor-pointer z-50 pointer-events-auto touch-manipulation"
        >
          <X className="w-5 h-5 pointer-events-none" />
        </button>

        {/* Header */}
        <div className="mb-5 pr-8 relative z-10">
          <h3
            id="quick-inquiry-modal-title"
            className="text-2xl font-black text-white tracking-tight"
          >
            {displayTitle}
          </h3>
          <p className="text-xs text-stone-400 mt-1 leading-relaxed">
            {displaySubtitle}
          </p>
        </div>

        {/* The 3 Direct Action Options */}
        <div className="space-y-3 relative z-10">
          {/* Option 1: WhatsApp */}
          <button
            type="button"
            onClick={handleWhatsAppClick}
            className="w-full p-3.5 rounded-2xl bg-stone-800/60 hover:bg-[#25D366]/10 border border-stone-700/60 hover:border-[#25D366]/60 transition-all duration-200 flex items-center gap-3.5 text-left group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#25D366]/15 border border-[#25D366]/30 text-[#25D366] flex items-center justify-center flex-shrink-0 group-hover:scale-105 group-hover:shadow-[0_0_15px_rgba(37,211,102,0.3)] transition-all">
              <svg
                className="w-7 h-7 select-none"
                viewBox="0 0 175.216 175.552"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="wa-modal-gradient" x1="85.915" x2="86.535" y1="32.567" y2="137.092" gradientUnits="userSpaceOnUse">
                    <stop offset="0" stopColor="#57d163" />
                    <stop offset="1" stopColor="#23b33a" />
                  </linearGradient>
                </defs>
                <path fill="#ffffff" d="m12.966 161.238 10.439-38.114a73.42 73.42 0 0 1-9.821-36.772c.017-40.556 33.021-73.55 73.578-73.55 19.681.01 38.154 7.669 52.047 21.572s21.537 32.383 21.53 52.037c-.018 40.553-33.027 73.553-73.578 73.553h-.032c-12.313-.005-24.412-3.094-35.159-8.954z"/>
                <path fill="url(#wa-modal-gradient)" d="M87.184 25.227c-33.733 0-61.166 27.423-61.178 61.13a60.98 60.98 0 0 0 9.349 32.535l1.455 2.313-6.179 22.558 23.146-6.069 2.235 1.324c9.387 5.571 20.15 8.517 31.126 8.523h.023c33.707 0 61.14-27.426 61.153-61.135a60.75 60.75 0 0 0-17.895-43.251 60.75 60.75 0 0 0-43.235-17.928z"/>
                <path fill="#ffffff" fillRule="evenodd" d="M68.772 55.603c-1.378-3.061-2.828-3.123-4.137-3.176l-3.524-.043c-1.226 0-3.218.46-4.902 2.3s-6.435 6.287-6.435 15.332 6.588 17.785 7.506 19.013 12.718 20.381 31.405 27.75c15.529 6.124 18.689 4.906 22.061 4.6s10.877-4.447 12.408-8.74 1.532-7.971 1.073-8.74-1.685-1.226-3.525-2.146-10.877-5.367-12.562-5.981-2.91-.919-4.137.921-4.746 5.979-5.819 7.206-2.144 1.381-3.984.462-7.76-2.861-14.784-9.124c-5.465-4.873-9.154-10.891-10.228-12.73s-.114-2.835.808-3.751c.825-.824 1.838-2.147 2.759-3.22s1.224-1.84 1.836-3.065.307-2.301-.153-3.22-4.032-10.011-5.666-13.647"/>
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-white text-base group-hover:text-[#25D366] transition-colors">
                WhatsApp
              </div>
              <p className="text-xs text-stone-400 mt-0.5 truncate">
                Instant rates &amp; shade catalogues
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-stone-500 group-hover:text-[#25D366] group-hover:translate-x-1 transition-all flex-shrink-0" />
          </button>

          {/* Option 2: Direct Call */}
          <a
            href={`tel:${cleanPhone}`}
            onClick={handleCallClick}
            className="w-full p-3.5 rounded-2xl bg-stone-800/60 hover:bg-amber-500/10 border border-stone-700/60 hover:border-amber-500/60 transition-all duration-200 flex items-center gap-3.5 text-left group cursor-pointer block"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-500 flex items-center justify-center flex-shrink-0 group-hover:scale-105 group-hover:shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all">
              <Phone className="w-5 h-5 text-amber-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-white text-base group-hover:text-amber-400 transition-colors">
                Direct Call
              </div>
              <p className="text-xs text-stone-400 mt-0.5 truncate font-mono">
                {phoneNumber} • Instant assist
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-stone-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all flex-shrink-0" />
          </a>

          {/* Option 3: Online Form */}
          <button
            type="button"
            onClick={handleFormClick}
            className="w-full p-3.5 rounded-2xl bg-stone-800/60 hover:bg-blue-500/10 border border-stone-700/60 hover:border-blue-500/60 transition-all duration-200 flex items-center gap-3.5 text-left group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-500/15 border border-blue-500/30 text-blue-400 flex items-center justify-center flex-shrink-0 group-hover:scale-105 group-hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all">
              <FileText className="w-5 h-5 text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-white text-base group-hover:text-blue-400 transition-colors">
                Quote Form
              </div>
              <p className="text-xs text-stone-400 mt-0.5 truncate">
                Project specs &amp; wholesale quote
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-stone-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all flex-shrink-0" />
          </button>
        </div>
      </div>
    </div>
  );
}
