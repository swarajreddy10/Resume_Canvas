/**
 * POST to an AI route and return its JSON. A failed route throws with the route's own
 * message (for a model failure, AI_UNAVAILABLE from src/lib/ai/errors.ts), so every AI
 * feature can show the user why nothing came back instead of failing silently.
 */
export async function postAI<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok || data === null) {
    const message =
      data && typeof data.error === 'string' ? data.error : undefined;
    throw new Error(message ?? `Request failed (${res.status})`);
  }
  return data as T;
}
