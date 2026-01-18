'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, ArrowRight, Check } from 'lucide-react';
import TechTemplate from '@/components/resume/templates/TechTemplate';
import ExecutiveTemplate from '@/components/resume/templates/ExecutiveTemplate';
import CorporateTemplate from '@/components/resume/templates/CorporateTemplate';
import CreativeTemplate from '@/components/resume/templates/CreativeTemplate';
import AcademicTemplate from '@/components/resume/templates/AcademicTemplate';
import type { ResumeData } from '@/types/resume.unified';

const templateData: Record<string, ResumeData> = {
  tech: {
    personalInfo: {
      name: 'Sarah Chen',
      email: 'sarah.chen@email.com',
      phone: '+1 (415) 234-5678',
      address: 'Seattle, WA',
      linkedin: 'linkedin.com/in/sarahchen',
      github: 'github.com/sarahchen',
      summary:
        'Full-stack software engineer with 6+ years building scalable cloud-native applications. Expertise in React, Node.js, and AWS infrastructure. Proven track record of delivering high-impact features for 10M+ users.',
    },
    experience: [
      {
        company: 'Amazon Web Services',
        position: 'Senior Software Development Engineer',
        location: 'Seattle, WA',
        startDate: 'Mar 2021',
        endDate: 'Present',
        bullets: [
          'Architected microservices platform processing 50M+ API requests daily with 99.99% uptime using Node.js, TypeScript, and AWS Lambda',
          'Led migration from monolith to serverless architecture, reducing infrastructure costs by 45% and improving deployment velocity by 3x',
          'Mentored team of 5 engineers on React best practices, code reviews, and system design, improving code quality metrics by 60%',
          'Implemented real-time analytics dashboard using React, Redux, and WebSockets serving 100K+ concurrent users',
        ],
      },
      {
        company: 'Microsoft',
        position: 'Software Engineer II',
        location: 'Redmond, WA',
        startDate: 'Jun 2019',
        endDate: 'Feb 2021',
        bullets: [
          'Developed Azure DevOps CI/CD pipeline features using C#, .NET Core, and React, adopted by 500+ enterprise customers',
          'Optimized database queries and caching strategies, reducing page load times by 70% and improving user satisfaction scores',
          'Collaborated with PM and design teams to ship 15+ features in agile sprints, consistently meeting sprint commitments',
        ],
      },
    ],
    education: [
      {
        school: 'Stanford University',
        degree: 'Bachelor of Science',
        field: 'Computer Science',
        location: 'Stanford, CA',
        startDate: '2015',
        endDate: '2019',
        gpa: '3.9',
      },
    ],
    skills: [
      'JavaScript',
      'TypeScript',
      'React',
      'Node.js',
      'Python',
      'AWS',
      'Docker',
      'Kubernetes',
      'PostgreSQL',
      'MongoDB',
      'GraphQL',
      'REST APIs',
      'CI/CD',
      'Git',
      'Agile/Scrum',
    ],
    projects: [
      {
        name: 'Open Source Contributor - React Query',
        description:
          'Core contributor to React Query library with 35K+ GitHub stars',
        technologies: ['TypeScript', 'React', 'Testing Library'],
        link: 'github.com/tanstack/query',
      },
    ],
    certifications: [
      {
        name: 'AWS Certified Solutions Architect - Professional',
        issuer: 'Amazon Web Services',
        date: '2023',
      },
      {
        name: 'Certified Kubernetes Administrator (CKA)',
        issuer: 'CNCF',
        date: '2022',
      },
    ],
  },
  executive: {
    personalInfo: {
      name: 'Michael Anderson',
      email: 'michael.anderson@email.com',
      phone: '+1 (212) 555-0199',
      address: 'New York, NY',
      linkedin: 'linkedin.com/in/michaelanderson',
      summary:
        'Strategic technology executive with 15+ years leading high-performing engineering teams and driving digital transformation initiatives. Proven expertise in scaling organizations from 20 to 200+ engineers while delivering $50M+ in revenue growth through innovative product development.',
    },
    experience: [
      {
        company: 'Goldman Sachs',
        position: 'Vice President of Engineering',
        location: 'New York, NY',
        startDate: 'Jan 2020',
        endDate: 'Present',
        bullets: [
          'Lead engineering organization of 120+ engineers across 8 product teams, delivering trading platform serving $2B+ daily transaction volume',
          'Spearheaded cloud migration strategy to AWS, reducing operational costs by $8M annually while improving system reliability to 99.99%',
          'Established engineering excellence practices including code review standards, testing frameworks, and CI/CD pipelines, reducing production incidents by 75%',
          'Partner with C-suite executives on technology roadmap and strategic initiatives, presenting quarterly business reviews to board of directors',
          'Built high-performing leadership team through strategic hiring, mentorship, and succession planning, achieving 95% retention rate',
        ],
      },
      {
        company: 'JPMorgan Chase',
        position: 'Senior Engineering Manager',
        location: 'New York, NY',
        startDate: 'Mar 2016',
        endDate: 'Dec 2019',
        bullets: [
          'Managed 45-person engineering team delivering mobile banking platform with 5M+ active users and 4.8-star app store rating',
          'Drove adoption of microservices architecture and DevOps practices, improving deployment frequency from monthly to daily releases',
          'Collaborated with product and design leaders to define product strategy and prioritize $15M annual engineering budget',
          'Championed diversity and inclusion initiatives, increasing underrepresented minority hiring by 40% over 3 years',
        ],
      },
    ],
    education: [
      {
        school: 'MIT Sloan School of Management',
        degree: 'Master of Business Administration',
        field: 'Technology & Operations Management',
        location: 'Cambridge, MA',
        startDate: '2014',
        endDate: '2016',
      },
      {
        school: 'Carnegie Mellon University',
        degree: 'Bachelor of Science',
        field: 'Computer Science',
        location: 'Pittsburgh, PA',
        startDate: '2005',
        endDate: '2009',
        gpa: '3.8',
      },
    ],
    skills: [
      'Engineering Leadership',
      'Strategic Planning',
      'Cloud Architecture',
      'Agile Transformation',
      'Stakeholder Management',
      'Budget Management',
      'Team Building',
      'Product Strategy',
      'AWS',
      'Microservices',
      'DevOps',
      'P&L Management',
    ],
    projects: [],
    certifications: [
      {
        name: 'Certified Scrum Master (CSM)',
        issuer: 'Scrum Alliance',
        date: '2018',
      },
      {
        name: 'AWS Certified Solutions Architect',
        issuer: 'Amazon Web Services',
        date: '2020',
      },
    ],
  },
  corporate: {
    personalInfo: {
      name: 'Jennifer Martinez',
      email: 'jennifer.martinez@email.com',
      phone: '+1 (617) 555-0147',
      address: 'Boston, MA',
      linkedin: 'linkedin.com/in/jennifermartinez',
      summary:
        'Management consultant with 8+ years advising Fortune 500 clients on digital transformation, operational excellence, and growth strategy. Delivered $200M+ in client value through data-driven insights and cross-functional collaboration. MBA from Harvard Business School.',
    },
    experience: [
      {
        company: 'McKinsey & Company',
        position: 'Senior Associate',
        location: 'Boston, MA',
        startDate: 'Sep 2019',
        endDate: 'Present',
        bullets: [
          'Lead consulting engagements for Fortune 100 clients across healthcare, technology, and financial services sectors, managing teams of 4-6 consultants',
          'Developed comprehensive digital transformation roadmap for $5B healthcare provider, identifying $80M in cost savings and revenue opportunities',
          'Conducted market analysis and competitive benchmarking for private equity client evaluating $500M acquisition target in SaaS space',
          'Designed operating model and organizational structure for technology company scaling from 200 to 1,000 employees',
          'Presented strategic recommendations to C-suite executives and board members, achieving 100% client satisfaction scores',
        ],
      },
      {
        company: 'Bain & Company',
        position: 'Associate Consultant',
        location: 'Boston, MA',
        startDate: 'Jul 2017',
        endDate: 'Aug 2019',
        bullets: [
          'Performed financial modeling and due diligence for private equity clients evaluating investment opportunities totaling $2B+',
          'Analyzed customer segmentation and pricing strategy for retail client, resulting in 15% revenue increase and improved margins',
          'Built data analytics dashboards using Tableau and SQL to track KPIs and operational metrics for manufacturing client',
          'Facilitated executive workshops and strategy sessions with senior leadership teams to align on business priorities',
        ],
      },
    ],
    education: [
      {
        school: 'Harvard Business School',
        degree: 'Master of Business Administration',
        field: 'Strategy & General Management',
        location: 'Boston, MA',
        startDate: '2015',
        endDate: '2017',
      },
      {
        school: 'University of Pennsylvania',
        degree: 'Bachelor of Science',
        field: 'Economics',
        location: 'Philadelphia, PA',
        startDate: '2011',
        endDate: '2015',
        gpa: '3.9',
      },
    ],
    skills: [
      'Strategic Planning',
      'Financial Modeling',
      'Data Analysis',
      'Stakeholder Management',
      'Project Management',
      'Market Research',
      'Business Development',
      'Excel',
      'PowerPoint',
      'Tableau',
      'SQL',
      'Python',
    ],
    projects: [],
    certifications: [
      {
        name: 'Project Management Professional (PMP)',
        issuer: 'PMI',
        date: '2020',
      },
      { name: 'Six Sigma Green Belt', issuer: 'ASQ', date: '2019' },
    ],
  },
  creative: {
    personalInfo: {
      name: 'David Kim',
      email: 'david.kim@email.com',
      phone: '+1 (650) 555-0123',
      address: 'San Francisco, CA',
      linkedin: 'linkedin.com/in/davidkim',
      summary:
        'Product designer with 7+ years crafting user-centered experiences for consumer and enterprise products. Led design for features used by 50M+ users. Expertise in user research, interaction design, and design systems. Passionate about bridging design and engineering to ship delightful products.',
    },
    experience: [
      {
        company: 'Airbnb',
        position: 'Senior Product Designer',
        location: 'San Francisco, CA',
        startDate: 'Apr 2021',
        endDate: 'Present',
        bullets: [
          'Lead end-to-end design for host onboarding experience, increasing listing completion rate by 35% and adding $50M in annual booking value',
          'Established design system components and patterns used across 15+ product teams, improving design consistency and development velocity',
          'Conducted user research with 100+ hosts and guests through interviews, usability testing, and surveys to inform product strategy',
          'Collaborated with PM and engineering teams in agile sprints to ship 20+ features, from concept to launch',
          'Mentored 3 junior designers on design thinking, prototyping, and stakeholder communication',
        ],
      },
      {
        company: 'Dropbox',
        position: 'Product Designer',
        location: 'San Francisco, CA',
        startDate: 'Jun 2018',
        endDate: 'Mar 2021',
        bullets: [
          'Designed file sharing and collaboration features for Dropbox Business, serving 600K+ teams and driving 25% increase in paid conversions',
          'Created high-fidelity prototypes using Figma and Principle to validate concepts with users before engineering investment',
          'Partnered with data science team to analyze user behavior and A/B test results, iterating designs based on quantitative insights',
          'Contributed to Dropbox design system, building reusable components and documentation for 50+ designers and engineers',
        ],
      },
    ],
    education: [
      {
        school: 'Rhode Island School of Design',
        degree: 'Bachelor of Fine Arts',
        field: 'Graphic Design',
        location: 'Providence, RI',
        startDate: '2014',
        endDate: '2018',
      },
    ],
    skills: [
      'Product Design',
      'User Research',
      'Interaction Design',
      'Visual Design',
      'Prototyping',
      'Design Systems',
      'Figma',
      'Sketch',
      'Adobe Creative Suite',
      'HTML/CSS',
      'User Testing',
      'Wireframing',
      'Information Architecture',
    ],
    projects: [
      {
        name: 'Personal Finance App - Side Project',
        description:
          'Designed and launched iOS app with 10K+ downloads and 4.7-star rating',
        technologies: ['Figma', 'SwiftUI', 'User Research'],
      },
    ],
    certifications: [
      {
        name: 'Google UX Design Professional Certificate',
        issuer: 'Google',
        date: '2020',
      },
    ],
  },
  academic: {
    personalInfo: {
      name: 'Dr. Emily Watson',
      email: 'emily.watson@university.edu',
      phone: '+1 (617) 495-0000',
      address: 'Cambridge, MA',
      linkedin: 'linkedin.com/in/emilywatson',
      summary:
        'Computational biologist and assistant professor with expertise in machine learning applications for genomics and drug discovery. Published 25+ peer-reviewed papers in Nature, Science, and Cell with 2,000+ citations. Secured $3M in NIH and NSF research funding. Passionate about training next generation of interdisciplinary scientists.',
    },
    experience: [
      {
        company: 'Harvard Medical School',
        position: 'Assistant Professor of Computational Biology',
        location: 'Boston, MA',
        startDate: 'Jul 2020',
        endDate: 'Present',
        bullets: [
          'Lead independent research lab of 8 graduate students and postdocs investigating machine learning methods for cancer genomics',
          'Secured $2.5M in research funding from NIH R01, NSF CAREER, and Chan Zuckerberg Initiative grants',
          'Published 12 first-author and senior-author papers in high-impact journals including Nature Medicine (IF: 87) and Cell (IF: 66)',
          'Teach graduate-level courses in computational biology and machine learning, receiving 4.8/5.0 teaching evaluations',
          'Serve on PhD thesis committees for 6 students and mentor undergraduate researchers through summer programs',
        ],
      },
      {
        company: 'Broad Institute of MIT and Harvard',
        position: 'Postdoctoral Research Fellow',
        location: 'Cambridge, MA',
        startDate: 'Sep 2017',
        endDate: 'Jun 2020',
        bullets: [
          'Developed deep learning models for predicting drug response from genomic data, achieving 85% accuracy on held-out test sets',
          'Analyzed CRISPR screening data from 1,000+ cancer cell lines to identify novel therapeutic targets',
          'Collaborated with experimental biologists and clinicians on translational research projects',
          'Published 8 papers including first-author publication in Nature with 500+ citations',
        ],
      },
      {
        company: 'National Institutes of Health',
        position: 'Visiting Research Scientist',
        location: 'Bethesda, MD',
        startDate: 'Jan 2015',
        endDate: 'Jun 2017',
        bullets: [
          'Directed NIH-funded consortium on single-cell genomics, coordinating data from 12 labs across the U.S.',
          'Built reproducible Snakemake pipelines for processing petabytes of sequencing data and released them via Bioconda',
          'Presented findings at ASHG and NeurIPS, aiding pharmaceutical partners in validating novel biomarkers',
        ],
      },
    ],
    education: [
      {
        school: 'Stanford University',
        degree: 'Doctor of Philosophy',
        field: 'Biomedical Informatics',
        location: 'Stanford, CA',
        startDate: '2012',
        endDate: '2017',
      },
      {
        school: 'MIT',
        degree: 'Bachelor of Science',
        field: 'Computer Science & Biology',
        location: 'Cambridge, MA',
        startDate: '2008',
        endDate: '2012',
        gpa: '4.0',
      },
    ],
    skills: [
      'Machine Learning',
      'Genomics',
      'Bioinformatics',
      'Python',
      'R',
      'TensorFlow',
      'PyTorch',
      'Statistical Analysis',
      'Data Visualization',
      'Scientific Writing',
      'Grant Writing',
      'Mentorship',
      'Nextflow',
      'High-Performance Computing',
      'Scientific Computing',
    ],
    projects: [
      {
        name: 'OpenGRAVITY Cancer Atlas',
        description:
          'Built a federated learning atlas combining multi-omics datasets from 10 cancer centers, improving biomarker discovery speed by 6x',
        technologies: ['Python', 'Snakemake', 'Docker'],
      },
      {
        name: 'Genomic Machine Learning Curriculum',
        description:
          'Authored an open-source curriculum and Jupyter micro-credential for teaching ML-driven biology to graduate students and industry researchers',
        technologies: ['Jupyter', 'TensorFlow', 'Streamlit'],
      },
      {
        name: 'Next-Gen Drug Response Portal',
        description:
          'Led a cross-functional team to deliver an interactive dashboard that surfaces interpretable insights from CRISPR screening data',
        technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
      },
    ],
    certifications: [
      {
        name: 'NIH IRACU Bioinformatics Workshop',
        issuer: 'National Institutes of Health',
        date: '2021',
      },
      {
        name: 'Data Carpentry: Genomics',
        issuer: 'Data Carpentry',
        date: '2019',
      },
    ],
  },
};

