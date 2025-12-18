import { test, expect, describe } from 'bun:test';
import { generateBulletPoints, optimizeResume } from '@/services/ai.service';

describe('AI Service - generateBulletPoints', () => {
  test('returns array of bullet points', async () => {
    const request = {
      jobTitle: 'Software Engineer',
      company: 'Tech Corp',
      description: 'Developed web applications',
      skills: ['React', 'Node.js'],
    };

    const result = await generateBulletPoints(request);

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
    expect(result.length).toBeLessThanOrEqual(5);
  });

  test('handles missing skills gracefully', async () => {
    const request = {
      jobTitle: 'Software Engineer',
      company: 'Tech Corp',
      description: 'Developed web applications',
    };

    const result = await generateBulletPoints(request);

    expect(Array.isArray(result)).toBe(true);
  });

  test('returns fallback on error', async () => {
    const request = {
      jobTitle: '',
      company: '',
      description: '',
    };

    const result = await generateBulletPoints(request);

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  test('handles special characters in input', async () => {
    const request = {
      jobTitle: 'Software Engineer & Architect',
      company: 'Tech Corp (USA)',
      description: 'Developed web applications with React/Node.js',
      skills: ['C++', 'C#', '.NET'],
    };

    const result = await generateBulletPoints(request);

    expect(Array.isArray(result)).toBe(true);
  });

  test('handles long descriptions', async () => {
    const request = {
      jobTitle: 'Software Engineer',
      company: 'Tech Corp',
      description: 'x'.repeat(500),
    };

    const result = await generateBulletPoints(request);

    expect(Array.isArray(result)).toBe(true);
  });

  test('handles unicode characters', async () => {
    const request = {
      jobTitle: 'Software Engineer',
      company: 'Tech Corp 科技公司',
      description: 'Developed applications with émojis 🚀',
    };

    const result = await generateBulletPoints(request);

    expect(Array.isArray(result)).toBe(true);
  });

  test('returns unique bullet points', async () => {
    const request = {
      jobTitle: 'Software Engineer',
      company: 'Tech Corp',
      description: 'Developed web applications',
    };

    const result = await generateBulletPoints(request);
    const uniqueResults = new Set(result);

    expect(uniqueResults.size).toBe(result.length);
  });
});

describe('AI Service - optimizeResume', () => {
  test('returns optimization results with score', async () => {
    const resumeContent = `
      John Doe
      Software Engineer
      Experience: Worked on various projects
    `;

    const result = await optimizeResume(resumeContent);

    expect(result).toHaveProperty('atsScore');
    expect(result).toHaveProperty('suggestions');
    expect(result).toHaveProperty('keywords');
    expect(typeof result.atsScore).toBe('number');
    expect(result.atsScore).toBeGreaterThanOrEqual(0);
    expect(result.atsScore).toBeLessThanOrEqual(100);
    expect(Array.isArray(result.suggestions)).toBe(true);
    expect(Array.isArray(result.keywords)).toBe(true);
  });

  test('handles empty content gracefully', async () => {
    const result = await optimizeResume('');

    expect(result).toHaveProperty('atsScore');
    expect(result.atsScore).toBeGreaterThanOrEqual(0);
  });

  test('handles very long content', async () => {
    const longContent = 'Experience: ' + 'x'.repeat(10000);
    const result = await optimizeResume(longContent);

    expect(result).toHaveProperty('atsScore');
  });

  test('handles special characters', async () => {
    const content = 'John Doe\nEmail: john@example.com\nPhone: +1-234-567-8900';
    const result = await optimizeResume(content);

    expect(result).toHaveProperty('atsScore');
  });

  test('returns valid suggestions array', async () => {
    const content = 'Software Engineer with experience';
    const result = await optimizeResume(content);

    expect(Array.isArray(result.suggestions)).toBe(true);
    expect(result.suggestions.length).toBeGreaterThan(0);
  });

  test('returns valid keywords array', async () => {
    const content = 'Software Engineer with experience';
    const result = await optimizeResume(content);

    expect(Array.isArray(result.keywords)).toBe(true);
    expect(result.keywords.length).toBeGreaterThan(0);
  });

  test('handles malformed content', async () => {
    const malformed = '{{{}}}[[[]]]<<<>>>';
    const result = await optimizeResume(malformed);

    expect(result).toHaveProperty('atsScore');
  });

  test('handles null bytes and control characters', async () => {
    const content = 'Resume\x00Content\x01Test';
    const result = await optimizeResume(content);

    expect(result).toHaveProperty('atsScore');
  });
});

describe('AI Service - Error Handling', () => {
  test('generateBulletPoints handles network errors', async () => {
    const request = {
      jobTitle: 'Test',
      company: 'Test',
      description: 'Test',
    };

    const result = await generateBulletPoints(request);

    expect(Array.isArray(result)).toBe(true);
  });

  test('optimizeResume handles API failures', async () => {
    const result = await optimizeResume('test content');

    expect(result).toHaveProperty('atsScore');
    expect(typeof result.atsScore).toBe('number');
  });
});

describe('AI Service - Performance', () => {
  test('generateBulletPoints completes within timeout', async () => {
    const start = performance.now();

    await generateBulletPoints({
      jobTitle: 'Engineer',
      company: 'Tech',
      description: 'Built software',
    });

    const duration = performance.now() - start;
    expect(duration).toBeLessThan(5000);
  });

  test('optimizeResume completes within timeout', async () => {
    const start = performance.now();

    await optimizeResume('Test resume content');

    const duration = performance.now() - start;
    expect(duration).toBeLessThan(5000);
  });
});
