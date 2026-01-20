/**
 * High-Performance Caching Middleware
 * Optimized for sub-100ms API responses
 */

import { NextRequest, NextResponse } from 'next/server';
import { resumeCache } from '@/lib/cache/memory-cache';

export interface CacheConfig {
  ttl?: number;
  keyGenerator?: (req: NextRequest) => string;
  skipCache?: (req: NextRequest) => boolean;
}

export function withCache(
  handler: (req: NextRequest) => Promise<NextResponse>,
  config: CacheConfig = {}
) {
  const { ttl = 60000, keyGenerator, skipCache } = config;

  return async (req: NextRequest) => {
    // Skip cache for mutations
    if (req.method !== 'GET' || (skipCache && skipCache(req))) {
      return handler(req);
    }

    const cacheKey = keyGenerator
      ? keyGenerator(req)
      : `${req.method}:${req.url}`;

    // Try cache first
    const cached = resumeCache.get(cacheKey);
    if (cached) {
      return NextResponse.json(cached, {
        headers: {
          'Cache-Control': 'public, max-age=60',
          'X-Cache': 'HIT',
        },
      });
    }

    // Execute handler
    const response = await handler(req);

    // Cache successful responses
    if (response.ok) {
      try {
        const data = await response.clone().json();
        resumeCache.set(cacheKey, data, ttl);
      } catch {
        // Non-JSON response, skip caching
      }
    }

    return response;
  };
}
