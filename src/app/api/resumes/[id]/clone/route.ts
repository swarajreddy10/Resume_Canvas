import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import connectDB from '@/lib/db/connection';
import { Resume } from '@/lib/db/models/Resume';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { title } = await request.json();

    await connectDB();

    const originalResume = await Resume.findOne({
      _id: id,
      userEmail: session.user.email,
    });

    if (!originalResume) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
    }

    const clonedResume = new Resume({
      userEmail: session.user.email,
      title: title || `${originalResume.title} (Copy)`,
      personalInfo: originalResume.personalInfo,
      education: originalResume.education,
      experience: originalResume.experience,
      skills: originalResume.skills,
      projects: originalResume.projects,
      certifications: originalResume.certifications,
      templateId: originalResume.templateId,
      isPublic: false,
      viewCount: 0,
    });

    await clonedResume.save();

    return NextResponse.json({ resume: clonedResume });
  } catch (error) {
    console.error('Error cloning resume:', error);
    return NextResponse.json(
      { error: 'Failed to clone resume' },
      { status: 500 }
    );
  }
}
