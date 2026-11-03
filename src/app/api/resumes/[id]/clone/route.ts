import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import { Resume } from '@/lib/db/models/Resume';
import { withAuth } from '@/lib/middleware/withAuth';
import { editableResumeFields, nextResumeSlug, ownedResume } from '@/lib/resume/ownership';
import { mapWriteError } from '@/lib/resume/errors';

export const POST = withAuth<{ id: string }>(async (request, { session, params }) => {
  try {
    const filter = ownedResume((await params).id, session.user.email);
    if (!filter) return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
    const { title } = ((await request.json().catch(() => ({}))) ?? {}) as { title?: unknown };

    await connectDB();
    const original = await Resume.findOne(filter).lean();
    if (!original) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
    }

    const resume = await Resume.create({
      ...editableResumeFields(original),
      title: typeof title === 'string' && title.trim() ? title : `${original.title} (Copy)`,
      isPublic: false,
      slug: await nextResumeSlug(session.user.email, session.user.name || session.user.email),
      userEmail: session.user.email,
    });

    return NextResponse.json({ resume });
  } catch (error) {
    return mapWriteError(error, 'Failed to clone resume');
  }
});
