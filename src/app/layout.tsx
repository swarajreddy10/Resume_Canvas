import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans, Geist_Mono } from 'next/font/google';
import './globals.css';
import '../styles/print.css';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import {
  OPEN_GRAPH_BASE,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TITLE,
  SITE_URL,
} from '@/lib/config/site.config';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

const jakarta = Plus_Jakarta_Sans({
  variable: '--font-jakarta',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

// Used only by `font-mono` text in two places (auth debug page, cover letter output), so it
// is not preloaded on every route; the browser fetches it when that text renders.
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  preload: false,
});

// One theme colour for the browser UI; public/manifest.json carries the same value.
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#4f46e5',
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_TITLE, template: `%s | ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.svg',
    apple: '/icon-512.svg',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'ResumeCanvas',
  },
  openGraph: OPEN_GRAPH_BASE,
  // Next.js fills twitter:title / twitter:description from each page's resolved openGraph
  // (postProcessMetadata in next/dist/lib/metadata/resolve-metadata.js), so only the card
  // type is set here.
  twitter: { card: 'summary' },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${jakarta.variable} ${geistMono.variable} antialiased`}
        style={{
          fontFamily:
            "var(--font-jakarta), 'Plus Jakarta Sans', system-ui, sans-serif",
        }}
      >
        <ErrorBoundary>{children}</ErrorBoundary>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
