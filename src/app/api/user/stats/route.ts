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

    const stats = {
      resumeCount: resumes.length,
      totalViews: resumes.reduce(
        (sum, resume) => sum + (resume.viewCount || 0),
        0
      ),
      publicResumes: resumes.filter((resume) => resume.isPublic).length,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
