/**
 * The five AI routes through their real handlers and the real AI service, with Groq
 * mocked (tests/setup.ts). A model failure is a 502 with one message the UI shows, never a
 * canned result; bad input is a 400 that never reaches the model.
 */
import { beforeAll, beforeEach, describe, expect, mock, test } from 'bun:test';
import { NextRequest } from 'next/server';
import { AI_UNAVAILABLE } from '@/lib/ai/errors';
import { failWith, groqCreate, replyWith, resetGroq } from '../helpers/groq';

// Its own user, so the per-user AI rate limit other files spend is not shared.
let session: { user: { email: string; name: string } } | null = null;
mock.module('@/lib/auth/session', () => ({ getSession: async () => session }));

type Handler = (req: NextRequest) => Promise<Response>;
const routes: Record<string, Handler> = {};

const post = (path: string, body: unknown) =>
  new NextRequest(`http://test/api/ai/${path}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });

const resume = {
  personalInfo: { name: 'Zoë Ñúñez', summary: 'Backend engineer' },
  experience: [{ company: 'Café Ünïcode', position: 'Engineer' }],
  education: [],
  skills: ['Go', 'PostgreSQL'],
  projects: [],
  certifications: [],
};

// Each route, a valid request, a valid model reply, and the body it then returns.
const cases = [
  {
    route: 'generate-bullets',
    body: { jobTitle: 'Engineer', company: 'Acme', description: 'Built APIs' },
    reply: '{"bullets": ["Led A", "Built B"]}',
    expected: { bulletPoints: ['Led A', 'Built B'] },
  },
  {
    route: 'optimize',
    body: { resumeContent: 'Go engineer' },
    reply:
      '{"atsScore": 70, "suggestions": ["Add metrics"], "keywords": ["AWS"]}',
    expected: { atsScore: 70, suggestions: ['Add metrics'], keywords: ['AWS'] },
  },
  {
    route: 'review-resume',
    body: { resumeData: resume },
    reply:
      '{"score": 68, "overallAssessment": "Fine.", "strengths": [], "suggestions": []}',
    expected: {
      score: 68,
      overallAssessment: 'Fine.',
      strengths: [],
      suggestions: [],
    },
  },
  {
    route: 'analyze-keywords',
    body: { resumeData: resume, jobDescription: 'Needs PostgreSQL' },
    reply:
      '{"matchScore": 80, "keywords": [{"keyword": "PostgreSQL", "present": true, "importance": "high"}]}',
    expected: {
      matchScore: 80,
      keywords: [{ keyword: 'PostgreSQL', present: true, importance: 'high' }],
    },
  },
  {
    route: 'generate-cover-letter',
    body: { resumeData: resume, jobTitle: 'Engineer', companyName: 'Acme' },
    reply: 'Dear Acme team,',
    expected: { coverLetter: 'Dear Acme team,' },
  },
];

// Each route with input it must refuse before calling the model.
const invalid = [
  { route: 'generate-bullets', body: { jobTitle: 'Engineer' } },
  { route: 'optimize', body: {} },
  { route: 'review-resume', body: {} },
  { route: 'analyze-keywords', body: { resumeData: resume } },
  { route: 'generate-cover-letter', body: { jobTitle: 'Engineer' } },
];

// Importing the route modules is the slow part of a cold run (16.6 s seen on Windows with
// coverage), so the hook gets the 60 s the other integration files give theirs.
beforeAll(async () => {
  for (const { route } of cases) {
    routes[route] = (
      (await import(`@/app/api/ai/${route}/route`)) as {
        POST: Handler;
      }
    ).POST;
  }
}, 60_000);

beforeEach(() => {
  session = { user: { email: 'ai-routes@example.com', name: 'AI Routes' } };
  resetGroq();
});

describe('AI routes', () => {
  test.each(cases)(
    '$route returns what the model produced, privately',
    async ({ route, body, reply, expected }) => {
      replyWith(reply);
      const res = await routes[route](post(route, body));
      expect(res.status).toBe(200);
      expect(res.headers.get('cache-control') ?? '').toMatch(/private/);
      expect(await res.json()).toEqual(expected);
    }
  );

  test.each(cases)(
    '$route answers a model failure with a 502 and no canned result',
    async ({ route, body }) => {
      failWith('503 Service Unavailable');
      const res = await routes[route](post(route, body));
      expect(res.status).toBe(502);
      expect(await res.json()).toEqual({ error: AI_UNAVAILABLE });
    }
  );

  test.each(cases)(
    '$route answers an unusable model reply with a 502',
    async ({ route, body }) => {
      replyWith('', 'length');
      const res = await routes[route](post(route, body));
      expect(res.status).toBe(502);
      expect(await res.json()).toEqual({ error: AI_UNAVAILABLE });
    }
  );

  test.each(invalid)(
    '$route refuses incomplete input with a 400 before calling the model',
    async ({ route, body }) => {
      const res = await routes[route](post(route, body));
      expect(res.status).toBe(400);
      expect(groqCreate).not.toHaveBeenCalled();
    }
  );

  test('anonymous callers are rejected before the model is called', async () => {
    session = null;
    const res = await routes.optimize(post('optimize', { resumeContent: 'x' }));
    expect(res.status).toBe(401);
    expect(groqCreate).not.toHaveBeenCalled();
  });
});
