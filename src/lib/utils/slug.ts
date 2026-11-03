/**
 * First word of a display name, lowercased and reduced to [a-z0-9], used as the
 * readable part of a resume slug (see nextResumeSlug in src/lib/resume/ownership.ts).
 */
export function generateUserSlug(name: string): string {
  const words = name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter(Boolean);

  return words[0] || 'user';
}
