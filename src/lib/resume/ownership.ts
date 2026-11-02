import { createHash } from 'crypto';
import mongoose from 'mongoose';
import { UserCounter } from '@/lib/db/models/UserCounter';
import { generateUserSlug } from '@/lib/utils/slug';

/** Filter for one resume owned by `userEmail`; null when the id cannot exist. */
export function ownedResume(id: string, userEmail: string) {
  return mongoose.isValidObjectId(id) ? { _id: id, userEmail } : null;
}

/**
 * The fields a user may set on their own resume. Everything else (owner, slug,
 * counters, timestamps) is set only by the server.
 */
const EDITABLE_FIELDS = [
  'title',
  'personalInfo',
  'experience',
  'education',
  'skills',
  'projects',
  'certifications',
  'templateId',
  'isPublic',
] as const;

export function editableResumeFields(body: unknown): Record<string, unknown> {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return {};
  const source = body as Record<string, unknown>;
  return Object.fromEntries(
    EDITABLE_FIELDS.filter((key) => key in source).map((key) => [key, source[key]])
  );
}

/**
 * Public slug for a user's next resume: `<first-name>-<owner tag>/<count>`. The owner
 * tag (six hex characters of a hash of the email) keeps two users with the same first
 * name apart; the counter is per owner.
 */
export async function nextResumeSlug(userEmail: string, displayName: string): Promise<string> {
  const counter = await UserCounter.findOneAndUpdate(
    { userEmail },
    { $inc: { resumeCount: 1 } },
    { upsert: true, returnDocument: 'after' }
  );
  const ownerTag = createHash('sha256').update(userEmail).digest('hex').slice(0, 6);
  return `${generateUserSlug(displayName)}-${ownerTag}/${counter.resumeCount}`;
}
