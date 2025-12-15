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
      const body = sanitizeInput(await request.json());
      const { resumeData, jobTitle, companyName, jobDescription } = body as {
        resumeData: Record<string, unknown>;
        jobTitle: string;
        companyName: string;
        jobDescription?: string;
      };

      const prompt = `
    Generate a professional cover letter based on the resume data and job information.
    
    Resume Information:
    Name: ${(resumeData.personalInfo as Record<string, unknown>)?.name || 'Applicant'}
    Summary: ${(resumeData.personalInfo as Record<string, unknown>)?.summary || ''}
    Experience: ${
      (
        (resumeData.experience as Record<string, unknown>)
          ?.experiences as Record<string, unknown>[]
      )
        ?.map(
          (exp: Record<string, unknown>) =>
            `${exp.position} at ${exp.company}: ${exp.description}`
        )
        .join('. ') || ''
    }
    Skills: ${((resumeData.skills as Record<string, unknown>)?.skills as string[])?.join(', ') || ''}
    Projects: ${
      (
        (resumeData.projects as Record<string, unknown>)?.projects as Record<
          string,
          unknown
        >[]
      )
        ?.map(
          (proj: Record<string, unknown>) => `${proj.name}: ${proj.description}`
        )
        .join('. ') || ''
    }
    
    Job Information:
    Position: ${jobTitle}
    Company: ${companyName}
    Job Description: ${jobDescription || 'Not provided'}
    
    Write a professional cover letter that:
    - Is personalized to the specific role and company
    - Highlights relevant experience and skills from the resume
    - Shows enthusiasm for the position
    - Is concise and professional (3-4 paragraphs)
    - Includes proper formatting with placeholders for contact info
    
    Format as a complete cover letter with:
    - Date
    - Company address placeholder
    - Proper salutation
    - Body paragraphs
    - Professional closing
    - Signature line
    `;

      const completion = await groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: appConfig.ai.model,
        temperature: appConfig.ai.temperature,
        max_tokens: appConfig.ai.maxTokens,
      });

      const coverLetter = completion.choices[0]?.message?.content;
      if (!coverLetter) {
        throw new Error('No response from AI');
      }

      return NextResponse.json({ coverLetter });
    } catch (error) {
      logger.error('Error generating cover letter', { error });
      return NextResponse.json(
        { error: 'Failed to generate cover letter' },
        { status: 500 }
      );
    }
  })
);
