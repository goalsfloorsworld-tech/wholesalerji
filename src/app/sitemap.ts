import { MetadataRoute } from 'next';
import dns from 'dns';
import { normalizeWordPressImageUrl } from '@/lib/wordpress';

try {
  dns.setDefaultResultOrder('ipv4first');
} catch {}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://wholesalerji.com';

  const PAGE_IMAGES: Record<string, string[]> = {
    '': [
      `${baseUrl}/images/dcezlxt8r/f_auto,q_auto/v1772477069/Imageclad_Premium_Wpc_Louvers.png`,
      `${baseUrl}/images/def2qsxjg/f_auto,q_auto/v1790908763/GF-401_installed_image_in_hall.png`,
      `${baseUrl}/images/def2qsxjg/f_auto,q_auto/v1790929841/FP-702_installed_image_in_room.jpg`,
      `${baseUrl}/images/dcezlxt8r/f_auto,q_auto/Fluted_Panel_FP_-_714.png`,
      `${baseUrl}/assets/home-image.jpg`,
    ],
    '/about': [
      `${baseUrl}/images/def2qsxjg/f_auto,q_auto/v1791631443/Umesh_Kumar.jpg`,
      `${baseUrl}/images/def2qsxjg/f_auto,q_auto/v1791647297/shakti_ftn_ceo_of_goalsfloors_and_wholesalerji.png`,
    ],
    '/contact': [
      `${baseUrl}/assets/wholesalerji-logo.jpeg`,
    ],
    '/blog': [
      'https://blog.wholesalerji.com/wp-content/uploads/2026/11/01-featured-fluted-tv-wall.jpg',
    ],
    '/wall-panels': [
      `${baseUrl}/images/dcezlxt8r/f_auto,q_auto/v1776780203/Primo_GF-301_Pvc_Panel_Goals_Floors.png`,
      `${baseUrl}/images/dcezlxt8r/f_auto,q_auto/v1776777064/GF-401_Premium_Pvc_Panel_In_Gurgaon.png`,
    ],
    '/wall-panels/primo': [
      `${baseUrl}/images/dcezlxt8r/f_auto,q_auto/v1776780203/Primo_GF-301_Pvc_Panel_Goals_Floors.png`,
      `${baseUrl}/images/def2qsxjg/f_auto,q_auto/v1790874178/Primo_GF-301_Pvc_Panel_Goals_Floors_installed_image_in_waiting_area.jpg`,
      `${baseUrl}/images/def2qsxjg/f_auto,q_auto/v1790874187/GF-302_Premium_Pvc_Panel_Primo_Series_in_living_room.jpg`,
      `${baseUrl}/images/def2qsxjg/f_auto,q_auto/v1790874254/GF-303_Grey_Color_Pvc_Panel_installed_image_in_tv_unit_area.jpg`,
    ],
    '/wall-panels/elite': [
      `${baseUrl}/images/dcezlxt8r/f_auto,q_auto/v1776777064/GF-401_Premium_Pvc_Panel_In_Gurgaon.png`,
      `${baseUrl}/images/def2qsxjg/f_auto,q_auto/v1790908763/GF-401_installed_image_in_hall.png`,
      `${baseUrl}/images/def2qsxjg/f_auto,q_auto/v1790908759/GF-402_Black_Marble_installed_image_in_bathroom.jpg`,
      `${baseUrl}/images/def2qsxjg/f_auto,q_auto/v1790908763/GF-403_White_Marble_installed_image_in_bedroom.jpg`,
    ],
    '/wall-panels/primo-fluted': [
      `${baseUrl}/images/dcezlxt8r/f_auto,q_auto/Fluted_Panel_FP_-_701.png`,
      `${baseUrl}/images/def2qsxjg/f_auto,q_auto/v1790929841/FP-702_installed_image_in_room.jpg`,
      `${baseUrl}/images/def2qsxjg/f_auto,q_auto/v1790929841/FP-703_installed_image_in_dining.jpg`,
      `${baseUrl}/images/def2qsxjg/f_auto,q_auto/v1790929843/FP-704_installed_image_in_drawing_room.jpg`,
    ],
    '/wall-panels/elite-fluted': [
      `${baseUrl}/images/dcezlxt8r/f_auto,q_auto/Fluted_Panel_FP_-_714.png`,
      `${baseUrl}/images/def2qsxjg/f_auto,q_auto/v1793531236/FP-714_Modern_Reception_Lobby_with_Vertical_Wood_Panelling.jpg`,
      `${baseUrl}/images/def2qsxjg/f_auto,q_auto/v1793530969/Fluted_Panel_FP_-_715.jpg`,
      `${baseUrl}/images/def2qsxjg/f_auto,q_auto/v1793531239/FP-716_Warm_Modern_Entrance_with_Fluted_Panels.jpg`,
    ],
    '/wall-panels-gallery': [
      `${baseUrl}/images/def2qsxjg/f_auto,q_auto/v1790874178/Primo_GF-301_Pvc_Panel_Goals_Floors_installed_image_in_waiting_area.jpg`,
      `${baseUrl}/images/def2qsxjg/f_auto,q_auto/v1790908763/GF-401_installed_image_in_hall.png`,
      `${baseUrl}/images/def2qsxjg/f_auto,q_auto/v1790929841/FP-702_installed_image_in_room.jpg`,
      `${baseUrl}/images/def2qsxjg/f_auto,q_auto/v1793531236/FP-714_Modern_Reception_Lobby_with_Vertical_Wood_Panelling.jpg`,
    ],
    '/artificial-grass': [
      `${baseUrl}/images/dcezlxt8r/f_auto,q_auto/v1787308036/35mm_Artificial_Grass.png`,
      `${baseUrl}/images/dcezlxt8r/f_auto,q_auto/v1787308037/40mm_Artificial_Grass.png`,
      `${baseUrl}/images/def2qsxjg/f_auto,q_auto/v1792835887/leaf_grass_at_balcony.jpg`,
      `${baseUrl}/images/def2qsxjg/f_auto,q_auto/v1792835887/balcony_after_turf.jpg`,
    ],
    '/spc-flooring': [
      `${baseUrl}/images/def2qsxjg/f_auto,q_auto/v1792831449/spc_layers_diagram.jpg`,
      `${baseUrl}/images/dcezlxt8r/f_auto,q_auto/v1775452465/G-F_SPC_295.jpg`,
      `${baseUrl}/images/def2qsxjg/f_auto,q_auto/v1792831101/spc-flooring-295-natural-warm-oak-installed-wholesalerji-gurgaon.jpg`,
      `${baseUrl}/images/def2qsxjg/f_auto,q_auto/v1792831480/spc_installed_home.jpg`,
    ],
  };

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
    images: PAGE_IMAGES[route] || [],
  }));

  // Verified published posts fallback in case WordPress API experiences network timeouts during build
  const FALLBACK_BLOG_POSTS = [
    {
      slug: 'wall-panels-wholesale-india-price-types-buying-guide',
      modified: '2026-11-08T06:59:18',
      image: 'https://blog.wholesalerji.com/wp-content/uploads/2026/11/01-featured-fluted-tv-wall.jpg',
    },
  ];

  // Dynamically fetch and include WordPress blog posts with featured images
  try {
    const wpUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://blog.wholesalerji.com';
    const res = await fetch(`${wpUrl}/wp-json/wp/v2/posts?per_page=100&_embed=wp:featuredmedia&_fields=slug,modified,_links,_embedded`, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(12000),
    });

    if (res.ok) {
      const posts: any[] = await res.json();
      if (Array.isArray(posts) && posts.length > 0) {
        const blogEntries: MetadataRoute.Sitemap = posts.map((post) => {
          const rawFeatured = post._embedded?.['wp:featuredmedia']?.[0]?.source_url;
          const featuredImage = normalizeWordPressImageUrl(rawFeatured);
          return {
            url: `${baseUrl}/blog/${post.slug}`,
            lastModified: post.modified ? new Date(post.modified) : new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
            images: featuredImage ? [featuredImage] : [],
          };
        });
        return [...staticEntries, ...blogEntries];
      }
    }
  } catch (error) {
    console.error('Error fetching blog posts for sitemap, using published fallback:', error);
  }

  // Graceful fallback to guarantee published articles are never omitted from sitemap
  const fallbackBlogEntries: MetadataRoute.Sitemap = FALLBACK_BLOG_POSTS.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.modified),
    changeFrequency: 'weekly',
    priority: 0.8,
    images: post.image ? [post.image] : [],
  }));

  return [...staticEntries, ...fallbackBlogEntries];
}
