/**
 * Resume CRUD through the real route handlers and a real MongoDB. Only the session is
 * mocked: `auth()` returns whichever user the test sets.
 */
import { afterAll, beforeAll, beforeEach, describe, expect, mock, test } from 'bun:test';
import { startMongo, stopMongo } from '../helpers/mongo';

let session: { user: { email: string; name: string } } | null = null;
mock.module('@/lib/auth/config', () => ({ auth: async () => session }));

type Handler = (req: Request, ctx?: unknown) => Promise<Response>;
let list: Handler, create: Handler, getOne: Handler, update: Handler, remove: Handler, clone: Handler;
let Resume: typeof import('@/lib/db/models/Resume').Resume;

const ALICE = { email: 'alice@example.com', name: 'John Alpha' };
const BOB = { email: 'bob@example.com', name: 'John Beta' };

const ctx = (id: string) => ({ params: Promise.resolve({ id }) });
const req = (method: string, body?: unknown) =>
  new Request('http://test/api/resumes', {
    method,
    headers: { 'content-type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

const minimal = (title: string) => ({
  title,
  personalInfo: { name: 'John Alpha', email: 'alice@example.com' },
  templateId: 'tech',
});

async function createAs(user: typeof ALICE, title: string) {
  session = { user };
  const res = await create(req('POST', minimal(title)));
  return { res, body: (await res.json()) as { resume?: { _id: string; slug: string } } };
}

beforeAll(async () => {
  await startMongo();
  ({ GET: list, POST: create } = (await import('@/app/api/resumes/route')) as never);
  ({ GET: getOne, PUT: update, DELETE: remove } = (await import('@/app/api/resumes/[id]/route')) as never);
  ({ POST: clone } = (await import('@/app/api/resumes/[id]/clone/route')) as never);
  ({ Resume } = await import('@/lib/db/models/Resume'));
  const { default: connectDB } = await import('@/lib/db/connection');
  await connectDB();
  await Resume.syncIndexes();
}, 60_000);

afterAll(stopMongo);

beforeEach(async () => {
  session = { user: ALICE };
  await Resume.deleteMany({});
  const { UserCounter } = await import('@/lib/db/models/UserCounter');
  await UserCounter.deleteMany({});
});

describe('freshness and caching', () => {
  test('a created resume appears in the next list read', async () => {
    await createAs(ALICE, 'First');
    expect((await (await list(req('GET'))).json()).resumes).toHaveLength(1);
    await createAs(ALICE, 'Second');
    expect((await (await list(req('GET'))).json()).resumes).toHaveLength(2);
  });

  test('an update is visible on the next read, and a delete makes it 404', async () => {
    const { body } = await createAs(ALICE, 'Before');
    const id = body.resume!._id;
    await getOne(req('GET'), ctx(id));
    expect((await update(req('PUT', { title: 'After' }), ctx(id))).status).toBe(200);
    expect((await (await getOne(req('GET'), ctx(id))).json()).resume.title).toBe('After');
    expect((await remove(req('DELETE'), ctx(id))).status).toBe(200);
    expect((await getOne(req('GET'), ctx(id))).status).toBe(404);
  });

  test('per-user responses are private and not stored by shared caches', async () => {
    const res = await list(req('GET'));
    expect(res.headers.get('cache-control') ?? '').toMatch(/private/);
    expect(res.headers.get('cache-control') ?? '').toMatch(/no-store/);
  });
});

describe('update boundary', () => {
  test('an update cannot change the owner or server-managed counters', async () => {
    const { body } = await createAs(ALICE, 'Mine');
    const id = body.resume!._id;
    const res = await update(
      req('PUT', { title: 'Renamed', userEmail: BOB.email, viewCount: 99999, slug: 'stolen/1' }),
      ctx(id)
    );
    expect(res.status).toBe(200);
    const stored = await Resume.findById(id).lean();
    expect(stored!.userEmail).toBe(ALICE.email);
    expect(stored!.viewCount ?? 0).toBe(0);
    expect(stored!.slug).toBe(body.resume!.slug);
    expect(stored!.title).toBe('Renamed');
  });

  test('an update that breaks the schema is rejected', async () => {
    const { body } = await createAs(ALICE, 'Mine');
    const res = await update(req('PUT', { templateId: 'bogus' }), ctx(body.resume!._id));
    expect(res.status).toBe(400);
  });

  test('text is stored exactly as typed', async () => {
    const { body } = await createAs(ALICE, "O'Brien & Co <R&D>");
    const id = body.resume!._id;
    await update(req('PUT', { title: "O'Brien & Co <R&D>" }), ctx(id));
    expect((await Resume.findById(id).lean())!.title).toBe("O'Brien & Co <R&D>");
  });

  test('a malformed id is a 404, not a server error', async () => {
    expect((await getOne(req('GET'), ctx('not-an-id'))).status).toBe(404);
  });
});

describe('slugs', () => {
  test('two users with the same first name can both create resumes', async () => {
    expect((await createAs(ALICE, 'A')).res.status).toBe(200);
    expect((await createAs(BOB, 'B')).res.status).toBe(200);
  });

  test('a slug is a single URL segment, so /resume/<slug> resolves', async () => {
    const { body } = await createAs(ALICE, 'Shared');
    expect(body.resume!.slug).toMatch(/^[a-z0-9-]+$/);
  });

  test('a clone gets its own slug', async () => {
    const { body } = await createAs(ALICE, 'Original');
    const res = await clone(req('POST', {}), ctx(body.resume!._id));
    expect(res.status).toBe(200);
    const copy = (await res.json()).resume;
    expect(copy.slug).toBeTruthy();
    expect(copy.slug).not.toBe(body.resume!.slug);
  });
});
