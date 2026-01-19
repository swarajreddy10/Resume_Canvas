'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, ArrowRight, Check } from 'lucide-react';
import TemplateRenderer from '@/components/resume/TemplateRenderer';
import {
  TEMPLATE_SAMPLE_DATA,
  TEMPLATES,
} from '@/components/resume/templateLibrary';
export default function TemplateSection() {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const currentMeta = TEMPLATES[current];
  const currentData = TEMPLATE_SAMPLE_DATA[currentMeta.id];

  return (
    <section
      id="templates"
      className="py-24 px-4 sm:px-6 bg-gradient-to-b from-white via-gray-50 to-white"
    >
      <motion.div
        className="text-center mb-20 max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <Badge className="mb-4 px-4 py-2">Professional Templates</Badge>
        <h2 className="text-4xl md:text-6xl font-black mb-4 bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 bg-clip-text text-transparent">
          Choose Your Perfect Template
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          ATS-friendly designs trusted by recruiters at top companies
        </p>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-stretch">
          {/* Left: Resume Preview */}
          <div className="relative flex flex-col justify-between items-center h-full overflow-hidden px-2 sm:px-4 pt-6 pb-10 min-w-0">
            <div className="flex-1 w-full flex items-start justify-center pt-4 sm:pt-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                  className="relative flex justify-center items-center w-full h-full"
                >
                  {/* Resume Container */}
                  <div className="relative w-full max-w-[520px] mx-auto rounded-[28px] border border-slate-200 bg-white shadow-[0_35px_40px_rgba(15,23,42,0.15)] overflow-hidden">
                    <div className="flex items-center justify-center px-4 py-4 sm:px-6 sm:py-6 md:px-8 md:py-8">
                      <div className="w-[calc(210mm*0.32)] h-[calc(297mm*0.32)] sm:w-[calc(210mm*0.38)] sm:h-[calc(297mm*0.38)] md:w-[calc(210mm*0.44)] md:h-[calc(297mm*0.44)]">
                        <div className="transform scale-[0.32] sm:scale-[0.38] md:scale-[0.44] origin-top-left">
                          <TemplateRenderer
                            template={currentMeta.id}
                            data={currentData}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-6 flex w-full flex-col gap-3 sm:flex-row sm:justify-between">
              <Button
                variant="outline"
                size="sm"
                className="w-full sm:w-[calc(50%-0.5rem)] flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold border-slate-200 hover:border-slate-400"
                onClick={() =>
                  setCurrent(
                    (current - 1 + TEMPLATES.length) % TEMPLATES.length
                  )
                }
                aria-label="Previous template"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous Template
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full sm:w-[calc(50%-0.5rem)] flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold border-slate-200 hover:border-slate-400"
                onClick={() => setCurrent((current + 1) % TEMPLATES.length)}
                aria-label="Next template"
              >
                Next Template
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Right: Info */}
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="flex h-full flex-col gap-6 min-w-0"
            >
              <div className="flex-1 rounded-[32px] bg-white/90 border border-slate-100 shadow-2xl shadow-blue-100/40 p-6 md:p-8 flex flex-col gap-8 backdrop-blur-xl">
                <div>
                  <Badge
                    className={`bg-gradient-to-r ${currentMeta.color} text-white border-0 px-4 py-2 text-sm mb-6`}
                  >
                    {currentMeta.name}
                  </Badge>
                  <h3 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
                    Perfect for
                    <br />
                    <span
                      className={`bg-gradient-to-r ${currentMeta.color} bg-clip-text text-transparent`}
                    >
                      {currentMeta.name}
                    </span>{' '}
                    Roles
                  </h3>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    {currentMeta.description}
                  </p>
                </div>

                {/* Role Tags */}
                <div className="flex flex-wrap gap-2">
                  {currentMeta.roles.map((role) => (
                    <Badge
                      key={role}
                      variant="secondary"
                      className="px-3 py-1.5 text-sm"
                    >
                      {role}
                    </Badge>
                  ))}
                </div>

                {/* Features */}
                <div className="space-y-3">
                  {[
                    { icon: Check, text: 'ATS-Optimized Format' },
                    { icon: Check, text: 'Print-Ready A4 Layout' },
                    { icon: Check, text: 'Recruiter-Approved Design' },
                  ].map((feature) => (
                    <div
                      key={feature.text}
                      className="flex items-center gap-3 text-gray-700"
                    >
                      <div
                        className={`h-6 w-6 rounded-full bg-gradient-to-r ${currentMeta.color} flex items-center justify-center`}
                      >
                        <feature.icon className="h-3.5 w-3.5 text-white" />
                      </div>
                      <span className="font-medium">{feature.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Button
                  size="sm"
                  className={`w-full sm:w-auto px-8 py-4 text-base font-semibold bg-gradient-to-r ${currentMeta.color} hover:opacity-90 transition-opacity shadow-lg`}
                  onClick={() => router.push('/auth/signin')}
                >
                  Use This Template
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>

              {/* Dots Navigation */}
              <div className="flex items-center gap-3 justify-center sm:justify-start pt-2">
                {TEMPLATES.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrent(idx)}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      idx === current
                        ? `w-10 bg-gradient-to-r ${currentMeta.color}`
                        : 'w-2.5 bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`View ${TEMPLATES[idx].name} template`}
                  />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
