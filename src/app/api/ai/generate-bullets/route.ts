import { NextRequest, NextResponse } from 'next/server';
import { generateBulletPoints } from '@/services/ai.service';
import { withAuth } from '@/lib/middleware/withAuth';
import { withRateLimit } from '@/lib/middleware/withRateLimit';
import { aiRateLimit } from '@/lib/security/rateLimit';
import { sanitizeInput } from '@/lib/security/sanitize';

export const POST = withRateLimit(aiRateLimit)(
  withAuth(async (request: NextRequest) => {
    try {
      const body = await request.json();
      const { jobTitle, company, description, skills } = sanitizeInput(body);

      if (!jobTitle || !company || !description) {
        return NextResponse.json(
          { error: 'Missing required fields' },
          { status: 400 }
        );
      }

      const bulletPoints = await generateBulletPoints({
        jobTitle,
        company,
        description,
        skills,
      });

      return NextResponse.json({ bulletPoints });
    } catch (error) {
      console.error('Error in AI generation:', error);
      return NextResponse.json(
        { error: 'Failed to generate bullet points' },
        { status: 500 }
      );
    }
  })
);
