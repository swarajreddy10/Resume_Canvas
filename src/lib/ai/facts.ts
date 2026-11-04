/**
 * What a generated bullet or cover letter states that its input does not give: figures,
 * placeholders and dates. The AI service enforces the facts-only rule with these before it
 * returns text; scripts/ai-facts-eval.ts measures how often the model's drafts break it.
 *
 * A figure keeps its unit: "30 minutes" does not license "30%", "4x" or "$30", though a
 * bare number may restate a figure given with a unit ("30 percent" after "30%"). A
 * placeholder is a bracket with no digit in it ([X%], [N users]); "[20%]" is a figure.
 */
const FIGURE = /([$€£₹]?)(\d+(?:[.,]\d+)*)(%| percent\b|x\b|×)?/g;
const PLACEHOLDER = /\[[^\]\d\n]{1,80}\]/g;
const DATE =
  /\b(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|June?|July?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?) \d{1,2},? \d{4}\b|\b\d{1,2} (?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|June?|July?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?),? \d{4}\b|\b\d{4}-\d{2}-\d{2}\b|\b\d{1,2}[/.]\d{1,2}[/.]\d{4}\b/g;

interface Figure {
  text: string;
  value: string;
  unit: '' | 'currency' | 'percent' | 'times';
}

function figuresIn(text: string): Figure[] {
  return [...text.matchAll(FIGURE)].map(([text, currency, number, suffix]) => {
    let unit: Figure['unit'] = '';
    if (currency) unit = 'currency';
    else if (suffix === 'x' || suffix === '×') unit = 'times';
    else if (suffix) unit = 'percent';
    return { text, value: number.replace(/,/g, ''), unit };
  });
}

/** Figures in `output` that `input` does not give, as written, in order of appearance. */
export function inventedFigures(output: string, input: string): string[] {
  const given = figuresIn(input);
  const supported = (f: Figure) =>
    given.some(
      (g) => g.value === f.value && (f.unit === '' || g.unit === f.unit)
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
  return [...text.matchAll(DATE)].map(([match]) => match);
}
