'use client';

import TemplateRenderer from './TemplateRenderer';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Check, Sparkles } from 'lucide-react';
import { ResumeData } from '@/types/resume.unified';
import {
  TEMPLATE_SAMPLE_DATA,
  TEMPLATES,
  TemplateType,
} from '@/components/resume/templateLibrary';

export default function TemplateSelector({
  selectedTemplate,
  onTemplateChange,
  onTemplateSelect,
  resumeData,
}: {
  selectedTemplate: TemplateType;
  onTemplateChange?: (template: TemplateType) => void;
  onTemplateSelect?: (template: string) => void;
  resumeData?: ResumeData;
}) {
  const handleSelect = (template: TemplateType) => {
    if (onTemplateChange) onTemplateChange(template);
    if (onTemplateSelect) onTemplateSelect(template);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">
              Choose Your Template
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-gray-600">
            Select a professional design that matches your style
          </p>
        </div>
      </div>
      <Carousel className="w-full" opts={{ align: 'start', loop: true }}>
        <CarouselContent className="-ml-4">
          {TEMPLATES.map((template) => (
            <CarouselItem
              key={template.id}
              className="pl-4 md:basis-1/2 lg:basis-1/3"
            >
              <Card
                className={`group w-full cursor-pointer transition-all duration-300 ${
                  selectedTemplate === template.id
                    ? 'ring-2 ring-blue-500 shadow-xl'
                    : 'hover:shadow-lg hover:scale-[1.01]'
                }`}
                onClick={() => handleSelect(template.id)}
              >
                <CardContent className="p-0">
                  <div className="relative h-[280px] sm:h-[320px] bg-white overflow-hidden">
                    {selectedTemplate === template.id && (
                      <div className="absolute left-3 top-3 z-10 bg-blue-500 text-white rounded-full p-1.5 shadow-lg">
                        <Check className="h-4 w-4" />
                      </div>
                    )}
                    <div className="h-full w-full overflow-hidden">
                      <div
                        className="transform scale-[0.35] origin-top-left"
                        style={{ width: '286%', height: '286%' }}
                      >
                        <TemplateRenderer
                          template={template.id}
                          data={resumeData || TEMPLATE_SAMPLE_DATA[template.id]}
                        />
                      </div>
                    </div>
                  </div>
                  <div
                    className={`p-3 sm:p-4 border-t transition-colors ${
                      selectedTemplate === template.id
                        ? 'bg-blue-50 border-blue-200'
                        : 'bg-white group-hover:bg-gray-50'
                    }`}
                  >
                    <h4 className="font-semibold text-sm sm:text-base text-gray-900 mb-1">
                      {template.name}
                    </h4>
                    <p className="text-[11px] sm:text-xs text-gray-600 leading-relaxed">
                      {template.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="-left-4" />
        <CarouselNext className="-right-4" />
      </Carousel>
    </div>
  );
}
