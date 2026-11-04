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
const { default: KeywordOptimizer } =
  await import('@/components/ai/KeywordOptimizer');
const { default: ResumeReviewer } =
  await import('@/components/ai/ResumeReviewer');
const { default: CoverLetterGenerator } =
  await import('@/components/ai/CoverLetterGenerator');
const { default: ATSOptimizer } =
  await import('@/components/resume/ATSOptimizer');
const { default: ExperienceForm } =
  await import('@/components/forms/ExperienceForm');
const { AI_UNAVAILABLE } = await import('@/lib/ai/errors');

const domFetch = globalThis.fetch;
afterEach(() => {
  cleanup();
  // Toasts are appended to the body directly, outside what cleanup() unmounts.
  document.body.innerHTML = '';
  globalThis.fetch = domFetch;
});
afterAll(() => GlobalRegistrator.unregister());

/** Every fetch answers with `body`; returns the mock to inspect the calls. */
function respondWith(body: unknown, ok = true, status = ok ? 200 : 502) {
  const fetchMock = mock<
    (input: string, init?: RequestInit) => Promise<Response>
  >(async () => ({ ok, status, json: async () => body }) as Response);
  globalThis.fetch = fetchMock as unknown as typeof fetch;
  return fetchMock;
}

/** A model failure, as every AI route reports it. */
const modelFailure = () =>
  respondWith(
    { error: 'The AI service did not respond. Please try again in a moment.' },
    false
  );

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

const builderResume = {
  personalInfo: {
    name: 'Zoë Ñúñez',
    email: 'zoe@example.com',
    summary: 'Backend engineer',
  },
  experiences: [
    {
      company: 'Café Ünïcode',
      position: 'Engineer',
      location: '',
      startDate: '2024',
      endDate: 'Present',
      description: 'Built APIs',
      bullets: ['Cut a batch from 30 to 4 minutes'],
    },
  ],
  education: [],
  skills: ['Go', 'PostgreSQL'],
};

// Each AI feature, and how a user starts it.
const aiFeatures = [
  {
    name: 'KeywordOptimizer',
    start: () => {
      const view = render(<KeywordOptimizer resumeData={builderResume} />);
      fireEvent.change(view.getByPlaceholderText(/Paste the job description/), {
        target: { value: 'Needs PostgreSQL' },
      });
      fireEvent.click(view.getByRole('button', { name: 'Analyze Keywords' }));
      return view;
    },
  },
  {
    name: 'ResumeReviewer',
    start: () => {
      const view = render(<ResumeReviewer resumeData={builderResume} />);
      fireEvent.click(
        view.getByRole('button', { name: 'Get Professional AI Review' })
      );
      return view;
    },
  },
  {
    name: 'CoverLetterGenerator',
    start: () => {
      const view = render(
        <CoverLetterGenerator resumeData={{ _id: 'r1', ...builderResume }} />
      );
      fireEvent.change(view.getByPlaceholderText('Software Engineer'), {
        target: { value: 'Engineer' },
      });
      fireEvent.change(view.getByPlaceholderText('Google'), {
        target: { value: 'Acme' },
      });
      fireEvent.click(
        view.getByRole('button', { name: 'Generate Cover Letter' })
      );
      return view;
    },
  },
  {
    name: 'ATSOptimizer',
    start: () => {
      const view = render(<ATSOptimizer resumeData={builderResume} />);
      fireEvent.click(view.getByRole('button', { name: /Analyze Resume/ }));
      return view;
    },
  },
  {
    name: 'ExperienceForm',
    start: () => {
      const view = render(
        <ExperienceForm
          initialData={{ experiences: builderResume.experiences }}
          onSubmit={() => {}}
        />
      );
      fireEvent.click(view.getByRole('button', { name: /AI Generate/ }));
      return view;
    },
  },
];

/**
 * Wait until no AI request is in flight (every loading label reads "Analyzing" or
 * "Generating..."), so the component's last state update lands inside the test rather
 * than after the DOM is unregistered.
 */
const settled = (view: ReturnType<typeof render>) =>
  waitFor(() =>
    expect(view.baseElement.textContent).not.toMatch(
      /Analyzing|Generating\.\.\./
    )
  );

describe('AI features', () => {
  test.each(aiFeatures)(
    '$name tells the user when the model fails, and shows no result',
    async ({ start }) => {
      modelFailure();
      const view = start();
      await view.findByText(AI_UNAVAILABLE);
      await settled(view);
      expect(view.baseElement.textContent).not.toContain('undefined');
    }
  );

  test('ATSOptimizer shows the score the model returned', async () => {
    respondWith({
      atsScore: 72,
      suggestions: ['Add metrics'],
      keywords: ['AWS'],
    });
    const view = aiFeatures[3].start();
    await view.findByText('72/100');
    await settled(view);
    expect(view.getByText('Add metrics')).toBeTruthy();
  });

  test('ExperienceForm fills in the bullets the model returned', async () => {
    respondWith({ bulletPoints: ['Led A', 'Built B'] });
    const view = aiFeatures[4].start();
    await waitFor(() => expect(view.getByDisplayValue('Led A')).toBeTruthy());
    await settled(view);
    expect(view.getByDisplayValue('Built B')).toBeTruthy();
  });
});
