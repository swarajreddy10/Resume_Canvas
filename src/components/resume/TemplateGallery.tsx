'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import TemplateRenderer from './TemplateRenderer';
import { DUMMY_RESUME_DATA } from '@/lib/constants/dummyResumeData';

interface Template {
  id: string;
  name: string;
  category: string;
  preview: string;
  description: string;
  features: string[];
}

const templates: Template[] = [
  {
    id: 'executive',
    name: 'Executive ATS',
    category: 'Executive',
    preview: '/templates/executive-preview.jpg',
    description:
      'Traditional serif design for senior leadership and C-level positions',
    features: [
      'ATS-Optimized',
      'Executive',
      'Serif Typography',
      'Leadership Focus',
    ],
  },
  {
    id: 'tech',
    name: 'Tech Professional',
    category: 'Professional',
    preview: '/templates/tech-preview.jpg',
    description:
      'Modern sans-serif layout optimized for software engineers and developers',
    features: ['ATS-Optimized', 'Skills Prominent', 'Project Focused', 'Clean'],
  },
  {
    id: 'corporate',
    name: 'Corporate Standard',
    category: 'Professional',
    preview: '/templates/corporate-preview.jpg',
    description:
      'Conservative design perfect for finance, consulting, and business roles',
    features: ['ATS-Optimized', 'Professional', 'Traditional', 'Balanced'],
  },
  {
    id: 'creative',
    name: 'Creative Professional',
    category: 'Creative',
    preview: '/templates/creative-preview.jpg',
    description:
      'Modern design with subtle accents for marketing and creative positions',
    features: ['ATS-Optimized', 'Portfolio Ready', 'Modern', 'Subtle Color'],
  },
  {
    id: 'academic',
    name: 'Academic Research',
    category: 'Academic',
    preview: '/templates/academic-preview.jpg',
    description:
      'Formal serif layout for researchers, professors, and academic positions',
    features: [
      'ATS-Optimized',
      'Research Focus',
      'Formal',
      'Publication Ready',
    ],
  },
];

interface TemplateGalleryProps {
  selectedTemplate: string;
  onTemplateSelect: (templateId: string) => void;
}

export default function TemplateGallery({
  selectedTemplate,
  onTemplateSelect,
}: TemplateGalleryProps) {
  const [previewTemplate, setPreviewTemplate] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2">Choose Your Template</h3>
        <p className="text-gray-600">
          We&apos;ll help you choose the right layout for your resume from{' '}
          {templates.length} available templates. Each is instantly ready to use
          and requires no design skills.
        </p>
      </div>

      {/* Full-Width Template Carousel */}
      <div className="relative py-8">
        <Carousel
          opts={{
            align: 'center',
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-6">
            {templates.map((template) => (
              <CarouselItem
                key={template.id}
                className="pl-6 basis-full md:basis-1/2 lg:basis-1/3"
              >
                <Card
                  className={cn(
                    'group transition-all duration-300 ease-out cursor-pointer border-2',
                    'hover:shadow-xl hover:-translate-y-1',
                    selectedTemplate === template.id
                      ? 'border-blue-500 shadow-xl ring-2 ring-blue-200'
                      : 'border-gray-200 shadow-md hover:border-blue-300'
                  )}
                  onClick={() => onTemplateSelect(template.id)}
                >
                  <CardContent className="p-0">
                    {/* Full Template Preview */}
                    <div className="relative h-[400px] bg-white rounded-t-lg overflow-hidden">
                      {/* Live Template Preview - Stretched to fill width */}
                      <div className="absolute inset-0 flex items-start justify-center overflow-hidden">
                        <div className="transform scale-[0.55] origin-top pointer-events-none w-full transition-transform duration-300 group-hover:scale-[0.56]">
                          <TemplateRenderer
                            template={
                              template.id as
                                | 'executive'
                                | 'tech'
                                | 'corporate'
                                | 'creative'
                                | 'academic'
                            }
                            data={DUMMY_RESUME_DATA}
                          />
                        </div>
                      </div>

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {/* Selection Indicator */}
                      {selectedTemplate === template.id && (
                        <div className="absolute top-4 right-4 bg-blue-500 rounded-full p-2 shadow-lg animate-in fade-in zoom-in duration-200">
                          <Check
                            className="h-5 w-5 text-white"
                            strokeWidth={2.5}
                          />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="-left-6 h-14 w-14 border-2 hover:scale-110 transition-transform" />
          <CarouselNext className="-right-6 h-14 w-14 border-2 hover:scale-110 transition-transform" />
        </Carousel>
      </div>

      {/* Full Preview Dialog */}
      <Dialog
        open={!!previewTemplate}
        onOpenChange={() => setPreviewTemplate(null)}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {templates.find((t) => t.id === previewTemplate)?.name} Preview
            </DialogTitle>
          </DialogHeader>
          <div className="bg-white rounded-lg shadow-lg">
            {previewTemplate && (
              <TemplateRenderer
                template={
                  previewTemplate as
                    | 'executive'
                    | 'tech'
                    | 'corporate'
                    | 'creative'
                    | 'academic'
                }
                data={DUMMY_RESUME_DATA}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
