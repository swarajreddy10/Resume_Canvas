/**
 * Cache micro-benchmarks. Run with `bun run bench`.
 *
 * Timings depend on the machine and its load, so they are reported, never asserted:
 * the blocking test suite checks cache behaviour, and CI runs this as a non-blocking job.
 */
import { MemoryCache } from '../src/lib/cache/memory-cache';
import { UltraCache } from '../src/lib/cache/ultra-cache';

const ROUNDS = 20;

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
}

function bench(name: string, run: () => void): void {
  const samples: number[] = [];
  for (let i = 0; i < ROUNDS; i++) {
    const start = performance.now();
    run();
    samples.push(performance.now() - start);
  }
  console.log(
    `${name.padEnd(48)} p50 ${median(samples).toFixed(3)} ms  max ${Math.max(...samples).toFixed(3)} ms`
  );
}

const resume = { id: 1, name: 'Test Resume', data: 'x'.repeat(1000) };

bench('UltraCache set+get, 1 KB object', () => {
  const cache = new UltraCache<typeof resume>(1000, 50);
  cache.set('k', resume);
  cache.get('k');
});

bench('UltraCache 1000 sets into a 100-item cache', () => {
  const cache = new UltraCache<{ i: number }>(100, 50);
  for (let i = 0; i < 1000; i++) cache.set(`k${i}`, { i });
});

bench('MemoryCache 1000 sequential sets', () => {
  const cache = new MemoryCache<string>(1000, 60_000);
  for (let i = 0; i < 1000; i++) cache.set(`k${i}`, `v${i}`);
  cache.destroy();
});

bench('MemoryCache 1000 sequential gets', () => {
  const cache = new MemoryCache<string>(1000, 60_000);
  for (let i = 0; i < 1000; i++) cache.set(`k${i}`, `v${i}`);
  for (let i = 0; i < 1000; i++) cache.get(`k${i}`);
  cache.destroy();
});

bench('MemoryCache 500 sets into a 100-item cache', () => {
  const cache = new MemoryCache<string>(100, 60_000);
  for (let i = 0; i < 500; i++) cache.set(`k${i}`, `v${i}`);
  cache.destroy();
});

// memory-cache.ts creates module-level caches whose cleanup intervals would keep this
// process alive.
process.exit(0);
