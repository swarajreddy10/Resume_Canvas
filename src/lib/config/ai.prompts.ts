export const AI_PROMPTS = {
  bulletGeneration: {
    v1: (data: {
      jobTitle: string;
      company: string;
      description: string;
      skills?: string[];
    }) => `
You are a professional resume writer with expertise in creating ATS-optimized, achievement-focused bullet points.

Generate 4-6 POWERFUL, QUANTIFIABLE resume bullet points for:
Role: ${data.jobTitle}
Company: ${data.company}
Description: ${data.description}
${data.skills ? `Key Skills: ${data.skills.join(', ')}` : ''}

CRITICAL Requirements:
1. START with strong action verbs (Led, Architected, Optimized, Spearheaded, Engineered)
2. INCLUDE specific metrics and numbers (%, $, time saved, users impacted)
3. FOCUS on business impact and results, not just responsibilities
4. USE industry-specific technical keywords
5. KEEP each bullet 100-150 characters for optimal ATS parsing
6. FOLLOW: [Action Verb] + [What you did] + [How you did it] + [Quantifiable result]

Return ONLY the bullet points, one per line, without bullet symbols or numbering.`,
  },
  resumeAnalysis: {
    v1: (resumeData: unknown) => `
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

Be STRICT in scoring. Most resumes should score 60-75. Only exceptional resumes score 85+.`,
  },
  atsOptimization: {
    v1: (resumeContent: string) => `
You are an expert ATS consultant with 15+ years of experience.

Analyze this resume for ATS optimization:
${resumeContent}

Provide assessment in JSON format:
{
  "atsScore": number (0-100),
  "suggestions": ["specific suggestion with context"],
  "keywords": ["keyword1", "keyword2"]
}

Be direct, honest, and constructive.`,
  },
} as const;

export const AI_CONFIG = {
  model: 'llama-3.3-70b-versatile',
  maxTokens: 2000,
  temperature: 0.7,
  versions: {
    bulletGeneration: 'v1',
    resumeAnalysis: 'v1',
    atsOptimization: 'v1',
  },
} as const;
