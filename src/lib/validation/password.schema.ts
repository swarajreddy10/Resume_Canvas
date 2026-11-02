import { z } from 'zod';

/**
 * The one password policy, shared by registration, password reset, and the reset form,
 * so a reset can never produce a password that sign-in later rejects.
 * Client-safe: no Node-only imports.
 */
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password must be at most 128 characters')
  .regex(/[a-z]/, 'Password must contain a lowercase letter')
  .regex(/[A-Z]/, 'Password must contain an uppercase letter')
  .regex(/\d/, 'Password must contain a number');
