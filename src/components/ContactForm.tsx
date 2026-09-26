"use client";

import React, { useState, useEffect } from 'react';
import { ALL_WALL_PANELS, WALL_PANEL_COLLECTIONS } from '@/data/wallPanelsData';
import { PanelProduct } from '@/data/types';
import OptimizedImage from './OptimizedImage';

type Intent = 'discuss' | 'quantity';
type UserType = 'Home Owner' | 'B2B Dealer' | 'Contractor' | 'Architect' | 'Other';

interface LineItem {
  panelCode: string;
  quantity: number;
  unit: 'boxes' | 'panels';
}

export default function ContactForm() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [email, setEmail] = useState('');
  const [userType, setUserType] = useState<UserType>('Home Owner');
  const [companyName, setCompanyName] = useState('');
  const [intent, setIntent] = useState<Intent>('discuss');
  
  // Modal & Cart State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState<1 | 2>(1);
  const [selectedCategory, setSelectedCategory] = useState<string>(WALL_PANEL_COLLECTIONS[0].id);
  const [cart, setCart] = useState<LineItem[]>([]);
  const [cartBump, setCartBump] = useState(false);
  
  const [description, setDescription] = useState('');
  const [isDescriptionEdited, setIsDescriptionEdited] = useState(false);

  // Auto-generate description
  useEffect(() => {
    if (isDescriptionEdited) return;

    if (intent === 'discuss') {
      setDescription(`Hi Wholesaleji,\n\nI am a ${userType} looking to discuss your wall panel collections. Please get in touch with me.\n\nThanks.`);
    } else {
      if (cart.length === 0) {
        setDescription(`Hi Wholesaleji,\n\nI am a ${userType} looking to get a quote for some panels.\n\nThanks.`);
      } else {
        let text = `Hi Wholesaleji,\n\nI am a ${userType} requesting a quote for the following panels:\n\n`;
        cart.forEach((item) => {
          text += `- ${item.quantity || 0} ${item.unit} of ${item.panelCode}\n`;
        });
        text += `\nPlease provide availability and wholesale pricing.\n\nThanks.`;
        setDescription(text);
      }
    }
  }, [intent, cart, userType, isDescriptionEdited]);

  const togglePanelSelection = (panelId: string) => {
    setCartBump(true);
    setTimeout(() => setCartBump(false), 300);
    
    setCart(prev => {
      const exists = prev.find(item => item.panelCode === panelId);
      if (exists) {
        return prev.filter(item => item.panelCode !== panelId);
      } else {
        return [...prev, { panelCode: panelId, quantity: 1, unit: 'boxes' }];
      }
    });
  };

  const updateQuantity = (panelId: string, qty: number) => {
    setCart(prev => prev.map(item => item.panelCode === panelId ? { ...item, quantity: Math.max(1, qty) } : item));
  };

  const updateUnit = (panelId: string, unit: 'boxes' | 'panels') => {
    setCart(prev => prev.map(item => item.panelCode === panelId ? { ...item, unit } : item));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const encodedMessage = encodeURIComponent(description);
    const whatsappUrl = `https://wa.me/919217400163?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const openModal = () => {
    setModalStep(1);
    setIsModalOpen(true);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="bg-white/70 dark:bg-stone-900/50 backdrop-blur-xl p-8 md:p-10 rounded-[2.5rem] border border-white/40 dark:border-stone-700/50 shadow-2xl relative overflow-hidden group">
        {/* Decorative Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-amber-500/20 transition-all duration-700" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-emerald-500/20 transition-all duration-700" />

        <div className="relative z-10 space-y-12">
          
          {/* Step 1: Basic Info */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-amber-500 mb-6 flex items-center gap-2">
              <span className="w-4 h-px bg-amber-500"></span>
              Personal Details
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-500 dark:text-stone-400 mb-1">
                  Your Name <span className="text-amber-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-0 py-3 bg-transparent border-b border-stone-200 dark:border-stone-800 text-stone-900 dark:text-white placeholder:text-stone-400 dark:placeholder:text-stone-600 focus:outline-none focus:border-amber-500 dark:focus:border-amber-500 transition-colors text-sm font-medium rounded-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-500 dark:text-stone-400 mb-1">
                  Phone Number <span className="text-amber-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+91"
                  className="w-full px-0 py-3 bg-transparent border-b border-stone-200 dark:border-stone-800 text-stone-900 dark:text-white placeholder:text-stone-400 dark:placeholder:text-stone-600 focus:outline-none focus:border-amber-500 dark:focus:border-amber-500 transition-colors text-sm font-medium rounded-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-500 dark:text-stone-400 mb-1">
                  City / Address <span className="text-amber-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  placeholder="Gurugram, HR"
                  className="w-full px-0 py-3 bg-transparent border-b border-stone-200 dark:border-stone-800 text-stone-900 dark:text-white placeholder:text-stone-400 dark:placeholder:text-stone-600 focus:outline-none focus:border-amber-500 dark:focus:border-amber-500 transition-colors text-sm font-medium rounded-none"
                />
              </div>
            </div>
          </div>

          {/* Step 2: Profession */}
          <div>
             <h4 className="text-xs font-black uppercase tracking-widest text-amber-500 mb-6 flex items-center gap-2">
              <span className="w-4 h-px bg-amber-500"></span>
              Who are you?
            </h4>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              {(['Home Owner', 'B2B Dealer', 'Contractor', 'Architect', 'Other'] as UserType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setUserType(type)}
                  className={`relative py-1 text-sm font-bold transition-colors ${
                    userType === type 
                      ? 'text-stone-900 dark:text-white'
                      : 'text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200'
                  }`}
                >
                  {type}
                  {userType === type && <div className="absolute bottom-0 left-0 w-full h-px bg-stone-900 dark:bg-white" />}
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Company Name */}
          {userType !== 'Home Owner' && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
               <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-500 dark:text-stone-400 mb-1">
                  Company/Firm Name
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  placeholder={`Enter your ${userType.toLowerCase()} firm name`}
                  className="w-full px-0 py-3 bg-transparent border-b border-stone-200 dark:border-stone-800 text-stone-900 dark:text-white placeholder:text-stone-400 dark:placeholder:text-stone-600 focus:outline-none focus:border-amber-500 dark:focus:border-amber-500 transition-colors text-sm font-medium rounded-none"
                />
            </div>
          )}

          {/* Step 3: Intent & Product Selector */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-amber-500 mb-6 flex items-center gap-2">
              <span className="w-4 h-px bg-amber-500"></span>
              How Can We Help?
            </h4>
            
            <div className="flex flex-col gap-6">
              {/* Minimalist Intent Toggle */}
              <div className="flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => setIntent('discuss')}
                  className={`relative px-4 py-2 text-sm font-bold transition-colors ${
                    intent === 'discuss' ? 'text-stone-900 dark:text-white' : 'text-stone-400 hover:text-stone-600 dark:hover:text-stone-300'
                  }`}
                >
                  Discuss Later / Need Info
                  {intent === 'discuss' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-500 rounded-full" />}
                </button>
                <span className="text-stone-300 dark:text-stone-700 hidden sm:block">|</span>
                <button
                  type="button"
                  onClick={() => setIntent('quantity')}
                  className={`relative px-4 py-2 text-sm font-bold transition-colors ${
                    intent === 'quantity' ? 'text-stone-900 dark:text-white' : 'text-stone-400 hover:text-stone-600 dark:hover:text-stone-300'
                  }`}
                >
                  I Know My Quantity
                  {intent === 'quantity' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-500 rounded-full" />}
                </button>
              </div>

              {/* Minimalist Product Selector Trigger (Only if intent === 'quantity') */}
              {intent === 'quantity' && (
                <div className="animate-in fade-in slide-in-from-top-2 flex items-center justify-between p-4 bg-white/40 dark:bg-stone-950/40 rounded-2xl border border-stone-200 dark:border-stone-800">
                  <div className="flex items-center gap-3">
                    {cart.length > 0 ? (
                      <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-600 flex items-center justify-center">
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-stone-200 dark:bg-stone-800 flex items-center justify-center text-stone-500">
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                      </div>
                    )}
                    <div>
                      <span className="block text-sm font-bold text-stone-900 dark:text-white">
                        {cart.length > 0 ? `${cart.length} variants selected` : 'Select your panels'}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={openModal}
                    className="px-4 py-2 text-xs font-black uppercase tracking-widest bg-stone-900 dark:bg-white text-white dark:text-stone-900 rounded-lg hover:bg-amber-500 dark:hover:bg-amber-500 transition-colors"
                  >
                    {cart.length > 0 ? 'Edit' : 'Browse'}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Step 4: Description (Auto-filling but editable) */}
          <div>
             <h4 className="text-xs font-black uppercase tracking-widest text-amber-500 mb-6 flex items-center gap-2">
              <span className="w-4 h-px bg-amber-500"></span>
              Message Summary
            </h4>
            <textarea
              rows={5}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setIsDescriptionEdited(true);
              }}
              className="w-full px-0 py-3 bg-transparent border-b border-stone-200 dark:border-stone-800 text-stone-900 dark:text-white text-sm focus:outline-none focus:border-amber-500 dark:focus:border-amber-500 transition-colors resize-none rounded-none leading-relaxed font-medium"
            ></textarea>
            {isDescriptionEdited && (
              <div className="flex justify-end mt-2">
                <button 
                  type="button" 
                  onClick={() => setIsDescriptionEdited(false)}
                  className="text-[10px] uppercase tracking-widest font-bold text-amber-500 hover:text-amber-600 transition-colors"
                >
                  Reset to Auto-fill
                </button>
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-4 rounded-xl bg-stone-900 dark:bg-white text-white dark:text-stone-900 font-black text-sm uppercase tracking-widest hover:bg-emerald-500 dark:hover:bg-emerald-500 hover:text-white transition-all flex items-center justify-center gap-3 relative overflow-hidden group/btn"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
            <span className="relative z-10">Send via WhatsApp</span>
          </button>

        </div>
      </form>

      {/* MULTI-STEP POPUP MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white dark:bg-stone-950 w-full max-w-5xl h-[85vh] sm:h-[80vh] rounded-[2rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300 border border-stone-200 dark:border-stone-800 relative">
            
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-stone-200 dark:border-stone-800 flex justify-between items-center bg-stone-50 dark:bg-stone-900/50">
              <div>
                <h3 className="text-lg font-black text-stone-900 dark:text-white">
                  {modalStep === 1 ? 'Select Your Panels' : 'Set Quantities'}
                </h3>
                <p className="text-[11px] sm:text-xs text-stone-500 font-semibold mt-0.5">
                  {modalStep === 1 ? 'Choose from our premium collections.' : 'Specify how many units you need.'}
                </p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="w-10 h-10 rounded-full bg-stone-200 dark:bg-stone-800 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-hidden flex flex-col md:flex-row relative">
              
              {modalStep === 1 ? (
                <>
                  {/* Left Sidebar - Categories */}
                  <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/30 overflow-x-auto md:overflow-y-auto flex md:flex-col shrink-0 p-4 gap-2">
                    {WALL_PANEL_COLLECTIONS.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`text-left px-4 py-4 rounded-xl font-bold text-sm transition-all whitespace-nowrap md:whitespace-normal flex-shrink-0 ${
                          selectedCategory === cat.id
                            ? 'bg-amber-500 text-stone-950 shadow-md'
                            : 'text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-800'
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>

                  {/* Right Content - Panels Grid */}
                  <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-white dark:bg-stone-950">
                    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
                      {ALL_WALL_PANELS.filter(p => p.collection === selectedCategory).map(panel => {
                        const isSelected = cart.some(item => item.panelCode === panel.id);
                        return (
                          <button
                            key={panel.id}
                            onClick={() => togglePanelSelection(panel.id)}
                            className={`group relative text-left p-2.5 rounded-xl border-2 transition-all duration-300 overflow-hidden flex items-center gap-3 ${
                              isSelected 
                                ? 'border-amber-500 bg-amber-500/10 shadow-[0_4px_20px_rgba(245,158,11,0.15)] scale-[0.98]'
                                : 'border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 hover:border-amber-500/50 hover:shadow-md'
                            }`}
                          >
                            <OptimizedImage src={panel.imageUrl} alt={panel.id} transformations="w_100,h_100,c_fill,q_auto,f_auto" className="w-10 h-10 rounded-lg object-cover shrink-0 bg-stone-200 dark:bg-stone-800 border border-stone-200/50 dark:border-stone-700/50" containerClassName="w-10 h-10 shrink-0 rounded-lg" />
                            <div className="flex-1">
                               <div className="font-black text-base text-stone-900 dark:text-white group-hover:text-amber-500 transition-colors uppercase tracking-tight">
                                 {panel.id}
                               </div>
                            </div>
                            
                            {/* Selected Checkmark Animation */}
                            {isSelected && (
                              <div className="absolute top-1/2 -translate-y-1/2 right-3 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center text-stone-950 animate-in zoom-in duration-300 shadow-md">
                                <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="4"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              ) : (
                /* Step 2: Set Quantities */
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-white dark:bg-stone-950 w-full">
                  {cart.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-stone-400">
                      <svg width="64" height="64" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1" className="mb-4 opacity-50"><path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                      <p className="font-bold text-lg">No panels selected.</p>
                      <button onClick={() => setModalStep(1)} className="mt-4 text-amber-500 font-bold hover:underline">Go back and select panels</button>
                    </div>
                  ) : (
                    <div className="max-w-4xl mx-auto flex flex-col divide-y divide-stone-100 dark:divide-stone-800/50">
                      {cart.map((item) => {
                        const panelInfo = ALL_WALL_PANELS.find(p => p.id === item.panelCode);
                        return (
                          <div key={item.panelCode} className="flex flex-col md:flex-row md:items-center justify-between py-4 gap-4">
                            <div className="flex items-center gap-4 min-w-0">
                              {panelInfo?.imageUrl && (
                                <OptimizedImage src={panelInfo.imageUrl} alt={item.panelCode} transformations="w_100,h_100,c_fill,q_auto,f_auto" className="w-12 h-12 rounded-lg object-cover shrink-0 bg-stone-100 dark:bg-stone-900 border border-stone-200/50 dark:border-stone-800/50" containerClassName="w-12 h-12 shrink-0 rounded-lg" />
                              )}
                              <div className="min-w-0">
                                <h4 className="font-black text-lg uppercase tracking-tight text-stone-900 dark:text-white truncate">{item.panelCode}</h4>
                                <p className="text-[11px] text-stone-500 font-semibold truncate">{panelInfo?.name}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto">
                              {/* Unit Selector (Minimalist) */}
                              <div className="flex items-center gap-1">
                                <button 
                                  onClick={() => updateUnit(item.panelCode, 'boxes')}
                                  className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-md transition-colors ${item.unit === 'boxes' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-500' : 'text-stone-400 hover:text-stone-600 dark:hover:text-stone-300'}`}
                                >
                                  Boxes
                                </button>
                                <button 
                                  onClick={() => updateUnit(item.panelCode, 'panels')}
                                  className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-md transition-colors ${item.unit === 'panels' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-500' : 'text-stone-400 hover:text-stone-600 dark:hover:text-stone-300'}`}
                                >
                                  Panels
                                </button>
                              </div>

                              {/* Qty Controls (Clean) */}
                              <div className="flex items-center gap-3">
                                <button 
                                  onClick={() => updateQuantity(item.panelCode, item.quantity - 1)}
                                  className="w-8 h-8 flex items-center justify-center text-stone-400 hover:text-amber-500 hover:bg-amber-500/10 rounded-full font-bold transition-colors"
                                ><svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4"></path></svg></button>
                                <div className="w-10 text-center flex flex-col justify-center">
                                  <span className="block font-black text-lg text-stone-900 dark:text-white leading-none">{item.quantity}</span>
                                </div>
                                <button 
                                  onClick={() => updateQuantity(item.panelCode, item.quantity + 1)}
                                  className="w-8 h-8 flex items-center justify-center text-stone-400 hover:text-amber-500 hover:bg-amber-500/10 rounded-full font-bold transition-colors"
                                ><svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"></path></svg></button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 sm:p-5 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/80 flex items-center justify-between z-10 shrink-0">
               {modalStep === 1 ? (
                 <>
                   <div className={`flex items-center gap-3 text-sm font-bold transition-transform duration-300 ${cartBump ? 'scale-110 text-amber-500' : 'text-stone-500'}`}>
                     <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5" className={`text-amber-500 ${cartBump ? 'animate-bounce' : ''}`}>
                       <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                     </svg>
                     <span><span className="text-amber-500 text-lg">{cart.length}</span> panels in cart</span>
                   </div>
                   <button 
                     onClick={() => setModalStep(2)}
                     disabled={cart.length === 0}
                     className="px-8 py-4 bg-stone-900 dark:bg-white text-white dark:text-stone-950 font-black text-sm uppercase tracking-widest rounded-xl hover:bg-amber-500 dark:hover:bg-amber-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                   >
                     Next Step <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                   </button>
                 </>
               ) : (
                 <>
                   <button 
                     onClick={() => setModalStep(1)}
                     className="px-6 py-4 text-stone-500 hover:text-stone-900 dark:hover:text-white font-bold text-sm uppercase tracking-widest transition-colors flex items-center gap-2"
                   >
                     <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg> Back
                   </button>
                   <button 
                     onClick={() => setIsModalOpen(false)}
                     className="px-8 py-4 bg-amber-500 text-stone-950 font-black text-sm uppercase tracking-widest rounded-xl hover:brightness-110 shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2"
                   >
                     <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg> Done
                   </button>
                 </>
               )}
            </div>
            
          </div>
        </div>
      )}
    </>
  );
}
