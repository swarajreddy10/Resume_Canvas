import connectDB from '@/lib/db/connection';
import { Resume } from '@/lib/db/models/Resume';
import { optimizedQueries } from '@/lib/db/optimizer';
import { withAuth } from '@/lib/middleware/withAuth';
import { editableResumeFields, nextResumeSlug } from '@/lib/resume/ownership';
import { mapWriteError } from '@/lib/resume/errors';
import { NextResponse } from 'next/server';

// No response cache: the indexed read examines only the owner's documents
// (25 of 50,000 in a local benchmark, about 1 ms p50 on 2026-11-03), and a per-instance cache
// served stale lists after every write.
export const GET = withAuth(async (_request, { session }) => {
  try {
    await connectDB();
    const [query, projection] = optimizedQueries.getUserResumes(
      session.user.email
    );
    const resumes = await Resume.find(query, projection)
      .sort({ updatedAt: -1 })
      .lean();
    return NextResponse.json({ resumes });
  } catch (error) {
    console.error('Failed to fetch resumes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch resumes' },
      { status: 500 }
    );
  }
});

export const POST = withAuth(async (request, { session }) => {
  try {
    const fields = editableResumeFields(await request.json().catch(() => null));
    await connectDB();

    const resume = await Resume.create({
      ...fields,
      slug: await nextResumeSlug(
        session.user.email,
        session.user.name || session.user.email
      ),
      userEmail: session.user.email,
    });

    return NextResponse.json({ resume });
  } catch (error) {
    return mapWriteError(error, 'Failed to create resume');
  }
});
