/**
 * The one email pattern the database models check, for account, resume and contact
 * addresses alike. Client-safe: no Node-only imports.
 *
 * It accepts the same addresses as /^[^\s@]+@[^\s@]+\.[^\s@]+$/, which let both runs on
 * either side of the dot take the domain's other dots, so a long run of dots cost the
 * square of its length to refuse. Here the domain's first character is followed by
 * non-dots up to the first dot after it, so every character has one way to match.
 */
export const EMAIL_REGEX = /^[^\s@]+@[^\s@][^\s@.]*\.[^\s@]+$/;
