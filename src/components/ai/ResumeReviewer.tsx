'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, CheckCircle, AlertCircle, XCircle } from 'lucide-react';

interface ReviewSuggestion {
  type: 'critical' | 'warning' | 'improvement' | 'info';
  section: string;
  message: string;
  suggestion: string;
  impact?: 'high' | 'medium' | 'low';
}

interface ReviewResponse {
  score: number;
  overallAssessment?: string;
  strengths?: string[];
  suggestions: ReviewSuggestion[];
}

interface ResumeReviewerProps {
  resumeData: unknown;
}

export default function ResumeReviewer({ resumeData }: ResumeReviewerProps) {
  const [reviewing, setReviewing] = useState(false);
  const [review, setReview] = useState<ReviewResponse | null>(null);

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
        setReview(data);
      }
    } catch (error) {
      console.error('Failed to review resume:', error);
    } finally {
      setReviewing(false);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      case 'improvement':
        return <CheckCircle className="h-5 w-5 text-blue-600" />;
      case 'info':
        return <CheckCircle className="h-5 w-5 text-gray-600" />;
      default:
        return <CheckCircle className="h-5 w-5 text-gray-600" />;
    }
  };

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case 'critical':
        return 'destructive';
      case 'warning':
        return 'secondary';
      case 'improvement':
        return 'default';
      case 'info':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    if (score >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Exceptional';
    if (score >= 80) return 'Strong';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Average';
    if (score >= 50) return 'Below Average';
    return 'Needs Major Improvement';
  };

  const getImpactBadge = (impact?: string) => {
    if (!impact) return null;
    const colors = {
      high: 'bg-red-100 text-red-800 border-red-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      low: 'bg-blue-100 text-blue-800 border-blue-200',
    };
    return (
      <Badge className={`text-xs ${colors[impact as keyof typeof colors]}`}>
        {impact.toUpperCase()} IMPACT
      </Badge>
    );
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
        {review && (
          <div className="space-y-4">
            {/* Score Display */}
            <div className="text-center p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border-2 border-purple-100">
              <div
                className={`text-5xl font-bold mb-2 ${getScoreColor(review.score)}`}
              >
                {review.score}/100
              </div>
              <p className="text-lg font-semibold text-gray-700 mb-1">
                {getScoreLabel(review.score)}
              </p>
              <p className="text-sm text-gray-600">Resume Quality Score</p>
            </div>

            {/* Overall Assessment */}
            {review.overallAssessment && (
              <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
                <h4 className="font-semibold text-blue-900 mb-2">
                  Overall Assessment
                </h4>
                <p className="text-sm text-blue-800">
                  {review.overallAssessment}
                </p>
              </div>
            )}

            {/* Strengths */}
            {review.strengths && review.strengths.length > 0 && (
              <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded">
                <h4 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Strengths
                </h4>
                <ul className="space-y-1">
                  {review.strengths.map((strength, index) => (
                    <li
                      key={index}
                      className="text-sm text-green-800 flex items-start gap-2"
                    >
                      <span className="text-green-600 mt-0.5">✓</span>
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <Button
          onClick={reviewResume}
          disabled={reviewing}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        >
          {reviewing
            ? 'Analyzing Resume...'
            : review
              ? 'Re-analyze Resume'
              : 'Get Professional AI Review'}
        </Button>

        {review && review.suggestions.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900 text-lg">
              Areas for Improvement
            </h4>
            <p className="text-xs text-gray-600 mb-3">
              Prioritized by impact on your job search success
            </p>
            {review.suggestions
              .sort((a, b) => {
                const impactOrder = { high: 0, medium: 1, low: 2 };
                return (
                  (impactOrder[a.impact as keyof typeof impactOrder] || 3) -
                  (impactOrder[b.impact as keyof typeof impactOrder] || 3)
                );
              })
              .map((suggestion, index) => (
                <div
                  key={index}
                  className="border-2 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-3">
                    {getIcon(suggestion.type)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <Badge
                          variant={getBadgeVariant(suggestion.type)}
                          className="text-xs font-semibold"
                        >
                          {suggestion.section}
                        </Badge>
                        {getImpactBadge(suggestion.impact)}
                      </div>
                      <p className="text-sm font-semibold text-gray-900 mb-2">
                        {suggestion.message}
                      </p>
                      <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded border-l-4 border-blue-400">
                        <span className="font-semibold text-blue-700">
                          💡 Action:
                        </span>{' '}
                        {suggestion.suggestion}
                      </div>
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
