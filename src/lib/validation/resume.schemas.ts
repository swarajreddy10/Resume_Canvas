import { z } from 'zod';
import { fieldLimits } from '@/lib/config/limits.config';

// Validation constants - Single source of truth
export const VALIDATION_LIMITS = {
  description: { min: 25, max: 500 },
  summary: { min: 25, max: 1000 },
  bullet: { min: 25, max: 200 },
} as const;

// Enhanced regex patterns
const URL_REGEX =
  /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*)$/;
const PHONE_REGEX =
  /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;
const NAME_REGEX = /^[a-zA-Z\s\-\.,']+$/;
const COMPANY_REGEX = /^[a-zA-Z0-9\s\-\.,&()]+$/;
const LOCATION_REGEX = /^[a-zA-Z0-9\s\-\.,]+$/;
const DATE_REGEX =
  /^(0[1-9]|1[0-2])[\/\-]\d{4}$|^\d{4}$|^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December)\s\d{4}$|^Present$/i;

// Helper for optional URL validation
const optionalUrl = z
  .string()
  .optional()
  .or(z.literal(''))
  .refine(
    (val) => {
      if (!val || val === '') return true;
      return URL_REGEX.test(val);
    },
    { message: 'Must be a valid URL starting with http:// or https://' }
  );

// Helper for date validation
const dateString = z.string().refine(
  (val) => {
    if (!val || val === '') return true;
    return DATE_REGEX.test(val);
  },
  { message: 'Date must be in MM/YYYY, YYYY, Mon YYYY, or "Present" format' }
);

export const PersonalInfoSchema = z.object({
  name: z
    .string()
    .min(
      fieldLimits.personalInfo.name.min,
      'Name must be at least 2 characters'
    )
    .max(
      fieldLimits.personalInfo.name.max,
      'Name must be less than 100 characters'
    )
    .regex(
      NAME_REGEX,
      'Name can only contain letters, spaces, hyphens, periods, commas, and apostrophes'
    ),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .max(
      fieldLimits.personalInfo.email.max,
      'Email must be less than 254 characters'
    ),
  phone: z
    .string()
    .optional()
    .or(z.literal(''))
    .refine(
      (val) => {
        if (!val || val === '') return true;
        return PHONE_REGEX.test(val);
      },
      { message: 'Please enter a valid phone number' }
    ),
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
    .min(
      VALIDATION_LIMITS.summary.min,
      `Summary must be at least ${VALIDATION_LIMITS.summary.min} characters`
    )
    .max(
      VALIDATION_LIMITS.summary.max,
      `Summary must be less than ${VALIDATION_LIMITS.summary.max} characters`
    ),
});

export const EducationSchema = z.object({
  school: z
    .string()
    .min(1, 'School name is required')
    .max(100, 'School name must be less than 100 characters')
    .regex(COMPANY_REGEX, 'School name contains invalid characters'),
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
    .max(100, 'Location must be less than 100 characters')
    .regex(LOCATION_REGEX, 'Location contains invalid characters'),
});

export const ExperienceSchema = z.object({
  company: z
    .string()
    .min(1, 'Company name is required')
    .max(100, 'Company name must be less than 100 characters')
    .regex(COMPANY_REGEX, 'Company name contains invalid characters'),
  position: z
    .string()
    .min(1, 'Position is required')
    .max(100, 'Position must be less than 100 characters'),
  location: z
    .string()
    .min(1, 'Location is required')
    .max(100, 'Location must be less than 100 characters')
    .regex(LOCATION_REGEX, 'Location contains invalid characters'),
  startDate: dateString.refine((val) => val !== '', {
    message: 'Start date is required',
  }),
  endDate: dateString.refine((val) => val !== '', {
    message: 'End date is required',
  }),
  description: z
    .string()
    .min(
      VALIDATION_LIMITS.description.min,
      `Description must be at least ${VALIDATION_LIMITS.description.min} characters`
    )
    .max(
      VALIDATION_LIMITS.description.max,
      `Description must be less than ${VALIDATION_LIMITS.description.max} characters`
    ),
  bullets: z
    .array(
      z
        .string()
        .min(
          VALIDATION_LIMITS.bullet.min,
          `Bullet must be at least ${VALIDATION_LIMITS.bullet.min} characters`
        )
        .max(
          VALIDATION_LIMITS.bullet.max,
          `Bullet must be less than ${VALIDATION_LIMITS.bullet.max} characters`
        )
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
    .min(
      VALIDATION_LIMITS.description.min,
      `Description must be at least ${VALIDATION_LIMITS.description.min} characters`
    )
    .max(
      VALIDATION_LIMITS.description.max,
      `Description must be less than ${VALIDATION_LIMITS.description.max} characters`
    ),
  technologies: z
    .string()
    .min(5, 'At least one technology required')
    .max(200, 'Technologies must be less than 200 characters'),
  url: optionalUrl,
  startDate: z.string().optional().or(z.literal('')),
  endDate: z.string().optional().or(z.literal('')),
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
  date: z.string().optional().or(z.literal('')),
  url: optionalUrl,
});

export const ResumeSchema = z.object({
  title: z.string().min(1, 'Resume title is required').max(100),
  personalInfo: PersonalInfoSchema,
  education: z.array(EducationSchema).default([]),
  experience: z.array(ExperienceSchema).default([]),
  skills: z.array(z.string().max(50)).default([]),
  templateId: z
    .enum(['executive', 'tech', 'corporate', 'creative', 'academic'])
    .default('tech'),
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
