'use client';

import TemplateShowcase from './TemplateShowcase';
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
import { TEMPLATES, TemplateType } from '@/components/resume/templateLibrary';
import { getTemplatePreviewData } from './templateDataHelper';

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
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-[#4f46e5]" />
        <div>
          <h3 className="text-base sm:text-lg font-bold text-[#11101d] leading-tight">
            Choose Your Template
          </h3>
          <p className="text-xs text-[#64748b] mt-0.5">
            Select a design that matches your style
          </p>
        </div>
      </div>

      {/* Carousel — padded so arrows don't overflow on mobile */}
      <div className="relative px-8 sm:px-10">
        <Carousel className="w-full" opts={{ align: 'start', loop: true }}>
          <CarouselContent className="-ml-3">
            {TEMPLATES.map((template) => {
              const isActive = selectedTemplate === template.id;
              return (
                <CarouselItem
                  key={template.id}
                  className="pl-3 basis-full sm:basis-1/2 lg:basis-1/3"
                >
                  <Card
                    className={`group w-full cursor-pointer transition-all duration-200 overflow-hidden ${
                      isActive
                        ? 'ring-2 ring-[#4f46e5] shadow-lg shadow-[#4f46e5]/15'
                        : 'border-[#e2e8f0] hover:border-[#c7d2fe] hover:shadow-md'
                    }`}
                    onClick={() => handleSelect(template.id)}
                  >
                    <CardContent className="p-0">
                      {/* Preview area — fixed height, properly clipped */}
                      <div className="relative h-[220px] sm:h-[280px] bg-white overflow-hidden">
                        {/* Active checkmark */}
                        {isActive && (
                          <div className="absolute left-2.5 top-2.5 z-10 bg-[#4f46e5] text-white rounded-full p-1 shadow-md">
                            <Check className="h-3.5 w-3.5" />
                          </div>
                        )}
                        {/* Active top accent bar */}
                        {isActive && (
                          <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#4f46e5] z-10" />
                        )}
                        <TemplateShowcase
                          template={template.id}
                          data={getTemplatePreviewData(template.id, resumeData)}
                          mode="selector"
                          className="h-full w-full"
                          frameClassName="w-full h-full bg-white overflow-hidden border-0 shadow-none rounded-none"
                          showFade={false}
                          maxHeight="none"
                        />
                      </div>

                      {/* Label */}
                      <div
                        className={`px-3 py-2.5 border-t transition-colors ${
                          isActive
                            ? 'bg-[#eef2ff] border-[#c7d2fe]'
                            : 'bg-white border-[#e2e8f0] group-hover:bg-[#f5f3ff]'
                        }`}
                      >
                        <h4
                          className={`font-semibold text-sm leading-tight ${isActive ? 'text-[#4f46e5]' : 'text-[#11101d]'}`}
                        >
                          {template.name}
                        </h4>
                        <p className="text-[11px] text-[#64748b] mt-0.5 leading-snug line-clamp-2">
                          {template.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              );
            })}
          </CarouselContent>

          {/* Arrows inside the padding zone — never overflow viewport */}
          <CarouselPrevious className="left-0 bg-white border-[#e2e8f0] hover:bg-[#eef2ff] hover:border-[#c7d2fe] text-[#11101d] h-8 w-8" />
          <CarouselNext className="right-0 bg-white border-[#e2e8f0] hover:bg-[#eef2ff] hover:border-[#c7d2fe] text-[#11101d] h-8 w-8" />
        </Carousel>
      </div>
    </div>
  );
}
