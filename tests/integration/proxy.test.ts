/**
 * The page and API gate src/proxy.ts applies, exercised with real NextRequest objects.
 * Proxy is the optimistic first check only; every route handler still calls auth().
 * https://nextjs.org/docs/app/guides/authentication#optimistic-checks-with-proxy-optional
 */
import { describe, expect, test } from 'bun:test';
import { NextRequest } from 'next/server';
import { routeAccess } from '@/lib/auth/routeAccess';

const ORIGIN = 'https://resumecanvas.test';

function gate(path: string, signedIn = false) {
  return routeAccess(new NextRequest(`${ORIGIN}${path}`), signedIn);
}

function passesThrough(res: Response): boolean {
  return res.headers.get('x-middleware-next') === '1';
}

describe('anonymous page requests', () => {
  test.each([
    '/dashboard',
    '/settings',
    '/builder/new',
    '/profile',
    '/analytics',
  ])('%s redirects to sign-in with the callback URL', (path) => {
    const res = gate(path);
    expect(res.status).toBe(307);
    const location = new URL(res.headers.get('location')!);
    expect(location.pathname).toBe('/auth/signin');
    expect(location.searchParams.get('callbackUrl')).toBe(path);
  });

  test('the callback URL keeps the query string', () => {
    const res = gate('/builder/abc?tab=preview');
    const location = new URL(res.headers.get('location')!);
    expect(location.searchParams.get('callbackUrl')).toBe(
      '/builder/abc?tab=preview'
    );
  });

  test.each([
    '/',
    '/auth/signin',
    '/auth/forgot-password',
    '/auth/reset-password',
    '/resume/my-public-slug',
    '/manifest.json',
    '/sw.js',
    '/robots.txt',
    '/sitemap.xml',
  ])('%s is public', (path) => {
    expect(passesThrough(gate(path))).toBe(true);
  });

  test('a public prefix matches whole path segments only', () => {
    expect(passesThrough(gate('/auth/signin/extra'))).toBe(true);
    expect(gate('/authx').status).toBe(307);
    expect(gate('/resumes').status).toBe(307);
  });
});

describe('anonymous API requests', () => {
  test.each([
    '/api/resumes',
    '/api/user/stats',
    '/api/resumes/abc/view',
    '/api/test-db',
    '/api/authx',
  ])('%s gets a 401 JSON body, not a redirect', async (path) => {
    const res = gate(path);
    expect(res.status).toBe(401);
    expect(res.headers.get('location')).toBeNull();
    expect(await res.json()).toEqual({ error: 'Unauthorized' });
  });

  test.each([
    '/api/auth/session',
    '/api/auth/callback/credentials',
    '/api/auth/forgot-password',
    '/api/user/register',
    '/api/resume/public/abc',
  ])('%s is public', (path) => {
    expect(passesThrough(gate(path))).toBe(true);
  });
});

describe('signed-in requests', () => {
  test('pass through without exposing the email in a response header', () => {
    const res = gate('/dashboard', true);
    expect(passesThrough(res)).toBe(true);
    expect(res.headers.get('x-user-email')).toBeNull();
  });
});
