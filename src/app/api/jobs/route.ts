import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import connectDB from '@/lib/db/connection';
import { JobSearch } from '@/lib/db/models/JobSearch';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const jobs = await JobSearch.find({ userEmail: session.user.email })
      .populate('resumeUsed', 'title')
      .sort({ updatedAt: -1 });

    return NextResponse.json({ jobs });
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
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

    const body = await request.json();
    await connectDB();

    const job = new JobSearch({
      ...body,
      userEmail: session.user.email,
    });

    await job.save();
    return NextResponse.json({ job });
  } catch {
    return NextResponse.json({ error: 'Failed to save job' }, { status: 500 });
  }
}
