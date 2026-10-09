# WholesalerJi About Page SEO Forensic Audit

**Date**: 2026-10-10
**Target**: `https://wholesalerji.com/about`
**Scope**: Route structure, metadata, heading hierarchy, images, schema, internal linking, and CWV risks. (Read-Only Analysis)

---

## 1. Executive Summary
The WholesalerJi About page (`/about`) is a visually premium, heavily animated storytelling page designed to build B2B trust. It accurately separates its search intent (brand credibility, project supply, logistics) from the product catalog, avoiding keyword cannibalization. Technically, the page is excellent: it respects `prefers-reduced-motion` for accessibility, uses optimized Next.js `<Image>` components with proper `priority` for the LCP hero, and has a flawless heading hierarchy. The primary SEO gaps are a lack of page-specific `AboutPage` JSON-LD schema and missing contextual internal links to specific panel collections.

---

## 2. Exact Metadata & Heading Hierarchy

### Metadata (`src/app/about/page.tsx`)
*   **Title Tag**: `About WholesalerJi | Wholesale Wall Panels & Project Supply`
*   **Meta Description**: `Discover WholesalerJi, a wholesale wall-panel supplier serving contractors, retailers, designers and projects with PVC, WPC, fluted and decorative wall-panel solutions.`
*   **Canonical URL**: `https://wholesalerji.com/about`
*   **Robots**: `index: true, follow: true`
*   **Open Graph**: Fully defined and accurate.

### Heading Hierarchy (`src/app/about/AboutClient.tsx`)
*   **`<h1>` (Visually Hidden)**: `WholesalerJi — From Panel to Project` (Line 172)
*   **`<h2>`**: `We don't just sell wall panels.` / `We help turn empty walls into spaces people remember.`
*   **`<h2>`**: `A wall is where every project begins.`
*   **`<h2>`**: `From Panel to Project`
    *   **`<h3>`**: `Discover`, `Select`, `Source`, `Supply`, `Arrive`, `Transform` (The Journey)
*   **`<h2>`**: `The panel is only half the story.`
*   **`<h2>`**: `Built around the people who build spaces.`
    *   **`<h3>`**: `Contractors`, `Interior Designers`, `Retailers`, `Projects` (Accordion)
*   **`<h2>`**: `The Scale Behind the Screen`
*   **`<h2>`**: `Built for Scale. Designed for Spaces.`
    *   **`<h3>`**: `Material First`, `Supply Matters`, `Projects Over Transactions`
*   **`<h2>`**: `What will you build on it?`

*Critique*: The hierarchy is perfect. It walks Googlebot through the exact business model, audience, and philosophy in a clean tree structure.

---

## 3. Trust & Business Claims (Requires Verification)
The "Scale Behind the Screen" section (Lines 412-427) makes specific numerical claims that are identical to the homepage. These must be verified by the business owner to ensure they are factual and not placeholders:
*   `500+ Authorized Dealers`
*   `2.5M+ Sq. Ft. Delivered`
*   `18 States`
*   `PAN INDIA Logistics`

---

## 4. Images and Performance
*   **Hero Image (LCP)**: Uses the Next.js `<Image>` component with `priority` and `sizes="100vw"`. This correctly instructs the browser to preload the image, avoiding the LCP bottleneck seen on the homepage.
*   **Animated Journey & Accordion Images**: All use `<Image>` with `fill` and responsive `sizes` attributes (`sizes="(max-width: 768px) 100vw, 50vw"`). 
*   **Performance Risk**: Low. The page handles heavy GSAP animations but cleanly separates the DOM elements and uses optimized Next.js images.

---

## 5. Structured Data
*   **Status**: Inherits the `Organization` schema from `layout.tsx`.
*   **Missing**: No page-specific JSON-LD (e.g., `AboutPage` schema). While not strictly required, adding `AboutPage` schema can explicitly tell search engines what the page's primary entity and purpose are.

---

## 6. Internal Links and Conversion
*   **Current State**: 
    *   Link to `/wall-panels` ("Explore Wall Panels").
    *   Link to `/contact` ("Start a Project").
*   **Missing Opportunities**: The "Discover" and "Select" steps of the Journey, as well as the Accordion descriptions, mention PVC, WPC, and Charcoal panels. None of these keywords are hyperlinked to their respective collection pages (`/wall-panels/pvc`, `/wall-panels/wpc`, `/wall-panels/charcoal`).

---

## 7. Accessibility and Responsiveness
*   **Accessibility Win**: The component checks `window.matchMedia('(prefers-reduced-motion: reduce)')` (Line 48) and dynamically scales back GSAP translations and fades for users who suffer from motion sickness.
*   **Keyboard Navigation**: The Accordion (Line 351) is fully keyboard accessible (`onKeyDown` Enter/Space triggers) and correctly uses ARIA attributes (`aria-expanded`, `aria-controls`, `role="region"`). 

---

## 8. Prioritized Issue List & Recommendations

### 🔴 CRITICAL
*   *None.* The page is technically very sound.

### 🟠 HIGH
1.  **Factual Verification**: Verify the dealer count, square footage, and states data in the "Scale" section.

### 🟡 MEDIUM
1.  **Inject `AboutPage` Schema**: Add page-level JSON-LD in `page.tsx` referencing the main `Organization` entity.
2.  **Contextual Internal Linking**: Add inline links to specific product categories (e.g., PVC, WPC, Charcoal) within the text of the Accordion (Line 161-164) and Journey sections to pass link equity deeper into the site.

---

## 9. Required Live Verification
*   **Google Search Console**: Run a Live URL inspection to ensure Googlebot successfully renders the text hidden behind the initial GSAP opacity states and horizontal scroll sections. 
*   **Fact Check**: Business owner must confirm scale numbers.
