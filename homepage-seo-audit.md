# WholesalerJi Homepage SEO Forensic Audit

**Date**: 2026-10-09
**Target**: `https://wholesalerji.com/` (Homepage)
**Scope**: Route structure, metadata, heading hierarchy, images, schema, internal linking, and CWV risks. (Read-Only Analysis)

---

## 1. Executive Summary
The WholesalerJi homepage is a highly interactive, B2B-focused conversion engine. It successfully targets high-level intent ("Wholesale Wall Panels in India", "Gurgaon & Delhi NCR"). The page benefits from strong semantic heading structures and excellent localized content. However, it completely lacks foundational Organization/LocalBusiness Schema, and the hero's interactive GSAP animation introduces a significant LCP (Largest Contentful Paint) performance risk due to the usage of unoptimized standard `<img>` tags.

---

## 2. Exact Metadata & Heading Hierarchy

### Metadata (`src/app/layout.tsx`)
*   **Title Tag**: `Wholesale Wall Panels in India | PVC, WPC & Fluted | WholesalerJi`
*   **Meta Description**: `Wholesale PVC, WPC, fluted and decorative wall panels for contractors, retailers and projects. Bulk pricing and pan-India supply from WholesalerJi.`
*   **Canonical URL**: `https://wholesalerji.com/`
*   **Robots**: `index: true, follow: true`
*   **Open Graph**: Accurately mirrors metadata.

### Heading Hierarchy
The homepage successfully maintains a logical hierarchy, spread across `page.tsx` and `KineticExperience.tsx`:
*   **`<h1>`**: `Wholesale Wall Panels for Projects, Retail & Commercial Spaces` (`KineticExperience.tsx:1116`)
*   **`<h2>`**: `Why Architectural Wall Panels?` (`KineticExperience.tsx:1159`)
    *   **`<h3>`**: `Fast Dry Install`, `Waterproof & Fire Retardant`, `Premium Aesthetic`
*   **`<h2>`**: `Explore Wall Panel Categories` (`page.tsx:310`)
    *   **`<h3>`**: `Seamless Primo Panels`, `Elite High-Gloss`, `Classic Fluted WPC`, `Premium Fluted WPC`
*   **`<h2>`**: `Wall Panel Supply in Gurgaon & Delhi NCR` (`page.tsx:442`)
*   **`<h2>`**: `Wholesale Wall Panel Catalog` (`page.tsx:460`)
    *   **`<h3>`**: Dynamic Catalog Item Titles (e.g., `Natural Oak WPC Louver`)
*   **`<h2>`**: `Engineered for Architects & Projects` (`KineticExperience.tsx:1291`)
*   **`<h2>`**: `Proven Across 250+ Commercial Sites` (`KineticExperience.tsx:1428`)
    *   **`<h3>`**: `WholesalerJi Direct Factory Model`
*   **`<h2>`**: `Request Volume Rate Card` (`page.tsx:545`)
    *   **`<h3>`**: `Who can fill this form?`
*   **`<h2>`**: `Verified Project Deployments` (`KineticExperience.tsx:1620`)

*Critique*: The hierarchy is exceptionally well-structured. It seamlessly blends product categories, local targeting (Gurgaon/NCR), and B2B validation (Architects, Commercial sites).

---

## 3. Keyword and Search Intent
*   **Primary Intent**: "Wholesale Wall Panels in India"
*   **Secondary Intent**: "Wall Panels Gurgaon / Delhi NCR", "Wall panel supplier for contractors"
*   **Validation**: The content strongly supports these claims. It explicitly details "500+ Authorized Dealers", "Pan-India Logistics across 18 States", and provides a localized context section ("Wall Panel Supply in Gurgaon & Delhi NCR").
*   **Cannibalization Risk**: Low. The homepage acts as a master hub targeting "Wholesale Wall Panels in India". The `/wall-panels` page acts as an architectural catalog ("Architectural Wall Panels | Primo & Elite Collections"). The individual `/primo`, `/elite` pages target specific product lines. The separation is healthy.

---

## 4. Images and Performance (Core Web Vitals)
*   **LCP Risk (Critical)**: In `KineticExperience.tsx` (Line 1100), the hero image is split into 10-20 vertical "slats" for animation. It uses a standard `<img src={heroImage} />` tag instead of Next.js `<Image>`. 
    *   *Issue*: None of these images have `fetchpriority="high"` or `loading="eager"`. Because they are the largest visible element above the fold, this will likely cause a significant LCP delay on both mobile and desktop.
*   **Category Cards (`page.tsx:411`)**: Uses `<Image>` with `fill` and accurate `sizes="(max-width: 768px) 100vw, 256px"`. Good.
*   **Catalog Slider (`page.tsx:485`)**: Uses `<Image>` with `fill` and accurate `sizes="(max-width: 768px) 85vw, 320px"`. Good.

---

## 5. Schema & Structured Data
*   **Missing (High Priority)**: There is **zero** JSON-LD on the homepage or inherited from `layout.tsx`. 
*   **Opportunity**: The homepage should implement `Organization` schema (to define WholesalerJi as a national entity) and potentially a `LocalBusiness` or `WholesaleStore` schema (anchored to Gurgaon/Delhi NCR, if a verified address exists).

---

## 6. Internal Links and Conversion
*   **Hierarchy**: Excellent. The homepage routes users immediately to `/wall-panels`, specific product series (`/wall-panels/primo-fluted`), and provides persistent WhatsApp / RFQ CTAs.
*   **Broken Links**: None detected in the static code.
*   **CTAs**: Multiple intent levels (WhatsApp for instant chat, "Request Volume Rate Card" for formal B2B inquiries).

---

## 7. Prioritized Issue List & Recommendations

### 🔴 CRITICAL
1.  **LCP Hero Image Bottleneck**:
    *   *Location*: `KineticExperience.tsx` (Line 1100).
    *   *Fix*: Add `fetchpriority="high"` to the standard `<img>` tags generating the hero slats to force the browser to prioritize them.

### 🟠 HIGH
1.  **Missing `Organization` Schema**:
    *   *Location*: `src/app/page.tsx` or `src/app/layout.tsx`.
    *   *Fix*: Inject a robust `Organization` JSON-LD payload to establish the brand entity, logo, and social links.

### 🟡 MEDIUM
1.  **Missing `LocalBusiness` Schema** (If applicable):
    *   *Location*: `src/app/page.tsx`.
    *   *Fix*: If WholesalerJi has a verified, public physical address or warehouse in Gurgaon, `LocalBusiness` schema should be added to dominate local pack rankings in Delhi NCR.

---

## 8. Required Live Verification
To confirm these findings, the following tests must be run on production:
1.  **PageSpeed Insights (Mobile & Desktop)**: To measure the actual LCP penalty of the 20x sliced `<img src>` tags in `KineticExperience`.
2.  **Google Search Console**: To verify indexability of the newly created `sitemap.xml` and test if Googlebot can successfully render the GSAP-heavy `KineticExperience` DOM.

**Summary**: The homepage is structurally sound and extremely well-targeted for B2B intents. Fixing the Hero LCP risk and injecting Organization Schema are the only major requirements before calling this page fully optimized.
