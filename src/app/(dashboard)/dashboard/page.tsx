'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { handleApiResponse, handleError } from '@/lib/utils/errorHandler';

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
import { fadeInUp, scaleIn, staggerContainer } from '@/lib/motion/variants';

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
      const data = await handleApiResponse<{ resumes: Resume[] }>(response);
      setResumes(data.resumes);
    } catch (error) {
      handleError(error);
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
      await handleApiResponse(response);
      setResumes(resumes.filter((resume) => resume._id !== id));
    } catch (error) {
      handleError(error);
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
    <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
      <motion.div
        className="flex justify-between items-center mb-8"
        variants={fadeInUp}
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Resumes</h1>
          <p className="text-gray-600">
            Create and manage your professional resumes
          </p>
        </div>
        <Button asChild>
          <Link href="/builder/new">Create New Resume</Link>
        </Button>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={staggerContainer}
      >
        {/* Create New Resume Card */}
        <motion.div
          variants={scaleIn}
          whileHover={{ scale: 1.03, y: -8 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
          <Card className="border-dashed border-2 border-gray-300 hover:border-blue-400 transition-colors cursor-pointer">
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
        </motion.div>

        {/* Existing Resumes */}
        <AnimatePresence mode="popLayout">
          {resumes.map((resume, index) => (
            <motion.div
              key={resume._id}
              variants={scaleIn}
              layout
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02, y: -4 }}
            >
              <Card className="h-full cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2 min-w-0">
                    <div className="flex items-start gap-2 min-w-0 flex-1">
                      <FileText className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                      <div className="min-w-0 flex-1">
                        <CardTitle className="text-base sm:text-lg leading-tight wrap-break-word word-break">
                          {resume.personalInfo?.name
                            ? `${resume.personalInfo.name.split(' ')[0]}'s Resume`
                            : resume.title}
                        </CardTitle>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteResume(resume._id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                      <span>{formatDate(resume.updatedAt)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                      <span>{resume.viewCount}</span>
                    </div>
                    {resume.templateId && (
                      <span className="capitalize text-xs bg-gray-100 px-2 py-0.5 rounded">
                        {resume.templateId}
                      </span>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="flex items-center justify-end gap-2 mb-3">
                    {resume.atsScore && (
                      <Badge
                        variant={
                          resume.atsScore >= 80
                            ? 'default'
                            : resume.atsScore >= 60
                              ? 'secondary'
                              : 'destructive'
                        }
                        className="text-xs shrink-0"
                      >
                        ATS: {resume.atsScore}/100
                      </Badge>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      asChild
                      size="sm"
                      className="flex-1 min-w-0 text-xs sm:text-sm"
                    >
                      <Link href={`/builder/${resume.slug || resume._id}`}>
                        Edit
                      </Link>
                    </Button>
                    <div className="flex gap-1 justify-center sm:justify-start">
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
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {resumes.length === 0 && (
        <motion.div
          className="text-center py-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
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
        </motion.div>
      )}

      {/* Usage Limits Widget */}
      <motion.div
        className="mt-8 max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <UsageLimits
          resumeCount={resumes.length}
          aiGenerations={Math.floor(resumes.length * 3)}
          plan="free"
        />
      </motion.div>
    </motion.div>
  );
}
