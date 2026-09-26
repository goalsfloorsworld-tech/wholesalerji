"use client";

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import OptimizedImage from '@/components/OptimizedImage';
import Link from 'next/link';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function AboutClient() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Section Refs
  const introRef = useRef<HTMLDivElement>(null);
  const journeyPinRef = useRef<HTMLDivElement>(null);
  const journeyScrollRef = useRef<HTMLDivElement>(null);
  const problemRef = useRef<HTMLDivElement>(null);
  const scaleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize smooth scrolling
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 2,
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      ScrollTrigger.update();
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    const ctx = gsap.context(() => {
      // 1. Cinematic Opening Animation
      const tlIntro = gsap.timeline();
      tlIntro.to('.intro-text-1', { opacity: 0, y: -50, duration: 1, delay: 2, ease: "power3.inOut" })
             .fromTo('.intro-text-2', { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1, ease: "power3.out" }, "-=0.5")
             .fromTo('.intro-text-3', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1, ease: "power3.out" }, "+=0.2");
      
      gsap.to('.hero-bg', {
        yPercent: 30,
        ease: "none",
        scrollTrigger: {
          trigger: introRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      });

      // 2. Minimal Statement Fade
      gsap.utils.toArray('.fade-up').forEach((element: unknown) => {
        const el = element as Element;
        gsap.fromTo(el, 
          { opacity: 0, y: 40 },
          { 
            opacity: 1, y: 0, 
            duration: 1.2, 
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
            }
          }
        );
      });

      // 3. The Journey (Horizontal Scroll)
      const journeySections = gsap.utils.toArray('.journey-slide');
      if (journeyScrollRef.current && journeyPinRef.current) {
        gsap.to(journeySections, {
          xPercent: -100 * (journeySections.length - 1),
          ease: "none",
          scrollTrigger: {
            trigger: journeyPinRef.current,
            pin: true,
            scrub: 1,
            end: () => "+=" + journeyScrollRef.current!.offsetWidth,
          }
        });
      }

      // 4. The Problem Reveal
      const problemQuestions = gsap.utils.toArray('.problem-q');
      gsap.fromTo(problemQuestions, 
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          stagger: 0.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: problemRef.current,
            start: "top 70%",
            end: "center 40%",
            scrub: 1,
          }
        }
      );

      // 5. Scale Counter
      const counters = gsap.utils.toArray('.scale-num');
      counters.forEach((counter: unknown) => {
        const el = counter as HTMLElement;
        const target = parseFloat(el.getAttribute('data-target') || '0');
        const suffix = el.getAttribute('data-suffix') || '';
        ScrollTrigger.create({
          trigger: scaleRef.current,
          start: "top 75%",
          once: true,
          onEnter: () => {
            gsap.to(el, {
              innerHTML: target,
              duration: 2.5,
              ease: "power3.out",
              snap: { innerHTML: 1 },
              onUpdate: function() {
                el.innerHTML = String(Math.round(Number(this.targets()[0].innerHTML)) + suffix);
              }
            });
          }
        });
      });

      // 6. Mosaic Parallax
      gsap.utils.toArray('.mosaic-img').forEach((element: unknown, i) => {
        const img = element as Element;
        gsap.to(img, {
          yPercent: i % 2 === 0 ? -15 : 15,
          ease: "none",
          scrollTrigger: {
            trigger: '.mosaic-container',
            start: "top bottom",
            end: "bottom top",
            scrub: true
          }
        });
      });
      
    }, containerRef);

    return () => {
      cancelAnimationFrame(rafId);
      ctx.revert();
      lenis.destroy();
    };
  }, []);

  const [activeSegment, setActiveSegment] = useState(0);
  const serveSegments = [
    { title: "CONTRACTORS", desc: "For projects where material availability and quantity matter.", img: "/assets/about/contractors.jpg" },
    { title: "INTERIOR DESIGNERS", desc: "For spaces where finish, texture and visual character matter.", img: "/assets/about/designers.jpg" },
    { title: "RETAILERS", desc: "For businesses looking for wall-panel products for their customers.", img: "/assets/about/retailers.jpg" },
    { title: "PROJECTS", desc: "For residential and commercial requirements where sourcing needs to scale.", img: "/assets/home-image.jpg" }
  ];

  return (
    <div ref={containerRef} className="bg-stone-50 dark:bg-[#0a0a0a] text-stone-900 dark:text-stone-100 overflow-hidden font-sans">
      <Navbar currentPath="/about" />

      {/* SEO H1 Hidden */}
      <h1 className="sr-only">WholesalerJi — From Panel to Project</h1>

      {/* SECTION 1: CINEMATIC OPENING */}
      <section ref={introRef} className="relative h-screen w-full flex items-center overflow-hidden bg-black">
        <div className="absolute inset-0 z-0 hero-bg">
          <OptimizedImage 
            src="/assets/about/hero.jpg" 
            alt="Luxury interior architectural wall panel" 
            className="w-full h-full object-cover opacity-60 dark:opacity-40" 
            containerClassName="w-full h-full"
            transformations="w_1920,q_auto,f_auto"
            disableLoader={true}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        </div>
        
        <div className="relative z-10 px-6 md:px-16 max-w-7xl mx-auto w-full">
          <div className="max-w-4xl relative h-[40vh] flex flex-col justify-center">
            <h2 className="intro-text-1 absolute text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tighter uppercase leading-[1.1]">
              We don&apos;t just<br/><span className="text-amber-500">sell wall panels.</span>
            </h2>
            <div className="intro-text-2 opacity-0 absolute">
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tighter uppercase leading-[1.1] mb-6">
                We help turn<br/>empty walls into<br/><span className="text-amber-500">spaces people remember.</span>
              </h2>
              <p className="intro-text-3 opacity-0 text-lg md:text-xl text-stone-300 font-medium max-w-xl border-l-2 border-amber-500 pl-4">
                WholesalerJi connects wall-panel solutions with the people and projects that bring spaces to life.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: MINIMAL STATEMENT */}
      <section className="py-10 px-6 md:px-16 max-w-5xl mx-auto text-center">
        <h2 className="fade-up text-3xl md:text-6xl font-black tracking-tight uppercase mb-10">
          A wall is where every<br/>project <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-400">begins.</span>
        </h2>
        <p className="fade-up text-xl md:text-3xl text-stone-600 dark:text-stone-400 font-medium leading-relaxed mb-10">
          A blank surface can become a statement wall, a warm interior, a commercial identity or the detail that makes an entire space feel complete.
        </p>
        <p className="fade-up text-base md:text-lg text-stone-500 font-medium max-w-3xl mx-auto leading-loose">
          WholesalerJi exists to make that transformation easier—from choosing the right panel to supplying it at the scale a project demands.
        </p>
      </section>

      {/* SECTION 3: THE JOURNEY */}
      <section ref={journeyPinRef} className="h-screen bg-stone-950 text-white overflow-hidden flex flex-col justify-center relative">
        <div className="absolute top-12 left-6 md:left-16 z-20">
          <h2 className="text-sm font-bold tracking-[0.3em] text-amber-500 uppercase">From Panel to Project</h2>
        </div>
        
        <div ref={journeyScrollRef} className="flex w-[600vw] h-full items-center">
          
          {/* 01 DISCOVER */}
          <div className="journey-slide w-screen h-full flex flex-col md:flex-row items-center justify-center p-6 md:p-16 gap-12 relative">
            <div className="absolute inset-0 opacity-20 pointer-events-none">
               <OptimizedImage src="https://res.cloudinary.com/dcezlxt8r/image/upload/v1741639105/Fluted_Panel_FP_-_706.png" alt="Discover panels" className="w-full h-full object-cover" containerClassName="w-full h-full" disableLoader={true} />
            </div>
            <div className="relative z-10 max-w-lg">
              <span className="text-amber-500 font-black text-6xl md:text-8xl block mb-4 opacity-50">01</span>
              <h3 className="text-4xl md:text-6xl font-black mb-6 uppercase tracking-tight">Discover</h3>
              <p className="text-xl text-stone-400 leading-relaxed">Explore textures, finishes, patterns and panel systems built for different spaces.</p>
            </div>
            <div className="relative w-full md:w-1/2 aspect-square max-h-[60vh] rounded-2xl overflow-hidden shadow-2xl z-10 border border-stone-800">
               <OptimizedImage src="https://res.cloudinary.com/dcezlxt8r/image/upload/v1741639144/Charcoal_Louvers_124.png" alt="Textures" className="w-full h-full object-cover" containerClassName="w-full h-full" />
            </div>
          </div>

          {/* 02 SELECT */}
          <div className="journey-slide w-screen h-full flex flex-col md:flex-row items-center justify-center p-6 md:p-16 gap-12 relative">
            <div className="relative w-full md:w-1/2 aspect-[4/3] max-h-[60vh] rounded-2xl overflow-hidden shadow-2xl z-10 border border-stone-800">
               <OptimizedImage src="https://res.cloudinary.com/dcezlxt8r/image/upload/v1741639097/Fluted_Panel_FP_-_701.png" alt="Select" className="w-full h-full object-cover" containerClassName="w-full h-full" />
            </div>
            <div className="relative z-10 max-w-lg md:order-last order-first">
              <span className="text-amber-500 font-black text-6xl md:text-8xl block mb-4 opacity-50">02</span>
              <h3 className="text-4xl md:text-6xl font-black mb-6 uppercase tracking-tight">Select</h3>
              <p className="text-xl text-stone-400 leading-relaxed">Choose the material, finish and quantity that fits the project.</p>
            </div>
          </div>

          {/* 03 SOURCE */}
          <div className="journey-slide w-screen h-full flex flex-col md:flex-row items-center justify-center p-6 md:p-16 gap-12 relative bg-stone-900">
             <div className="relative z-10 max-w-lg text-center md:text-left">
              <span className="text-amber-500 font-black text-6xl md:text-8xl block mb-4 opacity-50">03</span>
              <h3 className="text-4xl md:text-6xl font-black mb-6 uppercase tracking-tight">Source</h3>
              <p className="text-xl text-stone-400 leading-relaxed">We connect project requirements with the right wall-panel solutions.</p>
            </div>
          </div>

          {/* 04 SUPPLY */}
          <div className="journey-slide w-screen h-full flex flex-col items-center justify-center relative">
            <div className="absolute inset-0">
               <OptimizedImage src="/assets/about/supply.jpg" alt="Supply" className="w-full h-full object-cover" containerClassName="w-full h-full" disableLoader={true} />
               <div className="absolute inset-0 bg-black/60 z-10" />
            </div>
            <div className="relative z-20 max-w-2xl text-center px-6">
              <span className="text-amber-500 font-black text-6xl md:text-8xl block mb-4 opacity-80">04</span>
              <h3 className="text-4xl md:text-6xl font-black mb-6 uppercase tracking-tight text-white">Supply</h3>
              <p className="text-2xl text-stone-200 leading-relaxed">Bulk requirements move through a supply process designed for contractors, retailers, designers and projects.</p>
            </div>
          </div>

          {/* 05 ARRIVE */}
          <div className="journey-slide w-screen h-full flex items-center justify-center bg-amber-500 text-stone-950 p-6 md:p-16 relative">
            <div className="max-w-4xl w-full flex flex-col md:flex-row items-center justify-between gap-12">
               <div className="max-w-lg">
                <span className="text-stone-950 font-black text-6xl md:text-8xl block mb-4 opacity-30">05</span>
                <h3 className="text-4xl md:text-6xl font-black mb-6 uppercase tracking-tight">Arrive</h3>
                <p className="text-2xl font-bold leading-relaxed">Material reaches the project ready for the next stage.</p>
              </div>
            </div>
          </div>

          {/* 06 TRANSFORM */}
          <div className="journey-slide w-screen h-full flex flex-col items-center justify-center relative">
            <div className="absolute inset-0">
               <OptimizedImage src="/assets/home-image.jpg" alt="Transformed interior" className="w-full h-full object-cover opacity-60" containerClassName="w-full h-full" disableLoader={true} />
            </div>
            <div className="relative z-10 max-w-3xl text-center px-6">
              <span className="text-amber-500 font-black text-6xl md:text-8xl block mb-4 opacity-90 drop-shadow-lg">06</span>
              <h3 className="text-5xl md:text-8xl font-black mb-6 uppercase tracking-tight text-white drop-shadow-2xl">Transform</h3>
              <p className="text-2xl md:text-3xl text-white font-medium leading-relaxed drop-shadow-lg">The empty wall becomes part of the space.</p>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 4: THE PROBLEM */}
      <section ref={problemRef} className="py-10 px-6 md:px-16 bg-stone-100 dark:bg-stone-900 border-y border-stone-200 dark:border-stone-800">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-16 lg:gap-24">
          <div className="lg:w-1/2 lg:sticky lg:top-32 self-start">
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight leading-[1.1] mb-6">
              The panel is only<br/><span className="text-amber-500">half the story.</span>
            </h2>
            <p className="text-2xl font-bold text-stone-600 dark:text-stone-400 mb-8">The other half is supply.</p>
            <p className="text-lg text-stone-500 max-w-md leading-relaxed">
              For a small requirement, choosing a panel may be simple. For a project, the questions become different:
            </p>
          </div>
          
          <div className="lg:w-1/2 flex flex-col gap-12 text-2xl md:text-4xl font-black text-stone-300 dark:text-stone-700 uppercase tracking-tighter">
            <div className="problem-q text-stone-900 dark:text-white border-b-2 border-amber-500 pb-2 inline-block self-start">Is the material available?</div>
            <div className="problem-q text-stone-900 dark:text-white border-b-2 border-amber-500 pb-2 inline-block self-start">Can the quantity be arranged?</div>
            <div className="problem-q text-stone-900 dark:text-white border-b-2 border-amber-500 pb-2 inline-block self-start">Is the finish right?</div>
            <div className="problem-q text-stone-900 dark:text-white border-b-2 border-amber-500 pb-2 inline-block self-start">Can the requirement be coordinated?</div>
            <div className="problem-q text-stone-900 dark:text-white border-b-2 border-amber-500 pb-2 inline-block self-start">Can the supply reach the project?</div>
            
            <div className="fade-up mt-12 text-3xl md:text-5xl text-amber-500 pt-12">
              That&apos;s where WholesalerJi comes in.
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: WHO WE SERVE */}
      <section className="py-10 bg-white dark:bg-black">
        <div className="px-6 md:px-16 w-full mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight">
            Built around the people who <span className="text-amber-500">build spaces.</span>
          </h2>
        </div>
        
        <div className="flex flex-col md:flex-row h-auto md:h-[70vh]">
          {/* Accordion/List */}
          <div className="w-full md:w-1/2 bg-stone-50 dark:bg-stone-950 flex flex-col justify-center px-6 md:px-16 py-12">
            {serveSegments.map((segment, idx) => (
              <div 
                key={idx}
                className={`py-8 cursor-pointer transition-all duration-300 border-b border-stone-200 dark:border-stone-800 ${activeSegment === idx ? 'opacity-100 pl-4' : 'opacity-40 hover:opacity-70'}`}
                onMouseEnter={() => setActiveSegment(idx)}
                onClick={() => setActiveSegment(idx)}
              >
                <h3 className="text-2xl md:text-4xl font-black uppercase tracking-tight mb-3">
                  {segment.title}
                </h3>
                {activeSegment === idx && (
                  <p className="text-stone-600 dark:text-stone-400 font-medium max-w-sm animate-in fade-in slide-in-from-top-2">
                    {segment.desc}
                  </p>
                )}
              </div>
            ))}
          </div>
          
          {/* Dynamic Image */}
          <div className="w-full md:w-1/2 h-[50vh] md:h-full relative overflow-hidden bg-stone-900">
            {serveSegments.map((segment, idx) => (
              <div 
                key={idx}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${activeSegment === idx ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
              >
                 <OptimizedImage 
                   src={segment.img} 
                   alt={segment.title} 
                   transformations="w_1200,q_auto,f_auto"
                   className="w-full h-full object-cover" 
                   containerClassName="w-full h-full"
                 />
                 <div className="absolute inset-0 bg-black/20" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6: THE SCALE */}
      <section ref={scaleRef} className="py-10 bg-stone-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/assets/noise.png')] opacity-[0.03] mix-blend-overlay pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 md:px-16 relative z-10">
          <h2 className="text-sm font-bold tracking-[0.3em] text-amber-500 uppercase mb-20 text-center">
            The Scale Behind the Screen
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 text-center divide-y sm:divide-y-0 sm:divide-x divide-white/10">
            <div className="pt-8 sm:pt-0">
              <div className="text-5xl md:text-7xl font-black text-white mb-2 scale-num" data-target="500" data-suffix="+">0</div>
              <div className="text-sm font-bold text-amber-500 uppercase tracking-widest">Authorized Dealers</div>
            </div>
            <div className="pt-8 sm:pt-0">
              <div className="text-5xl md:text-7xl font-black text-white mb-2 flex justify-center items-center">
                <span className="scale-num" data-target="2.5">0</span><span className="text-4xl md:text-6xl mt-1">M+</span>
              </div>
              <div className="text-sm font-bold text-amber-500 uppercase tracking-widest">Sq. Ft. Delivered</div>
            </div>
            <div className="pt-8 sm:pt-0">
              <div className="text-5xl md:text-7xl font-black text-white mb-2 scale-num" data-target="18">0</div>
              <div className="text-sm font-bold text-amber-500 uppercase tracking-widest">States</div>
            </div>
            <div className="pt-8 sm:pt-0">
              <div className="text-4xl md:text-6xl font-black text-white mb-2 flex items-center justify-center h-[72px] md:h-[96px]">PAN-INDIA</div>
              <div className="text-sm font-bold text-amber-500 uppercase tracking-widest">Logistics</div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: REALITY MOSAIC */}
      <section className="py-10 bg-stone-50 dark:bg-[#0a0a0a] overflow-hidden mosaic-container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4 h-[60vh] md:h-[80vh]">
           <div className="rounded-2xl overflow-hidden relative">
             <OptimizedImage src="https://res.cloudinary.com/dcezlxt8r/image/upload/v1741639088/Charcoal_Louvers_122.png" alt="Detail 1" className="w-full h-[130%] object-cover mosaic-img" containerClassName="w-full h-full absolute -top-[15%]" />
           </div>
           <div className="rounded-2xl overflow-hidden relative mt-12">
             <OptimizedImage src="/assets/about/supply.jpg" alt="Supply chain" className="w-full h-[130%] object-cover mosaic-img" containerClassName="w-full h-full absolute -top-[15%]" />
           </div>
           <div className="rounded-2xl overflow-hidden relative hidden md:block">
             <OptimizedImage src="https://res.cloudinary.com/dcezlxt8r/image/upload/v1741639105/Fluted_Panel_FP_-_706.png" alt="Detail 2" className="w-full h-[130%] object-cover mosaic-img" containerClassName="w-full h-full absolute -top-[15%]" />
           </div>
           <div className="rounded-2xl overflow-hidden relative mt-24 hidden md:block">
             <OptimizedImage src="/assets/home-image.jpg" alt="Interior" className="w-full h-[130%] object-cover mosaic-img" containerClassName="w-full h-full absolute -top-[15%]" />
           </div>
        </div>
      </section>

      {/* SECTION 8: BRAND PHILOSOPHY */}
      <section className="py-10 px-6 md:px-16 max-w-5xl mx-auto">
        <h2 className="fade-up text-4xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-2">
          Built for Scale.
        </h2>
        <h2 className="fade-up text-4xl md:text-7xl font-black uppercase tracking-tighter leading-none text-amber-500 mb-20">
          Designed for Spaces.
        </h2>
        
        <div className="space-y-16">
          <div className="fade-up border-l-4 border-stone-200 dark:border-stone-800 pl-8">
            <span className="text-sm font-bold text-amber-500 tracking-widest block mb-2">01</span>
            <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-2">Material First</h3>
            <p className="text-lg text-stone-500">Quality and suitability before decoration.</p>
          </div>
          <div className="fade-up border-l-4 border-stone-200 dark:border-stone-800 pl-8">
            <span className="text-sm font-bold text-amber-500 tracking-widest block mb-2">02</span>
            <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-2">Supply Matters</h3>
            <p className="text-lg text-stone-500">A great design means little if the material doesn&apos;t arrive when needed.</p>
          </div>
          <div className="fade-up border-l-4 border-amber-500 pl-8">
            <span className="text-sm font-bold text-amber-500 tracking-widest block mb-2">03</span>
            <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-2">Projects Over Transactions</h3>
            <p className="text-lg text-stone-500">Focus on requirements, quantities and long-term relationships.</p>
          </div>
        </div>
      </section>

      {/* SECTION 9: FINAL EXPERIENCE */}
      <section className="relative py-10 bg-black flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
           <OptimizedImage src="/assets/about/hero.jpg" alt="Background architecture" className="w-full h-full object-cover mix-blend-luminosity scale-110" containerClassName="w-full h-full" disableLoader={true} />
        </div>
        
        <div className="relative z-10">
          <p className="text-sm md:text-base font-bold tracking-[0.3em] text-stone-400 uppercase mb-8">
            Every project starts with a surface.
          </p>
          <h2 className="text-4xl md:text-6xl lg:text-8xl font-black text-white uppercase tracking-tighter mb-12 drop-shadow-2xl">
            What will you<br/><span className="text-amber-500">build on it?</span>
          </h2>
          <Link href="/contact">
            <button className="bg-amber-500 hover:bg-amber-400 text-stone-950 px-10 py-5 rounded-full font-black text-lg uppercase tracking-wider transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(245,158,11,0.3)]">
              Start a Project
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
