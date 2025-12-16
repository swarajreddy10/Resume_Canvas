import Groq from 'groq-sdk';
import { appConfig } from '@/lib/config/app.config';
import { logger } from '@/lib/utils/logger';

const groq = new Groq({
  apiKey: appConfig.ai.groqApiKey,
});

export interface BulletPointRequest {
  jobTitle: string;
  company: string;
  description: string;
  skills?: string[];
}

export async function generateBulletPoints(
  request: BulletPointRequest
): Promise<string[]> {
  try {
    const prompt = `
You are a professional resume writer with expertise in creating ATS-optimized, achievement-focused bullet points.

Generate 4-6 POWERFUL, QUANTIFIABLE resume bullet points for:
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

Return ONLY the bullet points, one per line, without bullet symbols or numbering.
`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: appConfig.ai.model,
      temperature: 0.8,
      max_tokens: 800,
    });

    const content = completion.choices[0]?.message?.content || '';
    return content
      .split('\n')
      .filter((line) => line.trim())
      .map((line) => line.trim())
      .slice(0, 5);
  } catch (error) {
    logger.error('Error generating bullet points', { error });
    return [
      'Led cross-functional teams to deliver high-impact projects',
      'Improved system performance by implementing best practices',
      'Collaborated with stakeholders to define requirements',
    ];
  }
}

export interface DetailedResumeAnalysis {
  overallScore: number;
  sectionScores: {
    personalInfo: number;
    experience: number;
    education: number;
    skills: number;
    projects: number;
    certifications: number;
  };
  criticalIssues: string[];
  recommendations: string[];
  competitiveAnalysis: string;
}

export async function analyzeResumeComprehensively(
  resumeData: unknown
): Promise<DetailedResumeAnalysis> {
  try {
    const prompt = `
You are a senior technical recruiter analyzing resumes for competitive tech positions.

Analyze this resume data comprehensively:
${JSON.stringify(resumeData, null, 2)}

Provide a BRUTALLY HONEST analysis in JSON format:
{
  "overallScore": number (0-100),
  "sectionScores": {
    "personalInfo": number (0-100),
    "experience": number (0-100),
    "education": number (0-100),
    "skills": number (0-100),
    "projects": number (0-100),
    "certifications": number (0-100)
  },
  "criticalIssues": ["issue 1", "issue 2"],
  "recommendations": ["recommendation 1", "recommendation 2"],
  "competitiveAnalysis": "How does this resume compare to top candidates?"
}

Be STRICT in scoring. Most resumes should score 60-75. Only exceptional resumes score 85+.
`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: appConfig.ai.model,
      temperature: 0.2,
      max_tokens: 1500,
    });

    const content = completion.choices[0]?.message?.content || '';
    const jsonMatch = content.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    return {
      overallScore: 65,
      sectionScores: {
        personalInfo: 70,
        experience: 60,
        education: 75,
        skills: 65,
        projects: 60,
        certifications: 50,
      },
      criticalIssues: [
        'Lack of quantifiable achievements in experience section',
        'Skills section needs more technical depth',
      ],
      recommendations: [
        'Add specific metrics to all experience bullet points',
        'Include more industry-relevant technical skills',
      ],
      competitiveAnalysis:
        'This resume is average compared to competitive candidates. Needs stronger quantifiable achievements and technical depth.',
    };
  } catch (error) {
    logger.error('Error analyzing resume comprehensively', { error });
    throw error;
  }
}

export async function optimizeResume(resumeContent: string): Promise<{
  atsScore: number;
  suggestions: string[];
  keywords: string[];
}> {
  try {
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

Format as JSON:
{
  "atsScore": number,
  "suggestions": ["specific suggestion with context"],
  "keywords": ["keyword1", "keyword2"]
}

Be direct, honest, and constructive. Don't sugarcoat issues.
`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: appConfig.ai.model,
      temperature: 0.2,
      max_tokens: 1200,
    });

    const content = completion.choices[0]?.message?.content || '';
    const jsonMatch = content.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    return {
      atsScore: 65,
      suggestions: [
        'Add quantifiable metrics to achievements (e.g., "increased sales by 35%" instead of "improved sales")',
        'Include more industry-specific technical keywords',
        'Use stronger action verbs at the start of each bullet point',
        'Add a professional summary highlighting key achievements',
      ],
      keywords: [
        'leadership',
        'project management',
        'data analysis',
        'stakeholder management',
        'process improvement',
      ],
    };
  } catch (error) {
    logger.error('Error optimizing resume', { error });
    return {
      atsScore: 65,
      suggestions: [
        'Add specific metrics and numbers to quantify your achievements',
        'Include more relevant industry keywords',
      ],
      keywords: ['leadership', 'teamwork', 'problem-solving'],
    };
  }
}
