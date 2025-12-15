/**
 * Request Validation Middleware
 * Validates request body against Zod schemas
 */

import { NextRequest, NextResponse } from 'next/server';
import { ZodSchema, ZodError } from 'zod';
import { logger } from '@/lib/utils/logger';

interface RequestWithValidation<T> extends NextRequest {
  validatedData?: T;
}

export function withValidation<T>(schema: ZodSchema<T>) {
  return function (
    handler: (
      request: RequestWithValidation<T>,
      context?: unknown
    ) => Promise<NextResponse>
  ) {
    return async (request: NextRequest, context?: unknown) => {
      try {
        const body = await request.json();
        const validated = schema.parse(body);

        // Attach validated data to request
        (request as RequestWithValidation<T>).validatedData = validated;

        return handler(request as RequestWithValidation<T>, context);
      } catch (error) {
        if (error instanceof ZodError) {
          logger.warn('Validation failed', { errors: error.issues });

          return NextResponse.json(
            {
              error: 'Validation failed',
              details: error.issues.map((err) => ({
                path: err.path.join('.'),
                message: err.message,
              })),
            },
            { status: 400 }
          );
        }

        logger.error('Validation middleware error', { error });
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
      }
    };
  };
}
