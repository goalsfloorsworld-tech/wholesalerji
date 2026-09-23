import React from 'react';
import Navbar from '@/components/Navbar';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Support | Wholesaleji',
  description: 'Get in touch with our commercial sales desk for B2B pricing, bulk quotes, and dealership queries.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col selection:bg-amber-500 selection:text-stone-950 transition-colors">
      <Navbar currentPath="/contact" />
      <main className="flex-1 flex flex-col items-center justify-center py-20 px-4">
        <div className="max-w-6xl w-full">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-black text-stone-900 dark:text-white tracking-tight mb-6">
              Get in <span className="text-amber-500">Touch</span>
            </h1>
            <p className="text-lg text-stone-600 dark:text-stone-400 max-w-2xl mx-auto">
              Whether you are looking for dealership opportunities, project bulk quotes, or want to schedule a visit to our central warehouse, we are here to help.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Contact Info Cards */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-stone-900 p-8 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm flex items-start gap-6 group hover:border-amber-500/30 transition-colors">
                <div className="w-14 h-14 bg-stone-100 dark:bg-stone-800 rounded-2xl flex items-center justify-center group-hover:bg-amber-500/10 transition-colors shrink-0">
                  <span className="text-2xl">📞</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1">Sales & Support</h3>
                  <p className="text-sm text-stone-500 dark:text-stone-400 mb-3">
                    Available Mon-Sat, 10am to 7pm
                  </p>
                  <a href="tel:+919217400163" className="text-lg font-black text-amber-500 hover:text-amber-600 transition-colors">
                    +91 92174 00163
                  </a>
                </div>
              </div>

              <div className="bg-white dark:bg-stone-900 p-8 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm flex items-start gap-6 group hover:border-amber-500/30 transition-colors">
                <div className="w-14 h-14 bg-stone-100 dark:bg-stone-800 rounded-2xl flex items-center justify-center group-hover:bg-amber-500/10 transition-colors shrink-0">
                  <span className="text-2xl">📧</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1">Email Us</h3>
                  <p className="text-sm text-stone-500 dark:text-stone-400 mb-3">
                    For dealership and project quotes
                  </p>
                  <a href="mailto:sales@wholesaleji.com" className="text-lg font-black text-amber-500 hover:text-amber-600 transition-colors">
                    sales@wholesaleji.com
                  </a>
                </div>
              </div>

              <div className="bg-white dark:bg-stone-900 p-8 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm flex items-start gap-6 group hover:border-amber-500/30 transition-colors">
                <div className="w-14 h-14 bg-stone-100 dark:bg-stone-800 rounded-2xl flex items-center justify-center group-hover:bg-amber-500/10 transition-colors shrink-0">
                  <span className="text-2xl">📍</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1">Central Warehouse</h3>
                  <p className="text-sm text-stone-500 dark:text-stone-400 mb-3 leading-relaxed">
                    Wholesaleji Central Warehouse, Sector 34, Gurugram, Haryana 122004
                  </p>
                  <a href="#" className="text-sm font-bold text-amber-500 hover:text-amber-600 transition-colors uppercase tracking-wider">
                    Get Directions &rarr;
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Form */}
            <div className="bg-white dark:bg-stone-900 p-8 md:p-10 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xl">
              <h3 className="text-2xl font-black mb-6">Send us a message</h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5">
                    Your Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-800 text-stone-900 dark:text-white text-sm focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+91"
                    className="w-full px-4 py-3 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-800 text-stone-900 dark:text-white text-sm focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    placeholder="How can we help you?"
                    className="w-full px-4 py-3 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-800 text-stone-900 dark:text-white text-sm focus:outline-none focus:border-amber-500 transition-colors resize-none"
                  ></textarea>
                </div>
                <button
                  type="button"
                  className="w-full py-4 px-6 mt-2 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-stone-950 font-black text-sm uppercase tracking-widest hover:brightness-110 transition-all shadow-lg shadow-amber-500/20"
                >
                  Send Message
                </button>
              </form>
            </div>
            
          </div>
        </div>
      </main>
    </div>
  );
}
