import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import connectDB from '@/lib/db/connection';
import { Resume } from '@/lib/db/models/Resume';
import { generatePDF } from '@/services/pdf.service';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();
    const resume = await Resume.findById(id);

    if (!resume || resume.userEmail !== session.user.email) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
    }

    const urlTemplate = request.nextUrl.searchParams.get('templateId');
    const resumeDoc = resume as {
      templateId?: string;
      toObject?: () => unknown;
    };
    const templateId = urlTemplate || resumeDoc.templateId || 'standard';

    const resumeData = resumeDoc.toObject ? resumeDoc.toObject() : resume;

    // Ensure all required fields have default values
    const sanitizedData = {
      ...resumeData,
      templateId,
      personalInfo: resumeData.personalInfo || {},
      experience: Array.isArray(resumeData.experience)
        ? resumeData.experience
        : [],
      education: Array.isArray(resumeData.education)
        ? resumeData.education
        : [],
      skills: Array.isArray(resumeData.skills) ? resumeData.skills : [],
      projects: Array.isArray(resumeData.projects) ? resumeData.projects : [],
      certifications: Array.isArray(resumeData.certifications)
        ? resumeData.certifications
        : [],
    };

    const pdfBuffer = await generatePDF(sanitizedData);

    const rawName =
      (resumeData.personalInfo?.name as string | undefined) ||
      (resumeData.title as string | undefined) ||
      'resume';
    const safeName = rawName.replace(/[^a-z0-9\- ]/gi, '').trim() || 'resume';

    return new NextResponse(pdfBuffer as BodyInit, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${safeName}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate PDF',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
