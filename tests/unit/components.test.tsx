/**
 * Client components rendered in happy-dom with Testing Library
 * (https://bun.com/docs/guides/test/testing-library). Bun 1.4.3 has no per-file test
 * environment, so the DOM is registered for this file only and removed after it, and
 * Testing Library is imported after the registration. Queries come from render(), not
 * `screen`, which binds to whichever document existed when Testing Library first loaded.
 */
import { afterAll, afterEach, describe, expect, mock, test } from 'bun:test';
import { GlobalRegistrator } from '@happy-dom/global-registrator';

GlobalRegistrator.register({ url: 'http://localhost:3000' });
const { render, fireEvent, waitFor, cleanup } =
  await import('@testing-library/react');
const { default: PerformanceAnalytics } =
  await import('@/components/analytics/PerformanceAnalytics');
const { default: ResumeAnalytics } =
  await import('@/components/resume/ResumeAnalytics');
const { default: ShareButton } =
  await import('@/components/resume/ShareButton');

const domFetch = globalThis.fetch;
afterEach(() => {
  cleanup();
  globalThis.fetch = domFetch;
});
afterAll(() => GlobalRegistrator.unregister());

/** Every fetch answers with `body`; returns the mock to inspect the calls. */
function respondWith(body: unknown, ok = true) {
  const fetchMock = mock<
    (input: string, init?: RequestInit) => Promise<Response>
  >(async () => ({ ok, json: async () => body }) as Response);
  globalThis.fetch = fetchMock as unknown as typeof fetch;
  return fetchMock;
}

describe('PerformanceAnalytics', () => {
  test('shows the measured figures and nothing the app does not measure', async () => {
    const fetchMock = respondWith({
      totalViews: 1234,
      totalShares: 2,
      avgAtsScore: 81,
      topPerformingResume: { title: 'Top', views: 9, atsScore: 90 },
    });
    const view = render(<PerformanceAnalytics />);
    await view.findByText('Top');
    const text = view.container.textContent;

    expect(fetchMock).toHaveBeenCalledWith('/api/analytics/performance');
    expect(text).toContain('Total Views1,234');
    expect(text).toContain('Shares2');
    expect(text).toContain('Avg ATS Score81/100');
    expect(text).toContain('ATS: 90/100');
    expect(text).not.toContain('Downloads');
    expect(text).not.toContain('from last month');
  });

  test('a resume never scored shows "Not scored", not an assumed score', async () => {
    respondWith({
      totalViews: 2,
      totalShares: 0,
      avgAtsScore: null,
      topPerformingResume: { title: 'Fresh', views: 2, atsScore: null },
    });
    const view = render(<PerformanceAnalytics />);
    await view.findByText('Fresh');

    expect(view.container.textContent).toContain('Avg ATS ScoreNot scored');
    expect(view.getByText('ATS: not scored')).toBeTruthy();
  });

  test('a failed request shows no figures', async () => {
    respondWith({ error: 'Failed to fetch analytics' }, false);
    const view = render(<PerformanceAnalytics />);
    await view.findByText('No analytics data available');
  });
});

describe('ResumeAnalytics', () => {
  test('a labelled region with the stored view count and no download figure', () => {
    const view = render(<ResumeAnalytics viewCount={3} isPublic />);
    const region = view.getByRole('region', { name: 'Resume Analytics' });

    expect(region.textContent).toContain('Total Views3');
    expect(region.textContent).toContain('Public');
    expect(region.textContent).not.toContain('Downloads');
  });
});

describe('ShareButton', () => {
  test('the Make Public switch is named, and turning it on publishes the resume', async () => {
    const fetchMock = respondWith({ resume: {} });
    const onTogglePublic = mock<(isPublic: boolean) => void>(() => {});
    const view = render(
      <ShareButton
        resumeId="r1"
        isPublic={false}
        onTogglePublic={onTogglePublic}
      />
    );

    fireEvent.click(view.getByRole('button', { name: 'Share' }));
    fireEvent.click(await view.findByRole('switch', { name: 'Make Public' }));

    await waitFor(() => expect(onTogglePublic).toHaveBeenCalledWith(true));
    expect(fetchMock).toHaveBeenCalledWith('/api/resumes/r1', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isPublic: true }),
    });
  });
});
