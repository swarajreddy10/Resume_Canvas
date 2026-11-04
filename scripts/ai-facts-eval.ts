/**
 * Measures how often generated résumé text states facts the user never gave: numbers that
 * are not in the input, and, in cover letters, bracketed placeholders and dates. Bullets
 * may hold a bracketed placeholder such as [X%] for the user to fill in; a number inside
 * one is not counted. A figure derived from the input (87% from "30 to 4 minutes") counts
 * as invented: only numbers the user wrote are facts.
 *
 * Usage: bun run ai:facts [runs per input, default 6] (live Groq API, GROQ_API_KEY set).
 * Prints one JSON line per generation, then a summary. Each run is two bullet requests
 * and one cover letter, about 2,700 tokens.
 */
import {
  generateBulletPoints,
  generateCoverLetter,
  type BulletPointRequest,
} from '@/features/ai/services/ai.service';

const PLACEHOLDER = /\[[^\]\n]+\]/g;
const NUMBER = /\d+(?:[.,]\d+)*/g;
const MONTH =
  '(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|June?|July?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)';
const DATE = new RegExp(
  `${MONTH}\\s+\\d{1,2},?\\s+\\d{4}|\\d{1,2}\\s+${MONTH},?\\s+\\d{4}|\\d{4}-\\d{2}-\\d{2}`,
  'g'
);

/** The numbers in `text`, digits only ("$120,000" is "120000"). */
function numbersIn(text: string): string[] {
  return (text.match(NUMBER) ?? []).map((n) => n.replace(/,/g, ''));
}

/**
 * Numbers in `output`, outside its placeholders, that `input` does not contain, in order
 * of first appearance. The input keeps its brackets: they are JSON arrays there.
 */
export function inventedNumbers(output: string, input: string): string[] {
  const given = new Set(numbersIn(input));
  const stated = numbersIn(output.replace(PLACEHOLDER, ' '));
  return [...new Set(stated)].filter((n) => !given.has(n));
}

export function placeholders(text: string): string[] {
  return text.match(PLACEHOLDER) ?? [];
}

export function dates(text: string): string[] {
  return text.match(DATE) ?? [];
}

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

const letterInput = {
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

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Generate `runs` rounds (bullets for each input, then a cover letter), writing one JSON
 * line per generation to `log`, and return the counts. `pauseMs` between calls keeps the
 * run under Groq's 8,000 tokens a minute for openai/gpt-oss-120b.
 */
export async function evaluate(
  runs: number,
  pauseMs: number,
  log: (line: string) => void
) {
  const summary = {
    bullets: 0,
    bulletsWithInventedNumber: 0,
    bulletsWithPlaceholder: 0,
    letters: 0,
    lettersWithInventedNumber: 0,
    lettersWithPlaceholder: 0,
    lettersWithDate: 0,
    failures: 0,
  };
  const failed = (kind: string, error: unknown) => {
    summary.failures++;
    log(JSON.stringify({ kind, error: (error as Error).message }));
  };

  for (let run = 0; run < runs; run++) {
    for (const [i, input] of bulletInputs.entries()) {
      try {
        for (const bullet of await generateBulletPoints(input)) {
          const invented = inventedNumbers(bullet, JSON.stringify(input));
          summary.bullets++;
          if (invented.length) summary.bulletsWithInventedNumber++;
          if (placeholders(bullet).length) summary.bulletsWithPlaceholder++;
          log(JSON.stringify({ kind: 'bullet', input: i, invented, bullet }));
        }
      } catch (error) {
        failed('bullet', error);
      }
      await sleep(pauseMs);
    }
    try {
      const letter = await generateCoverLetter(letterInput);
      const invented = inventedNumbers(letter, JSON.stringify(letterInput));
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
          opening: letter.slice(0, 120),
        })
      );
    } catch (error) {
      failed('letter', error);
    }
    await sleep(pauseMs);
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
