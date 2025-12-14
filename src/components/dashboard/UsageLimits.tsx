'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Crown, AlertTriangle } from 'lucide-react';

interface UsageLimitsProps {
  resumeCount: number;
  aiGenerations: number;
  plan: 'free' | 'pro';
}

const LIMITS = {
  free: { resumes: 5, ai: 10 },
  pro: { resumes: Infinity, ai: Infinity },
};

export default function UsageLimits({
  resumeCount,
  aiGenerations,
  plan,
}: UsageLimitsProps) {
  const limits = LIMITS[plan];
  const resumeProgress =
    plan === 'free' ? (resumeCount / limits.resumes) * 100 : 0;
  const aiProgress = plan === 'free' ? (aiGenerations / limits.ai) * 100 : 0;

  const isNearLimit = resumeProgress > 80 || aiProgress > 80;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Usage & Limits</CardTitle>
        <Badge
          variant={plan === 'pro' ? 'default' : 'outline'}
          className="flex items-center gap-1"
        >
          <Crown className="h-3 w-3" />
          {plan === 'pro' ? 'Pro' : 'Free'}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        {plan === 'free' && (
          <>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Resumes</span>
                <span>
                  {resumeCount}/{limits.resumes}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${Math.min(resumeProgress, 100)}%` }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>AI Generations</span>
                <span>
                  {aiGenerations}/{limits.ai}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: `${Math.min(aiProgress, 100)}%` }}
                />
              </div>
            </div>

            {isNearLimit && (
              <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <p className="text-sm text-yellow-800">
                  You&apos;re approaching your usage limits
                </p>
              </div>
            )}

            <Button className="w-full" size="sm">
              Upgrade to Pro
            </Button>
          </>
        )}

        {plan === 'pro' && (
          <div className="text-center py-4">
            <p className="text-sm text-gray-600">Unlimited usage</p>
            <p className="text-xs text-gray-500">
              Thank you for being a Pro user!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
