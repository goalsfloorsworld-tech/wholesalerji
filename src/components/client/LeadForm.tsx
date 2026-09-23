'use client';

import React, { useState } from 'react';

interface LeadFormProps {
  initialProductSku?: string;
  initialProductName?: string;
  initialMaterial?: string;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function LeadForm({
  initialProductSku = '',
  initialProductName = '',
  initialMaterial = 'WPC Fluted Louvers',
  isOpen = true,
  onClose,
}: LeadFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    businessName: '',
    phone: '',
    city: '',
    quantitySqFt: '1000',
    material: initialMaterial,
    notes: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate fast server action submission
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  const handleWhatsAppRedirect = () => {
    const phone = '919999999999';
    const text = `Hi Wholesaleji Commercial Desk, I am requesting a Wholesale Quotation:\n- Name: ${formData.name}\n- Firm: ${formData.businessName || 'N/A'}\n- City: ${formData.city}\n- Material: ${formData.material}\n- Estimated Qty: ${formData.quantitySqFt} sq ft\n- SKU: ${initialProductSku || 'General'}`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="w-full bg-stone-900 border border-stone-800 rounded-2xl p-6 md:p-8 text-stone-100 shadow-2xl">
      {/* Form Header */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-stone-800">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">
            Commercial B2B Desk
          </span>
          <h3 className="text-xl font-bold text-white mt-0.5">
            {initialProductName ? `Bulk RFQ for ${initialProductName}` : 'Request Wholesale Rate Card'}
          </h3>
          {initialProductSku && (
            <p className="text-xs text-stone-400 mt-0.5 font-medium">SKU: {initialProductSku}</p>
          )}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 rounded-md text-stone-400 hover:text-white hover:bg-stone-800"
          >
            ✕
          </button>
        )}
      </div>

      {submitted ? (
        <div className="py-8 text-center space-y-4">
          <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
            ✓
          </div>
          <h4 className="text-lg font-bold text-white">Quotation Request Logged!</h4>
          <p className="text-xs text-stone-400 max-w-sm mx-auto">
            Our commercial sales team has received your requirement ({formData.quantitySqFt} sq ft) and will dispatch a formal rate card via WhatsApp/Call within 30 minutes.
          </p>
          <div className="pt-2">
            <button
              onClick={handleWhatsAppRedirect}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider transition-colors"
            >
              Open Instant WhatsApp Chat →
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-300 mb-1">
                Your Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Vikram Mehta"
                className="w-full px-3.5 py-2 rounded-lg bg-stone-950 border border-stone-800 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-300 mb-1">
                Company / Firm Name
              </label>
              <input
                type="text"
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                placeholder="e.g. Mehta Architects"
                className="w-full px-3.5 py-2 rounded-lg bg-stone-950 border border-stone-800 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-300 mb-1">
                WhatsApp Phone Number *
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 98765 43210"
                className="w-full px-3.5 py-2 rounded-lg bg-stone-950 border border-stone-800 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-300 mb-1">
                Destination City & Pincode *
              </label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="e.g. Bangalore - 560001"
                className="w-full px-3.5 py-2 rounded-lg bg-stone-950 border border-stone-800 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-300 mb-1">
                Required Area (Sq Ft) *
              </label>
              <input
                type="number"
                required
                min="100"
                value={formData.quantitySqFt}
                onChange={(e) => setFormData({ ...formData, quantitySqFt: e.target.value })}
                placeholder="1000"
                className="w-full px-3.5 py-2 rounded-lg bg-stone-950 border border-stone-800 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-300 mb-1">
                Material Preference
              </label>
              <select
                value={formData.material}
                onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                className="w-full px-3.5 py-2 rounded-lg bg-stone-950 border border-stone-800 text-sm text-white focus:outline-none focus:border-amber-500"
              >
                <option>WPC Fluted Louvers</option>
                <option>PVC High-Gloss Marble Sheets</option>
                <option>Charcoal Acoustic Panels</option>
                <option>Multiple / Full Project Mix</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 px-4 rounded-lg bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-stone-950 font-black text-xs uppercase tracking-widest hover:brightness-110 transition-all disabled:opacity-50"
            >
              {loading ? 'Submitting Request...' : 'Submit Wholesale RFQ →'}
            </button>
            <button
              type="button"
              onClick={handleWhatsAppRedirect}
              className="py-3 px-4 rounded-lg bg-emerald-600/90 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-colors border border-emerald-500/30"
            >
              💬 WhatsApp Quote
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
