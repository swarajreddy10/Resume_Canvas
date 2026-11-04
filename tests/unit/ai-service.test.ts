/**
 * The AI service against a mocked Groq client (registered in tests/setup.ts): each test
 * queues the model's reply, then checks the request sent and how the reply is used. No
 * failure is answered with a canned result: every one is an AIServiceError.
 */
import { beforeEach, describe, expect, test } from 'bun:test';
import {
  analyzeKeywords,
  generateBulletPoints,
  generateCoverLetter,
  optimizeResume,
  reviewResume,
} from '@/services/ai.service';
import { AIServiceError } from '@/lib/ai/errors';
import {
  failWith,
  groqCreate,
  lastPrompt,
  lastRequest,
  replyWith,
  resetGroq,
} from '../helpers/groq';

const bulletRequest = {
  jobTitle: 'Software Engineer & Architect',
  company: 'Tech Corp 科技公司',
  description: 'Built web applications with React/Node.js 🚀',
  skills: ['C++', 'C#', '.NET'],
};

const review = {
  score: 71,
  overallAssessment: 'Solid structure, thin on results.',
  strengths: ['Clear headings'],
  suggestions: [
    {
      type: 'critical',
      section: 'Experience',
      message: 'No metrics',
      suggestion: 'Add the cut from 30 to 4 minutes',
      impact: 'high',
    },
  ],
};

const keywords = {
  matchScore: 64,
  keywords: [
    { keyword: 'PostgreSQL', present: true, importance: 'high' },
    { keyword: 'Kubernetes', present: false, importance: 'medium' },
  ],
};

const letterInput = {
  resumeData: { name: 'Jane Smith', skills: ['Go', 'Postgres'] },
  jobTitle: 'Backend Engineer',
  companyName: 'Acme',
};

// Each feature, a valid reply for it, and whether it asks for JSON.
const features = [
  {
    name: 'generateBulletPoints',
    call: () => generateBulletPoints(bulletRequest),
    reply: '{"bullets": ["Led A"]}',
    json: true,
  },
  {
    name: 'optimizeResume',
    call: () => optimizeResume('Go engineer'),
    reply:
      '{"atsScore": 72, "suggestions": ["Add metrics"], "keywords": ["AWS"]}',
    json: true,
  },
  {
    name: 'reviewResume',
    call: () => reviewResume({ skills: ['Go'] }),
    reply: JSON.stringify(review),
    json: true,
  },
  {
    name: 'analyzeKeywords',
    call: () => analyzeKeywords('Needs PostgreSQL', 'Go and PostgreSQL'),
    reply: JSON.stringify(keywords),
    json: true,
  },
  {
    name: 'generateCoverLetter',
    call: () => generateCoverLetter(letterInput),
    reply: 'Dear Acme team,',
    json: false,
  },
];
const jsonFeatures = features.filter((f) => f.json);

beforeEach(resetGroq);

describe('every model call', () => {
  test.each(features)(
    '$name sends the supported model with low reasoning, no reasoning text and a budget',
    async ({ call, reply, json }) => {
      replyWith(reply);
      await call();

      const req = lastRequest();
      expect(groqCreate).toHaveBeenCalledTimes(1);
      expect(req.model).toBe('openai/gpt-oss-120b');
      expect(req.reasoning_effort).toBe('low');
      expect(req.include_reasoning).toBe(false);
      expect(req.temperature).toBe(0.6);
      expect(req.max_completion_tokens).toBeGreaterThan(0);
      expect(req.messages.map((m) => m.role)).toEqual(['user']);
      expect(req.response_format).toEqual(
        json ? { type: 'json_object' } : undefined
      );
    }
  );

  test.each(features)(
    '$name throws AIServiceError when the API call fails, never a canned result',
    async ({ call }) => {
      failWith('503 Service Unavailable');
      const error = await call().catch((e: unknown) => e);
      expect(error).toBeInstanceOf(AIServiceError);
      expect((error as Error).cause).toBeInstanceOf(Error);
    }
  );

  test.each(features)(
    '$name throws AIServiceError on an empty reply',
    async ({ call }) => {
      replyWith('   ');
      await expect(call()).rejects.toBeInstanceOf(AIServiceError);
    }
  );

  test.each(features)(
    '$name throws AIServiceError on a reply cut off at the token budget',
    async ({ call, reply }) => {
      replyWith(reply, 'length');
      await expect(call()).rejects.toBeInstanceOf(AIServiceError);
    }
  );

  test.each(jsonFeatures)(
    '$name throws AIServiceError on a reply that is not JSON',
    async ({ call }) => {
      replyWith('I cannot score this resume.');
      await expect(call()).rejects.toBeInstanceOf(AIServiceError);
    }
  );

  test.each(jsonFeatures)(
    '$name throws AIServiceError on JSON of the wrong shape',
    async ({ call }) => {
      replyWith('{"score": "high", "bullets": "one"}');
      await expect(call()).rejects.toBeInstanceOf(AIServiceError);
    }
  );
});

