'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import TemplateRenderer from '@/components/resume/TemplateRenderer';
import { TemplateType } from '@/components/resume/templateLibrary';
import {
  ResumeData,
  PersonalInfo,
  Experience,
  Education,
} from '@/types/resume.unified';
import { Button } from '@/components/ui/button';
import { Download, Eye } from 'lucide-react';

interface Resume {
  _id: string;
  title: string;
  personalInfo: unknown;
  experience: unknown[];
  education: unknown[];
  skills: string[];
  templateId: TemplateType;
  isPublic: boolean;
  viewCount: number;
}

export default function PublicResumePage() {
  const params = useParams();
  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const id = params.id as string;
        const isSlug = !id.match(/^[0-9a-fA-F]{24}$/);
        const endpoint = isSlug
          ? `/api/resume/public/slug/${id}`
          : `/api/resume/public/${id}`;

        const response = await fetch(endpoint);
        if (!response.ok) {
          throw new Error('Resume not found or not public');
        }
        const data = await response.json();
        setResume(data.resume);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load resume');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchResume();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (error || !resume) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Resume Not Found
          </h1>
          <p className="text-gray-600">
            {error || 'This resume is not publicly available'}
          </p>
        </div>
      </div>
    );
  }

  const resumeData: ResumeData = {
    personalInfo: (resume.personalInfo as PersonalInfo) || {
      name: '',
      email: '',
    },
    experience: (resume.experience as Experience[]) || [],
    education: (resume.education as Education[]) || [],
    skills: resume.skills || [],
    projects: [],
    certifications: [],
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b print:hidden">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center print:hidden">
          <div>
            <h1 className="text-xl font-semibold">{resume.title}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {resume.viewCount} views
              </span>
              <span className="capitalize">{resume.templateId} template</span>
            </div>
          </div>
          <Button onClick={() => window.print()}>
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 print:p-0">
        <div className="transform scale-90 origin-top print:scale-100">
          <TemplateRenderer template={resume.templateId} data={resumeData} />
        </div>
      </div>
    </div>
  );
}
