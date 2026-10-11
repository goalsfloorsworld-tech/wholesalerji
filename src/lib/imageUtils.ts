/**
 * Domain-branded image URL utilities for WholesalerJi
 * 
 * Proxies Cloudinary assets through /images/<account>/... transparently via Next.js rewrites.
 * Ensures consistent f_auto,q_auto formatting and byte-identical URLs across all page placements
 * (gallery grid, product showcase, lightbox modal, preloader) for 100% browser caching.
 */

export function toBrandedImageUrl(url: string | undefined | null): string {
  if (!url) return '';

  // If already relative
  if (url.startsWith('/')) {
    if (url.startsWith('/images/')) {
      const parts = url.split('/');
      // Format: /images/:account/:rest
      if (parts.length >= 4 && !url.includes('f_auto') && !url.includes('q_auto')) {
        parts.splice(3, 0, 'f_auto,q_auto');
        return parts.join('/');
      }
    }
    return url;
  }

  // Handle Cloudinary URLs
  if (url.includes('res.cloudinary.com')) {
    try {
      const parsed = new URL(url);
      const parts = parsed.pathname.split('/').filter(Boolean);
      const uploadIdx = parts.indexOf('upload');

      if (uploadIdx !== -1 && uploadIdx > 0) {
        const account = parts[0];
        let rest = parts.slice(uploadIdx + 1);

        const hasTransforms = rest.length > 0 && (
          rest[0].includes('f_auto') ||
          rest[0].includes('q_auto') ||
          rest[0].includes(',') ||
          rest[0].startsWith('w_') ||
          rest[0].startsWith('c_')
        );

        if (!hasTransforms) {
          rest = ['f_auto,q_auto', ...rest];
        } else if (!rest[0].includes('f_auto') || !rest[0].includes('q_auto')) {
          rest[0] = 'f_auto,q_auto';
        }

        return `/images/${account}/${rest.join('/')}`;
      }
    } catch {
      return url;
    }
  }

  return url;
}

/**
 * Returns absolute URL for OpenGraph, Twitter Cards, and schema.org JSON-LD
 */
export function toAbsoluteImageUrl(url: string | undefined | null, baseUrl = 'https://wholesalerji.com'): string {
  const branded = toBrandedImageUrl(url);
  if (!branded) return '';
  if (branded.startsWith('http://') || branded.startsWith('https://')) return branded;
  return `${baseUrl}${branded.startsWith('/') ? '' : '/'}${branded}`;
}
