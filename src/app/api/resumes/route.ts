import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import connectDB from '@/lib/db/connection';
import { generateUserSlug } from '@/lib/utils/slug';
import { sanitizeResumeData } from '@/lib/security/sanitize';
import { resumeService } from '@/server/services/resume.service';
import { UserCounter } from '@/lib/db/models/UserCounter';

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

    const userName = generateUserSlug(session.user.name || session.user.email);

    const counter = await UserCounter.findOneAndUpdate(
      { userEmail: session.user.email },
      { $inc: { resumeCount: 1 } },
      { upsert: true, new: true }
    );

    const slug = `${userName}/${counter.resumeCount}`;

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
