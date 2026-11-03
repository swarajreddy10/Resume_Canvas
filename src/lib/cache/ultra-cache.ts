/**
 * Compressed in-memory cache with least-recently-used eviction, bounded by item count
 * and by compressed bytes.
 */

import { gzipSync, gunzipSync } from 'zlib';

interface CompressedCacheEntry {
  data: Buffer;
  expiry: number;
  size: number;
}

export class UltraCache<T> {
  // A Map iterates in insertion order; get() re-inserts, so the first key is the LRU.
  private cache = new Map<string, CompressedCacheEntry>();
  private maxSize: number;
  private maxMemory: number;
  private currentMemory = 0;
  private now: () => number;

  constructor(maxSize = 1000, maxMemoryMB = 50, now: () => number = Date.now) {
    this.maxSize = maxSize;
    this.maxMemory = maxMemoryMB * 1024 * 1024; // Convert to bytes
    this.now = now;
  }

  set(key: string, value: T, ttl = 300000): void {
    const serialized = JSON.stringify(value);
    const compressed = gzipSync(serialized);
    const size = compressed.length;

    // An overwrite replaces the old entry and its size.
    this.delete(key);

    // A value larger than the whole budget can never fit: skip it rather than evict
    // every entry and still not have room.
    if (size > this.maxMemory) return;

    while (
      this.cache.size > 0 &&
      (this.cache.size >= this.maxSize ||
        this.currentMemory + size > this.maxMemory)
    ) {
      this.evictLRU();
    }

    const entry: CompressedCacheEntry = {
      data: compressed,
      expiry: this.now() + ttl,
      size,
    };

    this.cache.set(key, entry);
    this.currentMemory += size;
  }

  get(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (this.now() > entry.expiry) {
      this.delete(key);
      return null;
    }

    this.cache.delete(key);
    this.cache.set(key, entry);
    const decompressed = gunzipSync(entry.data);
    return JSON.parse(decompressed.toString());
  }

  private evictLRU(): void {
    const oldest = this.cache.keys().next();
    if (!oldest.done) this.delete(oldest.value);
  }

  delete(key: string): void {
    const entry = this.cache.get(key);
    if (entry) {
      this.currentMemory -= entry.size;
      this.cache.delete(key);
    }
  }

  clear(): void {
    this.cache.clear();
    this.currentMemory = 0;
  }

  getStats() {
    return {
      size: this.cache.size,
      memoryUsage: this.currentMemory,
      memoryUsageMB: (this.currentMemory / 1024 / 1024).toFixed(2),
    };
  }
}

export const pdfCache = new UltraCache(100, 200); // PDF buffers: 100 items, 200MB
