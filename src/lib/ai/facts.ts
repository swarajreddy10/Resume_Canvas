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
 *
 * Text is read token by token. A token that is a figure ("US$10M", "x10", "16.1k") is read
 * with its currency, multiplier, unit and scale, including a code or word beside it ("INR 5
 * crore", "10 Million"). A token that is not ("B2B", "OAuth2.0") still contributes its
 * numbers, bare: a number is never lost, because a missed figure is the failure this check
 * exists to prevent, while a doubtful one only costs a bullet.
 */
type Unit = '' | 'currency' | 'percent' | 'times';

// A dash after a figure splits it from what follows ("10-person", "30%-40%", "10k-20k");
// one after a letter ("COVID-19") stays inside the word.
const SPLIT_DASH = /(?<=[\d%×xXkKMBL])[-–—]/g;
// Spaces and punctuation that never sit inside a figure, Markdown marks included.
const SEPARATORS = /[\s"'“”‘’`{}[\]()<>:;/\\|*_#!?–—]+/;
const TRAILING = /[.,]+$/;
const DIGIT = /\d/;
// A token's parts: what precedes the number, the number, and what follows it.
const FIGURE_TOKEN = /^(\D*?)(\d+(?:[.,]\d+)*)(\D*)$/u;
const NUMBER_RUN = /\d+(?:[.,]\d+)*/g;
const PLAIN_INTEGER = /^[1-9]\d*$/;
const APPROXIMATELY = /^[~≈±+−-]/;
// $, ₹, US$, A$, HK$; ISO codes and Rs are matched whole.
const CURRENCY_SIGN = /^[A-Z]{0,3}[$€£₹]$/;
const CURRENCY_CODES = new Set([
  'USD',
  'EUR',
  'GBP',
  'INR',
  'AUD',
  'CAD',
  'SGD',
  'Rs',
  'Rs.',
]);
// Maps, not object literals: an object would answer for "constructor" or "valueOf"
// (MDN: an Object "contains default keys that could collide with your own keys").
// Signs and letters are read as written ("M" is million; "10m" is as likely minutes or
// metres); words in any case ("10 Million", "30 Percent").
const SIGN_UNITS = new Map<string, Unit>([
  ['%', 'percent'],
  ['x', 'times'],
  ['X', 'times'],
  ['×', 'times'],
]);
const WORD_UNITS = new Map<string, Unit>([['percent', 'percent']]);
/** Scales as powers of ten; L and Cr are lakh and crore. */
const SCALE_LETTERS = new Map([
  ['k', 3],
  ['K', 3],
  ['M', 6],
  ['B', 9],
  ['L', 5],
  ['Cr', 7],
]);
const SCALE_WORDS = new Map([
  ['thousand', 3],
  ['thousands', 3],
  ['lakh', 5],
  ['lakhs', 5],
  ['million', 6],
  ['millions', 6],
  ['crore', 7],
  ['crores', 7],
  ['billion', 9],
  ['billions', 9],
  ['bn', 9],
]);
const NO_SUFFIX: { unit?: Unit; exponent?: number } = Object.freeze({});

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

/**
 * The facts in a request as plain text: its strings and numbers, one per line. Never
 * JSON.stringify: it writes a line break inside a string as the two characters "\n", which
 * glue onto the figure after them ("\n40%" reads as the word "n40%").
 */
export function textOf(value: unknown): string {
  const parts: string[] = [];
  const visit = (v: unknown): void => {
    if (typeof v === 'string' || typeof v === 'number') parts.push(String(v));
    else if (Array.isArray(v)) v.forEach(visit);
    else if (v && typeof v === 'object') Object.values(v).forEach(visit);
  };
  visit(value);
  return parts.join('\n');
}

interface Figure {
  /** As written: its token, with the currency code or unit or scale word beside it. */
  text: string;
  /** The amount as a decimal string ("$10k" and "$10,000" are both "10000"). */
  amount: string;
  unit: Unit;
}

/**
 * The amount with its scale applied by moving the decimal point, as a canonical decimal
 * string: floating point would make 16.1 * 1000 equal 16100.000000000002. A number with
 * more than one dot is an identifier and is kept as written.
 */
function amountOf(number: string, exponent: number): string {
  if (exponent === 0 && PLAIN_INTEGER.test(number)) return number;
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

/** Tokens as split; trailing punctuation is trimmed only where a figure is read. */
function tokensOf(text: string): string[] {
  return text.replace(SPLIT_DASH, ' ').split(SEPARATORS);
}

function trimmed(token: string | undefined): string | undefined {
  if (!token) return undefined;
  return TRAILING.test(token)
    ? token.replace(TRAILING, '') || undefined
    : token;
}

function isCurrency(word: string): boolean {
  return CURRENCY_SIGN.test(word) || CURRENCY_CODES.has(word);
}

/** What precedes the number: nothing, a currency, or a multiplier; null if a word. */
function readPrefix(prefix: string): Unit | null {
  if (prefix === '') return '';
  const p = prefix.replace(APPROXIMATELY, '');
  if (p === '') return '';
  if (isCurrency(p)) return 'currency';
  return SIGN_UNITS.get(p) === 'times' ? 'times' : null;
}

/**
 * What follows the number in its token: a unit, a scale, nothing, or another unit such as
 * "h" or "GB" (a plain figure); null if the token is a word. A trailing "+" ("5+",
 * "10k+") leaves the figure as written.
 */
function readSuffix(suffix: string): { unit?: Unit; exponent?: number } | null {
  if (suffix === '') return NO_SUFFIX;
  const s = suffix.endsWith('+') ? suffix.slice(0, -1) : suffix;
  if (s === '') return NO_SUFFIX;
  const unit = SIGN_UNITS.get(s) ?? WORD_UNITS.get(s.toLowerCase());
  if (unit) return { unit };
  const exponent = SCALE_LETTERS.get(s) ?? SCALE_WORDS.get(s.toLowerCase());
  if (exponent !== undefined) return { exponent };
  return /^\p{L}+$/u.test(s) ? NO_SUFFIX : null;
}

/** The figures in tokens[i]: one if it is a figure, its bare numbers if it is a word. */
function figuresAt(tokens: string[], i: number): Figure[] {
  const token = trimmed(tokens[i]);
  if (!token || !DIGIT.test(token)) return [];
  const parts = FIGURE_TOKEN.exec(token);
  const lead = parts ? readPrefix(parts[1]) : null;
  const tail = parts ? readSuffix(parts[3]) : null;
  if (!parts || lead === null || tail === null) {
    return [...token.matchAll(NUMBER_RUN)].map(([number]) => ({
      text: token,
      amount: amountOf(number, 0),
      unit: '',
    }));
  }

  let text = token;
  let unit: Unit = lead || tail.unit || '';
  let exponent = tail.exponent;
  const before = trimmed(tokens[i - 1]);
  if (!lead && before !== undefined && isCurrency(before)) {
    unit = 'currency';
    text = `${before} ${text}`;
  }
  const after = trimmed(tokens[i + 1]);
  if (after !== undefined && !tail.unit && exponent === undefined) {
    const lower = after.toLowerCase();
    const nextUnit = SIGN_UNITS.get(after) ?? WORD_UNITS.get(lower);
    const nextScale = SCALE_WORDS.get(lower) ?? SCALE_LETTERS.get(after);
    if (nextUnit && unit === '') unit = nextUnit;
    if (nextScale !== undefined) exponent = nextScale;
    if (nextUnit || nextScale !== undefined) text = `${text} ${after}`;
  }
  return [{ text, amount: amountOf(parts[2], exponent ?? 0), unit }];
}

function figuresIn(text: string): Figure[] {
  const tokens = tokensOf(text);
  return tokens.flatMap((_, i) => figuresAt(tokens, i));
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
