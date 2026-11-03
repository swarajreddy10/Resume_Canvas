/**
 * Rate limits on every auth endpoint, against a real MongoDB. Auth endpoints count per
 * client IP and email together; signed-in routes count per user. Every limiter response,
 * the 429 included, is private and uncacheable.
 */
import { afterAll, beforeAll, beforeEach, describe, expect, mock, test } from 'bun:test';
import bcryptjs from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';
import { jsonRequest, startMongo, stopMongo } from '../helpers/mongo';

mock.module('@/lib/email/resend.service', () => ({
  sendResetEmail: async () => ({ success: true }),
}));

const OWNER = 'limited-owner@example.com';
const PASSWORD = 'Owner12345';
let LIMIT: number; // the configured auth limit, read once the test database is up

type Handler = (r: Request) => Promise<Response>;
let register: Handler;
let forgot: Handler;
let reset: Handler;
let validate: Handler;
let authorizeCredentials: typeof import('@/lib/auth/config').authorizeCredentials;
let User: typeof import('@/lib/db/models/User').User;

let ipCounter = 0;
/** A client address no other test in this process uses. */
function freshIp(): string {
  ipCounter += 1;
  return `203.0.113.${ipCounter}`;
}

beforeAll(async () => {
  await startMongo();
  ({ POST: register } = (await import('@/app/api/user/register/route')) as never);
  ({ POST: forgot } = (await import('@/app/api/auth/forgot-password/route')) as never);
  ({ POST: reset } = (await import('@/app/api/auth/reset-password/route')) as never);
  ({ POST: validate } = (await import('@/app/api/auth/validate-reset-token/route')) as never);
  ({ authorizeCredentials } = await import('@/lib/auth/config'));
  ({ User } = await import('@/lib/db/models/User'));
  const { appConfig } = await import('@/lib/config/app.config');
  LIMIT = appConfig.security.rateLimits.auth.maxRequests;
  const { default: connectDB } = await import('@/lib/db/connection');
  await connectDB();
}, 60_000);

afterAll(async () => {
  await stopMongo();
});

beforeEach(async () => {
  await User.deleteMany({});
  await User.create({ email: OWNER, name: 'Owner', password: await bcryptjs.hash(PASSWORD, 10) });
});

function expectLimited(res: Response) {
  expect(res.status).toBe(429);
  expect(Number(res.headers.get('retry-after'))).toBeGreaterThan(0);
  expect(res.headers.get('cache-control')).toBe('private, no-store');
}

function signInRequest(ip: string): Request {
  return new Request('http://test/api/auth/callback/credentials', {
    method: 'POST',
    headers: { 'x-forwarded-for': ip },
  });
}

describe('credentials sign-in', () => {
  test(`refuses even the right password after the limit of attempts from one IP for one email`, async () => {
    const ip = freshIp();
    for (let i = 0; i < LIMIT; i++) {
      expect(await authorizeCredentials({ email: OWNER, password: 'Wrong12345' }, signInRequest(ip))).toBeNull();
    }
    const blocked = await authorizeCredentials({ email: OWNER, password: PASSWORD }, signInRequest(ip)).then(
      () => 'signed in',
      (error: { code?: string }) => error.code
    );
    expect(blocked).toBe('rate_limited');

    // Another client is not locked out of the account by this one.
    expect(await authorizeCredentials({ email: OWNER, password: PASSWORD }, signInRequest(freshIp()))).not.toBeNull();
  });
});

describe('POST /api/user/register', () => {
  test(`answers 429 after the limit of attempts from one IP for one email`, async () => {
    const ip = freshIp();
    const body = { email: 'someone@example.com', name: 'S', password: 'Valid12345' };
    for (let i = 0; i < LIMIT; i++) {
      expect((await register(jsonRequest('http://test/api/user/register', body, ip))).status).toBe(200);
    }
    expectLimited(await register(jsonRequest('http://test/api/user/register', body, ip)));
  });
});

describe('POST /api/auth/forgot-password', () => {
  test('counts per IP and email: one address being limited does not block another', async () => {
    const ip = freshIp();
    for (let i = 0; i < LIMIT; i++) {
      expect((await forgot(jsonRequest('http://test/api/auth/forgot-password', { email: OWNER }, ip))).status).toBe(200);
    }
    expectLimited(await forgot(jsonRequest('http://test/api/auth/forgot-password', { email: OWNER }, ip)));
    const other = await forgot(jsonRequest('http://test/api/auth/forgot-password', { email: 'other@example.com' }, ip));
    expect(other.status).toBe(200);
  });
});

describe.each([
  ['/api/auth/reset-password', () => reset, { token: 'f'.repeat(64), password: 'Valid12345' }],
  ['/api/auth/validate-reset-token', () => validate, { token: 'f'.repeat(64) }],
])('POST %s', (path, handler, body) => {
  test(`answers 429 after the limit of attempts from one IP`, async () => {
    const ip = freshIp();
    for (let i = 0; i < LIMIT; i++) {
      expect((await handler()(jsonRequest(`http://test${path}`, body, ip))).status).toBe(400);
    }
    expectLimited(await handler()(jsonRequest(`http://test${path}`, body, ip)));
  });
});

describe('withRateLimit on signed-in routes', () => {
  test('counts per user across IPs, and its 429 is private and uncacheable', async () => {
    const { withRateLimit } = await import('@/lib/middleware/withRateLimit');
    const { RateLimiter, userOrIpKey } = await import('@/lib/security/rateLimit');
    const limiter = new RateLimiter({ id: 'test-user-route', windowMs: 60_000, maxRequests: 2 });
    // The default identity reads the session with auth(); here the session is a given user.
    const handler = withRateLimit(limiter, async (request) =>
      userOrIpKey(request, 'User@Example.com')
    )<(request: NextRequest) => Promise<NextResponse>>(async () => NextResponse.json({ ok: true }));
    const from = (ip: string) =>
      handler(new NextRequest('http://test/api/ai/optimize', { headers: { 'x-forwarded-for': ip } }));

    const first = await from(freshIp());
    expect(first.status).toBe(200);
    expect(first.headers.get('cache-control')).toBe('private, no-store');
    expect((await from(freshIp())).status).toBe(200);
    expectLimited(await from(freshIp()));
  });

  test('an anonymous client is counted by its IP', async () => {
    const { userOrIpKey } = await import('@/lib/security/rateLimit');
    const at = (ip: string) => new Request('http://test/', { headers: { 'x-forwarded-for': `${ip}, 10.0.0.1` } });
    expect(userOrIpKey(at('198.51.100.7'), null)).toBe('ip:198.51.100.7');
    expect(userOrIpKey(at('198.51.100.8'), 'u@example.com')).toBe('user:u@example.com');
  });
});
