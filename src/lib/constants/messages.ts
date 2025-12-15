/**
 * Standardized Error Messages
 * Single source of truth for all user-facing messages
 */

export const errorMessages = {
  auth: {
    unauthorized: 'Authentication required. Please sign in.',
    forbidden: 'You do not have permission to access this resource.',
    sessionExpired: 'Your session has expired. Please sign in again.',
  },
  validation: {
    required: (field: string) => `${field} is required.`,
    invalid: (field: string) => `${field} is invalid.`,
    tooShort: (field: string, min: number) =>
      `${field} must be at least ${min} characters.`,
    tooLong: (field: string, max: number) =>
      `${field} must be less than ${max} characters.`,
    invalidEmail: 'Please enter a valid email address.',
    invalidUrl: 'Please enter a valid URL.',
  },
  rateLimit: {
    exceeded: 'Too many requests. Please try again later.',
    aiLimit: 'AI generation limit reached. Please upgrade your plan.',
  },
  resume: {
    notFound: 'Resume not found.',
    createFailed: 'Failed to create resume. Please try again.',
    updateFailed: 'Failed to update resume. Please try again.',
    deleteFailed: 'Failed to delete resume. Please try again.',
    limitReached: 'Resume limit reached. Please upgrade your plan.',
  },
  pdf: {
    generationFailed: 'Failed to generate PDF. Please try again.',
    downloadFailed: 'Failed to download PDF. Please try again.',
  },
  ai: {
    generationFailed: 'AI generation failed. Please try again.',
    invalidInput: 'Invalid input for AI generation.',
  },
  general: {
    serverError: 'An unexpected error occurred. Please try again.',
    networkError: 'Network error. Please check your connection.',
    notFound: 'Resource not found.',
  },
} as const;

export const successMessages = {
  resume: {
    created: 'Resume created successfully!',
    updated: 'Resume updated successfully!',
    deleted: 'Resume deleted successfully!',
    cloned: 'Resume cloned successfully!',
  },
  pdf: {
    downloaded: 'PDF downloaded successfully!',
  },
  application: {
    created: 'Application tracked successfully!',
    updated: 'Application updated successfully!',
  },
  auth: {
    signedIn: 'Welcome back!',
    signedOut: 'Signed out successfully.',
  },
} as const;
