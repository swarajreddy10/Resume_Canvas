import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import connectDB from '@/lib/db/connection';
import { Resume } from '@/lib/db/models/Resume';
import { resumeCache } from '@/lib/cache/memory-cache';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const cacheKey = `stats:${session.user.email}`;
    const cached = resumeCache.get(cacheKey);
    if (cached) {
      return NextResponse.json(cached, {
        headers: { 'Cache-Control': 'public, max-age=300' },
      });
    }

    await connectDB();
    const resumes = await Resume.find(
      { userEmail: session.user.email },
      'viewCount isPublic'
    ).lean();

    const stats = {
      resumeCount: resumes.length,
      totalViews: resumes.reduce(
        (sum, resume) => sum + (resume.viewCount || 0),
        0
      ),
      publicResumes: resumes.filter((resume) => resume.isPublic).length,
    };

    resumeCache.set(cacheKey, stats, 300000); // 5 min cache
    return NextResponse.json(stats, {
      headers: { 'Cache-Control': 'public, max-age=300' },
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
