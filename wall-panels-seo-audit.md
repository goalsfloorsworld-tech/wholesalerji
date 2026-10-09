# SEO Forensic Audit: `/wall-panels` (WholesalerJi.com)

**Date**: 2026-10-09
**Target**: `https://wholesalerji.com/wall-panels`
**Scope**: Route structure, metadata, heading hierarchy, images, schema, internal linking, CWV risks, and keyword targeting. (Read-Only Analysis)

---

## 1. Executive Summary
The `/wall-panels` root page successfully targets high-level B2B intent ("wholesale", "architects", "project buyers") but suffers from foundational technical SEO missing pieces. The page acts as a beautiful, interactive hub, but completely lacks a `sitemap.xml`, `robots.txt`, and Structured Data. Furthermore, local keywords ("Gurgaon", "Delhi NCR") are present in the `<title>` but are entirely absent from the visible body text, creating a disconnect for local search relevance.

---

## 2. Route Structure & Indexability
*   **Component Architecture**: The route (`src/app/wall-panels/page.tsx`) wraps the `WallPanelsExperience` Client Component. Next.js prerenders Client Components, so the raw HTML is delivered, but heavy GSAP animations control the initial visual states.
*   **Sitemap & Robots**: **CRITICAL MISSING.** The project lacks a `sitemap.ts/xml` and `robots.ts/txt` in the root or `src/app/`. Google relies entirely on natural discovery.
*   **Redirects**: Properly configured in `next.config.ts` (301 redirects from legacy `/products/primo-panels` to `/wall-panels/primo`, etc.).
*   **Canonical URL**: Explicitly set to `https://wholesalerji.com/wall-panels`.

## 3. Metadata & Schema
*   **Title Tag**: `Architectural Wall Panels | Primo & Elite Collections | WholesalerJi`
*   **Meta Description**: `Buy direct manufacturer Wall Panels in Gurgaon, Delhi NCR & India. Explore 24+ colors in Primo Series (GF-301—312) and Elite Series (GF-401—412). 100% waterproof, Class B1 flame retardant.`
*   **OpenGraph**: Present and accurately mirrors the metadata.
*   **JSON-LD / Schema**: **MISSING.** There is zero structured data (no `Product`, `CollectionPage`, `LocalBusiness`, or `Organization`) on this page.

## 4. Exact Heading Hierarchy & Content
The heading structure relies on `WallPanelsExperience.tsx`:

*   **`<h1>`**: `Wholesale Wall Panels, Made for Real Projects.` (Includes an italicized `<span>` inside).
    *   *Pre-heading span*: `WholesalerJi Architectural Materials`
*   **`<h2>`**: `More than a wall. A material system for the space.`
*   **`<h3>`**: Dynamic Panel Names (e.g., `Primo Oak`, `Elite White`) rendered in a loop.
*   **`<h2>`**: `Collections`
*   **`<h4>`**: `Primo Series`, `Elite Series`, `Primo Fluted`, `Elite Fluted` (Inside the visual accordion).
*   **`<h3>`**: `Core Materials`
*   **`<h4>`**: `WPC Louvers`, `PVC Marble`, `Charcoal Panels`
*   **`<h2>`**: `Engineered for Project Success`
*   **`<h3>`**: `Architects & Designers`, `Contractors`, `Dealers`, `Project Buyers`
*   **`<h2>`**: `The WholesalerJi Difference`
*   **`<h3>`**: `Factory Direct Sourcing`, `Project-Oriented Supply`, `Curated Selection`, `Dedicated Support`
*   **`<h2>`**: `Planning a project?`

*Critique*: The hierarchy skips from `H2` directly to `H4` in the Collections section, which is a minor accessibility/SEO structural flaw.

## 5. Image & Asset Audit
All images are hosted on Cloudinary and declared in `next.config.ts`.
1.  **Hero Image**: `.../v1776780203/Primo_GF-301_Pvc_Panel_Goals_Floors.png`
    *   *Alt*: `Architectural Wall Panels Installation`
    *   *Config*: `fill={true}`, `priority={true}`
    *   *Risk*: **Missing `sizes` attribute.** This will trigger Next.js warnings and negatively impact LCP (Largest Contentful Paint) because the browser doesn't know how wide the image will be on mobile vs desktop.
