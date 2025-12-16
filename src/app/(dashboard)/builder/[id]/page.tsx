'use client';

import KeywordOptimizer from '@/components/ai/KeywordOptimizer';
import ResumeReviewer from '@/components/ai/ResumeReviewer';
import CertificationsForm from '@/components/forms/CertificationsForm';
import EducationForm from '@/components/forms/EducationForm';
import ExperienceForm from '@/components/forms/ExperienceForm';
import PersonalInfoForm from '@/components/forms/PersonalInfoForm';
import ProjectsForm from '@/components/forms/ProjectsForm';
import SkillsForm from '@/components/forms/SkillsForm';
import ATSOptimizer from '@/components/resume/ATSOptimizer';
import ResumeAnalytics from '@/components/resume/ResumeAnalytics';
import ShareButton from '@/components/resume/ShareButton';
import TemplateGallery from '@/components/resume/TemplateGallery';
import TemplateRenderer from '@/components/resume/TemplateRenderer';
import { TemplateType } from '@/components/resume/TemplateSelector';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, EyeOff } from 'lucide-react';
// import { debouncedAutoSave } from '@/lib/performance/optimization';
import {
  showDetailedError,
  showError,
  showInfo,
  showSuccess,
} from '@/lib/services';
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
} from '@/lib/validation/resume.schemas';
import {
  Certification,
  Project,
  ResumeBuilderData,
  ResumeData,
} from '@/types/resume.unified';
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

interface LocalResumeData {
  personalInfo: PersonalInfoFormData | null;
  experience: ExperienceArrayData | null;
  education: EducationArrayData | null;
  skills: SkillsArrayData | null;
  projects: ProjectsArrayData | null;
  certifications: CertificationsArrayData | null;
}

