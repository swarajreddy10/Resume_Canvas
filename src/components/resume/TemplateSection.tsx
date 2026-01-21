'use client';

import TemplateRenderer from '@/components/resume/TemplateRenderer';
import { getTemplatePreviewData } from '@/components/resume/templateDataHelper';
import { TEMPLATES } from '@/components/resume/templateLibrary';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { ArrowRight, Check } from 'lucide-react';

const TEMPLATE_FEATURES = [
  'ATS-Optimized',
  'Print-Ready',
  'Recruiter Friendly',
];

export default function TemplateSection() {
  const items = TEMPLATES;

  const carouselOpts = {
    align: 'start' as const,
    loop: true,
    slidesToScroll: 1,
    duration: 300,
    skipSnaps: false,
    containScroll: 'trimSnaps' as const,
  };

  return (
    <section
      id="templates"
      className="relative py-24 px-4 sm:px-6 overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-100/80 via-white to-white" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.15)_1px,_transparent_1px)] bg-[length:30px_30px]" />
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <Badge className="mb-4 px-5 py-2 text-sm uppercase tracking-[0.3em] bg-white/80 text-slate-600 border border-white/70 shadow-sm">
          Professional Templates
        </Badge>
        <h2 className="text-4xl md:text-6xl font-black mb-4 text-slate-900">
          A framed carousel of premium resume layouts
        </h2>
        <p className="text-lg text-slate-500 max-w-3xl mx-auto">
          Scroll through three highlighted templates, each rendered inside the
          same preview card you already use across the app.
        </p>
      </div>

      <div className="relative z-10 mt-12 max-w-6xl mx-auto px-4">
        <Carousel opts={carouselOpts} className="relative">
          <CarouselContent className="-ml-1 -mr-1">
            {items.map((template) => (
              <CarouselItem
                key={template.id}
                className="pl-1 pr-1 basis-full sm:basis-1/2 lg:basis-1/3"
              >
                <Card className="rounded-[32px] border border-white/80 bg-white/80 shadow-[0_25px_60px_rgba(15,23,42,0.15)] backdrop-blur-lg overflow-hidden">
                  <CardContent className="flex flex-col gap-4 p-6">
                    <div className="mx-auto w-full max-w-[360px] h-[480px] bg-white rounded-[20px] border border-slate-200 shadow-lg overflow-hidden">
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-[320px] h-[420px] overflow-hidden">
                          <div className="transform scale-[0.39] origin-top-left transform w-4/2">
                            <TemplateRenderer
                              template={template.id}
                              data={getTemplatePreviewData(template.id)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs uppercase tracking-[0.4em] text-slate-500">
                          {template.name}
                        </span>
                        <span className="rounded-full bg-slate-900 text-white px-3 py-1 text-[11px] font-semibold tracking-wider">
                          ATS
                        </span>
                      </div>
                      <p className="text-2xl font-semibold text-slate-900">
                        {template.name} Template
                      </p>
                      <p className="text-sm text-slate-500">
                        {template.description}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {template.roles.slice(0, 3).map((role) => (
                        <span
                          key={role}
                          className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600"
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                    <div className="grid gap-2">
                      {TEMPLATE_FEATURES.map((feature) => (
                        <div
                          key={feature}
                          className="flex items-center gap-2 text-sm text-slate-600"
                        >
                          <Check className="h-4 w-4 text-emerald-500" />
                          {feature}
                        </div>
                      ))}
                    </div>
                    <Button
                      className={`w-full rounded-full bg-gradient-to-r ${template.color} text-white font-semibold`}
                    >
                      Use This Template
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="-left-6 h-8 w-8 bg-white hover:bg-gray-50 border" />
          <CarouselNext className="-right-6 h-8 w-8 bg-white hover:bg-gray-50 border" />
        </Carousel>
      </div>
    </section>
  );
}
