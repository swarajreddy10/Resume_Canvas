'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Check } from 'lucide-react';
import TemplatePreview from './TemplatePreview';

export type TemplateType = 'modern' | 'classic' | 'minimal';

import { ResumeData } from '@/types/resume.unified';

interface TemplateSelectorProps {
  selectedTemplate: TemplateType;
  onTemplateChange: (template: TemplateType) => void;
  resumeData?: ResumeData | Record<string, unknown>;
}

const templates = [
  {
    id: 'modern' as TemplateType,
    name: 'Modern',
    description: 'Professional with gradient header',
    preview: '/api/placeholder/150/200',
  },
  {
    id: 'classic' as TemplateType,
    name: 'Classic',
    description: 'Traditional serif layout',
    preview: '/api/placeholder/150/200',
  },
  {
    id: 'minimal' as TemplateType,
    name: 'Minimal',
    description: 'Clean and simple design',
    preview: '/api/placeholder/150/200',
  },
];

export default function TemplateSelector({
  selectedTemplate,
  onTemplateChange,
}: TemplateSelectorProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Choose Template</h3>
      <div className="grid grid-cols-3 gap-4">
        {templates.map((template) => (
          <Card
            key={template.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedTemplate === template.id ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => onTemplateChange(template.id)}
          >
            <CardContent className="p-4">
              <div className="aspect-[3/4] bg-white border rounded mb-3 overflow-hidden relative">
                <div className="transform scale-[0.3] origin-top-left w-[333%] h-[333%]">
                  <TemplatePreview
                    template={template.id}
                    data={
                      {
                        personalInfo: {
                          name:
                            template.id === 'modern'
                              ? 'Alex'
                              : template.id === 'classic'
                                ? 'Sam'
                                : 'Jordan',
                          email: 'email@example.com',
                          phone: '(555) 123-4567',
                          address: 'City, ST',
                          summary:
                            'Professional with experience in software development.',
                        },
                        experience: [
                          {
                            company: 'Tech Co',
                            position: 'Developer',
                            location: 'City, ST',
                            startDate: '2022',
                            endDate: 'Present',
                            description: 'Software development',
                            bullets: ['Built web apps', 'Led projects'],
                          },
                        ],
                        education: [
                          {
                            school: 'University',
                            degree: 'BS',
                            field: 'Computer Science',
                            startDate: '2018',
                            endDate: '2022',
                            location: 'City, ST',
                          },
                        ],
                        skills: ['JavaScript', 'React', 'Python'],
                        projects: [],
                        certifications: [],
                      } as ResumeData
                    }
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-sm">{template.name}</h4>
                  <p className="text-xs text-gray-600">
                    {template.description}
                  </p>
                </div>
                {selectedTemplate === template.id && (
                  <Check className="h-4 w-4 text-blue-500" />
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
