/**
 * The AI service against a mocked Groq client (registered in tests/setup.ts): each test
 * queues the model's reply, then checks how the service parses it or falls back.
 */
import { beforeEach, describe, expect, test } from 'bun:test';
import { generateBulletPoints, optimizeResume } from '@/services/ai.service';
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
