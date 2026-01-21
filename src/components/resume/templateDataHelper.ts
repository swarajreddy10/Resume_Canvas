'use client';

import { ResumeData } from '@/types/resume.unified';
import { TemplateType, TEMPLATE_SAMPLE_DATA } from './templateLibrary';

export interface TemplateDataOptions {
  fallbackToSample?: boolean;
}

export function mergeTemplateData(
  template: TemplateType,
  userData?: Partial<ResumeData>,
  options: TemplateDataOptions = {}
): ResumeData {
  const { fallbackToSample = true } = options;
  const sampleData = TEMPLATE_SAMPLE_DATA[template];

  if (!userData || Object.keys(userData).length === 0) {
    return sampleData;
  }

  const hasContent = (obj: unknown): boolean => {
    if (!obj) return false;
    if (Array.isArray(obj)) return obj.length > 0;
    if (typeof obj === 'string') return obj.trim().length > 0;
    if (typeof obj === 'object') {
      return Object.values(obj).some((value) =>
        typeof value === 'string' ? value.trim().length > 0 : Boolean(value)
      );
    }
    return Boolean(obj);
  };

  return {
    personalInfo: {
      ...sampleData.personalInfo,
      ...(userData.personalInfo || {}),
    },
    experience:
      hasContent(userData.experience) || !fallbackToSample
        ? userData.experience || []
        : sampleData.experience,
    education:
      hasContent(userData.education) || !fallbackToSample
        ? userData.education || []
        : sampleData.education,
    skills:
      hasContent(userData.skills) || !fallbackToSample
        ? userData.skills || []
        : sampleData.skills,
    projects:
      hasContent(userData.projects) || !fallbackToSample
        ? userData.projects || []
        : sampleData.projects,
    certifications:
      hasContent(userData.certifications) || !fallbackToSample
        ? userData.certifications || []
        : sampleData.certifications,
  };
}

export function getTemplatePreviewData(
  template: TemplateType,
  userData?: Partial<ResumeData>
): ResumeData {
  return mergeTemplateData(template, userData, { fallbackToSample: true });
}
