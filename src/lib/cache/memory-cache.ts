/**
 * In-Memory Cache Utility
 * Simple LRU cache for frequently accessed data
 */

interface CacheEntry<T> {
  value: T;
  expiry: number;
}

export class MemoryCache<T> {
  private cache = new Map<string, CacheEntry<T>>();
  private maxSize: number;
  private ttl: number;

  constructor(maxSize = 100, ttlMs = 5 * 60 * 1000) {
    this.maxSize = maxSize;
    this.ttl = ttlMs;
  }

  set(key: string, value: T, ttl?: number): void {
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value as string;
      if (firstKey) this.cache.delete(firstKey);
    }

    this.cache.set(key, {
      value,
      expiry: Date.now() + (ttl || this.ttl),
    });
  }

  get(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) return null;

    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return null;
    }

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

    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const resumeCache = new MemoryCache<any>(50, 5 * 60 * 1000);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const userCache = new MemoryCache<any>(100, 10 * 60 * 1000);
