'use client';

import React, { useState } from 'react';
import {
  Phone,
  ArrowRight,
  Calculator,
} from 'lucide-react';

interface TurfWholesaleHubProps {
  onOpenQuote: (source: string, productName?: string) => void;
}

interface TurfMatrixItem {
  code: string;
  title: string;
  pile: string;
  dtex: string;
  density: string;
  sqftRate: number;
  rollSqft: number;
  bestFor: string;
}

const WHOLESALE_MATRIX: TurfMatrixItem[] = [
  {
    code: 'GF-N25',
    title: 'Balcony Turf',
    pile: '25mm',
    dtex: '9,000 Dtex',
    density: '14,650/m²',
    sqftRate: 45,
    rollSqft: 539,
    bestFor: 'Apartment Balconies & Terraces',
  },
  {
    code: 'GF-N35',
    title: 'Landscape Turf',
    pile: '35mm',
    dtex: '10,500 Dtex',
    density: '16,900/m²',
    sqftRate: 65,
    rollSqft: 539,
    bestFor: 'Rooftops & Patio Gardens',
  },
  {
    code: 'GF-N40',
    title: 'Luxury Turf',
    pile: '40mm',
    dtex: '10,500 Dtex',
    density: '16,900/m²',
    sqftRate: 75,
    rollSqft: 539,
    bestFor: 'Villas & High-End Lawns',
  },
  {
    code: 'GF-N50',
    title: 'Commercial Turf',
    pile: '50mm',
    dtex: '12,000 Dtex',
    density: '24,900/m²',
    sqftRate: 110,
    rollSqft: 539,
    bestFor: 'Pet Cafes & Heavy Footfall',
  },
  {
    code: 'GF-D',
    title: 'Designer Grass',
    pile: '35mm',
    dtex: '10,500 Dtex',
    density: '16,900/m²',
    sqftRate: 95,
    rollSqft: 539,
    bestFor: 'Hexa, Wave, Leaf & Zentra',
  },
];

const PRESET_AREAS = [250, 500, 1000, 2500];

