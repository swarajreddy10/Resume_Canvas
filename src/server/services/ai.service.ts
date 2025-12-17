import Groq from 'groq-sdk';
import { AI_PROMPTS, AI_CONFIG } from '@/lib/config/ai.prompts';
import { env } from '@/lib/env';

const groq = new Groq({ apiKey: env.GROQ_API_KEY });

export interface BulletPointRequest {
  jobTitle: string;
  company: string;
  description: string;
  skills?: string[];
}

export class AIService {
  async generateBulletPoints(request: BulletPointRequest): Promise<string[]> {
    try {
      const version = AI_CONFIG.versions.bulletGeneration;
      const prompt = AI_PROMPTS.bulletGeneration[version](request);

      const completion = await groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: AI_CONFIG.model,
        temperature: AI_CONFIG.temperature,
        max_tokens: AI_CONFIG.maxTokens,
      });

      const content = completion.choices[0]?.message?.content || '';
      return content
        .split('\n')
        .filter((line) => line.trim())
        .map((line) => line.trim())
        .slice(0, 5);
    } catch (error) {
      console.error(
        JSON.stringify({
          level: 'error',
          msg: 'AI bullet generation failed',
          error,
        })
      );
      return [
        'Led cross-functional teams to deliver high-impact projects',
        'Improved system performance by implementing best practices',
        'Collaborated with stakeholders to define requirements',
      ];
    }
  }

  async analyzeResume(resumeData: unknown) {
    try {
      const version = AI_CONFIG.versions.resumeAnalysis;
      const prompt = AI_PROMPTS.resumeAnalysis[version](resumeData);

      const completion = await groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: AI_CONFIG.model,
        temperature: 0.2,
        max_tokens: 1500,
      });

      const content = completion.choices[0]?.message?.content || '';
      const jsonMatch = content.match(/\{[\s\S]*\}/);

      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      return {
        overallScore: 65,
        sectionScores: {
          personalInfo: 70,
          experience: 60,
          education: 75,
          skills: 65,
          projects: 60,
          certifications: 50,
        },
        criticalIssues: ['Lack of quantifiable achievements'],
        recommendations: [
          'Add specific metrics to all experience bullet points',
        ],
        competitiveAnalysis: 'Average compared to competitive candidates',
      };
    } catch (error) {
      console.error(
        JSON.stringify({
          level: 'error',
          msg: 'AI resume analysis failed',
          error,
        })
      );
      throw error;
    }
  }

  async optimizeResume(resumeContent: string) {
    try {
      const version = AI_CONFIG.versions.atsOptimization;
      const prompt = AI_PROMPTS.atsOptimization[version](resumeContent);

      const completion = await groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: AI_CONFIG.model,
        temperature: 0.2,
        max_tokens: 1200,
      });

      const content = completion.choices[0]?.message?.content || '';
      const jsonMatch = content.match(/\{[\s\S]*\}/);

      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      return {
        atsScore: 65,
        suggestions: ['Add quantifiable metrics to achievements'],
        keywords: ['leadership', 'teamwork', 'problem-solving'],
      };
    } catch (error) {
      console.error(
        JSON.stringify({
          level: 'error',
          msg: 'ATS optimization failed',
          error,
        })
      );
      return {
        atsScore: 65,
        suggestions: ['Add specific metrics and numbers'],
        keywords: ['leadership', 'teamwork'],
      };
    }
  }
}

export const aiService = new AIService();
