/**
 * Measures how often the model's drafts state facts the user never gave: figures that are
 * not in the input, and, in cover letters, bracketed placeholders and dates. It reads the
 * drafts before the service's facts check (src/lib/ai/facts.ts) drops or refuses them, so
 * it shows how well the prompts hold, not only what reaches users. Bullets may hold a
 * placeholder such as [X%] for the user to fill in; a figure derived from the input (87%
 * from "30 to 4 minutes"), or a number reused with another unit, counts as invented.
 *
 * Usage: bun run ai:facts [runs per input, default 6] (live Groq API, GROQ_API_KEY set).
 * Prints one JSON line per bullet and one per cover letter, each with its whole text so a
 * saved run can be counted again when the check changes, one per failed request, then a
 * summary. Each run is two bullet requests and one cover letter, about 2,700 tokens.
 */
import {
  coverLetterFacts,
  draftBulletPoints,
  draftCoverLetter,
  type BulletPointRequest,
  type CoverLetterRequest,
} from '@/features/ai/services/ai.service';
import { dates, inventedFigures, placeholders, textOf } from '@/lib/ai/facts';

const bulletInputs: BulletPointRequest[] = [
  {
    jobTitle: 'Software Engineer',
    company: 'Café Ünïcode',
    description:
      'Built a job ingestion pipeline in Go; replaced row-wise inserts with COPY into a PostgreSQL staging table, cutting a nightly batch from 30 to 4 minutes.',
    skills: ['Go', 'PostgreSQL'],
  },
  {
    jobTitle: 'Frontend Developer',
    company: 'Acme',
    description:
      'Maintained the company website, fixed bugs customers reported, and built new landing pages with the design team.',
    skills: ['React', 'TypeScript'],
  },
];

const letterInput: CoverLetterRequest = {
  resumeData: {
    personalInfo: { name: 'Zoë Ñúñez', summary: 'Backend engineer.' },
    experience: [
      {
        company: 'Café Ünïcode',
        position: 'Software Engineer',
        description: bulletInputs[0].description,
      },
    ],
    skills: ['Go', 'PostgreSQL', 'AWS'],
  },
  jobTitle: 'Backend Engineer',
  companyName: 'Acme',
  jobDescription: 'Go, PostgreSQL, Kubernetes, on-call ownership.',
};

type Summary = {
  bullets: number;
  bulletsWithInventedNumber: number;
  bulletsWithPlaceholder: number;
  letters: number;
  lettersWithInventedNumber: number;
  lettersWithPlaceholder: number;
  lettersWithDate: number;
  failures: number;
};
type Log = (line: string) => void;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function measureBullets(
  input: BulletPointRequest,
  index: number,
  summary: Summary,
  log: Log
) {
  for (const bullet of await draftBulletPoints(input)) {
    const invented = inventedFigures(bullet, textOf(input));
    summary.bullets++;
    if (invented.length) summary.bulletsWithInventedNumber++;
    if (placeholders(bullet).length) summary.bulletsWithPlaceholder++;
    log(JSON.stringify({ kind: 'bullet', input: index, invented, bullet }));
  }
}

async function measureLetter(summary: Summary, log: Log) {
  const letter = await draftCoverLetter(letterInput);
  const invented = inventedFigures(letter, coverLetterFacts(letterInput));
  summary.letters++;
  if (invented.length) summary.lettersWithInventedNumber++;
  if (placeholders(letter).length) summary.lettersWithPlaceholder++;
  if (dates(letter).length) summary.lettersWithDate++;
  log(
    JSON.stringify({
      kind: 'letter',
      invented,
      placeholders: placeholders(letter),
      dates: dates(letter),
      letter,
    })
  );
}

/**
 * Generate `runs` rounds (bullets for each input, then a cover letter), writing one JSON
 * line per generation to `log`, and return the counts. A failed generation is counted and
 * logged, not fatal. `pauseMs` between calls keeps the run under Groq's 8,000 tokens a
 * minute for openai/gpt-oss-120b.
 */
export async function evaluate(runs: number, pauseMs: number, log: Log) {
  const summary: Summary = {
    bullets: 0,
    bulletsWithInventedNumber: 0,
    bulletsWithPlaceholder: 0,
    letters: 0,
    lettersWithInventedNumber: 0,
    lettersWithPlaceholder: 0,
    lettersWithDate: 0,
    failures: 0,
  };
  const attempt = async (kind: string, measure: () => Promise<void>) => {
    try {
      await measure();
    } catch (error) {
      summary.failures++;
      log(JSON.stringify({ kind, error: (error as Error).message }));
    }
    await sleep(pauseMs);
  };

  for (let run = 0; run < runs; run++) {
    for (const [index, input] of bulletInputs.entries()) {
      await attempt('bullet', () => measureBullets(input, index, summary, log));
    }
    await attempt('letter', () => measureLetter(summary, log));
  }
  return summary;
}

if (import.meta.main) {
  const summary = await evaluate(
    Number(process.argv[2] ?? 6),
    6000,
    console.log
  );
  console.log(JSON.stringify({ summary: true, ...summary }));
}
