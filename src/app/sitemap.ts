import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://wholesalerji.com';

  const staticRoutes = [
    '',
    '/about',
    '/contact',
    '/blog',
    '/wall-panels',
    '/wall-panels-gallery',
    '/artificial-grass',
    '/spc-flooring',
    '/wall-panels/primo',
    '/wall-panels/elite',
    '/wall-panels/primo-fluted',
    '/wall-panels/elite-fluted',
  ];

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency:
      route === '' ||
      route === '/wall-panels' ||
      route === '/wall-panels-gallery' ||
      route === '/artificial-grass' ||
      route === '/spc-flooring'
        ? 'weekly'
        : 'monthly',
    priority:
      route === ''
        ? 1.0
        : route === '/wall-panels' ||
          route === '/wall-panels-gallery' ||
          route === '/artificial-grass' ||
          route === '/spc-flooring'
        ? 0.9
        : 0.8,
  }));

  // Dynamically fetch and include WordPress blog posts
  try {
    const wpUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://blog.wholesalerji.com';
    const res = await fetch(`${wpUrl}/wp-json/wp/v2/posts?per_page=100&_fields=slug,modified`, {
      next: { revalidate: 3600 },
    });

    if (res.ok) {
      const posts: Array<{ slug: string; modified: string }> = await res.json();
      if (Array.isArray(posts)) {
        const blogEntries: MetadataRoute.Sitemap = posts.map((post) => ({
          url: `${baseUrl}/blog/${post.slug}`,
          lastModified: post.modified ? new Date(post.modified) : new Date(),
          changeFrequency: 'weekly',
          priority: 0.8,
        }));
        return [...staticEntries, ...blogEntries];
      }
    }
  } catch (error) {
    console.error('Error fetching blog posts for sitemap:', error);
  }

  return staticEntries;
}
