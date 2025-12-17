import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import { Resume } from '@/lib/db/models/Resume';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();
    const { slug } = await params;

    const resume = await Resume.findOne({ slug, isPublic: true });

    if (!resume) {
      return NextResponse.json(
        { error: 'Resume not found or not public' },
        { status: 404 }
      );
    }

    await Resume.findByIdAndUpdate(resume._id, { $inc: { viewCount: 1 } });

    return NextResponse.json({ resume });
  } catch (error) {
    console.error('Error fetching public resume by slug:', error);
    return NextResponse.json(
      { error: 'Failed to fetch resume' },
      { status: 500 }
    );
  }
}
