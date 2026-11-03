import { auth } from '@/lib/auth/config';

/**
 * The signed-in session for the current request. Route wrappers read the session
 * through this one function, so a test can stand in a session by mocking this small
 * module instead of the whole Auth.js configuration.
 */
export function getSession() {
  return auth();
}
