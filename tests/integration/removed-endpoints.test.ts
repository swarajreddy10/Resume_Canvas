/**
 * Endpoints deliberately removed because serving them was the defect. Next.js routes only
 * to route modules that exist, so the file's absence is the guarantee.
 */
import { describe, expect, test } from 'bun:test';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const API_DIR = join(import.meta.dir, '../../src/app/api');

describe('removed endpoints', () => {
  test('the API directory this test inspects exists', () => {
    expect(existsSync(join(API_DIR, 'auth/forgot-password/route.ts'))).toBe(true);
  });

  test('/api/test-db (public, returned raw database error messages) is not served', () => {
    expect(existsSync(join(API_DIR, 'test-db/route.ts'))).toBe(false);
  });

  test('/api/auth/check-email (told anyone whether an account exists, and its sign-in method) is not served', () => {
    expect(existsSync(join(API_DIR, 'auth/check-email/route.ts'))).toBe(false);
  });
});
