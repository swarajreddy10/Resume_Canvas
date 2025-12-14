import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import connectDB from '@/lib/db/connection';
import { Resume } from '@/lib/db/models/Resume';
import { generateSlug } from '@/lib/utils/slug';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const resumes = await Resume.find({ userEmail: session.user.email }).sort({
      updatedAt: -1,
    });

    return NextResponse.json({ resumes });
  } catch (error) {
    console.error('Error fetching resumes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch resumes' },
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

    let slug = generateSlug(body.title);
    let counter = 1;

    // Handle slug conflicts
    while (await Resume.findOne({ slug, userEmail: session.user.email })) {
      slug = `${generateSlug(body.title)}-${counter}`;
      counter++;
    }

    const resume = new Resume({
      ...body,
      slug,
      userEmail: session.user.email,
    });

    await resume.save();
    return NextResponse.json({ resume });
  } catch (error) {
    console.error('Error creating resume:', error);
    return NextResponse.json(
      { error: 'Failed to create resume' },
      { status: 500 }
    );
  }
}
