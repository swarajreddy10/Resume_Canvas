import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { rateLimit, aiRateLimit } from '@/lib/security/rateLimit';
import connectDB from '@/lib/db/connection';
import { Resume } from '@/lib/db/models/Resume';
// import Groq from 'groq-sdk';

// const groq = new Groq({
//   apiKey: process.env.GROQ_API_KEY,
// });

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const { success } = await rateLimit(request, aiRateLimit);
    if (!success) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      );
    }

    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { resumeId, resumeData, jobDescription, isFresher } = body;

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

    // Validate mandatory fields
    const hasPersonalInfo =
      resumeContent?.personalInfo?.name && resumeContent?.personalInfo?.email;
    const hasExperience = (resumeContent?.experience?.length || 0) > 0;
    const hasSkills = (resumeContent?.skills?.length || 0) > 0;
    const hasEducation = (resumeContent?.education?.length || 0) > 0;

    if (!hasPersonalInfo) {
      return NextResponse.json(
        {
          error:
            'Please fill in your name and email in Personal Information section before analyzing keywords.',
        },
        { status: 400 }
      );
    }

    if (isFresher) {
      // For freshers, require education and skills instead of experience
      if (!hasEducation && !hasSkills) {
        return NextResponse.json(
          {
            error:
              'As a fresher, please add your education and skills before analyzing keywords.',
          },
          { status: 400 }
        );
      }
    } else {
      // For experienced candidates, require experience or skills
      if (!hasExperience && !hasSkills) {
        return NextResponse.json(
          {
            error:
              'Please add at least your work experience or skills before analyzing keywords.',
          },
          { status: 400 }
        );
      }
    }

    const resumeText = `
    ${resumeContent?.personalInfo?.summary || ''}
    ${
      resumeContent?.experience
        ?.map(
          (exp) =>
            `${exp.position || ''} ${exp.company || ''} ${exp.description || ''} ${exp.bullets?.join(' ') || ''}`
        )
        .join(' ') || ''
    }
    ${
      resumeContent?.education
        ?.map(
          (edu) => `${edu.degree || ''} ${edu.field || ''} ${edu.school || ''}`
        )
        .join(' ') || ''
    }
    ${resumeContent?.skills?.join(' ') || ''}
    ${
      resumeContent?.projects
        ?.map(
          (proj) =>
            `${proj.name || ''} ${proj.description || ''} ${proj.technologies || ''}`
        )
        .join(' ') || ''
    }
    `.trim();

    if (resumeText.length < 50) {
      return NextResponse.json(
        {
          error:
            'Please add more content to your resume (experience details, skills, summary) for meaningful keyword analysis.',
        },
        { status: 400 }
      );
    }

    // const prompt = `
    // Analyze the job description and compare it with the resume content to identify keyword matches.
    //
    // Job Description:
    // ${jobDescription}
    //
    // Resume Content:
    // ${resumeText}
    //
    // Provide response in this JSON format:
    // {
    //   "matchScore": number (0-100),
    //   "keywords": [
    //     {
    //       "keyword": "specific keyword or phrase",
    //       "present": boolean,
    //       "importance": "high|medium|low"
    //     }
    //   ]
    // }
    //
    // Focus on:
    // - Technical skills and tools
    // - Industry-specific terms
    // - Job requirements and qualifications
    // - Action verbs and competencies
    // - Certifications and methodologies
    //
    // Mark importance as:
    // - high: Critical requirements mentioned multiple times
    // - medium: Important skills or qualifications
    // - low: Nice-to-have or mentioned once
    // `;

    // Basic keyword analysis without AI
    const jobKeywords: string[] =
      jobDescription.toLowerCase().match(/\b\w{3,}\b/g) || [];
    const resumeKeywords: string[] =
      resumeText.toLowerCase().match(/\b\w{3,}\b/g) || [];

    const stopWords = [
      'the',
      'and',
      'for',
      'are',
      'but',
      'not',
      'you',
      'all',
      'can',
      'had',
      'her',
      'was',
      'one',
      'our',
      'out',
      'day',
      'get',
      'has',
      'him',
      'his',
      'how',
      'its',
      'may',
      'new',
      'now',
      'old',
      'see',
      'two',
      'who',
      'boy',
      'did',
      'she',
      'use',
      'way',
      'will',
      'with',
    ];

    const commonKeywords = jobKeywords.filter(
      (keyword: string) =>
        resumeKeywords.includes(keyword) && !stopWords.includes(keyword)
    );

    const matchScore = Math.min(
      Math.round(
        (commonKeywords.length / Math.max(jobKeywords.length, 1)) * 100
      ),
      100
    );

    const uniqueKeywords: string[] = Array.from(new Set(jobKeywords));
    const topKeywords = uniqueKeywords.slice(0, 10).map((keyword: string) => ({
      keyword,
      present: resumeKeywords.includes(keyword),
      importance:
        jobKeywords.filter((k: string) => k === keyword).length > 2
          ? 'high'
          : jobKeywords.filter((k: string) => k === keyword).length > 1
            ? 'medium'
            : 'low',
    }));

    return NextResponse.json({
      matchScore,
      keywords: topKeywords,
    });
  } catch (error) {
    console.error('Error analyzing keywords:', error);
    return NextResponse.json(
      { error: 'Failed to analyze keywords' },
      { status: 500 }
    );
  }
}
