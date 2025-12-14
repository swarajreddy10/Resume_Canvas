'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Lightbulb,
  TrendingUp,
  Target,
  Briefcase,
  DollarSign,
} from 'lucide-react';

interface CareerRecommendation {
  id: string;
  title: string;
  description: string;
  matchScore: number;
  salaryRange: string;
  growthRate: string;
  requiredSkills: string[];
  missingSkills: string[];
}

interface SkillGap {
  skill: string;
  currentLevel: number;
  requiredLevel: number;
  priority: 'high' | 'medium' | 'low';
}

export default function CareerRecommendations() {
  const [recommendations, setRecommendations] = useState<
    CareerRecommendation[]
  >([]);
  const [skillGaps, setSkillGaps] = useState<SkillGap[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      // Mock data for demo
      setRecommendations([
        {
          id: '1',
          title: 'Senior Software Engineer',
          description: 'Lead development of scalable web applications',
          matchScore: 85,
          salaryRange: '$120k - $180k',
          growthRate: '+15%',
          requiredSkills: ['React', 'Node.js', 'TypeScript', 'AWS'],
          missingSkills: ['Kubernetes', 'GraphQL'],
        },
        {
          id: '2',
          title: 'Full Stack Developer',
          description: 'Build end-to-end web solutions',
          matchScore: 78,
          salaryRange: '$90k - $140k',
          growthRate: '+12%',
          requiredSkills: ['JavaScript', 'Python', 'SQL', 'Docker'],
          missingSkills: ['MongoDB', 'Redis'],
        },
        {
          id: '3',
          title: 'DevOps Engineer',
          description: 'Manage infrastructure and deployment pipelines',
          matchScore: 65,
          salaryRange: '$110k - $160k',
          growthRate: '+20%',
          requiredSkills: ['AWS', 'Docker', 'Kubernetes', 'Terraform'],
          missingSkills: ['Ansible', 'Jenkins', 'Monitoring'],
        },
      ]);

      setSkillGaps([
        {
          skill: 'Kubernetes',
          currentLevel: 2,
          requiredLevel: 8,
          priority: 'high',
        },
        {
          skill: 'GraphQL',
          currentLevel: 3,
          requiredLevel: 7,
          priority: 'medium',
        },
        {
          skill: 'MongoDB',
          currentLevel: 5,
          requiredLevel: 8,
          priority: 'medium',
        },
        {
          skill: 'Terraform',
          currentLevel: 1,
          requiredLevel: 7,
          priority: 'low',
        },
      ]);
    } catch (error) {
      console.error('Failed to fetch recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMatchColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'secondary';
      case 'low':
        return 'outline';
      default:
        return 'outline';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">AI Career Recommendations</h2>
        <p className="text-muted-foreground">
          Personalized career paths based on your skills and experience
        </p>
      </div>

      {/* Career Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {recommendations.map((rec) => (
          <Card key={rec.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    {rec.title}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {rec.description}
                  </CardDescription>
                </div>
                <div className="text-right">
                  <div
                    className={`w-3 h-3 rounded-full ${getMatchColor(rec.matchScore)} mb-1`}
                  ></div>
                  <span className="text-sm font-medium">
                    {rec.matchScore}% match
                  </span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  <span>{rec.salaryRange}</span>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-4 w-4" />
                  <span>{rec.growthRate} growth</span>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Required Skills</h4>
                <div className="flex flex-wrap gap-1">
                  {rec.requiredSkills.map((skill) => (
                    <Badge key={skill} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {rec.missingSkills.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Skills to Learn</h4>
                  <div className="flex flex-wrap gap-1">
                    {rec.missingSkills.map((skill) => (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className="text-xs"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <Button size="sm" className="w-full">
                <Target className="h-4 w-4 mr-2" />
                Set as Career Goal
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Skills Gap Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Skills Gap Analysis
          </CardTitle>
          <CardDescription>
            Identify skills to focus on for your career advancement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {skillGaps.map((gap, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{gap.skill}</span>
                  <Badge
                    variant={getPriorityColor(gap.priority)}
                    className="text-xs"
                  >
                    {gap.priority} priority
                  </Badge>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Current: {gap.currentLevel}/10</span>
                    <span>Required: {gap.requiredLevel}/10</span>
                  </div>
                  <Progress
                    value={(gap.currentLevel / gap.requiredLevel) * 100}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
