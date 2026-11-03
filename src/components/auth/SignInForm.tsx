'use client';

import { Input } from '@/components/ui/input';
import { safeCallbackUrl } from '@/lib/utils/callbackUrl';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
} from 'lucide-react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useCallback, useEffect, useState } from 'react';

const OAUTH_ERROR_MESSAGES: Record<string, string> = {
  OAuthSignin: 'Error constructing OAuth URL. Please try again.',
  OAuthCallback:
    'Error handling OAuth response. Check your internet connection.',
  OAuthCreateAccount: 'Could not create OAuth account. Please try again.',
  EmailCreateAccount: 'Could not create email account. Please try again.',
  Callback: 'Error in callback handler. Please try again.',
  OAuthAccountNotLinked:
    'Email already exists with different sign-in method. Try signing in with your original method.',
  EmailSignin: 'Check your email for the sign-in link.',
  CredentialsSignin: 'Sign in failed. Check your credentials.',
  SessionRequired: 'Please sign in to access this page.',
  Default: 'Unable to sign in. Please try again.',
};

interface UrlParams {
  callbackUrl: string;
  oauthError: string | null;
}

/**
 * Reads ?callbackUrl and ?error. useSearchParams makes everything up to the nearest
 * Suspense boundary render on the client, so it is confined to this empty component:
 * the form around it stays in the prerendered HTML.
 */
function UrlParamsReader({ onChange }: { onChange: (p: UrlParams) => void }) {
  const searchParams = useSearchParams();
  const callbackUrl = safeCallbackUrl(searchParams.get('callbackUrl'));
  const oauthError = searchParams.get('error');

  useEffect(() => {
    onChange({ callbackUrl, oauthError });
  }, [callbackUrl, oauthError, onChange]);

  return null;
}