const templates = [
  {
    id: 'tech',
    name: 'Modern Tech',
    Component: TechTemplate,
    color: 'from-blue-600 to-cyan-600',
    description:
      'Clean, skills-forward design perfect for software engineers and tech professionals.',
    roles: ['Software Engineer', 'DevOps', 'Data Scientist'],
  },
  {
    id: 'executive',
    name: 'Executive',
    Component: ExecutiveTemplate,
    color: 'from-slate-700 to-slate-900',
    description:
      'Leadership-focused layout with dark sidebar for directors and C-level executives.',
    roles: ['Director', 'VP', 'C-Suite'],
  },
  {
    id: 'corporate',
    name: 'Professional',
    Component: CorporateTemplate,
    color: 'from-gray-700 to-gray-900',
    description:
      'Conservative, impact-driven format ideal for consulting and finance roles.',
    roles: ['Consultant', 'Analyst', 'Finance'],
  },
  {
    id: 'creative',
    name: 'Creative',
    Component: CreativeTemplate,
    color: 'from-purple-600 to-pink-600',
    description:
      'Modern portfolio-friendly layout with elegant accents for creative professionals.',
    roles: ['Designer', 'Product Manager', 'Marketing'],
  },
  {
    id: 'academic',
    name: 'Academic',
    Component: AcademicTemplate,
    color: 'from-emerald-600 to-teal-600',
    description:
      'Structured CV format designed for researchers and academic positions.',
    roles: ['Researcher', 'Professor', 'PhD Candidate'],
  },
];

