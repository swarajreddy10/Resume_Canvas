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
    if (score >= 90) return 'Exceptional - FAANG Ready';
    if (score >= 80) return 'Excellent - Highly Competitive';
    if (score >= 70) return 'Good - Solid Foundation';
    if (score >= 60) return 'Average - Needs Work';
    if (score >= 50) return 'Below Average - Significant Gaps';
    return 'Poor - Major Overhaul Needed';
  };

  const getScoreDescription = (score: number) => {
    if (score >= 90)
      return 'Your resume will pass most ATS systems and catch recruiter attention.';
    if (score >= 80)
      return 'Strong resume that should perform well in ATS screening.';
    if (score >= 70)
      return 'Decent resume but could be more competitive with improvements.';
    if (score >= 60)
      return 'Your resume may pass basic ATS but needs enhancement for competitive roles.';
    if (score >= 50)
      return 'Likely to be filtered out by ATS. Significant improvements needed.';
    return 'Will be rejected by most ATS systems. Requires complete restructuring.';
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
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border-2 border-blue-200">
              <div
                className={`text-5xl font-bold mb-2 ${getScoreColor(optimization.atsScore)}`}
              >
                {optimization.atsScore}/100
              </div>
              <p
                className={`text-lg font-semibold mb-2 ${getScoreColor(optimization.atsScore)}`}
              >
                {getScoreLabel(optimization.atsScore)}
              </p>
              <p className="text-sm text-gray-700 mb-3">
                {getScoreDescription(optimization.atsScore)}
              </p>
              <Progress value={optimization.atsScore} className="w-full h-3" />
            </div>

            {/* Suggestions */}
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
              <h4 className="font-semibold mb-3 flex items-center gap-2 text-yellow-900">
                <TrendingUp className="h-5 w-5" />
                Critical Improvements Needed
              </h4>
              <ul className="space-y-3">
                {optimization.suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-sm bg-white p-3 rounded border border-yellow-200"
                  >
                    <span className="text-yellow-600 font-bold mt-0.5 text-lg">
                      {index + 1}.
                    </span>
                    <span className="text-gray-800 leading-relaxed">
                      {suggestion}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Keywords */}
            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
              <h4 className="font-semibold mb-2 text-green-900">
                Missing Keywords to Add
              </h4>
              <p className="text-xs text-green-800 mb-3">
                These industry-relevant keywords are missing or underutilized in
                your resume. Adding them will improve ATS matching.
              </p>
              <div className="flex flex-wrap gap-2">
                {optimization.keywords.map((keyword) => (
                  <Badge
                    key={keyword}
                    className="text-xs bg-green-100 text-green-800 border border-green-300 hover:bg-green-200 cursor-pointer"
                  >
                    + {keyword}
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
