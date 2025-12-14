import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import { Resume } from '@/lib/db/models/Resume';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();

    const resume = await Resume.findOne({ _id: id, isPublic: true });

    if (!resume) {
      return NextResponse.json(
        { error: 'Resume not found or not public' },
        { status: 404 }
      );
    }

    // Increment view count
    await Resume.findByIdAndUpdate(id, { $inc: { viewCount: 1 } });

    return NextResponse.json({ resume });
  } catch (error) {
    console.error('Error fetching public resume:', error);
    return NextResponse.json(
      { error: 'Failed to fetch resume' },
      { status: 500 }
    );
  }
}
