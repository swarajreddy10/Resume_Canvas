import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import { Resume } from '@/lib/db/models/Resume';
import { withAuth } from '@/lib/middleware/withAuth';
import { ownedResume } from '@/lib/resume/ownership';
import { generatePDF } from '@/services/pdf.service';

const notFound = () => NextResponse.json({ error: 'Resume not found' }, { status: 404 });

// One owner-scoped read, then render. No PDF cache: a PDF is one user's data, so it is
// never stored by shared caches (withAuth marks it private, no-store).
export const GET = withAuth<{ id: string }>(async (request, { session, params }) => {
  try {
    const filter = ownedResume((await params).id, session.user.email);
    if (!filter) return notFound();
    await connectDB();
    const resume = (await Resume.findOne(filter).lean()) as Record<string, unknown> | null;
    if (!resume) return notFound();

    const pdfBuffer = await generatePDF({
      ...resume,
      templateId:
        request.nextUrl.searchParams.get('templateId') ||
        (resume.templateId as string | undefined) ||
        'standard',
      personalInfo: resume.personalInfo || {},
      experience: Array.isArray(resume.experience) ? resume.experience : [],
      education: Array.isArray(resume.education) ? resume.education : [],
      skills: Array.isArray(resume.skills) ? resume.skills : [],
      projects: Array.isArray(resume.projects) ? resume.projects : [],
      certifications: Array.isArray(resume.certifications) ? resume.certifications : [],
    });

    const rawName =
      (resume.personalInfo as { name?: string })?.name || (resume.title as string) || 'resume';
    const safeName = rawName.replace(/[^a-z0-9\- ]/gi, '').trim() || 'resume';

    return new NextResponse(pdfBuffer as BodyInit, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${safeName}.pdf"`,
      },
    });
  } catch (error) {
    // Logged, never returned: the message can name server paths and browser internals.
    console.error('Failed to generate PDF:', error);
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
  }
});
