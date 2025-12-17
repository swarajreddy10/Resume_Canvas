import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function proxy(request: NextRequest) {
  const sessionToken =
    request.cookies.get('authjs.session-token') ||
    request.cookies.get('__Secure-authjs.session-token');

  if (!sessionToken) {
    const url = new URL('/auth/signin', request.url);
    url.searchParams.set('callbackUrl', request.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/builder/:path*',
    '/profile/:path*',
    '/settings/:path*',
    '/applications/:path*',
    '/jobs/:path*',
    '/analytics/:path*',
    '/career/:path*',
    '/teams/:path*',
    '/integrations/:path*',
    '/premium/:path*',
  ],
};
