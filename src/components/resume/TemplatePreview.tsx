'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import TemplateRenderer from './TemplateRenderer';
import { TemplateType } from './TemplateSelector';
import { ResumeData } from '@/types/resume.unified';

interface TemplatePreviewProps {
  template: TemplateType;
  data: ResumeData | Record<string, unknown>;
}

const sampleData: ResumeData = {
  personalInfo: {
    name: 'John Doe',
    email: 'john.doe@email.com',
    phone: '+1 (555) 123-4567',
    address: 'San Francisco, CA',
    summary:
      'Experienced software engineer with 5+ years in full-stack development.',
  },
  experience: [
    {
      company: 'Tech Corp',
      position: 'Senior Developer',
      location: 'San Francisco, CA',
      startDate: 'Jan 2020',
      endDate: 'Present',
      description: 'Lead development of web applications',
      bullets: ['Improved performance by 40%', 'Led team of 5 developers'],
    },
  ],
  education: [
    {
      school: 'University of Technology',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      location: 'San Francisco, CA',
      startDate: '2016',
      endDate: '2020',
      gpa: '3.8',
    },
  ],
  skills: ['JavaScript', 'React', 'Node.js', 'Python', 'AWS'],
};

export default function TemplatePreview({
  template,
  data,
}: TemplatePreviewProps) {
  const [open, setOpen] = useState(false);
  const previewData = (data as ResumeData).personalInfo
    ? (data as ResumeData)
    : sampleData;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Eye className="h-4 w-4 mr-1" />
          Preview
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="capitalize">
            {template} Template Preview
          </DialogTitle>
        </DialogHeader>
        <div className="transform scale-75 origin-top">
          <TemplateRenderer template={template} data={previewData} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
