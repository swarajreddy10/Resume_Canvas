// Unified Resume Types - Single Source of Truth
export interface PersonalInfo {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  position?: string;
  linkedin?: string;
  github?: string;
  website?: string;
  summary?: string;
}

export interface Experience {
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  description?: string;
  bullets: string[];
}

export interface Education {
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  location: string;
  gpa?: string;
}

export interface Project {
  name: string;
  description: string;
  technologies: string | string[];
  url?: string;
  link?: string;
  startDate?: string;
  endDate?: string;
}

export interface Certification {
  name: string;
  issuer: string;
  date: string;
  url?: string;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skills: string[];
  projects?: Project[];
  certifications?: Certification[];
}

export interface Resume extends ResumeData {
  _id: string;
  userId: string;
  title: string;
  templateId: string;
  isPublic: boolean;
  atsScore?: number;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// Form Data Types
export interface PersonalInfoFormData {
  personalInfo: PersonalInfo;
}

export interface ExperienceFormData {
  experiences: Experience[];
}

export interface EducationFormData {
  education: Education[];
}

export interface SkillsFormData {
  skills: string[];
}

export interface ProjectsFormData {
  projects: Project[];
}

export interface CertificationsFormData {
  certifications: Certification[];
}

export interface ResumeBuilderData {
  personalInfo: PersonalInfo;
  experiences: Experience[];
  education: Education[];
  skills: string[];
  projects?: Project[];
  certifications?: Certification[];
}
