'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Eye, Share2, Target } from 'lucide-react';

// Only figures the app measures: views are counted per public visit, shares are published
// resumes, and an ATS score exists once a resume has been scored (null until then).
interface AnalyticsData {
  totalViews: number;
  totalShares: number;
  avgAtsScore: number | null;
  topPerformingResume: {
    title: string;
    views: number;
    atsScore: number | null;
  } | null;
}

export default function PerformanceAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  // A failed request leaves `analytics` empty, which renders "No analytics data
  // available"; it never shows invented figures.
  useEffect(() => {
    (async () => {
      try {
        const response = await fetch('/api/analytics/performance');
        if (response.ok) {
          setAnalytics(await response.json());
        }
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-full"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No analytics data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.totalViews.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Shares</CardTitle>
            <Share2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalShares}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg ATS Score</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {analytics.avgAtsScore === null ? (
              <div className="text-2xl font-bold">Not scored</div>
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {analytics.avgAtsScore}/100
                </div>
                <Progress value={analytics.avgAtsScore} className="mt-2" />
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {analytics.topPerformingResume && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Top Performing Resume
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">
                  {analytics.topPerformingResume.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {analytics.topPerformingResume.views} views
                </p>
              </div>
              <Badge
                variant={
                  (analytics.topPerformingResume.atsScore ?? 0) >= 80
                    ? 'default'
                    : 'secondary'
                }
              >
                {analytics.topPerformingResume.atsScore === null
                  ? 'ATS: not scored'
                  : `ATS: ${analytics.topPerformingResume.atsScore}/100`}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
