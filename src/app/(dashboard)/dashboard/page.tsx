'use client';

import { useState, useEffect } from 'react';

export const dynamic = 'force-dynamic';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { FileText, Calendar, Trash2, Eye } from 'lucide-react';
import PDFDownloader from '@/components/resume/PDFDownloader';
import ShareButton from '@/components/resume/ShareButton';
import ResumeCloner from '@/components/resume/ResumeCloner';
import UsageLimits from '@/components/dashboard/UsageLimits';

interface Resume {
  _id: string;
  title: string;
  personalInfo?: { name?: string };
  updatedAt: string;
  atsScore?: number;
  viewCount: number;
  templateId?: string;
  isPublic?: boolean;
  slug?: string;
}

export default function DashboardPage() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const response = await fetch('/api/resumes');
      if (response.ok) {
        const data = await response.json();
        setResumes(data.resumes);
      }
    } catch (error) {
      console.error('Failed to fetch resumes:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteResume = async (id: string) => {
    if (!confirm('Are you sure you want to delete this resume?')) return;

    try {
      const response = await fetch(`/api/resumes/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setResumes(resumes.filter((resume) => resume._id !== id));
      }
    } catch (error) {
      console.error('Failed to delete resume:', error);
    }
  };

  const handleTogglePublic = (resumeId: string, isPublic: boolean) => {
    setResumes(
      resumes.map((resume) =>
        resume._id === resumeId ? { ...resume, isPublic } : resume
      )
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Resumes</h1>
          <p className="text-gray-600">
            Create and manage your professional resumes
          </p>
        </div>
        <Button asChild>
          <Link href="/builder/new">Create New Resume</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Create New Resume Card */}
        <Card className="border-dashed border-2 border-gray-300 hover:border-gray-400 transition-colors">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-4xl mb-4">+</div>
            <CardTitle className="text-lg mb-2">Create New Resume</CardTitle>
            <CardDescription className="text-center">
              Start building your professional resume with AI assistance
            </CardDescription>
            <Button className="mt-4" asChild>
              <Link href="/builder/new">Get Started</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Existing Resumes */}
        {resumes.map((resume) => (
          <Card key={resume._id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <FileText className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <CardTitle className="text-lg truncate min-w-0">
                    {resume.personalInfo?.name
                      ? `${resume.personalInfo.name.split(' ')[0]}'s Resume`
                      : resume.title}
                  </CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteResume(resume._id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {formatDate(resume.updatedAt)}
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {resume.viewCount}
                </div>
                {resume.templateId && (
                  <span className="capitalize text-xs bg-gray-100 px-2 py-1 rounded">
                    {resume.templateId}
                  </span>
                )}
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="flex items-center justify-between mb-4">
                {resume.personalInfo?.name && (
                  <p className="text-sm text-gray-600 truncate">
                    {resume.personalInfo.name}
                  </p>
                )}
                {resume.atsScore && (
                  <Badge
                    variant={
                      resume.atsScore >= 80
                        ? 'default'
                        : resume.atsScore >= 60
                          ? 'secondary'
                          : 'destructive'
                    }
                    className="text-xs"
                  >
                    ATS: {resume.atsScore}/100
                  </Badge>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                <Button asChild size="sm" className="flex-1 min-w-0">
                  <Link href={`/builder/${resume.slug || resume._id}`}>
                    Edit
                  </Link>
                </Button>
                <div className="flex gap-1">
                  <ResumeCloner
                    resumeId={resume._id}
                    resumeTitle={resume.title}
                    onClone={() => fetchResumes()}
                  />
                  <ShareButton
                    resumeId={resume._id}
                    isPublic={resume.isPublic || false}
                    onTogglePublic={(isPublic) =>
                      handleTogglePublic(resume._id, isPublic)
                    }
                  />
                  <PDFDownloader
                    resumeId={resume._id}
                    resumeTitle={resume.title}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {resumes.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No resumes yet
          </h3>
          <p className="text-gray-600 mb-4">
            Create your first resume to get started
          </p>
          <Button asChild>
            <Link href="/builder/new">Create Your First Resume</Link>
          </Button>
        </div>
      )}

      {/* Usage Limits Widget */}
      <div className="mt-8 max-w-md">
        <UsageLimits
          resumeCount={resumes.length}
          aiGenerations={Math.floor(resumes.length * 3)}
          plan="free"
        />
      </div>
    </div>
  );
}
