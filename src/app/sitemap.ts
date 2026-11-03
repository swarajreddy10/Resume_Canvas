import type { MetadataRoute } from 'next';
import { PUBLIC_ROUTES, SITE_URL } from '@/lib/config/site.config';

// https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
// Only the public marketing and sign-in pages; shared resumes are user content and stay out.
export default function sitemap(): MetadataRoute.Sitemap {
  return PUBLIC_ROUTES.map((path) => ({
    url: path === '/' ? SITE_URL : `${SITE_URL}${path}`,
  }));
}
