/**
 * What a generated bullet or cover letter states that its input does not give: figures,
 * placeholders and dates. The AI service enforces the facts-only rule with these before it
 * returns text; scripts/ai-facts-eval.ts measures how often the model's drafts break it.
 *
 * A figure keeps its unit: "30 minutes" does not license "30%", "4x" or "$30", though a
 * bare number may restate a figure given with a unit ("30 percent" after "30%"). Its scale
 * is part of the amount: "10k" does not license "10M", while "$10k" and "$10,000" are the
 * same figure. A number with more than one dot is an identifier (a version, an address)
 * and matches only as written. A placeholder is a bracket with no digit in it ([X%],
 * [N users]); "[20%]" is a figure.
 */
// A number not inside a word ("B2B" holds no figure), an optional currency sign before it,
// and the whole word or sign after it, which figuresIn() classifies; keeping the classes
// in code keeps the pattern simple.
const FIGURE =
  /(?<![\p{L}\p{N}])([$€£₹]?)(\d+(?:[.,]\d+)*)(?: ?(\p{L}[\p{L}\p{N}&]*|%|×))?/gu;
// Signs and single letters are read as written: "M" and "B" are million and billion, while
// "10m" is as likely minutes or metres. Words are read in any case ("10 Million").
const UNIT_SIGNS: Record<string, 'percent' | 'times'> = {
  '%': 'percent',
  '×': 'times',
  x: 'times',
  X: 'times',
};
const UNIT_WORDS: Record<string, 'percent'> = { percent: 'percent' };
/** Scales as powers of ten. */
const SCALE_LETTERS: Record<string, number> = { k: 3, K: 3, M: 6, B: 9 };
const SCALE_WORDS: Record<string, number> = {
  thousand: 3,
  million: 6,
  billion: 9,
  bn: 9,
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
  /** As written: the currency sign and number, and the unit or scale word if it has one. */
  text: string;
  /** The amount as a decimal string ("$10k" and "$10,000" are both "10000"). */
  amount: string;
  unit: '' | 'currency' | 'percent' | 'times';
}

/**
 * The amount with its scale applied by moving the decimal point, as a canonical decimal
 * string: floating point would make 16.1 * 1000 equal 16100.000000000002. A number with
 * more than one dot is an identifier and is kept as written.
 */
function amountOf(number: string, exponent: number): string {
  const digits = number.replace(/,/g, '');
  const parts = digits.split('.');
  if (parts.length > 2) return digits;
  const [whole, fraction = ''] = parts;
  const point = whole.length + exponent;
  const all = (whole + fraction).padEnd(point, '0');
  const integer = all.slice(0, point).replace(/^0+(?=\d)/, '');
  const decimals = all.slice(point).replace(/0+$/, '');
  return decimals ? `${integer}.${decimals}` : integer;
}

function figuresIn(text: string): Figure[] {
  return [...text.matchAll(FIGURE)].map(
    ([match, currency, number, word = '']) => {
      const lower = word.toLowerCase();
      const qualifier = UNIT_SIGNS[word] ?? UNIT_WORDS[lower];
      const exponent = SCALE_LETTERS[word] ?? SCALE_WORDS[lower];
      let unit: Figure['unit'] = qualifier ?? '';
      if (currency) unit = 'currency';
      const classified = qualifier !== undefined || exponent !== undefined;
      return {
        text: classified ? match : `${currency}${number}`,
        amount: amountOf(number, exponent ?? 0),
        unit,
      };
    }
  );
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
