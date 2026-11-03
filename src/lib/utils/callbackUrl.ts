const DEFAULT_CALLBACK = '/dashboard';

/**
 * The sign-in page navigates to `callbackUrl` from the query string after a credentials
 * sign-in. Only a same-origin path is accepted: an absolute URL would be an open redirect,
 * and a `javascript:` URL would run script on assignment to `window.location.href`.
 */
export function safeCallbackUrl(value: string | null | undefined): string {
  if (!value || !value.startsWith('/')) return DEFAULT_CALLBACK;
  // "//host" and "/\host" are protocol-relative to browsers.
  if (value.startsWith('//') || value.startsWith('/\\'))
    return DEFAULT_CALLBACK;
  // Control characters are stripped by the URL parser, so "/\t/host" would become "//host".
  if (/[\u0000-\u001f\u007f]/.test(value)) return DEFAULT_CALLBACK;
  return value;
}
