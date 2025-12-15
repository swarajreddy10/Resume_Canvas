/**
 * Middleware Composition Utility
 * Allows composing multiple middleware functions
 */

import { NextRequest, NextResponse } from 'next/server';

type Handler = (
  request: NextRequest,
  context?: unknown
) => Promise<NextResponse>;
type Middleware = (handler: Handler) => Handler;

export function compose(...middlewares: Middleware[]) {
  return function (handler: Handler) {
    return middlewares.reduceRight(
      (acc, middleware) => middleware(acc),
      handler
    );
  };
}
