import { ResumeData } from '@/types/resume.unified';

export const DUMMY_RESUME_DATA: ResumeData = {
  personalInfo: {
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+1 (555) 123-4567',
    address: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/sarahjohnson',
    github: 'github.com/sarahjohnson',
    website: 'sarahjohnson.dev',
    summary:
      'Results-driven Software Engineer with 5+ years of experience building scalable web applications. Expertise in React, Node.js, and cloud technologies.',
  },
  experience: [
    {
      company: 'Tech Innovations Inc',
      position: 'Senior Software Engineer',
      location: 'San Francisco, CA',
      startDate: 'Jan 2021',
      endDate: 'Present',
      description:
        'Lead development of customer-facing web applications serving 2M+ users',
      bullets: [
        'Architected and deployed microservices infrastructure reducing latency by 40%',
        'Led team of 5 engineers in agile development of React-based dashboard',
        'Implemented CI/CD pipeline improving deployment frequency by 300%',
      ],
    },
    {
      company: 'Digital Solutions LLC',
      position: 'Software Engineer',
      location: 'San Francisco, CA',
      startDate: 'Jun 2019',
      endDate: 'Dec 2020',
      description: 'Developed full-stack features for enterprise SaaS platform',
      bullets: [
        'Built RESTful APIs handling 10K+ requests per minute',
        'Optimized database queries reducing response time by 60%',
      ],
    },
  ],
  education: [
    {
      school: 'Stanford University',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      startDate: '2015',
      endDate: '2019',
      location: 'Stanford, CA',
      gpa: '3.8/4.0',
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
    'PostgreSQL',
    'MongoDB',
    'Git',
  ],
  projects: [
    {
      name: 'E-Commerce Platform',
      description:
        'Built full-stack e-commerce platform with payment integration, inventory management, and real-time analytics dashboard',
      technologies: 'React, Node.js, MongoDB, Stripe API, AWS',
      url: 'github.com/sarahjohnson/ecommerce',
      startDate: '2023',
      endDate: '2024',
    },
  ],
  certifications: [
    {
      name: 'AWS Certified Solutions Architect',
      issuer: 'Amazon Web Services',
      date: 'Mar 2023',
      url: 'aws.amazon.com/certification',
    },
  ],
};
