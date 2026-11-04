/**
 * What counts as a figure the input never gave, a placeholder, or a made-up date: the
 * rules the AI service enforces on bullets and cover letters, and that
 * scripts/ai-facts-eval.ts measures. Every case found in review is a row here, so a fix
 * for one cannot quietly break another.
 */
import { describe, expect, test } from 'bun:test';
import { dates, inventedFigures, placeholders, textOf } from '@/lib/ai/facts';

// [rule, generated text, what the user gave, figures expected to be reported]
const cases: [string, string, string, string[]][] = [
  // Formats.
  [
    'absent figures, any format',
    'Cut a batch from 30 to 4 minutes (87% faster), serving 15k users and saving $120,000.',
    'cutting a batch from 30 to 4 minutes',
    ['87%', '15k', '$120,000'],
  ],
  [
    'the same figures written another way',
    'Saved $1,200 across 2.5 hours',
    'saved $1200 in 2.5h',
    [],
  ],
  [
    'a non-ASCII sentence',
    'Migración en 3 días para Zoë',
    'Migración de la base de datos',
    ['3'],
  ],
  // Units: one unit does not license another, a bare number may restate one.
  [
    'minutes do not license a percentage',
    'Increased sales by 30%',
    'cut a batch from 30 to 4 minutes',
    ['30%'],
  ],
  [
    'minutes do not license a multiplier',
    'Boosted throughput 4x',
    'cut a batch from 30 to 4 minutes',
    ['4x'],
  ],
  [
    'minutes do not license money',
    'Saved $30 a month',
    'cut a batch from 30 to 4 minutes',
    ['$30'],
  ],
  [
    'the same minutes',
    'Cut it to 4 minutes',
    'cut a batch from 30 to 4 minutes',
    [],
  ],
  [
    'percent as a word restates %',
    'cut errors by 30 percent',
    'cut errors by 30%',
    [],
  ],
  [
    'Percent in any case',
    'Cut errors by 30 Percent',
    'cut errors in 30 minutes',
    ['30 Percent'],
  ],
  [
    'x10 is a multiplier',
    'Boosted throughput x10',
    'boosted throughput',
    ['x10'],
  ],
  ['x10 restates 10x', 'Boosted throughput x10', 'boosted throughput 10x', []],
  // Scales: the amount is the number times its scale.
  ['10k does not license 10M', 'Served 10M users', 'served 10k users', ['10M']],
  [
    '10k does not license 10 million',
    'Served 10 million users',
    'served 10k users',
    ['10 million'],
  ],
  ['$10k does not license $10M', 'Raised $10M', 'raised $10k', ['$10M']],
  ['15 does not license 15k', 'Served 15k users', 'served 15 users', ['15k']],
  ['$10k is $10,000', 'Raised $10,000', 'raised $10k', []],
  ['2.5M is 2.5 million', 'Served 2.5 million users', 'served 2.5M users', []],
  [
    'decimals, not floating point',
    'Cut spend by $16.1k',
    'cut spend by $16,100',
    [],
  ],
  ['decimals, the other way', 'Served 16,100 users', 'served 16.1k users', []],
  [
    'Million in any case',
    'Served 10 Million users',
    'served 10 users',
    ['10 Million'],
  ],
  ['Bn as a word', 'Raised $3 Bn', 'raised $3 Bn', []],
  // A lone letter after a number is a word ("3 B-tree", "Plan 2 B"), not a scale.
  [
    'a lone letter after a number is a word',
    'Served 10 k users',
    'served 10 users',
    [],
  ],
  [
    'a hyphenated word after a number',
    'Ran 3 B-tree indexes',
    'ran 3 indexes on B-trees',
    [],
  ],
  ['mn', 'Raised $5mn', 'raised $5', ['$5mn']],
  ['MM', 'Raised $5MM', 'raised $5', ['$5MM']],
  ['lacs', 'Saved ₹5 lacs', 'saved ₹5', ['₹5 lacs']],
  // After a currency sign, m and b can only be million and billion.
  ['m after a currency', 'Raised $5m', 'raised $5', ['$5m']],
  ['b after a currency', 'Raised $2b in ARR', 'raised $2', ['$2b']],
  [
    'm without a currency is not million',
    'Ran a 5m sprint',
    'ran a 5 minute sprint',
    [],
  ],
  ['crore is not lakh', 'Saved ₹10 crore', 'saved ₹10 lakh', ['₹10 crore']],
  ['100 lakh is 1 crore', 'Saved ₹100 lakh', 'saved ₹1 crore', []],
  [
    '100 lakh is not 10 crore',
    'Saved ₹100 lakh',
    'saved ₹10 crore',
    ['₹100 lakh'],
  ],
  [
    'L and Cr are lakh and crore',
    'Offered ₹10L, raised ₹2Cr',
    'offered ₹10 lakh, raised ₹2 crore',
    [],
  ],
  // Currency.
  [
    'a country code before the sign',
    'Raised US$10M',
    'served 10M users',
    ['US$10M'],
  ],
  ['A$', 'Raised A$5k', 'hired 5k people', ['A$5k']],
  ['an ISO code glued on', 'Raised USD10k', 'raised funds', ['USD10k']],
  [
    'an ISO code before it',
    'Raised INR 5 crore',
    'raised funds',
    ['INR 5 crore'],
  ],
  ['Rs. glued on', 'Saved Rs.10,000 a month', 'saved money', ['Rs.10,000']],
  ['a sign standing alone', 'Raised ₹ 5', 'raised ₹5', []],
  ['the same currency figure', 'Raised US$10M', 'raised US$10M', []],
  // Identifiers and numbers inside words: never dropped, matched as given.
  [
    'a version as written',
    'Upgraded to React 18.2.0',
    'upgraded to React 18.2.0',
    [],
  ],
  ['another version', 'Upgraded to React 18.3.1', 'React 18.2.0', ['18.3.1']],
  [
    'an address as written',
    'Moved 192.168.1.10 to a VPC',
    'moved 192.168.1.10',
    [],
  ],
  [
    'a version inside a word, given',
    'Released v2.5',
    'released version 2.5',
    [],
  ],
  [
    'a version inside a word, not given',
    'Implemented OAuth2.0 login',
    'implemented OAuth login',
    ['OAuth2.0'],
  ],
  [
    'a word with a number, given',
    'Onboarded 3 B2B clients',
    'onboarded 3 clients in B2B',
    [],
  ],
  [
    'a word with a number, not given',
    'Built our B2B platform',
    'built a platform',
    ['B2B'],
  ],
  ['a word with no number', 'Shipped 3 M&A tools', 'shipped 3 tools', []],
  [
    'a word that names an Object.prototype member',
    'Wrote 3 constructor',
    'wrote 3 tests',
    [],
  ],
  // Punctuation, hyphens and ranges.
  ['a hyphenated team size', 'Led a 10-person team', 'led a team of 5', ['10']],
  [
    'a hyphenated duration',
    'Ran a 3-month migration',
    'ran a migration',
    ['3'],
  ],
  ['markdown bold', 'Cut latency by **40%**', 'cut latency', ['40%']],
  ['a rank', 'Ranked #1 on the leaderboard', 'ranked well', ['1']],
  ['an en dash range', 'Cut latency 30–40%', 'cut latency', ['30', '40%']],
  ['a hyphen range', 'Cut latency 30-40%', 'cut latency', ['30', '40%']],
  [
    'a range with units on both ends',
    'Cut costs 30%-40%',
    'cut costs',
    ['30%', '40%'],
  ],
  ['a scaled range', 'Served 10k-20k users', 'served users', ['10k', '20k']],
  // GPT-OSS writes U+2011, the non-breaking hyphen ("Go‑based", "26‑minute").
  [
    'a non-breaking hyphen range',
    'Cut costs 30%‑40%',
    'cut costs by 40 minutes',
    ['30%', '40%'],
  ],
  [
    'a non-breaking hyphen after a number',
    'Cut a 26‑minute batch',
    'cut a 30 to 4 minute batch',
    ['26'],
  ],
  ['approximately', 'Cut latency ~30%', 'cut latency by 30%', []],
  ['at least', 'Led 5+ engineers', 'led a team', ['5+']],
  ['at least, scaled', 'Served 10k+ users', 'served 10k users', []],
  // Placeholders the user fills in are not figures; a bracketed figure is.
  [
    'placeholders',
    'Reduced errors by [X%] for [N users]',
    'reduced errors',
    [],
  ],
  ['a figure in brackets', 'Grew sign-ups by [20%]', 'grew sign-ups', ['20%']],
  // Currency named after the number: words and signs only. An ISO code there is as often a
  // label ("3 INR payment flows") as money, so "10k USD" is a documented limit.
  [
    'an ISO code after a count is a label',
    'Built 3 INR payment flows',
    'built 3 payment flows for India',
    [],
  ],
  [
    'an ISO code after the number is not read (a documented limit)',
    'Raised 10k USD',
    'served 10k users',
    [],
  ],
  [
    'a currency sign after a scaled number',
    'Saved 10k€ a year',
    'served 10 users',
    ['10k€'],
  ],
  [
    'a range in bn',
    'Managed budgets of $5bn-$10bn',
    'managed 5 teams over 10 years',
    ['$5bn', '$10bn'],
  ],
  [
    'a currency word after the number',
    'Saved 10,000 dollars',
    'served 10,000 users',
    ['10,000 dollars'],
  ],
  ['euros', 'Saved 500 euros', 'cut 500 tickets', ['500 euros']],
  [
    'a currency sign after the number',
    'Saved 10€ per user',
    'served 10 users',
    ['10€'],
  ],
  ['the same money named after', 'Saved 500 euros', 'saved €500', []],
  // Unit words and signs.
  [
    'per cent as two words',
    'Cut costs by 30 per cent',
    'in 30 minutes',
    ['30 per cent'],
  ],
  [
    'times as a multiplier',
    'Made builds 10 times faster',
    'in 10 minutes',
    ['10 times'],
  ],
  ['at most', 'Kept the error rate ≤1%', 'led 1 team', ['≤1%']],
  ['at least, as a sign', 'Held ≥99.9% uptime', 'kept 99.9 ms', ['≥99.9%']],
  // "times" is a multiplier only before a comparative; "20 times a day" is a count.
  [
    'times meaning how often',
    'Shipped to production 20 times a day',
    'the team now ships 20 deploys a day',
    [],
  ],
  [
    'times a week',
    'Paged on-call 3 times a week less',
    'cut pages from 5 to 3 a week',
    [],
  ],
];

describe('inventedFigures', () => {
  test.each(cases)('%s', (_, output, input, expected) => {
    expect(inventedFigures(output, input)).toEqual(expected);
  });
});

describe('textOf', () => {
  test('joins the strings and numbers of a value, so no JSON escape reaches the reader', () => {
    const request = {
      jobTitle: 'Engineer',
      description: 'Moved CI to remote caching.\n40% faster builds\t$10k saved',
      skills: ['Go', 'Zoë'],
      years: [5, 10],
      nested: { note: 'served 2.5M users', empty: null },
    };
    const text = textOf(request);
    expect(text).toContain('40% faster builds');
    expect(inventedFigures('Cut build time by 40%, saving $10k', text)).toEqual(
      []
    );
    expect(inventedFigures('Five and ten: 5, 10', text)).toEqual([]);
    expect(inventedFigures('Served 2.5 million users', text)).toEqual([]);
    expect(text).not.toContain('\\n');
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
