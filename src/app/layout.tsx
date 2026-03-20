import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans, Geist_Mono } from 'next/font/google';
import './globals.css';
import '../styles/print.css';
import { SessionProvider } from '@/components/providers/SessionProvider';
import { QueryProvider } from '@/components/providers/QueryProvider';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { SpeedInsights } from '@vercel/speed-insights/next';
import Script from 'next/script';

const jakarta = Plus_Jakarta_Sans({
  variable: '--font-jakarta',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#4f46e5',
};

export const metadata: Metadata = {
  title: 'ResumeCanvas - AI Resume Builder',
  description:
    'AI-powered resume builder with real-time ATS optimization and professional templates',
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#4f46e5" />
        <link rel="apple-touch-icon" href="/icon-512.svg" />
      </head>
      <body
        className={`${jakarta.variable} ${geistMono.variable} antialiased`}
        style={{
          fontFamily:
            "var(--font-jakarta), 'Plus Jakarta Sans', system-ui, sans-serif",
        }}
      >
        <ErrorBoundary>
          <QueryProvider>
            <SessionProvider>{children}</SessionProvider>
          </QueryProvider>
        </ErrorBoundary>
        <SpeedInsights />
        <Script id="register-sw" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js').catch(() => {});
              });
            }
          `}
        </Script>
      </body>
    </html>
  );
}
