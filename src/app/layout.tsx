import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wholesale Wall Panels in India | PVC, WPC & Fluted | WholesalerJi",
  description: "Wholesale PVC, WPC, fluted and decorative wall panels for contractors, retailers and projects. Bulk pricing and pan-India supply from WholesalerJi.",
  metadataBase: new URL("https://wholesaleji.com"),
  alternates: {
    canonical: 'https://wholesaleji.com/',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Wholesale Wall Panels in India | PVC, WPC & Fluted | WholesalerJi",
    description: "Wholesale PVC, WPC, fluted and decorative wall panels for contractors, retailers and projects. Bulk pricing and pan-India supply from WholesalerJi.",
    url: "https://wholesaleji.com",
    siteName: "Wholesaleji",
    locale: "en_IN",
    type: "website",
  },
  icons: {
    icon: '/assets/wholsalerji-logo.jpeg',
    shortcut: '/assets/wholsalerji-logo.jpeg',
    apple: '/assets/wholsalerji-logo.jpeg',
  },
};

import { ThemeProvider } from "@/components/ThemeProvider";
import Footer from "@/components/Footer";

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
                  var hex = localStorage.getItem('custom-theme-color');
                  if (!hex || !hex.startsWith('#')) return;
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
      </head>
      <body className="min-h-full flex flex-col bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 font-sans transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <div className="flex-1 flex flex-col">
            {children}
          </div>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
