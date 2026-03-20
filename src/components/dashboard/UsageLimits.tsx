'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Crown, Sparkles, FileText, Zap } from 'lucide-react';

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

  return (
    <Card className="border-[#e2e8f0] overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-3 p-4 sm:p-5">
        <CardTitle className="text-sm font-semibold text-[#11101d]">
          Usage & Limits
        </CardTitle>
        <Badge
          variant="outline"
          className="flex items-center gap-1 text-[10px] border-[#c7d2fe] text-[#4f46e5] bg-[#eef2ff]"
        >
          <Crown className="h-2.5 w-2.5" />
          Free
        </Badge>
      </CardHeader>

      <CardContent className="space-y-3 p-4 sm:p-5 pt-0">
        {/* Resumes bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-[#64748b]">
              <FileText className="h-3 w-3" />
              <span>Resumes</span>
            </div>
            <span className="text-xs font-medium text-[#11101d]">
              {resumeCount}/{limits.resumes}
            </span>
          </div>
          <div className="w-full bg-[#eef2ff] rounded-full h-1.5">
            <div
              className="bg-[#4f46e5] h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(resumeProgress, 100)}%` }}
            />
          </div>
        </div>

        {/* AI Generations bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-[#64748b]">
              <Zap className="h-3 w-3" />
              <span>AI Generations</span>
            </div>
            <span className="text-xs font-medium text-[#11101d]">
              {aiGenerations}/{limits.ai}
            </span>
          </div>
          <div className="w-full bg-[#eef2ff] rounded-full h-1.5">
            <div
              className="bg-[#7c3aed] h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(aiProgress, 100)}%` }}
            />
          </div>
        </div>

        {/* Pro plan teaser — no payment CTA, just awareness */}
        <div className="mt-1 rounded-xl border border-dashed border-[#c7d2fe] bg-[#f5f3ff] p-3">
          <div className="flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#eef2ff] flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="h-3.5 w-3.5 text-[#4f46e5]" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#11101d] leading-tight">
                Pro plan coming soon
              </p>
              <p className="text-[11px] text-[#64748b] mt-0.5 leading-snug">
                Unlimited resumes, AI generations, priority support and more.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
