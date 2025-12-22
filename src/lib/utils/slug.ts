/**
 * Sequential Slug Generation
 * Format: firstname/number
 */

export function generateUserSlug(name: string): string {
  const words = name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter(Boolean);

  return words[0] || 'user';
}

export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9-/]+$/.test(slug) && slug.length >= 3 && slug.length <= 50;
}
