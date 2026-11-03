'use client';

// beforeSend is a function, which a Server Component cannot pass to a Client Component,
// so the root layout renders this client wrapper instead.
// https://nextjs.org/docs/app/getting-started/server-and-client-components#third-party-components
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { skipOwnVisits } from '@/lib/analytics/ownVisits';

export function SiteAnalytics() {
  return (
    <>
      <Analytics beforeSend={skipOwnVisits} />
      <SpeedInsights beforeSend={skipOwnVisits} />
    </>
  );
}
