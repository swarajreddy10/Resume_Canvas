/**
 * The AI service against a mocked Groq client (registered in tests/setup.ts): each test
 * queues the model's reply, then checks how the service parses it or falls back.
 */
import { beforeEach, describe, expect, test } from 'bun:test';
import {
  aiService,
  generateBulletPoints,
  generateCoverLetter,
  optimizeResume,
} from '@/services/ai.service';
import {
  failWith,
  groqCreate,
  lastPrompt,
  replyWith,
  resetGroq,
} from '../helpers/groq';

const FALLBACK_BULLETS = [
  'Led cross-functional teams to deliver high-impact projects',
  'Improved system performance by implementing best practices',
  'Collaborated with stakeholders to define requirements',
];

const request = {
  jobTitle: 'Software Engineer & Architect',
  company: 'Tech Corp 科技公司',
  description: 'Built web applications with React/Node.js 🚀',
  skills: ['C++', 'C#', '.NET'],
};

beforeEach(resetGroq);

describe('generateBulletPoints', () => {
  test('returns the model lines trimmed, without blanks, capped at five', async () => {
    replyWith(
      '  Led A  \n\nBuilt B\nCut C\n   \nShipped D\nScaled E\nOwned F\n'
    );

    const bullets = await generateBulletPoints(request);

    expect(bullets).toEqual([
      'Led A',
      'Built B',
      'Cut C',
      'Shipped D',
      'Scaled E',
    ]);
    expect(groqCreate).toHaveBeenCalledTimes(1);
  });

  test('sends the role, company, description and skills to the model', async () => {
    replyWith('Led A');

    await generateBulletPoints(request);

    const prompt = lastPrompt();
    expect(prompt).toContain('Role: Software Engineer & Architect');
    expect(prompt).toContain('Company: Tech Corp 科技公司');
    expect(prompt).toContain(
      'Description: Built web applications with React/Node.js 🚀'
    );
    expect(prompt).toContain('Key Skills: C++, C#, .NET');
  });

  test('omits the skills line when no skills are given', async () => {
    replyWith('Led A');

    await generateBulletPoints({ ...request, skills: undefined });

    expect(lastPrompt()).not.toContain('Key Skills:');
  });

  test('returns the fixed fallback bullets when the API call fails', async () => {
    failWith();

    expect(await generateBulletPoints(request)).toEqual(FALLBACK_BULLETS);
  });

  test('returns an empty list when the model returns no content', async () => {
    groqCreate.mockResolvedValueOnce({ choices: [] });

    expect(await generateBulletPoints(request)).toEqual([]);
  });
});

describe('optimizeResume', () => {
  test('parses the JSON object out of a well-formed model reply', async () => {
    replyWith(
      'Here is the analysis:\n{"atsScore": 72, "suggestions": ["Add metrics"], "keywords": ["Go", "AWS"]}\nThanks'
    );

    const result = await optimizeResume('Software Engineer with experience');

    expect(result).toEqual({
      atsScore: 72,
      suggestions: ['Add metrics'],
      keywords: ['Go', 'AWS'],
    });
    expect(lastPrompt()).toContain('Software Engineer with experience');
  });

  test('returns the default assessment when the reply holds no JSON', async () => {
    replyWith('I cannot score this resume.');

    const result = await optimizeResume('x');

    expect(result.atsScore).toBe(65);
    expect(result.suggestions).toHaveLength(4);
    expect(result.keywords).toContain('stakeholder management');
  });

  test('returns the error fallback when the reply holds malformed JSON', async () => {
    replyWith('{"atsScore": 72, "suggestions": [unquoted text]}');

    const result = await optimizeResume('x');

    expect(result).toEqual({
      atsScore: 65,
      suggestions: [
        'Add specific metrics and numbers to quantify your achievements',
        'Include more relevant industry keywords',
      ],
      keywords: ['leadership', 'teamwork', 'problem-solving'],
    });
  });

  test('returns the error fallback when the API call fails', async () => {
    failWith('503 Service Unavailable');

    const result = await optimizeResume('x');

    expect(result.atsScore).toBe(65);
    expect(result.keywords).toEqual([
      'leadership',
      'teamwork',
      'problem-solving',
    ]);
  });
});

describe('generateCoverLetter', () => {
  const input = {
    resumeData: { name: 'Jane Smith', skills: ['Go', 'Postgres'] },
    jobTitle: 'Backend Engineer',
    companyName: 'Acme',
  };

  test('returns the model text and sends the job and resume details', async () => {
    replyWith('Dear Acme team,\n\nI am applying...');

    expect(
      await generateCoverLetter({ ...input, jobDescription: 'Build APIs' })
    ).toBe('Dear Acme team,\n\nI am applying...');
    const prompt = lastPrompt();
    expect(prompt).toContain('Job Title: Backend Engineer');
    expect(prompt).toContain('Company: Acme');
    expect(prompt).toContain('Job Description: Build APIs');
    expect(prompt).toContain('"name": "Jane Smith"');
  });

  test('omits the job description line when none is given', async () => {
    replyWith('Letter');

    await generateCoverLetter(input);

    expect(lastPrompt()).not.toContain('Job Description:');
  });

  test('returns a failure message when the model returns no content', async () => {
    groqCreate.mockResolvedValueOnce({
      choices: [{ message: { content: '' } }],
    });

    expect(await generateCoverLetter(input)).toBe(
      'Failed to generate cover letter'
    );
  });

  test('rethrows when the API call fails', async () => {
    failWith('429 Rate limit');

    await expect(generateCoverLetter(input)).rejects.toThrow('429 Rate limit');
  });
});

describe('AIService', () => {
  test('delegates to the module functions', async () => {
    replyWith('Led A');
    replyWith('{"overallScore": 80}');
    replyWith('{"atsScore": 90, "suggestions": [], "keywords": []}');

    expect(await aiService.generateBulletPoints(request)).toEqual(['Led A']);
    expect((await aiService.analyzeResume({})).overallScore).toBe(80);
    expect((await aiService.optimizeResume('x')).atsScore).toBe(90);
    expect(groqCreate).toHaveBeenCalledTimes(3);
  });
});
