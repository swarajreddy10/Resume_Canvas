'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Target, TrendingUp } from 'lucide-react';

interface KeywordMatch {
  keyword: string;
  present: boolean;
  importance: 'high' | 'medium' | 'low';
}

interface KeywordOptimizerProps {
  resumeData: unknown;
}

export default function KeywordOptimizer({
  resumeData,
}: KeywordOptimizerProps) {
  const [jobDescription, setJobDescription] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [keywords, setKeywords] = useState<KeywordMatch[]>([]);
  const [matchScore, setMatchScore] = useState<number | null>(null);

  const analyzeKeywords = async () => {
    if (!jobDescription.trim()) return;

    setAnalyzing(true);
    try {
      const response = await fetch('/api/ai/analyze-keywords', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeData, jobDescription }),
      });

      if (response.ok) {
        const data = await response.json();
        setKeywords(data.keywords);
        setMatchScore(data.matchScore);
      }
    } catch (error) {
      console.error('Failed to analyze keywords:', error);
    } finally {
      setAnalyzing(false);
    }
  };

  const getKeywordColor = (keyword: KeywordMatch) => {
    if (keyword.present) {
      return keyword.importance === 'high'
        ? 'bg-green-100 text-green-800'
        : 'bg-blue-100 text-blue-800';
    }
    return keyword.importance === 'high'
      ? 'bg-red-100 text-red-800'
      : 'bg-yellow-100 text-yellow-800';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-green-600" />
          Keyword Optimization
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">
            Job Description
          </label>
          <Textarea
            placeholder="Paste the job description here to analyze keyword matches..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            rows={4}
          />
        </div>

        <Button
          onClick={analyzeKeywords}
          disabled={analyzing || !jobDescription.trim()}
          className="w-full bg-green-600 hover:bg-green-700"
        >
          {analyzing ? 'Analyzing...' : 'Analyze Keywords'}
        </Button>

        {matchScore !== null && (
          <div className="text-center p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
            <div className="flex items-center justify-center gap-2 mb-1">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span className="text-2xl font-bold text-green-600">
                {matchScore}%
              </span>
            </div>
            <p className="text-sm text-gray-600">Keyword Match Score</p>
          </div>
        )}

        {keywords.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900">Keywords Analysis</h4>
            <div className="flex flex-wrap gap-2">
              {keywords.map((keyword, index) => (
                <Badge
                  key={index}
                  className={`${getKeywordColor(keyword)} border-0`}
                >
                  {keyword.keyword} {keyword.present ? '✓' : '✗'}
                </Badge>
              ))}
            </div>
            <div className="text-xs text-gray-600 space-y-1">
              <p>✓ Green: Keywords found in your resume</p>
              <p>✗ Red: Important missing keywords</p>
              <p>✗ Yellow: Optional missing keywords</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
