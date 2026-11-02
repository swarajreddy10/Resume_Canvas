/**
 * Copy only the allowed keys from a request body. Routes that write user input use
 * this instead of spreading the body, so a caller can never set a field the server
 * owns (owner, slug, counters, timestamps): OWASP recommends allow-lists over
 * block-lists against mass assignment.
 * https://cheatsheetseries.owasp.org/cheatsheets/Mass_Assignment_Cheat_Sheet.html
 */
export function pickFields(body: unknown, allowed: readonly string[]): Record<string, unknown> {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return {};
  const source = body as Record<string, unknown>;
  return Object.fromEntries(
    allowed.filter((key) => key in source).map((key) => [key, source[key]])
  );
}
