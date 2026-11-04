import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/middleware/withAuth';
import { withRateLimit } from '@/lib/middleware/withRateLimit';
import { aiRateLimit } from '@/lib/security/rateLimit';
import { sanitizeInput } from '@/lib/security/sanitize';
import { reviewResume } from '@/services/ai.service';
import { aiErrorResponse } from '@/lib/ai/errors';

export const POST = withRateLimit(aiRateLimit)(
  withAuth(async (request: NextRequest) => {
    try {
      const { resumeData } = sanitizeInput(await request.json());

      if (!resumeData || typeof resumeData !== 'object') {
        return NextResponse.json(
          { error: 'Resume data is required' },
          { status: 400 }
        );
      }

      return NextResponse.json(await reviewResume(resumeData));
    } catch (error) {
      return aiErrorResponse(error, 'Failed to review resume');
    }
  })
);
