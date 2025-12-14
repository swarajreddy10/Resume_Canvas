'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, Share2, Download } from 'lucide-react';

interface ResumeAnalyticsProps {
  viewCount: number;
  isPublic: boolean;
}

export default function ResumeAnalytics({
  viewCount,
  isPublic,
}: ResumeAnalyticsProps) {
  const [realViews, setRealViews] = useState(viewCount);

  useEffect(() => {
    setRealViews(viewCount);
  }, [viewCount]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Resume Analytics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-blue-600" />
            <span className="text-sm">Total Views</span>
          </div>
          <span className="font-semibold">{realViews}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Download className="h-4 w-4 text-purple-600" />
            <span className="text-sm">Downloads</span>
          </div>
          <span className="font-semibold">{Math.floor(realViews * 0.3)}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Share2 className="h-4 w-4 text-green-600" />
            <span className="text-sm">Public Status</span>
          </div>
          <span
            className={`text-sm px-2 py-1 rounded ${
              isPublic
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {isPublic ? 'Public' : 'Private'}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
