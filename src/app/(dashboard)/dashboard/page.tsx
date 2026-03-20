'use client';

import { motion, AnimatePresence } from 'motion/react';
import { useResumes } from '@/hooks/useResumes';
export const dynamic = 'force-dynamic';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { FileText, Calendar, Trash2, Eye, Plus } from 'lucide-react';
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
      const response = await fetch(`/api/resumes/${id}`, { method: 'DELETE' });
      if (response.ok) refetch();
    } catch (error) {
      console.error('Failed to delete resume:', error);
    }
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#4f46e5] border-t-transparent" />
      </div>
    );
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
      {/* ── Page header ── */}
      <motion.div
        className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6"
        variants={fadeInUp}
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#11101d]">
            My Resumes
          </h1>
          <p className="text-sm text-[#64748b] mt-0.5">
            Create and manage your professional resumes
          </p>
        </div>
        <Button asChild size="sm" className="shrink-0 w-full sm:w-auto">
          <Link href="/builder/new">
            <Plus className="h-4 w-4 mr-1.5" />
            Create New Resume
          </Link>
        </Button>
      </motion.div>

      {resumes.length === 0 ? (
        /* ── Empty state layout ── */
        <div className="flex flex-col gap-6">
          <motion.div
            className="flex flex-col items-center justify-center py-14 sm:py-20 rounded-2xl border border-dashed border-[#c7d2fe] bg-[#f5f3ff] w-full"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="w-14 h-14 rounded-2xl bg-[#eef2ff] flex items-center justify-center mb-4">
              <FileText className="h-7 w-7 text-[#4f46e5]" />
            </div>
            <h3 className="text-base font-semibold text-[#11101d] mb-1">
              No resumes yet
            </h3>
            <p className="text-sm text-[#64748b] mb-5 text-center px-4">
              Create your first resume to get started
            </p>
            <Button asChild size="sm">
              <Link href="/builder/new">
                <Plus className="h-4 w-4 mr-1.5" />
                Create Resume
              </Link>
            </Button>
          </motion.div>

          <motion.div variants={fadeInUp} transition={{ delay: 0.3 }}>
            <UsageLimits resumeCount={0} aiGenerations={0} plan="free" />
          </motion.div>
        </div>
      ) : (
        /* ── Two-column layout: resumes left, sidebar right ── */
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Left — resume grid */}
          <div className="flex-1 min-w-0">
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              variants={staggerContainer}
            >
              <AnimatePresence mode="popLayout">
                {resumes.map((resume, index) => (
                  <motion.div
                    key={resume._id}
                    variants={scaleIn}
                    layout
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.02 }}
                  >
                    <Card className="h-full border-[#e2e8f0] hover:border-[#c7d2fe] hover:shadow-md transition-all duration-200 card-hover">
                      <CardHeader className="pb-3 p-4 sm:p-5">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-2 min-w-0 flex-1">
                            <div className="w-8 h-8 rounded-lg bg-[#eef2ff] flex items-center justify-center shrink-0">
                              <FileText className="h-4 w-4 text-[#4f46e5]" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <CardTitle className="text-sm sm:text-base leading-tight break-words">
                                {resume.personalInfo?.name
                                  ? `${resume.personalInfo.name.split(' ')[0]}'s Resume`
                                  : resume.title}
                              </CardTitle>
                              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#64748b] mt-1">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3 shrink-0" />
                                  <span>{formatDate(resume.updatedAt)}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Eye className="h-3 w-3 shrink-0" />
                                  <span>{resume.viewCount}</span>
                                </div>
                                {resume.templateId && (
                                  <span className="capitalize bg-[#eef2ff] text-[#4f46e5] px-1.5 py-0.5 rounded text-[10px] font-medium">
                                    {resume.templateId}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteResume(resume._id)}
                            className="text-red-400 hover:text-red-600 hover:bg-red-50 shrink-0 h-7 w-7 p-0"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </CardHeader>

                      <CardContent className="pt-0 p-4 sm:p-5">
                        {resume.atsScore && (
                          <div className="flex items-center justify-end mb-3">
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
                          </div>
                        )}
                        <div className="space-y-2">
                          <Button
                            asChild
                            size="sm"
                            className="w-full text-xs sm:text-sm"
                          >
                            <Link
                              href={`/builder/${resume.slug || resume._id}`}
                            >
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
                              onTogglePublic={() => refetch()}
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
          </div>

          {/* Right — sticky sidebar */}
          <motion.div
            className="w-full lg:w-72 shrink-0"
            variants={fadeInUp}
            transition={{ delay: 0.3 }}
          >
            <div className="lg:sticky lg:top-6 space-y-4">
              <UsageLimits
                resumeCount={resumes.length}
                aiGenerations={Math.floor(resumes.length * 3)}
                plan="free"
              />
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
