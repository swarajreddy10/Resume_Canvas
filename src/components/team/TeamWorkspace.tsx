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
import { Users, Plus, Crown, MessageSquare } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'member' | 'viewer';
  avatar?: string;
}

interface Team {
  id: string;
  name: string;
  description: string;
  members: TeamMember[];
  resumeCount: number;
  createdAt: string;
}

export default function TeamWorkspace() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      // Mock data for demo
      setTeams([
        {
          id: '1',
          name: 'Engineering Team',
          description: 'Software engineering resumes and templates',
          members: [
            {
              id: '1',
              name: 'John Doe',
              email: 'john@company.com',
              role: 'admin',
            },
            {
              id: '2',
              name: 'Jane Smith',
              email: 'jane@company.com',
              role: 'member',
            },
            {
              id: '3',
              name: 'Bob Wilson',
              email: 'bob@company.com',
              role: 'viewer',
            },
          ],
          resumeCount: 12,
          createdAt: '2024-01-15',
        },
        {
          id: '2',
          name: 'HR Department',
          description: 'HR team collaboration workspace',
          members: [
            {
              id: '4',
              name: 'Alice Johnson',
              email: 'alice@company.com',
              role: 'admin',
            },
            {
              id: '5',
              name: 'Mike Brown',
              email: 'mike@company.com',
              role: 'member',
            },
          ],
          resumeCount: 8,
          createdAt: '2024-02-01',
        },
      ]);
    } catch (error) {
      console.error('Failed to fetch teams:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'default';
      case 'member':
        return 'secondary';
      case 'viewer':
        return 'outline';
      default:
        return 'outline';
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
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
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Team Workspaces</h2>
          <p className="text-muted-foreground">
            Collaborate on resumes with your team
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Team
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {teams.map((team) => (
          <Card key={team.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    {team.name}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {team.description}
                  </CardDescription>
                </div>
                <Badge variant="outline">{team.resumeCount} resumes</Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Team Members</h4>
                <div className="space-y-2">
                  {team.members.slice(0, 3).map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium">
                          {member.name.charAt(0)}
                        </div>
                        <span className="text-sm">{member.name}</span>
                      </div>
                      <Badge
                        variant={getRoleColor(member.role)}
                        className="text-xs"
                      >
                        {member.role === 'admin' && (
                          <Crown className="h-3 w-3 mr-1" />
                        )}
                        {member.role}
                      </Badge>
                    </div>
                  ))}
                  {team.members.length > 3 && (
                    <p className="text-xs text-muted-foreground">
                      +{team.members.length - 3} more members
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <Button size="sm" className="flex-1">
                  View Workspace
                </Button>
                <Button size="sm" variant="outline">
                  <MessageSquare className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {teams.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No teams yet
          </h3>
          <p className="text-gray-600 mb-4">
            Create your first team to start collaborating
          </p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Team
          </Button>
        </div>
      )}
    </div>
  );
}
