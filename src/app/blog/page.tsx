import React from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { getPosts } from '@/lib/wordpress';

export const metadata: Metadata = {
  title: 'Insights for Better Spaces | WholesalerJi Blog',
  description: 'Read the latest insights on architectural wall panels, interior design trends, commercial space solutions, and material selection.',
};

export const revalidate = 3600; // revalidate every hour

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const resolvedParams = await searchParams;
  const currentPage = parseInt(resolvedParams.page || '1', 10);
  const { posts, totalPages } = await getPosts(currentPage, 9);

  const featuredPost = currentPage === 1 && posts.length > 0 ? posts[0] : null;
  const gridPosts = currentPage === 1 ? posts.slice(1) : posts;

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col selection:bg-amber-500 selection:text-stone-950 transition-colors">
      <Navbar currentPath="/blog" />
      <main className="flex-1 flex flex-col pt-10 pb-20 px-4 sm:px-8 lg:px-12 xl:px-24">
        
        {/* Editorial Hero */}
        <div className="max-w-4xl w-full mx-auto text-center py-12 md:py-20 flex flex-col items-center">
          <h1 className="text-4xl md:text-6xl font-black text-stone-900 dark:text-white tracking-tight mb-6">
            Insights for <span className="text-amber-500">Better Spaces.</span>
          </h1>
          <p className="text-lg md:text-xl text-stone-600 dark:text-stone-400 mb-8 max-w-2xl text-center">
            Explore architectural cladding trends, material guides, and commercial interior solutions for professionals and homeowners.
          </p>
        </div>

        {/* Blog Posts */}
        {posts && posts.length > 0 ? (
          <div className="max-w-7xl w-full mx-auto">
            {/* Featured Post (Only on page 1) */}
            {featuredPost && (
              <div className="mb-20">
                <Link
                  href={`/blog/${featuredPost.slug}`}
                  className="group flex flex-col lg:flex-row gap-8 lg:gap-12 items-center"
                >
                  <div className="w-full lg:w-3/5 relative aspect-[16/9] lg:aspect-[4/3] rounded-3xl overflow-hidden bg-stone-200 dark:bg-stone-900 shadow-xl">
                    <Image
                      src={
                        featuredPost._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
                        'https://res.cloudinary.com/def2qsxjg/image/upload/v1791125624/charcoal_fluted_office_insitu.jpg'
                      }
                      alt={featuredPost.title.rendered || 'Featured blog post'}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      sizes="(max-width: 1024px) 100vw, 60vw"
                      priority
                    />
                  </div>
                  <div className="w-full lg:w-2/5 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-4 text-xs font-bold uppercase tracking-wider text-stone-500">
                      <span className="text-amber-600 dark:text-amber-400">
                        LATEST
                      </span>
                      <span>•</span>
                      <time>
                        {new Date(featuredPost.date).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </time>
                    </div>
                    <h2 
                      className="text-3xl md:text-4xl font-black text-stone-900 dark:text-white mb-4 leading-tight group-hover:text-amber-500 transition-colors"
                      dangerouslySetInnerHTML={{ __html: featuredPost.title.rendered }}
                    />
                    <div 
                      className="text-stone-600 dark:text-stone-400 mb-8 line-clamp-4 text-lg"
                      dangerouslySetInnerHTML={{ __html: featuredPost.excerpt.rendered }}
                    />
                    <div className="inline-flex items-center gap-2 text-sm font-bold text-stone-900 dark:text-white group-hover:text-amber-500 transition-colors">
                      <span>Read Full Article</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {/* Grid Posts */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16 mb-16">
              {gridPosts.map((post: any) => {
                const imageUrl =
                  post._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
                  'https://res.cloudinary.com/def2qsxjg/image/upload/v1791125624/charcoal_fluted_office_insitu.jpg';
                let category = post._embedded?.['wp:term']?.[0]?.[0]?.name;
                if (!category || category.toLowerCase() === 'uncategorized') category = '';
                const date = new Date(post.date).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                });
                
                return (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="group flex flex-col"
                  >
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100 dark:bg-stone-900 rounded-2xl mb-6 shadow-sm">
                      <Image
                        src={imageUrl}
                        alt={post.title.rendered || 'Blog post image'}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                    
                    <div className="flex flex-col flex-1">
                      <div className="flex items-center gap-2 mb-3 text-[11px] font-bold uppercase tracking-wider text-stone-500">
                        {category && (
                          <>
                            <span className="text-amber-600 dark:text-amber-500">{category}</span>
                            <span>•</span>
                          </>
                        )}
                        <time>{date}</time>
                      </div>
                      <h3 
                        className="text-xl font-bold text-stone-900 dark:text-white mb-3 line-clamp-2 group-hover:text-amber-500 transition-colors"
                        dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                      />
                      <div 
                        className="text-sm text-stone-600 dark:text-stone-400 line-clamp-3 mb-4"
                        dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
                      />
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 py-12 border-t border-stone-200 dark:border-stone-800">
                {currentPage > 1 ? (
                  <Link
                    href={`/blog?page=${currentPage - 1}`}
                    className="px-6 py-3 rounded-full border border-stone-300 dark:border-stone-700 text-sm font-bold hover:border-amber-500 hover:text-amber-500 transition-colors text-stone-900 dark:text-white"
                  >
                    ← Previous
                  </Link>
                ) : (
                  <span className="px-6 py-3 rounded-full border border-stone-200 dark:border-stone-800 text-sm font-bold text-stone-400 dark:text-stone-600 cursor-not-allowed">
                    ← Previous
                  </span>
                )}
                
                <span className="text-sm font-medium text-stone-500 px-4">
                  Page {currentPage} of {totalPages}
                </span>
                
                {currentPage < totalPages ? (
                  <Link
                    href={`/blog?page=${currentPage + 1}`}
                    className="px-6 py-3 rounded-full border border-stone-300 dark:border-stone-700 text-sm font-bold hover:border-amber-500 hover:text-amber-500 transition-colors text-stone-900 dark:text-white"
                  >
                    Next →
                  </Link>
                ) : (
                  <span className="px-6 py-3 rounded-full border border-stone-200 dark:border-stone-800 text-sm font-bold text-stone-400 dark:text-stone-600 cursor-not-allowed">
                    Next →
                  </span>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="py-20 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mb-6">
              <span className="text-3xl">📰</span>
            </div>
            <h3 className="text-2xl font-bold mb-2">No Articles Found</h3>
            <p className="text-stone-500 dark:text-stone-400 text-sm max-w-md mx-auto">
              We couldn't load any articles at this time. Please check back later.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
