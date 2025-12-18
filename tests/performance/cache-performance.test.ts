import { test, expect, describe } from 'bun:test';
import { MemoryCache } from '@/lib/cache/memory-cache';

describe('Cache Performance Tests', () => {
  test('handles 1000 sequential writes efficiently', () => {
    const cache = new MemoryCache<string>(1000, 60000);
    const startTime = performance.now();

    for (let i = 0; i < 1000; i++) {
      cache.set(`key${i}`, `value${i}`);
    }

    const endTime = performance.now();
    const duration = endTime - startTime;

    expect(duration).toBeLessThan(100);
  });

  test('handles 1000 sequential reads efficiently', () => {
    const cache = new MemoryCache<string>(1000, 60000);

    for (let i = 0; i < 1000; i++) {
      cache.set(`key${i}`, `value${i}`);
    }

    const startTime = performance.now();

    for (let i = 0; i < 1000; i++) {
      cache.get(`key${i}`);
    }

    const endTime = performance.now();
    const duration = endTime - startTime;

    expect(duration).toBeLessThan(50);
  });

  test('handles mixed operations efficiently', () => {
    const cache = new MemoryCache<string>(500, 60000);
    const startTime = performance.now();

    for (let i = 0; i < 500; i++) {
      cache.set(`key${i}`, `value${i}`);
      cache.get(`key${i}`);
      cache.has(`key${i}`);
    }

    const endTime = performance.now();
    const duration = endTime - startTime;

    expect(duration).toBeLessThan(100);
  });

  test('LRU eviction performs efficiently', () => {
    const cache = new MemoryCache<string>(100, 60000);
    const startTime = performance.now();

    for (let i = 0; i < 500; i++) {
      cache.set(`key${i}`, `value${i}`);
    }

    const endTime = performance.now();
    const duration = endTime - startTime;

    expect(duration).toBeLessThan(100);
  });

  test('concurrent operations maintain performance', async () => {
    const cache = new MemoryCache<string>(1000, 60000);
    const startTime = performance.now();

    const operations = Array.from({ length: 100 }, (_, i) =>
      Promise.all([
        cache.set(`key${i}`, `value${i}`),
        cache.get(`key${i}`),
        cache.has(`key${i}`),
      ])
    );

    await Promise.all(operations);

    const endTime = performance.now();
    const duration = endTime - startTime;

    expect(duration).toBeLessThan(200);
  });
});
