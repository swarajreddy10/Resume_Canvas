import { test, expect, describe, beforeEach } from 'bun:test';
import { MemoryCache } from '@/lib/cache/memory-cache';

describe('MemoryCache - Core Functionality', () => {
  let cache: MemoryCache<string>;

  beforeEach(() => {
    cache = new MemoryCache<string>(3, 1000);
  });

  test('sets and gets values', () => {
    cache.set('key1', 'value1');
    expect(cache.get('key1')).toBe('value1');
  });

  test('returns null for non-existent keys', () => {
    expect(cache.get('nonexistent')).toBeNull();
  });

  test('respects max size (LRU eviction)', () => {
    cache.set('key1', 'value1');
    cache.set('key2', 'value2');
    cache.set('key3', 'value3');
    cache.set('key4', 'value4');

    expect(cache.get('key1')).toBeNull();
    expect(cache.get('key4')).toBe('value4');
  });

  test('expires entries after TTL', async () => {
    cache.set('key1', 'value1', 100);
    expect(cache.get('key1')).toBe('value1');

    await Bun.sleep(150);
    expect(cache.get('key1')).toBeNull();
  });

  test('deletes entries', () => {
    cache.set('key1', 'value1');
    cache.delete('key1');
    expect(cache.get('key1')).toBeNull();
  });

  test('clears all entries', () => {
    cache.set('key1', 'value1');
    cache.set('key2', 'value2');
    cache.clear();

    expect(cache.get('key1')).toBeNull();
    expect(cache.get('key2')).toBeNull();
  });

  test('has() checks existence correctly', () => {
    cache.set('key1', 'value1');
    expect(cache.has('key1')).toBe(true);
    expect(cache.has('key2')).toBe(false);
  });

  test('has() returns false for expired entries', async () => {
    cache.set('key1', 'value1', 100);
    expect(cache.has('key1')).toBe(true);

    await Bun.sleep(150);
    expect(cache.has('key1')).toBe(false);
  });
});

describe('MemoryCache - Edge Cases', () => {
  test('handles empty string keys', () => {
    const cache = new MemoryCache<string>();
    cache.set('', 'empty-key');
    expect(cache.get('')).toBe('empty-key');
  });

  test('handles special character keys', () => {
    const cache = new MemoryCache<string>();
    const specialKeys = [
      'key:with:colons',
      'key/with/slashes',
      'key.with.dots',
      'key-with-dashes',
    ];

    specialKeys.forEach((key) => {
      cache.set(key, 'value');
      expect(cache.get(key)).toBe('value');
    });
  });

  test('handles null and undefined values', () => {
    const cache = new MemoryCache<unknown>();
    cache.set('null', null);
    cache.set('undefined', undefined);

    expect(cache.get('null')).toBe(null);
    expect(cache.get('undefined')).toBe(undefined);
  });

  test('handles object values', () => {
    const cache = new MemoryCache<object>();
    const obj = { name: 'test', value: 123 };
    cache.set('obj', obj);

    expect(cache.get('obj')).toEqual(obj);
  });

  test('handles array values', () => {
    const cache = new MemoryCache<number[]>();
    const arr = [1, 2, 3, 4, 5];
    cache.set('arr', arr);

    expect(cache.get('arr')).toEqual(arr);
  });

  test('overwrites existing keys', () => {
    const cache = new MemoryCache<string>();
    cache.set('key', 'value1');
    cache.set('key', 'value2');

    expect(cache.get('key')).toBe('value2');
  });

  test('custom TTL overrides default', async () => {
    const cache = new MemoryCache<string>(10, 5000);
    cache.set('short', 'value', 100);
    cache.set('long', 'value', 10000);

    await Bun.sleep(150);
    expect(cache.get('short')).toBeNull();
    expect(cache.get('long')).toBe('value');
  });

  test('handles zero TTL', async () => {
    const cache = new MemoryCache<string>(10, 1);
    cache.set('key', 'value', 1);
    await Bun.sleep(10);
    expect(cache.get('key')).toBeNull();
  });

  test('handles negative TTL', async () => {
    const cache = new MemoryCache<string>(10, 1000);
    cache.set('key', 'value', -1);
    await Bun.sleep(10);
    expect(cache.get('key')).toBeNull();
  });

  test('handles max size of 1', () => {
    const cache = new MemoryCache<string>(1, 1000);
    cache.set('key1', 'value1');
    cache.set('key2', 'value2');

    expect(cache.get('key1')).toBeNull();
    expect(cache.get('key2')).toBe('value2');
  });

  test("delete non-existent key doesn't throw", () => {
    const cache = new MemoryCache<string>();
    expect(() => cache.delete('nonexistent')).not.toThrow();
  });

  test("clear empty cache doesn't throw", () => {
    const cache = new MemoryCache<string>();
    expect(() => cache.clear()).not.toThrow();
  });

  test('concurrent set operations', () => {
    const cache = new MemoryCache<string>(100, 1000);

    for (let i = 0; i < 50; i++) {
      cache.set(`key${i}`, `value${i}`);
    }

    for (let i = 0; i < 50; i++) {
      expect(cache.get(`key${i}`)).toBe(`value${i}`);
    }
  });
});

describe('MemoryCache - Memory Safety', () => {
  test('handles large number of entries', () => {
    const cache = new MemoryCache<string>(1000, 60000);

    for (let i = 0; i < 1000; i++) {
      cache.set(`key${i}`, `value${i}`);
    }

    expect(cache.get('key999')).toBe('value999');
  });

  test('handles large string values', () => {
    const cache = new MemoryCache<string>();
    const largeString = 'x'.repeat(10000);
    cache.set('large', largeString);

    expect(cache.get('large')).toBe(largeString);
  });

  test('properly cleans up expired entries', async () => {
    const cache = new MemoryCache<string>(10, 100);

    for (let i = 0; i < 5; i++) {
      cache.set(`key${i}`, `value${i}`);
    }

    await Bun.sleep(150);

    for (let i = 0; i < 5; i++) {
      expect(cache.get(`key${i}`)).toBeNull();
    }
  });
});
