/**
 * UltraCache behaviour on fresh instances with an injected clock: no wall-clock
 * thresholds and no shared singleton, so order and machine speed cannot change a result.
 * Speed is measured by `bun run bench`, outside the blocking gate.
 */
import { describe, expect, test } from 'bun:test';
import { gzipSync } from 'zlib';
import { UltraCache } from '@/lib/cache/ultra-cache';

function clock(start = 0) {
  let t = start;
  return {
    now: () => t,
    advance: (ms: number) => {
      t += ms;
    },
  };
}

const MB = 1024 * 1024;
const compressedSize = (value: unknown) =>
  gzipSync(JSON.stringify(value)).length;

describe('UltraCache', () => {
  test('returns what was stored, and null for a missing key', () => {
    const cache = new UltraCache<{ id: number; name: string }>(10, 1);
    cache.set('a', { id: 1, name: 'Résumé 科技 🚀' });

    expect(cache.get('a')).toEqual({ id: 1, name: 'Résumé 科技 🚀' });
    expect(cache.get('missing')).toBeNull();
  });

  test('stores values compressed and accounts their size', () => {
    const cache = new UltraCache<{ content: string }>(10, 1);
    const value = { content: 'x'.repeat(10_000) };

    cache.set('large', value);

    expect(cache.get('large')).toEqual(value);
    expect(cache.getStats().memoryUsage).toBe(compressedSize(value));
    expect(cache.getStats().memoryUsage).toBeLessThan(
      JSON.stringify(value).length
    );
  });

  test('expires an entry once its TTL has passed', () => {
    const c = clock();
    const cache = new UltraCache<string>(10, 1, c.now);
    cache.set('a', 'value', 100);

    c.advance(100);
    expect(cache.get('a')).toBe('value');

    c.advance(1);
    expect(cache.get('a')).toBeNull();
    expect(cache.getStats()).toMatchObject({ size: 0, memoryUsage: 0 });
  });

  test('evicts the least recently used entry when the item limit is reached', () => {
    const cache = new UltraCache<string>(3, 1);
    cache.set('a', 'A');
    cache.set('b', 'B');
    cache.set('c', 'C');
    // a is read most often but longest ago; b and c were read since.
    cache.get('a');
    cache.get('a');
    cache.get('a');
    cache.get('b');
    cache.get('c');

    cache.set('d', 'D');

    expect(cache.get('a')).toBeNull();
    expect(cache.get('b')).toBe('B');
    expect(cache.get('c')).toBe('C');
    expect(cache.get('d')).toBe('D');
    expect(cache.getStats().size).toBe(3);
  });

  test('keeps a just-stored entry when the next one is stored', () => {
    const cache = new UltraCache<string>(2, 1);
    cache.set('a', 'A');
    cache.get('a');
    cache.set('b', 'B');

    cache.set('c', 'C');

    expect(cache.get('b')).toBe('B');
    expect(cache.get('c')).toBe('C');
    expect(cache.get('a')).toBeNull();
  });

  test('evicts the oldest entries when the memory limit is reached', () => {
    const value = (i: number) => ({ i, data: `${i}`.repeat(400) });
    const entry = compressedSize(value(0));
    const cache = new UltraCache<ReturnType<typeof value>>(
      100,
      (entry * 3.5) / MB
    );

    for (let i = 0; i < 5; i++) cache.set(`k${i}`, value(i));

    expect(cache.getStats().size).toBe(3);
    expect(cache.get('k0')).toBeNull();
    expect(cache.get('k1')).toBeNull();
    expect(cache.get('k4')).toEqual(value(4));
    expect(cache.getStats().memoryUsage).toBeLessThanOrEqual(entry * 3.5);
  });

  test('overwriting a key replaces its size instead of adding to it', () => {
    const cache = new UltraCache<string>(2, 1);
    cache.set('a', 'A');
    cache.set('b', 'B');

    cache.set('b', 'B2');
    cache.set('b', 'B3');

    expect(cache.get('a')).toBe('A');
    expect(cache.get('b')).toBe('B3');
    expect(cache.getStats().memoryUsage).toBe(
      compressedSize('A') + compressedSize('B3')
    );
  });

  test('does not store a value larger than the whole memory limit', () => {
    const cache = new UltraCache<string>(10, 100 / MB);
    cache.set('small', 'ok');
    cache.set('big', 'stale');

    const incompressible = Array.from({ length: 20 }, () =>
      crypto.randomUUID()
    ).join('');
    expect(compressedSize(incompressible)).toBeGreaterThan(100);

    cache.set('big', incompressible);

    expect(cache.get('big')).toBeNull();
    expect(cache.get('small')).toBe('ok');
  });

  test('delete and clear release memory', () => {
    const cache = new UltraCache<string>(10, 1);
    cache.set('a', 'A');
    cache.set('b', 'B');

    cache.delete('a');
    expect(cache.getStats().memoryUsage).toBe(compressedSize('B'));

    cache.clear();
    expect(cache.getStats()).toMatchObject({ size: 0, memoryUsage: 0 });
  });
});
