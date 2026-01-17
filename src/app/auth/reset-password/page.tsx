'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AlertCircle, CheckCircle, Clock, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [token, setToken] = useState('');
  const [tokenStatus, setTokenStatus] = useState<
    'loading' | 'valid' | 'invalid' | 'expired'
  >('loading');
  const [userEmail, setUserEmail] = useState('');

  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const urlToken = urlParams.get('token') || '';
      setToken(urlToken);

      if (urlToken) {
        validateToken(urlToken);
      } else {
        setTokenStatus('invalid');
      }
    }
  }, []);

  const validateToken = async (tokenToValidate: string) => {
    try {
      const response = await fetch('/api/auth/validate-reset-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: tokenToValidate }),
      });

      const data = await response.json();

      if (response.ok) {
        setTokenStatus('valid');
        setUserEmail(data.email || '');
      } else {
        setTokenStatus(data.status || 'invalid');
        setUserEmail(data.email || '');
      }
    } catch {
      setTokenStatus('invalid');
    }
  };

  const handleAutoResend = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userEmail) {
      setError('Email not found. Please use the manual form.');
      return;
    }

    setIsResending(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail }),
      });

      if (response.ok) {
        setMessage('New reset link sent! Check your email.');
        setError('');
      } else {
        setError('Failed to send new link. Please try the manual form.');
      }
    } catch {
      setError('Network error. Please try the manual form.');
    } finally {
      setIsResending(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Password reset successfully! Redirecting to sign in...');
        setTimeout(() => router.push('/auth/signin'), 3000);
      } else {
        if (data.error?.includes('expired')) {
          setTokenStatus('expired');
        } else {
          setError(data.error || 'Failed to reset password');
        }
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (tokenStatus === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <CardTitle>Validating Reset Link</CardTitle>
            <CardDescription>
              Please wait while we verify your reset token...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (tokenStatus === 'expired') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Clock className="h-12 w-12 text-orange-500 mx-auto mb-4" />
            <CardTitle className="text-xl">Link Expired</CardTitle>
            <CardDescription className="text-center">
              This password reset link has expired. Links are valid for 15
              minutes.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/auth/forgot-password">
              <Button className="w-full">
                <RefreshCw className="h-4 w-4 mr-2" />
                Request New Link
              </Button>
            </Link>
            {userEmail && (
              <form onSubmit={handleAutoResend} className="w-full">
                <Button
                  type="submit"
                  className="w-full"
                  variant="outline"
                  disabled={isResending}
                >
                  {isResending ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-gray-400 border-t-transparent rounded-full mr-2"></div>
                      Sending New Link...
                    </>
                  ) : (
                    'Send New Link Automatically'
                  )}
                </Button>
              </form>
            )}
            {message && (
              <p className="text-green-600 text-sm text-center">{message}</p>
            )}
            {error && (
              <p className="text-red-600 text-sm text-center">{error}</p>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (tokenStatus === 'invalid') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <CardTitle className="text-xl">Invalid Reset Link</CardTitle>
            <CardDescription className="text-center">
              This password reset link is invalid or malformed.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/auth/forgot-password">
              <Button className="w-full">
                <RefreshCw className="h-4 w-4 mr-2" />
                Request New Link
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Reset Your Password</CardTitle>
          <CardDescription>Enter your new password below</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="password"
                placeholder="New password (min 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                disabled={isLoading}
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                disabled={isLoading}
              />
            </div>
            {error && (
              <div className="flex items-center space-x-2 text-red-600 text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}
            {message && (
              <div className="flex items-center space-x-2 text-green-600 text-sm">
                <CheckCircle className="h-4 w-4" />
                <span>{message}</span>
              </div>
            )}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Resetting Password...
                </>
              ) : (
                'Reset Password'
              )}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <Link
              href="/auth/signin"
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              Back to Sign In
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
