import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import connectDB from '@/lib/db/connection';
import CoverLetter from '@/lib/db/models/CoverLetter';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const coverLetters = await CoverLetter.find({
      userEmail: session.user.email,
    }).sort({ createdAt: -1 });

    return NextResponse.json({ coverLetters });
  } catch (error) {
    console.error('Error fetching cover letters:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cover letters' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { resumeId, company, position, content } = await request.json();

    if (!resumeId || !company || !position || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await connectDB();
    const coverLetter = await CoverLetter.create({
      userEmail: session.user.email,
      resumeId,
      company,
      position,
      content,
    });

    return NextResponse.json({ coverLetter }, { status: 201 });
  } catch (error) {
    console.error('Error saving cover letter:', error);
    return NextResponse.json(
      { error: 'Failed to save cover letter' },
      { status: 500 }
    );
  }
}
