/**
 * API Request Validation Schemas
 * Zod schemas for API endpoint validation
 */

import { z } from 'zod';

export const BulletPointRequestSchema = z.object({
  jobTitle: z.string().min(1).max(100),
  company: z.string().min(1).max(100),
  description: z.string().min(20).max(2000),
  skills: z.array(z.string().max(50)).optional(),
});

export const OptimizeResumeSchema = z.object({
  resumeContent: z.string().min(100).max(10000),
});

export const CoverLetterRequestSchema = z.object({
  resumeData: z.object({
    personalInfo: z.object({
      name: z.string(),
      email: z.string().email(),
    }),
    experience: z.array(z.any()).optional(),
    education: z.array(z.any()).optional(),
    skills: z.array(z.string()).optional(),
  }),
  jobDescription: z.string().min(50).max(5000),
  companyName: z.string().min(1).max(100),
  jobTitle: z.string().min(1).max(100),
});

export const InterviewQuestionsSchema = z.object({
  resumeData: z.object({
    personalInfo: z.any(),
    experience: z.array(z.any()).optional(),
    education: z.array(z.any()).optional(),
    skills: z.array(z.string()).optional(),
  }),
  jobTitle: z.string().min(1).max(100),
});

export type BulletPointRequest = z.infer<typeof BulletPointRequestSchema>;
export type OptimizeResumeRequest = z.infer<typeof OptimizeResumeSchema>;
export type CoverLetterRequest = z.infer<typeof CoverLetterRequestSchema>;
export type InterviewQuestionsRequest = z.infer<
  typeof InterviewQuestionsSchema
>;
