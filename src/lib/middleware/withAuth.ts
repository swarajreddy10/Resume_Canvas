/**
 * Authentication Middleware
 * One wrapper for every route that serves a signed-in user's data: it rejects anonymous
 * requests and marks every response private and uncacheable, so a browser or shared
 * proxy never stores or replays one user's data.
 * https://vercel.com/docs/caching/cache-control-headers
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';

export interface AuthSession {
  user: {
    email: string;
    name?: string;
  };
}

export const PRIVATE_NO_STORE = 'private, no-store';

export type AuthenticatedHandler<P = Record<string, string>> = (
  request: NextRequest,
  context: { session: AuthSession; params: Promise<P> }
) => Promise<NextResponse>;

export function withAuth<P = Record<string, string>>(handler: AuthenticatedHandler<P>) {
  return async (request: NextRequest, routeContext?: { params: Promise<P> }) => {
    const session = await auth();

    const response = session?.user?.email
      ? await handler(request, {
          session: session as AuthSession,
          params: routeContext?.params ?? Promise.resolve({} as P),
        })
      : NextResponse.json(
          { error: 'Unauthorized', message: 'Authentication required' },
          { status: 401 }
        );

    response.headers.set('Cache-Control', PRIVATE_NO_STORE);
    return response;
  };
}
