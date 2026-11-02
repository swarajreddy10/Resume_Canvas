/**
 * The anonymous public-resume endpoints, through the real route handlers and a real
 * MongoDB. Nothing is mocked: these routes take no session.
 */
import { afterAll, beforeAll, beforeEach, describe, expect, test } from 'bun:test';
import { startMongo, stopMongo } from '../helpers/mongo';

type Handler = (req: Request, ctx: unknown) => Promise<Response>;
let byId: Handler, bySlug: Handler;
let Resume: typeof import('@/lib/db/models/Resume').Resume;

// Exactly what src/app/resume/[id]/page.tsx renders.
const PUBLIC_FIELDS = ['education', 'experience', 'personalInfo', 'skills', 'templateId', 'title', 'viewCount'];

const ctx = (params: Record<string, string>) => ({ params: Promise.resolve(params) });
const get = () => new Request('http://test/api/resume/public');

async function resume(isPublic: boolean) {
  return Resume.create({
    userEmail: 'owner@example.com',
    title: 'Backend Engineer',
    slug: isPublic ? 'owner-abc123' : 'owner-def456',
    personalInfo: { name: 'Owner', email: 'contact@example.com' },
    experience: [{ company: 'Acme', bullets: ['Shipped'] }],
    skills: ['Go'],
    isPublic,
    atsScore: 70,
  });
}

beforeAll(async () => {
  await startMongo();
  ({ GET: byId } = (await import('@/app/api/resume/public/[id]/route')) as never);
  ({ GET: bySlug } = (await import('@/app/api/resume/public/slug/[slug]/route')) as never);
  ({ Resume } = await import('@/lib/db/models/Resume'));
  const { default: connectDB } = await import('@/lib/db/connection');
  await connectDB();
}, 60_000);

afterAll(stopMongo);

beforeEach(async () => {
  await Resume.deleteMany({});
});

describe.each([
  ['by id', (r: { _id: unknown }) => [byId, ctx({ id: String(r._id) })] as const],
  ['by slug', (r: { slug: string }) => [bySlug, ctx({ slug: r.slug })] as const],
])('public resume %s', (_name, route) => {
  test('returns only the fields the public page renders: no owner email', async () => {
    const [handler, params] = route(await resume(true));
    const res = await handler(get(), params);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(Object.keys(body.resume).sort()).toEqual(PUBLIC_FIELDS);
    expect(JSON.stringify(body)).not.toContain('owner@example.com');
  });

  test('each read counts exactly one view and reports the count including it', async () => {
    const doc = await resume(true);
    const [handler, params] = route(doc);
    await handler(get(), params);
    const second = await (await handler(get(), params)).json();
    expect((await Resume.findById(doc._id).lean())!.viewCount).toBe(2);
    expect(second.resume.viewCount).toBe(2);
  });

  test('a view does not mark the resume as edited', async () => {
    const doc = await resume(true);
    const [handler, params] = route(doc);
    await handler(get(), params);
    const stored = await Resume.findById(doc._id).lean();
    expect(stored!.updatedAt.getTime()).toBe(doc.updatedAt.getTime());
  });

  test('is never stored by a browser or shared cache, so every read is counted', async () => {
    const [handler, params] = route(await resume(true));
    expect((await handler(get(), params)).headers.get('cache-control')).toBe('no-store');
  });

  test('a private resume is 404 and its view count is untouched', async () => {
    const doc = await resume(false);
    const [handler, params] = route(doc);
    expect((await handler(get(), params)).status).toBe(404);
    expect((await Resume.findById(doc._id).lean())!.viewCount).toBe(0);
  });
});

test('a malformed id is a 404, not a server error', async () => {
  expect((await byId(get(), ctx({ id: 'not-an-id' }))).status).toBe(404);
});
