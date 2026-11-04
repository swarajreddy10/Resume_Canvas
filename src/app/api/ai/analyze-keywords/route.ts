import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/middleware/withAuth';
import { withRateLimit } from '@/lib/middleware/withRateLimit';
import { aiRateLimit } from '@/lib/security/rateLimit';
import { sanitizeInput } from '@/lib/security/sanitize';
import connectDB from '@/lib/db/connection';
import { Resume } from '@/lib/db/models/Resume';
import { analyzeKeywords } from '@/services/ai.service';
import { aiErrorResponse } from '@/lib/ai/errors';

export const POST = withRateLimit(aiRateLimit)(
  withAuth(async (request: NextRequest, { session }) => {
    try {
      const body = sanitizeInput(await request.json());
      const { resumeId, resumeData, jobDescription } = body;

      if (!jobDescription) {
        return NextResponse.json(
          { error: 'Job description is required' },
          { status: 400 }
        );
      }

      interface ResumeContent {
        personalInfo?: { name?: string; email?: string; summary?: string };
        experience?: Array<{
          position?: string;
          company?: string;
          description?: string;
          bullets?: string[];
        }>;
        education?: Array<{ degree?: string; field?: string; school?: string }>;
        skills?: string[];
        projects?: Array<{
          name?: string;
          description?: string;
          technologies?: string;
        }>;
      }

      let resumeContent: ResumeContent;

      if (resumeId) {
        // Get saved resume from database
        await connectDB();
        const resume = await Resume.findOne({
          _id: resumeId,
          userEmail: session.user.email,
        });

        if (!resume) {
          return NextResponse.json(
            { error: 'Resume not found. Please save your resume first.' },
            { status: 404 }
          );
        }
        resumeContent = resume;
      } else {
        // Use current form data if not saved yet
        resumeContent = resumeData;
      }

      // Validate minimum content
      const hasExperience = (resumeContent?.experience?.length || 0) > 0;
      const hasSkills = (resumeContent?.skills?.length || 0) > 0;
      const hasEducation = (resumeContent?.education?.length || 0) > 0;
      const hasSummary = Boolean(resumeContent?.personalInfo?.summary);

      const hasContent =
        hasExperience || hasSkills || hasEducation || hasSummary;

      if (!hasContent) {
        return NextResponse.json(
          {
            error:
              'Please add some resume content (summary, skills, experience, or education) before analyzing keywords.',
          },
          { status: 400 }
        );
      }

      const resumeText = `
    ${resumeContent?.personalInfo?.summary || ''}
    ${
      Array.isArray(resumeContent?.experience)
        ? resumeContent.experience
            .map(
              (exp) =>
                `${exp.position || ''} ${exp.company || ''} ${exp.description || ''} ${Array.isArray(exp.bullets) ? exp.bullets.join(' ') : ''}`
            )
            .join(' ')
        : ''
    }
    ${
      Array.isArray(resumeContent?.education)
        ? resumeContent.education
            .map(
              (edu) =>
                `${edu.degree || ''} ${edu.field || ''} ${edu.school || ''}`
            )
            .join(' ')
        : ''
    }
    ${Array.isArray(resumeContent?.skills) ? resumeContent.skills.join(' ') : ''}
    ${
      Array.isArray(resumeContent?.projects)
        ? resumeContent.projects
            .map(
              (proj) =>
                `${proj.name || ''} ${proj.description || ''} ${proj.technologies || ''}`
            )
            .join(' ')
        : ''
    }
    `.trim();

      return NextResponse.json(
        await analyzeKeywords(jobDescription, resumeText)
      );
    } catch (error) {
      return aiErrorResponse(error, 'Failed to analyze keywords');
    }
  })
);
