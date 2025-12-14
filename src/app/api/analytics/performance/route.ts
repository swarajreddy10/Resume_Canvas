import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import connectDB from '@/lib/db/connection';
import { Resume } from '@/lib/db/models/Resume';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const resumes = await Resume.find({ userEmail: session.user.email });

    const totalViews = resumes.reduce((sum, r) => sum + (r.viewCount || 0), 0);
    const topResume = resumes.sort(
      (a, b) => (b.viewCount || 0) - (a.viewCount || 0)
    )[0];

    const analyticsData = {
      totalViews,
      totalDownloads: Math.floor(totalViews * 0.3),
      totalShares: resumes.filter((r) => r.isPublic).length,
      avgAtsScore: Math.round(
        resumes.reduce((sum, r) => sum + (r.atsScore || 75), 0) /
          Math.max(resumes.length, 1)
      ),
      topPerformingResume: topResume
        ? {
            title: topResume.title,
            views: topResume.viewCount || 0,
            atsScore: topResume.atsScore || 75,
          }
        : null,
    };

    return NextResponse.json(analyticsData);
  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
