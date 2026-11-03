/**
 * MemoryCache behaviour on fresh instances with an injected clock, so TTL tests neither
 * sleep nor depend on timer precision.
 */
import { afterEach, describe, expect, test } from 'bun:test';
import { MemoryCache } from '@/lib/cache/memory-cache';

const created: MemoryCache<unknown>[] = [];

function makeCache<T>(maxSize: number, ttlMs: number, start = 0) {
  let t = start;
  const cache = new MemoryCache<T>(maxSize, ttlMs, () => t);
  created.push(cache as MemoryCache<unknown>);
  return {
    cache,
    advance: (ms: number) => {
      t += ms;
    },
  };
}

afterEach(() => {
  // Each cache owns a cleanup interval.
  for (const cache of created.splice(0)) cache.destroy();
});

describe('MemoryCache', () => {
  test('returns what was stored, and null for a missing key', () => {
    const { cache } = makeCache<unknown>(10, 1000);
    const obj = { name: 'Résumé 科技 🚀', tags: [1, 2, 3] };
    cache.set('', 'empty key');
    cache.set('key:with/odd.chars', obj);
    cache.set('null', null);

    expect(cache.get('')).toBe('empty key');
    expect(cache.get('key:with/odd.chars')).toEqual(obj);
    expect(cache.get('null')).toBeNull();
    expect(cache.has('null')).toBe(true);
    expect(cache.get('missing')).toBeNull();
    expect(cache.has('missing')).toBe(false);
  });

  test('expires an entry after the default TTL', () => {
    const { cache, advance } = makeCache<string>(10, 100);
    cache.set('a', 'value');

    advance(100);
    expect(cache.get('a')).toBe('value');

    advance(1);
    expect(cache.get('a')).toBeNull();
    expect(cache.has('a')).toBe(false);
  });

  test('a per-entry TTL overrides the default', () => {
    const { cache, advance } = makeCache<string>(10, 5000);
    cache.set('short', 'value', 100);
    cache.set('long', 'value', 10_000);

    advance(101);

    expect(cache.get('short')).toBeNull();
    expect(cache.get('long')).toBe('value');
  });

  test('a negative TTL stores an already-expired entry', () => {
    const { cache, advance } = makeCache<string>(10, 1000);
    cache.set('a', 'value', -1);
    advance(0);

    expect(cache.get('a')).toBeNull();
  });

  test('evicts the least recently used entry when full', () => {
    const { cache } = makeCache<string>(3, 1000);
    cache.set('a', 'A');
    cache.set('b', 'B');
    cache.set('c', 'C');
    cache.get('a');

    cache.set('d', 'D');

    expect(cache.get('b')).toBeNull();
    expect(cache.get('a')).toBe('A');
    expect(cache.get('c')).toBe('C');
    expect(cache.get('d')).toBe('D');
  });

  test('overwriting a key when full evicts nothing else', () => {
    const { cache } = makeCache<string>(2, 1000);
    cache.set('a', 'A');
    cache.set('b', 'B');

    cache.set('b', 'B2');

    expect(cache.get('a')).toBe('A');
    expect(cache.get('b')).toBe('B2');
  });

  test('holds exactly maxSize entries after many inserts', () => {
    const { cache } = makeCache<string>(100, 60_000);
    for (let i = 0; i < 250; i++) cache.set(`key${i}`, `value${i}`);

    const kept = Array.from({ length: 250 }, (_, i) => cache.has(`key${i}`));
    expect(kept.filter(Boolean)).toHaveLength(100);
    expect(cache.get('key149')).toBeNull();
    expect(cache.get('key150')).toBe('value150');
    expect(cache.get('key249')).toBe('value249');
  });

  test('evicts an empty-string key like any other', () => {
    const { cache } = makeCache<string>(2, 1000);
    cache.set('', 'empty');
    cache.set('b', 'B');

    cache.set('c', 'C');

    expect(cache.has('')).toBe(false);
    expect(cache.get('b')).toBe('B');
    expect(cache.get('c')).toBe('C');
  });

  test('a cache of size 1 keeps only the latest entry', () => {
    const { cache } = makeCache<string>(1, 1000);
    cache.set('key1', 'value1');
    cache.set('key2', 'value2');

    expect(cache.get('key1')).toBeNull();
    expect(cache.get('key2')).toBe('value2');
  });

  test('delete and clear remove entries, and tolerate missing keys', () => {
    const { cache } = makeCache<string>(10, 1000);
    cache.set('a', 'A');
    cache.set('b', 'B');

    cache.delete('a');
    cache.delete('missing');
    expect(cache.get('a')).toBeNull();
    expect(cache.get('b')).toBe('B');

    cache.clear();
    expect(cache.get('b')).toBeNull();
  });
});
