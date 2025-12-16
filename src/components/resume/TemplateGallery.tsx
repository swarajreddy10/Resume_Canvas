'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import TemplateRenderer from './TemplateRenderer';
import { ResumeData } from '@/types/resume.unified';

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
    name: 'Executive Impact',
    category: 'Leadership',
    preview: '/templates/executive-preview.jpg',
    description:
      'Classic serif structure with strong hierarchy for directors and C-level roles.',
    features: ['ATS-ready', 'Metrics-first', 'Serif/Classic', 'Board-ready'],
  },
  {
    id: 'tech',
    name: 'Technical ATS',
    category: 'Software & Data',
    preview: '/templates/tech-preview.jpg',
    description:
      'Modern sans layout tuned for engineers and data roles with skills-forward blocks.',
    features: [
      'ATS-ready',
      'Skills forward',
      'Project highlights',
      'Clean grid',
    ],
  },
  {
    id: 'corporate',
    name: 'Consulting & Finance',
    category: 'Business',
    preview: '/templates/corporate-preview.jpg',
    description:
      'Conservative, bullet-driven layout ideal for consulting, finance, and operations.',
    features: ['ATS-ready', 'Bullet clarity', 'Conservative', 'Impact lines'],
  },
  {
    id: 'creative',
    name: 'Product & Design',
    category: 'Product/Design',
    preview: '/templates/creative-preview.jpg',
    description:
      'Clean grid with restrained accents for designers and product managers.',
    features: [
      'ATS-safe color',
      'Case study ready',
      'Modern grid',
      'Portfolio friendly',
    ],
  },
  {
    id: 'academic',
    name: 'Academic CV',
    category: 'Research',
    preview: '/templates/academic-preview.jpg',
    description:
      'Structured CV with room for publications, grants, and committees.',
    features: ['ATS-ready', 'Multi-page', 'Publication focus', 'Formal tone'],
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
  const SAMPLE_DATA: Record<string, ResumeData> = {
    executive: {
      personalInfo: {
        name: 'Jason Reed',
        email: 'jason.reed@email.com',
        phone: '+1 415-555-2847',
        address: 'Seattle, WA',
        linkedin: 'linkedin.com/in/jasonreed',
        summary:
          '15+ years leading manufacturing operations. Proven record of scaling teams, improving efficiency, and delivering EBITDA gains.',
      },
      experience: [
        {
          company: 'ADC Biologics',
          position: 'VP, Manufacturing',
          location: 'Seattle, WA',
          startDate: '01/2019',
          endDate: 'Present',
          description:
            'Own end-to-end planning for a $500M portfolio; built the digital ops program for plant-level visibility.',
          bullets: [
            'Lifted on-time delivery from 86% to 97% while reducing COGS by 12%.',
            'Implemented lean roadmap saving $7.2M annually in waste and rework.',
          ],
        },
        {
          company: 'Pfizer',
          position: 'Director of Operations',
          location: 'New York, NY',
          startDate: '02/2014',
          endDate: '12/2018',
          description:
            'Led a 140-person manufacturing org across three sites with a $220M budget.',
          bullets: [
            'Launched vendor program cutting cycle time by 18%.',
            'Built PMO that delivered 24 cross-site automation projects.',
          ],
        },
      ],
      education: [
        {
          school: 'MIT',
          degree: 'Master of Science',
          field: 'Chemical Engineering',
          startDate: '2005',
          endDate: '2007',
          location: 'Cambridge, MA',
        },
        {
          school: 'University of Washington',
          degree: 'Bachelor of Science',
          field: 'Chemical Engineering',
          startDate: '2001',
          endDate: '2005',
          location: 'Seattle, WA',
        },
      ],
      skills: [
        'Operations Strategy',
        'Process Optimization',
        'Lean/Six Sigma',
        'Team Leadership',
        'Supply Chain',
        'Automation',
      ],
      certifications: [
        {
          name: 'Lean Manufacturing',
          issuer: 'ASQ',
          date: '2016',
        },
      ],
    },
    tech: {
      personalInfo: {
        name: 'Luke Adams',
        email: 'luke.adams@email.com',
        phone: '+1 512-555-1634',
        address: 'Austin, TX',
        linkedin: 'linkedin.com/in/lukeadams',
        github: 'github.com/lukeadams',
        summary:
          'Full-stack engineer focused on scalable web platforms and growth experiments. Comfortable across React, Node, and cloud.',
      },
      experience: [
        {
          company: 'Northstar',
          position: 'Senior Software Engineer',
          location: 'Remote',
          startDate: '03/2021',
          endDate: 'Present',
          description: 'Lead engineer for the growth and onboarding squads.',
          bullets: [
            'Shipped feature flags service cutting release risk; reduced rollback incidents by 40%.',
            'Built multi-tenant auth gateway that scaled to 1.5M MAU with 99.98% uptime.',
          ],
        },
        {
          company: 'Orbit',
          position: 'Software Engineer',
          location: 'Austin, TX',
          startDate: '08/2018',
          endDate: '02/2021',
          description: 'Worked on collaboration tools across web and mobile.',
          bullets: [
            'Reduced largest query p95 from 3.2s to 600ms via indexing and caching.',
            'Implemented design system in React; cut new UI build time by 30%.',
          ],
        },
      ],
      education: [
        {
          school: 'UT Austin',
          degree: 'B.S.',
          field: 'Computer Science',
          startDate: '2014',
          endDate: '2018',
          location: 'Austin, TX',
        },
      ],
      skills: [
        'React',
        'TypeScript',
        'Node.js',
        'PostgreSQL',
        'AWS',
        'Next.js',
        'System Design',
      ],
      projects: [
        {
          name: 'Realtime Analytics',
          description:
            'Event pipeline with Kafka and ClickHouse powering product dashboards.',
          technologies: 'Kafka, ClickHouse, TypeScript',
          url: 'analytics.luke.dev',
          startDate: '2023',
          endDate: '2024',
        },
      ],
      certifications: [
        { name: 'AWS Developer Associate', issuer: 'AWS', date: '2023' },
      ],
    },
    corporate: {
      personalInfo: {
        name: 'Scarlett Anderson',
        email: 'scarlett.anderson@email.com',
        phone: '+1 415-555-9021',
        address: 'San Francisco, CA',
        linkedin: 'linkedin.com/in/scarlettanderson',
        summary:
          'Finance professional with Big 4 audit foundation and FP&A leadership. Expert in controls, reporting, and executive-ready insights.',
      },
      experience: [
        {
          company: 'KPMG',
          position: 'Senior Auditor',
          location: 'San Jose, CA',
          startDate: '09/2019',
          endDate: 'Present',
          description:
            'Lead audits for enterprise clients across tech and manufacturing.',
          bullets: [
            'Drove $2.5B client portfolio with zero material findings across three years.',
            'Built analytics scripts reducing sample selection time by 35%.',
          ],
        },
        {
          company: 'Redline Capital',
          position: 'Financial Analyst',
          location: 'San Francisco, CA',
          startDate: '06/2016',
          endDate: '08/2019',
          description:
            'FP&A partner for product and GTM leadership; managed budgeting cycles.',
          bullets: [
            'Delivered scenario models that improved forecast accuracy to 96%.',
            'Partnered with sales to redesign comp plan; improved margin by 3.8%.',
          ],
        },
      ],
      education: [
        {
          school: 'University of California, Berkeley',
          degree: 'Master of Science',
          field: 'Accountancy',
          startDate: '2014',
          endDate: '2016',
          location: 'Berkeley, CA',
        },
        {
          school: 'Boston College',
          degree: 'Bachelor of Science',
          field: 'Accounting',
          startDate: '2010',
          endDate: '2014',
          location: 'Boston, MA',
        },
      ],
      skills: [
        'Financial Reporting',
        'Audit & Controls',
        'FP&A',
        'Variance Analysis',
        'Excel / SQL',
        'Revenue Recognition',
      ],
      projects: [
        {
          name: 'Forecast Model Overhaul',
          description:
            'Built multi-scenario driver-based model enabling faster board reviews.',
          technologies: 'Excel, SQL, PowerBI',
          startDate: '2022',
          endDate: '2022',
        },
      ],
      certifications: [
        { name: 'CPA', issuer: 'AICPA', date: '2017' },
        { name: 'CFA Level II', issuer: 'CFA Institute', date: '2020' },
      ],
    },
    creative: {
      personalInfo: {
        name: 'Amelia Flores',
        email: 'amelia.flores@email.com',
        phone: '+1 303-555-7822',
        address: 'Denver, CO',
        linkedin: 'linkedin.com/in/ameliaflores',
        website: 'ameliaflores.design',
        summary:
          'Product designer crafting conversion-friendly SaaS experiences. Loves research, prototyping, and data-informed UX.',
      },
      experience: [
        {
          company: 'Brightly',
          position: 'Senior Product Designer',
          location: 'Remote',
          startDate: '01/2021',
          endDate: 'Present',
          description:
            'Design lead for onboarding and billing surfaces in a B2B SaaS.',
          bullets: [
            'Improved trial-to-paid by 9% through simplified onboarding and clearer pricing.',
            'Built Figma design system; reduced UI debt tickets by 45%.',
          ],
        },
        {
          company: 'Pathline',
          position: 'Product Designer',
          location: 'Denver, CO',
          startDate: '04/2018',
          endDate: '12/2020',
          description:
            'Worked across mobile and web for logistics tracking experiences.',
          bullets: [
            'Shipped new shipment tracker; decreased support tickets by 18%.',
            'Ran 20+ usability sessions feeding a revamped driver app.',
          ],
        },
      ],
      education: [
        {
          school: 'University of Colorado',
          degree: 'B.A.',
          field: 'Interaction Design',
          startDate: '2013',
          endDate: '2017',
          location: 'Boulder, CO',
        },
      ],
      skills: [
        'Product Discovery',
        'Figma',
        'Prototyping',
        'User Research',
        'Design Systems',
        'A/B Testing',
      ],
      projects: [
        {
          name: 'Billing Revamp',
          description:
            'Redesigned billing flow with clearer plan comparisons and in-context FAQs.',
          technologies: 'Figma, React, Experimentation',
          startDate: '2023',
          endDate: '2023',
        },
      ],
      certifications: [
        {
          name: 'UX Research Methods',
          issuer: 'Nielsen Norman Group',
          date: '2022',
        },
      ],
    },
    academic: {
      personalInfo: {
        name: 'Evelyn Chen',
        email: 'evelyn.chen@email.com',
        phone: '+1 919-555-4421',
        address: 'Boston, MA',
        linkedin: 'linkedin.com/in/evelynchen',
        summary:
          'Data science researcher focused on applied NLP and educational technology. Published across peer-reviewed venues.',
      },
      experience: [
        {
          company: 'Northeastern University',
          position: 'Research Fellow',
          location: 'Boston, MA',
          startDate: '09/2021',
          endDate: 'Present',
          description: 'Lead NLP projects in edtech and learning analytics.',
          bullets: [
            'Co-authored 5 papers on transformer-based feedback systems.',
            'Built datasets and evaluation for automated rubric scoring.',
          ],
        },
        {
          company: 'Coursera',
          position: 'Data Scientist Intern',
          location: 'Remote',
          startDate: '06/2020',
          endDate: '08/2020',
          description: 'Analyzed learner engagement and course completion.',
          bullets: [
            'Improved completion prediction AUC from 0.71 to 0.79.',
            'Partnered with PMs to launch nudges increasing completions by 6%.',
          ],
        },
      ],
      education: [
        {
          school: 'Harvard University',
          degree: 'Ph.D.',
          field: 'Data Science',
          startDate: '2017',
          endDate: '2021',
          location: 'Cambridge, MA',
        },
        {
          school: 'Duke University',
          degree: 'B.S.',
          field: 'Computer Science',
          startDate: '2013',
          endDate: '2017',
          location: 'Durham, NC',
        },
      ],
      skills: [
        'Machine Learning',
        'NLP',
        'Python',
        'PyTorch',
        'Experiment Design',
        'Academic Writing',
      ],
      projects: [
        {
          name: 'FeedbackGPT',
          description:
            'Automated feedback assistant for writing assignments with human-in-loop review.',
          technologies: 'Python, Transformers, FastAPI',
          startDate: '2022',
          endDate: '2023',
        },
      ],
      certifications: [
        {
          name: 'Data Science Teaching Fellow',
          issuer: 'Harvard',
          date: '2021',
        },
      ],
    },
  };

  return (
    <Card className="glass-panel p-5 md:p-7">
      <div className="relative py-4 md:py-6">
        <Carousel
          opts={{
            align: 'center',
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4 md:-ml-6">
            {templates.map((template) => (
              <CarouselItem
                key={template.id}
                className="pl-4 md:pl-6 basis-full md:basis-1/2 lg:basis-1/3"
              >
                <Card
                  className={cn(
                    'group relative h-full cursor-pointer border-transparent bg-gradient-to-b from-white to-slate-50/70 p-0 transition-all duration-300 ease-out',
                    'hover:-translate-y-2 hover:shadow-[0_28px_70px_-40px_rgba(37,99,235,0.55)]',
                    selectedTemplate === template.id
                      ? 'ring-2 ring-primary/40 shadow-[0_24px_60px_-35px_rgba(37,99,235,0.5)]'
                      : 'border-white/60'
                  )}
                  onClick={() => onTemplateSelect(template.id)}
                >
                  <div className="relative overflow-hidden rounded-2xl border border-white/70 bg-white shadow-inner">
                    <div className="absolute inset-x-0 top-0 flex items-center justify-between px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      <span>{template.category}</span>
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-primary">
                        ATS Ready
                      </span>
                    </div>
                    <div className="relative mt-1 aspect-[4/5] overflow-hidden rounded-2xl bg-gradient-to-b from-white via-blue-50/15 to-white">
                      <div className="absolute inset-0 flex items-start justify-center overflow-hidden">
                        <div className="pointer-events-none origin-top scale-[0.56] md:scale-[0.6] lg:scale-[0.62] xl:scale-[0.64] transition-transform duration-500 group-hover:scale-[0.66]">
                          <TemplateRenderer
                            template={
                              template.id as
                                | 'executive'
                                | 'tech'
                                | 'corporate'
                                | 'creative'
                                | 'academic'
                            }
                            data={SAMPLE_DATA[template.id]}
                          />
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 via-transparent to-transparent" />
                      {selectedTemplate === template.id && (
                        <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-white/85 px-3 py-1 text-xs font-semibold text-primary shadow-sm">
                          <Check className="h-4 w-4" />
                          Selected
                        </div>
                      )}
                      <div className="pointer-events-none absolute inset-0 border border-white/60" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 p-5">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary/80">
                          {template.category}
                        </p>
                        <p className="text-lg font-semibold text-foreground">
                          {template.name}
                        </p>
                      </div>
                      <div className="rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold text-primary">
                        ATS
                      </div>
                    </div>
                    <p className="text-sm text-foreground/70">
                      {template.description}
                    </p>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {template.features.slice(0, 3).map((feature) => (
                        <span
                          key={feature}
                          className="rounded-full bg-primary/8 px-3 py-1 text-xs font-semibold text-foreground/75 ring-1 ring-white/70"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                    <div className="mt-4">
                      <Button size="sm" className="w-full">
                        Use template
                      </Button>
                    </div>
                  </div>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="-left-5 md:-left-6 h-14 w-14 border-2 hover:scale-110 transition-transform bg-white/80 backdrop-blur" />
          <CarouselNext className="-right-5 md:-right-6 h-14 w-14 border-2 hover:scale-110 transition-transform bg-white/80 backdrop-blur" />
        </Carousel>
      </div>
    </Card>
  );
}
