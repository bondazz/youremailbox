import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from 'next/font/google';
import "./globals.css";

export const viewport: Viewport = {
  themeColor: '#4D2F97',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

// Optimized font loading with display=swap and subset
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
  adjustFontFallback: true,
});

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit',
  preload: true,
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  title: "YourEmailBox - Premium Temporary Email & Private Digital Identity",
  description: "Secure, anonymous, and disposable temporary email service. Protect your privacy with enterprise-grade infrastructure. No registration required.",
  metadataBase: new URL('https://youremailbox.com'),
  openGraph: {
    images: [
      {
        url: '/og-image-global.png',
        width: 1200,
        height: 630,
        alt: 'YourEmailBox - Premium Temporary Email Service',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-image-global.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  other: {
    'google-adsense-account': 'ca-pub-2757499834056766',
  },
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang?: string }>;
}) {
  const { lang } = await params;

  return (
    <html lang={lang || 'en'} className={`${inter.variable} ${outfit.variable}`}>
      <head>
        <link rel="icon" href="/logo.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://googleads.g.doubleclick.net" crossOrigin="anonymous" />

        {/* Google AdSense - Auto Ads configuration */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body className={inter.className} style={{ fontFamily: "var(--font-inter), system-ui, -apple-system, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
