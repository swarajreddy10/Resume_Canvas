import type { Metadata } from 'next';

/**
 * Public site identity for metadata, robots.txt and sitemap.xml. The production origin is
 * the Vercel domain; relative metadata URLs resolve against it through `metadataBase`.
 */
export const SITE_URL = 'https://resumecanvas.vercel.app';
export const SITE_NAME = 'ResumeCanvas';
export const SITE_TITLE = 'ResumeCanvas - AI Resume Builder';
export const SITE_DESCRIPTION =
  'AI-assisted resume builder with ATS keyword checks, live preview, five templates, and PDF export';

// Metadata objects merge shallowly across segments, so a page that sets `openGraph`
// replaces the layout's whole object. Pages spread this base and add their own url/title.
export const OPEN_GRAPH_BASE = {
  type: 'website',
  siteName: SITE_NAME,
  locale: 'en_US',
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
} satisfies Metadata['openGraph'];

/** Public, indexable routes. Everything else is behind sign-in or is an API. */
export const PUBLIC_ROUTES = ['/', '/auth/signin'] as const;
