import dns from 'dns';

try {
  dns.setDefaultResultOrder('ipv4first');
} catch {}

const WP_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://blog.wholesalerji.com';
const API_URL = `${WP_URL}/wp-json/wp/v2`;

export function normalizeWordPressImageUrl(url: string | undefined | null): string {
  if (!url) return '';
  return url.replace(/https?:\/\/blog\.goalsfloors\.com/gi, 'https://blog.wholesalerji.com');
}

export async function getPosts(page = 1, perPage = 9) {
  try {
    const res = await fetch(`${API_URL}/posts?_embed&page=${page}&per_page=${perPage}`, {
      cache: 'no-store',
    });
    
    if (!res.ok) {
      if (res.status === 400 || res.status === 404) return { posts: [], totalPages: 0 };
      throw new Error(`Failed to fetch posts: ${res.status}`);
    }
    
    const totalPages = parseInt(res.headers.get('x-wp-totalpages') || '0', 10);
    const posts = await res.json();
    return { posts, totalPages };
  } catch (error) {
    console.error('Error fetching WP posts:', error);
    return { posts: [], totalPages: 0 };
  }
}

export async function getPostBySlug(slug: string) {
  try {
    const res = await fetch(`${API_URL}/posts?slug=${slug}&_embed`, {
      cache: 'no-store',
    });
    
    if (!res.ok) throw new Error(`Failed to fetch post: ${res.status}`);
    
    const posts = await res.json();
    return posts.length > 0 ? posts[0] : null;
  } catch (error) {
    console.error('Error fetching WP post by slug:', error);
    return null;
  }
}

export async function getCategories() {
  try {
    const res = await fetch(`${API_URL}/categories?hide_empty=true`, {
      cache: 'no-store',
    });
    
    if (!res.ok) throw new Error(`Failed to fetch categories: ${res.status}`);
    
    return await res.json();
  } catch (error) {
    console.error('Error fetching WP categories:', error);
    return [];
  }
}
