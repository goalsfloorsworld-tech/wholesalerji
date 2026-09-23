# Wholesaleji — Production-Ready PRD & Technical Blueprint

> **Version**: 1.0 · **Date**: 2026-08-29  
> **Stack**: Next.js 15 (App Router) · GSAP + ScrollTrigger · Lenis · Tailwind CSS v4 · Cloudinary · Sanity v3  
> **Target**: Vercel Edge · Sub-2s LCP · 95+ Lighthouse

---

## 1. Executive Summary & Core Objectives

### 1.1 Product Vision

Wholesaleji is a **single-niche B2B e-commerce platform** exclusively for Wall Panels. It replaces the typical boring product-grid catalog with an **immersive, scroll-driven 3D doorway experience** that transitions users through curated "rooms" showcasing wall panel textures, before funneling them into a high-performance B2B catalog and lead-generation pipeline.

### 1.2 Core Objectives

| Objective | Target Metric | Strategy |
|-----------|--------------|----------|
| **Performance** | LCP < 2.0s, CLS < 0.1, INP < 200ms, TBT < 200ms | GSAP lazy-loading, Server Components, Cloudinary CDN |
| **SEO** | Page 1 for 50+ long-tail "wall panel" keywords within 6 months | Programmatic SEO pillar pages, SSR metadata, Schema.org |
| **Conversion** | 8%+ inquiry-to-lead rate | Progressive disclosure funnel, WhatsApp CTA, sticky RFQ |
| **Engagement** | Avg. session duration > 3 min | Doorway scroll effect, texture zoom, room visualizer |

### 1.3 The Animation ↔ Performance Tension — Resolved

The central architectural challenge: **GSAP ScrollTrigger animations are inherently main-thread-bound**. Heavy DOM scaling (the "doorway effect") will compete with rendering, painting, and React hydration. Here is the exact resolution strategy:

```
┌─────────────────────────────────────────────────────────────────┐
│                    PERFORMANCE ARCHITECTURE                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Server (RSC) ──► Static HTML shell + SEO metadata              │
│       │           (zero JS shipped for catalog/product pages)   │
│       ▼                                                         │
│  Client Boundary ──► GSAP + Lenis loaded ONLY on homepage      │
│       │               via dynamic import() with ssr: false      │
│       ▼                                                         │
│  Animation Budget:                                              │
│    - Doorway section: max 3 scaled <div>s, CSS will-change      │
│    - Text reveals: CSS-only clip-path with GSAP orchestration   │
│    - Texture transitions: Cloudinary f_auto,q_auto srcsets      │
│    - All transforms use GPU-accelerated properties ONLY         │
│      (transform, opacity — NEVER top/left/width/height)         │
│       │                                                         │
│       ▼                                                         │
│  Idle Callback Strategy:                                        │
│    - GSAP.registerPlugin(ScrollTrigger) inside                  │
│      requestIdleCallback() or after LCP fires                   │
│    - Lenis RAF loop uses a single rAF, piped into GSAP ticker   │
│    - ScrollTrigger.config({ ignoreMobileResize: true })         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Key architectural decisions:**

1. **GSAP is loaded ONLY on the homepage** via `next/dynamic` with `ssr: false`. All other pages (catalog, product detail, contact) are pure Server Components with zero animation JS.
2. **Lenis and GSAP share a single `requestAnimationFrame` loop** — Lenis provides the smooth scroll value, GSAP's ticker consumes it. No dual-rAF tax.
3. **`will-change: transform`** is applied to doorway elements **only during the active scroll phase** and removed after, preventing layer promotion bloat.
4. **All doorway textures are preloaded** via `<link rel="preload" as="image" fetchpriority="high">` for the first room, and `fetchpriority="low"` for subsequent rooms.
5. **TBT mitigation**: GSAP initialization is deferred via `requestIdleCallback` or a `PerformanceObserver` that waits for LCP to fire before bootstrapping animations.

---

## 2. Advanced SEO & Performance Architecture

### 2.1 Cloudinary Image Pipeline

Every image in the system flows through Cloudinary's transformation API. No raw images are ever served.

**Cloudinary URL Pattern:**
```
https://res.cloudinary.com/wholesaleji/image/upload/
  f_auto,          ← auto-negotiate WebP/AVIF based on Accept header
  q_auto:good,     ← perceptual quality optimization
  w_{breakpoint},  ← responsive width (320/640/768/1024/1440/1920)
  c_fill,          ← fill crop for consistent aspect ratios
  g_auto,          ← AI-driven gravity for focal point
  dpr_auto         ← device pixel ratio awareness
/v1/wall-panels/{category}/{sku}.jpg
```

**Next.js Integration — Custom Cloudinary Loader:**

```typescript
// lib/cloudinary-loader.ts
export default function cloudinaryLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) {
  const params = [
    'f_auto',
    'c_fill',
    'g_auto',
    `w_${width}`,
    `q_${quality || 'auto:good'}`,
    'dpr_auto',
  ];
  return `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD}/image/upload/${params.join(',')}/${src}`;
}
```

```typescript
// next.config.ts
const nextConfig = {
  images: {
    loader: 'custom',
    loaderFile: './lib/cloudinary-loader.ts',
    deviceSizes: [640, 768, 1024, 1280, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/avif', 'image/webp'],
  },
};
```

**Doorway Texture Strategy:**
- Room 1 hero texture: `fetchpriority="high"`, `loading="eager"`, preloaded in `<head>`
- Room 2–4 textures: `loading="lazy"`, fetched as user scrolls into 80% of Room 1
- Texture dimensions: 1920×1080 max, compressed to ~80KB via Cloudinary `q_auto:eco` for mobile

### 2.2 Dynamic Schema.org Markup

All structured data is injected server-side via RSC `<script type="application/ld+json">`.

**Organization Schema** (on every page via root layout):
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Wholesaleji",
  "url": "https://wholesaleji.com",
  "logo": "https://res.cloudinary.com/wholesaleji/image/upload/f_auto/v1/brand/logo.png",
  "description": "India's premium B2B marketplace for wall panels — WPC, PVC, charcoal, and louver panels at wholesale prices.",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+91-XXXXXXXXXX",
    "contactType": "sales",
    "availableLanguage": ["English", "Hindi"]
  },
  "sameAs": [
    "https://www.instagram.com/wholesaleji",
    "https://www.youtube.com/@wholesaleji"
  ]
}
```

**Product Schema** (on each `/products/[slug]` page):
```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Premium WPC Fluted Wall Panel — Teak Wood",
  "image": ["cloudinary_url_1", "cloudinary_url_2"],
  "description": "...",
  "sku": "WPC-FLT-TWD-001",
  "brand": { "@type": "Brand", "name": "Wholesaleji" },
  "material": "Wood Polymer Composite (WPC)",
  "width": { "@type": "QuantitativeValue", "value": 290, "unitCode": "MMT" },
  "height": { "@type": "QuantitativeValue", "value": 3000, "unitCode": "MMT" },
  "offers": {
    "@type": "AggregateOffer",
    "priceCurrency": "INR",
    "lowPrice": 45,
    "highPrice": 120,
    "offerCount": 3,
    "availability": "https://schema.org/InStock",
    "priceSpecification": [
      {
        "@type": "UnitPriceSpecification",
        "price": 85,
        "priceCurrency": "INR",
        "unitText": "per sq ft",
        "eligibleQuantity": {
          "@type": "QuantitativeValue",
          "minValue": 500,
          "unitText": "sq ft"
        }
      }
    ]
  }
}
```

**BreadcrumbList Schema** (on all nested pages):
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://wholesaleji.com" },
    { "@type": "ListItem", "position": 2, "name": "WPC Wall Panels", "item": "https://wholesaleji.com/wall-panels/wpc" },
    { "@type": "ListItem", "position": 3, "name": "Fluted Panels", "item": "https://wholesaleji.com/wall-panels/wpc/fluted" }
  ]
}
```

**FAQ Schema** (on pillar pages):
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is the price of WPC wall panels per sq ft?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "WPC wall panel prices range from ₹45 to ₹120 per sq ft depending on thickness, finish, and order quantity."
      }
    }
  ]
}
```

