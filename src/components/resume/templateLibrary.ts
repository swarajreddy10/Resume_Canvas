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
      name: 'Sarah Chen',
      email: 'sarah.chen@email.com',
      phone: '+1 (415) 234-5678',
      address: 'Seattle, WA',
      linkedin: 'linkedin.com/in/sarahchen',
      github: 'github.com/sarahchen',
      summary:
        'Full-stack software engineer with 6+ years delivering scalable cloud-native solutions. Fluent in React, Node.js, and AWS.',
    },
    experience: [
      {
        company: 'Amazon Web Services',
        position: 'Senior Software Development Engineer',
        location: 'Seattle, WA',
        startDate: 'Mar 2021',
        endDate: 'Present',
        description:
          'Architected microservices platform handling 50M+ daily API requests with 99.99% uptime.',
        bullets: [
          'Led migration to serverless architecture, reducing costs by 45%',
          'Mentored 5 engineers and improved quality metrics by 60%',
        ],
      },
      {
        company: 'Microsoft',
        position: 'Software Engineer II',
        location: 'Redmond, WA',
        startDate: 'Jun 2019',
        endDate: 'Feb 2021',
        description:
          'Owned Azure DevOps CI/CD experiences for enterprise customers.',
        bullets: [
          'Improved release velocity by 30%',
          'Delivered automation tools adopted by 500+ teams',
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
      summary:
        'Strategic technology executive with 15+ years leading high-performing engineering teams.',
    },
    experience: [
      {
        company: 'Goldman Sachs',
        position: 'Vice President of Engineering',
        location: 'New York, NY',
        startDate: 'Jan 2020',
        endDate: 'Present',
        description:
          'Delivered trading infrastructure serving $2B+ daily volume and led migration to AWS.',
        bullets: [
          'Managed 120+ engineers across 8 teams with 95% retention',
          'Reduced incidents by 75% with engineering excellence programs',
        ],
      },
      {
        company: 'JPMorgan Chase',
        position: 'Senior Engineering Manager',
        location: 'New York, NY',
        startDate: 'Mar 2016',
        endDate: 'Dec 2019',
        description:
          'Oversaw mobile banking platform for 5M+ users with daily releases.',
        bullets: [
          'Introduced DevOps practices increasing deployment cadence to daily',
          'Partnered with product & design on $15M roadmap',
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
      summary:
        'Management consultant with 8+ years advising Fortune 500 clients on strategy and operations.',
    },
    experience: [
      {
        company: 'McKinsey & Company',
        position: 'Senior Associate',
        location: 'Boston, MA',
        startDate: 'Sep 2019',
        endDate: 'Present',
        description:
          'Led consulting engagements delivering $80M in client value through digital transformation.',
        bullets: [
          'Built operating models for scale-ups growing from 200 to 1,000 employees',
          'Presented strategy to C-suite with 100% satisfaction',
        ],
      },
      {
        company: 'Bain & Company',
        position: 'Associate Consultant',
        location: 'Boston, MA',
        startDate: 'Jul 2017',
        endDate: 'Aug 2019',
        description:
          'Performed diligence for private equity and retail clients.',
        bullets: [
          'Developed financial models for $2B+ investment targets',
          'Led workshops aligning leadership teams',
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
      summary:
        'Product designer with 7+ years crafting human-centered experiences for consumer and enterprise products.',
    },
    experience: [
      {
        company: 'Airbnb',
        position: 'Senior Product Designer',
        location: 'San Francisco, CA',
        startDate: 'Apr 2021',
        endDate: 'Present',
        description:
          'Led onboarding redesign increasing listing completion by 35%.',
        bullets: [
          'Established design system components used across 15 teams',
          'Mentored 3 designers in design thinking and prototyping',
        ],
      },
      {
        company: 'Dropbox',
        position: 'Product Designer',
        location: 'San Francisco, CA',
        startDate: 'Jun 2018',
        endDate: 'Mar 2021',
        description: 'Designed collaboration features adopted by 600K+ teams.',
        bullets: [
          'Shipped prototypes validated with user research',
          'Built consistent components for Dropbox design system',
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
      name: 'Dr. Emily Watson',
      email: 'emily.watson@university.edu',
      phone: '+1 (617) 495-0000',
      address: 'Cambridge, MA',
      summary:
        'Computational biologist and assistant professor with expertise in machine learning for genomics.',
    },
    experience: [
      {
        company: 'Harvard Medical School',
        position: 'Assistant Professor',
        location: 'Boston, MA',
        startDate: 'Jul 2020',
        endDate: 'Present',
        description:
          'Leads a lab of 8 researchers focusing on cancer genomics.',
        bullets: [
          'Secured $2.5M in NIH & NSF funding',
          'Published 12 papers with 4.8/5.0 teaching reviews',
        ],
      },
      {
        company: 'Broad Institute',
        position: 'Postdoctoral Fellow',
        location: 'Cambridge, MA',
        startDate: 'Sep 2017',
        endDate: 'Jun 2020',
        description: 'Developed ML models for predicting drug response.',
        bullets: [
          'Analyzed CRISPR data from 1,000+ samples',
          'Published 8 papers',
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
    ],
    projects: [
      {
        name: 'OpenGRAVITY Cancer Atlas',
        description:
          'Federated learning atlas accelerating biomarker discovery.',
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
