'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { FileText, Copy, Check } from 'lucide-react';

interface CoverLetterGeneratorProps {
  resumeData: { _id: string; [key: string]: unknown };
}

export default function CoverLetterGenerator({
  resumeData,
}: CoverLetterGeneratorProps) {
  const [jobTitle, setJobTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [generating, setGenerating] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);

  const saveCoverLetter = async () => {
    if (!coverLetter.trim()) return;

    setSaving(true);
    try {
      const response = await fetch('/api/cover-letters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeId: resumeData._id,
          company: companyName,
          position: jobTitle,
          content: coverLetter,
        }),
      });

      if (response.ok) {
        alert('Cover letter saved successfully!');
      }
    } catch (error) {
      console.error('Failed to save cover letter:', error);
      alert('Failed to save cover letter');
    } finally {
      setSaving(false);
    }
  };

  const generateCoverLetter = async () => {
    if (!jobTitle.trim() || !companyName.trim()) return;

    setGenerating(true);
    try {
      const response = await fetch('/api/ai/generate-cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeData,
          jobTitle,
          companyName,
          jobDescription,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setCoverLetter(data.coverLetter);
      }
    } catch (error) {
      console.error('Failed to generate cover letter:', error);
    } finally {
      setGenerating(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(coverLetter);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-indigo-600" />
          AI Cover Letter Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Job Title *</Label>
            <Input
              placeholder="Software Engineer"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
            />
          </div>
          <div>
            <Label>Company Name *</Label>
            <Input
              placeholder="Google"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>
        </div>

        <div>
          <Label>Job Description (Optional)</Label>
          <Textarea
            placeholder="Paste job description for better customization..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            rows={3}
          />
        </div>

        <Button
          onClick={generateCoverLetter}
          disabled={generating || !jobTitle.trim() || !companyName.trim()}
          className="w-full bg-indigo-600 hover:bg-indigo-700"
        >
          {generating ? 'Generating...' : 'Generate Cover Letter'}
        </Button>

        {coverLetter && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Generated Cover Letter</Label>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={saveCoverLetter}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save'}
                </Button>
                <Button variant="outline" size="sm" onClick={copyToClipboard}>
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
              </div>
            </div>
            <Textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              rows={12}
              className="font-mono text-sm"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
