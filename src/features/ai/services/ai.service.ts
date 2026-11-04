import Groq from 'groq-sdk';
import { z } from 'zod';
import { appConfig } from '@/lib/config/app.config';
import { AIServiceError } from '@/lib/ai/errors';

/**
 * Every model call goes through complete(): one client, the model settings in appConfig,
 * and no canned answer. Groq errors (after the SDK's own two retries of connection errors,
 * 408, 409, 429 and 5xx), a reply that is empty or cut off at the token budget, and a reply
 * that is not the expected shape all throw AIServiceError, which the routes answer with 502.
 *
 * Replies use JSON object mode, then a Zod check of the shape: strict json_schema mode
 * failed 2 of 24 live calls with `tool_use_failed` (the model emitted a tool call), JSON
 * object mode 0 of 24 (measured 2026-11-04).
 * https://console.groq.com/docs/structured-outputs
 */
const groq = new Groq({
  apiKey: appConfig.ai.groqApiKey,
  timeout: appConfig.ai.timeoutMs,
});

async function complete(
  prompt: string,
  maxCompletionTokens: number,
  json: boolean
): Promise<string> {
  let completion: Groq.Chat.ChatCompletion;
  try {
    completion = await groq.chat.completions.create({
      model: appConfig.ai.model,
      // All instructions in the user message, as Groq recommends for reasoning models.
      messages: [{ role: 'user', content: prompt }],
      reasoning_effort: appConfig.ai.reasoningEffort,
      include_reasoning: false,
      temperature: appConfig.ai.temperature,
      // Reasoning tokens count against this budget.
      max_completion_tokens: maxCompletionTokens,
      ...(json && { response_format: { type: 'json_object' as const } }),
    });
  } catch (error) {
    throw new AIServiceError('The model request failed', { cause: error });
  }
  const choice = completion.choices[0];
  const content = choice?.message?.content?.trim();
  if (!content || choice.finish_reason !== 'stop') {
    throw new AIServiceError(
      `The model returned no complete reply (finish_reason: ${choice?.finish_reason ?? 'none'})`
    );
  }
  return content;
}

async function completeJSON<T>(
  prompt: string,
  maxCompletionTokens: number,
  shape: z.ZodType<T>
): Promise<T> {
  const content = await complete(prompt, maxCompletionTokens, true);
  let data: unknown;
  try {
    data = JSON.parse(content);
  } catch (error) {
    throw new AIServiceError('The model reply was not JSON', { cause: error });
  }
  const result = shape.safeParse(data);
  if (!result.success) {
    throw new AIServiceError('The model reply was not the expected shape', {
      cause: result.error,
    });
  }
  return result.data;
}

const score = z.number().min(0).max(100);

export interface BulletPointRequest {
  jobTitle: string;
  company: string;
  description: string;
  skills?: string[];
}

export async function generateBulletPoints(
  request: BulletPointRequest
): Promise<string[]> {
  const prompt = `
You are a professional resume writer with expertise in creating ATS-optimized, achievement-focused bullet points.

Generate 4 or 5 POWERFUL, QUANTIFIABLE resume bullet points for:
Role: ${request.jobTitle}
Company: ${request.company}
Description: ${request.description}
${request.skills ? `Key Skills: ${request.skills.join(', ')}` : ''}

CRITICAL Requirements:
1. START with strong action verbs (Led, Architected, Optimized, Spearheaded, Engineered, etc.)
2. INCLUDE specific metrics and numbers (%, $, time saved, users impacted, etc.)
3. FOCUS on business impact and results, not just responsibilities
4. USE industry-specific technical keywords
5. KEEP each bullet 100-150 characters for optimal ATS parsing
6. FOLLOW the formula: [Action Verb] + [What you did] + [How you did it] + [Quantifiable result]

Examples of GOOD bullet points:
- "Architected microservices infrastructure reducing deployment time by 60% and serving 2M+ daily users"
- "Led cross-functional team of 8 engineers to deliver $2M revenue-generating feature 3 weeks ahead of schedule"
- "Optimized database queries improving application response time by 45% and reducing server costs by $50K annually"

Reply with JSON only: {"bullets": ["bullet text without symbols or numbering"]}
`;
  const { bullets } = await completeJSON(
    prompt,
    1024,
    z.object({ bullets: z.array(z.string()) })
  );
  const lines = bullets
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 5);
  if (lines.length === 0) {
    throw new AIServiceError('The model returned no bullet points');
  }
  return lines;
}

