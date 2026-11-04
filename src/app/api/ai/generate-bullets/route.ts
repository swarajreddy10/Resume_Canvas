import { NextResponse } from 'next/server';
import { generateBulletPoints } from '@/services/ai.service';
import { aiErrorResponse } from '@/lib/ai/errors';
import { withAuth } from '@/lib/middleware/withAuth';
import { withRateLimit } from '@/lib/middleware/withRateLimit';
import { aiRateLimit } from '@/lib/security/rateLimit';
import { sanitizeInput } from '@/lib/security/sanitize';

// Generated per request, never cached: asking again should give fresh suggestions.
export const POST = withRateLimit(aiRateLimit)(
  withAuth(async (request) => {
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
      return aiErrorResponse(error, 'Failed to generate bullet points');
    }
  })
);
