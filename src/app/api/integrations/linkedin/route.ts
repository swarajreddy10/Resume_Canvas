import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/middleware/withAuth';
import { LinkedInIntegration } from '@/lib/integrations/linkedin';

export const POST = withAuth(async (request) => {
  try {
    const { linkedinUrl } = ((await request.json().catch(() => null)) ?? {}) as {
      linkedinUrl?: unknown;
    };

    if (typeof linkedinUrl !== 'string' || !linkedinUrl.includes('linkedin.com/in/')) {
      return NextResponse.json({ error: 'Invalid LinkedIn URL' }, { status: 400 });
    }

    // Mock LinkedIn integration
    const integration = new LinkedInIntegration('mock-token');
    const profile = await integration.getProfile();

    if (!profile) {
      return NextResponse.json({ error: 'Failed to fetch LinkedIn profile' }, { status: 500 });
    }

    const resumeData = integration.convertToResumeFormat(profile);

    return NextResponse.json({ resumeData });
  } catch (error) {
    console.error('LinkedIn integration error:', error);
    return NextResponse.json({ error: 'Integration failed' }, { status: 500 });
  }
});
