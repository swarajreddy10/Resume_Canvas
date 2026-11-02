import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import CoverLetter from '@/lib/db/models/CoverLetter';
import { withAuth } from '@/lib/middleware/withAuth';
import { mapWriteError } from '@/lib/resume/errors';
import { ownsResume } from '@/lib/resume/ownership';

export const GET = withAuth(async (_request, { session }) => {
  try {
    await connectDB();
    const coverLetters = await CoverLetter.find({ userEmail: session.user.email })
      .sort({ createdAt: -1 })
      .lean();
    return NextResponse.json({ coverLetters });
  } catch (error) {
    console.error('Failed to fetch cover letters:', error);
    return NextResponse.json({ error: 'Failed to fetch cover letters' }, { status: 500 });
  }
});

export const POST = withAuth(async (request, { session }) => {
  try {
    const { resumeId, company, position, content } = ((await request.json().catch(() => null)) ??
      {}) as Record<string, unknown>;
    if (!resumeId || !company || !position || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectDB();
    if (!(await ownsResume(resumeId, session.user.email))) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
    }
    const coverLetter = await CoverLetter.create({
      userEmail: session.user.email,
      resumeId,
      company,
      position,
      content,
    });
    return NextResponse.json({ coverLetter }, { status: 201 });
  } catch (error) {
    return mapWriteError(error, 'Failed to save cover letter');
  }
});
