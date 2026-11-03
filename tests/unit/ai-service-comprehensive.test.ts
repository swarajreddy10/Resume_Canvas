import { beforeEach, describe, expect, test } from 'bun:test';
import { analyzeResumeComprehensively } from '@/services/ai.service';
import { failWith, lastPrompt, replyWith, resetGroq } from '../helpers/groq';

const analysis = {
  overallScore: 71,
  sectionScores: {
    personalInfo: 80,
    experience: 70,
    education: 75,
    skills: 65,
    projects: 60,
    certifications: 40,
  },
  criticalIssues: ['No metrics'],
  recommendations: ['Quantify results'],
  competitiveAnalysis: 'Average',
};

beforeEach(resetGroq);

describe('analyzeResumeComprehensively', () => {
  test('returns detailed analysis with scores', async () => {
    replyWith(`Analysis follows.\n${JSON.stringify(analysis)}`);
    const resumeData = {
      personalInfo: { name: 'John Doe', email: 'john@example.com' },
      experience: [{ company: 'Tech Corp', position: 'Engineer' }],
      skills: ['React', 'Node.js'],
    };

    const result = await analyzeResumeComprehensively(resumeData);

    expect(result).toEqual(analysis);
    expect(lastPrompt()).toContain('"company": "Tech Corp"');
  });

  test('handles empty resume data', async () => {
    replyWith('No JSON here');

    const result = await analyzeResumeComprehensively({});

    expect(result.overallScore).toBe(65);
    expect(result.criticalIssues).toHaveLength(2);
    expect(result.recommendations).toHaveLength(2);
    expect(lastPrompt()).toContain('{}');
  });

  test('handles complex resume data', async () => {
    replyWith(JSON.stringify(analysis));
    const complexData = {
      experience: Array(5).fill({ company: 'Company', position: 'Role' }),
      education: Array(3).fill({ school: 'University', degree: 'Degree' }),
      skills: Array(20).fill('Skill'),
    };

    const result = await analyzeResumeComprehensively(complexData);

    expect(result.sectionScores).toEqual(analysis.sectionScores);
    expect(lastPrompt().match(/"school": "University"/g)).toHaveLength(3);
  });

  test('rethrows when the API call fails', async () => {
    failWith('401 Invalid API Key');

    await expect(analyzeResumeComprehensively({})).rejects.toThrow(
      '401 Invalid API Key'
    );
  });

  test('rethrows when the reply holds malformed JSON', async () => {
    replyWith('{"overallScore": 71,,}');

    await expect(analyzeResumeComprehensively({})).rejects.toThrow(SyntaxError);
  });
});
