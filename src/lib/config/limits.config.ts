/**
 * Application Limits Configuration
 * Single source of truth for all limits
 */

export const limits = {
  free: {
    resumes: 3,
    aiGenerations: 50,
    pdfDownloads: 10,
    applications: 20,
  },
  pro: {
    resumes: 20,
    aiGenerations: 500,
    pdfDownloads: 100,
    applications: 200,
  },
  enterprise: {
    resumes: Infinity,
    aiGenerations: Infinity,
    pdfDownloads: Infinity,
    applications: Infinity,
  },
} as const;

export const fieldLimits = {
  personalInfo: {
    name: { min: 2, max: 100 },
    email: { max: 254 },
    phone: { max: 20 },
    address: { max: 200 },
    summary: { min: 50, max: 1000 },
    url: { max: 200 },
  },
  experience: {
    company: { min: 1, max: 100 },
    position: { min: 1, max: 100 },
    location: { min: 1, max: 100 },
    description: { min: 20, max: 500 },
    bullets: { min: 2, max: 5, itemLength: { min: 20, max: 200 } },
  },
  education: {
    school: { min: 1, max: 100 },
    degree: { min: 1, max: 100 },
    field: { min: 1, max: 100 },
    location: { min: 1, max: 100 },
  },
  skills: {
    max: 50,
    itemLength: { max: 50 },
  },
  projects: {
    name: { min: 1, max: 100 },
    description: { min: 50, max: 500 },
    technologies: { min: 5, max: 200 },
  },
  certifications: {
    name: { min: 1, max: 100 },
    issuer: { min: 1, max: 100 },
  },
} as const;

export type SubscriptionTier = keyof typeof limits;
