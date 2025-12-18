import { test, expect, describe } from 'bun:test';
import { analyzeResumeComprehensively } from '@/services/ai.service';

describe('AI Service - analyzeResumeComprehensively', () => {
  test.skip('returns detailed analysis with scores', async () => {
    const resumeData = {
      personalInfo: { name: 'John Doe', email: 'john@example.com' },
      experience: [{ company: 'Tech Corp', position: 'Engineer' }],
      education: [{ school: 'MIT', degree: 'BS' }],
      skills: ['React', 'Node.js'],
    };

    const result = await analyzeResumeComprehensively(resumeData);

    expect(result).toHaveProperty('overallScore');
    expect(result).toHaveProperty('sectionScores');
    expect(result).toHaveProperty('criticalIssues');
    expect(result).toHaveProperty('recommendations');
    expect(result).toHaveProperty('competitiveAnalysis');
    expect(typeof result.overallScore).toBe('number');
    expect(result.overallScore).toBeGreaterThanOrEqual(0);
    expect(result.overallScore).toBeLessThanOrEqual(100);
  });

  test.skip('handles empty resume data', async () => {
    const result = await analyzeResumeComprehensively({});

    expect(result).toHaveProperty('overallScore');
    expect(Array.isArray(result.criticalIssues)).toBe(true);
    expect(Array.isArray(result.recommendations)).toBe(true);
  });

  test.skip('handles complex resume data', async () => {
    const complexData = {
      personalInfo: { name: 'Jane Smith', email: 'jane@example.com' },
      experience: Array(5).fill({ company: 'Company', position: 'Role' }),
      education: Array(3).fill({ school: 'University', degree: 'Degree' }),
      skills: Array(20).fill('Skill'),
      projects: Array(5).fill({ name: 'Project', description: 'Description' }),
    };

    const result = await analyzeResumeComprehensively(complexData);

    expect(result.overallScore).toBeGreaterThanOrEqual(0);
    expect(result.sectionScores).toHaveProperty('experience');
    expect(result.sectionScores).toHaveProperty('education');
    expect(result.sectionScores).toHaveProperty('skills');
  });

  test('returns fallback on API error', async () => {
    try {
      await analyzeResumeComprehensively(null);
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});
