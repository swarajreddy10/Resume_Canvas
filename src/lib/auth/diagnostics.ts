/**
 * OAuth Diagnostics Utility
 * Helps debug authentication issues across browsers and devices
 */

export interface OAuthDiagnostics {
  browser: string;
  cookiesEnabled: boolean;
  thirdPartyCookiesEnabled: boolean;
  localStorage: boolean;
  sessionStorage: boolean;
  userAgent: string;
  platform: string;
  isMobile: boolean;
  isIOS: boolean;
  isSafari: boolean;
  secureContext: boolean;
  referrer: string;
}

export function getOAuthDiagnostics(): OAuthDiagnostics {
  const ua = navigator.userAgent;
  const isIOS = /iPad|iPhone|iPod/.test(ua);
  const isSafari = /^((?!chrome|android).)*safari/i.test(ua);

  return {
    browser: getBrowserName(),
    cookiesEnabled: navigator.cookieEnabled,
    thirdPartyCookiesEnabled: checkThirdPartyCookies(),
    localStorage: checkLocalStorage(),
    sessionStorage: checkSessionStorage(),
    userAgent: ua,
    platform: navigator.platform,
    isMobile: /Mobile|Android|iPhone|iPad|iPod/.test(ua),
    isIOS,
    isSafari,
    secureContext: window.isSecureContext,
    referrer: document.referrer,
  };
}

function getBrowserName(): string {
  const ua = navigator.userAgent;
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('Edg')) return 'Edge';
  if (ua.includes('Chrome')) return 'Chrome';
  if (ua.includes('Safari')) return 'Safari';
  if (ua.includes('Opera')) return 'Opera';
  return 'Unknown';
}

function checkThirdPartyCookies(): boolean {
  try {
    localStorage.setItem('test', 'test');
    localStorage.removeItem('test');
    return true;
  } catch {
    return false;
  }
}

function checkLocalStorage(): boolean {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

function checkSessionStorage(): boolean {
  try {
    const test = '__storage_test__';
    sessionStorage.setItem(test, test);
    sessionStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

export function logOAuthDiagnostics(): void {
  const diagnostics = getOAuthDiagnostics();
  console.group('🔐 OAuth Diagnostics');
  console.table(diagnostics);

  if (!diagnostics.cookiesEnabled) {
    console.error('❌ Cookies are disabled. OAuth will not work.');
  }

  if (diagnostics.isSafari || diagnostics.isIOS) {
    console.warn(
      '⚠️ Safari/iOS detected. Ensure SameSite=Lax and proper cookie configuration.'
    );
  }

  if (!diagnostics.secureContext && window.location.protocol !== 'http:') {
    console.warn('⚠️ Not in secure context. HTTPS required for production.');
  }

  console.groupEnd();
}

export function getOAuthErrorSuggestion(error: string): string {
  const suggestions: Record<string, string> = {
    OAuthSignin:
      'Check your Google OAuth credentials and redirect URIs in Google Console.',
    OAuthCallback:
      'Verify NEXTAUTH_URL matches your domain exactly. Check for trailing slashes.',
    OAuthCreateAccount:
      'Database connection issue. Verify MongoDB connection string.',
    OAuthAccountNotLinked:
      'This email is already registered with a different method. Try the other sign-in option.',
    Callback:
      'Session configuration issue. Check cookie settings and NEXTAUTH_SECRET.',
    CredentialsSignin: 'Invalid email or password. Please try again.',
  };

  return suggestions[error] || 'Please try again or contact support.';
}

export async function testOAuthConfiguration(): Promise<{
  success: boolean;
  issues: string[];
}> {
  const issues: string[] = [];
  const diagnostics = getOAuthDiagnostics();

  if (!diagnostics.cookiesEnabled) {
    issues.push('Cookies are disabled in browser');
  }

  if (!diagnostics.secureContext && window.location.hostname !== 'localhost') {
    issues.push('Not using HTTPS (required for production)');
  }

  if (diagnostics.isSafari && !diagnostics.thirdPartyCookiesEnabled) {
    issues.push('Third-party cookies blocked (Safari ITP)');
  }

  if (!diagnostics.localStorage) {
    issues.push('LocalStorage is disabled or unavailable');
  }

  try {
    const response = await fetch('/api/auth/session');
    if (!response.ok) {
      issues.push('Cannot reach authentication endpoint');
    }
  } catch {
    issues.push('Network error connecting to auth server');
  }

  return {
    success: issues.length === 0,
    issues,
  };
}
