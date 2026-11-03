/**
 * The public pages' server HTML, read without running any JavaScript: it is what paints
 * first (LCP) and what crawlers and no-JS clients see. Runs against the same production
 * server as the browser specs (config/playwright.config.ts).
 */
import { test, expect, type APIRequestContext } from '@playwright/test';

const SITE = 'https://resumecanvas.vercel.app';

async function get(request: APIRequestContext, path: string) {
  const res = await request.get(path, { maxRedirects: 0 });
  return { status: res.status(), body: await res.text() };
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

test.describe('public pages (server HTML)', () => {
  test('landing renders the hero heading and paragraph visibly', async ({
    request,
  }) => {
    const { status, body } = await get(request, '/');
    expect(status).toBe(200);
    const hero = heroHtml(body);
    expect(hero).toContain('A resume builder');
    expect(hero).toContain('Write with AI help');
    expect(hero).not.toMatch(/opacity:\s*0(?![.\d])/);
    expect(body).toMatch(/<main[\s>]/);
  });

  test('landing metadata: canonical, Open Graph, one theme colour, zoom allowed', async ({
    request,
  }) => {
    const { body } = await get(request, '/');
    const head = body.slice(0, body.indexOf('</head>'));
    expect(head).toContain(`<link rel="canonical" href="${SITE}"`);
    expect(head).toContain('<meta property="og:title"');
    expect(head).toContain(`<meta property="og:url" content="${SITE}"`);
    expect(head).toContain('<meta name="twitter:card"');
    expect(head.match(/name="theme-color"/g)?.length).toBe(1);
    expect(head.match(/rel="manifest"/g)?.length).toBe(1);
    expect(head).not.toContain('maximum-scale');
  });

  test('manifest theme_color matches the page theme-color', async ({
    request,
  }) => {
    const { body } = await get(request, '/');
    const themeColor = body.match(
      /<meta name="theme-color" content="([^"]+)"/
    )?.[1];
    const manifest = JSON.parse((await get(request, '/manifest.json')).body);
    expect(themeColor).toBeDefined();
    expect(manifest.theme_color).toBe(themeColor);
  });

  test('sign-in sends the form in server HTML with its own title', async ({
    request,
  }) => {
    const { status, body } = await get(request, '/auth/signin');
    expect(status).toBe(200);
    expect(body).toMatch(/<input[^>]*id="email"/);
    expect(body).toMatch(/<input[^>]*id="password"/);
    expect(body).toContain('<title>Sign in | ResumeCanvas</title>');
    expect(body).toContain(`<link rel="canonical" href="${SITE}/auth/signin"`);
    expect(body).not.toContain('Loading...');
    expect(body).toMatch(/<main[\s>]/);
  });

  test('robots.txt and sitemap.xml are served', async ({ request }) => {
    const robots = await get(request, '/robots.txt');
    expect(robots.status).toBe(200);
    expect(robots.body).toContain(`Sitemap: ${SITE}/sitemap.xml`);
    const sitemap = await get(request, '/sitemap.xml');
    expect(sitemap.status).toBe(200);
    expect(sitemap.body).toContain(`<loc>${SITE}</loc>`);
    expect(sitemap.body).toContain(`<loc>${SITE}/auth/signin</loc>`);
  });

  test('sw.js is a self-unregistering no-op with no fetch handler', async ({
    request,
  }) => {
    const sw = await get(request, '/sw.js');
    expect(sw.status).toBe(200);
    expect(sw.body).toContain('registration.unregister()');
    expect(sw.body).not.toMatch(/addEventListener\(\s*['"]fetch['"]/);
  });

  test('pages no longer register a service worker', async ({ request }) => {
    for (const path of ['/', '/auth/signin']) {
      const { body } = await get(request, path);
      expect(body).not.toContain('serviceWorker.register');
    }
  });
});
