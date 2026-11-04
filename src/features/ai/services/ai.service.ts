import Groq from 'groq-sdk';
import { z } from 'zod';
import { appConfig } from '@/lib/config/app.config';
import { AIServiceError } from '@/lib/ai/errors';
import { dates, inventedFigures, placeholders, textOf } from '@/lib/ai/facts';
import { logger } from '@/lib/utils/logger';

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

/** The model's bullets for one role, before the facts check: measured by ai:facts. */
export async function draftBulletPoints(
  request: BulletPointRequest
): Promise<string[]> {
  const prompt = `
You are a professional resume writer with expertise in creating ATS-optimized, achievement-focused bullet points.

Generate 4 or 5 resume bullet points for:
Role: ${request.jobTitle}
Company: ${request.company}
Description: ${request.description}
${request.skills ? `Key Skills: ${request.skills.join(', ')}` : ''}

Every bullet goes on a real person's resume, so it must be true:
1. Use only facts in the role, description and skills above. Never invent numbers, percentages, money, team sizes, user counts, durations or results.
2. Keep every number the description gives, exactly as given; do not calculate new ones from it.
3. Where the description states a result without a number, you may quantify it with a placeholder in square brackets for the person to fill in, such as [X%] or [N users]. Never add a result the description does not state.
4. Start with a strong action verb (Led, Built, Designed, Optimized, Automated).
5. Show what was done, how, and the result, in 100-150 characters.
6. Use the technical terms from the description and skills.

Example. Description: "Moved nightly reports from a cron job to a queue, so they finish sooner and failed runs retry on their own."
- "Moved nightly reporting from a cron job to a queue-based worker, so failed runs retry on their own"
- "Rebuilt the report scheduler on a queue so nightly reports finish [X%] sooner"

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

/**
 * Bullets that state only figures the request gives. A bullet with any other figure is
 * dropped, and logged; if none is left, the request fails rather than return fewer facts
 * than it claims.
 */
export async function generateBulletPoints(
  request: BulletPointRequest
): Promise<string[]> {
  const facts = textOf(request);
  const drafts = await draftBulletPoints(request);
  const supported = drafts.filter(
    (bullet) => inventedFigures(bullet, facts).length === 0
  );
  if (supported.length < drafts.length) {
    logger.warn(
      'Dropped bullets stating figures the description does not give',
      {
        dropped: drafts.length - supported.length,
      }
    );
  }
  if (supported.length === 0) {
    throw new AIServiceError(
      'Every bullet stated a figure the description does not give'
    );
  }
  return supported;
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

export interface CoverLetterRequest {
  resumeData: unknown;
  jobTitle: string;
  companyName: string;
  jobDescription?: string;
}

/**
 * What a letter may state as fact: the resume, the role's title and the company. The job
 * description describes the role; a requirement in it is not the candidate's experience.
 */
export function coverLetterFacts({
  resumeData,
  jobTitle,
  companyName,
}: CoverLetterRequest): string {
  return textOf({ resumeData, jobTitle, companyName });
}

/** The model's letter, before the facts check: measured by ai:facts. */
export async function draftCoverLetter({
  resumeData,
  jobTitle,
  companyName,
  jobDescription,
}: CoverLetterRequest): Promise<string> {
  const prompt = `
You are an expert career coach and professional cover letter writer.

Generate a compelling, personalized cover letter for:

Job Title: ${jobTitle}
Company: ${companyName}
${jobDescription ? `Job Description: ${jobDescription}` : ''}

Candidate's Resume Data:
${JSON.stringify(resumeData, null, 2)}

Requirements:
1. Professional tone, 3-4 paragraphs, under 400 words
2. Opening: express enthusiasm and name the role
3. Body: highlight 2-3 relevant achievements from the resume
4. Closing: a call to action
5. Match keywords from the job description if provided
6. The candidate's skills, experience, achievements and numbers come only from the resume data. Use the job title, company and job description to describe the role and to choose which resume facts to highlight; never present a job requirement as the candidate's experience. Never invent numbers, employers, titles, dates or achievements; keep any number the resume gives exactly as given, and do not calculate new ones from it.

Write the letter body only: start with "Dear Hiring Team," and end with a sign-off and the candidate's name from the resume data (just the sign-off if it has none). No addresses, dates, subject line, or placeholders in square brackets, and no explanations.
`;
  return complete(prompt, 2048, false);
}

/**
 * A letter that states only what coverLetterFacts allows. A letter with any other figure, a
 * placeholder or a date is refused: a letter cannot drop a sentence and stay coherent.
 */
export async function generateCoverLetter(
  request: CoverLetterRequest
): Promise<string> {
  const letter = await draftCoverLetter(request);
  const unsupported = [
    ...inventedFigures(letter, coverLetterFacts(request)),
    ...placeholders(letter),
    ...dates(letter),
  ];
  if (unsupported.length > 0) {
    throw new AIServiceError(
      `The letter stated what the resume does not give: ${unsupported.join(', ')}`
    );
  }
  return letter;
}
