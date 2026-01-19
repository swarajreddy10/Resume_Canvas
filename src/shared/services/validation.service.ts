import {
  CertificationsArrayData,
  CertificationsArraySchema,
  EducationArrayData,
  EducationArraySchema,
  ExperienceArrayData,
  ExperienceArraySchema,
  PersonalInfoFormData,
  PersonalInfoSchema,
  ProjectsArrayData,
  ProjectsArraySchema,
  SkillsArrayData,
  SkillsArraySchema,
} from '@/lib/validation/resume.schemas';
import { z } from 'zod';

export interface ValidationError {
  section: string;
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  summary: string;
}

/**
 * Formats Zod error path to a human-readable field name
 */
function formatFieldName(path: (string | number)[]): string {
  if (path.length === 0) return 'Unknown field';

  const fieldMap: Record<string, string> = {
    name: 'Name',
    email: 'Email',
    phone: 'Phone',
    address: 'Address',
    linkedin: 'LinkedIn URL',
    github: 'GitHub URL',
    website: 'Website URL',
    summary: 'Summary',
    company: 'Company',
    position: 'Position',
    location: 'Location',
    startDate: 'Start Date',
    endDate: 'End Date',
    description: 'Description',
    bullets: 'Bullet Points',
    school: 'School/University',
    degree: 'Degree',
    field: 'Field of Study',
    gpa: 'GPA',
    skills: 'Skills',
    projects: 'Projects',
    certifications: 'Certifications',
    url: 'URL',
    issuer: 'Issuing Organization',
    date: 'Date',
    technologies: 'Technologies',
  };

  const lastPath = path[path.length - 1];
  const fieldKey =
    typeof lastPath === 'number'
      ? path[path.length - 2]?.toString() || 'item'
      : lastPath.toString();

  // Handle array indices
  if (typeof lastPath === 'number' && path.length > 1) {
    const parentField = path[path.length - 2]?.toString() || '';
    const fieldName = fieldMap[parentField] || parentField;
    return `${fieldName} (Item ${lastPath + 1})`;
  }

  return fieldMap[fieldKey] || fieldKey;
}

/**
 * Validates a single section and returns formatted errors
 */
function validateSection<T>(
  data: T | null | undefined,
  schema: z.ZodSchema<T>,
  sectionName: string
): ValidationError[] {
  if (!data) {
    return [];
  }

  try {
    // Ensure data is not null/undefined before validation
    if (data === null || data === undefined) {
      return [];
    }

    const result = schema.safeParse(data);

    // If validation succeeded, return no errors
    if (result.success) {
      return [];
    }

    // If validation failed, check error structure
    if (!result.error) {
      console.warn(
        `Validation failed for ${sectionName} but no error object found`
      );
      return [
        {
          section: sectionName,
          field: 'Data',
          message: 'Validation failed',
        },
      ];
    }

    // Check if issues array exists and is valid
    const zodErrors = result.error.issues;
    if (!zodErrors || !Array.isArray(zodErrors) || zodErrors.length === 0) {
      // Try to get error message from result.error directly
      const errorMessage = result.error.message || 'Validation failed';
      return [
        {
          section: sectionName,
          field: 'Data',
          message: errorMessage,
        },
      ];
    }

    // Map Zod errors to ValidationError format
    return zodErrors.map((err) => {
      const path = err.path || [];

      // Extract readable error message from Zod error
      let message = err.message || 'Validation error';

      interface ZodErrorWithDetails {
        code: string;
        message: string;
        path: (string | number)[];
        minimum?: number;
        maximum?: number;
        type?: string;
        unionErrors?: unknown[];
      }

      const errorWithDetails = err as ZodErrorWithDetails;

      // Handle special Zod error types
      if (err.code === 'too_small') {
        if (
          errorWithDetails.minimum === 1 &&
          errorWithDetails.type === 'string'
        ) {
          message = `${formatFieldName(path as (string | number)[])} is required`;
        } else {
          message =
            err.message ||
            `${formatFieldName(path as (string | number)[])} is too short (minimum ${errorWithDetails.minimum})`;
        }
      } else if (err.code === 'too_big') {
        message =
          err.message ||
          `${formatFieldName(path as (string | number)[])} is too long (maximum ${errorWithDetails.maximum})`;
      } else if (err.code === 'invalid_type') {
        message =
          err.message ||
          `Invalid ${formatFieldName(path as (string | number)[]).toLowerCase()}`;
      } else if (err.code === 'invalid_union') {
        // Handle union errors (like optional string or empty string)
        if (
          errorWithDetails.unionErrors &&
          Array.isArray(errorWithDetails.unionErrors) &&
          errorWithDetails.unionErrors.length > 0
        ) {
          const firstError = errorWithDetails.unionErrors[0] as {
            message?: string;
          };
          if (
            firstError &&
            typeof firstError === 'object' &&
            'message' in firstError
          ) {
            message = firstError.message || 'Invalid input';
          } else {
            message = 'Invalid input format';
          }
        } else {
          message = 'Invalid input format';
        }
      } else {
        // Handle all other error types including custom, invalid_string, etc.
        message = err.message || 'Validation failed';
      }

      return {
        section: sectionName,
        field: formatFieldName(path as (string | number)[]),
        message: message,
      };
    });
  } catch (error) {
    // Handle unexpected errors during validation
    console.error(`Unexpected validation error in ${sectionName}:`, error, {
      data,
    });
    return [
      {
        section: sectionName,
        field: 'Data',
        message:
          error instanceof Error
            ? `Validation error: ${error.message}`
            : 'An unexpected error occurred during validation',
      },
    ];
  }
}

