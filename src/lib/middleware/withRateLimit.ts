/**
 * Rate Limiting Middleware
 * Reusable rate limit wrapper for API routes
 */

import { NextRequest, NextResponse } from 'next/server';
import { RateLimiter } from '@/lib/security/rateLimit';

type Handler = (
  request: NextRequest,
  context?: unknown
) => Promise<NextResponse>;

export function withRateLimit(limiter: RateLimiter) {
  return function (handler: Handler): Handler {
    return async (request: NextRequest, context?: unknown) => {
      const result = await limiter.checkLimit(request);

      if (!result.success) {
        return NextResponse.json(
          {
            error: 'Too Many Requests',
            message: 'Rate limit exceeded',
            resetTime: result.resetTime,
          },
          {
            status: 429,
            headers: {
              'X-RateLimit-Limit': String(limiter.config.maxRequests),
              'X-RateLimit-Remaining': String(result.remaining),
              'X-RateLimit-Reset': String(result.resetTime),
            },
          }
        );
      }

      return handler(request, context);
    };
  };
}
