import type { ReactNode } from 'react';
import DashboardShell from '@/components/layout/DashboardShell';
import { QueryProvider } from '@/components/providers/QueryProvider';
import { SessionProvider } from '@/components/providers/SessionProvider';

// The session and query providers live here, not in the root layout: useSession and
// useQuery are used only under the dashboard, and a root-level SessionProvider fetched
// /api/auth/session on every public page (twice on landing and sign-in) for nothing.
// signIn() on the sign-in page posts to the auth API directly and needs no provider.
export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <SessionProvider>
        <DashboardShell>{children}</DashboardShell>
      </SessionProvider>
    </QueryProvider>
  );
}
