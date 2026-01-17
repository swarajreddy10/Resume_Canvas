import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import connectDB from '@/lib/db/connection';
import { sanitizeResumeData } from '@/lib/security/sanitize';
import { Resume } from '@/lib/db/models/Resume';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;
    const resume = await Resume.findById(id).lean();

    if (
      !resume ||
      (resume as unknown as { userEmail: string }).userEmail !==
        session.user.email
    ) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
    }

    return NextResponse.json({ resume });
  } catch (error) {
    console.error(
      JSON.stringify({ level: 'error', msg: 'Failed to fetch resume', error })
    );
    return NextResponse.json(
      { error: 'Failed to fetch resume' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = sanitizeResumeData(await request.json());
    await connectDB();

    const { id } = await params;
    const existing = await Resume.findById(id).lean();
    if (
      !existing ||
      (existing as unknown as { userEmail: string }).userEmail !==
        session.user.email
    ) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
    }

    const resume = await Resume.findByIdAndUpdate(
      id,
      { ...body, updatedAt: new Date() },
      { new: true }
    ).lean();
    return NextResponse.json({ resume });
  } catch (error) {
    console.error(
      JSON.stringify({ level: 'error', msg: 'Failed to update resume', error })
    );
    return NextResponse.json(
      { error: 'Failed to update resume' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;
    const existing = await Resume.findById(id).lean();
    if (
      !existing ||
      (existing as unknown as { userEmail: string }).userEmail !==
        session.user.email
    ) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
    }

    await Resume.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Resume deleted successfully' });
  } catch (error) {
    console.error(
      JSON.stringify({ level: 'error', msg: 'Failed to delete resume', error })
    );
    return NextResponse.json(
      { error: 'Failed to delete resume' },
      { status: 500 }
    );
  }
}
