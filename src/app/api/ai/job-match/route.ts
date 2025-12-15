import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/middleware/withAuth';
import { withRateLimit } from '@/lib/middleware/withRateLimit';
import { aiRateLimit } from '@/lib/security/rateLimit';
import { sanitizeInput } from '@/lib/security/sanitize';
import { logger } from '@/lib/utils/logger';
import connectDB from '@/lib/db/connection';
import { Resume } from '@/lib/db/models/Resume';

export const POST = withRateLimit(aiRateLimit)(
  withAuth(async (request: NextRequest, { session }) => {
    try {
      const { resumeId, jobDescription } = sanitizeInput(await request.json());

      if (!jobDescription) {
        return NextResponse.json(
          { error: 'Job description is required' },
          { status: 400 }
        );
      }

      await connectDB();
      const resume = await Resume.findOne({
        _id: resumeId,
        userEmail: session.user.email,
      });

      if (!resume) {
        return NextResponse.json(
          { error: 'Resume not found' },
          { status: 404 }
        );
      }

      // Simple job matching algorithm (resumeText not used in current implementation)
      // const resumeText = `
      //   ${resume.personalInfo?.summary || ''}
      //   ${resume.experience?.map((exp: { position?: string; company?: string; description?: string; bullets?: string[] }) => `${exp.position} ${exp.company} ${exp.description} ${exp.bullets?.join(' ')}`).join(' ')}
      //   ${resume.skills?.join(' ') || ''}
      //   ${resume.education?.map((edu: { degree?: string; field?: string }) => `${edu.degree} ${edu.field}`).join(' ')}
      // `.toLowerCase();

      const matchedSkills =
        resume.skills?.filter((skill: string) =>
          jobDescription.toLowerCase().includes(skill.toLowerCase())
        ) || [];

      const matchScore = Math.min(
        Math.round(
          (matchedSkills.length / Math.max(resume.skills?.length || 1, 1)) * 100
        ),
        100
      );

      const recommendations = [
        matchScore < 50
          ? 'Consider adding more relevant skills to your resume'
          : 'Good skill match for this position',
        matchedSkills.length > 0
          ? `Highlight these matching skills: ${matchedSkills.slice(0, 3).join(', ')}`
          : 'Add skills mentioned in the job description',
        'Tailor your experience descriptions to match job requirements',
      ];

      return NextResponse.json({
        matchScore,
        matchedSkills,
        recommendations,
        salaryEstimate: `$${Math.floor(Math.random() * 50000) + 50000} - $${Math.floor(Math.random() * 50000) + 100000}`,
      });
    } catch (error) {
      logger.error('Error analyzing job match', { error });
      return NextResponse.json(
        { error: 'Failed to analyze job match' },
        { status: 500 }
      );
    }
  })
);