describe('generateBulletPoints', () => {
  test('returns the bullets trimmed, without blanks, capped at five', async () => {
    replyWith(
      JSON.stringify({
        bullets: [
          '  Led A  ',
          '',
          'Built B',
          'Cut C',
          ' ',
          'Shipped D',
          'Scaled E',
          'Owned F',
        ],
      })
    );
    expect(await generateBulletPoints(bulletRequest)).toEqual([
      'Led A',
      'Built B',
      'Cut C',
      'Shipped D',
      'Scaled E',
    ]);
  });

  test('throws AIServiceError when no bullet has text', async () => {
    replyWith('{"bullets": ["", "  "]}');
    await expect(generateBulletPoints(bulletRequest)).rejects.toBeInstanceOf(
      AIServiceError
    );
  });

  test('sends the role, company, description and skills to the model', async () => {
    replyWith('{"bullets": ["Led A"]}');
    await generateBulletPoints(bulletRequest);

    const prompt = lastPrompt();
    expect(prompt).toContain('Role: Software Engineer & Architect');
    expect(prompt).toContain('Company: Tech Corp 科技公司');
    expect(prompt).toContain(
      'Description: Built web applications with React/Node.js 🚀'
    );
    expect(prompt).toContain('Key Skills: C++, C#, .NET');
  });

  test('omits the skills line when no skills are given', async () => {
    replyWith('{"bullets": ["Led A"]}');
    await generateBulletPoints({ ...bulletRequest, skills: undefined });
    expect(lastPrompt()).not.toContain('Key Skills:');
  });
});

describe('optimizeResume', () => {
  test('returns the parsed assessment and sends the resume text', async () => {
    replyWith(
      '{"atsScore": 72, "suggestions": ["Add metrics"], "keywords": ["Go", "AWS"]}'
    );
    expect(await optimizeResume('Software Engineer with experience')).toEqual({
      atsScore: 72,
      suggestions: ['Add metrics'],
      keywords: ['Go', 'AWS'],
    });
    expect(lastPrompt()).toContain('Software Engineer with experience');
  });

  test('rejects a score outside 0 to 100', async () => {
    replyWith('{"atsScore": 140, "suggestions": [], "keywords": []}');
    await expect(optimizeResume('x')).rejects.toBeInstanceOf(AIServiceError);
  });
});

describe('reviewResume', () => {
  test('returns the parsed review and sends every section', async () => {
    replyWith(JSON.stringify(review));
    const resume = {
      personalInfo: { name: 'Zoë Ñúñez' },
      experience: [{ company: 'Café Ünïcode' }],
      education: [],
      skills: ['Go'],
      projects: [],
      certifications: [],
    };

    expect(await reviewResume(resume)).toEqual(review);
    const prompt = lastPrompt();
    expect(prompt).toContain('Personal Info: {"name":"Zoë Ñúñez"}');
    expect(prompt).toContain('Experience: [{"company":"Café Ünïcode"}]');
    expect(prompt).toContain('Skills: ["Go"]');
  });
});

describe('analyzeKeywords', () => {
  test('returns the parsed match and sends the job description and resume', async () => {
    replyWith(JSON.stringify(keywords));
    expect(
      await analyzeKeywords('Needs PostgreSQL and Kubernetes', 'Go, PostgreSQL')
    ).toEqual(keywords);
    const prompt = lastPrompt();
    expect(prompt).toContain('Needs PostgreSQL and Kubernetes');
    expect(prompt).toContain('Go, PostgreSQL');
  });
});

describe('generateCoverLetter', () => {
  test('returns the model text and sends the job and resume details', async () => {
    replyWith('Dear Acme team,\n\nI am applying...');
    expect(
      await generateCoverLetter({
        ...letterInput,
        jobDescription: 'Build APIs',
      })
    ).toBe('Dear Acme team,\n\nI am applying...');
    const prompt = lastPrompt();
    expect(prompt).toContain('Job Title: Backend Engineer');
    expect(prompt).toContain('Company: Acme');
    expect(prompt).toContain('Job Description: Build APIs');
    expect(prompt).toContain('"name": "Jane Smith"');
  });

  test('omits the job description line when none is given', async () => {
    replyWith('Letter');
    await generateCoverLetter(letterInput);
    expect(lastPrompt()).not.toContain('Job Description:');
  });
});
