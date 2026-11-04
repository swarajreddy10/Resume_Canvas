/**
 * What a generated bullet or cover letter states that its input does not give: figures,
 * placeholders and dates. The AI service enforces the facts-only rule with these before it
 * returns text; scripts/ai-facts-eval.ts measures how often the model's drafts break it.
 *
 * A figure keeps its unit: "30 minutes" does not license "30%", "4x" or "$30", though a
 * bare number may restate a figure given with a unit ("30 percent" after "30%"). Its scale
 * is part of the amount: "10k" does not license "10M", while "$10k" and "$10,000" are the
 * same figure. A placeholder is a bracket with no digit in it ([X%], [N users]); "[20%]"
 * is a figure.
 */
// A number, an optional currency sign before it, and the word or sign after it, which
// figuresIn() classifies; keeping the classes in code keeps the pattern simple.
const FIGURE = /([$€£₹]?)(\d+(?:[.,]\d+)*)(?: ?(\p{L}+|%|×))?/gu;
const QUALIFIERS: Record<string, 'percent' | 'times'> = {
  '%': 'percent',
  percent: 'percent',
  x: 'times',
  X: 'times',
  '×': 'times',
};
// Case matters: "M" and "B" are million and billion, "10m" is as likely minutes or metres.
const SCALES: Record<string, number> = {
  k: 1e3,
  K: 1e3,
  thousand: 1e3,
  M: 1e6,
  million: 1e6,
  B: 1e9,
  bn: 1e9,
  billion: 1e9,
};
const PLACEHOLDER = /\[[^\]\d\n]{1,80}\]/g;
// One small pattern per date shape, and the month checked in code: a single pattern with
// the month names inline scored 127 on Sonar's regex complexity rule (S5843, limit 20).
const MONTH_FIRST = /\b([A-Z][a-z]{2,8}) \d{1,2},? \d{4}\b/g;
const DAY_FIRST = /\b\d{1,2} ([A-Z][a-z]{2,8}),? \d{4}\b/g;
const ISO_DATE = /\b\d{4}-\d{2}-\d{2}\b/g;
const NUMERIC_DATE = /\b\d{1,2}[/.]\d{1,2}[/.]\d{4}\b/g;
const MONTHS = [
  'january',
  'february',
  'march',
  'april',
  'may',
  'june',
  'july',
  'august',
  'september',
  'october',
  'november',
  'december',
];

/** A full month name, its first three letters, or "Sept". */
function isMonth(word: string): boolean {
  const w = word.toLowerCase();
  return w === 'sept' || MONTHS.some((m) => w === m || w === m.slice(0, 3));
}

interface Figure {
  /** As written, with its currency sign and its unit or scale word when it has one. */
  text: string;
  /** The amount: the number times its scale ("$10k" and "$10,000" are both 10000). */
  amount: number;
  unit: '' | 'currency' | 'percent' | 'times';
}

function figuresIn(text: string): Figure[] {
  return [...text.matchAll(FIGURE)].map(([, currency, number, word = '']) => {
    const qualifier = QUALIFIERS[word];
    const scale = SCALES[word];
    let unit: Figure['unit'] = qualifier ?? '';
    if (currency) unit = 'currency';
    const attached = qualifier || scale ? word : '';
    const space = attached && attached.length > 2 ? ' ' : '';
    return {
      text: `${currency}${number}${space}${attached}`,
      amount: Number(number.replace(/,/g, '')) * (scale ?? 1),
      unit,
    };
  });
}

/** Figures in `output` that `input` does not give, as written, in order of appearance. */
export function inventedFigures(output: string, input: string): string[] {
  const given = figuresIn(input);
  const supported = (f: Figure) =>
    given.some(
      (g) => g.amount === f.amount && (f.unit === '' || g.unit === f.unit)
    );
  return [
    ...new Set(
      figuresIn(output)
        .filter((f) => !supported(f))
        .map((f) => f.text)
    ),
  ];
}

/** Bracketed placeholders left for the user to fill in. */
export function placeholders(text: string): string[] {
  return [...text.matchAll(PLACEHOLDER)].map(([match]) => match);
}

/** Calendar dates: written ("April 27, 2026", "3 March 2025"), ISO, and numeric. */
export function dates(text: string): string[] {
  const written = [MONTH_FIRST, DAY_FIRST].flatMap((pattern) =>
    [...text.matchAll(pattern)].filter(([, month]) => isMonth(month))
  );
  const numeric = [ISO_DATE, NUMERIC_DATE].flatMap((pattern) => [
    ...text.matchAll(pattern),
  ]);
  return [...written, ...numeric]
    .sort((a, b) => (a.index ?? 0) - (b.index ?? 0))
    .map(([match]) => match);
}
