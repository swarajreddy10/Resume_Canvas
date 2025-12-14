'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Share2, Copy, Check } from 'lucide-react';

interface ShareButtonProps {
  resumeId: string;
  resumeSlug?: string;
  isPublic: boolean;
  onTogglePublic: (isPublic: boolean) => void;
}

export default function ShareButton({
  resumeId,
  resumeSlug,
  isPublic,
  onTogglePublic,
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  const publicUrl = `${window.location.origin}/resume/${resumeSlug || resumeId}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleTogglePublic = async (checked: boolean) => {
    try {
      const response = await fetch(`/api/resumes/${resumeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublic: checked }),
      });

      if (response.ok) {
        onTogglePublic(checked);
      }
    } catch (error) {
      console.error('Failed to update privacy:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Share2 className="h-4 w-4 mr-1" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Resume</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Make Public</p>
              <p className="text-sm text-gray-600">
                Allow anyone with the link to view
              </p>
            </div>
            <Switch checked={isPublic} onCheckedChange={handleTogglePublic} />
          </div>

          {isPublic && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Public Link</p>
              <div className="flex gap-2">
                <Input value={publicUrl} readOnly className="text-sm" />
                <Button onClick={copyToClipboard} size="sm">
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                Anyone with this link can view your resume
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
