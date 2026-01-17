import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/middleware/withAuth';
import { withRateLimit } from '@/lib/middleware/withRateLimit';
import { aiRateLimit } from '@/lib/security/rateLimit';
import { sanitizeInput } from '@/lib/security/sanitize';
import { generateCoverLetter } from '@/services/ai.service';
import { logger } from '@/lib/utils/logger';

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

      if (!jobTitle || !companyName) {
        return NextResponse.json(
          { error: 'Job title and company name are required' },
          { status: 400 }
        );
      }

      const coverLetter = await generateCoverLetter({
        resumeData,
        jobTitle,
        companyName,
        jobDescription,
      });

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
