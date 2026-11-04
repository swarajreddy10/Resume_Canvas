/**
 * The browser helper every AI feature calls: what it sends, and that a failed route
 * surfaces as an error carrying the route's own message. fetch is replaced per test.
 */
import { afterEach, describe, expect, mock, test } from 'bun:test';
import { postAI } from '@/lib/api/ai.client';

const realFetch = globalThis.fetch;
afterEach(() => {
  globalThis.fetch = realFetch;
});

function respond(response: Response) {
  const fetchMock = mock<
    (url: string, init?: RequestInit) => Promise<Response>
  >(async () => response);
  globalThis.fetch = fetchMock as unknown as typeof fetch;
  return fetchMock;
}

describe('postAI', () => {
  test('posts the body as JSON and returns the parsed reply', async () => {
    const fetchMock = respond(Response.json({ bulletPoints: ['Led A'] }));
    expect(
      await postAI<{ bulletPoints: string[] }>('/api/ai/generate-bullets', {
        jobTitle: 'Ingénieure',
      })
    ).toEqual({ bulletPoints: ['Led A'] });
    expect(fetchMock).toHaveBeenCalledWith('/api/ai/generate-bullets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{"jobTitle":"Ingénieure"}',
    });
  });

  test("a failed route throws with the route's message", async () => {
    respond(
      Response.json(
        {
          error:
            'The AI service did not respond. Please try again in a moment.',
        },
        { status: 502 }
      )
    );
    await expect(postAI('/api/ai/optimize', {})).rejects.toThrow(
      'The AI service did not respond. Please try again in a moment.'
    );
  });

  test('a success without a JSON body throws instead of returning nothing', async () => {
    respond(new Response('<html>Login</html>', { status: 200 }));
    await expect(postAI('/api/ai/optimize', {})).rejects.toThrow(
      'Request failed (200)'
    );
  });

  test('a failure without a JSON body throws with the status', async () => {
    respond(new Response('<html>Bad Gateway</html>', { status: 504 }));
    await expect(postAI('/api/ai/optimize', {})).rejects.toThrow(
      'Request failed (504)'
    );
  });
});
