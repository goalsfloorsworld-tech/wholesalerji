'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { PanelProduct } from '@/data/types';
import { 
  X, Phone, User, MapPin, Mail, Send, CheckCircle2, 
  Minus, Plus, Info 
} from 'lucide-react';

export interface GetQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  activePanel: PanelProduct;
  allPanels: PanelProduct[];
  seriesLabel?: string;
  initialQuantity?: number;
  whatsappNumber?: string;
}

const ROLES = [
  { id: 'contractor', label: 'Contractor' },
  { id: 'architect', label: 'Architect' },
  { id: 'homeowner', label: 'Home Owner' },
  { id: 'dealer', label: 'B2B Dealer' },
] as const;

type RoleId = typeof ROLES[number]['id'];
type QuantityMode = 'direct' | 'discuss';

export default function GetQuoteModal({
  isOpen,
  onClose,
  activePanel,
  allPanels,
  seriesLabel = 'Wholesale Architectural Panels',
  initialQuantity = 20,
  whatsappNumber = '919999999999',
}: GetQuoteModalProps) {
  const [selectedCodes, setSelectedCodes] = useState<string[]>([activePanel.code]);
  const [quantityMode, setQuantityMode] = useState<QuantityMode>('direct');
  const [quantity, setQuantity] = useState<number>(initialQuantity);
  const [isManualMessageEdited, setIsManualMessageEdited] = useState(false);
  const [message, setMessage] = useState('');
  
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [userRole, setUserRole] = useState<RoleId>('contractor');

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [rfqRefId, setRfqRefId] = useState('');
  const [whatsappRedirectUrl, setWhatsappRedirectUrl] = useState('');
  const [validationError, setValidationError] = useState('');

  // Reset when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedCodes([activePanel.code]);
      setQuantityMode('direct');
      setQuantity(initialQuantity);
      setIsSubmitted(false);
      setValidationError('');
      setIsManualMessageEdited(false);
      setMessage('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]); 

  // Modern bulletproof scroll lock for mobile and desktop to prevent background scrolling
  useEffect(() => {
    if (!isOpen) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    const scrollY = window.scrollY;
    const originalStyles = {
      overflow: document.body.style.overflow,
      position: document.body.style.position,
      top: document.body.style.top,
      width: document.body.style.width,
    };

    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';

    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = originalStyles.overflow;
      document.body.style.position = originalStyles.position;
      document.body.style.top = originalStyles.top;
      document.body.style.width = originalStyles.width;
      window.scrollTo(0, scrollY);
      window.removeEventListener('keydown', handleKey);
    };
  }, [isOpen, onClose]);

  const selectedPanels = useMemo(
    () => allPanels.filter((panel) => selectedCodes.includes(panel.code)),
    [allPanels, selectedCodes]
  );

  const approxSqFt = Math.round(quantity * 9.5);

  const defaultAutoMessage = useMemo(() => {
    const codesStr = selectedPanels.map((p) => `${p.code} (${p.name})`).join(', ');
    const isHome = userRole === 'homeowner';
    const qtyText = quantityMode === 'direct' 
      ? `approx ${approxSqFt} sq ft (${quantity} panels)` 
      : (isHome ? `room guidance / quantity to be discussed` : `quantity to be discussed`);
    return `Hello Wholesaleji, I need a trade quote for ${
      codesStr || activePanel.name
    } — ${qtyText}. Please share best pricing, swatch availability and delivery schedule.`;
  }, [selectedPanels, activePanel.name, quantity, approxSqFt, quantityMode, userRole]);

  useEffect(() => {
    if (!isManualMessageEdited) {
      setMessage(defaultAutoMessage);
    }
  }, [defaultAutoMessage, isManualMessageEdited]);

  if (!isOpen) return null;

  const togglePanel = (code: string) => {
    setSelectedCodes((prev) => {
      if (prev.includes(code)) {
        return prev.length === 1 ? prev : prev.filter((c) => c !== code);
      }
      return [...prev, code];
    });
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanPhone = phone.replace(/\D/g, '');

    if (!phone.trim() || cleanPhone.length < 10) {
      setValidationError('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!address.trim()) {
      setValidationError('Please enter your delivery location.');
      return;
    }

    setValidationError('');
    const ref = `WJ-${Math.floor(100000 + Math.random() * 900000)}`;

    const panelLines = selectedPanels
      .map((p) => `• ${p.code}: ${p.name}`)
      .join('\n');

    const isHome = userRole === 'homeowner';
    const qtyText = quantityMode === 'direct' ? `${quantity} panels (~${approxSqFt} sq ft)` : `To be discussed`;

    const text = encodeURIComponent(
      `*WHOLESALEJI ${isHome ? 'INQUIRY' : 'B2B RFQ'}* [Ref: ${ref}]\n\n` +
        `Name: ${name.trim() || (isHome ? 'Home Owner' : 'Not Provided')}\n` +
        `Phone: ${phone.trim()}\n` +
        `Location: ${address.trim()}\n` +
        (email.trim() ? `Email: ${email.trim()}\n` : '') +
        `Type: ${userRole.toUpperCase()}\n\n` +
        `Series: ${seriesLabel}\n` +
        `Qty: ${qtyText}\n\n` +
        `Selected Panels:\n${panelLines}\n\n` +
        `Note: ${message.trim()}`
    );

    const waUrl = `https://wa.me/${whatsappNumber}?text=${text}`;
    setWhatsappRedirectUrl(waUrl);
    setRfqRefId(ref);

    window.open(waUrl, '_blank');
    setIsSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 lg:p-8 overscroll-contain">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-stone-900/80 dark:bg-black/90 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
        onTouchMove={(e) => e.preventDefault()}
      />

      {/* Modal Container (Same exact design on desktop and mobile) */}
      <div 
        className="relative z-10 w-full max-w-5xl rounded-2xl md:rounded-[2rem] bg-white dark:bg-[#111111] shadow-2xl flex flex-col md:flex-row max-h-[92vh] md:max-h-[85vh] overflow-hidden animate-in fade-in zoom-in-95 duration-300 border border-stone-200 dark:border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Side: Friendly Greeting Image (Hidden on Mobile) */}
        <div className="hidden md:flex md:w-2/5 relative flex-col justify-end overflow-hidden">
          <Image
            src="/quote-greeting.jpg"
            alt="Wholesaleji Greeting"
            fill
            sizes="400px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
          
          <div className="relative z-10 p-8 pt-24 text-left">
            <h3 className="text-3xl font-bold tracking-tight text-white mb-3">
              Let&apos;s talk business.
            </h3>
            <p className="text-stone-300 font-medium text-sm leading-relaxed max-w-sm">
              Request a trade quote directly via WhatsApp. Our sales team is ready to offer you the best B2B pricing and delivery schedules.
            </p>
          </div>
        </div>

        {/* Right Side: Exact same form content on mobile and desktop */}
        <div className="flex-1 flex flex-col min-h-0 bg-stone-50 dark:bg-[#161616]">
          {!isSubmitted ? (
            <>
              {/* Header */}
              <div className="flex-shrink-0 flex items-center justify-between px-5 sm:px-6 py-3.5 border-b border-stone-200 dark:border-white/5 bg-white dark:bg-[#111111]">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-stone-900 dark:text-white leading-none">
                    Request Trade Quote
                  </h2>
                  <p className="text-xs text-stone-500 mt-1">
                    {seriesLabel}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="rounded-full p-1.5 text-stone-500 hover:bg-stone-100 dark:hover:bg-white/10 transition-colors"
                  aria-label="Close quote modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Body - Simple scrolling, no nested sliders */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 sm:space-y-8 custom-scrollbar overscroll-contain">
                
                {validationError && (
                  <div className="flex items-center gap-3 rounded-xl bg-red-50 dark:bg-red-950/30 p-3.5 text-xs sm:text-sm font-medium text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/50">
                    <Info className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                    <p>{validationError}</p>
                  </div>
                )}

                {/* 1. Panel Selection */}
                <section>
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-stone-900 dark:text-stone-300">
                      1. SELECT PANELS
                    </h4>
                    <span className="text-xs font-semibold text-amber-600 dark:text-amber-500">
                      {selectedCodes.length} selected
                    </span>
                  </div>
                  {/* Grid / flex wrap matching screenshot */}
                  <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2.5 sm:gap-3">
                    {allPanels.map((panel) => {
                      const isSelected = selectedCodes.includes(panel.code);
                      return (
                        <button
                          key={panel.code}
                          type="button"
                          onClick={() => togglePanel(panel.code)}
                          className={`group relative flex items-center gap-2.5 sm:gap-3 rounded-xl border p-2 pr-3 sm:pr-4 transition-all ${
                            isSelected
                              ? 'border-amber-500 bg-amber-50 dark:bg-amber-500/10'
                              : 'border-stone-200 dark:border-white/10 bg-white dark:bg-[#1a1a1a] hover:border-amber-300 dark:hover:border-amber-700'
                          }`}
                        >
                          <div className="relative w-8 h-8 overflow-hidden rounded-md border border-stone-100 dark:border-white/5 shrink-0">
                            <Image src={panel.imageUrl} alt={panel.code} fill className="object-cover" sizes="32px" />
                          </div>
                          <p className={`text-xs font-bold ${isSelected ? 'text-amber-700 dark:text-amber-400' : 'text-stone-700 dark:text-stone-300'}`}>
                            {panel.code}
                          </p>
                          {isSelected && (
                            <div className="absolute -top-1 -right-1 sm:-top-1.5 sm:-right-1.5 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-amber-500 rounded-full border-2 border-white dark:border-[#161616]" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </section>

                {/* 2. Quantity Option */}
                <section>
                  <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-stone-900 dark:text-stone-300 mb-3 sm:mb-4">
                    2. QUANTITY REQUIREMENT
                  </h4>
                  
                  <div className="inline-flex gap-2 mb-4 sm:mb-5 p-1 rounded-xl bg-stone-200 dark:bg-white/5">
                    <button
                      type="button"
                      onClick={() => setQuantityMode('direct')}
                      className={`rounded-lg px-3.5 sm:px-4 py-2 text-xs font-bold transition-all ${
                        quantityMode === 'direct' 
                          ? 'bg-amber-500 text-white shadow-sm'
                          : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                      }`}
                    >
                      I know my quantity
                    </button>
                    <button
                      type="button"
                      onClick={() => setQuantityMode('discuss')}
                      className={`rounded-lg px-3.5 sm:px-4 py-2 text-xs font-bold transition-all ${
                        quantityMode === 'discuss' 
                          ? 'bg-amber-500 text-white shadow-sm'
                          : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                      }`}
                    >
                      Discuss later
                    </button>
                  </div>

                  {quantityMode === 'direct' && (
                    <div className="flex items-center gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="flex items-center rounded-xl border border-stone-200 dark:border-white/10 bg-white dark:bg-[#1a1a1a] p-1">
                        <button
                          type="button"
                          onClick={() => setQuantity((q) => Math.max(10, q - 10))}
                          className="p-2.5 sm:p-3 text-stone-500 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-white/5 rounded-lg transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <div className="w-14 sm:w-16 text-center text-base sm:text-lg font-bold text-stone-900 dark:text-white">
                          {quantity}
                        </div>
                        <button
                          type="button"
                          onClick={() => setQuantity((q) => q + 10)}
                          className="p-2.5 sm:p-3 text-stone-500 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-white/5 rounded-lg transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-semibold text-stone-900 dark:text-stone-200">Panels</p>
                        <p className="text-[11px] sm:text-xs text-stone-500 dark:text-stone-400">Approx {approxSqFt} sq ft</p>
                      </div>
                    </div>
                  )}
                </section>

                {/* 3. Contact Details */}
                <section>
                  <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-stone-900 dark:text-stone-300 mb-3 sm:mb-4">
                    3. YOUR DETAILS
                  </h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-stone-600 dark:text-stone-400 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5" /> WhatsApp Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full rounded-xl border border-stone-200 dark:border-white/10 bg-white dark:bg-[#1a1a1a] px-3.5 sm:px-4 py-2.5 sm:py-3 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all dark:text-white"
                      />
                    </div>
                    
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-stone-600 dark:text-stone-400 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5" /> {userRole === 'homeowner' ? 'Your Name' : 'Name / Firm'}
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={userRole === 'homeowner' ? 'Rajesh Sharma' : 'Rajesh Sharma / Firm'}
                        className="w-full rounded-xl border border-stone-200 dark:border-white/10 bg-white dark:bg-[#1a1a1a] px-3.5 sm:px-4 py-2.5 sm:py-3 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all dark:text-white"
                      />
                    </div>

                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-xs font-semibold text-stone-600 dark:text-stone-400 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" /> Delivery Location *
                      </label>
                      <input
                        type="text"
                        required
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="DLF Phase 5, Gurgaon"
                        className="w-full rounded-xl border border-stone-200 dark:border-white/10 bg-white dark:bg-[#1a1a1a] px-3.5 sm:px-4 py-2.5 sm:py-3 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all dark:text-white"
                      />
                    </div>

                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-xs font-semibold text-stone-600 dark:text-stone-400 flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5" /> Email Address <span className="text-stone-400 font-normal">(Optional)</span>
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="project@studio.com"
                        className="w-full rounded-xl border border-stone-200 dark:border-white/10 bg-white dark:bg-[#1a1a1a] px-3.5 sm:px-4 py-2.5 sm:py-3 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Role Selector */}
                  <div className="mt-5 sm:mt-6">
                    <label className="text-xs font-semibold text-stone-600 dark:text-stone-400 mb-2.5 block">
                      I am a:
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {ROLES.map((role) => (
                        <button
                          key={role.id}
                          type="button"
                          onClick={() => setUserRole(role.id)}
                          className={`rounded-full px-3.5 sm:px-4 py-1.5 sm:py-2 text-xs font-semibold transition-all ${
                            userRole === role.id
                              ? 'bg-stone-900 text-white dark:bg-white dark:text-stone-900 shadow-md'
                              : 'bg-white dark:bg-[#1a1a1a] border border-stone-200 dark:border-white/10 text-stone-600 dark:text-stone-400 hover:border-stone-400 dark:hover:border-white/30'
                          }`}
                        >
                          {role.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Note */}
                  <div className="mt-5 sm:mt-6 space-y-1.5">
                    <label className="text-xs font-semibold text-stone-600 dark:text-stone-400 flex items-center gap-1.5">
                      Project Note
                    </label>
                    <textarea
                      rows={2}
                      value={message}
                      onChange={(e) => {
                        setMessage(e.target.value);
                        setIsManualMessageEdited(true);
                      }}
                      className="w-full rounded-xl border border-stone-200 dark:border-white/10 bg-white dark:bg-[#1a1a1a] px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all dark:text-white resize-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                    />
                  </div>
                </section>
              </div>

              {/* Footer / Submit */}
              <div className="flex-shrink-0 px-4 sm:px-6 py-3.5 sm:py-4 border-t border-stone-200 dark:border-white/5 bg-white dark:bg-[#111111]">
                <button
                  type="button"
                  onClick={() => handleSubmit()}
                  className="w-full group flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-amber-500/25 transition-all hover:scale-[1.01] hover:shadow-xl hover:shadow-amber-500/40 active:scale-[0.99]"
                >
                  Generate Trade Quote <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <p className="text-center text-[10px] text-stone-500 dark:text-stone-400 mt-2 font-medium">
                  Automatically opens your WhatsApp
                </p>
              </div>
            </>
          ) : (
            /* SUCCESS STATE */
            <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-8 text-center animate-in fade-in zoom-in duration-500 bg-white dark:bg-[#111111]">
              <div className="relative mb-5 sm:mb-6">
                <div className="absolute inset-0 rounded-full bg-amber-500/20 animate-ping" />
                <div className="relative flex w-16 h-16 sm:w-20 sm:h-20 items-center justify-center rounded-full bg-gradient-to-tr from-amber-500 to-amber-400 text-white shadow-xl shadow-amber-500/30">
                  <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10" />
                </div>
              </div>
              
              <h3 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-white mb-2">
                Quote Request Initiated
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mb-6 sm:mb-8 max-w-sm">
                WhatsApp has been opened with your requirements. Our sales team will get back to you with the wholesale pricing.
              </p>

              <div className="w-full max-w-sm bg-stone-100 dark:bg-white/5 rounded-xl p-3.5 sm:p-4 mb-6 sm:mb-8 border border-stone-200 dark:border-white/10">
                <p className="text-[10px] sm:text-xs uppercase tracking-wider text-stone-500 dark:text-stone-400 font-bold mb-1">
                  Reference ID
                </p>
                <p className="font-mono text-base sm:text-lg font-bold text-amber-600 dark:text-amber-500">
                  {rfqRefId}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
                <a
                  href={whatsappRedirectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 rounded-xl bg-amber-500 hover:bg-amber-600 px-4 py-3 text-sm font-bold text-white transition-colors flex items-center justify-center gap-1.5"
                >
                  Open WhatsApp
                </a>
                <button
                  onClick={onClose}
                  className="flex-1 rounded-xl bg-stone-200 dark:bg-white/10 px-4 py-3 text-sm font-bold text-stone-900 dark:text-white hover:bg-stone-300 dark:hover:bg-white/20 transition-colors"
                >
                  Close Window
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Required for custom scrollbar styling */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
          height: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #f59e0b; /* amber-500 */
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #d97706; /* amber-600 */
        }
      `}</style>
    </div>
  );
}