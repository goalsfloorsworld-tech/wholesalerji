'use client';

import React, { useState } from 'react';

export interface FAQItem {
  id?: string;
  question: string;
  answer: string;
  keyHighlight?: string;
}

interface FAQProps {
  title?: string;
  subtitle?: string;
  description?: string;
  items: FAQItem[];
}

export default function FAQ({
  title = 'Frequently Asked Questions',
  subtitle = 'Architectural Insights',
  description = 'Answers to common questions regarding installation, performance, and maintenance of our panels.',
  items,
}: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="w-full py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="mb-12">
        <span className="text-[10px] font-mono uppercase tracking-widest text-stone-400 dark:text-stone-500 mb-2 block">
          {subtitle}
        </span>
        <h2 className="text-3xl font-light tracking-tight text-stone-900 dark:text-stone-100">
          {title}
        </h2>
        {description && (
          <p className="mt-4 text-sm text-stone-500 dark:text-stone-400 font-light max-w-2xl leading-relaxed">
            {description}
          </p>
        )}
      </div>

      <div className="border-t border-stone-200 dark:border-stone-800">
        {items.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div key={item.id || idx} className="border-b border-stone-200 dark:border-stone-800">
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full py-6 flex items-start justify-between text-left focus:outline-none group"
              >
                <span
                  className={`text-base sm:text-lg pr-8 transition-colors ${
                    isOpen
                      ? 'text-amber-600 dark:text-amber-400 font-medium'
                      : 'text-stone-700 dark:text-stone-300 group-hover:text-stone-900 dark:group-hover:text-white'
                  }`}
                >
                  {item.question}
                </span>
                <span
                  className={`flex-shrink-0 mt-1 transition-transform duration-300 ${
                    isOpen
                      ? 'rotate-45 text-amber-500'
                      : 'text-stone-400 group-hover:text-stone-600 dark:group-hover:text-stone-200'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                  </svg>
                </span>
              </button>

              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                }`}
              >
                <div className="overflow-hidden">
                  <div className="pb-8 pt-2 text-sm sm:text-base text-stone-500 dark:text-stone-400 font-light leading-relaxed max-w-3xl space-y-4">
                    <p>{item.answer}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
