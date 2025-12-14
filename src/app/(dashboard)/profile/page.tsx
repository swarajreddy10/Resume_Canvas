'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';

export const dynamic = 'force-dynamic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { User, Crown, FileText, Eye } from 'lucide-react';
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
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-gray-600">
          Manage your account and view your statistics
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Name</Label>
                  <Input value={session.user?.name || ''} readOnly />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input value={session.user?.email || ''} readOnly />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Label>Plan</Label>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Crown className="h-3 w-3" />
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

        {/* Stats */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-gray-200 rounded" />
                  <div className="h-4 bg-gray-200 rounded" />
                  <div className="h-4 bg-gray-200 rounded" />
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">Total Resumes</span>
                    </div>
                    <span className="font-semibold">{stats.resumeCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Total Views</span>
                    </div>
                    <span className="font-semibold">{stats.totalViews}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-purple-600" />
                      <span className="text-sm">Public Resumes</span>
                    </div>
                    <span className="font-semibold">{stats.publicResumes}</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upgrade Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-gray-600">Unlock premium features</p>
                <ul className="text-xs space-y-1 text-gray-600">
                  <li>• Unlimited resumes</li>
                  <li>• Advanced AI features</li>
                  <li>• Priority support</li>
                  <li>• Custom templates</li>
                </ul>
                <Button className="w-full" size="sm">
                  Upgrade to Pro
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                variant="destructive"
                className="w-full"
                size="sm"
                onClick={() => signOut({ callbackUrl: '/' })}
              >
                Sign Out
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
