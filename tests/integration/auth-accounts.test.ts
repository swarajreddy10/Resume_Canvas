/**
 * Sign-in rules against a real MongoDB: the Auth.js signIn callback and the Credentials
 * authorize function from src/lib/auth/config.ts, reading the same users collection the
 * register route writes.
 */
import { afterAll, beforeAll, beforeEach, describe, expect, test } from 'bun:test';
import bcryptjs from 'bcryptjs';
import type { NextAuthConfig } from 'next-auth';
import { jsonRequest, startMongo, stopMongo } from '../helpers/mongo';

const VICTIM = 'victim@gmail.com';
const ATTACKER_PASSWORD = 'Attacker123';

let authConfig: NextAuthConfig;
let authorizeCredentials: typeof import('@/lib/auth/config').authorizeCredentials;
let User: typeof import('@/lib/db/models/User').User;

beforeAll(async () => {
  await startMongo();
  ({ authConfig, authorizeCredentials } = await import('@/lib/auth/config'));
  ({ User } = await import('@/lib/db/models/User'));
  const { default: connectDB } = await import('@/lib/db/connection');
  await connectDB();
}, 60_000);

afterAll(async () => {
  await stopMongo();
});

beforeEach(async () => {
  await User.deleteMany({});
});

function googleSignIn(email: string, emailVerified: boolean) {
  return authConfig.callbacks!.signIn!({
    user: { email, name: 'Victim' },
    account: { provider: 'google', type: 'oidc', providerAccountId: 'google-sub-1' },
    profile: { email, email_verified: emailVerified },
  } as never);
}

async function passwordSignIn(email: string, password: string) {
  return authorizeCredentials({ email, password }).catch(() => null);
}

describe('Google sign-in to an email that already has a password account', () => {
  test('an unverified password set by someone else stops working once the owner signs in with Google', async () => {
    // The attacker registers the victim's address first; no one proves they own it.
    await User.create({
      email: VICTIM,
      name: 'Attacker',
      password: await bcryptjs.hash(ATTACKER_PASSWORD, 10),
    });
    expect(await passwordSignIn(VICTIM, ATTACKER_PASSWORD)).not.toBeNull();

    // The real owner signs in with Google; Auth.js links the accounts by email.
    expect(await googleSignIn(VICTIM, true)).toBe(true);

    expect(await passwordSignIn(VICTIM, ATTACKER_PASSWORD)).toBeNull();
    const stored = await User.collection.findOne({ email: VICTIM });
    expect(stored?.password).toBeUndefined();
    expect(stored?.emailVerified).toBeInstanceOf(Date);
  });

  test('a password on an already verified account survives a Google sign-in', async () => {
    await User.collection.insertOne({
      email: VICTIM,
      name: 'Victim',
      password: await bcryptjs.hash('Owner12345', 10),
      emailVerified: new Date('2026-01-01T00:00:00Z'),
    });

    expect(await googleSignIn(VICTIM, true)).toBe(true);

    expect(await passwordSignIn(VICTIM, 'Owner12345')).not.toBeNull();
  });

  test('a user created from a Google profile keeps a password set later through reset', async () => {
    // Auth.js creates a new OAuth user with emailVerified: null, then links the account.
    await User.collection.insertOne({ email: VICTIM, name: 'Victim', emailVerified: null });
    await authConfig.events!.linkAccount!({
      user: { email: VICTIM },
      account: { provider: 'google', type: 'oidc', providerAccountId: 'google-sub-1' },
      profile: { email: VICTIM, email_verified: true },
    } as never);
    // The owner later sets a password through forgot-password.
    await User.collection.updateOne(
      { email: VICTIM },
      { $set: { password: await bcryptjs.hash('Owner12345', 10) } }
    );

    expect(await googleSignIn(VICTIM, true)).toBe(true);

    expect(await passwordSignIn(VICTIM, 'Owner12345')).not.toBeNull();
  });

  test('a Google profile whose email Google has not verified is refused', async () => {
    await User.create({
      email: VICTIM,
      name: 'Attacker',
      password: await bcryptjs.hash(ATTACKER_PASSWORD, 10),
    });

    expect(await googleSignIn(VICTIM, false)).toBe(false);

    const stored = await User.collection.findOne({ email: VICTIM });
    expect(stored?.password).toBeString();
    expect(stored?.emailVerified).toBeUndefined();
  });
});

describe('responses do not reveal whether an account exists', () => {
  const OWNER = 'owner@example.com';
  let register: (r: Request) => Promise<Response>;

  beforeAll(async () => {
    ({ POST: register } = (await import('@/app/api/user/register/route')) as never);
  });

  beforeEach(async () => {
    await User.create({
      email: OWNER,
      name: 'Owner',
      password: await bcryptjs.hash('Owner12345', 10),
    });
    await User.collection.insertOne({ email: 'google-only@example.com', name: 'G' });
  });

  test.each([
    ['an unknown email', 'nobody@example.com', 'Owner12345'],
    ['a wrong password', OWNER, 'Wrong12345'],
    ['an account without a password', 'google-only@example.com', 'Owner12345'],
    ['a malformed email', 'not-an-email', 'Owner12345'],
  ])('password sign-in with %s fails with no distinguishing error', async (_, email, password) => {
    expect(await authorizeCredentials({ email, password })).toBeNull();
  });

  test('password sign-in with the right password succeeds, case-insensitively', async () => {
    expect(await authorizeCredentials({ email: ' Owner@Example.com ', password: 'Owner12345' })).toMatchObject({
      email: OWNER,
    });
  });

  test('registering a taken email answers exactly like a new registration and changes nothing', async () => {
    const fresh = await register(
      jsonRequest('http://test/api/user/register', {
        email: 'new@example.com',
        name: 'New',
        password: 'Fresh12345',
      })
    );
    const taken = await register(
      jsonRequest('http://test/api/user/register', {
        email: OWNER,
        name: 'Intruder',
        password: 'Intruder123',
      })
    );

    expect(taken.status).toBe(fresh.status);
    expect(await taken.json()).toEqual(await fresh.json());
    expect(await User.countDocuments({ email: OWNER })).toBe(1);
    expect(await passwordSignIn(OWNER, 'Owner12345')).not.toBeNull();
    expect(await passwordSignIn(OWNER, 'Intruder123')).toBeNull();
    expect(await passwordSignIn('new@example.com', 'Fresh12345')).not.toBeNull();
  });
});
