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
import TemplateShowcase from './TemplateShowcase';
import { TemplateType, TEMPLATES } from './templateLibrary';
import { ResumeData } from '@/types/resume.unified';
import { getTemplatePreviewData } from './templateDataHelper';

interface TemplatePreviewProps {
  template: TemplateType;
  data?: ResumeData | Record<string, unknown>;
}

export default function TemplatePreview({
  template,
  data,
}: TemplatePreviewProps) {
  const [open, setOpen] = useState(false);
  const templateMeta = TEMPLATES.find((t) => t.id === template);
  const previewData = getTemplatePreviewData(
    template,
    data && typeof data === 'object' && 'personalInfo' in data
      ? (data as ResumeData)
      : undefined
  );

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
          <DialogTitle>
            {templateMeta?.name || template} Template Preview
          </DialogTitle>
        </DialogHeader>
        <TemplateShowcase
          template={template}
          data={previewData}
          mode="preview"
          className="w-full"
          frameClassName="border-0 shadow-none px-0 py-0"
          showFade={false}
          maxHeight="none"
        />
      </DialogContent>
    </Dialog>
  );
}
