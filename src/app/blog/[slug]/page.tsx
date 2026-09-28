import React from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { getPostBySlug } from '@/lib/wordpress';
import DOMPurify from 'isomorphic-dompurify';
import type { Metadata, ResolvingMetadata } from 'next';

// Ensure any target="_blank" links are secure
DOMPurify.addHook('afterSanitizeAttributes', function (node) {
  if ('target' in node && node.getAttribute('target') === '_blank') {
    node.setAttribute('rel', 'noopener noreferrer');
  }
});

export const revalidate = 3600;

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Article Not Found | WholesalerJi',
    };
  }

  // Strip HTML from excerpt for description
  const plainDescription = post.excerpt.rendered.replace(/<[^>]+>/g, '').trim() || 'Read the latest architectural and material insights from WholesalerJi.';
  const imageUrl = post._embedded?.['wp:featuredmedia']?.[0]?.source_url;

  return {
    title: `${post.title.rendered.replace(/<[^>]+>/g, '')} | WholesalerJi Blog`,
    description: plainDescription,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title.rendered.replace(/<[^>]+>/g, ''),
      description: plainDescription,
      url: `/blog/${post.slug}`,
      type: 'article',
      publishedTime: post.date,
      modifiedTime: post.modified,
      images: imageUrl ? [{ url: imageUrl }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title.rendered.replace(/<[^>]+>/g, ''),
      description: plainDescription,
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const imageUrl = post._embedded?.['wp:featuredmedia']?.[0]?.source_url;
  const authorName = post._embedded?.author?.[0]?.name || 'WholesalerJi Editorial';
  let category = post._embedded?.['wp:term']?.[0]?.[0]?.name;
  if (!category || category.toLowerCase() === 'uncategorized') category = '';
  const date = new Date(post.date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const plainDescription = post.excerpt.rendered.replace(/<[^>]+>/g, '').trim();
  const plainTitle = post.title.rendered.replace(/<[^>]+>/g, '');

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: plainTitle,
    description: plainDescription,
    image: imageUrl ? [imageUrl] : [],
    datePublished: post.date,
    dateModified: post.modified,
    author: [{
      '@type': 'Person',
      name: authorName,
    }],
    publisher: {
      '@type': 'Organization',
      name: 'WholesalerJi',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://wholesalerji.com/blog/${post.slug}`,
    },
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col selection:bg-amber-500 selection:text-stone-950 transition-colors">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar currentPath="/blog" />
      
      <main className="flex-1 flex flex-col pt-10 pb-20 relative overflow-hidden">
        
        {/* Ambient Warm Lights */}
        <div className="fixed top-1/4 left-0 w-[500px] h-[500px] bg-amber-500/20 dark:bg-amber-500/10 rounded-full blur-[100px] -translate-x-1/2 pointer-events-none z-0" />
        <div className="fixed top-1/4 right-0 w-[500px] h-[500px] bg-amber-500/20 dark:bg-amber-500/10 rounded-full blur-[100px] translate-x-1/2 pointer-events-none z-0" />

        <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-24 pt-8 relative z-10 mb-8">
          <Link href="/blog" className="text-sm font-semibold text-amber-500 hover:text-amber-600 transition-colors inline-flex items-center gap-2">
            <span>←</span> Back to Knowledge Hub
          </Link>
        </div>

        <article className="max-w-4xl mx-auto w-full px-4 sm:px-8 lg:px-12 relative z-10">
          
          <div className="mb-8">
            {category && (
              <span className="uppercase tracking-widest text-amber-600 dark:text-amber-400 text-sm font-bold block mb-4">
                {category}
              </span>
            )}
            <h1 
              className="text-3xl md:text-4xl lg:text-5xl font-black text-stone-900 dark:text-white tracking-tight leading-tight mb-6"
              dangerouslySetInnerHTML={{ __html: post.title.rendered }}
            />
            <div className="flex items-center gap-2 text-sm font-medium text-stone-500 mb-8">
              <time>{date}</time>
              <span>•</span>
              <span>WholesalerJi Expert</span>
            </div>
          </div>

          {imageUrl && (
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden mb-12 shadow-xl bg-stone-200 dark:bg-stone-900">
              <Image
                src={imageUrl}
                alt={plainTitle}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 896px"
                className="object-cover"
              />
            </div>
          )}

          <div className="prose prose-lg md:prose-xl prose-stone dark:prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-amber-600 dark:prose-a:text-amber-500 hover:prose-a:text-amber-500 prose-img:rounded-xl prose-img:w-full prose-img:object-cover">
            {/* 
              Render sanitized WordPress content.
              Global CSS handles styling via Tailwind typography plugin (prose).
            */}
            <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content.rendered, { ADD_ATTR: ['target'] }) }} />
          </div>

        </article>

        <section className="max-w-4xl mx-auto w-full px-4 sm:px-8 lg:px-12 mt-20 pt-12 border-t border-stone-200 dark:border-stone-800 text-center">
          <h3 className="text-2xl font-bold mb-6">Need architectural panels for your next project?</h3>
          <Link
            href="/wall-panels"
            className="inline-block px-8 py-4 rounded-full bg-amber-500 text-stone-950 font-bold text-sm hover:bg-amber-400 transition-colors shadow-lg"
          >
            Explore Master Catalog
          </Link>
        </section>
      </main>
    </div>
  );
}
