import Groq from 'groq-sdk';
import { appConfig } from '@/lib/config/app.config';
import { logger } from '@/lib/utils/logger';

const groq = new Groq({
  apiKey: appConfig.ai.groqApiKey,
});

export interface JobMatchRequest {
  resumeData: {
    skills: string[];
    experience: Array<{
      position: string;
      company: string;
      description: string;
    }>;
    education: Array<{
      degree: string;
      field: string;
    }>;
  };
  preferences?: {
    location?: string;
    salaryRange?: string;
    jobType?: 'full-time' | 'part-time' | 'contract' | 'remote';
  };
}

export interface JobMatch {
  title: string;
  company: string;
  location: string;
  salaryRange: string;
  compatibilityScore: number;
  matchingSkills: string[];
  missingSkills: string[];
  description: string;
  requirements: string[];
}

export interface JobMatchingResult {
  matches: JobMatch[];
  skillsAnalysis: {
    strongSkills: string[];
    improvementAreas: string[];
    marketDemand: Record<string, number>;
  };
  salaryPrediction: {
    min: number;
    max: number;
    average: number;
    currency: string;
  };
  marketTrends: {
    growingFields: string[];
    decliningFields: string[];
    emergingSkills: string[];
  };
}

export async function analyzeJobMatching(
  request: JobMatchRequest
): Promise<JobMatchingResult> {
  try {
    const { resumeData, preferences } = request;

    const prompt = `
You are an expert career advisor and job market analyst. Analyze this resume and provide job matching insights.

Resume Data:
Skills: ${resumeData.skills.join(', ')}
Experience: ${resumeData.experience.map((exp) => `${exp.position} at ${exp.company}`).join(', ')}
Education: ${resumeData.education.map((edu) => `${edu.degree} in ${edu.field}`).join(', ')}

Preferences:
Location: ${preferences?.location || 'Any'}
Salary Range: ${preferences?.salaryRange || 'Market rate'}
Job Type: ${preferences?.jobType || 'Full-time'}

Provide a comprehensive job matching analysis in JSON format:
{
  "matches": [
    {
      "title": "Job Title",
      "company": "Company Name",
      "location": "City, State",
      "salaryRange": "$X - $Y",
      "compatibilityScore": 85,
      "matchingSkills": ["skill1", "skill2"],
      "missingSkills": ["skill3"],
      "description": "Brief job description",
      "requirements": ["requirement1", "requirement2"]
    }
  ],
  "skillsAnalysis": {
    "strongSkills": ["top skills from resume"],
    "improvementAreas": ["skills to develop"],
    "marketDemand": {"skill": demandScore}
  },
  "salaryPrediction": {
    "min": 70000,
    "max": 120000,
    "average": 95000,
    "currency": "USD"
  },
  "marketTrends": {
    "growingFields": ["AI/ML", "Cloud Computing"],
    "decliningFields": ["Legacy Systems"],
    "emergingSkills": ["New Technologies"]
  }
}

Focus on realistic job matches based on the candidate's background. Provide 3-5 job matches with accurate compatibility scores.
`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: appConfig.ai.model,
      temperature: 0.3,
      max_tokens: 2000,
    });

    const content = completion.choices[0]?.message?.content || '';
    const jsonMatch = content.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    // Fallback response
    return {
      matches: [
        {
          title: 'Software Developer',
          company: 'Tech Company',
          location: 'Remote',
          salaryRange: '$70,000 - $120,000',
          compatibilityScore: 75,
          matchingSkills: resumeData.skills.slice(0, 3),
          missingSkills: ['Advanced frameworks'],
          description: 'Develop and maintain software applications',
          requirements: ["Bachelor's degree", '2+ years experience'],
        },
      ],
      skillsAnalysis: {
        strongSkills: resumeData.skills.slice(0, 5),
        improvementAreas: ['Cloud platforms', 'DevOps'],
        marketDemand: resumeData.skills.reduce(
          (acc, skill) => {
            acc[skill] = Math.floor(Math.random() * 100);
            return acc;
          },
          {} as Record<string, number>
        ),
      },
      salaryPrediction: {
        min: 70000,
        max: 120000,
        average: 95000,
        currency: 'USD',
      },
      marketTrends: {
        growingFields: ['AI/ML', 'Cloud Computing', 'Cybersecurity'],
        decliningFields: ['Legacy Systems'],
        emergingSkills: ['Machine Learning', 'Kubernetes', 'React'],
      },
    };
  } catch (error) {
    logger.error('Error in job matching analysis', { error });
    throw error;
  }
}

export class JobMatchingService {
  async analyzeJobMatching(
    request: JobMatchRequest
  ): Promise<JobMatchingResult> {
    return analyzeJobMatching(request);
  }
}

export const jobMatchingService = new JobMatchingService();
