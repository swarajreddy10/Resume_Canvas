import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import connectDB from '@/lib/db/connection';
import { Resume } from '@/lib/db/models/Resume';

interface ResumeDoc {
  personalInfo?: {
    name?: string;
    email?: string;
    phone?: string;
    summary?: string;
  };
  experience?: Array<{ bullets?: string[] }>;
  education?: unknown[];
  skills?: string[];
  projects?: unknown[];
  certifications?: unknown[];
  userEmail: string;
}

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
    await connectDB();
    const resume = (await Resume.findById(id)) as ResumeDoc;

    if (!resume || resume.userEmail !== session.user.email) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
    }

    // Enhanced ATS score calculation based on industry standards
    let score = 0;
    const details: string[] = [];

    // 1. Contact Information (15 points) - Critical for ATS
    let contactScore = 0;
    if (resume.personalInfo?.name) contactScore += 4;
    if (resume.personalInfo?.email) contactScore += 4;
    if (resume.personalInfo?.phone) contactScore += 4;
    if (
      resume.personalInfo?.summary &&
      resume.personalInfo.summary.length > 50
    ) {
      contactScore += 3;
    }
    score += contactScore;
    details.push(`Contact Info: ${contactScore}/15`);

    // 2. Professional Summary (10 points) - High impact
    let summaryScore = 0;
    if (resume.personalInfo?.summary) {
      const summaryLength = resume.personalInfo.summary.length;
      if (summaryLength >= 200) summaryScore = 10;
      else if (summaryLength >= 100) summaryScore = 7;
      else if (summaryLength >= 50) summaryScore = 4;
    }
    score += summaryScore;
    details.push(`Summary Quality: ${summaryScore}/10`);

    // 3. Experience Section (35 points) - Most critical
    let experienceScore = 0;
    const expCount = resume.experience?.length || 0;
    if (expCount > 0) {
      // Base points for having experience
      experienceScore += Math.min(expCount * 5, 15);

      // Points for bullet points (quantifiable achievements)
      const totalBullets =
        resume.experience?.reduce(
          (sum, exp) => sum + (exp.bullets?.length || 0),
          0
        ) || 0;
      if (totalBullets >= 10) experienceScore += 15;
      else if (totalBullets >= 6) experienceScore += 10;
      else if (totalBullets >= 3) experienceScore += 5;

      // Bonus for detailed bullets (length check)
      const hasDetailedBullets = resume.experience?.some((exp) =>
        exp.bullets?.some((bullet) => bullet.length > 50)
      );
      if (hasDetailedBullets) experienceScore += 5;
    }
    score += Math.min(experienceScore, 35);
    details.push(`Experience: ${Math.min(experienceScore, 35)}/35`);

    // 4. Education Section (15 points)
    let educationScore = 0;
    const eduCount = resume.education?.length || 0;
    if (eduCount > 0) {
      educationScore = Math.min(eduCount * 8, 15);
    }
    score += educationScore;
    details.push(`Education: ${educationScore}/15`);

    // 5. Skills Section (20 points) - Critical for keyword matching
    let skillsScore = 0;
    const skillCount = resume.skills?.length || 0;
    if (skillCount >= 10) skillsScore = 20;
    else if (skillCount >= 7) skillsScore = 15;
    else if (skillCount >= 5) skillsScore = 10;
    else if (skillCount >= 3) skillsScore = 5;
    score += skillsScore;
    details.push(`Skills: ${skillsScore}/20`);

    // 6. Projects Section (8 points) - Shows practical experience
    let projectsScore = 0;
    const projectCount = resume.projects?.length || 0;
    if (projectCount >= 3) projectsScore = 8;
    else if (projectCount >= 2) projectsScore = 6;
    else if (projectCount >= 1) projectsScore = 4;
    score += projectsScore;
    details.push(`Projects: ${projectsScore}/8`);

    // 7. Certifications Section (7 points) - Professional development
    let certScore = 0;
    const certCount = resume.certifications?.length || 0;
    if (certCount >= 3) certScore = 7;
    else if (certCount >= 2) certScore = 5;
    else if (certCount >= 1) certScore = 3;
    score += certScore;
    details.push(`Certifications: ${certScore}/7`);

    // Ensure score doesn't exceed 100
    score = Math.min(score, 100);

    // Update resume with calculated score
    await Resume.findByIdAndUpdate(id, { atsScore: score });

    return NextResponse.json({
      atsScore: score,
      breakdown: details,
      message:
        score >= 80
          ? 'Excellent! Your resume is highly optimized for ATS systems.'
          : score >= 60
            ? "Good foundation, but there's room for improvement."
            : 'Your resume needs significant improvements to pass ATS filters.',
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to calculate ATS score' },
      { status: 500 }
    );
  }
}
