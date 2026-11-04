import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import { Resume } from '@/lib/db/models/Resume';
import { withAuth } from '@/lib/middleware/withAuth';

interface Summary {
  totalViews: number;
  publicCount: number;
  avgAts: number | null;
  top: { title: string; views: number; atsScore: number | null };
}

// Aggregated in MongoDB (one round trip on the userEmail index, one document back) and
// never cached: a per-instance cache showed figures up to five minutes old. Only measured
// figures: a resume never scored is left out of the ATS average ($avg ignores missing
// values and is null when none are numeric,
// https://www.mongodb.com/docs/manual/reference/operator/aggregation/avg/).
export const GET = withAuth(async (_request, { session }) => {
  try {
    await connectDB();
    const [summary] = await Resume.aggregate<Summary>([
      { $match: { userEmail: session.user.email } },
      { $sort: { viewCount: -1 } },
      {
        $group: {
          _id: null,
          totalViews: { $sum: '$viewCount' },
          publicCount: { $sum: { $cond: ['$isPublic', 1, 0] } },
          avgAts: { $avg: '$atsScore' },
          top: {
            $first: {
              title: '$title',
              views: { $ifNull: ['$viewCount', 0] },
              atsScore: { $ifNull: ['$atsScore', null] },
            },
          },
        },
      },
    ]);

    return NextResponse.json({
      totalViews: summary?.totalViews ?? 0,
      totalShares: summary?.publicCount ?? 0,
      avgAtsScore: summary?.avgAts == null ? null : Math.round(summary.avgAts),
      topPerformingResume: summary?.top ?? null,
    });
  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
});
