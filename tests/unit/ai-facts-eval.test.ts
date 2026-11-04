/**
 * The detector behind `bun run ai:facts`: what counts as a number the user never gave, and
 * what counts as a placeholder or a date the model made up.
 */
import { beforeEach, describe, expect, test } from 'bun:test';
import {
  dates,
  evaluate,
  inventedNumbers,
  placeholders,
} from '../../scripts/ai-facts-eval';
import { failWith, replyWith, resetGroq } from '../helpers/groq';

describe('evaluate', () => {
  beforeEach(resetGroq);

  test('counts what each generation invented, against the mocked model', async () => {
    // One run: bullets for the input with figures, bullets for the one without, a letter.
    replyWith(
      '{"bullets": ["Cut a nightly batch from 30 to 4 minutes", "Grew usage by 50%"]}'
    );
    replyWith('{"bullets": ["Fixed reported bugs, cutting tickets by [X%]"]}');
    replyWith(
      '[Your Address]\nApril 27 2026\nDear Hiring Team, I cut a batch 87% faster.'
    );
    const lines: string[] = [];

    const summary = await evaluate(1, 0, (line) => lines.push(line));

    expect(summary).toEqual({
      bullets: 3,
      bulletsWithInventedNumber: 1,
      bulletsWithPlaceholder: 1,
      letters: 1,
      lettersWithInventedNumber: 1,
      lettersWithPlaceholder: 1,
      lettersWithDate: 1,
      failures: 0,
    });
    expect(lines).toHaveLength(4);
    expect(JSON.parse(lines[1]).invented).toEqual(['50']);
  });

  test('counts a failed generation instead of stopping', async () => {
    failWith('503 Service Unavailable');
    replyWith('{"bullets": ["Built landing pages"]}');
    replyWith('Dear Hiring Team, thank you.');

    const summary = await evaluate(1, 0, () => {});

    expect(summary.failures).toBe(1);
    expect(summary.bullets).toBe(1);
    expect(summary.letters).toBe(1);
  });
});

describe('inventedNumbers', () => {
  test('flags numbers absent from the input, in any common format', () => {
    expect(
      inventedNumbers(
        'Cut a batch from 30 to 4 minutes (87% faster), serving 15k users and saving $120,000.',
        'replaced row-wise inserts, cutting a batch from 30 to 4 minutes'
      )
    ).toEqual(['87', '15', '120000']);
  });

  test('accepts numbers the input gave, however they are written', () => {
    expect(
      inventedNumbers(
        'Saved $1,200 across 2.5 hours',
        'saved 1200 dollars in 2.5h'
      )
    ).toEqual([]);
  });

  test('ignores numbers inside a bracketed placeholder the user fills in', () => {
    expect(
      inventedNumbers('Reduced errors by [X%] for [N] users', 'reduced errors')
    ).toEqual([]);
    expect(inventedNumbers('Grew sign-ups by [20%]', 'grew sign-ups')).toEqual(
      []
    );
  });

  test('counts numbers inside the input JSON arrays as given', () => {
    const input = JSON.stringify({
      experience: [{ description: 'cut a batch from 30 to 4 minutes' }],
    });
    expect(
      inventedNumbers('I cut a batch from 30 to 4 minutes.', input)
    ).toEqual([]);
  });

  test('handles non-ASCII text', () => {
    expect(
      inventedNumbers(
        'Migración en 3 días para Zoë',
        'Migración de la base de datos'
      )
    ).toEqual(['3']);
  });
});

describe('placeholders', () => {
  test('lists bracketed placeholders', () => {
    expect(
      placeholders('[Your Address]\nDear team, I cut costs by [X%].')
    ).toEqual(['[Your Address]', '[X%]']);
  });
});

describe('dates', () => {
  test('finds written and ISO dates', () => {
    expect(
      dates('April 27 2026\nDear team\nSent 2026-11-04 and on 3 March, 2025')
    ).toEqual(['April 27 2026', '2026-11-04', '3 March, 2025']);
  });
});
