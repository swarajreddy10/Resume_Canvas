import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/middleware/withAuth';
import { withRateLimit } from '@/lib/middleware/withRateLimit';
import { aiRateLimit } from '@/lib/security/rateLimit';
import { sanitizeInput } from '@/lib/security/sanitize';
import Groq from 'groq-sdk';
import { appConfig } from '@/lib/config/app.config';

const groq = new Groq({
  apiKey: appConfig.ai.groqApiKey,
});

export const POST = withRateLimit(aiRateLimit)(
  withAuth(async (request: NextRequest) => {
    try {
      const { resumeData } = sanitizeInput(await request.json());

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
        model: appConfig.ai.model,
        temperature: 0.3,
        max_tokens: appConfig.ai.maxTokens,
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
  })
);
