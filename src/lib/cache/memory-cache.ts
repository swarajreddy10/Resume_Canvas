/**
 * In-Memory Cache Utility
 * Simple LRU cache for frequently accessed data
 */

interface CacheEntry<T> {
  value: T;
  expiry: number;
}

export class MemoryCache<T> {
  // A Map iterates in insertion order; get() re-inserts, so the first key is the LRU.
  private cache = new Map<string, CacheEntry<T>>();
  private maxSize: number;
  private ttl: number;
  private now: () => number;
  private cleanupInterval: NodeJS.Timeout;

  constructor(
    maxSize = 100,
    ttlMs = 5 * 60 * 1000,
    now: () => number = Date.now
  ) {
    this.maxSize = maxSize;
    this.ttl = ttlMs;
    this.now = now;
    this.cleanupInterval = setInterval(() => this.cleanup(), 60000);
  }

  private cleanup(): void {
    const now = this.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiry) {
        this.cache.delete(key);
      }
    }
  }

  set(key: string, value: T, ttl?: number): void {
    // An overwrite replaces its own entry and never evicts another.
    this.cache.delete(key);

    if (this.cache.size >= this.maxSize) {
      const oldest = this.cache.keys().next();
      if (!oldest.done) this.cache.delete(oldest.value);
    }

    this.cache.set(key, {
      value,
      expiry: this.now() + (ttl || this.ttl),
    });
  }

  get(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) return null;

    if (this.now() > entry.expiry) {
      this.cache.delete(key);
      return null;
    }

    this.cache.delete(key);
    this.cache.set(key, entry);
    return entry.value;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    if (this.now() > entry.expiry) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  destroy(): void {
    clearInterval(this.cleanupInterval);
    this.cache.clear();
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const resumeCache = new MemoryCache<any>(50, 5 * 60 * 1000);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const userCache = new MemoryCache<any>(100, 10 * 60 * 1000);
