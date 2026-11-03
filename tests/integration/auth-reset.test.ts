/**
 * Password reset against a real MongoDB: the request flows through the actual route
 * handlers, Mongoose models, and connection code. Only the outbound email is captured.
 */
import { afterAll, beforeAll, beforeEach, describe, expect, mock, test } from 'bun:test';
import bcryptjs from 'bcryptjs';
import { jsonRequest, startMongo, stopMongo } from '../helpers/mongo';

const sentTokens: string[] = [];
mock.module('@/lib/email/resend.service', () => ({
  sendResetEmail: async (_email: string, token: string) => {
    sentTokens.push(token);
    return { success: true };
  },
}));

const VICTIM = 'victim@example.com';
const ORIGINAL_PASSWORD = 'Original123';

let forgot: (r: Request) => Promise<Response>;
let reset: (r: Request) => Promise<Response>;
let validate: (r: Request) => Promise<Response>;
let User: typeof import('@/lib/db/models/User').User;

beforeAll(async () => {
  await startMongo();
  ({ POST: forgot } = (await import('@/app/api/auth/forgot-password/route')) as never);
  ({ POST: reset } = (await import('@/app/api/auth/reset-password/route')) as never);
  ({ POST: validate } = (await import('@/app/api/auth/validate-reset-token/route')) as never);
  ({ User } = await import('@/lib/db/models/User'));
  const { default: connectDB } = await import('@/lib/db/connection');
  await connectDB();
}, 60_000);

afterAll(async () => {
  await stopMongo();
});

beforeEach(async () => {
  sentTokens.length = 0;
  await User.deleteMany({});
  await User.create({
    email: VICTIM,
    name: 'Victim',
    password: await bcryptjs.hash(ORIGINAL_PASSWORD, 10),
  });
  const res = await forgot(jsonRequest('http://test/api/auth/forgot-password', { email: VICTIM }));
  expect(res.status).toBe(200);
  expect(sentTokens).toHaveLength(1);
});

async function passwordMatches(plain: string): Promise<boolean> {
  const user = await User.findOne({ email: VICTIM }).select('+password');
  return bcryptjs.compare(plain, user!.password!);
}

describe('POST /api/auth/reset-password', () => {
  test('rejects a token sent as a query operator and leaves the password unchanged', async () => {
    const res = await reset(
      jsonRequest('http://test/api/auth/reset-password', {
        token: { $ne: null },
        password: 'Attacker123',
      })
    );
    expect(res.status).toBe(400);
    expect(await passwordMatches(ORIGINAL_PASSWORD)).toBe(true);
  });

  test('a reset token works exactly once', async () => {
    const body = { token: sentTokens[0], password: 'Changed123' };
    const first = await reset(jsonRequest('http://test/api/auth/reset-password', body));
    expect(first.status).toBe(200);
    expect(await passwordMatches('Changed123')).toBe(true);

    const replay = await reset(
      jsonRequest('http://test/api/auth/reset-password', { ...body, password: 'Replayed123' })
    );
    expect(replay.status).toBe(400);
    expect(await passwordMatches('Changed123')).toBe(true);
  });

  test('enforces the registration password policy', async () => {
    const res = await reset(
      jsonRequest('http://test/api/auth/reset-password', { token: sentTokens[0], password: 'abcdefg' })
    );
    expect(res.status).toBe(400);
    expect(await passwordMatches(ORIGINAL_PASSWORD)).toBe(true);
  });
});

describe('query filters', () => {
  test('a `$` object from request data is matched literally, not run as an operator', async () => {
    const injected = JSON.parse('{"email":{"$ne":null}}');
    // Sanitized, the filter becomes { email: { $eq: { $ne: null } } }: it either fails to
    // cast or matches nothing. Unsanitized, `$ne: null` would match every user.
    expect(await User.findOne(injected).catch(() => null)).toBeNull();
    expect(await User.findOne({ email: VICTIM })).not.toBeNull();
  });
});

describe('POST /api/auth/validate-reset-token', () => {
  test('rejects a token sent as a query operator without revealing the account', async () => {
    const res = await validate(
      jsonRequest('http://test/api/auth/validate-reset-token', { token: { $ne: null } })
    );
    expect(res.status).toBe(400);
    expect(JSON.stringify(await res.json())).not.toContain(VICTIM);
  });

  test('accepts the emailed token', async () => {
    const res = await validate(
      jsonRequest('http://test/api/auth/validate-reset-token', { token: sentTokens[0] })
    );
    expect(res.status).toBe(200);
  });
});
