import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { withAuth } from '@/lib/middleware/withAuth';
import { withRateLimit } from '@/lib/middleware/withRateLimit';
import { aiRateLimit } from '@/lib/security/rateLimit';
import { sanitizeInput } from '@/lib/security/sanitize';
import { logger } from '@/lib/utils/logger';
import connectDB from '@/lib/db/connection';
import { Resume } from '@/lib/db/models/Resume';
import { appConfig } from '@/lib/config/app.config';

const groq = new Groq({
  apiKey: appConfig.ai.groqApiKey,
});

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

      const prompt = `
You are an ATS assistant. Compare the job description with the resume and return JSON only.
Job Description:
${jobDescription}

Resume:
${resumeText}

Respond in this JSON shape:
{
  "matchScore": number (0-100),
  "keywords": [
    { "keyword": "string", "present": boolean, "importance": "high|medium|low" }
  ]
}

Rules:
- Focus on technical skills, tools, certifications, role-specific terms, and responsibilities.
- importance = high if repeated or explicitly required; medium if important once; low otherwise.
- Keep keywords to max 12 items.
`;

      let aiResponse: {
        matchScore: number;
        keywords: Array<{
          keyword: string;
          present: boolean;
          importance: string;
        }>;
      } | null = null;

      try {
        const completion = await groq.chat.completions.create({
          messages: [{ role: 'user', content: prompt }],
          model: appConfig.ai.model,
          temperature: 0.2,
          max_tokens: appConfig.ai.maxTokens,
        });

        const content = completion.choices[0]?.message?.content || '';
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          aiResponse = JSON.parse(jsonMatch[0]);
        }
      } catch (err) {
        logger.error(
          'AI keyword analysis failed, falling back to basic keywords',
          {
            error: err,
          }
        );
      }

      if (aiResponse) {
        return NextResponse.json(aiResponse);
      }

      // Basic fallback keyword analysis
      const jobKeywords: string[] =
        jobDescription.toLowerCase().match(/\b\w{3,}\b/g) || [];
      const resumeKeywords: string[] =
        resumeText.toLowerCase().match(/\b\w{3,}\b/g) || [];

      const stopWords = new Set([
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
      ]);

      const filteredJob = jobKeywords.filter((k) => !stopWords.has(k));
      const filteredResume = resumeKeywords.filter((k) => !stopWords.has(k));

      const commonKeywords = filteredJob.filter((keyword: string) =>
        filteredResume.includes(keyword)
      );

      const matchScore = Math.min(
        Math.round(
          (commonKeywords.length / Math.max(filteredJob.length, 1)) * 100
        ),
        100
      );

      const uniqueKeywords: string[] = Array.from(new Set(filteredJob));
      const topKeywords = uniqueKeywords.slice(0, 12).map((keyword: string) => {
        const count = filteredJob.filter((k: string) => k === keyword).length;
        return {
          keyword,
          present: filteredResume.includes(keyword),
          importance: count > 2 ? 'high' : count > 1 ? 'medium' : 'low',
        };
      });

      return NextResponse.json({
        matchScore,
        keywords: topKeywords,
      });
    } catch (error) {
      logger.error('Error analyzing keywords', { error });
      return NextResponse.json(
        { error: 'Failed to analyze keywords' },
        { status: 500 }
      );
    }
  })
);
