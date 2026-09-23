'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { PanelProduct } from '@/data/types';
import { 
  X, Phone, User, MapPin, Mail, Send, CheckCircle2, 
  Minus, Plus, Info, Home, Building2, Check, ArrowRight, ArrowLeft,
  Sparkles
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
  seriesLabel = 'Premium Wall Panels',
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

  // Mobile 3-step wizard state (1: Role & Quantity, 2: Choose Panels, 3: Details)
  const [mobileStep, setMobileStep] = useState<1 | 2 | 3>(1);

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
      setMobileStep(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]); 

  // Modern bulletproof scroll lock for mobile + desktop
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
      : (isHome ? `room guidance / discuss quantity later` : `quantity to be discussed`);
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
      setValidationError('Please enter your delivery city or location.');
      return;
    }

    setValidationError('');
    const ref = `WJ-${Math.floor(100000 + Math.random() * 900000)}`;

    const panelLines = selectedPanels
      .map((p) => `• ${p.code}: ${p.name}`)
      .join('\n');

    const isHome = userRole === 'homeowner';
    const qtyText = quantityMode === 'direct' 
      ? `${quantity} panels (~${approxSqFt} sq ft)` 
      : (isHome ? `Discuss later / Room guidance` : `To be discussed`);

    const customerType = isHome 
      ? 'HOME OWNER' 
      : userRole.toUpperCase();

    const text = encodeURIComponent(
      `*WHOLESALEJI ${isHome ? 'HOME OWNER INQUIRY' : 'B2B RFQ'}* [Ref: ${ref}]\n\n` +
        `Name: ${name.trim() || (isHome ? 'Home Owner' : 'Trade Buyer')}\n` +
        `Phone: ${phone.trim()}\n` +
        `Location: ${address.trim()}\n` +
        (email.trim() ? `Email: ${email.trim()}\n` : '') +
        `Type: ${customerType}\n\n` +
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

      {/* Modal Container */}
      <div 
        className="relative z-10 w-full max-w-5xl rounded-2xl md:rounded-[2rem] bg-white dark:bg-[#111111] shadow-2xl flex flex-col md:flex-row h-[90vh] md:h-auto md:max-h-[85vh] overflow-hidden animate-in fade-in zoom-in-95 duration-300 border border-stone-200 dark:border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ========================================================= */}
        {/* DESKTOP LEFT SIDE: Greeting Image (Hidden on Mobile)     */}
        {/* ========================================================= */}
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

        {/* ========================================================= */}
        {/* MODAL BODY (Desktop Full Form OR Mobile 3-Step Wizard)     */}
        {/* ========================================================= */}
        <div className="flex-1 flex flex-col min-h-0 bg-stone-50 dark:bg-[#161616]">
          {!isSubmitted ? (
            <>
              {/* =================================================== */}
              {/* 1. DESKTOP FORM VIEW (UNCHANGED AS REQUESTED)       */}
              {/* =================================================== */}
              <div className="hidden md:flex flex-col flex-1 min-h-0">
                {/* Desktop Header */}
                <div className="flex-shrink-0 flex items-center justify-between px-6 py-3.5 border-b border-stone-200 dark:border-white/5 bg-white dark:bg-[#111111]">
                  <div>
                    <h2 className="text-lg font-bold text-stone-900 dark:text-white leading-none">
                      Request Trade Quote
                    </h2>
                  </div>
                  <button
                    onClick={onClose}
                    className="rounded-full p-1.5 text-stone-500 hover:bg-stone-100 dark:hover:bg-white/10 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Desktop Form Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                  {validationError && (
                    <div className="flex items-center gap-3 rounded-xl bg-red-50 dark:bg-red-950/30 p-4 text-sm font-medium text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/50">
                      <Info className="w-5 h-5 shrink-0" />
                      <p>{validationError}</p>
                    </div>
                  )}

                  {/* 1. Panel Selection */}
                  <section>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-bold uppercase tracking-wider text-stone-900 dark:text-stone-300">
                        1. Select Panels
                      </h4>
                      <span className="text-xs font-semibold text-amber-600 dark:text-amber-500">
                        {selectedCodes.length} selected
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {allPanels.map((panel) => {
                        const isSelected = selectedCodes.includes(panel.code);
                        return (
                          <button
                            key={panel.code}
                            type="button"
                            onClick={() => togglePanel(panel.code)}
                            className={`group relative flex items-center gap-3 rounded-xl border p-2 pr-4 transition-all ${
                              isSelected
                                ? 'border-amber-500 bg-amber-50 dark:bg-amber-500/10'
                                : 'border-stone-200 dark:border-white/10 bg-white dark:bg-[#1a1a1a] hover:border-amber-300 dark:hover:border-amber-700'
                            }`}
                          >
                            <div className="relative w-8 h-8 overflow-hidden rounded-md border border-stone-100 dark:border-white/5">
                              <Image src={panel.imageUrl} alt={panel.code} fill className="object-cover" />
                            </div>
                            <p className={`text-xs font-bold ${isSelected ? 'text-amber-700 dark:text-amber-400' : 'text-stone-700 dark:text-stone-300'}`}>
                              {panel.code}
                            </p>
                            {isSelected && (
                              <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-amber-500 rounded-full border-2 border-white dark:border-[#161616]" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </section>

                  {/* 2. Quantity Option */}
                  <section>
                    <h4 className="text-sm font-bold uppercase tracking-wider text-stone-900 dark:text-stone-300 mb-4">
                      2. Quantity Requirement
                    </h4>
                    
                    <div className="inline-flex gap-2 mb-5 p-1 rounded-xl bg-stone-200 dark:bg-white/5">
                      <button
                        type="button"
                        onClick={() => setQuantityMode('direct')}
                        className={`rounded-lg px-4 py-2 text-xs font-bold transition-all ${
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
                        className={`rounded-lg px-4 py-2 text-xs font-bold transition-all ${
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
                            className="p-3 text-stone-500 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-white/5 rounded-lg transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <div className="w-16 text-center text-lg font-bold text-stone-900 dark:text-white">
                            {quantity}
                          </div>
                          <button
                            type="button"
                            onClick={() => setQuantity((q) => q + 10)}
                            className="p-3 text-stone-500 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-white/5 rounded-lg transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-stone-900 dark:text-stone-200">Panels</p>
                          <p className="text-xs text-stone-500 dark:text-stone-400">Approx {approxSqFt} sq ft</p>
                        </div>
                      </div>
                    )}
                  </section>

                  {/* 3. Contact Details */}
                  <section>
                    <h4 className="text-sm font-bold uppercase tracking-wider text-stone-900 dark:text-stone-300 mb-4">
                      3. Your Details
                    </h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                          className="w-full rounded-xl border border-stone-200 dark:border-white/10 bg-white dark:bg-[#1a1a1a] px-4 py-3 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all dark:text-white"
                        />
                      </div>
                      
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-stone-600 dark:text-stone-400 flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5" /> Name / Firm
                        </label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Rajesh Sharma"
                          className="w-full rounded-xl border border-stone-200 dark:border-white/10 bg-white dark:bg-[#1a1a1a] px-4 py-3 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all dark:text-white"
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
                          className="w-full rounded-xl border border-stone-200 dark:border-white/10 bg-white dark:bg-[#1a1a1a] px-4 py-3 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all dark:text-white"
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
                          className="w-full rounded-xl border border-stone-200 dark:border-white/10 bg-white dark:bg-[#1a1a1a] px-4 py-3 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all dark:text-white"
                        />
                      </div>
                    </div>

                    {/* Role Selector */}
                    <div className="mt-6">
                      <label className="text-xs font-semibold text-stone-600 dark:text-stone-400 mb-3 block">
                        I am a:
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {ROLES.map((role) => (
                          <button
                            key={role.id}
                            type="button"
                            onClick={() => setUserRole(role.id)}
                            className={`rounded-full px-4 py-2 text-xs font-semibold transition-all ${
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
                    <div className="mt-6 space-y-1.5">
                      <label className="text-xs font-semibold text-stone-600 dark:text-stone-400 flex items-center gap-1.5">
                        Project Note
                      </label>
                      <textarea
                        rows={3}
                        value={message}
                        onChange={(e) => {
                          setMessage(e.target.value);
                          setIsManualMessageEdited(true);
                        }}
                        className="w-full rounded-xl border border-stone-200 dark:border-white/10 bg-white dark:bg-[#1a1a1a] px-4 py-3 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all dark:text-white resize-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                      />
                    </div>
                  </section>
                </div>

                {/* Desktop Footer / Submit */}
                <div className="flex-shrink-0 px-6 py-4 border-t border-stone-200 dark:border-white/5 bg-white dark:bg-[#111111]">
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
              </div>

              {/* =================================================== */}
              {/* 2. MOBILE 3-STEP WIZARD (DEDICATED PHONE SCREEN UX) */}
              {/* =================================================== */}
              <div className="flex md:hidden flex-col flex-1 min-h-0">
                {/* Mobile Header with 3-Step Indicator */}
                <div className="flex-shrink-0 px-4 py-3 border-b border-stone-200 dark:border-white/10 bg-white dark:bg-[#111111]">
                  <div className="flex items-center justify-between mb-2.5">
                    <div>
                      <h2 className="text-base font-bold text-stone-900 dark:text-white leading-tight">
                        Request Quote
                      </h2>
                      <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                        {seriesLabel}
                      </p>
                    </div>
                    <button
                      onClick={onClose}
                      className="rounded-full p-1.5 text-stone-500 hover:bg-stone-100 dark:hover:bg-white/10 transition-colors"
                      aria-label="Close modal"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* 3-Step Pill Progress Bar */}
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      type="button"
                      onClick={() => setMobileStep(1)}
                      className={`h-1.5 rounded-full transition-all ${
                        mobileStep >= 1 ? 'bg-amber-500' : 'bg-stone-200 dark:bg-white/10'
                      }`}
                      aria-label="Step 1"
                    />
                    <button
                      type="button"
                      onClick={() => setMobileStep(2)}
                      className={`h-1.5 rounded-full transition-all ${
                        mobileStep >= 2 ? 'bg-amber-500' : 'bg-stone-200 dark:bg-white/10'
                      }`}
                      aria-label="Step 2"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (selectedCodes.length > 0) setMobileStep(3);
                      }}
                      className={`h-1.5 rounded-full transition-all ${
                        mobileStep >= 3 ? 'bg-amber-500' : 'bg-stone-200 dark:bg-white/10'
                      }`}
                      aria-label="Step 3"
                    />
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-stone-500 dark:text-stone-400 mt-1 font-semibold">
                    <span className={mobileStep === 1 ? 'text-amber-600 dark:text-amber-400 font-bold' : ''}>
                      1. You &amp; Qty
                    </span>
                    <span className={mobileStep === 2 ? 'text-amber-600 dark:text-amber-400 font-bold' : ''}>
                      2. Panels ({selectedCodes.length})
                    </span>
                    <span className={mobileStep === 3 ? 'text-amber-600 dark:text-amber-400 font-bold' : ''}>
                      3. Details
                    </span>
                  </div>
                </div>

                {/* Validation Error Banner */}
                {validationError && (
                  <div className="flex-shrink-0 mx-4 mt-3 flex items-center gap-2 rounded-xl bg-red-50 dark:bg-red-950/40 p-2.5 text-xs font-semibold text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/60 animate-in fade-in">
                    <Info className="w-4 h-4 shrink-0" />
                    <p>{validationError}</p>
                  </div>
                )}

                {/* STEP 1: HOMEOWNER VS B2B & QUANTITY */}
                {mobileStep === 1 && (
                  <>
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                      <div className="text-left">
                        <h3 className="text-sm font-bold text-stone-900 dark:text-white">
                          Who is this quote for?
                        </h3>
                        <p className="text-xs text-stone-500 dark:text-stone-400">
                          Select your buying type for tailored pricing &amp; process.
                        </p>
                      </div>

                      {/* Card 1: Home Owner */}
                      <div
                        onClick={() => {
                          setUserRole('homeowner');
                          setQuantityMode('discuss');
                          setValidationError('');
                        }}
                        className={`cursor-pointer rounded-2xl border-2 p-3.5 transition-all text-left relative ${
                          userRole === 'homeowner'
                            ? 'border-amber-500 bg-amber-500/10 shadow-sm'
                            : 'border-stone-200 dark:border-white/10 bg-white dark:bg-[#1a1a1a] hover:border-amber-300'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                              <Home className="w-5 h-5" />
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-stone-900 dark:text-white">
                                Home Owner
                              </h4>
                              <span className="inline-block mt-0.5 text-[10px] font-bold text-amber-700 dark:text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full">
                                Discuss later with expert
                              </span>
                            </div>
                          </div>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                            userRole === 'homeowner'
                              ? 'border-amber-500 bg-amber-500 text-white'
                              : 'border-stone-300 dark:border-stone-600'
                          }`}>
                            {userRole === 'homeowner' && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                        </div>

                        <p className="text-xs text-stone-600 dark:text-stone-300 mt-2.5 leading-relaxed">
                          Renovating or decorating your home wall? No firm name required. Our design consultant will guide you on quantities &amp; room layouts.
                        </p>
                      </div>

                      {/* Card 2: B2B / Trade Buyer */}
                      <div
                        onClick={() => {
                          if (userRole === 'homeowner') setUserRole('contractor');
                          setQuantityMode('direct');
                          setValidationError('');
                        }}
                        className={`cursor-pointer rounded-2xl border-2 p-3.5 transition-all text-left relative ${
                          userRole !== 'homeowner'
                            ? 'border-amber-500 bg-amber-500/10 shadow-sm'
                            : 'border-stone-200 dark:border-white/10 bg-white dark:bg-[#1a1a1a] hover:border-amber-300'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                              <Building2 className="w-5 h-5" />
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-stone-900 dark:text-white">
                                B2B / Trade Professional
                              </h4>
                              <span className="inline-block mt-0.5 text-[10px] font-bold text-amber-700 dark:text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full">
                                I know my quantity • Mill Rates
                              </span>
                            </div>
                          </div>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                            userRole !== 'homeowner'
                              ? 'border-amber-500 bg-amber-500 text-white'
                              : 'border-stone-300 dark:border-stone-600'
                          }`}>
                            {userRole !== 'homeowner' && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                        </div>

                        <p className="text-xs text-stone-600 dark:text-stone-300 mt-2.5 leading-relaxed">
                          Contractor, Architect, or Dealer seeking tiered bulk wholesale mill rates and priority dispatch.
                        </p>

                        {/* Trade Options if B2B is active */}
                        {userRole !== 'homeowner' && (
                          <div className="mt-3.5 pt-3 border-t border-amber-500/20 space-y-3 animate-in fade-in">
                            <div>
                              <label className="text-[11px] font-bold text-stone-700 dark:text-stone-300 block mb-1.5">
                                Select Trade Profile:
                              </label>
                              <div className="flex flex-wrap gap-1.5">
                                {[
                                  { id: 'contractor', label: 'Contractor' },
                                  { id: 'architect', label: 'Architect' },
                                  { id: 'dealer', label: 'B2B Dealer' },
                                ].map((r) => (
                                  <button
                                    key={r.id}
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setUserRole(r.id as RoleId);
                                    }}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                      userRole === r.id
                                        ? 'bg-amber-500 text-white shadow-xs'
                                        : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-white/10'
                                    }`}
                                  >
                                    {r.label}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Quantity Mode Toggle */}
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <label className="text-[11px] font-bold text-stone-700 dark:text-stone-300">
                                  Quantity:
                                </label>
                                <div className="inline-flex rounded-lg bg-stone-200/80 dark:bg-white/10 p-0.5 text-[11px]">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setQuantityMode('direct');
                                    }}
                                    className={`px-2 py-0.5 rounded-md font-bold transition-all ${
                                      quantityMode === 'direct'
                                        ? 'bg-amber-500 text-white'
                                        : 'text-stone-600 dark:text-stone-400'
                                    }`}
                                  >
                                    Known Qty
                                  </button>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setQuantityMode('discuss');
                                    }}
                                    className={`px-2 py-0.5 rounded-md font-bold transition-all ${
                                      quantityMode === 'discuss'
                                        ? 'bg-amber-500 text-white'
                                        : 'text-stone-600 dark:text-stone-400'
                                    }`}
                                  >
                                    Discuss Later
                                  </button>
                                </div>
                              </div>

                              {quantityMode === 'direct' && (
                                <div className="flex items-center gap-3 bg-white dark:bg-stone-900 rounded-xl p-2 border border-stone-200 dark:border-white/10">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setQuantity((q) => Math.max(10, q - 10));
                                    }}
                                    className="p-2 text-stone-600 dark:text-stone-300 bg-stone-100 dark:bg-white/5 rounded-lg active:scale-95"
                                  >
                                    <Minus className="w-4 h-4" />
                                  </button>
                                  <div className="flex-1 text-center">
                                    <span className="text-base font-extrabold text-stone-900 dark:text-white">
                                      {quantity}
                                    </span>
                                    <span className="text-xs text-stone-500 dark:text-stone-400 ml-1">Panels</span>
                                    <p className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold">
                                      Approx {approxSqFt} sq ft
                                    </p>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setQuantity((q) => q + 10);
                                    }}
                                    className="p-2 text-stone-600 dark:text-stone-300 bg-stone-100 dark:bg-white/5 rounded-lg active:scale-95"
                                  >
                                    <Plus className="w-4 h-4" />
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Mobile Step 1 Footer */}
                    <div className="flex-shrink-0 p-4 border-t border-stone-200 dark:border-white/10 bg-white dark:bg-[#111111]">
                      <button
                        type="button"
                        onClick={() => {
                          setValidationError('');
                          setMobileStep(2);
                        }}
                        className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-amber-500/25 active:scale-[0.99]"
                      >
                        Next: Choose Panels <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </>
                )}

                {/* STEP 2: CHOOSE PANELS */}
                {mobileStep === 2 && (
                  <>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-bold text-stone-900 dark:text-white">
                            Choose Panels
                          </h3>
                          <p className="text-xs text-stone-500 dark:text-stone-400">
                            Tap to add/remove panels for your quote.
                          </p>
                        </div>
                        <span className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full">
                          {selectedCodes.length} selected
                        </span>
                      </div>

                      {/* 2-Column Touch Grid */}
                      <div className="grid grid-cols-2 gap-2.5 pt-1">
                        {allPanels.map((panel) => {
                          const isSelected = selectedCodes.includes(panel.code);
                          return (
                            <button
                              key={panel.code}
                              type="button"
                              onClick={() => togglePanel(panel.code)}
                              className={`relative rounded-xl border p-2 text-left transition-all flex flex-col justify-between ${
                                isSelected
                                  ? 'border-amber-500 bg-amber-50/80 dark:bg-amber-500/10 shadow-sm ring-1 ring-amber-500'
                                  : 'border-stone-200 dark:border-white/10 bg-white dark:bg-[#1a1a1a]'
                              }`}
                            >
                              <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden border border-stone-100 dark:border-white/5 mb-2 bg-stone-100 dark:bg-stone-900">
                                <Image 
                                  src={panel.imageUrl} 
                                  alt={panel.code} 
                                  fill 
                                  className="object-cover" 
                                  sizes="160px"
                                />
                                {isSelected && (
                                  <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-amber-500 text-white rounded-full flex items-center justify-center shadow-md">
                                    <Check className="w-3 h-3 stroke-[3]" />
                                  </div>
                                )}
                              </div>
                              <div className="px-0.5">
                                <p className={`text-xs font-extrabold ${isSelected ? 'text-amber-700 dark:text-amber-400' : 'text-stone-900 dark:text-stone-100'}`}>
                                  {panel.code}
                                </p>
                                <p className="text-[10px] text-stone-500 dark:text-stone-400 truncate">
                                  {panel.name}
                                </p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Mobile Step 2 Footer */}
                    <div className="flex-shrink-0 p-4 border-t border-stone-200 dark:border-white/10 bg-white dark:bg-[#111111] flex gap-2.5">
                      <button
                        type="button"
                        onClick={() => setMobileStep(1)}
                        className="px-4 py-3.5 rounded-xl border border-stone-200 dark:border-white/10 text-xs font-bold text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-white/5 flex items-center gap-1.5"
                      >
                        <ArrowLeft className="w-4 h-4" /> Back
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (selectedCodes.length === 0) {
                            setValidationError('Please select at least 1 panel.');
                            return;
                          }
                          setValidationError('');
                          setMobileStep(3);
                        }}
                        className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-amber-500/25 active:scale-[0.99]"
                      >
                        Next: Your Details <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </>
                )}

                {/* STEP 3: CONTACT & SUBMIT */}
                {mobileStep === 3 && (
                  <>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3.5 custom-scrollbar">
                      <div className="text-left">
                        <h3 className="text-sm font-bold text-stone-900 dark:text-white">
                          Delivery &amp; Contact
                        </h3>
                        <p className="text-xs text-stone-500 dark:text-stone-400">
                          {userRole === 'homeowner'
                            ? 'We will share catalog, sample availability & room quote.'
                            : 'Direct mill pricing will be sent instantly to WhatsApp.'}
                        </p>
                      </div>

                      <div className="space-y-3">
                        {/* WhatsApp Number */}
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-amber-500" /> WhatsApp Number *
                          </label>
                          <input
                            type="tel"
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+91 98765 43210"
                            className="w-full rounded-xl border border-stone-200 dark:border-white/10 bg-white dark:bg-[#1a1a1a] px-3.5 py-2.5 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all dark:text-white"
                          />
                        </div>

                        {/* Name (Homeowner vs B2B) */}
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-amber-500" /> 
                            {userRole === 'homeowner' ? 'Your Name *' : 'Name / Firm Name *'}
                          </label>
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder={userRole === 'homeowner' ? 'e.g. Rajesh Kumar' : 'e.g. Rajesh / Studio Interiors'}
                            className="w-full rounded-xl border border-stone-200 dark:border-white/10 bg-white dark:bg-[#1a1a1a] px-3.5 py-2.5 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all dark:text-white"
                          />
                        </div>

                        {/* Location */}
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-amber-500" /> Delivery Location / City *
                          </label>
                          <input
                            type="text"
                            required
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="e.g. Gurgaon / Delhi NCR"
                            className="w-full rounded-xl border border-stone-200 dark:border-white/10 bg-white dark:bg-[#1a1a1a] px-3.5 py-2.5 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all dark:text-white"
                          />
                        </div>

                        {/* Project Note */}
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                            Project Note (Optional)
                          </label>
                          <textarea
                            rows={2}
                            value={message}
                            onChange={(e) => {
                              setMessage(e.target.value);
                              setIsManualMessageEdited(true);
                            }}
                            placeholder="e.g. Living room TV wall, urgent delivery required..."
                            className="w-full rounded-xl border border-stone-200 dark:border-white/10 bg-white dark:bg-[#1a1a1a] px-3.5 py-2 text-xs focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all dark:text-white resize-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Mobile Step 3 Footer / Submit */}
                    <div className="flex-shrink-0 p-4 border-t border-stone-200 dark:border-white/10 bg-white dark:bg-[#111111] space-y-2">
                      <div className="flex gap-2.5">
                        <button
                          type="button"
                          onClick={() => setMobileStep(2)}
                          className="px-4 py-3.5 rounded-xl border border-stone-200 dark:border-white/10 text-xs font-bold text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-white/5 flex items-center gap-1.5"
                        >
                          <ArrowLeft className="w-4 h-4" /> Back
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSubmit()}
                          className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-amber-500/25 active:scale-[0.99]"
                        >
                          Generate Trade Quote <Send className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-center text-[10px] text-stone-500 dark:text-stone-400 font-medium">
                        Automatically opens your WhatsApp
                      </p>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            /* ===================================================== */
            /* SUCCESS STATE (Both Mobile and Desktop)               */
            /* ===================================================== */
            <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-8 text-center animate-in fade-in zoom-in duration-500 bg-white dark:bg-[#111111]">
              <div className="relative mb-5">
                <div className="absolute inset-0 rounded-full bg-amber-500/20 animate-ping" />
                <div className="relative flex w-16 h-16 sm:w-20 sm:h-20 items-center justify-center rounded-full bg-gradient-to-tr from-amber-500 to-amber-400 text-white shadow-xl shadow-amber-500/30">
                  <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10" />
                </div>
              </div>
              
              <h3 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-white mb-1.5">
                Quote Request Initiated!
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mb-6 max-w-sm">
                WhatsApp has been opened with your requirements. Our sales team will get back to you with the wholesale pricing.
              </p>

              <div className="w-full max-w-sm bg-stone-100 dark:bg-white/5 rounded-xl p-3.5 mb-6 border border-stone-200 dark:border-white/10">
                <p className="text-[10px] uppercase tracking-wider text-stone-500 dark:text-stone-400 font-bold mb-1">
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
                  className="flex-1 rounded-xl bg-amber-500 hover:bg-amber-600 px-4 py-3 text-sm font-bold text-white transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20"
                >
                  Open WhatsApp <Send className="w-3.5 h-3.5" />
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
      
      {/* Scrollbar styling */}
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