/**
 * The browser API client: the request it sends and how it treats the response.
 * fetch is replaced per test and restored afterwards.
 */
import { afterEach, beforeEach, describe, expect, mock, test } from 'bun:test';
import {
  createResume,
  fetchResumeById,
  fetchResumes,
  updateResume,
} from '@/lib/api/resume.client';

const realFetch = globalThis.fetch;
let fetchMock: ReturnType<typeof mock>;

function respond(status: number, body: unknown) {
  fetchMock = mock(async () => Response.json(body, { status }));
  globalThis.fetch = fetchMock as unknown as typeof fetch;
}

function sent(): { url: string; init?: RequestInit } {
  expect(fetchMock).toHaveBeenCalledTimes(1);
  const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit?];
  return { url, init };
}

beforeEach(() => respond(200, {}));

afterEach(() => {
  globalThis.fetch = realFetch;
});

describe('resume API client', () => {
  test('fetchResumes GETs /api/resumes and returns the parsed list', async () => {
    respond(200, { resumes: [{ _id: 'r1' }] });

    expect(await fetchResumes()).toEqual({ resumes: [{ _id: 'r1' }] });
    const { url, init } = sent();
    expect(url).toBe('/api/resumes');
    expect(init?.method ?? 'GET').toBe('GET');
  });

  test('fetchResumes rejects a response without a resumes array', async () => {
    respond(200, { items: [] });

    await expect(fetchResumes()).rejects.toThrow();
  });

  test('fetchResumeById GETs the resume by id', async () => {
    respond(200, { resume: { _id: 'abc' } });

    expect(await fetchResumeById('abc')).toEqual({ resume: { _id: 'abc' } });
    expect(sent().url).toBe('/api/resumes/abc');
  });

  test('createResume POSTs the body as JSON', async () => {
    respond(201, { resume: { _id: 'new', title: 'Résumé 🚀' } });

    const result = await createResume({ title: 'Résumé 🚀' });

    expect(result.resume).toEqual({ _id: 'new', title: 'Résumé 🚀' });
    const { url, init } = sent();
    expect(url).toBe('/api/resumes');
    expect(init?.method).toBe('POST');
    expect(init?.headers).toEqual({ 'Content-Type': 'application/json' });
    expect(JSON.parse(init?.body as string)).toEqual({ title: 'Résumé 🚀' });
  });

  test('updateResume PUTs the body to the resume URL', async () => {
    respond(200, { resume: { _id: 'abc', title: 'Updated' } });

    await updateResume('abc', { title: 'Updated' });

    const { url, init } = sent();
    expect(url).toBe('/api/resumes/abc');
    expect(init?.method).toBe('PUT');
    expect(JSON.parse(init?.body as string)).toEqual({ title: 'Updated' });
  });

  test.each([
    ['fetchResumes', () => fetchResumes(), 'Failed to load resumes'],
    ['fetchResumeById', () => fetchResumeById('abc'), 'Failed to load resume'],
    ['createResume', () => createResume({}), 'Failed to create resume'],
    ['updateResume', () => updateResume('abc', {}), 'Failed to update resume'],
  ])('%s throws on a non-2xx response', async (_name, call, message) => {
    respond(500, { error: 'boom' });

    await expect(call()).rejects.toThrow(message);
  });

  test('a network failure propagates', async () => {
    fetchMock = mock(async () => {
      throw new TypeError('fetch failed');
    });
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    await expect(fetchResumes()).rejects.toThrow('fetch failed');
  });
});
