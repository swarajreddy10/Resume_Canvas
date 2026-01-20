import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import connectDB from '@/lib/db/connection';
import { Resume } from '@/lib/db/models/Resume';
import { generatePDF } from '@/services/pdf.service';
import { pdfCache } from '@/lib/cache/ultra-cache';
import crypto from 'crypto';

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
    const urlTemplate = request.nextUrl.searchParams.get('templateId');

    // Create cache key from resume ID + template + last modified
    await connectDB();
    const resume = (await Resume.findById(
      id,
      'updatedAt templateId userEmail'
    ).lean()) as {
      userEmail: string;
      templateId?: string;
      updatedAt: Date;
    } | null;

    if (!resume || resume.userEmail !== session.user.email) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
    }

    const templateId = urlTemplate || resume.templateId || 'standard';
    const cacheKey = crypto
      .createHash('md5')
      .update(`${id}:${templateId}:${resume.updatedAt}`)
      .digest('hex');

    // Check PDF cache first
    const cachedPDF = pdfCache.get(cacheKey);
    if (cachedPDF) {
      return new NextResponse(cachedPDF as BodyInit, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename="resume.pdf"',
          'Cache-Control': 'public, max-age=3600',
          'X-Cache': 'HIT',
        },
      });
    }

    // Generate PDF if not cached
    const fullResume = (await Resume.findById(id).lean()) as Record<
      string,
      unknown
    > | null;
    if (!fullResume) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
    }

    const resumeData = {
      ...fullResume,
      templateId,
      personalInfo: fullResume.personalInfo || {},
      experience: Array.isArray(fullResume.experience)
        ? fullResume.experience
        : [],
      education: Array.isArray(fullResume.education)
        ? fullResume.education
        : [],
      skills: Array.isArray(fullResume.skills) ? fullResume.skills : [],
      projects: Array.isArray(fullResume.projects) ? fullResume.projects : [],
      certifications: Array.isArray(fullResume.certifications)
        ? fullResume.certifications
        : [],
    };

    const pdfBuffer = await generatePDF(resumeData);

    // Cache PDF for 1 hour
    pdfCache.set(cacheKey, pdfBuffer, 3600000);

    const rawName =
      (fullResume.personalInfo as { name?: string })?.name ||
      (fullResume.title as string) ||
      'resume';
    const safeName = rawName.replace(/[^a-z0-9\- ]/gi, '').trim() || 'resume';

    return new NextResponse(pdfBuffer as BodyInit, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${safeName}.pdf"`,
        'Cache-Control': 'public, max-age=3600',
        'X-Cache': 'MISS',
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
