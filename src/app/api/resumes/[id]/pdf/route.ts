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
    const pdfBuffer = await generatePDF({ ...resumeData, templateId });

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
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}