/**
 * Validates all resume sections and returns a comprehensive result
 */
export function validateResumeData(data: {
  personalInfo?: PersonalInfoFormData | null;
  experience?: ExperienceArrayData | null;
  education?: EducationArrayData | null;
  skills?: SkillsArrayData | null;
  projects?: ProjectsArrayData | null;
  certifications?: CertificationsArrayData | null;
}): ValidationResult {
  const errors: ValidationError[] = [];

  try {
    // Validate Personal Info (required)
    if (!data.personalInfo) {
      errors.push({
        section: 'Personal Information',
        field: 'All fields',
        message: 'Personal information is required to save your resume',
      });
    } else {
      const personalInfoErrors = validateSection(
        data.personalInfo,
        PersonalInfoSchema,
        'Personal Information'
      );
      errors.push(...personalInfoErrors);
    }

    // Validate Experience (if provided)
    if (data.experience && typeof data.experience === 'object') {
      const experienceErrors = validateSection(
        data.experience,
        ExperienceArraySchema,
        'Experience'
      );
      if (experienceErrors.length > 0) {
        errors.push(...experienceErrors);
      }
    }

    // Validate Education (if provided)
    if (data.education && typeof data.education === 'object') {
      const educationErrors = validateSection(
        data.education,
        EducationArraySchema,
        'Education'
      );
      if (educationErrors.length > 0) {
        errors.push(...educationErrors);
      }
    }

    // Validate Skills (if provided)
    if (data.skills && typeof data.skills === 'object') {
      const skillsErrors = validateSection(
        data.skills,
        SkillsArraySchema,
        'Skills'
      );
      if (skillsErrors.length > 0) {
        errors.push(...skillsErrors);
      }
    }

    // Validate Projects (if provided)
    if (data.projects && typeof data.projects === 'object') {
      const projectsErrors = validateSection(
        data.projects,
        ProjectsArraySchema,
        'Projects'
      );
      if (projectsErrors.length > 0) {
        errors.push(...projectsErrors);
      }
    }

    // Validate Certifications (if provided)
    if (data.certifications && typeof data.certifications === 'object') {
      const certificationsErrors = validateSection(
        data.certifications,
        CertificationsArraySchema,
        'Certifications'
      );
      if (certificationsErrors.length > 0) {
        errors.push(...certificationsErrors);
      }
    }
  } catch (error) {
    // Handle unexpected errors during validation
    console.error('Unexpected error during resume validation:', error);
    errors.push({
      section: 'Validation',
      field: 'System',
      message:
        error instanceof Error
          ? `Validation error: ${error.message}`
          : 'An unexpected error occurred during validation',
    });
  }

  // Generate summary
  const summary =
    errors.length === 0
      ? 'All data is valid'
      : errors.length === 1
        ? '1 validation error found'
        : `${errors.length} validation errors found`;

  return {
    isValid: errors.length === 0,
    errors,
    summary,
  };
}

/**
 * Groups errors by section for better display
 */
export function groupErrorsBySection(
  errors: ValidationError[]
): Record<string, ValidationError[]> {
  return errors.reduce(
    (acc, error) => {
      if (!acc[error.section]) {
        acc[error.section] = [];
      }
      acc[error.section].push(error);
      return acc;
    },
    {} as Record<string, ValidationError[]>
  );
}

/**
 * Formats validation errors into a user-friendly message
 */
export function formatValidationMessage(result: ValidationResult): string {
  if (result.isValid) {
    return 'All data is valid';
  }

  const grouped = groupErrorsBySection(result.errors);
  const sections = Object.keys(grouped);

  if (sections.length === 1) {
    const sectionErrors = grouped[sections[0]];
    if (sectionErrors.length === 1) {
      return `${sectionErrors[0].field}: ${sectionErrors[0].message}`;
    }
    return `${sections[0]}: ${sectionErrors.length} error(s) found`;
  }

  return `${result.summary} across ${sections.length} section(s)`;
}
