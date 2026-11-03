import bcryptjs from 'bcryptjs';
import { createHash, randomBytes } from 'crypto';
import { z } from 'zod';

export { passwordSchema } from '@/lib/validation/password.schema';

const BCRYPT_ROUNDS = 12;

export function hashPassword(plain: string): Promise<string> {
  return bcryptjs.hash(plain, BCRYPT_ROUNDS);
}

/** A reset token is 32 random bytes as hex; only its SHA-256 hash is stored. */
export const resetTokenSchema = z.string().regex(/^[a-f0-9]{64}$/, 'Invalid reset token');

export function hashResetToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

export function createResetToken(): { token: string; tokenHash: string } {
  const token = randomBytes(32).toString('hex');
  return { token, tokenHash: hashResetToken(token) };
}

export const RESET_TOKEN_TTL_MS = 15 * 60 * 1000;
