'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Sparkles, Target, TrendingUp } from 'lucide-react';

import { ResumeBuilderData } from '@/types/resume.unified';

interface ATSOptimizerProps {
  resumeData: ResumeBuilderData;
}

interface OptimizationResult {
  atsScore: number;
  suggestions: string[];
  keywords: string[];
}

export default function ATSOptimizer({ resumeData }: ATSOptimizerProps) {
  const [optimization, setOptimization] = useState<OptimizationResult | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  const analyzeResume = async () => {
    setLoading(true);

    try {
      // Convert resume data to text for analysis
      const resumeText = [
        resumeData.personalInfo.name,
        resumeData.personalInfo.summary || '',
        resumeData.experiences
          ?.map(
            (exp) =>
              `${exp.position} at ${exp.company}: ${exp.description} ${exp.bullets.join(' ')}`
          )
          .join(' ') || '',
        resumeData.education
          ?.map((edu) => `${edu.degree} in ${edu.field} from ${edu.school}`)
          .join(' ') || '',
        resumeData.skills?.join(' ') || '',
      ]
        .filter(Boolean)
        .join(' ');

      const response = await fetch('/api/ai/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeContent: resumeText }),
      });

      const data = await response.json();
      setOptimization(data);
    } catch (error) {
      console.error('Failed to analyze resume:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    return 'Needs Improvement';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          ATS Optimization
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!optimization ? (
          <div className="text-center py-6">
            <p className="text-gray-600 mb-4">
              Analyze your resume for ATS compatibility and get optimization
              suggestions
            </p>
            <Button
              onClick={analyzeResume}
              disabled={loading}
              className="bg-gradient-to-r from-green-500 to-blue-500 text-white border-0 hover:from-green-600 hover:to-blue-600"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Analyze Resume
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* ATS Score */}
            <div className="text-center">
              <div
                className={`text-3xl font-bold ${getScoreColor(optimization.atsScore)}`}
              >
                {optimization.atsScore}/100
              </div>
              <p className="text-sm text-gray-600 mb-2">
                {getScoreLabel(optimization.atsScore)}
              </p>
              <Progress value={optimization.atsScore} className="w-full h-2" />
            </div>

            {/* Suggestions */}
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Improvement Suggestions
              </h4>
              <ul className="space-y-2">
                {optimization.suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Keywords */}
            <div>
              <h4 className="font-semibold mb-3">Recommended Keywords</h4>
              <div className="flex flex-wrap gap-2">
                {optimization.keywords.map((keyword) => (
                  <Badge key={keyword} variant="secondary" className="text-xs">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Re-analyze Button */}
            <Button
              onClick={analyzeResume}
              variant="outline"
              size="sm"
              disabled={loading}
              className="w-full"
            >
              Re-analyze Resume
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
