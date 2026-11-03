/**
 * Test double for groq-sdk. tests/setup.ts registers it with mock.module before any test
 * file imports the app, so no test can reach the real Groq API.
 * https://bun.com/docs/test/mocks
 *
 * With nothing queued, every call rejects: a test that forgets to queue a reply exercises
 * the failure path instead of silently calling the network.
 */
import { mock } from 'bun:test';

type ChatRequest = {
  messages: { role: string; content: string }[];
  model: string;
};

async function unqueued(): Promise<unknown> {
  throw new Error(
    'groq-sdk is mocked in tests: queue a reply with replyWith()'
  );
}

export const groqCreate =
  mock<(req: ChatRequest) => Promise<unknown>>(unqueued);

/** Queue the text the model returns on the next call. */
export function replyWith(content: string): void {
  groqCreate.mockResolvedValueOnce({ choices: [{ message: { content } }] });
}

/** Queue a failure for the next call, the way the SDK reports an HTTP error. */
export function failWith(message = '401 Invalid API Key'): void {
  groqCreate.mockRejectedValueOnce(new Error(message));
}

/** Reset call history and any queued replies between tests. */
export function resetGroq(): void {
  groqCreate.mockReset();
  groqCreate.mockImplementation(unqueued);
}

/** The prompt text of the most recent call. */
export function lastPrompt(): string {
  const call = groqCreate.mock.calls[groqCreate.mock.calls.length - 1];
  if (!call) throw new Error('groq-sdk was not called');
  return call[0].messages.map((m: { content: string }) => m.content).join('\n');
}

export class MockGroq {
  chat = { completions: { create: groqCreate } };
}
