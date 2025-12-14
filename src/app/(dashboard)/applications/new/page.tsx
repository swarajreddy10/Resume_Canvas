'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import InterviewPrep from '@/components/jobs/InterviewPrep';

export const dynamic = 'force-dynamic';

export default function NewApplicationPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    jobTitle: '',
    company: '',
    location: '',
    jobUrl: '',
    description: '',
    salary: '',
    status: 'applied',
    notes: '',
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/applications');
      }
    } catch (error) {
      console.error('Failed to save application:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Add Job Application</h1>
        <p className="text-gray-600">Track a new job application</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Application Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Job Title *</Label>
                  <Input
                    value={formData.jobTitle}
                    onChange={(e) => handleChange('jobTitle', e.target.value)}
                    placeholder="Software Engineer"
                    required
                  />
                </div>
                <div>
                  <Label>Company *</Label>
                  <Input
                    value={formData.company}
                    onChange={(e) => handleChange('company', e.target.value)}
                    placeholder="Google"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Location</Label>
                  <Input
                    value={formData.location}
                    onChange={(e) => handleChange('location', e.target.value)}
                    placeholder="San Francisco, CA"
                  />
                </div>
                <div>
                  <Label>Salary</Label>
                  <Input
                    value={formData.salary}
                    onChange={(e) => handleChange('salary', e.target.value)}
                    placeholder="$120,000 - $150,000"
                  />
                </div>
              </div>

              <div>
                <Label>Job URL</Label>
                <Input
                  value={formData.jobUrl}
                  onChange={(e) => handleChange('jobUrl', e.target.value)}
                  placeholder="https://..."
                />
              </div>

              <div>
                <Label>Job Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Paste job description here..."
                  rows={4}
                />
              </div>

              <div>
                <Label>Notes</Label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  placeholder="Additional notes..."
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={saving} className="flex-1">
                  <Plus className="h-4 w-4 mr-2" />
                  {saving ? 'Saving...' : 'Add Application'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div>
          <InterviewPrep
            jobTitle={formData.jobTitle}
            company={formData.company}
          />
        </div>
      </div>
    </div>
  );
}
