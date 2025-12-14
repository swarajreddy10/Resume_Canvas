'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

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
    id: 'modern',
    name: 'Modern Professional',
    category: 'Professional',
    preview: '/templates/modern-preview.jpg',
    description: 'Clean, modern design perfect for tech and creative roles',
    features: ['ATS-Friendly', 'Clean Layout', 'Modern Typography'],
  },
  {
    id: 'classic',
    name: 'Classic Executive',
    category: 'Executive',
    preview: '/templates/classic-preview.jpg',
    description:
      'Traditional format ideal for corporate and executive positions',
    features: ['Professional', 'Traditional', 'Executive-Ready'],
  },
  {
    id: 'minimal',
    name: 'Minimal Clean',
    category: 'Creative',
    preview: '/templates/minimal-preview.jpg',
    description: 'Minimalist design that highlights your content',
    features: ['Minimalist', 'Content-Focused', 'Elegant'],
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
  const [selectedCategory, setSelectedCategory] = useState('All');
  const categories = ['All', 'Professional', 'Executive', 'Creative'];

  const filteredTemplates =
    selectedCategory === 'All'
      ? templates
      : templates.filter((t) => t.category === selectedCategory);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Choose Your Template</h3>
        <p className="text-gray-600 text-sm">
          Select a professional template that matches your industry
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map((template) => (
          <Card
            key={template.id}
            className={cn(
              'cursor-pointer transition-all hover:shadow-md',
              selectedTemplate === template.id && 'ring-2 ring-blue-500'
            )}
            onClick={() => onTemplateSelect(template.id)}
          >
            <CardContent className="p-0">
              {/* Template Preview */}
              <div className="relative aspect-[3/4] bg-gray-100 rounded-t-lg overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
                  <div className="text-center p-4">
                    <div className="w-full h-32 bg-white rounded shadow-sm mb-2 flex items-center justify-center">
                      <span className="text-xs text-gray-400">
                        {template.name} Preview
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div className="h-2 bg-gray-300 rounded w-3/4 mx-auto"></div>
                      <div className="h-2 bg-gray-200 rounded w-1/2 mx-auto"></div>
                    </div>
                  </div>
                </div>
                {selectedTemplate === template.id && (
                  <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1">
                    <Check className="h-3 w-3" />
                  </div>
                )}
              </div>

              {/* Template Info */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{template.name}</h4>
                  <Badge variant="secondary" className="text-xs">
                    {template.category}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  {template.description}
                </p>
                <div className="flex flex-wrap gap-1">
                  {template.features.map((feature) => (
                    <Badge key={feature} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
