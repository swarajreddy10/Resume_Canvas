/**
 * Endpoints and pages deliberately removed because serving them was the defect. Next.js
 * routes only to route and page modules that exist, so the file's absence is the guarantee.
 */
import { describe, expect, test } from 'bun:test';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const API_DIR = join(import.meta.dir, '../../src/app/api');
const DASHBOARD_DIR = join(import.meta.dir, '../../src/app/(dashboard)');

describe('removed endpoints', () => {
  test('the directories this test inspects exist', () => {
    expect(existsSync(join(API_DIR, 'auth/forgot-password/route.ts'))).toBe(
      true
    );
    expect(existsSync(join(DASHBOARD_DIR, 'analytics/page.tsx'))).toBe(true);
  });

  test('/api/test-db (public, returned raw database error messages) is not served', () => {
    expect(existsSync(join(API_DIR, 'test-db/route.ts'))).toBe(false);
  });

  test('/api/auth/check-email (told anyone whether an account exists, and its sign-in method) is not served', () => {
    expect(existsSync(join(API_DIR, 'auth/check-email/route.ts'))).toBe(false);
  });

  // No page or component called these, and each answered with invented data.
  test.each([
    ['ai/job-match', 'returned a random salary estimate'],
    [
      'ai/job-matching',
      'asked the model to invent job listings, with a fixed sample when its reply did not parse',
    ],
    [
      'ai/interview-questions',
      'returned fixed sample questions when the reply did not parse',
    ],
    ['analytics/resume', 'a public "coming soon" placeholder'],
    ['analytics/user', 'a public "coming soon" placeholder'],
    ['integrations/linkedin', 'returned the same sample profile for any URL'],
    ['performance/stats', 'showed anyone fixed performance figures'],
  ])('/api/%s (%s) is not served', (route) => {
    expect(existsSync(join(API_DIR, route, 'route.ts'))).toBe(false);
  });

  test.each(['career', 'integrations', 'premium', 'teams'])(
    'the /%s page (a "Coming Soon" placeholder no link led to) is not served',
    (page) => {
      expect(existsSync(join(DASHBOARD_DIR, page, 'page.tsx'))).toBe(false);
    }
  );
});
