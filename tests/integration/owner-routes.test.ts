/**
 * Per-user routes outside resume CRUD, through the real route handlers and a real
 * MongoDB. Mocked: the session (`auth()`), the Groq-backed AI service and the
 * Puppeteer-backed PDF renderer.
 */
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  mock,
  test,
} from 'bun:test';
import { NextRequest } from 'next/server';
import { jsonRequest, startMongo, stopMongo } from '../helpers/mongo';

let session:
  | { user: { email: string; name: string } }
  | { message: string }
  | null = null;
mock.module('@/lib/auth/session', () => ({ getSession: async () => session }));

let aiCalls = 0;
mock.module('@/services/ai.service', () => ({
  aiService: {
    generateBulletPoints: async () => {
      aiCalls++;
      return [`bullet ${aiCalls}`];
    },
  },
}));

let pdfFailure: Error | null = null;
mock.module('@/services/pdf.service', () => ({
  generatePDF: async () => {
    if (pdfFailure) throw pdfFailure;
    return Buffer.from('%PDF-1.4 test');
  },
}));

type Handler = (req: Request, ctx?: unknown) => Promise<Response>;
const routes: Record<string, Handler> = {};
let Resume: typeof import('@/lib/db/models/Resume').Resume;
let JobApplication: typeof import('@/lib/db/models/JobApplication').JobApplication;
let CoverLetter: typeof import('@/lib/db/models/CoverLetter').default;

const ALICE = { email: 'alice@example.com', name: 'Alice' };
const BOB = { email: 'bob@example.com', name: 'Bob' };

const ctx = (params: Record<string, string>) => ({
  params: Promise.resolve(params),
});
// Next.js hands route handlers a NextRequest; the PDF route reads `nextUrl` from it.
const get = (url = 'http://test/api') => new NextRequest(url);
const post = (body: unknown) => jsonRequest('http://test/api', body);
const PRIVATE = /^private, no-store$/;

let slugCounter = 0;
async function resumeOf(
  user: typeof ALICE,
  extra: Record<string, unknown> = {}
) {
  return Resume.create({
    userEmail: user.email,
    title: `${user.name} resume`,
    slug: `${user.name.toLowerCase()}-test-${++slugCounter}`,
    personalInfo: { name: user.name },
    ...extra,
  });
}

beforeAll(async () => {
  await startMongo();
  const load = async (path: string) =>
    (await import(path)) as Record<string, Handler>;
  routes.applicationsGet = (await load('@/app/api/applications/route')).GET;
  routes.applicationsPost = (await load('@/app/api/applications/route')).POST;
  routes.coverLettersGet = (await load('@/app/api/cover-letters/route')).GET;
  routes.coverLettersPost = (await load('@/app/api/cover-letters/route')).POST;
  routes.stats = (await load('@/app/api/user/stats/route')).GET;
  routes.analytics = (await load('@/app/api/analytics/performance/route')).GET;
  routes.pdf = (await load('@/app/api/resumes/[id]/pdf/route')).GET;
  routes.atsScore = (await load('@/app/api/resumes/[id]/ats-score/route')).POST;
  routes.bySlug = (await load('@/app/api/resumes/slug/[slug]/route')).GET;
  routes.bullets = (await load('@/app/api/ai/generate-bullets/route')).POST;
  routes.linkedin = (await load('@/app/api/integrations/linkedin/route')).POST;
  ({ Resume } = await import('@/lib/db/models/Resume'));
  ({ JobApplication } = await import('@/lib/db/models/JobApplication'));
  ({ default: CoverLetter } = await import('@/lib/db/models/CoverLetter'));
  const { default: connectDB } = await import('@/lib/db/connection');
  await connectDB();
}, 60_000);

afterAll(stopMongo);

beforeEach(async () => {
  session = { user: ALICE };
  aiCalls = 0;
  pdfFailure = null;
  await Promise.all([
    Resume.deleteMany({}),
    JobApplication.deleteMany({}),
    CoverLetter.deleteMany({}),
  ]);
});

