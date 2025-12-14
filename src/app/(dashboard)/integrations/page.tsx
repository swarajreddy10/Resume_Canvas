'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Linkedin,
  Github,
  Mail,
} from 'lucide-react';

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  connected: boolean;
  features: string[];
  status: 'active' | 'inactive' | 'error';
}

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: 'linkedin',
      name: 'LinkedIn',
      description:
        'Import your LinkedIn profile data to auto-fill resume sections',
      icon: <Linkedin className="h-6 w-6 text-blue-600" />,
      connected: false,
      features: ['Profile Import', 'Experience Sync', 'Skills Import'],
      status: 'inactive',
    },
    {
      id: 'github',
      name: 'GitHub',
      description: 'Showcase your repositories and contributions',
      icon: <Github className="h-6 w-6" />,
      connected: true,
      features: ['Repository List', 'Contribution Stats', 'Project Import'],
      status: 'active',
    },
    {
      id: 'email',
      name: 'Email Marketing',
      description: 'Send your resume via integrated email campaigns',
      icon: <Mail className="h-6 w-6 text-green-600" />,
      connected: false,
      features: ['Email Templates', 'Campaign Tracking', 'Analytics'],
      status: 'inactive',
    },
  ]);

  const handleToggleIntegration = (id: string) => {
    setIntegrations((prev) =>
      prev.map((integration) =>
        integration.id === id
          ? {
              ...integration,
              connected: !integration.connected,
              status: !integration.connected ? 'active' : 'inactive',
            }
          : integration
      )
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'error':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Integrations</h1>
        <p className="text-gray-600">
          Connect external services to enhance your resume building experience
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((integration) => (
          <Card
            key={integration.id}
            className="hover:shadow-md transition-shadow"
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {integration.icon}
                  <div>
                    <CardTitle className="text-lg">
                      {integration.name}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      {getStatusIcon(integration.status)}
                      <Badge
                        variant={getStatusColor(integration.status)}
                        className="text-xs"
                      >
                        {integration.status}
                      </Badge>
                    </div>
                  </div>
                </div>
                <Switch
                  checked={integration.connected}
                  onCheckedChange={() =>
                    handleToggleIntegration(integration.id)
                  }
                />
              </div>
              <CardDescription className="mt-2">
                {integration.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Features</h4>
                <div className="space-y-1">
                  {integration.features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-sm text-muted-foreground"
                    >
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                {integration.connected ? (
                  <>
                    <Button size="sm" variant="outline" className="flex-1">
                      Configure
                    </Button>
                    <Button size="sm" variant="outline">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={() => handleToggleIntegration(integration.id)}
                  >
                    Connect
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* API Access Section */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>API Access</CardTitle>
          <CardDescription>
            Integrate CareerCanvas with your own applications using our REST API
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">API Key</h4>
              <p className="text-sm text-muted-foreground">
                Use this key to authenticate API requests
              </p>
            </div>
            <Button variant="outline">Generate API Key</Button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Webhook URL</h4>
              <p className="text-sm text-muted-foreground">
                Receive notifications when resumes are updated
              </p>
            </div>
            <Button variant="outline">Configure Webhooks</Button>
          </div>

          <div className="pt-4 border-t">
            <Button variant="outline" className="w-full">
              <ExternalLink className="h-4 w-4 mr-2" />
              View API Documentation
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
