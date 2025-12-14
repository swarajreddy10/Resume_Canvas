interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

class RateLimiter {
  private store: RateLimitStore = {};
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
  }

  async checkLimit(
    identifier: string
  ): Promise<{ success: boolean; remaining: number; resetTime: number }> {
    const now = Date.now();

    // Clean up expired entries
    Object.keys(this.store).forEach((key) => {
      if (this.store[key].resetTime < now) {
        delete this.store[key];
      }
    });

    // Get or create entry for this identifier
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
}

// Rate limiters for different endpoints
export const apiRateLimit = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100,
});

export const aiRateLimit = new RateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 50,
});

export const authRateLimit = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5,
});

export async function rateLimit(
  request: Request,
  limiter: RateLimiter = apiRateLimit
): Promise<{ success: boolean; remaining: number; resetTime: number }> {
  const ip =
    request.headers.get('x-forwarded-for') ||
    request.headers.get('x-real-ip') ||
    'unknown';

  return limiter.checkLimit(ip);
}
