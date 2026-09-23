'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { PanelProduct } from '@/data/types';
import { 
  X, Phone, User, MapPin, Mail, Send, CheckCircle2, 
  Minus, Plus, Info, ArrowLeft, ArrowRight, Check
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

const PANEL_CATEGORIES = [
  { id: 'primo', label: 'Primo Panels' },
  { id: 'primo-fluted', label: 'Primo Fluted' },
  { id: 'elite', label: 'Elite PVC Panels' },
  { id: 'elite-fluted', label: 'Elite Fluted' },
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

  // Mobile multi-step wizard state (1: Qty & Categories, 2: Select Panels, 3: Details)
  const [mobileStep, setMobileStep] = useState<1 | 2 | 3>(1);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    activePanel.collection || 'primo',
  ]);

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [rfqRefId, setRfqRefId] = useState('');
  const [whatsappRedirectUrl, setWhatsappRedirectUrl] = useState('');
  const [validationError, setValidationError] = useState('');

  // Reset when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedCodes([activePanel.code]);
      setSelectedCategories([activePanel.collection || 'primo']);
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

  // Lock body scroll on modal open
  useEffect(() => {
    if (!isOpen) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKey);
    };
  }, [isOpen, onClose]);

  const selectedPanels = useMemo(
    () => allPanels.filter((panel) => selectedCodes.includes(panel.code)),
    [allPanels, selectedCodes]
  );

  // Panels filtered by selected categories for mobile step 2
  const visiblePanels = useMemo(() => {
    if (selectedCategories.length === 0) return allPanels;
    const filtered = allPanels.filter((p) =>
      selectedCategories.includes(p.collection)
    );
    return filtered.length > 0 ? filtered : allPanels;
  }, [allPanels, selectedCategories]);

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

  const toggleCategory = (catId: string) => {
    setSelectedCategories((prev) => {
      if (prev.includes(catId)) {
        return prev.length === 1 ? prev : prev.filter((c) => c !== catId);
      }
      return [...prev, catId];
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

  // 1. Panel Selection UI
  const renderPanelsGrid = (panelsList: PanelProduct[]) => (
    <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2.5 sm:gap-3">
      {panelsList.map((panel) => {
        const isSelected = selectedCodes.includes(panel.code);
        return (
          <button
            key={panel.code}
            type="button"
            onClick={() => togglePanel(panel.code)}
            className={`group relative flex items-center gap-2.5 sm:gap-3 rounded-xl border p-2 pr-3 sm:pr-4 transition-all text-left ${
              isSelected
                ? 'border-amber-500 bg-amber-50 dark:bg-amber-500/10'
                : 'border-stone-200 dark:border-white/10 bg-white dark:bg-[#1a1a1a] hover:border-amber-300 dark:hover:border-amber-700'
            }`}
          >
            <div className="relative w-8 h-8 overflow-hidden rounded-md border border-stone-100 dark:border-white/5 shrink-0">
              <Image src={panel.imageUrl} alt={panel.code} fill className="object-cover" sizes="32px" />
            </div>
            <div className="min-w-0">
              <p className={`text-xs font-bold truncate ${isSelected ? 'text-amber-700 dark:text-amber-400' : 'text-stone-700 dark:text-stone-300'}`}>
                {panel.code}
              </p>
            </div>
            {isSelected && (
              <div className="absolute -top-1 -right-1 sm:-top-1.5 sm:-right-1.5 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-amber-500 rounded-full border-2 border-white dark:border-[#161616]" />
            )}
          </button>
        );
      })}
    </div>
  );

  // 2. Quantity Block UI
  const renderQuantityBlock = () => (
    <div>
      <div className="inline-flex gap-2 mb-3.5 p-1 rounded-xl bg-stone-200 dark:bg-white/5">
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
    </div>
  );

  // 3. Details Form UI
  const renderDetailsBlock = () => (
    <div className="space-y-4">
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
      <div className="mt-4">
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
      <div className="mt-4 space-y-1.5">
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
          placeholder="e.g. Living room wall, urgent delivery required..."
          className="w-full rounded-xl border border-stone-200 dark:border-white/10 bg-white dark:bg-[#1a1a1a] px-3.5 sm:px-4 py-2 text-xs sm:text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all dark:text-white resize-none"
        />
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 lg:p-8">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-stone-900/80 dark:bg-black/90 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Container: EXPLICIT HEIGHT h-[90vh] md:h-[85vh] max-h-[850px] so child overflow-y-auto strictly scrolls */}
      <div 
        className="relative z-10 w-full max-w-5xl h-[90vh] md:h-[85vh] max-h-[850px] rounded-2xl md:rounded-[2rem] bg-white dark:bg-[#111111] shadow-2xl flex flex-col md:flex-row overflow-hidden animate-in fade-in zoom-in-95 duration-300 border border-stone-200 dark:border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Side: Friendly Greeting Image (Hidden on Mobile) */}
        <div className="hidden md:flex md:w-2/5 h-full relative flex-col justify-end overflow-hidden shrink-0">
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

        {/* Right Side: Form Body Column (h-full flex flex-col min-h-0) */}
        <div className="flex-1 flex flex-col h-full min-h-0 bg-stone-50 dark:bg-[#161616]">
          {!isSubmitted ? (
            <>
              {/* Header (Fixed shrink-0) */}
              <div className="shrink-0 flex items-center justify-between px-5 sm:px-6 py-3.5 border-b border-stone-200 dark:border-white/5 bg-white dark:bg-[#111111]">
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

              {/* Mobile Step Indicators (Only shown on phone screen) */}
              <div className="md:hidden shrink-0 flex items-center justify-between px-5 py-2.5 border-b border-stone-200/80 dark:border-white/5 bg-stone-100/70 dark:bg-[#131313]">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-600 dark:text-amber-400">
                  <span>Step {mobileStep} of 3:</span>
                  <span className="text-stone-700 dark:text-stone-300">
                    {mobileStep === 1 && 'Quantity & Category'}
                    {mobileStep === 2 && `Choose Panels (${selectedCodes.length})`}
                    {mobileStep === 3 && 'Details & WhatsApp'}
                  </span>
                </div>
                <div className="flex gap-1.5">
                  <div className={`h-1.5 w-6 rounded-full transition-all ${mobileStep >= 1 ? 'bg-amber-500' : 'bg-stone-300 dark:bg-white/10'}`} />
                  <div className={`h-1.5 w-6 rounded-full transition-all ${mobileStep >= 2 ? 'bg-amber-500' : 'bg-stone-300 dark:bg-white/10'}`} />
                  <div className={`h-1.5 w-6 rounded-full transition-all ${mobileStep >= 3 ? 'bg-amber-500' : 'bg-stone-300 dark:bg-white/10'}`} />
                </div>
              </div>

              {/* Scrollable Form Body (flex-1 min-h-0 overflow-y-auto strictly scrolls) */}
              <div 
                className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 space-y-6 sm:space-y-8 custom-scrollbar"
                tabIndex={0}
              >
                {validationError && (
                  <div className="flex items-center gap-2.5 rounded-xl bg-red-50 dark:bg-red-950/30 p-3 text-xs sm:text-sm font-medium text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/50">
                    <Info className="w-4 h-4 shrink-0" />
                    <p>{validationError}</p>
                  </div>
                )}

                {/* ========================================================= */}
                {/* 1. DESKTOP VIEW: ALL 3 SECTIONS VISIBLE TOGETHER         */}
                {/* ========================================================= */}
                <div className="hidden md:block space-y-8">
                  {/* Desktop 1. Select Panels */}
                  <section>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-bold uppercase tracking-wider text-stone-900 dark:text-stone-300">
                        1. SELECT PANELS
                      </h4>
                      <span className="text-xs font-semibold text-amber-600 dark:text-amber-500">
                        {selectedCodes.length} selected
                      </span>
                    </div>
                    {renderPanelsGrid(allPanels)}
                  </section>

                  {/* Desktop 2. Quantity Option */}
                  <section>
                    <h4 className="text-sm font-bold uppercase tracking-wider text-stone-900 dark:text-stone-300 mb-4">
                      2. QUANTITY REQUIREMENT
                    </h4>
                    {renderQuantityBlock()}
                  </section>

                  {/* Desktop 3. Contact Details */}
                  <section>
                    <h4 className="text-sm font-bold uppercase tracking-wider text-stone-900 dark:text-stone-300 mb-4">
                      3. YOUR DETAILS
                    </h4>
                    {renderDetailsBlock()}
                  </section>
                </div>

                {/* ========================================================= */}
                {/* 2. MOBILE VIEW: 3-STEP WIZARD (NO AWKWARD SCROLLING)     */}
                {/* ========================================================= */}
                <div className="md:hidden space-y-4">
                  {/* MOBILE STEP 1: QUANTITY & CATEGORY */}
                  {mobileStep === 1 && (
                    <div className="space-y-5 animate-in fade-in duration-200">
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-stone-300 mb-2">
                          1. Quantity Requirement
                        </h4>
                        {renderQuantityBlock()}
                      </div>

                      <div className="pt-2 border-t border-stone-200/80 dark:border-white/10">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-stone-300 mb-1">
                          2. Select Wall Panel Categories
                        </h4>
                        <p className="text-[11px] text-stone-500 dark:text-stone-400 mb-3">
                          Select one or multiple categories to choose panels from:
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                          {PANEL_CATEGORIES.map((cat) => {
                            const isSelected = selectedCategories.includes(cat.id);
                            return (
                              <button
                                key={cat.id}
                                type="button"
                                onClick={() => toggleCategory(cat.id)}
                                className={`flex items-center justify-between p-2.5 rounded-xl border text-left transition-all ${
                                  isSelected
                                    ? 'border-amber-500 bg-amber-50/80 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 font-bold'
                                    : 'border-stone-200 dark:border-white/10 bg-white dark:bg-[#1a1a1a] text-stone-700 dark:text-stone-300 font-medium'
                                }`}
                              >
                                <span className="text-xs">{cat.label}</span>
                                {isSelected && (
                                  <div className="w-4 h-4 bg-amber-500 text-white rounded-full flex items-center justify-center">
                                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                                  </div>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* MOBILE STEP 2: CHOOSE PANELS */}
                  {mobileStep === 2 && (
                    <div className="space-y-3 animate-in fade-in duration-200">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-stone-300">
                          Select Panels
                        </h4>
                        <span className="text-xs font-bold text-amber-600 dark:text-amber-500">
                          {selectedCodes.length} selected
                        </span>
                      </div>
                      {renderPanelsGrid(visiblePanels)}
                    </div>
                  )}

                  {/* MOBILE STEP 3: DETAILS */}
                  {mobileStep === 3 && (
                    <div className="space-y-3 animate-in fade-in duration-200">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-stone-300">
                        Contact Details
                      </h4>
                      {renderDetailsBlock()}
                    </div>
                  )}
                </div>
              </div>

              {/* Footer Actions (Fixed shrink-0) */}
              <div className="shrink-0 px-4 sm:px-6 py-3.5 border-t border-stone-200 dark:border-white/5 bg-white dark:bg-[#111111]">
                {/* Desktop Submit Button */}
                <div className="hidden md:block">
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

                {/* Mobile Navigation Buttons */}
                <div className="md:hidden">
                  {mobileStep === 1 && (
                    <button
                      type="button"
                      onClick={() => setMobileStep(2)}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-amber-500 py-3 text-sm font-bold text-white shadow-md active:scale-[0.99]"
                    >
                      Next: Choose Panels <ArrowRight className="w-4 h-4" />
                    </button>
                  )}

                  {mobileStep === 2 && (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setMobileStep(1)}
                        className="px-4 py-3 rounded-xl border border-stone-200 dark:border-white/10 text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1.5"
                      >
                        <ArrowLeft className="w-4 h-4" /> Back
                      </button>
                      <button
                        type="button"
                        onClick={() => setMobileStep(3)}
                        className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-amber-500 py-3 text-sm font-bold text-white shadow-md active:scale-[0.99]"
                      >
                        Next: Details <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {mobileStep === 3 && (
                    <div className="space-y-1.5">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setMobileStep(2)}
                          className="px-4 py-3 rounded-xl border border-stone-200 dark:border-white/10 text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1.5"
                        >
                          <ArrowLeft className="w-4 h-4" /> Back
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSubmit()}
                          className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 py-3 text-sm font-bold text-white shadow-md active:scale-[0.99]"
                        >
                          Generate Quote <Send className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-center text-[10px] text-stone-500 dark:text-stone-400 font-medium">
                        Automatically opens your WhatsApp
                      </p>
                    </div>
                  )}
                </div>
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
      
      {/* Scrollbar styling */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(245, 158, 11, 0.4);
          border-radius: 9999px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(245, 158, 11, 0.7);
        }
      `}</style>
    </div>
  );
}