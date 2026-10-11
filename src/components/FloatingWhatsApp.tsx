'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

interface FloatingWhatsAppProps {
  whatsappNumber?: string;
  defaultMessage?: string;
}

const PHRASES = [
  "Let's talk",
  "Get an instant quote",
  "Get direct mill rate",
  "Don't know what you want?"
];

export default function FloatingWhatsApp({
  whatsappNumber = '919217400163',
  defaultMessage = 'Hi WholesalerJi, I am inquiring about Wall Panels wholesale rates for my project.',
}: FloatingWhatsAppProps) {
  const pathname = usePathname();
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [isPhraseVisible, setIsPhraseVisible] = useState(false);

  useEffect(() => {
    const cyclePhrase = () => {
      setCurrentPhraseIndex((prev) => (prev + 1) % PHRASES.length);
      setIsPhraseVisible(true);
      setTimeout(() => {
        setIsPhraseVisible(false);
      }, 3000); // visible for 3 seconds
    };

    // Initial delay before first phrase
    const initialTimeout = setTimeout(() => {
      cyclePhrase();
      // Start interval (8 seconds total = 3s visible + 5s hidden)
      const interval = setInterval(cyclePhrase, 8000);
      return () => clearInterval(interval);
    }, 2000);

    return () => clearTimeout(initialTimeout);
  }, []);

  const handleClick = () => {
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
    <aside
      aria-label="WhatsApp Support Desk"
      className="fixed bottom-6 right-6 z-50 select-none"
    >
      <div className="relative group flex items-center justify-end">
        
        {/* Rotating Tooltip */}
        <div 
          className={`absolute right-full mr-4 px-3.5 py-1.5 rounded-xl bg-stone-900 text-white text-[13px] font-bold whitespace-nowrap border border-stone-800 shadow-2xl transition-all duration-700 ease-out pointer-events-none origin-right -z-10 ${
            isPhraseVisible ? 'opacity-100 scale-100 translate-x-0' : 'opacity-0 scale-90 translate-x-12'
          }`}
        >
          {PHRASES[currentPhraseIndex]}
          {/* Tooltip triangle pointer */}
          <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 bg-stone-900 border-r border-t border-stone-800 rotate-45" />
        </div>

        {/* Animated Radar Pulse Ring - Slower & Smoother */}
        <span 
          className="absolute right-0 w-14 h-14 rounded-full bg-[#25D366] opacity-30 pointer-events-none"
          style={{ animation: 'ping 3s cubic-bezier(0, 0, 0.2, 1) infinite' }}
        />

        {/* Floating Action Button - Green Circle */}
        <button
          type="button"
          onClick={handleClick}
          aria-label="Direct WhatsApp Procurement Desk"
          title="Chat with WholesalerJi Mill Desk"
          className="relative w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center hover:scale-110 hover:bg-[#20bd5a] active:scale-95 transition-all duration-300 cursor-pointer focus:outline-none focus:ring-4 focus:ring-[#25D366]/40 drop-shadow-[0_10px_25px_rgba(37,211,102,0.45)] z-10"
        >
          <svg className="w-8 h-8 text-white fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.487-1.761-1.66-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
          </svg>
        </button>

      </div>
    </aside>
  );
}
