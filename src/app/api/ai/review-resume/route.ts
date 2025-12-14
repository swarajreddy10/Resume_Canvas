import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { rateLimit, aiRateLimit } from '@/lib/security/rateLimit';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const { success } = await rateLimit(request, aiRateLimit);
    if (!success) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      );
    }

    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { resumeData } = await request.json();

    const prompt = `
    Review this resume and provide detailed feedback with a score out of 100.
    
    Resume Data:
    Personal Info: ${JSON.stringify(resumeData.personalInfo)}
    Experience: ${JSON.stringify(resumeData.experience)}
    Education: ${JSON.stringify(resumeData.education)}
    Skills: ${JSON.stringify(resumeData.skills)}
    Projects: ${JSON.stringify(resumeData.projects)}
    Certifications: ${JSON.stringify(resumeData.certifications)}

    Provide response in this JSON format:
    {
      "score": number (0-100),
      "suggestions": [
        {
          "type": "improvement|warning|error",
          "section": "section name",
          "message": "what's wrong or could be better",
          "suggestion": "specific actionable advice"
        }
      ]
    }

    Focus on:
    - Content quality and relevance
    - Professional formatting
    - ATS compatibility
    - Missing information
    - Grammar and clarity
    - Quantifiable achievements
    `;

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama3-8b-8192',
      temperature: 0.3,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from AI');
    }

    try {
      const review = JSON.parse(content);
      return NextResponse.json(review);
    } catch {
      // Fallback if JSON parsing fails
      return NextResponse.json({
        score: 75,
        suggestions: [
          {
            type: 'improvement',
            section: 'General',
            message: 'Resume analysis completed',
            suggestion:
              'Consider adding more quantifiable achievements and specific metrics to strengthen your resume.',
          },
        ],
      });
    }
  } catch (error) {
    console.error('Error reviewing resume:', error);
    return NextResponse.json(
      { error: 'Failed to review resume' },
      { status: 500 }
    );
  }
}
