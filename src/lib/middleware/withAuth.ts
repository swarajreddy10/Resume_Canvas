/**
 * Authentication Middleware
 * Reusable auth wrapper for API routes
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';

interface AuthSession {
  user: {
    email: string;
    name?: string;
  };
}

export type AuthenticatedHandler = (
  request: NextRequest,
  context: { session: AuthSession }
) => Promise<NextResponse>;

export function withAuth(handler: AuthenticatedHandler) {
  return async (request: NextRequest) => {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Authentication required' },
        { status: 401 }
      );
    }

    return handler(request, { session: session as AuthSession });
  };
}
