import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import { Resume } from '@/lib/db/models/Resume';
import { withAuth } from '@/lib/middleware/withAuth';

// An unscored resume counts as 75 (the `atsScore || 75` this route has always used).
const atsOrDefault = { $cond: [{ $gt: ['$atsScore', 0] }, '$atsScore', 75] };

interface Summary {
  count: number;
  totalViews: number;
  publicCount: number;
  atsTotal: number;
  top: { title: string; views: number; atsScore: number };
}

// Aggregated in MongoDB (one round trip on the userEmail index, one document back) and
// never cached: a per-instance cache showed figures up to five minutes old.
export const GET = withAuth(async (_request, { session }) => {
  try {
    await connectDB();
    const [summary] = await Resume.aggregate<Summary>([
      { $match: { userEmail: session.user.email } },
      { $sort: { viewCount: -1 } },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
          totalViews: { $sum: '$viewCount' },
          publicCount: { $sum: { $cond: ['$isPublic', 1, 0] } },
          atsTotal: { $sum: atsOrDefault },
          top: {
            $first: {
              title: '$title',
              views: { $ifNull: ['$viewCount', 0] },
              atsScore: atsOrDefault,
            },
          },
        },
      },
    ]);

    const totalViews = summary?.totalViews ?? 0;
    return NextResponse.json({
      totalViews,
      totalDownloads: Math.floor(totalViews * 0.3),
      totalShares: summary?.publicCount ?? 0,
      avgAtsScore: summary ? Math.round(summary.atsTotal / summary.count) : 0,
      topPerformingResume: summary?.top ?? null,
    });
  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
});
