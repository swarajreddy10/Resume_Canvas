'use client';

import PerformanceAnalytics from '@/components/analytics/PerformanceAnalytics';

export default function AnalyticsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Analytics Dashboard
        </h1>
        <p className="text-gray-600">
          Track your resume performance and insights
        </p>
      </div>

      <PerformanceAnalytics />
    </div>
  );
}
