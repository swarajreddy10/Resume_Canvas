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
import { TemplateType, TEMPLATE_SAMPLE_DATA } from './templateLibrary';
import { ResumeData } from '@/types/resume.unified';

interface TemplatePreviewProps {
  template: TemplateType;
  data: ResumeData | Record<string, unknown>;
}

export default function TemplatePreview({
  template,
  data,
}: TemplatePreviewProps) {
  const [open, setOpen] = useState(false);
  const previewData =
    data &&
    typeof data === 'object' &&
    'personalInfo' in (data as Record<string, unknown>)
      ? (data as ResumeData)
      : TEMPLATE_SAMPLE_DATA[template];

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
