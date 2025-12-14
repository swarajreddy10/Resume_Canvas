'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, CheckCircle, AlertCircle, XCircle } from 'lucide-react';

interface ReviewSuggestion {
  type: 'improvement' | 'warning' | 'error';
  section: string;
  message: string;
  suggestion: string;
}

interface ResumeReviewerProps {
  resumeData: unknown;
}

export default function ResumeReviewer({ resumeData }: ResumeReviewerProps) {
  const [reviewing, setReviewing] = useState(false);
  const [suggestions, setSuggestions] = useState<ReviewSuggestion[]>([]);
  const [score, setScore] = useState<number | null>(null);

  const reviewResume = async () => {
    setReviewing(true);
    try {
      const response = await fetch('/api/ai/review-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeData }),
      });

      if (response.ok) {
        const data = await response.json();
        setSuggestions(data.suggestions);
        setScore(data.score);
      }
    } catch (error) {
      console.error('Failed to review resume:', error);
    } finally {
      setReviewing(false);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'improvement':
        return <CheckCircle className="h-4 w-4 text-blue-600" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <CheckCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case 'improvement':
        return 'default';
      case 'warning':
        return 'secondary';
      case 'error':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-600" />
          AI Resume Review
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {score !== null && (
          <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
            <div className="text-3xl font-bold text-purple-600 mb-1">
              {score}/100
            </div>
            <p className="text-sm text-gray-600">Resume Quality Score</p>
          </div>
        )}

        <Button
          onClick={reviewResume}
          disabled={reviewing}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        >
          {reviewing ? 'Analyzing...' : 'Get AI Review'}
        </Button>

        {suggestions.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900">Suggestions</h4>
            {suggestions.map((suggestion, index) => (
              <div key={index} className="border rounded-lg p-3">
                <div className="flex items-start gap-3">
                  {getIcon(suggestion.type)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge
                        variant={getBadgeVariant(suggestion.type)}
                        className="text-xs"
                      >
                        {suggestion.section}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">
                      {suggestion.message}
                    </p>
                    <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                      💡 {suggestion.suggestion}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
