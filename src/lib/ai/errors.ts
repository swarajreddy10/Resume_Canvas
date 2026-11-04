import { NextResponse } from 'next/server';
import { logger } from '@/lib/utils/logger';

/**
 * The model call failed: Groq returned an error after the SDK's own retries, or its reply
 * was empty, cut off at the token budget, or not the shape the feature needs. It is never
 * answered with a canned result.
 */
export class AIServiceError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = 'AIServiceError';
  }
}

/** What the UI shows when the model fails. */
export const AI_UNAVAILABLE =
  'The AI service did not respond. Please try again in a moment.';

/**
 * Map a failed AI request to a response, and log it: a model failure is the upstream's
 * (502, https://www.rfc-editor.org/rfc/rfc9110#name-502-bad-gateway); anything else is a
 * 500 with the route's own message.
 */
export function aiErrorResponse(error: unknown, message: string): NextResponse {
  logger.error(message, { error });
  if (error instanceof AIServiceError) {
    return NextResponse.json({ error: AI_UNAVAILABLE }, { status: 502 });
  }
  return NextResponse.json({ error: message }, { status: 500 });
}
