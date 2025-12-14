import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
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
Generate 3-5 professional resume bullet points for a ${request.jobTitle} at ${request.company}.

Job Description: ${request.description}
${request.skills ? `Relevant Skills: ${request.skills.join(', ')}` : ''}

Requirements:
- Start each bullet with a strong action verb
- Include quantifiable achievements when possible
- Focus on impact and results
- Keep each bullet under 150 characters
- Make them ATS-friendly

Return only the bullet points, one per line, without bullet symbols.
`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama3-8b-8192',
      temperature: 0.7,
      max_tokens: 500,
    });

    const content = completion.choices[0]?.message?.content || '';
    return content
      .split('\n')
      .filter((line) => line.trim())
      .map((line) => line.trim())
      .slice(0, 5);
  } catch (error) {
    console.error('Error generating bullet points:', error);
    return [
      'Led cross-functional teams to deliver high-impact projects',
      'Improved system performance by implementing best practices',
      'Collaborated with stakeholders to define requirements',
    ];
  }
}

export async function optimizeResume(resumeContent: string): Promise<{
  atsScore: number;
  suggestions: string[];
  keywords: string[];
}> {
  try {
    const prompt = `
Analyze this resume content for ATS optimization:

${resumeContent}

Provide:
1. ATS Score (0-100)
2. 3-5 improvement suggestions
3. 5-10 relevant keywords to include

Format as JSON:
{
  "atsScore": number,
  "suggestions": ["suggestion1", "suggestion2"],
  "keywords": ["keyword1", "keyword2"]
}
`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama3-8b-8192',
      temperature: 0.3,
      max_tokens: 800,
    });

    const content = completion.choices[0]?.message?.content || '';
    const jsonMatch = content.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    return {
      atsScore: 75,
      suggestions: [
        'Add more quantifiable achievements',
        'Include relevant keywords from job descriptions',
        'Use stronger action verbs',
      ],
      keywords: [
        'leadership',
        'project management',
        'collaboration',
        'innovation',
        'results-driven',
      ],
    };
  } catch (error) {
    console.error('Error optimizing resume:', error);
    return {
      atsScore: 75,
      suggestions: [
        'Add more specific achievements',
        'Include relevant keywords',
      ],
      keywords: ['leadership', 'teamwork', 'problem-solving'],
    };
  }
}
