'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
// import { PDFService } from '@/services/pdf.service';
interface PDFDownloaderProps {
  resumeId: string;
  resumeTitle?: string;
}

export default function PDFDownloader({
  resumeId,
  resumeTitle,
}: PDFDownloaderProps) {
  const [downloading, setDownloading] = useState(false);

  const downloadResume = async () => {
    setDownloading(true);
    try {
      const response = await fetch(`/api/resumes/${resumeId}/pdf`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${resumeTitle || 'resume'}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Failed to download resume:', error);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={downloadResume}
      disabled={downloading}
    >
      <Download className="h-4 w-4" />
      {downloading && <span className="ml-1">...</span>}
    </Button>
  );
}
