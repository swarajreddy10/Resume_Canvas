'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import CoverLetterGenerator from '@/components/ai/CoverLetterGenerator';

interface Resume {
  _id: string;
  title: string;
  personalInfo?: { name?: string };
  [key: string]: unknown;
}

interface CoverLetter {
  _id: string;
  company: string;
  position: string;
  content: string;
  createdAt: string;
}

export default function CoverLettersPage() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [coverLetters, setCoverLetters] = useState<CoverLetter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [resumesRes, lettersRes] = await Promise.all([
        fetch('/api/resumes'),
        fetch('/api/cover-letters'),
      ]);
      const resumesData = await resumesRes.json();
      const lettersData = await lettersRes.json();
      setResumes(resumesData.resumes || []);
      setCoverLetters(lettersData.coverLetters || []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
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
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Cover Letters</h1>
        <p className="text-gray-600">
          Create AI-powered cover letters tailored to your job applications
        </p>
      </div>

      {resumes.length > 0 ? (
        <>
          <CoverLetterGenerator resumeData={resumes[0]} />

          {coverLetters.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4">Saved Cover Letters</h2>
              <div className="grid gap-4">
                {coverLetters.map((letter) => (
                  <Card key={letter._id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">
                            {letter.position} at {letter.company}
                          </CardTitle>
                          <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                            <Calendar className="h-4 w-4" />
                            {formatDate(letter.createdAt)}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap line-clamp-3">
                        {letter.content}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-lg">
          <p className="text-gray-500 mb-4">
            Create a resume first to generate cover letters
          </p>
          <Link
            href="/builder/new"
            className="text-blue-600 hover:underline font-medium"
          >
            Create Resume
          </Link>
        </div>
      )}
    </div>
  );
}
