/**
 * What counts as a figure the input never gave, a placeholder, or a made-up date: the
 * rules the AI service enforces on bullets and cover letters, and that
 * scripts/ai-facts-eval.ts measures.
 */
import { describe, expect, test } from 'bun:test';
import { dates, inventedFigures, placeholders } from '@/lib/ai/facts';

describe('inventedFigures', () => {
  test('flags figures absent from the input, in any common format', () => {
    expect(
      inventedFigures(
        'Cut a batch from 30 to 4 minutes (87% faster), serving 15k users and saving $120,000.',
        'replaced row-wise inserts, cutting a batch from 30 to 4 minutes'
      )
    ).toEqual(['87%', '15', '$120,000']);
  });

  test('accepts figures the input gave, however they are written', () => {
    expect(
      inventedFigures('Saved $1,200 across 2.5 hours', 'saved $1200 in 2.5h')
    ).toEqual([]);
  });

  test('a number given with one unit does not license another', () => {
    const input = 'cut a batch from 30 to 4 minutes';
    expect(inventedFigures('Increased sales by 30%', input)).toEqual(['30%']);
    expect(inventedFigures('Boosted throughput 4x', input)).toEqual(['4x']);
    expect(inventedFigures('Saved $30 a month', input)).toEqual(['$30']);
    expect(inventedFigures('Cut it to 4 minutes', input)).toEqual([]);
  });

  test('a bare number may restate a figure the input gave with its unit', () => {
    expect(
      inventedFigures('cut errors by 30 percent', 'cut errors by 30%')
    ).toEqual([]);
  });

  test('ignores a placeholder the user fills in, but not a figure in brackets', () => {
    expect(
      inventedFigures('Reduced errors by [X%] for [N users]', 'reduced errors')
    ).toEqual([]);
    expect(inventedFigures('Grew sign-ups by [20%]', 'grew sign-ups')).toEqual([
      '20%',
    ]);
  });

  test('counts numbers inside the input JSON arrays as given', () => {
    const input = JSON.stringify({
      experience: [{ description: 'cut a batch from 30 to 4 minutes' }],
    });
    expect(
      inventedFigures('I cut a batch from 30 to 4 minutes.', input)
    ).toEqual([]);
  });

  test('handles non-ASCII text', () => {
    expect(
      inventedFigures(
        'Migración en 3 días para Zoë',
        'Migración de la base de datos'
      )
    ).toEqual(['3']);
  });
});

describe('placeholders', () => {
  test('lists bracketed placeholders, not bracketed figures', () => {
    expect(
      placeholders('[Your Address]\nDear team, I cut costs by [X%], or [20%].')
    ).toEqual(['[Your Address]', '[X%]']);
  });
});

describe('dates', () => {
  test('finds written, ISO and numeric dates', () => {
    expect(
      dates(
        'April 27 2026\nDear team\nSent 2026-11-04, 11/04/2026 and on 3 March, 2025'
      )
    ).toEqual(['April 27 2026', '2026-11-04', '11/04/2026', '3 March, 2025']);
  });

  test('a month and year alone is not a date line', () => {
    expect(dates('Engineer since January 2024')).toEqual([]);
  });

  test('takes full and short month names, and only month names', () => {
    expect(dates('Sent Sept 3, 2025, Jun 9 2024 and 12 Dec 2023')).toEqual([
      'Sept 3, 2025',
      'Jun 9 2024',
      '12 Dec 2023',
    ]);
    expect(dates('Sprint 12 2025 shipped; Release 3 2024 followed')).toEqual(
      []
    );
  });
});
