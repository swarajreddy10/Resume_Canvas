import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { LinkedInIntegration } from '@/lib/integrations/linkedin';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { linkedinUrl } = await request.json();

    if (!linkedinUrl || !linkedinUrl.includes('linkedin.com/in/')) {
      return NextResponse.json(
        { error: 'Invalid LinkedIn URL' },
        { status: 400 }
      );
    }

    // Mock LinkedIn integration
    const integration = new LinkedInIntegration('mock-token');
    const profile = await integration.getProfile();

    if (!profile) {
      return NextResponse.json(
        { error: 'Failed to fetch LinkedIn profile' },
        { status: 500 }
      );
    }

    const resumeData = integration.convertToResumeFormat(profile);

    return NextResponse.json({ resumeData });
  } catch (error) {
    console.error('LinkedIn integration error:', error);
    return NextResponse.json({ error: 'Integration failed' }, { status: 500 });
  }
}