### 2.3 SSR & Metadata Strategy

**Per-route metadata generation (App Router):**

```typescript
// app/products/[slug]/page.tsx
import { Metadata } from 'next';
import { getProduct } from '@/lib/sanity/queries';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProduct(params.slug);
  return {
    title: `${product.name} | Buy Wholesale Wall Panels — Wholesaleji`,
    description: `Buy ${product.name} at ₹${product.bulkPricing[0].pricePerUnit}/sq ft. ${product.material} wall panel, ${product.thickness}mm thick. MOQ: ${product.moq} sq ft. Free shipping on bulk orders.`,
    alternates: {
      canonical: `https://wholesaleji.com/products/${params.slug}`,
    },
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      images: [{ url: product.images[0].cloudinaryUrl, width: 1200, height: 630 }],
      type: 'website',
    },
    robots: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  };
}
```

**Static Generation for catalog pages:**
```typescript
// app/wall-panels/[material]/page.tsx
export async function generateStaticParams() {
  const materials = await getAllMaterials(); // ['wpc', 'pvc', 'charcoal', 'louver', 'acrylic']
  return materials.map((m) => ({ material: m.slug }));
}
```

### 2.4 GSAP ↔ Main Thread Safety

| Concern | Mitigation |
|---------|-----------|
| **GSAP blocks main thread during init** | Wrap `gsap.registerPlugin(ScrollTrigger)` inside `requestIdleCallback()`. If browser doesn't support it, use `setTimeout(fn, 0)` after LCP. |
| **ScrollTrigger recalculates on every resize** | `ScrollTrigger.config({ ignoreMobileResize: true })`. Debounce desktop resize recalcs to 250ms. |
| **Lenis + GSAP dual rAF** | Pipe Lenis into GSAP ticker: `lenis.on('scroll', ScrollTrigger.update)` and `gsap.ticker.add((time) => lenis.raf(time * 1000))`. Single rAF loop. |
| **Large DOM scaling triggers layout thrash** | Use `transform: scale()` exclusively. Never animate `width`/`height`. Apply `will-change: transform` only during active scroll range, remove after via `onLeave`. |
| **TBT spike from hydration + GSAP** | Homepage hero is a Server Component shell. Client boundary wraps only the GSAP orchestrator. Hydration of the animation layer is deferred via `next/dynamic` with `ssr: false`. |
| **CLS from late-loading animations** | Reserve exact viewport dimensions with CSS `aspect-ratio` and `min-height: 100svh` on doorway sections before GSAP initializes. |

### 2.5 Additional SEO Infrastructure

- **`sitemap.xml`**: Generated dynamically via `app/sitemap.ts` pulling all product slugs and pillar page slugs from Sanity at build time.
- **`robots.txt`**: Via `app/robots.ts` — allows all crawlers, disallows `/api/*`, `/studio/*`.
- **Internal linking**: Every product page links to its parent material page and 3 related products. Every pillar page links to child products.
- **Canonical URLs**: Explicitly set on every page to prevent Cloudinary URL indexing.
- **`next/font`**: Self-hosted Google Fonts (Inter for body, Outfit for headings) via `next/font/google` with `display: swap` and `preload: true`.

---

## 3. Granular User Flow & UX Storyboard

### 3.1 The Doorway Scroll Journey — Frame by Frame

The homepage is divided into **two macro-sections**: the **Immersive Experience** (0–60% of total scroll) and the **B2B Catalog Funnel** (60–100%).

```
VIEWPORT SCROLL MAP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
0%    ┃ HERO — Brand reveal + "Scroll to Enter" CTA
      ┃   • Logo fades in (opacity 0→1, 400ms ease)
      ┃   • Tagline: "India's Premium Wall Panel Marketplace"
      ┃   • Subtle particle/grain overlay on hero texture
      ┃   • Lenis smooth scroll initializes
      ┃   • Mouse-follow parallax on hero image (±15px)
━━━━━━┃━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
5%    ┃ DOORWAY APPEARS
      ┃   • A rectangular "door frame" element (CSS border
      ┃     with rounded corners) fades in at center
      ┃   • scale(0.3) → user sees a small doorway shape
      ┃   • Behind the doorway: Room 1 texture (WPC Fluted)
      ┃   • Text floats beside doorway: "Step Inside"
━━━━━━┃━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
5–25% ┃ DOORWAY TRANSITION — ROOM 1
      ┃   • ScrollTrigger pins the section
      ┃   • Doorway scales from scale(0.3) → scale(8)
      ┃   • At scale(~2), doorway edges exit viewport
      ┃   • User perceives "entering" the room
      ┃   • Room 1 texture (full-bleed WPC panel close-up)
      ┃     becomes the background
      ┃   • Text animates in (clip-path reveal, left→right):
      ┃     "WPC Fluted Panels"
      ┃     "• Waterproof  • Termite-proof  • 8mm–12mm"
      ┃   • Product spec card slides in from right
━━━━━━┃━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
25–30%┃ ROOM 1 → ROOM 2 TRANSITION
      ┃   • Room 1 background opacity fades to 0
      ┃   • A new doorway appears (scale 0.3 again)
      ┃   • Behind it: Room 2 texture (PVC Marble Panel)
      ┃   • Doorway scales up again (same mechanic)
━━━━━━┃━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
30–45%┃ DOORWAY TRANSITION — ROOM 2
      ┃   • Same scale(0.3→8) doorway expansion
      ┃   • Room 2: PVC Marble finish, full-bleed
      ┃   • Text: "PVC Marble Panels"
      ┃   • USP bullets animate in staggered:
      ┃     "• UV Resistant  • Easy Install  • ₹35/sq ft"
      ┃   • Floating "Request Quote" micro-CTA
━━━━━━┃━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
45–55%┃ DOORWAY TRANSITION — ROOM 3 (WHY CHOOSE US)
      ┃   • Third doorway → abstract brand-color gradient room
      ┃   • No product texture — brand storytelling section
      ┃   • Large text reveal: "Why Choose Wholesaleji?"
      ┃   • Animated counter stats:
      ┃     "500+ Dealers  •  12 States  •  2M+ sq ft Sold"
      ┃   • Trust badges (ISO, IGBC, etc.) fade in
      ┃   • Testimonial card carousel (CSS scroll-snap)
━━━━━━┃━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
55–60%┃ THE EXIT — EXPERIENCE → CATALOG TRANSITION
      ┃   • Final room background dissolves downward
      ┃   • A horizontal divider line draws across (SVG stroke
      ┃     animation, dashoffset)
      ┃   • Text: "Explore Our Full Collection ↓"
      ┃   • ScrollTrigger unpin — natural scroll resumes
      ┃   • Lenis smooth scroll continues seamlessly
━━━━━━┃━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
60–75%┃ B2B CATALOG SECTION
      ┃   • Server-rendered product grid (no client JS)
      ┃   • Filterable by: Material, Thickness, Finish, Price
      ┃   • Each card: Cloudinary optimized image, name,
      ┃     price range, "View Details" + "Quick RFQ"
      ┃   • Intersection Observer for staggered fade-in
      ┃     (CSS animation, NOT GSAP — no JS dependency)
      ┃   • Pagination via URL params (?page=2) for SEO
━━━━━━┃━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
75–85%┃ LEAD GENERATION FUNNEL
      ┃   • "Get Bulk Pricing" form (Server Action submission)
      ┃   • Fields: Name, Business Name, City, Phone,
      ┃     Quantity (sq ft), Preferred Material
      ┃   • WhatsApp direct CTA: pre-filled message
      ┃   • "Download Catalog PDF" (gated behind email)
━━━━━━┃━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
85–95%┃ SOCIAL PROOF & CONTENT
      ┃   • Project gallery (completed installations)
      ┃   • Video testimonials (YouTube embeds, lazy)
      ┃   • Blog preview cards (3 latest articles)
━━━━━━┃━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
95–100%┃ FOOTER
       ┃   • Mega footer: All category links, contact,
       ┃     social, legal, newsletter signup
       ┃   • Embedded Google Map (lazy iframe)
━━━━━━━┃━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 3.2 Mobile Adaptation

On viewports < 768px, the doorway effect is **replaced** with a simplified vertical swipe experience:
- No DOM scaling (too janky on mobile GPUs)
- Instead: **CSS scroll-snap sections** with crossfade transitions between rooms
- Text reveals use `@keyframes` CSS animations triggered by `IntersectionObserver` (zero GSAP on mobile)
- The catalog section is identical (already responsive grid)

### 3.3 Navigation Flow

```mermaid
graph TD
    A[Homepage - Immersive Experience] -->|Scroll past rooms| B[B2B Catalog Grid]
    A -->|Navbar click| C[/wall-panels/wpc]
    A -->|Navbar click| D[/wall-panels/pvc]
    B -->|Click product card| E[/products/wpc-fluted-teak-001]
    E -->|Quick RFQ| F[/contact?product=wpc-fluted-teak-001]
    E -->|Related products| G[/products/wpc-fluted-walnut-002]
    C -->|Sub-filter| H[/wall-panels/wpc/fluted]
    C -->|Sub-filter| I[/wall-panels/wpc/louver]
    F -->|Submit| J[Thank You + WhatsApp redirect]
```

---

## 4. Comprehensive Sitemap & Routing

### 4.1 Complete URL Architecture

```
wholesaleji.com/
├── /                                    ← Homepage (immersive + catalog)
│
├── /wall-panels/                        ← All wall panels (pillar page)
│   ├── /wall-panels/wpc/               ← WPC panels (pillar page)
│   │   ├── /wall-panels/wpc/fluted/    ← WPC Fluted (sub-pillar)
│   │   ├── /wall-panels/wpc/louver/    ← WPC Louver
│   │   └── /wall-panels/wpc/charcoal/  ← WPC Charcoal
│   ├── /wall-panels/pvc/               ← PVC panels
│   │   ├── /wall-panels/pvc/marble/
│   │   ├── /wall-panels/pvc/wood-grain/
│   │   └── /wall-panels/pvc/solid/
│   ├── /wall-panels/acrylic/           ← Acrylic panels
│   ├── /wall-panels/stone-veneer/      ← Stone veneer panels
│   └── /wall-panels/3d-textured/       ← 3D textured panels
│
├── /wall-panels-for/                    ← Application-based pillar pages
│   ├── /wall-panels-for/bedroom/
│   ├── /wall-panels-for/living-room/
│   ├── /wall-panels-for/office/
│   ├── /wall-panels-for/hotel-lobby/
│   ├── /wall-panels-for/restaurant/
│   ├── /wall-panels-for/exterior/
│   └── /wall-panels-for/bathroom/
│
├── /products/
│   └── /products/[slug]/               ← Individual product pages (SSG)
│
├── /bulk-pricing/                       ← Bulk pricing calculator + RFQ
├── /become-a-dealer/                    ← Dealer registration form
├── /contact/                            ← Contact + multi-step lead form
├── /about/                              ← Company story + trust signals
│
├── /blog/                               ← SEO content hub
│   └── /blog/[slug]/                   ← Individual blog posts
│
├── /projects/                           ← Completed project gallery
│   └── /projects/[slug]/               ← Individual project case study
│
├── /faq/                                ← FAQ page (Schema.org FAQPage)
├── /privacy-policy/
├── /terms-and-conditions/
├── /sitemap.xml                         ← Dynamic sitemap
└── /robots.txt                          ← Crawler directives
```

### 4.2 Next.js App Router File Structure

```
app/
├── layout.tsx                    ← Root layout (RSC: fonts, analytics, org schema)
├── page.tsx                      ← Homepage (RSC shell + client doorway)
├── sitemap.ts                    ← Dynamic sitemap generation
├── robots.ts                     ← Robots.txt generation
├── not-found.tsx                 ← Custom 404
├── error.tsx                     ← Global error boundary
│
├── wall-panels/
│   ├── page.tsx                  ← /wall-panels (pillar page, RSC)
│   └── [material]/
│       ├── page.tsx              ← /wall-panels/[material] (RSC)
│       └── [subcategory]/
│           └── page.tsx          ← /wall-panels/[material]/[subcategory] (RSC)
│
├── wall-panels-for/
│   └── [application]/
│       └── page.tsx              ← /wall-panels-for/[application] (RSC)
│
├── products/
│   └── [slug]/
│       └── page.tsx              ← Product detail page (RSC)
│
├── bulk-pricing/
│   └── page.tsx
├── become-a-dealer/
│   └── page.tsx
├── contact/
│   └── page.tsx
├── about/
│   └── page.tsx
├── blog/
│   ├── page.tsx
│   └── [slug]/
│       └── page.tsx
├── projects/
│   ├── page.tsx
│   └── [slug]/
│       └── page.tsx
├── faq/
│   └── page.tsx
├── privacy-policy/
│   └── page.tsx
├── terms-and-conditions/
│   └── page.tsx
│
└── api/
    ├── revalidate/
    │   └── route.ts              ← Sanity webhook → ISR revalidation
    └── lead/
        └── route.ts              ← Lead submission API (→ CRM/email)
```

### 4.3 Programmatic SEO Pillar Pages

Each material page (`/wall-panels/wpc/`) and application page (`/wall-panels-for/bedroom/`) is a **programmatic SEO pillar page** that:

1. Auto-generates `<title>` and `<meta description>` from Sanity CMS fields
2. Renders an H1 like "WPC Wall Panels — Buy Wholesale at ₹45–₹120/sq ft"
3. Includes a 300–500 word SEO content block (stored in Sanity as Portable Text)
4. Lists all child products with structured data
5. Has FAQ section with `FAQPage` schema
6. Internal links to sibling categories and parent pages

---

## 5. Atomic Component Architecture

### 5.1 Server Components (Zero Client JS)

| Component | Path | Responsibility |
|-----------|------|---------------|
| `RootLayout` | `app/layout.tsx` | HTML structure, `<head>`, fonts (Inter/Outfit via `next/font`), Organization schema, global nav |
| `Navbar` | `components/server/Navbar.tsx` | Static nav with category links. Mobile hamburger is a CSS-only `:has()` toggle — no JS. |
| `Footer` | `components/server/Footer.tsx` | Mega footer with category links, contact info, newsletter form (Server Action) |
| `ProductGrid` | `components/server/ProductGrid.tsx` | Fetches products from Sanity, renders grid. Accepts `material`, `subcategory`, `page` as props. |
| `ProductCard` | `components/server/ProductCard.tsx` | Single product card: Cloudinary `<Image>`, name, price range, material badge |
| `ProductDetail` | `components/server/ProductDetail.tsx` | Full product page: image gallery, specs table, bulk pricing tiers, related products |
| `BreadcrumbNav` | `components/server/BreadcrumbNav.tsx` | Generates breadcrumbs + BreadcrumbList schema from URL segments |
| `SEOContent` | `components/server/SEOContent.tsx` | Renders Portable Text content block from Sanity for pillar pages |
| `SchemaMarkup` | `components/server/SchemaMarkup.tsx` | Generates and injects `<script type="application/ld+json">` for any schema type |
| `FilterBar` | `components/server/FilterBar.tsx` | URL-param-based filters (material, thickness, finish). No client state — uses `<Link>` with search params. |
| `Pagination` | `components/server/Pagination.tsx` | SEO-friendly pagination with `?page=N` URL params and `rel="prev"/"next"` links |
| `FAQAccordion` | `components/server/FAQAccordion.tsx` | CSS-only `<details><summary>` accordion — zero JS |
| `TrustBadges` | `components/server/TrustBadges.tsx` | ISO, IGBC, warranty badges as optimized SVGs |
| `StatCounter` | `components/server/StatCounter.tsx` | Static number display (animated version is in client components) |
| `BlogCard` | `components/server/BlogCard.tsx` | Blog post preview card |
| `ProjectGallery` | `components/server/ProjectGallery.tsx` | Grid of completed project images |

### 5.2 Client Components (`'use client'`)

| Component | Path | Responsibility | Bundle Impact |
|-----------|------|---------------|---------------|
| `LenisProvider` | `components/client/LenisProvider.tsx` | Wraps the app in Lenis smooth scroll. Syncs Lenis rAF with GSAP ticker. Only active on homepage. | ~12KB gzipped |
| `DoorwayExperience` | `components/client/DoorwayExperience.tsx` | **The core immersive section.** Orchestrates 3 doorway transitions using GSAP ScrollTrigger pin + scale. Loaded via `next/dynamic({ ssr: false })`. | ~45KB gzipped (GSAP + ScrollTrigger) |
| `DoorwayRoom` | `components/client/DoorwayRoom.tsx` | Single room within the doorway experience. Receives texture URL, title, specs as props. Handles scale animation for its doorway frame. | Bundled with parent |
| `TextReveal` | `components/client/TextReveal.tsx` | Reusable clip-path text reveal animation. Uses GSAP `fromTo` with `clipPath`. | Bundled with parent |
| `ParallaxHero` | `components/client/ParallaxHero.tsx` | Hero section with mouse-follow parallax on the background texture. Uses `pointermove` event + GSAP `quickTo`. | ~3KB |
| `AnimatedCounter` | `components/client/AnimatedCounter.tsx` | Counts up numbers when scrolled into view. Uses `IntersectionObserver` + `countUp` via GSAP. | ~2KB |
| `MobileSwipeRooms` | `components/client/MobileSwipeRooms.tsx` | Mobile replacement for DoorwayExperience. CSS scroll-snap sections with `IntersectionObserver` for crossfade. **Zero GSAP dependency.** | ~4KB |
| `ImageZoom` | `components/client/ImageZoom.tsx` | Product image zoom on hover/pinch. CSS `transform: scale()` on pointer position. | ~3KB |
| `LeadForm` | `components/client/LeadForm.tsx` | Multi-step lead capture form. Uses React `useActionState` + Server Action. Client-side validation via Zod. | ~8KB |
| `WhatsAppCTA` | `components/client/WhatsAppCTA.tsx` | Floating WhatsApp button (bottom-right). Pre-fills message with product context. | ~1KB |
| `MobileNav` | `components/client/MobileNav.tsx` | Mobile navigation drawer. CSS-driven slide with JS toggle for accessibility (focus trap). | ~3KB |
| `CatalogPDF` | `components/client/CatalogPDF.tsx` | "Download Catalog" button that triggers email-gated PDF download. | ~2KB |
| `VideoPlayer` | `components/client/VideoPlayer.tsx` | Lazy YouTube embed — renders thumbnail first, loads iframe on click (facade pattern). | ~2KB |

### 5.3 Component Tree (Homepage)

```
<RootLayout>                              ← SERVER
  <Navbar />                              ← SERVER
  <main>
    <LenisProvider>                        ← CLIENT (homepage only)
      {isMobile ? (
        <MobileSwipeRooms />              ← CLIENT (no GSAP)
      ) : (
        <DoorwayExperience>               ← CLIENT (dynamic, ssr:false)
          <ParallaxHero />                ← CLIENT
          <DoorwayRoom texture="wpc" />   ← CLIENT
          <DoorwayRoom texture="pvc" />   ← CLIENT
          <DoorwayRoom texture="brand" /> ← CLIENT
          <TextReveal />                  ← CLIENT
          <AnimatedCounter />             ← CLIENT
        </DoorwayExperience>
      )}
      <ProductGrid />                     ← SERVER (passed as children)
      <LeadForm />                        ← CLIENT
      <ProjectGallery />                  ← SERVER
    </LenisProvider>
    <WhatsAppCTA />                        ← CLIENT
  </main>
  <Footer />                              ← SERVER
</RootLayout>
```

### 5.4 Mobile Detection Strategy

```typescript
// lib/hooks/useDeviceDetect.ts
// Client-side media query hook (not UA sniffing)
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const mql = window.matchMedia('(max-width: 767px)');
    setIsMobile(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);
  
  return isMobile;
}
```

Additionally, use **`next/headers`** to read the `Sec-CH-UA-Mobile` client hint for server-side mobile detection to avoid layout shift:

```typescript
// lib/server/device.ts
import { headers } from 'next/headers';

export function getIsMobileServer(): boolean {
  const headersList = headers();
  const mobile = headersList.get('sec-ch-ua-mobile');
  return mobile === '?1';
}
```

---

## 6. Database / Headless CMS Schema

### 6.1 CMS Recommendation: **Sanity v3**

| Criteria | Sanity v3 | Supabase |
|----------|----------|----------|
| Content modeling | ✅ Rich schema with Portable Text, image hotspots, references | ⚠️ Relational — requires manual joins for nested content |
| Real-time preview | ✅ Native `next-sanity` with live preview in Next.js | ❌ Requires custom setup |
| Image handling | ✅ Built-in image pipeline (but we use Cloudinary instead for CDN reach) | ❌ Requires separate storage |
| Non-technical editing | ✅ Sanity Studio (deployed at `/studio`) | ⚠️ Requires custom admin UI |
| Portable Text (rich text) | ✅ First-class support | ❌ Would need a WYSIWYG integration |
| Webhook → ISR | ✅ Native webhook support → `api/revalidate` | ✅ Supports webhooks |
| Cost at scale | ✅ Free tier: 100K API requests/mo | ✅ Free tier generous |
| **Verdict** | **✅ Recommended** — purpose-built for content-heavy e-commerce | Use for auth/realtime if needed later |

### 6.2 Sanity Schema Definitions

#### Wall Panel Product

```typescript
// sanity/schemas/product.ts
import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'product',
  title: 'Wall Panel Product',
  type: 'document',
  fields: [
    // ── Identity ──
    defineField({
      name: 'name',
      title: 'Product Name',
      type: 'string',
      validation: (Rule) => Rule.required().max(120),
    }),
    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'sku',
      title: 'SKU',
      type: 'string',
      validation: (Rule) => Rule.required().regex(/^[A-Z]{2,4}-[A-Z]{2,4}-[A-Z]{2,4}-\d{3}$/),
      description: 'Format: MAT-TYPE-FINISH-001 (e.g., WPC-FLT-TWD-001)',
    }),

    // ── Classification ──
    defineField({
      name: 'material',
      title: 'Material',
      type: 'reference',
      to: [{ type: 'material' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subcategory',
      title: 'Subcategory',
      type: 'reference',
      to: [{ type: 'subcategory' }],
    }),
    defineField({
      name: 'applications',
      title: 'Suitable Applications',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'application' }] }],
      description: 'Where this panel can be used (bedroom, office, exterior, etc.)',
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),

    // ── Physical Specifications ──
    defineField({
      name: 'thickness',
      title: 'Thickness (mm)',
      type: 'number',
      validation: (Rule) => Rule.required().min(1).max(50),
    }),
    defineField({
      name: 'width',
      title: 'Panel Width (mm)',
      type: 'number',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'height',
      title: 'Panel Height (mm)',
      type: 'number',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'weightPerSqFt',
      title: 'Weight per sq ft (grams)',
      type: 'number',
    }),
    defineField({
      name: 'finish',
      title: 'Surface Finish',
      type: 'string',
      options: {
        list: [
          'Matte', 'Glossy', 'Semi-Gloss', 'Textured',
          'Wood Grain', 'Marble', 'Stone', 'Metallic',
        ],
      },
    }),
    defineField({
      name: 'colorFamily',
      title: 'Color Family',
      type: 'string',
      options: {
        list: [
          'Natural Wood', 'Dark Wood', 'White/Cream',
          'Grey', 'Black', 'Marble White', 'Custom',
        ],
      },
    }),

    // ── Technical Properties ──
    defineField({
      name: 'isWaterproof',
      title: 'Waterproof',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'isFireRetardant',
      title: 'Fire Retardant',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'isTermiteProof',
      title: 'Termite Proof',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'isUVResistant',
      title: 'UV Resistant',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'fireRating',
      title: 'Fire Rating',
      type: 'string',
      options: { list: ['B1', 'B2', 'Class A', 'Class B', 'Not Rated'] },
    }),
    defineField({
      name: 'warrantyYears',
      title: 'Warranty (Years)',
      type: 'number',
    }),
    defineField({
      name: 'installationMethod',
      title: 'Installation Method',
      type: 'string',
      options: {
        list: ['Clip & Lock', 'Adhesive', 'Screw Mount', 'Tongue & Groove'],
      },
    }),

    // ── Pricing ──
    defineField({
      name: 'bulkPricing',
      title: 'Bulk Pricing Tiers',
      type: 'array',
      of: [{
        type: 'object',
        name: 'priceTier',
        fields: [
          { name: 'minQuantity', type: 'number', title: 'Min Qty (sq ft)' },
          { name: 'maxQuantity', type: 'number', title: 'Max Qty (sq ft)' },
          { name: 'pricePerUnit', type: 'number', title: 'Price per sq ft (₹)' },
          { name: 'label', type: 'string', title: 'Tier Label', description: 'e.g., "Retail", "Wholesale", "Bulk"' },
        ],
      }],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'moq',
      title: 'Minimum Order Quantity (sq ft)',
      type: 'number',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'priceUnit',
      title: 'Price Display Unit',
      type: 'string',
      initialValue: 'per sq ft',
      options: { list: ['per sq ft', 'per piece', 'per running ft'] },
    }),

    // ── Media ──
    defineField({
      name: 'images',
      title: 'Product Images',
      type: 'array',
      of: [{
        type: 'object',
        name: 'productImage',
        fields: [
          {
            name: 'cloudinaryPublicId',
            type: 'string',
            title: 'Cloudinary Public ID',
            description: 'e.g., wall-panels/wpc/fluted/teak-001-hero',
          },
          { name: 'alt', type: 'string', title: 'Alt Text' },
          { name: 'isPrimary', type: 'boolean', title: 'Is Primary Image' },
          {
            name: 'aspectRatio',
            type: 'string',
            title: 'Aspect Ratio',
            options: { list: ['1:1', '4:3', '16:9', '3:4'] },
          },
        ],
      }],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'roomSceneImage',
      title: 'Room Scene / In-Situ Image',
      type: 'object',
      fields: [
        { name: 'cloudinaryPublicId', type: 'string' },
        { name: 'alt', type: 'string' },
      ],
      description: 'Image showing the panel installed in a room setting',
    }),
    defineField({
      name: 'textureMapUrl',
      title: 'High-Res Texture Map URL',
      type: 'url',
      description: 'For 3D visualizer or zoom-in texture view',
    }),
    defineField({
      name: 'model3dUrl',
      title: '3D Model URL (optional)',
      type: 'url',
      description: 'glTF/GLB file for future 3D room visualizer',
    }),

    // ── SEO ──
    defineField({
      name: 'shortDescription',
      title: 'Short Description (for meta & cards)',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required().max(160),
    }),
    defineField({
      name: 'longDescription',
      title: 'Detailed Description',
      type: 'array',
      of: [{ type: 'block' }], // Portable Text
    }),
    defineField({
      name: 'seoTitle',
      title: 'SEO Title Override',
      type: 'string',
      description: 'Leave blank to auto-generate from product name',
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Description Override',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'faq',
      title: 'Product FAQ',
      type: 'array',
      of: [{
        type: 'object',
        name: 'faqItem',
        fields: [
          { name: 'question', type: 'string', title: 'Question' },
          { name: 'answer', type: 'text', title: 'Answer' },
        ],
      }],
    }),

    // ── Status ──
    defineField({
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'isFeatured',
      title: 'Featured Product',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'stockStatus',
      title: 'Stock Status',
      type: 'string',
      options: { list: ['In Stock', 'Low Stock', 'Made to Order', 'Discontinued'] },
    }),
    defineField({
      name: 'leadTimeDays',
      title: 'Lead Time (Days)',
      type: 'number',
    }),
  ],

  preview: {
    select: {
      title: 'name',
      subtitle: 'sku',
      media: 'images.0.cloudinaryPublicId',
    },
  },
});
```

#### Material Category

```typescript
// sanity/schemas/material.ts
export default defineType({
  name: 'material',
  title: 'Material Category',
  type: 'document',
  fields: [
    defineField({ name: 'name', type: 'string', title: 'Name' }),          // "WPC"
    defineField({ name: 'slug', type: 'slug', options: { source: 'name' } }),
    defineField({ name: 'fullName', type: 'string', title: 'Full Name' }), // "Wood Polymer Composite"
    defineField({ name: 'description', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'heroImage', type: 'string', title: 'Cloudinary Public ID' }),
    defineField({ name: 'seoTitle', type: 'string' }),
    defineField({ name: 'seoDescription', type: 'text' }),
    defineField({
      name: 'faq',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'question', type: 'string' },
          { name: 'answer', type: 'text' },
        ],
      }],
    }),
    defineField({ name: 'sortOrder', type: 'number', title: 'Display Order' }),
  ],
});
```

#### Application (for programmatic SEO)

```typescript
// sanity/schemas/application.ts
export default defineType({
  name: 'application',
  title: 'Application / Room Type',
  type: 'document',
  fields: [
    defineField({ name: 'name', type: 'string' }),            // "Bedroom"
    defineField({ name: 'slug', type: 'slug', options: { source: 'name' } }),
    defineField({ name: 'description', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'heroImage', type: 'string' }),
    defineField({ name: 'seoTitle', type: 'string' }),
    defineField({ name: 'seoDescription', type: 'text' }),
    defineField({
      name: 'faq',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'question', type: 'string' },
          { name: 'answer', type: 'text' },
        ],
      }],
    }),
  ],
});
```

#### Subcategory

```typescript
// sanity/schemas/subcategory.ts
export default defineType({
  name: 'subcategory',
  title: 'Subcategory',
  type: 'document',
  fields: [
    defineField({ name: 'name', type: 'string' }),             // "Fluted"
    defineField({ name: 'slug', type: 'slug', options: { source: 'name' } }),
    defineField({ name: 'material', type: 'reference', to: [{ type: 'material' }] }),
    defineField({ name: 'description', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'seoTitle', type: 'string' }),
    defineField({ name: 'seoDescription', type: 'text' }),
  ],
});
```

#### Lead / Inquiry

```typescript
// sanity/schemas/lead.ts
export default defineType({
  name: 'lead',
  title: 'Lead / Inquiry',
  type: 'document',
  fields: [
    defineField({ name: 'name', type: 'string' }),
    defineField({ name: 'businessName', type: 'string' }),
    defineField({ name: 'phone', type: 'string' }),
    defineField({ name: 'email', type: 'string' }),
    defineField({ name: 'city', type: 'string' }),
    defineField({ name: 'quantity', type: 'number', title: 'Required Qty (sq ft)' }),
    defineField({ name: 'preferredMaterial', type: 'string' }),
    defineField({ name: 'product', type: 'reference', to: [{ type: 'product' }] }),
    defineField({ name: 'message', type: 'text' }),
    defineField({ name: 'source', type: 'string', options: { list: ['Website Form', 'WhatsApp', 'Phone'] } }),
    defineField({ name: 'status', type: 'string', options: { list: ['New', 'Contacted', 'Quoted', 'Converted', 'Lost'] }, initialValue: 'New' }),
    defineField({ name: 'submittedAt', type: 'datetime' }),
  ],
});
```

### 6.3 Sanity GROQ Queries

```groq
// Get all products for a material category with pagination
*[_type == "product" && material->slug.current == $material && isActive == true]
  | order(isFeatured desc, _createdAt desc)
  [$start...$end] {
    name,
    "slug": slug.current,
    sku,
    "materialName": material->name,
    "subcategoryName": subcategory->name,
    thickness,
    finish,
    "primaryImage": images[isPrimary == true][0].cloudinaryPublicId,
    "priceRange": {
      "low": bulkPricing[0].pricePerUnit,
      "high": bulkPricing[-1].pricePerUnit
    },
    moq,
    priceUnit,
    stockStatus,
    isFeatured,
    shortDescription
  }
```

---

## 7. Edge Cases & Fallbacks

### 7.1 Mobile Performance Strategy

| Scenario | Detection | Fallback |
|----------|-----------|----------|
| **Mobile viewport (< 768px)** | `matchMedia` + `Sec-CH-UA-Mobile` header | Replace `DoorwayExperience` with `MobileSwipeRooms` — CSS scroll-snap sections, IntersectionObserver crossfade, zero GSAP |
| **Low-end mobile (< 4GB RAM)** | `navigator.deviceMemory < 4` | Disable all animations. Serve static images. No Lenis smooth scroll. |
| **Reduced motion preference** | `prefers-reduced-motion: reduce` | All GSAP timelines killed. CSS transitions set to `0s`. Doorway sections render as static full-bleed images with text overlay. |
| **Touch device** | `'ontouchstart' in window` | Disable mouse-follow parallax on hero. Doorway scaling still works via touch scroll. |

### 7.2 Network Resilience

| Scenario | Detection | Fallback |
|----------|-----------|----------|
| **Slow connection (2G/3G)** | `navigator.connection.effectiveType` | Cloudinary transformations downgrade to `q_auto:low,w_640`. Hero image uses LQIP (Low Quality Image Placeholder) with CSS blur-up. Doorway rooms limited to 2 (skip Room 3). |
| **Offline** | Service Worker + `navigator.onLine` | Cache critical assets via `next-pwa` or Workbox. Show "You're offline" banner. Cached product pages still viewable. |
| **Cloudinary CDN failure** | `<img onerror>` + fallback `src` | Fallback to a self-hosted `/public/fallback/` directory with compressed JPEG versions. |
| **Sanity API failure** | `try/catch` in data fetching + ISR cache | Serve stale ISR cache (Vercel serves last successful build). Show "Data may be outdated" subtle banner. |

### 7.3 Progressive Enhancement Strategy

```
Layer 1 — HTML (Server Components)
  ✅ All content is readable with JS disabled
  ✅ Product grids, specs, prices, forms all rendered server-side
  ✅ SEO crawlers see complete content
  ✅ <noscript> fallback shows static hero image

Layer 2 — CSS Enhancements
  ✅ Responsive grid via CSS Grid (not JS-based)
  ✅ Hover effects, transitions, scroll-snap (mobile rooms)
  ✅ @media (prefers-reduced-motion) respected

Layer 3 — JavaScript Enhancements
  ✅ GSAP doorway animations (homepage only)
  ✅ Lenis smooth scroll
  ✅ Form validation (Zod)
  ✅ IntersectionObserver staggered reveals
  ❌ If JS fails: forms still submit (Server Actions), 
     content is fully visible, animations gracefully absent
```

### 7.4 Browser Compatibility

| Feature | Chrome/Edge | Firefox | Safari | Fallback |
|---------|------------|---------|--------|----------|
| `scroll-timeline` | ✅ | ⚠️ Partial | ❌ | GSAP ScrollTrigger (our primary — no dependency on this) |
| `view-transitions` | ✅ | ❌ | ❌ | Standard page navigation (no transition) |
| CSS `has()` | ✅ | ✅ | ✅ 15.4+ | JS toggle for mobile nav on older Safari |
| `IntersectionObserver` | ✅ | ✅ | ✅ | Polyfill via `intersection-observer` npm package |
| AVIF images | ✅ | ✅ | ✅ 16+ | Cloudinary `f_auto` auto-negotiates to WebP or JPEG |
| `requestIdleCallback` | ✅ | ✅ | ❌ | `setTimeout(fn, 1)` shim |

### 7.5 Accessibility

- **Keyboard navigation**: All interactive elements focusable. Skip-to-content link.
- **Screen readers**: `aria-label` on doorway sections ("Scroll to explore WPC wall panels"). `aria-live` on form submission status.
- **Color contrast**: WCAG AA minimum (4.5:1 for text, 3:1 for large text).
- **Motion**: `prefers-reduced-motion` kills all GSAP animations and smooth scroll.
- **Focus management**: After doorway experience, focus is programmatically moved to the catalog section heading.

---

## 8. Phase-wise Execution & Deployment Strategy

### Phase 1: Foundation & Asset Pipeline (Week 1–2)

**Objective**: Project scaffold, CMS setup, Cloudinary integration, design system.

| Task | Owner | Deliverable |
|------|-------|------------|
| Initialize Next.js 15 (App Router) + Tailwind v4 + TypeScript | Dev | Working `npx create-next-app` scaffold |
| Configure Sanity v3 Studio | Dev | Schemas deployed, Studio at `/studio` |
| Set up Cloudinary account + upload pipeline | Dev | Cloudinary loader integrated, test images serving |
| Create Tailwind design tokens | Design/Dev | Color palette, typography scale, spacing, breakpoints |
| Collect/create wall panel textures | Design | 20+ high-res textures uploaded to Cloudinary |
| Build `RootLayout`, `Navbar`, `Footer` | Dev | Server Components with responsive layout |
| SEO foundation: `sitemap.ts`, `robots.ts`, `metadata` | Dev | Crawlable, indexed |
| Set up Vercel project + CI/CD | DevOps | `main` branch auto-deploys |

**Exit Criteria**: `localhost:3000` shows styled shell with Navbar, Footer, and Cloudinary images loading.

---

### Phase 2: Immersive Experience (Week 3–4)

**Objective**: Build the doorway scroll effect and homepage immersive section.

| Task | Owner | Deliverable |
|------|-------|------------|
| Install & configure GSAP + ScrollTrigger + Lenis | Dev | Single rAF loop, deferred initialization |
| Build `DoorwayExperience` component | Dev | 3 rooms with scale transitions |
| Build `DoorwayRoom` component | Dev | Texture background + text reveal per room |
| Build `ParallaxHero` component | Dev | Mouse-follow parallax hero |
| Build `MobileSwipeRooms` component | Dev | CSS scroll-snap mobile fallback |
| Build `TextReveal` + `AnimatedCounter` | Dev | Reusable animation components |
| Performance audit (Lighthouse, WebPageTest) | Dev | LCP < 2s, TBT < 200ms, CLS < 0.1 |
| `prefers-reduced-motion` and low-end device fallbacks | Dev | All edge cases covered |
| Cross-browser testing (Chrome, Firefox, Safari, mobile) | QA | No visual regressions |

**Exit Criteria**: Homepage doorway scroll experience works flawlessly on desktop and degrades gracefully on mobile. Lighthouse performance ≥ 90.

---

### Phase 3: B2B Catalog & Lead Funnel (Week 5–6)

**Objective**: Build product catalog, detail pages, filters, and lead generation.

| Task | Owner | Deliverable |
|------|-------|------------|
| Populate Sanity with 50+ products (real data) | Content | CMS populated with real SKUs, prices, images |
| Build `ProductGrid` + `ProductCard` (Server Components) | Dev | Filterable, paginated grid |
| Build `FilterBar` (URL-param based) | Dev | Material, thickness, finish, price filters |
| Build Product Detail page (`/products/[slug]`) | Dev | Full specs, image gallery, bulk pricing table |
| Build `LeadForm` with Server Actions | Dev | Multi-step form, Zod validation, email notification |
| Build `WhatsAppCTA` component | Dev | Floating button with pre-filled messages |
| Build pillar pages (`/wall-panels/[material]`, `/wall-panels-for/[application]`) | Dev | SSG with programmatic SEO content |
| Schema.org markup (Product, BreadcrumbList, FAQPage) | Dev | Validated via Google Rich Results Test |
| Build `/bulk-pricing` calculator page | Dev | Interactive pricing based on quantity |
| Build `/become-a-dealer` registration page | Dev | Multi-field form with Server Action |
| Set up ISR revalidation webhook from Sanity | Dev | Content updates reflect within 60s |

**Exit Criteria**: Full B2B catalog functional. Lead form submits to Sanity + email. All product pages have valid structured data.

---

### Phase 4: Polish, Content & Launch (Week 7–8)

**Objective**: Content pages, final polish, performance hardening, launch.

| Task | Owner | Deliverable |
|------|-------|------------|
| Build `/about`, `/faq`, `/blog`, `/projects` pages | Dev | Content-rich, SEO-optimized |
| Write 10 initial blog posts (long-tail SEO) | Content | Published in Sanity |
| Create 5 project case studies with photos | Content | Published in Sanity |
| Add Google Analytics 4 + Search Console | Dev | Tracking live |
| Final Lighthouse audit (all pages) | Dev | All pages ≥ 90 performance |
| Core Web Vitals field testing (CrUX) | Dev | LCP/CLS/INP passing |
| Security headers (CSP, HSTS, X-Frame) | Dev | A+ on securityheaders.com |
| Custom 404 page | Dev | Branded, with search + popular links |
| Load testing (simulate 1000 concurrent users) | DevOps | Vercel Edge handles without degradation |
| DNS + domain setup (wholesaleji.com) | DevOps | SSL, redirects, www→non-www |
| Submit sitemap to Google Search Console | SEO | Indexed within 48 hours |
| Social meta tags + OG images (auto-generated) | Dev | Beautiful link previews on WhatsApp/social |
| **Launch** 🚀 | All | Production deployment on Vercel |

**Exit Criteria**: Production site live at `wholesaleji.com` with all pages indexed, Core Web Vitals passing, and lead generation functional.

---

## Appendix A: Key Dependencies

```json
{
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "@sanity/client": "^6.0.0",
    "@sanity/image-url": "^1.0.0",
    "next-sanity": "^9.0.0",
    "gsap": "^3.12.0",
    "lenis": "^1.1.0",
    "zod": "^3.23.0",
    "next-seo": "^7.0.0"
  },
  "devDependencies": {
    "typescript": "^5.5.0",
    "tailwindcss": "^4.0.0",
    "@tailwindcss/postcss": "^4.0.0",
    "sanity": "^3.50.0",
    "@types/react": "^19.0.0",
    "eslint": "^9.0.0",
    "eslint-config-next": "^15.0.0"
  }
}
```

## Appendix B: Environment Variables

```env
# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=xxxxxxxxxxxx
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=sk-xxxxxxxx  # Server-only, never exposed

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD=wholesaleji

# Revalidation
SANITY_REVALIDATE_SECRET=xxxxxxxxxxxx

# Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# WhatsApp
NEXT_PUBLIC_WHATSAPP_NUMBER=91XXXXXXXXXX

# Site
NEXT_PUBLIC_SITE_URL=https://wholesaleji.com
```

## Appendix C: Vercel Configuration

```json
// vercel.json
{
  "framework": "nextjs",
  "regions": ["bom1"],  // Mumbai for India-first audience
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=()" }
      ]
    },
    {
      "source": "/studio/(.*)",
      "headers": [
        { "key": "X-Robots-Tag", "value": "noindex, nofollow" }
      ]
    }
  ]
}
```

---

> [!IMPORTANT]
> **User Review Required**: This PRD covers 8 comprehensive sections. Before execution begins, please review:
> 1. **CMS Choice**: Sanity v3 is recommended over Supabase. Do you agree, or do you have a preference?
> 2. **Number of doorway rooms**: The PRD specifies 3 rooms (WPC, PVC, Brand Story). Should we add/remove rooms?
> 3. **Tailwind v4**: The PRD uses Tailwind CSS v4. Confirm this is acceptable.
> 4. **Product data**: Do you have real product data/images ready, or should we create mock data for Phase 1–2?
> 5. **Domain**: Is `wholesaleji.com` the confirmed production domain?
> 6. **Budget for GSAP**: GSAP's ScrollTrigger requires a paid "Business" license for commercial use. Are you aware of this?
