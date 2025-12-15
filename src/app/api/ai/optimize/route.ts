import { NextRequest, NextResponse } from 'next/server';
import { optimizeResume } from '@/services/ai.service';
import { withAuth } from '@/lib/middleware/withAuth';
import { withRateLimit } from '@/lib/middleware/withRateLimit';
import { aiRateLimit } from '@/lib/security/rateLimit';
import { sanitizeInput } from '@/lib/security/sanitize';

export const POST = withRateLimit(aiRateLimit)(
  withAuth(async (request: NextRequest) => {
    try {
      const body = await request.json();
      const { resumeContent } = sanitizeInput(body);

      if (!resumeContent) {
        return NextResponse.json(
          { error: 'Resume content is required' },
          { status: 400 }
        );
      }

      const optimization = await optimizeResume(resumeContent);
      return NextResponse.json(optimization);
    } catch (error) {
      console.error('Error in resume optimization:', error);
      return NextResponse.json(
        { error: 'Failed to optimize resume' },
        { status: 500 }
      );
    }
  })
);