describe('job applications', () => {
  test('a create cannot place the record in another account', async () => {
    const res = await routes.applicationsPost(
      post({ jobTitle: 'Engineer', company: 'Acme', userEmail: BOB.email })
    );
    expect(res.status).toBe(200);
    const stored = await JobApplication.find({}).lean();
    expect(stored.map((a) => a.userEmail)).toEqual([ALICE.email]);
  });

  test('a create cannot link a resume the user does not own', async () => {
    const bobs = await resumeOf(BOB);
    const res = await routes.applicationsPost(
      post({
        jobTitle: 'Engineer',
        company: 'Acme',
        resumeId: String(bobs._id),
      })
    );
    expect(res.status).toBe(404);
    expect(await JobApplication.countDocuments()).toBe(0);
  });

  test('a create that breaks the schema is a 400', async () => {
    const res = await routes.applicationsPost(
      post({ jobTitle: 'Engineer', company: 'Acme', status: 'hired' })
    );
    expect(res.status).toBe(400);
  });

  test('the list holds only the caller’s applications and is private', async () => {
    await JobApplication.create({
      userEmail: BOB.email,
      jobTitle: 'X',
      company: 'Y',
    });
    await routes.applicationsPost(
      post({ jobTitle: 'Engineer', company: 'Acme' })
    );
    const res = await routes.applicationsGet(get());
    expect(res.headers.get('cache-control') ?? '').toMatch(PRIVATE);
    const { applications } = await res.json();
    expect(applications.map((a: { company: string }) => a.company)).toEqual([
      'Acme',
    ]);
  });
});

describe('cover letters', () => {
  const letter = (resumeId: string) => ({
    resumeId,
    company: 'Acme',
    position: 'Engineer',
    content: 'Hi',
  });

  test('a cover letter cannot reference another user’s resume', async () => {
    const bobs = await resumeOf(BOB);
    const res = await routes.coverLettersPost(post(letter(String(bobs._id))));
    expect(res.status).toBe(404);
    expect(await CoverLetter.countDocuments()).toBe(0);
  });

  test('a cover letter for the caller’s own resume is saved under the caller', async () => {
    const mine = await resumeOf(ALICE);
    const res = await routes.coverLettersPost(
      post({ ...letter(String(mine._id)), userEmail: BOB.email })
    );
    expect(res.status).toBe(201);
    expect(res.headers.get('cache-control') ?? '').toMatch(PRIVATE);
    expect((await CoverLetter.findOne({}).lean())!.userEmail).toBe(ALICE.email);
  });

  test('a malformed resume id is a 404, not a server error', async () => {
    expect(
      (await routes.coverLettersPost(post(letter('not-an-id')))).status
    ).toBe(404);
  });
});

describe('dashboard counts are fresh and private', () => {
  test('stats reflect a resume created after the previous read', async () => {
    const first = await routes.stats(get());
    expect(first.headers.get('cache-control') ?? '').toMatch(PRIVATE);
    expect((await first.json()).resumeCount).toBe(0);
    await resumeOf(ALICE, { isPublic: true, viewCount: 4 });
    await resumeOf(ALICE, { viewCount: 3 });
    await resumeOf(BOB, { isPublic: true, viewCount: 100 });
    expect(await (await routes.stats(get())).json()).toEqual({
      resumeCount: 2,
      totalViews: 7,
      publicResumes: 1,
    });
  });

  test('analytics reflect a resume created after the previous read', async () => {
    const first = await routes.analytics(get());
    expect(first.headers.get('cache-control') ?? '').toMatch(PRIVATE);
    expect(await first.json()).toEqual({
      totalViews: 0,
      totalDownloads: 0,
      totalShares: 0,
      avgAtsScore: 0,
      topPerformingResume: null,
    });
    await resumeOf(ALICE, {
      title: 'Top',
      isPublic: true,
      viewCount: 9,
      atsScore: 90,
    });
    await resumeOf(ALICE, { title: 'Other', viewCount: 1, atsScore: 71 });
    await resumeOf(BOB, { viewCount: 1000, atsScore: 10 });
    const body = await (await routes.analytics(get())).json();
    expect(body.totalViews).toBe(10);
    expect(body.totalShares).toBe(1);
    expect(body.avgAtsScore).toBe(81); // (90 + 71) / 2, rounded
    expect(body.topPerformingResume).toEqual({
      title: 'Top',
      views: 9,
      atsScore: 90,
    });
  });
});

