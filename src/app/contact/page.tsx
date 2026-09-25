import React from 'react';
import Navbar from '@/components/Navbar';
import type { Metadata } from 'next';
import ContactForm from '@/components/ContactForm';

export const metadata: Metadata = {
  title: 'Contact Support | Wholesaleji',
  description: 'Get in touch with our commercial sales desk for B2B pricing, bulk quotes, and dealership queries.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-stone-50 dark:bg-[#0c0c0c] text-stone-900 dark:text-stone-100 flex flex-col selection:bg-amber-500 selection:text-stone-950 transition-colors relative overflow-hidden">
      {/* Abstract Background Elements */}
      <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-[50vw] h-[50vw] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none -translate-x-1/3 translate-y-1/3" />
      
      <Navbar currentPath="/contact" />
      <main className="flex-1 flex flex-col items-center justify-start pt-32 pb-24 px-4 sm:px-6 relative z-10">
        <div className="max-w-[1400px] w-full mx-auto">
          
          <div className="text-center mb-16 lg:mb-24">
            <h1 className="text-5xl md:text-7xl font-black text-stone-900 dark:text-white tracking-tighter mb-6 relative inline-block">
              Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-300">Touch</span>
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-24 h-1.5 bg-amber-500 rounded-full" />
            </h1>
            <p className="text-lg md:text-xl text-stone-600 dark:text-stone-400 max-w-3xl mx-auto mt-10 font-medium leading-relaxed">
              Whether you are looking for dealership opportunities, project bulk quotes, or want to schedule a visit to our central warehouse, our experts are ready to assist you.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
            
            {/* Left Side: Contact Info & Map (5 cols) */}
            <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-32">
              
              {/* Image Showcase */}
              <div className="rounded-[2.5rem] overflow-hidden border border-stone-200 dark:border-stone-800 shadow-xl relative group">
                <div className="absolute inset-0 bg-stone-900/20 group-hover:bg-stone-900/10 transition-colors z-10 pointer-events-none" />
                <img 
                  src="/assets/we-care-support.jpg" 
                  alt="Wholesaleji Customer Support" 
                  className="w-full h-auto aspect-square md:aspect-[4/3] lg:aspect-square object-cover object-top group-hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute bottom-6 left-6 right-6 z-20 pointer-events-none">
                  <div className="backdrop-blur-md bg-white/30 dark:bg-black/40 border border-white/40 dark:border-white/10 p-5 rounded-2xl flex items-center justify-between shadow-lg">
                    <div>
                      <h4 className="text-white font-black text-xl drop-shadow-md">We Care. Let's Talk.</h4>
                      <p className="text-white/90 text-sm font-semibold mt-1 drop-shadow-md">Get priority wholesale quotes instantly.</p>
                    </div>
                    <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                      <svg width="20" height="20" fill="none" stroke="white" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Info Cards */}
              <div className="flex flex-col border-y border-stone-200 dark:border-stone-800">
                <a href="tel:+919217400163" className="p-6 flex items-center gap-6 group hover:bg-stone-100 dark:hover:bg-stone-900/50 transition-all duration-300 border-b border-stone-200 dark:border-stone-800">
                  <div className="w-12 h-12 bg-stone-100 dark:bg-stone-900 rounded-full flex items-center justify-center shrink-0 group-hover:bg-amber-500/10 group-hover:text-amber-500 transition-colors">
                    <svg className="w-5 h-5 text-stone-500 group-hover:text-amber-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                  </div>
                  <div>
                    <h3 className="text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest mb-1">Sales & Support</h3>
                    <p className="text-xl font-black text-stone-900 dark:text-white group-hover:text-amber-500 transition-colors">+91 92174 00163</p>
                  </div>
                </a>

                <a href="mailto:sales@wholesaleji.com" className="p-6 flex items-center gap-6 group hover:bg-stone-100 dark:hover:bg-stone-900/50 transition-all duration-300">
                  <div className="w-12 h-12 bg-stone-100 dark:bg-stone-900 rounded-full flex items-center justify-center shrink-0 group-hover:bg-amber-500/10 group-hover:text-amber-500 transition-colors">
                    <svg className="w-5 h-5 text-stone-500 group-hover:text-amber-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                  </div>
                  <div>
                    <h3 className="text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest mb-1">Email Us</h3>
                    <p className="text-xl font-black text-stone-900 dark:text-white group-hover:text-amber-500 transition-colors">sales@wholesaleji.com</p>
                  </div>
                </a>
              </div>

              {/* GMB Map Placeholder */}
              <div className="bg-stone-100 dark:bg-stone-900 rounded-none p-8 flex flex-col items-start justify-center border-l-4 border-amber-500 group relative overflow-hidden">
                <div className="absolute inset-0 opacity-40 mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(168,162,158,0.2) 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-xl">📍</span>
                    <h4 className="text-lg font-black text-stone-900 dark:text-white">Central Warehouse</h4>
                  </div>
                  <p className="text-sm text-stone-600 dark:text-stone-400 max-w-[250px] leading-relaxed mb-6">
                    Sector 34, Gurugram, Haryana 122004
                  </p>
                  <div className="inline-block px-3 py-1 bg-stone-200 dark:bg-stone-800 text-stone-500 dark:text-stone-400 text-[10px] font-bold uppercase tracking-widest">
                    GMB Map Coming Soon
                  </div>
                </div>
              </div>

            </div>

            {/* Right Side: Complex Form (7 cols) */}
            <div className="lg:col-span-7">
              <ContactForm />
            </div>
            
          </div>
        </div>
      </main>
    </div>
  );
}
