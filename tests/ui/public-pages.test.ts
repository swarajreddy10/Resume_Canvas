/**
 * Server-HTML checks for the public pages, run against a production server:
 *
 *   bun run build && bun run start -p 3310
 *   RC_BASE_URL=http://127.0.0.1:3310 bun test tests/ui
 *
 * Each check reads the HTML the server sends, before any JavaScript runs, because that is
 * what paints first (LCP) and what crawlers and no-JS clients see.
 */
import { describe, expect, test } from 'bun:test';

const BASE = process.env.RC_BASE_URL;
const SITE = 'https://resumecanvas.vercel.app';

async function get(path: string) {
  const res = await fetch(`${BASE}${path}`, { redirect: 'manual' });
  return {
    status: res.status,
    type: res.headers.get('content-type') ?? '',
    body: await res.text(),
  };
}

// The hero is everything before the first section that follows it; nothing in it may be
// sent at opacity 0, or the LCP element waits for hydration to become visible.
function heroHtml(html: string) {
  const start = html.indexOf('<h1');
  const end = html.indexOf('</section>', start);
  expect(start).toBeGreaterThan(-1);
  expect(end).toBeGreaterThan(start);
  return html.slice(html.lastIndexOf('<section', start), end);
}

describe.skipIf(!BASE)('public pages (server HTML)', () => {
  test('landing renders the hero heading and paragraph visibly', async () => {
    const { status, body } = await get('/');
    expect(status).toBe(200);
    const hero = heroHtml(body);
    expect(hero).toContain('A resume builder');
    expect(hero).toContain('Write with AI help');
    expect(hero).not.toMatch(/opacity:\s*0(?![.\d])/);
    expect(body).toMatch(/<main[\s>]/);
  });

  test('landing metadata: canonical, Open Graph, one theme colour, zoom allowed', async () => {
    const { body } = await get('/');
    const head = body.slice(0, body.indexOf('</head>'));
    expect(head).toContain(`<link rel="canonical" href="${SITE}"`);
    expect(head).toContain('<meta property="og:title"');
    expect(head).toContain(`<meta property="og:url" content="${SITE}"`);
    expect(head).toContain('<meta name="twitter:card"');
    expect(head.match(/name="theme-color"/g)?.length).toBe(1);
    expect(head.match(/rel="manifest"/g)?.length).toBe(1);
    expect(head).not.toContain('maximum-scale');
  });

  test('manifest theme_color matches the page theme-color', async () => {
    const { body } = await get('/');
    const themeColor = body.match(
      /<meta name="theme-color" content="([^"]+)"/
    )?.[1];
    const manifest = JSON.parse((await get('/manifest.json')).body);
    expect(themeColor).toBeDefined();
    expect(manifest.theme_color).toBe(themeColor);
  });

  test('sign-in sends the form in server HTML with its own title', async () => {
    const { status, body } = await get('/auth/signin');
    expect(status).toBe(200);
    expect(body).toMatch(/<input[^>]*id="email"/);
    expect(body).toMatch(/<input[^>]*id="password"/);
    expect(body).toContain('<title>Sign in | ResumeCanvas</title>');
    expect(body).toContain(`<link rel="canonical" href="${SITE}/auth/signin"`);
    expect(body).not.toContain('Loading...');
    expect(body).toMatch(/<main[\s>]/);
  });

  test('robots.txt and sitemap.xml are served', async () => {
    const robots = await get('/robots.txt');
    expect(robots.status).toBe(200);
    expect(robots.body).toContain(`Sitemap: ${SITE}/sitemap.xml`);
    const sitemap = await get('/sitemap.xml');
    expect(sitemap.status).toBe(200);
    expect(sitemap.body).toContain(`<loc>${SITE}</loc>`);
    expect(sitemap.body).toContain(`<loc>${SITE}/auth/signin</loc>`);
  });

  test('sw.js is a self-unregistering no-op with no fetch handler', async () => {
    const sw = await get('/sw.js');
    expect(sw.status).toBe(200);
    expect(sw.body).toContain('registration.unregister()');
    expect(sw.body).not.toMatch(/addEventListener\(\s*['"]fetch['"]/);
  });

  test('pages no longer register a service worker', async () => {
    for (const path of ['/', '/auth/signin']) {
      const { body } = await get(path);
      expect(body).not.toContain('serviceWorker.register');
    }
  });
});
