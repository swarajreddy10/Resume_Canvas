'use client';

import PerformanceAnalytics from '@/components/analytics/PerformanceAnalytics';

export default function AnalyticsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#11101d]">
          Analytics Dashboard
        </h1>
        <p className="text-[#64748b]">
          Track your resume performance and insights
        </p>
      </div>

      <PerformanceAnalytics />
    </div>
  );
}
