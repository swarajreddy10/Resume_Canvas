import type { NextRequest } from 'next/server';
import { auth } from '@/lib/auth/config';
import { isPublicPath, routeAccess } from '@/lib/auth/routeAccess';

export default async function proxy(request: NextRequest) {
  // Public paths skip the session read entirely.
  if (isPublicPath(request.nextUrl.pathname)) {
    return routeAccess(request, false);
  }

  const session = await auth();
  return routeAccess(request, Boolean(session?.user));
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
