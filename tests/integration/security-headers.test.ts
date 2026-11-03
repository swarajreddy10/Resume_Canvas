/**
 * The headers next.config.ts sends on every route. The CSP follows the Next.js
 * "Without Nonces" variant, so pages can stay statically rendered.
 * https://nextjs.org/docs/app/guides/content-security-policy#without-nonces
 */
import { describe, expect, test } from 'bun:test';
import nextConfig from '../../next.config';

async function headersForAllRoutes(): Promise<Map<string, string>> {
  const rules = (await nextConfig.headers?.()) ?? [];
  const all = rules.find((rule) => rule.source === '/(.*)');
  return new Map(all?.headers.map((h) => [h.key, h.value]) ?? []);
}

function directives(csp: string): Map<string, string> {
  return new Map(
    csp
      .split(';')
      .map((d) => d.trim())
      .filter(Boolean)
      .map((d) => {
        const [name, ...values] = d.split(/\s+/);
        return [name, values.join(' ')];
      })
  );
}

describe('Content-Security-Policy', () => {
  test('is sent on every route and locks down what the app does not use', async () => {
    const csp = (await headersForAllRoutes()).get('Content-Security-Policy');
    expect(csp).toBeString();
    const d = directives(csp!);
    expect(d.get('default-src')).toBe("'self'");
    expect(d.get('object-src')).toBe("'none'");
    expect(d.get('base-uri')).toBe("'self'");
    expect(d.get('form-action')).toBe("'self'");
    expect(d.get('frame-ancestors')).toBe("'none'");
    expect(d.has('upgrade-insecure-requests')).toBe(true);
  });

  test('allows no third-party script origin outside development', async () => {
    const csp = (await headersForAllRoutes()).get('Content-Security-Policy')!;
    const scriptSrc = directives(csp).get('script-src')!;
    expect(scriptSrc).not.toContain('http');
    expect(scriptSrc).not.toContain("'unsafe-eval'");
  });

  test('is a single line, as an HTTP header value must be', async () => {
    const csp = (await headersForAllRoutes()).get('Content-Security-Policy')!;
    expect(csp).not.toMatch(/[\r\n]/);
  });
});

describe('next.config.ts', () => {
  test('has no webpack hook (Turbopack builds ignore it)', () => {
    expect(nextConfig.webpack).toBeUndefined();
  });
});
