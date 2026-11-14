import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wholesale Wall Panels, Artificial Grass & SPC Flooring | Manufacturer & Supplier India | WholesalerJi",
  description: "Direct manufacturer and wholesale supplier of architectural wall panels, designer artificial grass, and rigid core SPC flooring across India. Mill-direct pricing, certified specs, and pan-India project dispatch for contractors, dealers, architects, and builders.",
  metadataBase: new URL("https://wholesalerji.com"),
  alternates: {
    canonical: 'https://wholesalerji.com',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Wholesale Wall Panels, Artificial Grass & SPC Flooring | Manufacturer & Supplier India | WholesalerJi",
    description: "Direct manufacturer and wholesale supplier of architectural wall panels, designer artificial grass, and rigid core SPC flooring across India. Mill-direct pricing and pan-India project dispatch.",
    url: "https://wholesalerji.com",
    siteName: "WholesalerJi",
    locale: "en_IN",
    type: "website",
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon-48.png', sizes: '48x48', type: 'image/png' },
      { url: '/icon-96.png', sizes: '96x96', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

import { ThemeProvider } from "@/components/ThemeProvider";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var hex = localStorage.getItem('custom-theme-color') || '#ef4444';
                  var r = parseInt(hex.slice(1, 3), 16);
                  var g = parseInt(hex.slice(3, 5), 16);
                  var b = parseInt(hex.slice(5, 7), 16);
                  function adjustColor(factor) {
                    var nr = factor > 0 ? Math.min(255, r + (255 - r) * factor) : Math.max(0, r + r * factor);
                    var ng = factor > 0 ? Math.min(255, g + (255 - g) * factor) : Math.max(0, g + g * factor);
                    var nb = factor > 0 ? Math.min(255, b + (255 - b) * factor) : Math.max(0, b + b * factor);
                    return '#' + Math.round(nr).toString(16).padStart(2, '0') + Math.round(ng).toString(16).padStart(2, '0') + Math.round(nb).toString(16).padStart(2, '0');
                  }
                  var root = document.documentElement;
                  root.style.setProperty('--color-amber-500', hex);
                  root.style.setProperty('--color-amber-400', adjustColor(0.15));
                  root.style.setProperty('--color-amber-300', adjustColor(0.30));
                  root.style.setProperty('--color-amber-600', adjustColor(-0.15));
                  root.style.setProperty('--color-amber-700', adjustColor(-0.30));
                } catch (e) {}
              })();
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "@id": "https://wholesalerji.com/#organization",
              "name": "WholesalerJi",
              "url": "https://wholesalerji.com",
              "logo": "https://wholesalerji.com/assets/wholesalerji-logo.png",
              "description": "Direct manufacturer and wholesale supplier of architectural wall panels, designer artificial grass, and rigid core SPC flooring across India.",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Pro No 143, Village Nathupur, Aswar Mohalla",
                "addressLocality": "Gurugram",
                "addressRegion": "Haryana",
                "postalCode": "122002",
                "addressCountry": "IN"
              },
              "areaServed": {
                "@type": "Country",
                "name": "India"
              },
              "knowsAbout": [
                "Wall Panels in India",
                "Wall Panel Manufacturer in India",
                "Artificial Grass Manufacturer in India",
                "Designer Grass Wholesale",
                "SPC Flooring Manufacturer in India",
                "Stone Plastic Composite Rigid Core Flooring"
              ]
            })
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 font-sans transition-colors duration-300">
        {/* Google Analytics (gtag.js) */}
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-MCQ51L27M4"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
        >
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-MCQ51L27M4');
          `}
        </Script>

        <ThemeProvider attribute="class" defaultTheme="system" enableSystem={true}>
          <div className="flex-1 flex flex-col">
            {children}
          </div>
          <Footer />
          <FloatingWhatsApp />
        </ThemeProvider>
      </body>
    </html>
  );
}
