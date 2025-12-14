import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import connectDB from '@/lib/db/connection';
import { Resume } from '@/lib/db/models/Resume';

interface ResumeDoc {
  personalInfo?: {
    name?: string;
    email?: string;
    phone?: string;
    summary?: string;
  };
  experience?: Array<{ bullets?: string[] }>;
  education?: unknown[];
  skills?: string[];
  projects?: unknown[];
  certifications?: unknown[];
  userEmail: string;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();
    const resume = (await Resume.findById(id)) as ResumeDoc;

    if (!resume || resume.userEmail !== session.user.email) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
    }

    // Simple ATS score calculation
    let score = 0;

    // Personal info completeness (20 points)
    if (resume.personalInfo?.name) score += 5;
    if (resume.personalInfo?.email) score += 5;
    if (resume.personalInfo?.phone) score += 5;
    if (resume.personalInfo?.summary) score += 5;

    // Experience section (30 points)
    if ((resume.experience?.length || 0) > 0) {
      score += 15;
      if (resume.experience?.some((exp) => (exp.bullets?.length || 0) > 0))
        score += 15;
    }

    // Education section (20 points)
    if ((resume.education?.length || 0) > 0) score += 20;

    // Skills section (20 points)
    if ((resume.skills?.length || 0) >= 5) score += 20;
    else if ((resume.skills?.length || 0) > 0) score += 10;

    // Additional sections (10 points)
    if ((resume.projects?.length || 0) > 0) score += 5;
    if ((resume.certifications?.length || 0) > 0) score += 5;

    // Update resume with calculated score
    await Resume.findByIdAndUpdate(id, { atsScore: score });

    return NextResponse.json({ atsScore: score });
  } catch {
    return NextResponse.json(
      { error: 'Failed to calculate ATS score' },
      { status: 500 }
    );
  }
}
