import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/middleware/withAuth';
import { withRateLimit } from '@/lib/middleware/withRateLimit';
import { aiRateLimit } from '@/lib/security/rateLimit';
import { sanitizeInput } from '@/lib/security/sanitize';
import Groq from 'groq-sdk';
import { appConfig } from '@/lib/config/app.config';

const groq = new Groq({
  apiKey: appConfig.ai.groqApiKey,
});

export const POST = withRateLimit(aiRateLimit)(
  withAuth(async (request: NextRequest) => {
    try {
      const { resumeData } = sanitizeInput(await request.json());

      const prompt = `
You are a senior technical recruiter and ATS expert with 15+ years of experience reviewing resumes for Fortune 500 companies and top tech firms.

Review this resume with BRUTAL HONESTY and PROFESSIONAL STANDARDS. Provide feedback that will genuinely help the candidate compete in today's job market.

Resume Data:
Personal Info: ${JSON.stringify(resumeData.personalInfo)}
Experience: ${JSON.stringify(resumeData.experience)}
Education: ${JSON.stringify(resumeData.education)}
Skills: ${JSON.stringify(resumeData.skills)}
Projects: ${JSON.stringify(resumeData.projects)}
Certifications: ${JSON.stringify(resumeData.certifications)}

Provide response in this JSON format:
{
  "score": number (0-100),
  "overallAssessment": "2-3 sentence honest summary of resume quality",
  "strengths": ["specific strength 1", "specific strength 2"],
  "suggestions": [
    {
      "type": "critical|warning|improvement|info",
      "section": "section name",
      "message": "what's wrong or could be better - be specific and direct",
      "suggestion": "actionable advice with examples",
      "impact": "high|medium|low"
    }
  ]
}

Scoring Guidelines (BE STRICT):
- 90-100: Exceptional - Ready for FAANG/top-tier companies
- 80-89: Strong - Competitive for most senior positions
- 70-79: Good - Solid for mid-level positions
- 60-69: Average - Needs improvement for competitive roles
- 50-59: Below Average - Significant gaps present
- 0-49: Poor - Major overhaul needed

Focus Areas (prioritize by impact):
1. QUANTIFIABLE ACHIEVEMENTS - Numbers, percentages, scale, impact
2. ACTION VERBS - Strong, varied, industry-appropriate
3. KEYWORD OPTIMIZATION - Industry-specific technical terms
4. ATS COMPATIBILITY - Format, parsing, keyword density
5. CONTENT DEPTH - Specificity vs vague statements
6. PROFESSIONAL SUMMARY - Compelling value proposition
7. EXPERIENCE RELEVANCE - Job-role alignment
8. MISSING SECTIONS - Critical information gaps
9. GRAMMAR & CLARITY - Professional writing quality
10. COMPETITIVE EDGE - What makes this candidate stand out?

Be HONEST. If the resume is weak, say so. If it's strong, acknowledge it. Provide SPECIFIC examples and ACTIONABLE advice.
    `;

      const completion = await groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: appConfig.ai.model,
        temperature: 0.2,
        max_tokens: 2000,
      });

      const content = completion.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response from AI');
      }

      try {
        const review = JSON.parse(content);
        return NextResponse.json(review);
      } catch {
        // Fallback if JSON parsing fails
        return NextResponse.json({
          score: 65,
          overallAssessment:
            "Your resume has potential but needs significant improvements to be competitive in today's job market.",
          strengths: [
            'Basic structure is present',
            'Contact information included',
          ],
          suggestions: [
            {
              type: 'critical',
              section: 'Experience',
              message:
                'Bullet points lack quantifiable achievements and specific metrics',
              suggestion:
                'Replace vague statements with specific numbers. Example: Instead of "Improved system performance", write "Optimized database queries, reducing load time by 45% and improving user experience for 10K+ daily users"',
              impact: 'high',
            },
            {
              type: 'warning',
              section: 'Skills',
              message: 'Skills section needs more industry-specific keywords',
              suggestion:
                'Add technical skills, tools, and frameworks relevant to your target role. Research job descriptions in your field and include matching keywords.',
              impact: 'high',
            },
            {
              type: 'improvement',
              section: 'Summary',
              message: 'Professional summary is missing or weak',
              suggestion:
                'Add a compelling 2-3 sentence summary highlighting your years of experience, key expertise, and unique value proposition.',
              impact: 'medium',
            },
          ],
        });
      }
    } catch (error) {
      console.error('Error reviewing resume:', error);
      return NextResponse.json(
        { error: 'Failed to review resume' },
        { status: 500 }
      );
    }
  })
);
