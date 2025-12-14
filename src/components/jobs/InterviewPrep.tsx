'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Lightbulb, Clock } from 'lucide-react';

interface Question {
  question: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tips: string[];
}

interface InterviewPrepProps {
  jobTitle?: string;
  company?: string;
}

export default function InterviewPrep({
  jobTitle,
  company,
}: InterviewPrepProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [generating, setGenerating] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
    null
  );

  const generateQuestions = async () => {
    setGenerating(true);
    try {
      const response = await fetch('/api/ai/interview-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobTitle, company }),
      });

      if (response.ok) {
        const data = await response.json();
        setQuestions(data.questions);
      }
    } catch (error) {
      console.error('Failed to generate questions:', error);
    } finally {
      setGenerating(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-blue-600" />
            Interview Preparation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input placeholder="Job Title" value={jobTitle || ''} readOnly />
            <Input placeholder="Company" value={company || ''} readOnly />
          </div>

          <Button
            onClick={generateQuestions}
            disabled={generating}
            className="w-full"
          >
            {generating
              ? 'Generating Questions...'
              : 'Generate Interview Questions'}
          </Button>
        </CardContent>
      </Card>

      {questions.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Practice Questions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {questions.map((q, index) => (
                <div
                  key={index}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedQuestion === q
                      ? 'bg-blue-50 border-blue-200'
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedQuestion(q)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="outline" className="text-xs">
                      {q.category}
                    </Badge>
                    <Badge
                      className={`${getDifficultyColor(q.difficulty)} text-xs`}
                    >
                      {q.difficulty}
                    </Badge>
                  </div>
                  <p className="text-sm font-medium">{q.question}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {selectedQuestion && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-yellow-600" />
                  Answer Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">
                    {selectedQuestion.question}
                  </h4>
                  <div className="flex gap-2 mb-4">
                    <Badge variant="outline">{selectedQuestion.category}</Badge>
                    <Badge
                      className={getDifficultyColor(
                        selectedQuestion.difficulty
                      )}
                    >
                      {selectedQuestion.difficulty}
                    </Badge>
                  </div>
                </div>

                <div>
                  <h5 className="font-medium mb-2 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Tips for answering:
                  </h5>
                  <ul className="space-y-2">
                    {selectedQuestion.tips.map((tip, index) => (
                      <li
                        key={index}
                        className="text-sm text-gray-700 flex items-start gap-2"
                      >
                        <span className="text-blue-600 mt-1">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
