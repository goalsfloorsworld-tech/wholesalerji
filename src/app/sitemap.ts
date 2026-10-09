import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://wholesalerji.com';

  const routes = [
    '',
    '/about',
    '/contact',
    '/blog',
    '/wall-panels',
    '/wall-panels/primo',
    '/wall-panels/elite',
    '/wall-panels/primo-fluted',
    '/wall-panels/elite-fluted',
    '/wall-panels/wpc',
    '/wall-panels/pvc',
    '/wall-panels/charcoal',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' || route === '/wall-panels' ? 'weekly' : 'monthly',
    priority: route === '' ? 1.0 : route === '/wall-panels' ? 0.9 : 0.8,
  }));
}
