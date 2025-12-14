import { z } from 'zod';

// Helper for optional URL validation
const optionalUrl = z
  .string()
  .optional()
  .or(z.literal(''))
  .refine(
    (val) => {
      if (!val || val === '') return true;
      try {
        new URL(val);
        return val.startsWith('http://') || val.startsWith('https://');
      } catch {
        return false;
      }
    },
    { message: 'Must be a valid URL starting with http:// or https://' }
  );

// Helper for phone validation
const phoneRegex = /^[\+]?[1-9][\d]{0,3}[\s\-\(\)]?[\d\s\-\(\)]{7,15}$/;

// Helper for date validation
const dateString = z.string().refine(
  (val) => {
    if (!val || val === '' || val.toLowerCase() === 'present') return true;
    // Accept various date formats: MM/YYYY, YYYY, MM-YYYY, Mon YYYY, Month YYYY
    return /^(0[1-9]|1[0-2])[\/\-]\d{4}$|^\d{4}$|^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s\d{4}$|^(January|February|March|April|May|June|July|August|September|October|November|December)\s\d{4}$/i.test(
      val
    );
  },
  { message: 'Date must be in MM/YYYY, YYYY, or Mon YYYY format, or "Present"' }
);

export const PersonalInfoSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .regex(
      /^[a-zA-Z\s\-\.]+$/,
      'Name can only contain letters, spaces, hyphens, and periods'
    ),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .max(254, 'Email must be less than 254 characters'),
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .regex(phoneRegex, 'Please enter a valid phone number'),
  address: z
    .string()
    .max(200, 'Address must be less than 200 characters')
    .optional()
    .or(z.literal('')),
  linkedin: optionalUrl,
  github: optionalUrl,
  website: optionalUrl,
  summary: z
    .string()
    .min(50, 'Summary must be at least 50 characters')
    .max(500, 'Summary must be less than 500 characters'),
});

export const EducationSchema = z.object({
  school: z
    .string()
    .min(1, 'School name is required')
    .max(100, 'School name must be less than 100 characters')
    .regex(/^[a-zA-Z0-9\s\-\.,&]+$/, 'School name contains invalid characters'),
  degree: z
    .string()
    .min(1, 'Degree is required')
    .max(100, 'Degree must be less than 100 characters'),
  field: z
    .string()
    .min(1, 'Field of study is required')
    .max(100, 'Field of study must be less than 100 characters'),
  startDate: dateString.refine((val) => val !== '', {
    message: 'Start date is required',
  }),
  endDate: dateString.refine((val) => val !== '', {
    message: 'End date is required',
  }),
  gpa: z
    .string()
    .optional()
    .or(z.literal(''))
    .refine(
      (val) => {
        if (!val || val === '') return true;
        const num = parseFloat(val.split('/')[0]);
        return !isNaN(num) && num >= 0 && num <= 10.0;
      },
      { message: 'GPA must be a valid number between 0.0 and 10.0' }
    ),
  location: z
    .string()
    .min(1, 'Location is required')
    .max(100, 'Location must be less than 100 characters'),
});

export const ExperienceSchema = z.object({
  company: z
    .string()
    .min(1, 'Company name is required')
    .max(100, 'Company name must be less than 100 characters')
    .regex(
      /^[a-zA-Z0-9\s\-\.,&]+$/,
      'Company name contains invalid characters'
    ),
  position: z
    .string()
    .min(1, 'Position is required')
    .max(100, 'Position must be less than 100 characters'),
  location: z
    .string()
    .min(1, 'Location is required')
    .max(100, 'Location must be less than 100 characters'),
  startDate: dateString.refine((val) => val !== '', {
    message: 'Start date is required',
  }),
  endDate: dateString.refine((val) => val !== '', {
    message: 'End date is required',
  }),
  description: z
    .string()
    .min(20, 'Description must be at least 20 characters')
    .max(500, 'Description must be less than 500 characters'),
  bullets: z
    .array(
      z
        .string()
        .min(20, 'Bullet must be at least 20 characters')
        .max(200, 'Bullet must be less than 200 characters')
    )
    .min(2, 'At least 2 bullet points required')
    .max(5, 'Maximum 5 bullet points allowed')
    .default([]),
});

export const ProjectSchema = z.object({
  name: z
    .string()
    .min(1, 'Project name is required')
    .max(100, 'Project name must be less than 100 characters'),
  description: z
    .string()
    .min(50, 'Description must be at least 50 characters')
    .max(500, 'Description must be less than 500 characters'),
  technologies: z
    .string()
    .min(5, 'At least one technology required')
    .max(200, 'Technologies must be less than 200 characters'),
  url: optionalUrl,
  startDate: dateString.refine((val) => val !== '', {
    message: 'Start date is required',
  }),
  endDate: dateString.refine((val) => val !== '', {
    message: 'End date is required',
  }),
});

export const CertificationSchema = z.object({
  name: z
    .string()
    .min(1, 'Certification name is required')
    .max(100, 'Certification name must be less than 100 characters'),
  issuer: z
    .string()
    .min(1, 'Issuing organization is required')
    .max(100, 'Issuing organization must be less than 100 characters'),
  date: dateString.refine((val) => val !== '', {
    message: 'Issue date is required',
  }),
  url: optionalUrl,
});

export const ResumeSchema = z.object({
  title: z.string().min(1, 'Resume title is required').max(100),
  personalInfo: PersonalInfoSchema,
  education: z.array(EducationSchema).default([]),
  experience: z.array(ExperienceSchema).default([]),
  skills: z.array(z.string().max(50)).default([]),
  templateId: z.enum(['modern', 'classic', 'minimal']).default('modern'),
});

// Array schemas for forms
export const EducationArraySchema = z.object({
  education: z.array(EducationSchema).default([]),
});

export const ExperienceArraySchema = z.object({
  experiences: z.array(ExperienceSchema).default([]),
});

export const SkillsArraySchema = z.object({
  skills: z.array(z.string().max(50)).default([]),
});

export const ProjectsArraySchema = z.object({
  projects: z.array(ProjectSchema).default([]),
});

export const CertificationsArraySchema = z.object({
  certifications: z.array(CertificationSchema).default([]),
});

export type PersonalInfoFormData = z.infer<typeof PersonalInfoSchema>;
export type EducationFormData = z.infer<typeof EducationSchema>;
export type ExperienceFormData = z.infer<typeof ExperienceSchema>;
export type ProjectFormData = z.infer<typeof ProjectSchema>;
export type CertificationFormData = z.infer<typeof CertificationSchema>;
export type ResumeFormData = z.infer<typeof ResumeSchema>;
export type EducationArrayData = z.infer<typeof EducationArraySchema>;
export type ExperienceArrayData = z.infer<typeof ExperienceArraySchema>;
export type SkillsArrayData = z.infer<typeof SkillsArraySchema>;
export type ProjectsArrayData = z.infer<typeof ProjectsArraySchema>;
export type CertificationsArrayData = z.infer<typeof CertificationsArraySchema>;
