import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/middleware/withAuth';
import { withRateLimit } from '@/lib/middleware/withRateLimit';
import { aiRateLimit } from '@/lib/security/rateLimit';
import { sanitizeInput } from '@/lib/security/sanitize';
import { jobMatchingService } from '@/services/job-matching.service';

export const POST = withRateLimit(aiRateLimit)(
  withAuth(async (request: NextRequest) => {
    try {
      const body = await request.json();
      const sanitizedBody = sanitizeInput(body);

      const { resumeData, preferences } = sanitizedBody;

      if (!resumeData || !resumeData.skills || !resumeData.experience) {
        return NextResponse.json(
          { error: 'Resume data with skills and experience is required' },
          { status: 400 }
        );
      }

      const result = await jobMatchingService.analyzeJobMatching({
        resumeData,
        preferences,
      });

      return NextResponse.json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error('Job matching analysis failed:', error);
      return NextResponse.json(
        { error: 'Failed to analyze job matches' },
        { status: 500 }
      );
    }
  })
);
