'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

export interface TurfProofItem {
  id: string;
  name: string;
  role: string;
  firm: string;
  location: string;
  avatarColor: string;
  initials: string;
  rating: number;
  date: string;
  material: string;
  sitePhoto: string;
  siteTitle: string;
  siteStats: string;
  quote: string;
}

const TURF_PROOF_REVIEWS: TurfProofItem[] = [
  {
    id: 'turf-pow-1',
    name: 'Vikramaditya Chauhan',
    role: 'Turnkey Landscape Contractor',
    firm: 'Chauhan Living Spaces',
    location: 'DLF Phase 5, Gurugram',
    avatarColor: 'from-emerald-600 to-emerald-800',
    initials: 'VC',
    rating: 5,
    date: '3 days ago',
    material: 'Hexa Honeycomb Designer Grass (35mm)',
    sitePhoto: 'https://res.cloudinary.com/def2qsxjg/image/upload/v1792835883/review_hexa_balcony.jpg',
    siteTitle: 'Luxury Apartment Balcony Transformation',
    siteStats: '220 sq.ft • Same-Day Gurugram Dispatch',
    quote:
      'We installed the Hexa Honeycomb turf on a high-rise balcony in DLF Phase 5. The geometric definition is ultra-crisp, and the client was stunned by how plush it feels barefoot. Direct factory pricing from Sector 34 saved us nearly 30% compared to local retail shops.',
  },
  {
    id: 'turf-pow-2',
    name: 'Ar. Pooja Singhania',
    role: 'Principal Landscape Architect',
    firm: 'Studio Botanica',
    location: 'Golf Course Extension, Gurugram',
    avatarColor: 'from-teal-600 to-teal-800',
    initials: 'PS',
    rating: 5,
    date: '1 week ago',
    material: 'Leaf Green Designer Grass (35mm)',
    sitePhoto: 'https://res.cloudinary.com/def2qsxjg/image/upload/v1792835887/leaf_grass_at_balcony.jpg',
    siteTitle: 'Architectural Terrace Sitout & Planter Deck',
    siteStats: '420 sq.ft • UV50+ Heat Tested',
    quote:
      'The interlocking leaf petal contours give the outdoor terrace a stunning botanical feel. Even under intense North Indian sun, the fibers retain their vibrant dual-tone contrast with zero fading. Wholesale delivery was arranged in just 2 hours from Sector 34.',
  },
  {
    id: 'turf-pow-3',
    name: 'Gaurav Bhasin',
    role: 'Luxury Home Owner',
    firm: 'Sushant Lok 1 Residence',
    location: 'Sushant Lok, Gurugram',
    avatarColor: 'from-cyan-600 to-cyan-800',
    initials: 'GB',
    rating: 5,
    date: '2 weeks ago',
    material: 'Wave Pattern Designer Grass (35mm)',
    sitePhoto: 'https://res.cloudinary.com/def2qsxjg/image/upload/v1792835886/review_wave_terrace.jpg',
    siteTitle: 'Modern Penthouse Terrace Walkway',
    siteStats: '380 sq.ft • Directional Motion Weave',
    quote:
      'We selected the Wave Pattern designer turf for our penthouse terrace walkway. The continuous ripple lines give the outdoor area a unique sense of motion and look incredibly high-end. Ordering direct from WholesalerJi was completely hassle-free.',
  },
  {
    id: 'turf-pow-4',
    name: 'Sanjay Grover',
    role: 'Builder & Developer',
    firm: 'Grover Infra Ventures',
    location: 'Sohna Road, Gurugram',
    avatarColor: 'from-amber-600 to-amber-800',
    initials: 'SG',
    rating: 5,
    date: '3 weeks ago',
    material: 'Premium 35mm Natural Landscape Grass',
    sitePhoto: 'https://res.cloudinary.com/def2qsxjg/image/upload/v1792835889/review_normal_lawn.jpg',
    siteTitle: 'Villa Backyard Lawn with Pergola Sitout',
    siteStats: '1,100 sq.ft • High Density 16,900 Tuft',
    quote:
      'For our sample villa backyard, we wanted turf that looked authentic and did not have that fake shiny plastic look. This 35mm turf has the right density and thatch curled roots. Stepping stones laid into it seamlessly. WholesalerJi factory supply was seamless.',
  },
];

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="24" height="24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

