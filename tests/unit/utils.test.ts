import { test, expect, describe } from 'bun:test';
import { cn } from '@/lib/utils';

describe('Utils - cn function', () => {
  test('merges class names correctly', () => {
    expect(cn('text-red-500', 'bg-blue-500')).toBe('text-red-500 bg-blue-500');
  });

  test('handles conditional classes', () => {
    expect(cn('base', false && 'hidden', 'visible')).toBe('base visible');
  });

  test('merges tailwind classes with conflicts', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4');
  });

  test('handles empty inputs', () => {
    expect(cn()).toBe('');
  });
});