const optimization = z.object({
  atsScore: score,
  suggestions: z.array(z.string()),
  keywords: z.array(z.string()),
});

export async function optimizeResume(
  resumeContent: string
): Promise<z.infer<typeof optimization>> {
  const prompt = `
You are an expert ATS (Applicant Tracking System) consultant and resume reviewer with 15+ years of experience in recruitment technology.

Analyze this resume content for ATS optimization:

${resumeContent}

Provide a BRUTALLY HONEST, PROFESSIONAL assessment based on real ATS industry standards:

1. ATS Score (0-100) - Be realistic and strict:
   - 90-100: Exceptional, passes all ATS filters
   - 75-89: Good, likely to pass most ATS
   - 60-74: Average, may pass basic ATS
   - 40-59: Below average, likely filtered out
   - 0-39: Poor, will be rejected by ATS

2. Provide 5-8 SPECIFIC, ACTIONABLE improvement suggestions focusing on:
   - Quantifiable achievements (numbers, percentages, metrics)
   - Action verb strength and variety
   - Keyword density and relevance
   - ATS parsing issues (formatting, special characters)
   - Missing critical sections
   - Content depth and specificity

3. Identify 8-12 industry-relevant keywords that are MISSING or underutilized

Reply with JSON only:
{
  "atsScore": number,
  "suggestions": ["specific suggestion with context"],
  "keywords": ["keyword1", "keyword2"]
}

Be direct, honest, and constructive. Don't sugarcoat issues.
`;
  return completeJSON(prompt, 2048, optimization);
}

export interface ResumeReviewInput {
  personalInfo?: unknown;
  experience?: unknown;
  education?: unknown;
  skills?: unknown;
  projects?: unknown;
  certifications?: unknown;
}

const resumeReview = z.object({
  score,
  overallAssessment: z.string(),
  strengths: z.array(z.string()),
  suggestions: z.array(
    z.object({
      type: z.string(),
      section: z.string(),
      message: z.string(),
      suggestion: z.string(),
      impact: z.string(),
    })
  ),
});

export async function reviewResume(
  resumeData: ResumeReviewInput
): Promise<z.infer<typeof resumeReview>> {
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

Reply with JSON only, in this format:
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
  return completeJSON(prompt, 3072, resumeReview);
}

const keywordMatch = z.object({
  matchScore: score,
  keywords: z.array(
    z.object({
      keyword: z.string(),
      present: z.boolean(),
      importance: z.string(),
    })
  ),
});

export async function analyzeKeywords(
  jobDescription: string,
  resumeText: string
): Promise<z.infer<typeof keywordMatch>> {
  const prompt = `
You are an ATS assistant. Compare the job description with the resume and reply with JSON only.
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
  return completeJSON(prompt, 2048, keywordMatch);
}

export async function generateCoverLetter({
  resumeData,
  jobTitle,
  companyName,
  jobDescription,
}: {
  resumeData: unknown;
  jobTitle: string;
  companyName: string;
  jobDescription?: string;
}): Promise<string> {
  const prompt = `
You are an expert career coach and professional cover letter writer.

Generate a compelling, personalized cover letter for:

Job Title: ${jobTitle}
Company: ${companyName}
${jobDescription ? `Job Description: ${jobDescription}` : ''}

Candidate's Resume Data:
${JSON.stringify(resumeData, null, 2)}

Requirements:
1. Professional tone, 3-4 paragraphs
2. Opening: Express enthusiasm and mention specific role
3. Body: Highlight 2-3 relevant achievements from resume with metrics
4. Closing: Call to action and availability
5. Use candidate's actual experience and skills
6. Match keywords from job description if provided
7. Keep under 400 words

Return ONLY the cover letter text, no additional formatting or explanations.
`;
  return complete(prompt, 2048, false);
}
