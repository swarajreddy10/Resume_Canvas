import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/middleware/withAuth';
import { withRateLimit } from '@/lib/middleware/withRateLimit';
import { aiRateLimit } from '@/lib/security/rateLimit';
import { sanitizeInput } from '@/lib/security/sanitize';
import { appConfig } from '@/lib/config/app.config';
import { logger } from '@/lib/utils/logger';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: appConfig.ai.groqApiKey,
});

export const POST = withRateLimit(aiRateLimit)(
  withAuth(async (request: NextRequest) => {
    try {
      const { jobTitle, company } = sanitizeInput(await request.json());

      const prompt = `
    Generate interview questions for a ${jobTitle} position at ${company || 'a company'}.
    
    Provide response in this JSON format:
    {
      "questions": [
        {
          "question": "specific interview question",
          "category": "behavioral|technical|situational|company-specific",
          "difficulty": "easy|medium|hard",
          "tips": ["tip 1", "tip 2", "tip 3"]
        }
      ]
    }
    
    Generate 8-10 questions covering:
    - Behavioral questions (STAR method applicable)
    - Technical questions relevant to the role
    - Situational questions
    - Company-specific questions
    
    For each question, provide 3-4 actionable tips for answering effectively.
    Mix difficulty levels appropriately for the role level.
    `;

      const completion = await groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: appConfig.ai.model,
        temperature: appConfig.ai.temperature,
        max_tokens: appConfig.ai.maxTokens,
      });

      const content = completion.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response from AI');
      }

      try {
        const questions = JSON.parse(content);
        return NextResponse.json(questions);
      } catch {
        return NextResponse.json({
          questions: [
            {
              question: 'Tell me about yourself and your experience.',
              category: 'behavioral',
              difficulty: 'easy',
              tips: [
                'Keep it concise and relevant to the role',
                'Focus on professional achievements',
                "End with why you're interested in this position",
              ],
            },
            {
              question: 'Describe a challenging project you worked on.',
              category: 'behavioral',
              difficulty: 'medium',
              tips: [
                'Use the STAR method (Situation, Task, Action, Result)',
                'Focus on your specific contributions',
                'Highlight the positive outcome and lessons learned',
              ],
            },
          ],
        });
      }
    } catch (error) {
      logger.error('Error generating interview questions', { error });
      return NextResponse.json(
        { error: 'Failed to generate questions' },
        { status: 500 }
      );
    }
  })
);
