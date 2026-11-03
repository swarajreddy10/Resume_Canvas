/**
 * The optimistic access gate src/proxy.ts applies before a route renders. It only decides
 * from the session cookie; every route handler and data read still checks auth() itself,
 * because Proxy "should not be your only line of defense".
 * https://nextjs.org/docs/app/guides/authentication#optimistic-checks-with-proxy-optional
 */
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Public by whole path segment: '/auth' covers '/auth/signin' but not '/authx'.
const PUBLIC_PREFIXES = [
  '/auth', // sign-in, forgot-password, reset-password pages
  '/api/auth', // Auth.js handlers and the password-reset endpoints
  '/api/user/register',
  '/api/resume/public', // published resumes
  '/resume', // published resume pages
  '/_next',
  '/_vercel', // Web Analytics and Speed Insights scripts
  '/favicon.ico',
  '/manifest.json',
  '/sw.js',
];

function underPrefix(pathname: string, prefix: string): boolean {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

export function isPublicPath(pathname: string): boolean {
  return pathname === '/' || PUBLIC_PREFIXES.some((prefix) => underPrefix(pathname, prefix));
}

export function routeAccess(request: NextRequest, signedIn: boolean): NextResponse {
  const { pathname, search } = request.nextUrl;

  if (signedIn || isPublicPath(pathname)) {
    return NextResponse.next();
  }

  // An API client cannot follow a redirect to an HTML sign-in page.
  if (underPrefix(pathname, '/api')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const signInUrl = new URL('/auth/signin', request.url);
  signInUrl.searchParams.set('callbackUrl', `${pathname}${search}`);
  return NextResponse.redirect(signInUrl);
}
