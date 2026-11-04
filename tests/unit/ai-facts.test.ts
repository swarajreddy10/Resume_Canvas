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
    ).toEqual(['87%', '15k', '$120,000']);
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

  test('a scale is part of the figure: 10k does not license 10M', () => {
    expect(inventedFigures('Served 10M users', 'served 10k users')).toEqual([
      '10M',
    ]);
    expect(
      inventedFigures('Served 10 million users', 'served 10k users')
    ).toEqual(['10 million']);
    expect(inventedFigures('Raised $10M', 'raised $10k')).toEqual(['$10M']);
    expect(inventedFigures('Served 15k users', 'served 15 users')).toEqual([
      '15k',
    ]);
  });

  test('the same amount written another way is the same figure', () => {
    expect(inventedFigures('Raised $10,000', 'raised $10k')).toEqual([]);
    expect(
      inventedFigures('Served 2.5 million users', 'served 2.5M users')
    ).toEqual([]);
    // Decimal arithmetic, not floating point: 16.1 * 1000 is 16100.000000000002.
    expect(
      inventedFigures('Cut spend by $16.1k', 'cut spend by $16,100')
    ).toEqual([]);
    expect(
      inventedFigures('Served 16,100 users', 'served 16.1k users')
    ).toEqual([]);
  });

  test('a version or an address is matched as written', () => {
    expect(
      inventedFigures('Upgraded to React 18.2.0', 'upgraded to React 18.2.0')
    ).toEqual([]);
    expect(
      inventedFigures('Moved 192.168.1.10 to a VPC', 'moved 192.168.1.10')
    ).toEqual([]);
    expect(inventedFigures('Upgraded to React 18.3.1', 'React 18.2.0')).toEqual(
      ['18.3.1']
    );
  });

  test('a scale is a whole word, not the first letter of one', () => {
    expect(
      inventedFigures('Onboarded 3 B2B clients', 'onboarded 3 clients in B2B')
    ).toEqual([]);
    expect(inventedFigures('Shipped 3 M&A tools', 'shipped 3 tools')).toEqual(
      []
    );
    // A digit inside a word is part of the word, not a figure.
    expect(
      inventedFigures('Built our B2B platform', 'built a platform')
    ).toEqual([]);
  });

  test('scale and unit words are read in any case', () => {
    expect(
      inventedFigures('Served 10 Million users', 'served 10 users')
    ).toEqual(['10 Million']);
    expect(inventedFigures('Raised $3 Bn', 'raised $3 Bn')).toEqual([]);
    expect(
      inventedFigures('Cut errors by 30 Percent', 'cut errors in 30 minutes')
    ).toEqual(['30 Percent']);
  });

  test('a currency sign after a country code stays a currency figure', () => {
    expect(inventedFigures('Raised US$10M', 'served 10M users')).toEqual([
      'US$10M',
    ]);
    expect(inventedFigures('Raised A$5k', 'hired 5k people')).toEqual(['A$5k']);
    expect(inventedFigures('Raised USD10k', 'raised funds')).toEqual([
      'USD10k',
    ]);
    expect(inventedFigures('Raised INR 5 crore', 'raised funds')).toEqual([
      'INR 5 crore',
    ]);
    expect(inventedFigures('Raised US$10M', 'raised US$10M')).toEqual([]);
  });

  test('a number glued to a word is part of the word', () => {
    expect(inventedFigures('Released v2.5', 'released version 2.5')).toEqual(
      []
    );
    expect(
      inventedFigures('Implemented OAuth2.0 login', 'implemented OAuth login')
    ).toEqual([]);
    expect(inventedFigures('Upgraded to v18.2.0', 'upgraded it')).toEqual([]);
  });

  test('a word named like an Object.prototype member is not a unit', () => {
    expect(inventedFigures('Wrote 3 constructor', 'wrote 3 tests')).toEqual([]);
    expect(inventedFigures('Wrote 3 valueOf', 'wrote 3 tests')).toEqual([]);
  });

  test('x10 is a multiplier, and lakh and crore are scales', () => {
    expect(
      inventedFigures('Boosted throughput x10', 'boosted throughput')
    ).toEqual(['x10']);
    expect(
      inventedFigures('Boosted throughput x10', 'boosted throughput 10x')
    ).toEqual([]);
    expect(inventedFigures('Saved ₹10 crore', 'saved ₹10 lakh')).toEqual([
      '₹10 crore',
    ]);
    // A crore is 100 lakh (10^7 and 10^5).
    expect(inventedFigures('Saved ₹100 lakh', 'saved ₹1 crore')).toEqual([]);
    expect(inventedFigures('Saved ₹100 lakh', 'saved ₹10 crore')).toEqual([
      '₹100 lakh',
    ]);
  });

  test('ranges and approximations keep each figure', () => {
    expect(inventedFigures('Cut latency 30–40%', 'cut latency')).toEqual([
      '30',
      '40%',
    ]);
    expect(inventedFigures('Cut latency 30-40%', 'cut latency')).toEqual([
      '30',
      '40%',
    ]);
    expect(inventedFigures('Cut latency ~30%', 'cut latency by 30%')).toEqual(
      []
    );
    expect(inventedFigures('Led 5+ engineers', 'led a team')).toEqual(['5+']);
    expect(inventedFigures('Served 10k+ users', 'served 10k users')).toEqual(
      []
    );
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
