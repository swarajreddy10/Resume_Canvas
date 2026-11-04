/**
 * `bun run ai:facts`: it measures the model's raw drafts (before the service drops or
 * refuses anything) with the detector in src/lib/ai/facts.ts, tested in ai-facts.test.ts.
 */
import { beforeEach, describe, expect, test } from 'bun:test';
import { evaluate } from '../../scripts/ai-facts-eval';
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
    expect(JSON.parse(lines[1]).invented).toEqual(['50%']);
    // The whole letter is saved, so a run can be counted again when the check changes.
    expect(JSON.parse(lines[3]).letter).toBe(
      '[Your Address]\nApril 27 2026\nDear Hiring Team, I cut a batch 87% faster.'
    );
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
