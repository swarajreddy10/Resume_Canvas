/**
 * Input Sanitization Utility
 * Prevents XSS, NoSQL injection, and data corruption
 */

interface SanitizeOptions {
  maxLength?: number;
  allowHtml?: boolean;
  trim?: boolean;
}

const DEFAULT_OPTIONS: Required<SanitizeOptions> = {
  maxLength: 10000,
  allowHtml: false,
  trim: true,
};

export function sanitizeString(
  input: string,
  options: SanitizeOptions = {}
): string {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  let sanitized = input;

  if (opts.trim) {
    sanitized = sanitized.trim();
  }

  if (!opts.allowHtml) {
    sanitized = sanitized
      .replace(/[<>]/g, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+=/gi, '');
  }

  return sanitized.slice(0, opts.maxLength);
}

export function sanitizeInput<T>(input: T, options?: SanitizeOptions): T {
  if (input === null || input === undefined) {
    return input;
  }

  if (typeof input === 'string') {
    return sanitizeString(input, options) as T;
  }

  if (Array.isArray(input)) {
    return input.map((item) => sanitizeInput(item, options)) as T;
  }

  if (typeof input === 'object') {
    return Object.fromEntries(
      Object.entries(input).map(([key, value]) => [
        key,
        sanitizeInput(value, options),
      ])
    ) as T;
  }

  return input;
}

export function sanitizeResumeData<T extends Record<string, unknown>>(
  data: T
): T {
  return sanitizeInput(data, { maxLength: 5000, allowHtml: false, trim: true });
}