2.  **Flagship Panels**:
    *   *Alt*: Uses dynamic `panel.name`.
    *   *Config*: `fill={true}`
    *   *Risk*: **Missing `sizes` attribute.**
3.  **Collection Accordion Images**:
    *   *Images*: GF-302, GF-401, FP-702, Charcoal Fluted Office.
    *   *Alt*: Accurate collection names.
    *   *Config*: Correctly utilizes `sizes="(max-width: 768px) 100vw, 33vw"`.

## 6. Internal Linking
*   **Main Menu / Navbar**: Links to `/wall-panels`, `/about`, `/blog`, `/contact`. Dropdown links to `/primo`, `/elite`, `/primo-fluted`, `/elite-fluted`.
*   **Body Links**: Accurately maps to `/wall-panels/wpc`, `/wall-panels/pvc`, and `/wall-panels/charcoal` (dynamic routes successfully generated at build time).
*   **Broken Links**: None detected.
*   **Orphaned Content**: None detected on this level.

## 7. Keyword Targeting & Content Gaps
*   **B2B / Nationwide Intent**: Strong. Visible body text successfully utilizes: `wholesale`, `mill`, `architects`, `contractors`, `dealers`, `factory direct`, `project buyers`.
*   **Local Intent (Gurgaon/Delhi NCR)**: **WEAK/DISCONNECTED.** The meta description explicitly targets "Gurgaon, Delhi NCR". However, the word "Gurgaon" and "Delhi" appear **zero times** in the visible body text of `WallPanelsExperience.tsx`. This tells Google the page isn't actually about Gurgaon.
*   **Content Gaps**:
    *   No FAQ section (Missing out on "What is the MOQ for wall panels?", "Do you supply to dealers?").
    *   No physical trust signals (Warehouse address, ISO certifications, or "Dispatched from Gurgaon").

---

## 8. Prioritized Issue List & Recommendations

### 🔴 CRITICAL
1.  **Missing Sitemap & Robots.txt**:
    *   *Fix*: Create `src/app/sitemap.ts` and `src/app/robots.ts` immediately to ensure Google crawls the dynamic `/wall-panels/[material]` routes.
2.  **Missing `sizes` on LCP Hero Image**:
    *   *Location*: `src/components/WallPanelsExperience.tsx` (Line 118).
    *   *Fix*: Add `sizes="100vw"` to the hero background image to fix Next.js warnings and Core Web Vitals LCP scoring.

### 🟠 HIGH
1.  **Local Keyword Disconnect**:
    *   *Location*: `WallPanelsExperience.tsx` (Hero or Footer).
    *   *Fix*: Inject "Gurgaon" and "Delhi NCR" naturally into the body text to align with the meta description (e.g., "Dispatched pan-India from our Gurgaon warehouse").
2.  **Missing Schema Markup**:
    *   *Location*: `src/app/wall-panels/page.tsx`.
    *   *Fix*: Inject `CollectionPage` and `LocalBusiness` JSON-LD scripts to explicitly define WholesalerJi as a manufacturer/distributor.

### 🟡 MEDIUM
1.  **Heading Hierarchy Skips**:
    *   *Location*: Collections section (Line 283).
    *   *Fix*: Change the `<h4>` tags for Collection names to `<h3>`.
2.  **Missing `sizes` on Flagship Panel Images**:
    *   *Location*: `src/components/WallPanelsExperience.tsx` (Line 178).
    *   *Fix*: Add `sizes="(max-width: 768px) 50vw, 30vw"`.

---

## 9. Verification Checklist for Implementation
- [ ] Create and verify `sitemap.ts` and `robots.ts`.
- [ ] Add `sizes` prop to Hero and Flagship images in `WallPanelsExperience.tsx`.
- [ ] Inject `Gurgaon` / `Delhi NCR` text into the hero/intro section.
- [ ] Add JSON-LD schema to `page.tsx`.
- [ ] Correct H4 -> H3 heading jump in the Collections accordion.
