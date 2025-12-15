/**
 * Centralized Error Handling Utility
 * Provides consistent error handling and user feedback
 */

import { toast } from 'sonner';

export interface ApiError {
  message: string;
  status?: number;
  details?: unknown;
}

export class AppError extends Error {
  constructor(
    message: string,
    public status: number = 500,
    public details?: unknown
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export async function handleApiResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: 'An unexpected error occurred',
    }));

    throw new AppError(
      error.message || error.error || 'Request failed',
      response.status,
      error
    );
  }

  return response.json();
}

export function handleError(error: unknown, showToast = true): ApiError {
  const apiError: ApiError = {
    message: 'An unexpected error occurred',
    status: 500,
  };

  if (error instanceof AppError) {
    apiError.message = error.message;
    apiError.status = error.status;
    apiError.details = error.details;
  } else if (error instanceof Error) {
    apiError.message = error.message;
  }

  if (showToast) {
    toast.error(apiError.message);
  }

  console.error('Error:', error);
  return apiError;
}

export function withErrorHandling<
  T extends (...args: never[]) => Promise<unknown>,
>(fn: T): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await fn(...args);
    } catch (error) {
      handleError(error);
      throw error;
    }
  }) as T;
}
