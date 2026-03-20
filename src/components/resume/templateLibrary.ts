'use client';

import { ResumeData } from '@/types/resume.unified';

export type TemplateType =
  | 'executive'
  | 'tech'
  | 'corporate'
  | 'creative'
  | 'academic';

export interface TemplateMeta {
  id: TemplateType;
  name: string;
  description: string;
  color: string;
  roles: string[];
}

export const TEMPLATES: TemplateMeta[] = [
  {
    id: 'tech',
    name: 'Modern Tech',
    description: 'Clean, skills-forward design perfect for tech resumes.',
    color: 'from-blue-600 to-cyan-600',
    roles: ['Software Engineer', 'DevOps', 'Data Scientist'],
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'Leadership-focused layout with a bold sidebar.',
    color: 'from-slate-700 to-slate-900',
    roles: ['Director', 'VP', 'C-Suite'],
  },
  {
    id: 'corporate',
    name: 'Professional',
    description: 'Conservative, impact-driven format for enterprise roles.',
    color: 'from-gray-700 to-gray-900',
    roles: ['Consultant', 'Analyst', 'Finance'],
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Portfolio-ready layout with elegant accents.',
    color: 'from-purple-600 to-pink-600',
    roles: ['Designer', 'Product Manager', 'Marketing'],
  },
  {
    id: 'academic',
    name: 'Academic',
    description: 'Structured CV format for research and academia.',
    color: 'from-emerald-600 to-teal-600',
    roles: ['Researcher', 'Professor', 'PhD Candidate'],
  },
];

export const TEMPLATE_IDS: TemplateType[] = TEMPLATES.map(
  (template) => template.id
);