export default function TurfWholesaleHub({ onOpenQuote }: TurfWholesaleHubProps) {
  const [selectedCode, setSelectedCode] = useState<string>('GF-N25');
  const [areaSqft, setAreaSqft] = useState<number>(500);

  const selectedItem =
    WHOLESALE_MATRIX.find((item) => item.code === selectedCode) || WHOLESALE_MATRIX[0];

  const rollsCount = Math.max(1, Math.ceil(areaSqft / selectedItem.rollSqft));
  const suppliedSqft = rollsCount * selectedItem.rollSqft;
  const estimatedCost = suppliedSqft * selectedItem.sqftRate;

  return (
    <section
      id="wholesale-hub"
      className="py-10 sm:py-12 px-4 sm:px-8 lg:px-12 border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 transition-colors"
    >
      <div className="max-w-[1440px] mx-auto w-full space-y-6">

        {/* ── Balanced Header: Title on Left, Depot Timing & Call on Right ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-stone-200 dark:border-stone-800">
          <div>
            <span className="sr-only">Direct Mill Depot • Sector 34 Gurugram</span>

            <h2 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white tracking-tight">
              Wholesale Pricing &amp; Ready Stock
              <span className="sr-only">
                {' '}— Artificial Grass Manufacturer, Wholesaler &amp; Dealer in Gurgaon Delhi NCR
              </span>
            </h2>
          </div>

          {/* Top-Right: Depot Hours & Direct Phone (Desktop & Tablet only - hidden on phone screen) */}
          <div className="hidden sm:flex items-center gap-3 shrink-0 pt-2 md:pt-0">
            <div className="hidden sm:block text-right font-mono text-xs">
              <span className="text-[10px] text-stone-400 dark:text-stone-500 uppercase block">
                Loading Bay
              </span>
              <span className="text-stone-700 dark:text-stone-300 font-medium">
                Mon–Sat (9am–7:30pm)
              </span>
            </div>
            <a
              href="tel:+919217400163"
              className="px-4 py-2.5 rounded-xl bg-stone-900 dark:bg-stone-100 hover:bg-stone-800 dark:hover:bg-white text-white dark:text-stone-950 font-bold text-xs uppercase tracking-wider transition-colors inline-flex items-center gap-2 shadow-sm"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400 dark:text-emerald-600" />
              <span>+91 92174 00163</span>
            </a>
          </div>
        </div>

        {/* ── 2-Column Minimalist Layout: Equal Height Boxes on Desktop ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

          {/* ── LEFT: Clean Wholesale Rate Table ── */}
          <div className="lg:col-span-8 overflow-hidden rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm">
            <table className="w-full table-fixed text-left border-collapse text-xs sm:table-auto">
              <thead>
                <tr className="border-b border-stone-200 dark:border-stone-800 bg-stone-100/70 dark:bg-stone-950/70 text-stone-500 dark:text-stone-400 font-mono text-[11px] uppercase tracking-wider">
                  <th className="w-[28%] py-3 px-2 sm:w-auto sm:px-4">Product</th>
                  <th className="w-[20%] py-3 px-2 sm:w-auto sm:px-3">Specs</th>
                  <th className="hidden py-3 px-3 sm:table-cell">Best Suited For</th>
                  <th className="w-[25%] py-3 px-2 text-right sm:w-auto sm:px-3">
                    <span className="sm:hidden">Rate</span>
                    <span className="hidden sm:inline">Wholesale Rate</span>
                  </th>
                  <th className="w-[27%] py-3 px-2 text-right sm:w-auto sm:px-4">
                    <span className="sm:hidden">Roll</span>
                    <span className="hidden sm:inline">Roll Price</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 dark:divide-stone-800">
                {WHOLESALE_MATRIX.map((row) => {
                  const isSelected = row.code === selectedCode;
                  const rollPrice = row.sqftRate * row.rollSqft;

                  return (
                    <tr
                      key={row.code}
                      onClick={() => setSelectedCode(row.code)}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-emerald-500/10 dark:bg-emerald-500/15'
                          : 'hover:bg-stone-100/60 dark:hover:bg-stone-800/40'
                      }`}
                    >
                      <td className="py-3.5 px-2 font-bold font-mono text-stone-900 dark:text-white sm:px-4">
                        <div className="flex min-w-0 flex-col items-start gap-0.5 sm:flex-row sm:items-center sm:gap-2">
                          <span className={`hidden h-1.5 w-1.5 shrink-0 rounded-full sm:inline-block ${isSelected ? 'bg-emerald-500' : 'bg-transparent'}`} />
                          <span className={`text-[10px] sm:text-xs ${isSelected ? 'text-emerald-600 dark:text-emerald-400' : ''}`}>
                            {row.code}
                          </span>
                          <span className="text-[9px] font-normal leading-tight text-stone-500 dark:text-stone-400 sm:text-[11px]">
                            ({row.title})
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-2 font-mono text-stone-600 dark:text-stone-300 sm:px-3">
                        <span className="text-[10px] font-semibold text-stone-900 dark:text-white sm:text-xs">{row.pile}</span>
                        <span className="block break-words text-[8px] text-stone-400 sm:text-[10px]">{row.dtex}</span>
                      </td>

                      <td className="py-3.5 px-3 text-stone-600 dark:text-stone-400 hidden sm:table-cell">
                        {row.bestFor}
                      </td>

                      <td className="py-3.5 px-2 text-right sm:px-3">
                        <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 sm:text-sm">
                          ₹{row.sqftRate}
                        </span>
                        <span className="ml-0.5 block text-[8px] text-stone-400 sm:inline sm:text-[10px]">/sq.ft</span>
                      </td>

                      <td className="py-3.5 px-2 text-right font-mono text-[10px] font-medium text-stone-600 dark:text-stone-300 sm:px-4 sm:text-xs">
                        ₹{rollPrice.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* ── RIGHT: Ultra-Clean Live Roll Estimator (Equal Height, Clean Presets) ── */}
          <div className="lg:col-span-4 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 shadow-sm flex flex-col justify-between space-y-4">
            
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
                <div className="flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-stone-900 dark:text-white">
                    Instant Roll Estimator
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                  {selectedItem.code}
                </span>
              </div>

              {/* Minimal Preset Pills Only - No extra input box */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-stone-600 dark:text-stone-400 font-light">
                  <span>Project Area:</span>
                  <span className="font-mono font-bold text-stone-900 dark:text-white">
                    {areaSqft} sq.ft
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {PRESET_AREAS.map((sqft) => (
                    <button
                      key={sqft}
                      type="button"
                      onClick={() => setAreaSqft(sqft)}
                      className={`py-1.5 rounded-lg text-[11px] font-mono transition-all cursor-pointer ${
                        areaSqft === sqft
                          ? 'bg-emerald-500 text-stone-950 font-bold shadow-sm'
                          : 'bg-stone-100 dark:bg-stone-950 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white border border-stone-200 dark:border-stone-800'
                      }`}
                    >
                      {sqft} sq.ft
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Calculation Output */}
              <div className="pt-3 border-t border-stone-200 dark:border-stone-800 space-y-2 text-xs">
                <div className="flex items-center justify-between text-stone-600 dark:text-stone-400">
                  <span>Rolls Required:</span>
                  <span className="font-mono font-bold text-stone-900 dark:text-white">
                    {rollsCount} Full Roll{rollsCount > 1 ? 's' : ''} ({suppliedSqft} sq.ft)
                  </span>
                </div>

                <div className="flex items-center justify-between text-stone-600 dark:text-stone-400">
                  <span>Est. Wholesale Total:</span>
                  <span className="font-mono font-black text-sm text-emerald-600 dark:text-emerald-400">
                    ₹{estimatedCost.toLocaleString('en-IN')}
                  </span>
                </div>

                <p className="text-[11px] text-stone-400 dark:text-stone-500 font-light pt-1">
                  Same-day tempo dispatch across Gurgaon &amp; Delhi NCR from Sector 34 depot.
                </p>
              </div>
            </div>

            {/* Single Punchy CTA Button */}
            <button
              type="button"
              onClick={() =>
                onOpenQuote(
                  selectedItem.code,
                  `${selectedItem.title} (${selectedItem.code}) - ${areaSqft} sq.ft estimate (${rollsCount} roll)`
                )
              }
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20"
            >
              <span>Get Wholesale Quote</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

          </div>

        </div>

      </div>
    </section>
  );
}
