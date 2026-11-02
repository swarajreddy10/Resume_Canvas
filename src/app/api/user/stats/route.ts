import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import { Resume } from '@/lib/db/models/Resume';
import { withAuth } from '@/lib/middleware/withAuth';

// Counted in MongoDB (one round trip on the userEmail index, one document back) and
// never cached: a per-instance cache showed counts up to five minutes old.
export const GET = withAuth(async (_request, { session }) => {
  try {
    await connectDB();
    const [stats] = await Resume.aggregate<{
      resumeCount: number;
      totalViews: number;
      publicResumes: number;
    }>([
      { $match: { userEmail: session.user.email } },
      {
        $group: {
          _id: null,
          resumeCount: { $sum: 1 },
          totalViews: { $sum: '$viewCount' },
          publicResumes: { $sum: { $cond: ['$isPublic', 1, 0] } },
        },
      },
      { $project: { _id: 0 } },
    ]);
    return NextResponse.json(stats ?? { resumeCount: 0, totalViews: 0, publicResumes: 0 });
  } catch (error) {
    console.error('Failed to fetch user stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
});
