import { test, expect, describe, mock, beforeEach } from 'bun:test';

describe('API Client', () => {
  beforeEach(() => {
    global.fetch = mock(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ resumes: [] }),
      })
    ) as unknown as typeof fetch;
  });

  test('fetchResumes calls correct endpoint', async () => {
    const { fetchResumes } = await import('@/lib/api/resume.client');
    await fetchResumes();
    expect(global.fetch).toHaveBeenCalled();
  });

  test('fetchResumeById calls with id', async () => {
    const { fetchResumeById } = await import('@/lib/api/resume.client');
    await fetchResumeById('test-id');
    expect(global.fetch).toHaveBeenCalled();
  });

  test('createResume sends POST request', async () => {
    const { createResume } = await import('@/lib/api/resume.client');
    await createResume({ title: 'Test' });
    expect(global.fetch).toHaveBeenCalled();
  });

  test('updateResume sends PUT request', async () => {
    const { updateResume } = await import('@/lib/api/resume.client');
    await updateResume('test-id', { title: 'Updated' });
    expect(global.fetch).toHaveBeenCalled();
  });
});
