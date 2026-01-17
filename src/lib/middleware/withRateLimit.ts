import { NextRequest, NextResponse } from 'next/server';
import { RateLimiter } from '@/lib/security/rateLimit';

export function withRateLimit(rateLimiter: RateLimiter) {
  return function <
    T extends (
      request: NextRequest,
      ...args: unknown[]
    ) => Promise<NextResponse>,
  >(handler: T): T {
    return (async (request: NextRequest, ...args: unknown[]) => {
      const result = await rateLimiter.checkLimit(request);

      if (!result.success) {
        return NextResponse.json(
          {
            error: 'Rate limit exceeded',
            retryAfter: Math.ceil((result.resetTime - Date.now()) / 1000),
          },
          {
            status: 429,
            headers: {
              'Retry-After': Math.ceil(
                (result.resetTime - Date.now()) / 1000
              ).toString(),
              'X-RateLimit-Remaining': '0',
              'X-RateLimit-Reset': result.resetTime.toString(),
            },
          }
        );
      }

      const response = await handler(request, ...args);

      // Add rate limit headers to successful responses
      response.headers.set(
        'X-RateLimit-Remaining',
        result.remaining.toString()
      );
      response.headers.set('X-RateLimit-Reset', result.resetTime.toString());

      return response;
    }) as T;
  };
}
