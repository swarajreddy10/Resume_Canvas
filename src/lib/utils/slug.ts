/**
 * Secure Slug Generation Utility
 * Generates unique, unpredictable slugs
 */

import { randomBytes } from 'crypto';

export function generateSlug(title: string): string {
  const sanitized = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 30);

  const random = randomBytes(4).toString('hex');
  const timestamp = Date.now().toString(36).slice(-4);

  return sanitized
    ? `${sanitized}-${timestamp}-${random}`
    : `resume-${timestamp}-${random}`;
}

export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9-]+$/.test(slug) && slug.length >= 10 && slug.length <= 100;
}
