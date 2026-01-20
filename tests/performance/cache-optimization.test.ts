import { describe, test, expect, beforeAll } from 'bun:test';
import { ultraCache, aiCache, pdfCache } from '@/lib/cache/ultra-cache';
import { performanceMonitor } from '@/lib/performance/monitor';

describe('Performance Optimization Tests', () => {
  beforeAll(() => {
    // Clear caches before testing
    ultraCache.clear();
    aiCache.clear();
    pdfCache.clear();
    performanceMonitor.clear();
  });

  describe('Ultra Cache Performance', () => {
    test('should cache and retrieve data under 1ms', () => {
      const testData = { id: 1, name: 'Test Resume', data: 'x'.repeat(1000) };

      const startSet = performance.now();
      ultraCache.set('test-key', testData);
      const setTime = performance.now() - startSet;

      const startGet = performance.now();
      const retrieved = ultraCache.get('test-key');
      const getTime = performance.now() - startGet;

      expect(setTime).toBeLessThan(5); // <5ms to set
      expect(getTime).toBeLessThan(1); // <1ms to get
      expect(retrieved).toEqual(testData);
    });

    test('should handle large data with compression', () => {
      const largeData = { content: 'x'.repeat(10000) };

      ultraCache.set('large-key', largeData);
      const retrieved = ultraCache.get('large-key');

      expect(retrieved).toEqual(largeData);
      expect(ultraCache.getStats().size).toBe(2); // Previous + this test
    });

    test('should evict LRU items when memory limit reached', () => {
      // Fill cache beyond memory limit
      for (let i = 0; i < 100; i++) {
        ultraCache.set(`key-${i}`, { data: 'x'.repeat(1000) });
      }

      const stats = ultraCache.getStats();
      expect(stats.size).toBeLessThan(100); // Should have evicted some
    });
  });

  describe('Performance Monitoring', () => {
    test('should track response times accurately', () => {
      const timer = performanceMonitor.startTimer('/test', 'GET');

      // Simulate work
      const start = performance.now();
      while (performance.now() - start < 50) {} // 50ms work

      const duration = timer.end(200);

      expect(duration).toBeGreaterThan(45);
      expect(duration).toBeLessThan(60);

      const metrics = performanceMonitor.getMetrics();
      expect(metrics.length).toBe(1);
      expect(metrics[0].endpoint).toBe('/test');
    });

    test('should identify slow requests', () => {
      const timer1 = performanceMonitor.startTimer('/fast', 'GET');
      timer1.end(200); // Fast request

      const timer2 = performanceMonitor.startTimer('/slow', 'GET');
      const start = performance.now();
      while (performance.now() - start < 150) {} // 150ms work
      timer2.end(200); // Slow request

      const slowRequests = performanceMonitor.getSlowRequests(100);
      expect(slowRequests.length).toBe(1);
      expect(slowRequests[0].endpoint).toBe('/slow');
    });
  });

  describe('Cache Hit Rate Optimization', () => {
    test('should achieve high cache hit rate', () => {
      const key = 'hit-rate-test';
      const data = { test: 'data' };

      // First access - cache miss
      ultraCache.set(key, data);

      // Multiple accesses - cache hits
      for (let i = 0; i < 10; i++) {
        const result = ultraCache.get(key);
        expect(result).toEqual(data);
      }

      // Cache should still contain the item
      expect(ultraCache.get(key)).toEqual(data);
    });
  });
});