describe('resume PDF', () => {
  test('a PDF is private to its owner and never stored by shared caches', async () => {
    const mine = await resumeOf(ALICE);
    const res = await routes.pdf(
      get(`http://test/api/resumes/${mine._id}/pdf`),
      ctx({ id: String(mine._id) })
    );
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toBe('application/pdf');
    expect(res.headers.get('cache-control') ?? '').toMatch(PRIVATE);
  });

  test('another user’s resume and a malformed id are 404', async () => {
    const bobs = await resumeOf(BOB);
    const url = 'http://test/api/resumes/x/pdf';
    expect(
      (await routes.pdf(get(url), ctx({ id: String(bobs._id) }))).status
    ).toBe(404);
    expect((await routes.pdf(get(url), ctx({ id: 'not-an-id' }))).status).toBe(
      404
    );
  });

  test('a render failure does not reveal the error message', async () => {
    const mine = await resumeOf(ALICE);
    pdfFailure = new Error('Failed to launch chrome at /opt/internal/chromium');
    const res = await routes.pdf(
      get('http://test/api/resumes/x/pdf'),
      ctx({ id: String(mine._id) })
    );
    expect(res.status).toBe(500);
    expect(await res.text()).not.toContain('/opt/internal');
  });
});

describe('ATS score', () => {
  test('the score is stored on the caller’s resume and the response is private', async () => {
    const mine = await resumeOf(ALICE, { skills: ['Go', 'SQL', 'AWS'] });
    const res = await routes.atsScore(post({}), ctx({ id: String(mine._id) }));
    expect(res.status).toBe(200);
    expect(res.headers.get('cache-control') ?? '').toMatch(PRIVATE);
    const { atsScore } = await res.json();
    expect((await Resume.findById(mine._id).lean())!.atsScore).toBe(atsScore);
  });

  test('another user’s resume and a malformed id are 404', async () => {
    const bobs = await resumeOf(BOB);
    expect(
      (await routes.atsScore(post({}), ctx({ id: String(bobs._id) }))).status
    ).toBe(404);
    expect((await Resume.findById(bobs._id).lean())!.atsScore).toBeUndefined();
    expect(
      (await routes.atsScore(post({}), ctx({ id: 'not-an-id' }))).status
    ).toBe(404);
  });
});

describe('resume by slug', () => {
  test('the owner’s resume is returned privately; another user’s is 404', async () => {
    const mine = await resumeOf(ALICE);
    const bobs = await resumeOf(BOB);
    const res = await routes.bySlug(get(), ctx({ slug: mine.slug }));
    expect(res.status).toBe(200);
    expect(res.headers.get('cache-control') ?? '').toMatch(PRIVATE);
    expect((await routes.bySlug(get(), ctx({ slug: bobs.slug }))).status).toBe(
      404
    );
  });
});

describe('AI bullets', () => {
  const input = {
    jobTitle: 'Engineer',
    company: 'Acme',
    description: 'Built things',
    skills: ['Go'],
  };

  test('each request is generated fresh and the response is private', async () => {
    const first = await routes.bullets(post(input));
    session = { user: BOB };
    const second = await routes.bullets(post(input));
    expect(first.status).toBe(200);
    expect(second.headers.get('cache-control') ?? '').toMatch(PRIVATE);
    expect(aiCalls).toBe(2);
    expect((await second.json()).bulletPoints).toEqual(['bullet 2']);
  });
});

describe('session guard', () => {
  // next-auth up to 5.0.0-beta.31 returned an error object instead of null when the
  // session could not be read, so a check like `!!session` let the request through
  // (GHSA-8fpg-xm3f-6cx3). The guard must need a user, not just a truthy value.
  test('an Auth.js error object is not a session', async () => {
    session = { message: 'There was a problem with the server configuration.' };
    expect((await routes.stats(get())).status).toBe(401);
  });
});

describe('LinkedIn import', () => {
  test('anonymous callers are rejected and responses are private', async () => {
    session = null;
    expect(
      (
        await routes.linkedin(
          post({ linkedinUrl: 'https://linkedin.com/in/x' })
        )
      ).status
    ).toBe(401);
    session = { user: ALICE };
    const res = await routes.linkedin(
      post({ linkedinUrl: 'https://linkedin.com/in/x' })
    );
    expect(res.status).toBe(200);
    expect(res.headers.get('cache-control') ?? '').toMatch(PRIVATE);
  });
});