export default function TemplateSection() {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const CurrentTemplate = templates[current].Component;
  const currentData = templateData[templates[current].id];

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
                          <CurrentTemplate data={currentData} />
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
                    (current - 1 + templates.length) % templates.length
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
                onClick={() => setCurrent((current + 1) % templates.length)}
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
                    className={`bg-gradient-to-r ${templates[current].color} text-white border-0 px-4 py-2 text-sm mb-6`}
                  >
                    {templates[current].name}
                  </Badge>
                  <h3 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
                    Perfect for
                    <br />
                    <span
                      className={`bg-gradient-to-r ${templates[current].color} bg-clip-text text-transparent`}
                    >
                      {templates[current].name}
                    </span>{' '}
                    Roles
                  </h3>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    {templates[current].description}
                  </p>
                </div>

                {/* Role Tags */}
                <div className="flex flex-wrap gap-2">
                  {templates[current].roles.map((role) => (
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
                        className={`h-6 w-6 rounded-full bg-gradient-to-r ${templates[current].color} flex items-center justify-center`}
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
                  className={`w-full sm:w-auto px-8 py-4 text-base font-semibold bg-gradient-to-r ${templates[current].color} hover:opacity-90 transition-opacity shadow-lg`}
                  onClick={() => router.push('/auth/signin')}
                >
                  Use This Template
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>

              {/* Dots Navigation */}
              <div className="flex items-center gap-3 justify-center sm:justify-start pt-2">
                {templates.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrent(idx)}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      idx === current
                        ? `w-10 bg-gradient-to-r ${templates[current].color}`
                        : 'w-2.5 bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`View ${templates[idx].name} template`}
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
