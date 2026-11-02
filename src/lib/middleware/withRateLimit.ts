import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { errorMessages } from '@/lib/constants/messages';
import { PRIVATE_NO_STORE } from '@/lib/middleware/withAuth';
import {
  authAttemptKey,
  authRateLimit,
  RateLimiter,
  RateLimitResult,
  userOrIpKey,
} from '@/lib/security/rateLimit';

/**
 * The 429 every limiter returns. It is private and uncacheable like every response
 * from a signed-in route, which withAuth cannot mark because the limiter answers first.
 */
export function rateLimitedResponse(result: RateLimitResult): NextResponse {
  const retryAfter = Math.max(1, Math.ceil((result.resetTime - Date.now()) / 1000));
  return NextResponse.json(
    { error: errorMessages.rateLimit.exceeded, retryAfter },
    {
      status: 429,
      headers: {
        'Cache-Control': PRIVATE_NO_STORE,
        'Retry-After': retryAfter.toString(),
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': result.resetTime.toString(),
      },
    }
  );
}

async function sessionUserOrIp(request: NextRequest): Promise<string> {
  const session = await auth();
  return userOrIpKey(request, session?.user?.email);
}

/**
 * Limits a route before it runs. By default a signed-in user is counted by account and
 * an anonymous client by IP.
 */
export function withRateLimit(
  rateLimiter: RateLimiter,
  identify: (request: NextRequest) => Promise<string> = sessionUserOrIp
) {
  return function <
    // `never[]` accepts any trailing parameters (such as an optional route context),
    // which `unknown[]` rejects under strict function types.
    T extends (
      request: NextRequest,
      ...args: never[]
    ) => Promise<NextResponse>,
  >(handler: T): T {
    return (async (request: NextRequest, ...args: never[]) => {
      const result = await rateLimiter.check(await identify(request), request);
      if (!result.success) return rateLimitedResponse(result);

      const response = await handler(request, ...args);
      response.headers.set('Cache-Control', PRIVATE_NO_STORE);
      response.headers.set('X-RateLimit-Remaining', result.remaining.toString());
      response.headers.set('X-RateLimit-Reset', result.resetTime.toString());
      return response;
    }) as T;
  };
}

/**
 * The limit every auth endpoint applies first, before validating input: per client IP
 * and the email as sent (empty where the request carries none or it is not a string).
 * Returns the 429 to send, or null to continue.
 */
export async function limitAuthAttempt(
  scope: string,
  request: Request,
  email?: unknown
): Promise<NextResponse | null> {
  const result = await authRateLimit.check(authAttemptKey(scope, request, email), request);
  return result.success ? null : rateLimitedResponse(result);
}
