/**
 * Ultra-Fast Compressed Cache
 * Maximum performance with compression and smart eviction
 */

import { gzipSync, gunzipSync } from 'zlib';

interface CompressedCacheEntry {
  data: Buffer;
  expiry: number;
  hits: number;
  size: number;
}

export class UltraCache<T> {
  private cache = new Map<string, CompressedCacheEntry>();
  private maxSize: number;
  private maxMemory: number;
  private currentMemory = 0;

  constructor(maxSize = 1000, maxMemoryMB = 50) {
    this.maxSize = maxSize;
    this.maxMemory = maxMemoryMB * 1024 * 1024; // Convert to bytes
  }

  set(key: string, value: T, ttl = 300000): void {
    const serialized = JSON.stringify(value);
    const compressed = gzipSync(serialized);
    const size = compressed.length;

    // Evict if needed
    this.evictIfNeeded(size);

    const entry: CompressedCacheEntry = {
      data: compressed,
      expiry: Date.now() + ttl,
      hits: 0,
      size,
    };

    this.cache.set(key, entry);
    this.currentMemory += size;
  }

  get(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiry) {
      this.delete(key);
      return null;
    }

    entry.hits++;
    const decompressed = gunzipSync(entry.data);
    return JSON.parse(decompressed.toString());
  }

  private evictIfNeeded(newSize: number): void {
    // Memory-based eviction
    while (
      this.currentMemory + newSize > this.maxMemory &&
      this.cache.size > 0
    ) {
      this.evictLRU();
    }

    // Size-based eviction
    while (this.cache.size >= this.maxSize) {
      this.evictLRU();
    }
  }

  private evictLRU(): void {
    let lruKey = '';
    let lruHits = Infinity;

    for (const [key, entry] of this.cache.entries()) {
      if (entry.hits < lruHits) {
        lruHits = entry.hits;
        lruKey = key;
      }
    }

    if (lruKey) {
      this.delete(lruKey);
    }
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

// Ultra-fast caches for different data types
export const ultraCache = new UltraCache(2000, 100); // 2000 items, 100MB
export const aiCache = new UltraCache(500, 50); // AI responses
export const pdfCache = new UltraCache(100, 200); // PDF buffers
