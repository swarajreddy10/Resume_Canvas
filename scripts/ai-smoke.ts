/**
 * Calls every AI feature once against the real Groq API, through the same service the
 * routes use, and prints each one's latency and result shape. Exits 1 if any feature
 * fails. Run it after changing the model or its settings in src/lib/config/app.config.ts:
 * the unit and integration suites mock Groq, so only this shows the live model still
 * answers in the shape the app needs.
 *
 * Usage: bun run ai:smoke (Bun loads .env.local; GROQ_API_KEY must be a real key).
 * Five calls, about 3,500 tokens in all.
 */
import {
  analyzeKeywords,
  generateBulletPoints,
  generateCoverLetter,
  optimizeResume,
  reviewResume,
} from '@/features/ai/services/ai.service';
import { appConfig } from '@/lib/config/app.config';

const resume = {
  personalInfo: {
    name: 'Zoë Ñúñez',
    summary: 'Backend engineer, two years with Go, PostgreSQL and AWS.',
  },
  experience: [
    {
      company: 'Café Ünïcode',
      position: 'Software Engineer',
      description:
        'Built a job ingestion pipeline; replaced row-wise inserts with COPY into a staging table, cutting a batch from 30 to 4 minutes.',
    },
  ],
  education: [
    { school: 'Universität Zürich', degree: 'BSc', field: 'Informatik' },
  ],
  skills: ['Go', 'PostgreSQL', 'AWS', 'Docker'],
  projects: [],
  certifications: [],
};
const resumeText =
  'Backend engineer. Go, PostgreSQL, AWS, Docker. Built a job ingestion pipeline; cut a batch from 30 to 4 minutes.';
const jobDescription =
  'Backend Engineer: Go, PostgreSQL, Kubernetes, event-driven systems, on-call ownership.';

const features: [string, () => Promise<unknown>, (r: never) => string][] = [
  [
    'generateBulletPoints',
    () =>
      generateBulletPoints({
        jobTitle: 'Software Engineer',
        company: 'Café Ünïcode',
        description: resume.experience[0].description,
        skills: resume.skills,
      }),
    (r: string[]) => `${r.length} bullets`,
  ],
  [
    'optimizeResume',
    () => optimizeResume(resumeText),
    (r: { atsScore: number; suggestions: string[]; keywords: string[] }) =>
      `score ${r.atsScore}, ${r.suggestions.length} suggestions, ${r.keywords.length} keywords`,
  ],
  [
    'reviewResume',
    () => reviewResume(resume),
    (r: { score: number; suggestions: unknown[] }) =>
      `score ${r.score}, ${r.suggestions.length} suggestions`,
  ],
  [
    'analyzeKeywords',
    () => analyzeKeywords(jobDescription, resumeText),
    (r: { matchScore: number; keywords: unknown[] }) =>
      `match ${r.matchScore}, ${r.keywords.length} keywords`,
  ],
  [
    'generateCoverLetter',
    () =>
      generateCoverLetter({
        resumeData: resume,
        jobTitle: 'Backend Engineer',
        companyName: 'Acme',
        jobDescription,
      }),
    (r: string) => `${r.split(/\s+/).length} words`,
  ],
];

console.log(
  `model ${appConfig.ai.model}, reasoning ${appConfig.ai.reasoningEffort}`
);
let failed = 0;
for (const [name, call, describe] of features) {
  const start = performance.now();
  try {
    const result = await call();
    const ms = Math.round(performance.now() - start);
    console.log(
      `ok    ${name.padEnd(22)} ${String(ms).padStart(5)} ms  ${describe(result as never)}`
    );
  } catch (error) {
    failed++;
    const ms = Math.round(performance.now() - start);
    const cause = (error as Error).cause as Error | undefined;
    console.log(
      `FAIL  ${name.padEnd(22)} ${String(ms).padStart(5)} ms  ${(error as Error).message}${cause ? `: ${cause.message}` : ''}`
    );
  }
}
process.exit(failed ? 1 : 0);