export default function ResumeBuilderPage() {
  const { data: session, status } = useSession();
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('personal');
  const [resumeData, setResumeData] = useState<LocalResumeData>({
    personalInfo: null,
    experience: null,
    education: null,
    skills: null,
    projects: null,
    certifications: null,
  });
  const [resumeId, setResumeId] = useState<string | null>(
    params.id === 'new' ? null : (params.id as string)
  );
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [loading, setLoading] = useState(params.id !== 'new');
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] =
    useState<TemplateType>('tech');
  const [isPublic, setIsPublic] = useState(false);
  const [viewCount] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const resumeRef = useRef<HTMLDivElement>(null);

  const loadResumeData = useCallback(
    async (id: string) => {
      try {
        // Try slug first, fallback to ID
        let response = await fetch(`/api/resumes/slug/${id}`);
        if (!response.ok) {
          response = await fetch(`/api/resumes/${id}`);
        }
        if (response.ok) {
          const data = await response.json();
          const resume = data.resume;
          setResumeData({
            personalInfo: resume.personalInfo || {
              name: '',
              email: '',
              phone: '',
              address: '',
              linkedin: '',
              github: '',
              website: '',
              summary: '',
            },
            experience: resume.experience?.length
              ? { experiences: resume.experience }
              : { experiences: [] },
            education: resume.education?.length
              ? { education: resume.education }
              : { education: [] },
            skills: resume.skills?.length
              ? { skills: resume.skills }
              : { skills: [] },
            projects: resume.projects?.length
              ? { projects: resume.projects }
              : { projects: [] },
            certifications: resume.certifications?.length
              ? { certifications: resume.certifications }
              : { certifications: [] },
          });
          setSelectedTemplate(resume.templateId || 'modern');
          setIsPublic(resume.isPublic || false);
          setResumeId(resume._id);

          // Redirect to slug URL if available and different
          if (resume.slug && id && id !== resume.slug && id.length > 20) {
            router.replace(`/builder/${resume.slug}`);
          }
        }
      } catch (error) {
        console.error('Failed to load resume:', error);
      } finally {
        setLoading(false);
      }
    },
    [router]
  );

  // Load existing resume data
  useEffect(() => {
    if (params.id && params.id !== 'new') {
      loadResumeData(params.id as string);
    }
  }, [params.id, loadResumeData]);

  // Unsaved changes warning
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue =
          'You have unsaved changes. Are you sure you want to leave?';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const handleSkillsSubmit = (data: SkillsArrayData) => {
    setResumeData((prev) => ({ ...prev, skills: data }));
    setHasUnsavedChanges(true);
  };

  const [validationErrors, setValidationErrors] = useState<
    Record<string, string[]>
  >({});
  const [hasValidationErrors, setHasValidationErrors] = useState(false);

  // Check validation status across all forms
  const checkValidationStatus = useCallback(() => {
    const errors: Record<string, string[]> = {};
    let hasErrors = false;

    // Check personal info validation
    if (resumeData.personalInfo) {
      const result = PersonalInfoSchema.safeParse(resumeData.personalInfo);
      if (!result.success) {
        errors.personalInfo = result.error.issues.map(
          (err) => `${err.path.join('.')}: ${err.message}`
        );
        hasErrors = true;
      }
    }

    // Check experience validation
    if (resumeData.experience?.experiences?.length) {
      // Filter out empty experiences before validation
      const nonEmptyExperiences = resumeData.experience.experiences.filter(
        (exp) =>
          exp.company ||
          exp.position ||
          exp.location ||
          exp.startDate ||
          exp.endDate
      );
      if (nonEmptyExperiences.length > 0) {
        const result = ExperienceArraySchema.safeParse({
          experiences: nonEmptyExperiences,
        });
        if (!result.success) {
          errors.experience = result.error.issues.map(
            (err) => `${err.path.join('.')}: ${err.message}`
          );
          hasErrors = true;
        }
      }
    }

    // Check education validation
    if (resumeData.education?.education?.length) {
      // Filter out empty education entries before validation
      const nonEmptyEducation = resumeData.education.education.filter(
        (edu) =>
          edu.school || edu.degree || edu.field || edu.startDate || edu.endDate
      );
      if (nonEmptyEducation.length > 0) {
        const result = EducationArraySchema.safeParse({
          education: nonEmptyEducation,
        });
        if (!result.success) {
          errors.education = result.error.issues.map(
            (err) => `${err.path.join('.')}: ${err.message}`
          );
          hasErrors = true;
        }
      }
    }

    // Check projects validation
    if (resumeData.projects?.projects?.length) {
      // Filter out empty projects before validation
      const nonEmptyProjects = resumeData.projects.projects
        .filter((proj) => proj.name || proj.description || proj.technologies)
        .map((proj) => ({
          ...proj,
          technologies:
            typeof proj.technologies === 'string'
              ? proj.technologies
              : Array.isArray(proj.technologies)
                ? (proj.technologies as string[]).join(', ')
                : '',
        }));
      if (nonEmptyProjects.length > 0) {
        const result = ProjectsArraySchema.safeParse({
          projects: nonEmptyProjects,
        });
        if (!result.success) {
          errors.projects = result.error.issues.map(
            (err) => `${err.path.join('.')}: ${err.message}`
          );
          hasErrors = true;
        }
      }
    }

    // Check certifications validation
    if (resumeData.certifications?.certifications?.length) {
      // Filter out empty certifications before validation
      const nonEmptyCertifications =
        resumeData.certifications.certifications.filter(
          (cert) => cert.name || cert.issuer
        );
      if (nonEmptyCertifications.length > 0) {
        const result = CertificationsArraySchema.safeParse({
          certifications: nonEmptyCertifications,
        });
        if (!result.success) {
          errors.certifications = result.error.issues.map(
            (err) => `${err.path.join('.')}: ${err.message}`
          );
          hasErrors = true;
        }
      }
    }

    setValidationErrors(errors);
    setHasValidationErrors(hasErrors);
    return !hasErrors;
  }, [resumeData]);

  // Check validation whenever resume data changes
  useEffect(() => {
    checkValidationStatus();
  }, [checkValidationStatus]);

  const saveResume = useCallback(
    async (isDraft = false) => {
      setSaving(true);
      try {
        // For final save, check validation
        if (!isDraft) {
          const isValid = checkValidationStatus();
          if (!isValid) {
            const errorSections = Object.keys(validationErrors);
            showDetailedError(
              'Cannot save resume - Please fix validation errors',
              [`Errors found in: ${errorSections.join(', ')}`],
              { duration: 8000 }
            );
            setSaving(false);
            return;
          }
        }

        // Show saving indicator
        showInfo(isDraft ? 'Saving draft...' : 'Saving your resume...', {
          duration: 2000,
        });
        const payload = {
          title: resumeData.personalInfo?.name
            ? `${resumeData.personalInfo.name}'s Resume`
            : 'My Resume',
          personalInfo: resumeData.personalInfo,
          experience: resumeData.experience?.experiences || [],
          education: resumeData.education?.education || [],
          skills: resumeData.skills?.skills || [],
          projects: resumeData.projects?.projects || [],
          certifications: resumeData.certifications?.certifications || [],
          templateId: selectedTemplate,
          isDraft,
        };

        if (resumeId) {
          // Update existing resume
          const response = await fetch(`/api/resumes/${resumeId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });

          if (response.ok) {
            await response.json();
            setLastSaved(new Date());
            setHasUnsavedChanges(false);
            showSuccess(
              isDraft
                ? 'Draft saved successfully!'
                : 'Resume saved successfully!'
            );
            // Calculate ATS score only for final saves
            if (!isDraft) {
              fetch(`/api/resumes/${resumeId}/ats-score`, { method: 'POST' });
            }
          } else {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || 'Failed to save resume');
          }
        } else {
          // Create new resume
          const response = await fetch('/api/resumes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });

          if (response.ok) {
            const data = await response.json();
            setResumeId(data.resume._id);
            setLastSaved(new Date());
            setHasUnsavedChanges(false);
            showSuccess(
              isDraft
                ? 'Draft created successfully!'
                : 'Resume created successfully!'
            );
            // Calculate ATS score only for final saves
            if (!isDraft) {
              fetch(`/api/resumes/${data.resume._id}/ats-score`, {
                method: 'POST',
              });
            }
          } else {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || 'Failed to create resume');
          }
        }
      } catch (error) {
        console.error('Failed to save resume:', error);
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Failed to save resume. Please try again.';
        showError(errorMessage);
      } finally {
        setSaving(false);
      }
    },
    [
      resumeId,
      resumeData,
      selectedTemplate,
      validationErrors,
      checkValidationStatus,
    ]
  );

  // Auto-save with proper debounce
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Clear existing timeout
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    // Only auto-save if there are unsaved changes and we have data
    // Forms already validate before submitting, so we only receive valid data
    if (hasUnsavedChanges && (resumeData.personalInfo?.name || resumeId)) {
      autoSaveTimeoutRef.current = setTimeout(() => {
        saveResume(true); // Save as draft
      }, 3000); // Auto-save after 3 seconds of inactivity
    }

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [hasUnsavedChanges, resumeData, resumeId, saveResume]);

  const downloadPDF = async () => {
    if (!resumeId) return;

    setDownloading(true);
    try {
      const response = await fetch(
        `/api/resumes/${resumeId}/pdf?templateId=${encodeURIComponent(selectedTemplate)}`
      );
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${resumeData.personalInfo?.name || 'resume'}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Failed to download PDF:', error);
    } finally {
      setDownloading(false);
    }
  };

  // Update handlers with immediate state persistence
  const handlePersonalInfoSubmit = (data: PersonalInfoFormData) => {
    setResumeData((prev) => ({ ...prev, personalInfo: data }));
    setHasUnsavedChanges(true);
  };

  const handleExperienceSubmit = (data: ExperienceArrayData) => {
    setResumeData((prev) => ({ ...prev, experience: data }));
    setHasUnsavedChanges(true);
  };

  const handleEducationSubmit = (data: EducationArrayData) => {
    setResumeData((prev) => ({ ...prev, education: data }));
    setHasUnsavedChanges(true);
  };

  const handleProjectsSubmit = (data: ProjectsArrayData) => {
    setResumeData((prev) => ({ ...prev, projects: data }));
    setHasUnsavedChanges(true);
  };

  const handleCertificationsSubmit = (data: CertificationsArrayData) => {
    setResumeData((prev) => ({ ...prev, certifications: data }));
    setHasUnsavedChanges(true);
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (!session) {
    router.push('/auth/signin');
    return null;
  }

  return (
    <div className="min-h-screen">
      {/* Builder Mode */}
      {!showPreview && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold">Resume Builder</h1>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPreview(true)}
                className="flex items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                Preview Only
              </Button>
            </div>
            <div className="space-x-2">
              <Button
                onClick={() => saveResume(false)}
                disabled={saving || hasValidationErrors}
              >
                {saving
                  ? 'Publishing...'
                  : hasValidationErrors
                    ? 'Fix Errors to Publish'
                    : 'Publish Resume'}
              </Button>
              {resumeId && (
                <ShareButton
                  resumeId={resumeId}
                  resumeSlug={
                    params.id && params.id !== 'new' && params.id.length < 20
                      ? (params.id as string)
                      : undefined
                  }
                  isPublic={isPublic}
                  onTogglePublic={setIsPublic}
                />
              )}
              <Button onClick={downloadPDF} disabled={downloading}>
                {downloading ? 'Generating...' : 'Download PDF'}
              </Button>
              {lastSaved && (
                <span className="text-xs text-gray-500">
                  Last saved: {lastSaved.toLocaleTimeString()}
                </span>
              )}
              {hasUnsavedChanges && (
                <span className="text-xs text-orange-600 font-medium">
                  Unsaved changes
                </span>
              )}
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Build Your Resume</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                id="resume-builder-tabs"
              >
                <TabsList className="grid w-full grid-cols-6">
                  <TabsTrigger value="personal" className="relative">
                    Personal
                    {validationErrors.personalInfo && (
                      <div className="absolute -top-1 -right-1 h-1.5 w-1.5 rounded-full bg-red-500" />
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="experience" className="relative">
                    Experience
                    {validationErrors.experience && (
                      <div className="absolute -top-1 -right-1 h-1.5 w-1.5 rounded-full bg-red-500" />
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="education" className="relative">
                    Education
                    {validationErrors.education && (
                      <div className="absolute -top-1 -right-1 h-1.5 w-1.5 rounded-full bg-red-500" />
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="skills">Skills</TabsTrigger>
                  <TabsTrigger value="projects" className="relative">
                    Projects
                    {validationErrors.projects && (
                      <div className="absolute -top-1 -right-1 h-1.5 w-1.5 rounded-full bg-red-500" />
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="certifications" className="relative">
                    Certs
                    {validationErrors.certifications && (
                      <div className="absolute -top-1 -right-1 h-1.5 w-1.5 rounded-full bg-red-500" />
                    )}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="personal" className="space-y-4">
                  <PersonalInfoForm
                    initialData={resumeData.personalInfo || undefined}
                    onSubmit={handlePersonalInfoSubmit}
                  />
                </TabsContent>

                <TabsContent value="experience" className="space-y-4">
                  <ExperienceForm
                    initialData={resumeData.experience || undefined}
                    onSubmit={handleExperienceSubmit}
                  />
                </TabsContent>

                <TabsContent value="education" className="space-y-4">
                  <EducationForm
                    initialData={resumeData.education || undefined}
                    onSubmit={handleEducationSubmit}
                  />
                </TabsContent>

                <TabsContent value="skills" className="space-y-4">
                  <SkillsForm
                    initialData={resumeData.skills || undefined}
                    onSubmit={handleSkillsSubmit}
                  />
                </TabsContent>

                <TabsContent value="projects" className="space-y-4">
                  <ProjectsForm
                    initialData={
                      resumeData.projects?.projects
                        ? {
                            projects: resumeData.projects.projects as Project[],
                          }
                        : undefined
                    }
                    onSubmit={handleProjectsSubmit}
                  />
                </TabsContent>

                <TabsContent value="certifications" className="space-y-4">
                  <CertificationsForm
                    initialData={
                      resumeData.certifications?.certifications
                        ? {
                            certifications: resumeData.certifications
                              .certifications as Certification[],
                          }
                        : undefined
                    }
                    onSubmit={handleCertificationsSubmit}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Template Selection */}
          <Card className="glass-panel border border-white/60 shadow-none">
            <CardHeader className="border-b border-white/60 bg-white/70">
              <CardTitle className="text-lg font-semibold">
                Choose Template
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <TemplateGallery
                selectedTemplate={selectedTemplate}
                onTemplateSelect={(templateId: string) =>
                  setSelectedTemplate(templateId as TemplateType)
                }
              />
            </CardContent>
          </Card>

          {/* AI Tools Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">AI Tools</h3>
            <div className="grid gap-4">
              <ATSOptimizer
                resumeData={
                  {
                    personalInfo: resumeData.personalInfo || {
                      name: '',
                      email: '',
                    },
                    experiences: resumeData.experience?.experiences || [],
                    education: resumeData.education?.education || [],
                    skills: resumeData.skills?.skills || [],
                    projects: resumeData.projects?.projects || [],
                    certifications:
                      resumeData.certifications?.certifications || [],
                  } as ResumeBuilderData
                }
              />
              <ResumeReviewer resumeData={resumeData} />
              <KeywordOptimizer resumeData={resumeData} />
            </div>
          </div>

          {/* Analytics */}
          {resumeId && (
            <div className="border-t pt-6">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
                Analytics
              </h3>
              <ResumeAnalytics viewCount={viewCount} isPublic={isPublic} />
            </div>
          )}
        </div>
      )}

      {/* Preview Only Mode */}
      {showPreview && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Resume Preview</h1>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPreview(false)}
              className="flex items-center gap-2"
            >
              <EyeOff className="h-4 w-4" />
              Back to Builder
            </Button>
          </div>
          <div className="flex justify-center">
            <div className="bg-white shadow-lg border rounded-lg overflow-hidden max-w-4xl w-full">
              <div ref={resumeRef} className="w-full">
                <TemplateRenderer
                  template={selectedTemplate}
                  data={
                    {
                      personalInfo: resumeData.personalInfo || {
                        name: 'Your Name',
                        email: 'your.email@example.com',
                        phone: '+1 (555) 123-4567',
                        address: 'City, State',
                        summary:
                          'Professional summary will appear here when you fill out the personal information section.',
                      },
                      experience:
                        (resumeData.experience?.experiences?.length || 0) > 0
                          ? resumeData.experience?.experiences || []
                          : [
                              {
                                company: 'Company Name',
                                position: 'Job Title',
                                location: 'City, State',
                                startDate: 'Start Date',
                                endDate: 'End Date',
                                description:
                                  'Job description will appear here.',
                                bullets: [
                                  'Key achievement will appear here',
                                  'Another achievement will be listed here',
                                ],
                              },
                            ],
                      education:
                        (resumeData.education?.education?.length || 0) > 0
                          ? resumeData.education?.education || []
                          : [
                              {
                                school: 'University Name',
                                degree: 'Degree',
                                field: 'Field of Study',
                                startDate: 'Start Year',
                                endDate: 'End Year',
                                location: 'City, State',
                              },
                            ],
                      skills:
                        (resumeData.skills?.skills?.length || 0) > 0
                          ? resumeData.skills?.skills || []
                          : ['Skill 1', 'Skill 2', 'Skill 3', 'Skill 4'],
                      projects: resumeData.projects?.projects || [],
                      certifications:
                        resumeData.certifications?.certifications || [],
                    } as ResumeData
                  }
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
