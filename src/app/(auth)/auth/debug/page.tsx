'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface Diagnostics {
  browser: string;
  cookiesEnabled: boolean;
  localStorage: boolean;
  sessionStorage: boolean;
  userAgent: string;
  platform: string;
  isMobile: boolean;
  isIOS: boolean;
  isSafari: boolean;
  secureContext: boolean;
  currentUrl: string;
  referrer: string;
  timestamp: string;
}

const getBrowserName = () => {
  const ua = navigator.userAgent;
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('Edg')) return 'Edge';
  if (ua.includes('Chrome')) return 'Chrome';
  if (ua.includes('Safari')) return 'Safari';
  if (ua.includes('Opera')) return 'Opera';
  return 'Unknown';
};

const checkStorage = (type: 'localStorage' | 'sessionStorage') => {
  try {
    const storage = window[type];
    const test = '__test__';
    storage.setItem(test, test);
    storage.removeItem(test);
    return true;
  } catch {
    return false;
  }
};

export default function AuthDebugPage() {
  const router = useRouter();
  const [diagnostics, setDiagnostics] = useState<Diagnostics | null>(null);

  useEffect(() => {
    const runDiagnostics = () => {
      const ua = navigator.userAgent;
      const isIOS = /iPad|iPhone|iPod/.test(ua);
      const isSafari = /^((?!chrome|android).)*safari/i.test(ua);

      setDiagnostics({
        browser: getBrowserName(),
        cookiesEnabled: navigator.cookieEnabled,
        localStorage: checkStorage('localStorage'),
        sessionStorage: checkStorage('sessionStorage'),
        userAgent: ua,
        platform: navigator.platform,
        isMobile: /Mobile|Android|iPhone|iPad|iPod/.test(ua),
        isIOS,
        isSafari,
        secureContext: window.isSecureContext,
        currentUrl: window.location.href,
        referrer: document.referrer,
        timestamp: new Date().toISOString(),
      });
    };

    runDiagnostics();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">OAuth Debug Information</h1>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">System Diagnostics</h2>
          {diagnostics ? (
            <div className="space-y-2 font-mono text-sm">
              {Object.entries(diagnostics).map(([key, value]) => (
                <div key={key} className="flex border-b pb-2">
                  <span className="font-semibold w-48">{key}:</span>
                  <span
                    className={
                      value === false
                        ? 'text-red-600'
                        : value === true
                          ? 'text-green-600'
                          : 'text-gray-700'
                    }
                  >
                    {String(value)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p>Loading diagnostics...</p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Common Issues</h2>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-red-500 font-bold">•</span>
              <div>
                <strong>Cookies Disabled:</strong> Enable cookies in browser
                settings
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 font-bold">•</span>
              <div>
                <strong>Safari Private Mode:</strong> OAuth may fail in private
                browsing
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 font-bold">•</span>
              <div>
                <strong>Slow Network:</strong> Redirect may timeout on slow
                connections
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 font-bold">•</span>
              <div>
                <strong>Ad Blockers:</strong> Some extensions block OAuth
                redirects
              </div>
            </li>
          </ul>
        </div>

        <div className="flex gap-4">
          <Button onClick={() => router.push('/auth/signin')}>
            Back to Sign In
          </Button>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Refresh Diagnostics
          </Button>
        </div>
      </div>
    </div>
  );
}
