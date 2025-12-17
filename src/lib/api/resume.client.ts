import { z } from 'zod';

export const ResumeListSchema = z.object({
  resumes: z.array(z.any()),
});

export const ResumeSchema = z.object({
  resume: z.any(),
});

export async function fetchResumes() {
  const res = await fetch('/api/resumes');
  if (!res.ok) throw new Error('Failed to load resumes');
  const data = await res.json();
  return ResumeListSchema.parse(data);
}

export async function fetchResumeById(id: string) {
  const res = await fetch(`/api/resumes/${id}`);
  if (!res.ok) throw new Error('Failed to load resume');
  const data = await res.json();
  return ResumeSchema.parse(data);
}

export async function createResume(data: unknown) {
  const res = await fetch('/api/resumes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create resume');
  return ResumeSchema.parse(await res.json());
}

export async function updateResume(id: string, data: unknown) {
  const res = await fetch(`/api/resumes/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update resume');
  return ResumeSchema.parse(await res.json());
}
