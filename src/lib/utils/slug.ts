export function generateSlug(title: string): string {
  // Extract first name from title like "John Doe's Resume" -> "john-resume"
  const firstName = title
    .split(' ')[0]
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
  const suffix = title.toLowerCase().includes('cv') ? 'cv' : 'resume';

  return firstName ? `${firstName}-${suffix}` : 'resume';
}
