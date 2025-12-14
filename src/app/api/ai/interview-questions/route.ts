import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { jobTitle, company } = await request.json();

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
      model: 'llama3-8b-8192',
      temperature: 0.7,
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
    console.error('Error generating interview questions:', error);
    return NextResponse.json(
      { error: 'Failed to generate questions' },
      { status: 500 }
    );
  }
}