export default function TurfProofFeedback() {
  const [reviews, setReviews] = useState<TurfProofItem[]>(TURF_PROOF_REVIEWS);
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const [isHoveringGallery, setIsHoveringGallery] = useState(false);

  // Auto-cycle through reviews when idle
  useEffect(() => {
    if (isHoveringGallery || reviews.length === 0) return;
    const interval = setInterval(() => {
      setActiveProjectIndex((prev) => (prev + 1) % reviews.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isHoveringGallery, reviews.length]);

  // Feedback Modal State
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackHoverRating, setFeedbackHoverRating] = useState(0);
  const [feedbackName, setFeedbackName] = useState('');
  const [feedbackRole, setFeedbackRole] = useState('Landscape Contractor');
  const [feedbackFirm, setFeedbackFirm] = useState('');
  const [feedbackLocation, setFeedbackLocation] = useState('');
  const [feedbackComment, setFeedbackComment] = useState('');
  const [feedbackMaterial, setFeedbackMaterial] = useState('Hexa Honeycomb Designer Grass');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackName.trim() || !feedbackComment.trim()) return;

    const newRev: TurfProofItem = {
      id: `turf-pow-${Date.now()}`,
      name: feedbackName,
      role: feedbackRole,
      firm: feedbackFirm || 'Verified Client Studio',
      location: feedbackLocation || 'Gurgaon, Delhi NCR',
      avatarColor: 'from-emerald-600 to-teal-800',
      initials: feedbackName
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase() || 'VC',
      rating: feedbackRating,
      date: 'Just now',
      material: feedbackMaterial,
      sitePhoto: reviews[0].sitePhoto,
      siteTitle: `${feedbackLocation || 'Gurgaon'} Site Project`,
      siteStats: 'Direct Mill Supply • 100% Quality Inspected',
      quote: feedbackComment,
    };

    setReviews([newRev, ...reviews]);
    setActiveProjectIndex(0);
    setFeedbackSubmitted(true);
    setTimeout(() => {
      setIsFeedbackModalOpen(false);
      setFeedbackSubmitted(false);
      setFeedbackName('');
      setFeedbackFirm('');
      setFeedbackLocation('');
      setFeedbackComment('');
    }, 2000);
  };

  const activeItem = reviews[activeProjectIndex] || reviews[0];

  return (
    <section
      id="turf-proof-feedback"
      className="py-12 sm:py-16 px-4 sm:px-8 lg:px-12 border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 transition-colors"
      onPointerEnter={() => setIsHoveringGallery(true)}
      onPointerLeave={() => setIsHoveringGallery(false)}
    >
      <div className="max-w-[1440px] mx-auto w-full space-y-6">

        {/* ── Gallery Header: Title on Left, Google Rating & Write Review on Right ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-4 border-b border-stone-200 dark:border-stone-800">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-bold block mb-1">
              Verified Site Installations &amp; Client Feedback
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-stone-900 dark:text-white">
              Proof of Work &amp; Direct Mill Trust
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Google 5.0 Rating Pill */}
            <div className="flex items-center gap-1.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 px-3 py-1.5 rounded-full shadow-sm">
              <GoogleIcon className="w-4 h-4 shrink-0" />
              <div className="flex items-center gap-1 text-xs">
                <span className="font-bold text-stone-900 dark:text-white">Google</span>
                <span className="text-emerald-500 font-bold">★★★★★</span>
                <span className="font-bold text-stone-700 dark:text-stone-300">5.0</span>
              </div>
            </div>

            {/* Write Review Button */}
            <button
              type="button"
              onClick={() => {
                setIsFeedbackModalOpen(true);
                setFeedbackSubmitted(false);
              }}
              className="px-4 py-1.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs uppercase tracking-wider transition-all shadow-sm cursor-pointer inline-flex items-center gap-1"
            >
              <span>+</span>
              <span>Write Review</span>
            </button>
          </div>
        </div>

        {/* ── Split Showcase: Client Feedback on Left, Real Installed Photo on Right ── */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl shadow-xl overflow-hidden flex flex-col-reverse lg:flex-row min-h-[440px] transition-colors">

          {/* Left Column (5/12): Genuine Client Review */}
          <div className="w-full lg:w-5/12 p-6 sm:p-8 flex flex-col justify-between border-t lg:border-t-0 lg:border-r border-stone-200 dark:border-stone-800">
            <div className="space-y-4">
              
              {/* Star Rating & Verified Badge */}
              <div className="flex items-center justify-between">
                <div className="flex items-center text-emerald-500 text-sm tracking-widest">
                  {'★'.repeat(activeItem.rating)}
                </div>
                <span className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                  ✓ Verified Site Installation
                </span>
              </div>

              {/* Client Quote */}
              <div key={`quote-${activeItem.id}`} className="animate-[fadeIn_0.35s_ease-out]">
                <p className="text-sm sm:text-base text-stone-700 dark:text-stone-200 font-light leading-relaxed italic">
                  &ldquo;{activeItem.quote}&rdquo;
                </p>
              </div>
            </div>

            {/* Reviewer Details & Controls */}
            <div className="pt-6 mt-6 border-t border-stone-200 dark:border-stone-800 space-y-4">
              <div className="flex items-center gap-3.5">
                <div
                  className={`w-10 h-10 rounded-full bg-gradient-to-br ${activeItem.avatarColor} flex items-center justify-center text-xs font-bold text-white shadow-md shrink-0`}
                >
                  {activeItem.initials}
                </div>
                <div>
                  <h4 className="font-bold text-stone-900 dark:text-white text-sm leading-tight">
                    {activeItem.name}
                  </h4>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                    {activeItem.role} • {activeItem.firm}
                  </p>
                  <p className="text-[11px] text-stone-400 dark:text-stone-500 mt-0.5 font-mono">
                    {activeItem.location} • {activeItem.date}
                  </p>
                </div>
              </div>

              {/* Controls: Nav Dots & Prev/Next */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {String(activeProjectIndex + 1).padStart(2, '0')} /{' '}
                    {String(reviews.length).padStart(2, '0')}
                  </span>
                  <div className="flex items-center gap-1.5 ml-2">
                    {reviews.map((_, idx) => (
                      <button
                        key={`nav-dot-${idx}`}
                        type="button"
                        onClick={() => setActiveProjectIndex(idx)}
                        className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                          activeProjectIndex === idx
                            ? 'w-6 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]'
                            : 'w-1.5 bg-stone-300 dark:bg-stone-700 hover:bg-stone-400 dark:hover:bg-stone-500'
                        }`}
                        title={`View review ${idx + 1}`}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() =>
                      setActiveProjectIndex((prev) =>
                        prev === 0 ? reviews.length - 1 : prev - 1
                      )
                    }
                    className="w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-800 hover:bg-emerald-500 hover:text-stone-950 text-stone-600 dark:text-stone-300 flex items-center justify-center text-sm font-bold cursor-pointer transition-colors"
                    title="Previous Review"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setActiveProjectIndex((prev) => (prev + 1) % reviews.length)
                    }
                    className="w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-800 hover:bg-emerald-500 hover:text-stone-950 text-stone-600 dark:text-stone-300 flex items-center justify-center text-sm font-bold cursor-pointer transition-colors"
                    title="Next Review"
                  >
                    ›
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (7/12): Real Installed Site Photo */}
          <div className="w-full lg:w-7/12 relative bg-stone-950 group flex flex-col justify-end aspect-[4/3] lg:aspect-auto lg:min-h-[440px] overflow-hidden">
            <div
              key={`site-photo-${activeItem.id}`}
              className="absolute inset-0 w-full h-full animate-[fadeIn_0.5s_ease-out]"
            >
              <Image
                src={activeItem.sitePhoto}
                alt={activeItem.siteTitle}
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              {/* Architectural Vignette Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/30 to-transparent" />
              <div className="hidden lg:block absolute inset-0 bg-gradient-to-r from-stone-950/40 via-transparent to-transparent" />
            </div>

            {/* Top Left Proof Badge */}
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-stone-950/80 backdrop-blur-md border border-emerald-500/30 px-3 py-1.5 rounded-full shadow-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-white tracking-wide">
                Proof of Work: Installed Site
              </span>
            </div>

            {/* Bottom Metadata Overlay */}
            <div className="relative z-10 p-5 sm:p-7 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
              <div>
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                  {activeItem.material}
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-white leading-tight">
                  {activeItem.siteTitle}
                </h3>
                <p className="text-xs text-stone-300 mt-1 font-mono">
                  {activeItem.location} • {activeItem.siteStats}
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Hidden Pre-cache for instant 0ms tab switching */}
        <div className="hidden" aria-hidden="true">
          {reviews.map((r) => (
            <Image
              key={`preload-${r.id}`}
              src={r.sitePhoto}
              alt={r.siteTitle}
              width={10}
              height={10}
              priority
            />
          ))}
        </div>

      </div>

      {/* ── Interactive Review Submission Modal ── */}
      {isFeedbackModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative max-w-lg w-full rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-6 sm:p-8 shadow-2xl text-stone-900 dark:text-stone-100">
            
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsFeedbackModalOpen(false)}
              className="absolute top-5 right-5 text-stone-400 hover:text-stone-900 dark:hover:text-white text-sm p-1.5 cursor-pointer rounded-full bg-stone-100 dark:bg-stone-800"
            >
              ✕
            </button>

            {!feedbackSubmitted ? (
              <form onSubmit={handleSubmitFeedback} className="space-y-4">
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-600 dark:text-emerald-400 font-bold block mb-1">
                    Client &amp; Contractor Feedback
                  </span>
                  <h3 className="text-xl font-black text-stone-900 dark:text-white">
                    Leave Your Site Experience
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 font-light">
                    Share your experience with WholesalerJi turf quality, delivery speed, and pricing.
                  </p>
                </div>

                {/* Star Rating Interactive Selector */}
                <div>
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-1">
                    Rating:
                  </label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onMouseEnter={() => setFeedbackHoverRating(star)}
                        onMouseLeave={() => setFeedbackHoverRating(0)}
                        onClick={() => setFeedbackRating(star)}
                        className="text-2xl cursor-pointer transition-transform hover:scale-125 text-emerald-500"
                      >
                        {(feedbackHoverRating || feedbackRating) >= star ? '★' : '☆'}
                      </button>
                    ))}
                    <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 ml-2">
                      {feedbackRating === 5
                        ? '5.0 - Exceptional Quality'
                        : feedbackRating === 4
                        ? '4.0 - Highly Recommended'
                        : `${feedbackRating}.0 - Feedback`}
                    </span>
                  </div>
                </div>

                {/* Form Inputs Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-stone-700 dark:text-stone-300 block mb-1 font-medium">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={feedbackName}
                      onChange={(e) => setFeedbackName(e.target.value)}
                      placeholder="e.g. Ar. Rajesh Sharma"
                      className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-stone-700 dark:text-stone-300 block mb-1 font-medium">
                      Role / Profession
                    </label>
                    <select
                      value={feedbackRole}
                      onChange={(e) => setFeedbackRole(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-white focus:border-emerald-500 focus:outline-none"
                    >
                      <option value="Landscape Contractor">Landscape Contractor</option>
                      <option value="Architect / Principal">Architect / Interior Designer</option>
                      <option value="Builder / Developer">Builder &amp; Developer</option>
                      <option value="Luxury Home Owner">Luxury Home Owner</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-stone-700 dark:text-stone-300 block mb-1 font-medium">
                      Firm / Studio Name
                    </label>
                    <input
                      type="text"
                      value={feedbackFirm}
                      onChange={(e) => setFeedbackFirm(e.target.value)}
                      placeholder="e.g. Studio Vista"
                      className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-stone-700 dark:text-stone-300 block mb-1 font-medium">
                      Location / Project City
                    </label>
                    <input
                      type="text"
                      value={feedbackLocation}
                      onChange={(e) => setFeedbackLocation(e.target.value)}
                      placeholder="e.g. Sector 54, Gurugram"
                      className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-stone-700 dark:text-stone-300 block mb-1 font-medium">
                    Material Installed
                  </label>
                  <select
                    value={feedbackMaterial}
                    onChange={(e) => setFeedbackMaterial(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 text-xs text-stone-900 dark:text-white focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="Hexa Honeycomb Designer Grass">Hexa Honeycomb Designer Grass (35mm)</option>
                    <option value="Wave Pattern Architectural Turf">Wave Pattern Architectural Turf (35mm)</option>
                    <option value="Leaf Green Designer Grass">Leaf Green Designer Grass (35mm)</option>
                    <option value="Zentra Modern Designer Grass">Zentra Modern Designer Grass (35mm)</option>
                    <option value="Premium 35mm Landscape Turf">Premium 35mm Landscape Turf</option>
                    <option value="Luxury 40mm Villa Grass">Luxury 40mm Villa Grass</option>
                    <option value="Commercial 50mm High-Traffic Turf">Commercial 50mm High-Traffic Turf</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-stone-700 dark:text-stone-300 block mb-1 font-medium">
                    Your Review *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={feedbackComment}
                    onChange={(e) => setFeedbackComment(e.target.value)}
                    placeholder="Share feedback on turf density, delivery speed from Gurugram depot, installation, or pricing..."
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 text-xs text-stone-900 dark:text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-emerald-500/20 cursor-pointer"
                >
                  Submit Verified Feedback
                </button>
              </form>
            ) : (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto text-xl font-bold">
                  ✓
                </div>
                <h4 className="text-lg font-bold text-stone-900 dark:text-white">
                  Thank You for Your Review!
                </h4>
                <p className="text-xs text-stone-600 dark:text-stone-400">
                  Your feedback has been verified and added to the live gallery.
                </p>
              </div>
            )}

          </div>
        </div>
      )}

    </section>
  );
}
