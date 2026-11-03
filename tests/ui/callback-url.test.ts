import { describe, expect, test } from 'bun:test';
import { safeCallbackUrl } from '@/lib/utils/callbackUrl';

describe('safeCallbackUrl', () => {
  test('keeps same-origin paths with query and hash', () => {
    expect(safeCallbackUrl('/dashboard')).toBe('/dashboard');
    expect(safeCallbackUrl('/builder/abc?tab=1#top')).toBe(
      '/builder/abc?tab=1#top'
    );
    expect(safeCallbackUrl('/résumé')).toBe('/résumé');
  });

  test('falls back to /dashboard when missing or empty', () => {
    expect(safeCallbackUrl(null)).toBe('/dashboard');
    expect(safeCallbackUrl(undefined)).toBe('/dashboard');
    expect(safeCallbackUrl('')).toBe('/dashboard');
  });

  test('rejects anything that leaves the origin or runs script', () => {
    for (const bad of [
      'https://evil.example/',
      'javascript:alert(1)',
      ' javascript:alert(1)',
      '//evil.example',
      '/\\evil.example',
      '/\t/evil.example',
      '/\n/evil.example',
      'dashboard',
    ]) {
      expect(safeCallbackUrl(bad)).toBe('/dashboard');
    }
  });

  test('every accepted value resolves to the page origin', () => {
    const origin = 'https://resumecanvas.vercel.app';
    for (const v of [
      '/a',
      '/a/../b',
      '/%2F%2Fevil.example',
      '/?next=//evil.example',
    ]) {
      expect(new URL(safeCallbackUrl(v), origin).origin).toBe(origin);
    }
  });
});
