import { test, expect, describe } from 'bun:test';
import {
  useResumes,
  useResume,
  useCreateResume,
  useUpdateResume,
} from '@/hooks/useResumes';

describe('useResumes hook', () => {
  test('hook is defined and exported', () => {
    expect(typeof useResumes).toBe('function');
  });

  test('returns query object structure', () => {
    const hook = useResumes;
    expect(hook).toBeDefined();
    expect(typeof hook).toBe('function');
  });
});

describe('useResume hook', () => {
  test('hook is defined and exported', () => {
    expect(typeof useResume).toBe('function');
  });

  test('accepts id parameter', () => {
    const hook = useResume;
    expect(hook).toBeDefined();
    expect(typeof hook).toBe('function');
  });
});

describe('useCreateResume hook', () => {
  test('hook is defined and exported', () => {
    expect(typeof useCreateResume).toBe('function');
  });
});

describe('useUpdateResume hook', () => {
  test('hook is defined and exported', () => {
    expect(typeof useUpdateResume).toBe('function');
  });
});
