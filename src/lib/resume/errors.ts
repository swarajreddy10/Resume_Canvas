import mongoose from 'mongoose';
import { NextResponse } from 'next/server';

/**
 * Map a failed write to a response: schema violations are the client's fault (400, with
 * the failing paths but no internals); anything else is logged and returned as a generic 500.
 */
export function mapWriteError(error: unknown, message: string): NextResponse {
  if (error instanceof mongoose.Error.ValidationError) {
    return NextResponse.json(
      { error: 'Validation failed', fields: Object.keys(error.errors) },
      { status: 400 }
    );
  }
  if (error instanceof mongoose.Error.CastError) {
    return NextResponse.json({ error: 'Validation failed', fields: [error.path] }, { status: 400 });
  }
  console.error(`${message}:`, error);
  return NextResponse.json({ error: message }, { status: 500 });
}
