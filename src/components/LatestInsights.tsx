import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { normalizeWordPressImageUrl } from '@/lib/wordpress';

interface LatestInsightsProps {
  posts?: any[];
}

export default function LatestInsights({ posts }: LatestInsightsProps) {
  if (!posts || posts.length === 0) {
    return null;
  }

  // Take maximum 3 posts
  const displayPosts = posts.slice(0, 3);

  return (
    <section id="insights" className="py-16 md:py-24 px-4 sm:px-8 lg:px-12 xl:px-24 w-full border-t border-stone-200 dark:border-stone-800 bg-stone-100/40 dark:bg-stone-900/30 transition-colors">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 gap-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-amber-600 dark:text-amber-500 block mb-3">
              Knowledge Hub &amp; Specifications
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-stone-900 dark:text-white tracking-tight">
              Latest Architectural Insights
            </h2>
            <p className="mt-3 text-sm md:text-base text-stone-600 dark:text-stone-400 max-w-2xl leading-relaxed">
              Technical cladding guides, verified wholesale pricing breakdowns, and material selection trends for contractors, designers, and projects.
            </p>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-bold text-stone-900 dark:text-white hover:text-amber-500 dark:hover:text-amber-400 transition-colors group shrink-0"
          >
            <span>Explore All Insights</span>
            <svg
              className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>

        {/* Dynamic Posts Grid */}
        <div className={`grid grid-cols-1 ${displayPosts.length === 1 ? 'max-w-3xl' : displayPosts.length === 2 ? 'md:grid-cols-2 max-w-5xl' : 'md:grid-cols-2 lg:grid-cols-3'} gap-8 md:gap-10`}>
          {displayPosts.map((post) => {
            const rawImageUrl = post._embedded?.['wp:featuredmedia']?.[0]?.source_url;
            const imageUrl = normalizeWordPressImageUrl(rawImageUrl) || '/assets/home-image.jpg';
            const category = post._embedded?.['wp:term']?.[0]?.[0]?.name || 'Wall Panels';
            const date = new Date(post.date).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            });
            const plainTitle = post.title?.rendered ? post.title.rendered.replace(/<[^>]+>/g, '').trim() : 'Architectural Guide';
            const plainExcerpt = post.excerpt?.rendered
              ? post.excerpt.rendered.replace(/<[^>]+>/g, '').trim()
              : 'Read the latest technical and pricing insights from WholesalerJi.';

            return (
              <article key={post.id || post.slug} className="group flex flex-col h-full">
                <Link
                  href={`/blog/${post.slug}`}
                  className="flex flex-col h-full focus:outline-none"
                  aria-label={plainTitle}
                >
                  {/* Image Container */}
                  <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-stone-200 dark:bg-stone-900 mb-6 shadow-sm border border-stone-200/60 dark:border-stone-800/60">
                    <Image
                      src={imageUrl}
                      alt={plainTitle}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Metadata Row */}
                  <div className="flex items-center gap-3 mb-3 text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                    <span className="text-amber-600 dark:text-amber-500 font-semibold">{category}</span>
                    <span>•</span>
                    <time dateTime={post.date}>{date}</time>
                  </div>

                  {/* Title */}
                  <h3
                    className="text-lg md:text-xl font-bold text-stone-900 dark:text-white group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors leading-snug line-clamp-2 mb-3"
                    dangerouslySetInnerHTML={{ __html: post.title?.rendered || plainTitle }}
                  />

                  {/* Excerpt */}
                  <p className="text-sm text-stone-600 dark:text-stone-400 line-clamp-2 md:line-clamp-3 leading-relaxed mb-6 flex-1">
                    {plainExcerpt}
                  </p>

                  {/* Read Link */}
                  <div className="pt-2 flex items-center gap-2 text-sm font-bold text-stone-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    <span>Read Article</span>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      className="transform group-hover:translate-x-1.5 transition-transform"
                    >
                      <path d="M5 12h14m-7-7 7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              </article>
            );
          })}
        </div>

      </div>
    </section>
  );
}