export const TEMPLATE_SAMPLE_DATA: Record<TemplateType, ResumeData> = {
  tech: {
    personalInfo: {
      name: 'Arjun Sharma',
      email: 'arjun.sharma@email.com',
      phone: '+1 (415) 234-5678',
      address: 'Seattle, WA',
      position: 'Senior Software Development Engineer',
      linkedin: 'linkedin.com/in/arjunsharma',
      github: 'github.com/arjunsharma',
      summary:
        'Full-stack software engineer with 6+ years delivering scalable cloud-native solutions. Expert in React, Node.js, and AWS with a track record of leading high-impact platform migrations and mentoring engineering teams.',
    },
    experience: [
      {
        company: 'Amazon Web Services',
        position: 'Senior Software Development Engineer',
        location: 'Seattle, WA',
        startDate: 'Mar 2021',
        endDate: 'Present',
        description:
          'Architected microservices platform handling 50M+ daily API requests with 99.99% uptime across three global regions.',
        bullets: [
          'Led migration from monolithic to serverless architecture on AWS Lambda, reducing infrastructure costs by 45% and improving p99 latency by 38%',
          'Designed and shipped a distributed tracing system integrating OpenTelemetry with X-Ray, cutting mean time to detection for incidents from 42 min to 8 min',
          'Mentored 5 mid-level engineers through bi-weekly code reviews and architecture walkthroughs, improving team code quality score by 60%',
          'Drove adoption of automated load testing in CI/CD pipelines, eliminating 3 production outages in Q3 2022 and Q1 2023',
          'Collaborated with product and security teams to achieve SOC 2 Type II compliance for the platform within an 8-month timeline',
        ],
      },
      {
        company: 'Microsoft',
        position: 'Software Engineer II',
        location: 'Redmond, WA',
        startDate: 'Jun 2019',
        endDate: 'Feb 2021',
        description:
          'Owned Azure DevOps CI/CD pipeline experiences for enterprise customers with 5k+ active organizations.',
        bullets: [
          'Re-architected the YAML pipeline editor with React and Monaco Editor, improving developer satisfaction scores from 62% to 89%',
          'Built an intelligent task recommendation engine using collaborative filtering, increasing average pipeline task reuse by 30%',
          'Delivered a self-service automation toolkit adopted by 500+ internal engineering teams within 60 days of launch',
          'Reduced API response time for the pipeline run dashboard by 55% through query optimization and Redis caching',
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
    ],
    projects: [
      {
        name: 'React Query Contributor',
        description: 'Core contributor to React Query library with 35K+ stars.',
        technologies: ['TypeScript', 'React', 'Testing Library'],
      },
    ],
    certifications: [
      {
        name: 'AWS Certified Solutions Architect – Professional',
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
      position: 'Vice President of Engineering',
      linkedin: 'linkedin.com/in/manderson',
      summary:
        'Strategic technology executive with 15+ years leading high-performing engineering organizations at scale. Proven track record driving digital transformation, building world-class teams, and delivering platforms that generate measurable business impact.',
    },
    experience: [
      {
        company: 'Goldman Sachs',
        position: 'Vice President of Engineering',
        location: 'New York, NY',
        startDate: 'Jan 2020',
        endDate: 'Present',
        description:
          'Lead engineering organization of 120+ across equities, fixed income, and risk platforms serving $2B+ daily trading volume.',
        bullets: [
          'Directed full migration of legacy on-premise trading infrastructure to AWS, delivering $18M in annual cost savings and reducing deployment time from 3 weeks to under 2 hours',
          'Built and scaled engineering organization from 65 to 120 engineers across 8 teams while maintaining 95% retention through structured career laddering and mentorship programs',
          'Reduced production incidents by 75% by institutionalizing SRE practices, blameless post-mortems, and a firm-wide engineering excellence program',
          'Partnered with Chief Risk Officer to deliver real-time risk analytics platform processing 4M events/sec, enabling traders to act on market signals 60% faster',
          'Established quarterly OKR process aligning 8 engineering teams to $40M annual technology roadmap with 92% on-time delivery rate',
        ],
      },
      {
        company: 'JPMorgan Chase',
        position: 'Senior Engineering Manager',
        location: 'New York, NY',
        startDate: 'Mar 2016',
        endDate: 'Dec 2019',
        description:
          'Oversaw mobile banking platform serving 5M+ customers with daily release cadence and 99.95% availability SLA.',
        bullets: [
          'Introduced DevOps practices and trunk-based development, increasing deployment frequency from bi-weekly to daily with zero increase in incident rate',
          'Partnered with Product and Design on $15M multi-year roadmap; delivered 14 of 14 major features on schedule across three annual planning cycles',
          'Grew team from 12 to 35 engineers; implemented structured technical interviewing that reduced mis-hire rate from 22% to 4%',
          'Championed accessibility initiative bringing mobile app to WCAG 2.1 AA compliance, expanding addressable user base by an estimated 400K users',
        ],
      },
    ],
    education: [
      {
        school: 'MIT Sloan School of Management',
        degree: 'MBA',
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
      'Organizational Design',
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
      name: 'Ananya Krishnan',
      email: 'ananya.krishnan@email.com',
      phone: '+1 (617) 555-0147',
      address: 'Boston, MA',
      position: 'Senior Management Consultant',
      linkedin: 'linkedin.com/in/ananyakrishnan',
      summary:
        'Management consultant with 8+ years advising Fortune 500 clients on digital strategy, operational excellence, and large-scale transformation programs. Deep expertise in financial services, healthcare, and consumer sectors.',
    },
    experience: [
      {
        company: 'McKinsey & Company',
        position: 'Senior Associate',
        location: 'Boston, MA',
        startDate: 'Sep 2019',
        endDate: 'Present',
        description:
          'Lead consulting engagements for financial services and healthcare clients, delivering $80M+ in measurable client value through digital transformation and operating model design.',
        bullets: [
          "Designed and implemented a target operating model for a regional bank's digital lending division, reducing loan origination cycle time by 52% and generating $12M in annual cost savings",
          'Built integrated data analytics platform for a top-5 health insurer, enabling real-time claims adjudication and reducing fraud losses by $8M annually',
          'Structured and scaled operating model frameworks for three growth-stage companies expanding from 200 to 1,000+ employees across North America and Europe',
          'Delivered executive strategy presentations to C-suite and board audiences with 100% client satisfaction ratings across 11 engagements',
          'Managed cross-functional team of 6 consultants and 4 client co-leads on a 9-month enterprise-wide ERP transformation program',
        ],
      },
      {
        company: 'Bain & Company',
        position: 'Associate Consultant',
        location: 'Boston, MA',
        startDate: 'Jul 2017',
        endDate: 'Aug 2019',
        description:
          'Executed commercial due diligence, market entry strategy, and operational improvement engagements for private equity and retail clients.',
        bullets: [
          'Developed detailed financial models and market sizing analyses for $2B+ private equity investment targets across logistics and healthcare services sectors',
          'Led cross-functional workshops aligning executive leadership teams on post-merger integration priorities, accelerating Day 1 readiness by 3 weeks',
          'Identified $22M in overhead reduction opportunities for a specialty retailer through zero-based budgeting and procurement benchmarking',
          'Produced competitive landscape and customer segmentation analysis that shaped a $180M product portfolio reallocation for a consumer goods client',
        ],
      },
    ],
    education: [
      {
        school: 'Harvard Business School',
        degree: 'MBA',
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
      'SQL',
      'Operating Model Design',
      'Stakeholder Management',
      'Change Management',
      'Private Equity Due Diligence',
      'Process Optimization',
    ],
    projects: [],
    certifications: [
      {
        name: 'Project Management Professional (PMP)',
        issuer: 'PMI',
        date: '2020',
      },
      {
        name: 'Six Sigma Green Belt',
        issuer: 'ASQ',
        date: '2019',
      },
    ],
  },
  creative: {
    personalInfo: {
      name: 'David Kim',
      email: 'david.kim@email.com',
      phone: '+1 (650) 555-0123',
      address: 'San Francisco, CA',
      position: 'Senior Product Designer',
      linkedin: 'linkedin.com/in/davidkim',
      summary:
        'Product designer with 7+ years crafting human-centered experiences for consumer and enterprise products. Passionate about systems thinking, accessibility, and bridging the gap between research insights and pixel-perfect execution.',
    },
    experience: [
      {
        company: 'Airbnb',
        position: 'Senior Product Designer',
        location: 'San Francisco, CA',
        startDate: 'Apr 2021',
        endDate: 'Present',
        description:
          'Own end-to-end design for host onboarding and listing quality, serving 4M+ active hosts globally.',
        bullets: [
          'Redesigned the host onboarding flow using continuous discovery and A/B testing, increasing listing completion rate by 35% and reducing average time-to-live from 9 days to 4 days',
          'Established a shared design system with 120+ production-ready components adopted by 15 product teams, reducing design-to-dev handoff time by 40%',
          'Led a 6-month accessibility audit and remediation effort, bringing core host surfaces to WCAG 2.1 AA compliance and improving ratings among users with disabilities by 28%',
          'Mentored 3 mid-level designers through weekly critiques, design sprints, and structured growth plans; two received promotions within 12 months',
          'Partnered with Data Science to build a qualitative-quantitative research repository, reducing time to insight for new feature explorations by 50%',
        ],
      },
      {
        company: 'Dropbox',
        position: 'Product Designer',
        location: 'San Francisco, CA',
        startDate: 'Jun 2018',
        endDate: 'Mar 2021',
        description:
          'Designed real-time collaboration features adopted by 600K+ teams across Paper, Spaces, and the core file sharing experience.',
        bullets: [
          'Shipped the Spaces product from 0-to-1, running 14 rounds of usability testing and iterating from concept to GA in 11 months; feature drove 22% increase in team retention',
          'Created interactive prototypes in Figma and ProtoPie that enabled C-level product reviews and accelerated stakeholder sign-off by an average of 3 weeks',
          'Contributed 40+ reusable components to the Dropbox Design System, reducing inconsistency bugs reported by engineering by 65%',
          'Partnered with User Research on 8 longitudinal diary studies, surfacing collaboration pain points that directly informed 3 roadmap priorities',
        ],
      },
    ],
    education: [
      {
        school: 'Rhode Island School of Design',
        degree: 'BFA',
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
      'Figma',
      'Sketch',
      'Adobe Creative Suite',
      'Prototyping',
      'Design Systems',
    ],
    projects: [
      {
        name: 'Personal Finance App',
        description:
          'Designed iOS app with 10K+ downloads and 4.7-star rating.',
        technologies: ['Figma', 'SwiftUI'],
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
      name: 'Dr. Vikram Nair',
      email: 'vikram.nair@university.edu',
      phone: '+1 (617) 495-0000',
      address: 'Cambridge, MA',
      position: 'Assistant Professor · Computational Biology',
      linkedin: 'linkedin.com/in/vikramnair',
      summary:
        'Computational biologist and assistant professor specializing in machine learning applications for cancer genomics and single-cell transcriptomics. Committed to open-science principles, interdisciplinary collaboration, and training the next generation of computational researchers.',
    },
    experience: [
      {
        company: 'Harvard Medical School',
        position: 'Assistant Professor',
        location: 'Boston, MA',
        startDate: 'Jul 2020',
        endDate: 'Present',
        description:
          'Leads the Nair Computational Genomics Lab (8 researchers: 3 PhD students, 2 postdocs, 2 research scientists, 1 lab manager), focusing on cancer genomics and drug response prediction.',
        bullets: [
          'Secured $2.5M in extramural funding from NIH R01, NSF CAREER, and Chan Zuckerberg Initiative over 3 grant cycles',
          'Published 12 peer-reviewed articles in Nature Methods, Cell Systems, and Genome Research; h-index increased from 9 to 18 since joining faculty',
          'Developed and teach two graduate courses (BMI 210: Computational Genomics; BMI 315: Applied ML in Medicine) with average teaching evaluations of 4.8/5.0',
          'Co-founded the Harvard Computational Biology Seminar Series, coordinating 24 invited speakers per academic year across 6 departments',
          'Mentored 5 undergraduate researchers; 4 co-authored publications and 3 went on to top-10 PhD programs',
        ],
      },
      {
        company: 'Broad Institute',
        position: 'Postdoctoral Fellow',
        location: 'Cambridge, MA',
        startDate: 'Sep 2017',
        endDate: 'Jun 2020',
        description:
          'Developed deep learning models for predicting cancer drug response from multi-omic patient data, advised by Dr. Levi Garraway.',
        bullets: [
          'Built transformer-based model predicting drug sensitivity across 50 compounds with AUC 0.91, outperforming prior state-of-the-art by 12 percentage points',
          'Analyzed CRISPR knockout screens from 1,000+ cell lines to identify synthetic lethal gene pairs relevant to BRCA1/2-mutant cancers',
          'Published 8 peer-reviewed papers including first-author articles in Nature Genetics and Bioinformatics',
          'Presented research at ASHG, RECOMB, and ISMB; received Best Poster Award at RECOMB 2019',
        ],
      },
    ],
    education: [
      {
        school: 'Stanford University',
        degree: 'PhD',
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
      'Python',
      'R',
      'TensorFlow',
      'High-Performance Computing',
      'Single-Cell Analysis',
      'Bioinformatics',
    ],
    projects: [
      {
        name: 'OpenGRAVITY Cancer Atlas',
        description:
          'Federated learning atlas accelerating pan-cancer biomarker discovery across 14 institutions without raw data sharing.',
        technologies: ['Python', 'Snakemake', 'Docker'],
      },
    ],
    certifications: [
      {
        name: 'NIH IRACU Bioinformatics Workshop',
        issuer: 'NIH',
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
