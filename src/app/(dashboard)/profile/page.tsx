'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';

export const dynamic = 'force-dynamic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { User, Crown, FileText, Eye, Sparkles, LogOut } from 'lucide-react';
import UsageLimits from '@/components/dashboard/UsageLimits';

interface UserStats {
  resumeCount: number;
  totalViews: number;
  publicResumes: number;
}

export default function ProfilePage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<UserStats>({
    resumeCount: 0,
    totalViews: 0,
    publicResumes: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/user/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#4f46e5] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-[#64748b]">
          Manage your account and view your statistics
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left — account info + usage */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-[#e2e8f0]">
            <CardHeader className="pb-3 p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-base font-semibold text-[#11101d]">
                <div className="w-7 h-7 rounded-lg bg-[#eef2ff] flex items-center justify-center">
                  <User className="h-3.5 w-3.5 text-[#4f46e5]" />
                </div>
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-4 sm:p-6 pt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs text-[#64748b]">Name</Label>
                  <Input
                    value={session.user?.name || ''}
                    readOnly
                    className="bg-[#f8fafc] border-[#e2e8f0] text-[#11101d] focus-visible:ring-[#4f46e5]"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-[#64748b]">Email</Label>
                  <Input
                    value={session.user?.email || ''}
                    readOnly
                    className="bg-[#f8fafc] border-[#e2e8f0] text-[#11101d] focus-visible:ring-[#4f46e5]"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <span className="text-xs text-[#64748b]">Current plan</span>
                <Badge
                  variant="outline"
                  className="flex items-center gap-1 text-[10px] border-[#c7d2fe] text-[#4f46e5] bg-[#eef2ff]"
                >
                  <Crown className="h-2.5 w-2.5" />
                  Free
                </Badge>
              </div>
            </CardContent>
          </Card>

          <UsageLimits
            resumeCount={stats.resumeCount}
            aiGenerations={0}
            plan="free"
          />
        </div>

        {/* Right — stats + sign out */}
        <div className="space-y-4">
          {/* Stats */}
          <Card className="border-[#e2e8f0]">
            <CardHeader className="pb-3 p-4 sm:p-5">
              <CardTitle className="text-sm font-semibold text-[#11101d]">
                Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 p-4 sm:p-5 pt-0">
              {loading ? (
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-[#eef2ff] rounded" />
                  <div className="h-4 bg-[#eef2ff] rounded" />
                  <div className="h-4 bg-[#eef2ff] rounded" />
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between py-1">
                    <div className="flex items-center gap-2">
                      <FileText className="h-3.5 w-3.5 text-[#4f46e5]" />
                      <span className="text-xs text-[#64748b]">
                        Total Resumes
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-[#11101d]">
                      {stats.resumeCount}
                    </span>
                  </div>
                  <div className="h-px bg-[#f1f5f9]" />
                  <div className="flex items-center justify-between py-1">
                    <div className="flex items-center gap-2">
                      <Eye className="h-3.5 w-3.5 text-[#4f46e5]" />
                      <span className="text-xs text-[#64748b]">
                        Total Views
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-[#11101d]">
                      {stats.totalViews}
                    </span>
                  </div>
                  <div className="h-px bg-[#f1f5f9]" />
                  <div className="flex items-center justify-between py-1">
                    <div className="flex items-center gap-2">
                      <User className="h-3.5 w-3.5 text-[#4f46e5]" />
                      <span className="text-xs text-[#64748b]">
                        Public Resumes
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-[#11101d]">
                      {stats.publicResumes}
                    </span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Pro teaser — no payment button */}
          <div className="rounded-xl border border-dashed border-[#c7d2fe] bg-[#f5f3ff] p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#eef2ff] flex items-center justify-center shrink-0">
                <Sparkles className="h-4 w-4 text-[#4f46e5]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#11101d] leading-tight">
                  Pro plan coming soon
                </p>
                <p className="text-xs text-[#64748b] mt-1 leading-snug">
                  Unlimited resumes, advanced AI, priority support and more.
                </p>
              </div>
            </div>
          </div>

          {/* Sign out */}
          <Card className="border-[#e2e8f0]">
            <CardContent className="p-4">
              <Button
                variant="ghost"
                className="w-full text-red-500 hover:text-red-600 hover:bg-red-50 border border-[#fecaca] justify-start gap-2"
                size="sm"
                onClick={() => signOut({ callbackUrl: '/' })}
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
