import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import connectDB from '@/lib/db/connection';
import { generateUserSlug } from '@/lib/utils/slug';
import { sanitizeResumeData } from '@/lib/security/sanitize';
import { resumeService } from '@/server/services/resume.service';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const resumes = await resumeService.getUserResumes(session.user.email);
    return NextResponse.json({ resumes });
  } catch (error) {
    console.error(
      JSON.stringify({ level: 'error', msg: 'Failed to fetch resumes', error })
    );
    return NextResponse.json(
      { error: 'Failed to fetch resumes' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = sanitizeResumeData(await request.json());
    await connectDB();

    // Get user's resume count for sequential numbering
    const userResumes = await resumeService.getUserResumes(session.user.email);
    const userName = generateUserSlug(session.user.name || session.user.email);
    const resumeNumber = userResumes.length + 1;
    const slug = `${userName}/${resumeNumber}`;

    const resume = await resumeService.createResume({
      ...body,
      slug,
      userEmail: session.user.email,
    });

    return NextResponse.json({ resume });
  } catch (error) {
    console.error(
      JSON.stringify({ level: 'error', msg: 'Failed to create resume', error })
    );
    return NextResponse.json(
      { error: 'Failed to create resume' },
      { status: 500 }
    );
  }
}
