import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import { Resume } from '@/lib/db/models/Resume';
import { withAuth } from '@/lib/middleware/withAuth';

// One read scoped to the owner: another user's slug is a 404.
export const GET = withAuth<{ slug: string }>(async (_request, { session, params }) => {
  try {
    const { slug } = await params;
    await connectDB();
    const resume = await Resume.findOne({ slug, userEmail: session.user.email }).lean();
    return resume
      ? NextResponse.json({ resume })
      : NextResponse.json({ error: 'Resume not found' }, { status: 404 });
  } catch (error) {
    console.error('Failed to fetch resume:', error);
    return NextResponse.json({ error: 'Failed to fetch resume' }, { status: 500 });
  }
});
