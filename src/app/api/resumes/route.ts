import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import connectDB from '@/lib/db/connection';
import { generateSlug } from '@/lib/utils/slug';
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

    let slug = generateSlug(body.title);
    let counter = 1;

    while (await resumeService.getResumeBySlug(slug, session.user.email)) {
      slug = `${generateSlug(body.title)}-${counter}`;
      counter++;
    }

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
