import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@/lib/auth/config';

const publicPaths = [
  '/',
  '/auth/signin',
  '/auth/signup',
  '/auth/forgot-password',
  '/api/auth',
  '/api/user/register',
  '/api/test-db',
];

const publicPatterns = [
  /^\/resume\/[^/]+$/,
  /^\/api\/resume\/public\/.+$/,
  /^\/api\/resumes\/slug\/.+$/,
  /^\/_next\/.+$/,
  /^\/favicon\.ico$/,
  /^\/manifest\.json$/,
  /^\/sw\.js$/,
];

function isPublicPath(pathname: string): boolean {
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return true;
  }

  return publicPatterns.some((pattern) => pattern.test(pathname));
}

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  const session = await auth();

  if (!session?.user) {
    const signInUrl = new URL('/auth/signin', request.url);
    signInUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(signInUrl);
  }

  const response = NextResponse.next();

  response.headers.set('x-user-email', session.user.email || '');

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