export function SignInForm() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);
  const [callbackUrl, setCallbackUrl] = useState(safeCallbackUrl(null));

  const onUrlParams = useCallback(({ callbackUrl, oauthError }: UrlParams) => {
    setCallbackUrl(callbackUrl);
    if (!oauthError) return;
    setError(OAUTH_ERROR_MESSAGES[oauthError] || OAUTH_ERROR_MESSAGES.Default);
    const url = new URL(window.location.href);
    url.searchParams.delete('error');
    window.history.replaceState(window.history.state, '', url.toString());
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      setOauthLoading(true);
      setError('');
      const tid = setTimeout(() => {
        setError('Redirect taking too long. Please check your connection.');
        setOauthLoading(false);
      }, 15000);
      await signIn('google', { callbackUrl, redirect: true });
      clearTimeout(tid);
    } catch {
      setError('Failed to initiate Google sign-in. Please try again.');
      setOauthLoading(false);
    }
  };

  const validatePassword = (pwd: string) => {
    if (pwd.length < 8) return 'Password must be at least 8 characters';
    if (!/[a-z]/.test(pwd)) return 'Must contain a lowercase letter';
    if (!/[A-Z]/.test(pwd)) return 'Must contain an uppercase letter';
    if (!/\d/.test(pwd)) return 'Must contain a number';
    return null;
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }
    if (!password.trim()) {
      setError('Please enter your password');
      return;
    }
    if (isSignUp && !name.trim()) {
      setError('Please enter your name');
      return;
    }
    if (isSignUp) {
      const err = validatePassword(password);
      if (err) {
        setError(err);
        return;
      }
    }
    setLoading(true);
    try {
      if (isSignUp) {
        const res = await fetch('/api/user/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
            name: name.trim(),
            password,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(
            data.suggestion ? `${data.error}. ${data.suggestion}.` : data.error
          );
          setLoading(false);
          return;
        }
        setSuccess('Account created! Signing you in...');
        await new Promise((r) => setTimeout(r, 800));
      }

      const result = await signIn('credentials', {
        email: email.trim().toLowerCase(),
        password,
        callbackUrl,
        redirect: false,
      });

      if (result?.error) {
        const msg = result.error;
        if (msg.includes('No account'))
          setError('No account found. Please sign up first.');
        else if (msg.includes('Google'))
          setError(
            'This account uses Google sign-in. Use the Google button above.'
          );
        else if (msg.includes('password'))
          setError('Incorrect password. Please try again.');
        else setError('Sign in failed. Please check your credentials.');
        setLoading(false);
        return;
      }

      if (result?.ok) {
        setSuccess(
          isSignUp ? 'Welcome! Redirecting...' : 'Signed in! Redirecting...'
        );
        await new Promise((r) => setTimeout(r, 800));
        window.location.href = callbackUrl;
      } else {
        setError('Authentication failed. Please try again.');
        setLoading(false);
      }
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsSignUp(!isSignUp);
    setError('');
    setSuccess('');
    setPassword('');
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Suspense fallback={null}>
        <UrlParamsReader onChange={onUrlParams} />
      </Suspense>

      {/* Heading */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 mb-2">
          {isSignUp ? 'Create your account' : 'Welcome back'}
        </h1>
        <p className="text-rc-muted text-sm">
          {isSignUp
            ? 'Start building professional resumes in minutes'
            : 'Sign in to continue to your dashboard'}
        </p>
      </div>

      {/* Google */}
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={loading || oauthLoading}
        className="w-full h-11 mb-5 flex items-center justify-center gap-3 text-sm font-medium rounded-xl border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
      >
        {oauthLoading ? (
          <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
        ) : (
          <svg aria-hidden="true" className="w-4.5 h-4.5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
        )}
        {oauthLoading ? 'Connecting...' : 'Continue with Google'}
      </button>

      {/* Divider */}
      <div className="relative mb-5">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-100" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="px-3 bg-white text-rc-muted">
            or continue with email
          </span>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleEmailAuth} className="space-y-4">
        {isSignUp && (
          <div>
            <label
              htmlFor="name"
              className="block text-xs font-semibold text-slate-700 mb-1.5"
            >
              Full Name
            </label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              required
              disabled={loading}
              autoComplete="name"
              className="h-11 border-slate-200 focus:border-blue-400 focus:ring-blue-100"
            />
          </div>
        )}

        <div>
          <label
            htmlFor="email"
            className="block text-xs font-semibold text-slate-700 mb-1.5"
          >
            Email Address
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            disabled={loading}
            autoComplete="email"
            className="h-11 border-slate-200 focus:border-blue-400 focus:ring-blue-100"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="password"
              className="block text-xs font-semibold text-slate-700"
            >
              Password
            </label>
            {!isSignUp && (
              <Link
                href="/auth/forgot-password"
                className="inline-flex items-center min-h-6 text-xs text-[#4f46e5] hover:text-[#3730a3] font-semibold transition-colors"
              >
                Forgot password?
              </Link>
            )}
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={
                isSignUp
                  ? 'Min 8 chars, 1 uppercase, 1 number'
                  : 'Enter your password'
              }
              required
              disabled={loading}
              className="h-11 pr-11 border-slate-200 focus:border-blue-400 focus:ring-blue-100"
              autoComplete={isSignUp ? 'new-password' : 'current-password'}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label="Show password"
              aria-pressed={showPassword}
              aria-controls="password"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center rounded-lg text-rc-muted hover:text-slate-700 transition-colors"
              disabled={loading}
            >
              {showPassword ? (
                <EyeOff aria-hidden="true" className="h-4 w-4" />
              ) : (
                <Eye aria-hidden="true" className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Live regions exist before any message, so screen readers announce what is
            inserted into them (WCAG 2.2 SC 4.1.3). */}
        <div role="alert" aria-atomic="true">
          {error && (
            <div className="flex items-start gap-2.5 text-sm bg-red-50 border border-red-100 rounded-xl p-3.5 text-red-700 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-top-1 duration-300">
              <AlertCircle
                aria-hidden="true"
                className="h-4 w-4 mt-0.5 flex-shrink-0"
              />
              <span>{error}</span>
            </div>
          )}
        </div>
        <div role="status" aria-atomic="true">
          {success && (
            <div className="flex items-start gap-2.5 text-sm bg-emerald-50 border border-emerald-100 rounded-xl p-3.5 text-emerald-700 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-top-1 duration-300">
              <CheckCircle2
                aria-hidden="true"
                className="h-4 w-4 mt-0.5 flex-shrink-0"
              />
              <span>{success}</span>
            </div>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full h-11 flex items-center justify-center gap-2 bg-[#4f46e5] hover:bg-[#3730a3] text-white font-semibold rounded-xl text-sm transition-[background-color,transform] shadow-sm disabled:opacity-60 disabled:cursor-not-allowed motion-safe:enabled:hover:scale-[1.02] motion-safe:enabled:active:scale-[0.98]"
        >
          {loading ? (
            <>
              <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
              {isSignUp ? 'Creating account...' : 'Signing in...'}
            </>
          ) : (
            <>
              {isSignUp ? 'Create account' : 'Sign in'}
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      {/* Switch */}
      <div className="text-center text-sm text-rc-muted mt-5">
        {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
        <button
          type="button"
          onClick={switchMode}
          className="min-h-6 text-[#4f46e5] hover:text-[#3730a3] font-semibold transition-colors"
          disabled={loading}
        >
          {isSignUp ? 'Sign in' : 'Sign up free'}
        </button>
      </div>
    </div>
  );
}
