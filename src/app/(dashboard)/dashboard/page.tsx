'use client';

import { motion, AnimatePresence } from 'motion/react';
import { useResumes } from '@/hooks/useResumes';
export const dynamic = 'force-dynamic';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { FileText, Calendar, Trash2, Eye } from 'lucide-react';
import PDFDownloader from '@/components/resume/PDFDownloader';
import ShareButton from '@/components/resume/ShareButton';
import ResumeCloner from '@/components/resume/ResumeCloner';
import UsageLimits from '@/components/dashboard/UsageLimits';
import { fadeInUp, scaleIn, staggerContainer } from '@/lib/motion/variants';

export default function DashboardPage() {
  const { data: resumesData, isLoading: loading, refetch } = useResumes();
  const resumes = resumesData?.resumes || [];

  const deleteResume = async (id: string) => {
    if (!confirm('Are you sure you want to delete this resume?')) return;

    try {
      const response = await fetch(`/api/resumes/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        refetch();
      }
    } catch (error) {
      console.error('Failed to delete resume:', error);
    }
  };

  const handleTogglePublic = () => {
    refetch();
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
        className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8"
        variants={fadeInUp}
      >
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 truncate">
            My Resumes
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Create and manage your professional resumes
          </p>
        </div>
        <Button asChild size="sm" className="shrink-0">
          <Link href="/builder/new">Create New Resume</Link>
        </Button>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
        variants={staggerContainer}
      >
        {/* Existing Resumes */}
        <AnimatePresence mode="popLayout">
          {resumes.map((resume, index) => (
            <motion.div
              key={resume._id}
              variants={scaleIn}
              layout
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.02 }}
              whileHover={{ scale: 1.01 }}
            >
              <Card className="h-full cursor-pointer">
                <CardHeader className="pb-3 p-4 sm:p-6">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2 min-w-0 flex-1">
                      <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 shrink-0 mt-0.5" />
                      <div className="min-w-0 flex-1">
                        <CardTitle className="text-sm sm:text-base lg:text-lg leading-tight break-words">
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
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 shrink-0 h-8 w-8 p-0"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-2 sm:gap-x-3 gap-y-1 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 shrink-0" />
                      <span className="truncate">
                        {formatDate(resume.updatedAt)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3 shrink-0" />
                      <span>{resume.viewCount}</span>
                    </div>
                    {resume.templateId && (
                      <span className="capitalize text-xs bg-gray-100 px-1.5 py-0.5 rounded truncate">
                        {resume.templateId}
                      </span>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="pt-0 p-4 sm:p-6">
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

                  <div className="space-y-2">
                    <Button
                      asChild
                      size="sm"
                      className="w-full text-xs sm:text-sm"
                    >
                      <Link href={`/builder/${resume.slug || resume._id}`}>
                        Edit Resume
                      </Link>
                    </Button>
                    <div className="flex gap-1">
                      <ResumeCloner
                        resumeId={resume._id}
                        resumeTitle={resume.title}
                        onClone={() => refetch()}
                      />
                      <ShareButton
                        resumeId={resume._id}
                        isPublic={resume.isPublic || false}
                        onTogglePublic={handleTogglePublic}
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
