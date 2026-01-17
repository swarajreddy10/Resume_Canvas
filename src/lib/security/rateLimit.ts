export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

export class RateLimiter {
  private store: RateLimitStore = {};
  private maxStoreSize = 10000;
  public readonly config: RateLimitConfig;
  private cleanupInterval: NodeJS.Timeout;

  constructor(config: RateLimitConfig) {
    this.config = config;
    this.cleanupInterval = setInterval(() => this.cleanup(), 60000);
  }

  private cleanup(): void {
    const now = Date.now();
    const keys = Object.keys(this.store);

    for (const key of keys) {
      if (this.store[key].resetTime < now) {
        delete this.store[key];
      }
    }

    if (keys.length > this.maxStoreSize) {
      const sortedKeys = keys.sort(
        (a, b) => this.store[a].resetTime - this.store[b].resetTime
      );
      const toDelete = sortedKeys.slice(0, keys.length - this.maxStoreSize);
      toDelete.forEach((key) => delete this.store[key]);
    }
  }

  private getIdentifier(request: Request): string {
    return (
      request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      'unknown'
    );
  }

  async checkLimit(
    request: Request | string
  ): Promise<{ success: boolean; remaining: number; resetTime: number }> {
    const identifier =
      typeof request === 'string' ? request : this.getIdentifier(request);
    const now = Date.now();

    Object.keys(this.store).forEach((key) => {
      if (this.store[key].resetTime < now) {
        delete this.store[key];
      }
    });

    if (!this.store[identifier] || this.store[identifier].resetTime < now) {
      this.store[identifier] = {
        count: 0,
        resetTime: now + this.config.windowMs,
      };
    }

    const entry = this.store[identifier];

    if (entry.count >= this.config.maxRequests) {
      return {
        success: false,
        remaining: 0,
        resetTime: entry.resetTime,
      };
    }

    entry.count++;

    return {
      success: true,
      remaining: this.config.maxRequests - entry.count,
      resetTime: entry.resetTime,
    };
  }

  destroy(): void {
    clearInterval(this.cleanupInterval);
    this.store = {};
  }
}

import { appConfig } from '@/lib/config/app.config';

export const apiRateLimit = new RateLimiter(appConfig.security.rateLimits.api);
export const aiRateLimit = new RateLimiter(appConfig.security.rateLimits.ai);
export const authRateLimit = new RateLimiter(
  appConfig.security.rateLimits.auth
);
