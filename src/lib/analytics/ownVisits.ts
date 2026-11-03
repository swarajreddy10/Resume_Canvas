/**
 * The site owner's own visits are left out of Vercel Web Analytics and Speed Insights.
 * Neither script has an opt-out of its own; Vercel documents `beforeSend` returning
 * null for a browser that has set this localStorage key:
 * https://vercel.com/docs/analytics/redacting-sensitive-data#allowing-users-to-opt-out-of-tracking
 *
 * Mark a browser once, in the DevTools console on the site:
 *   localStorage.setItem('va-disable', '1')
 */
export const OWN_VISITS_KEY = 'va-disable';

/**
 * Drops the event in a marked browser. Blocked or missing storage means the browser
 * cannot be the owner's marked one, so the event is sent.
 */
export function skipOwnVisits<T>(event: T): T | null {
  try {
    return localStorage.getItem(OWN_VISITS_KEY) ? null : event;
  } catch {
    return event;
  }
}
