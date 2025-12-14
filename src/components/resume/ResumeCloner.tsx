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
import { Label } from '@/components/ui/label';
import { Copy } from 'lucide-react';

interface ResumeClonerProps {
  resumeId: string;
  resumeTitle: string;
  onClone?: (newResumeId: string) => void;
}

export default function ResumeCloner({
  resumeId,
  resumeTitle,
  onClone,
}: ResumeClonerProps) {
  const [open, setOpen] = useState(false);
  const [newTitle, setNewTitle] = useState(`${resumeTitle} (Copy)`);
  const [cloning, setCloning] = useState(false);

  const handleClone = async () => {
    setCloning(true);
    try {
      const response = await fetch(`/api/resumes/${resumeId}/clone`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle }),
      });

      if (response.ok) {
        const data = await response.json();
        onClone?.(data.resume._id);
        setOpen(false);
        setNewTitle(`${resumeTitle} (Copy)`);
      }
    } catch (error) {
      console.error('Failed to clone resume:', error);
    } finally {
      setCloning(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Copy className="h-4 w-4 mr-1" />
          Clone
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Clone Resume</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">New Resume Title</Label>
            <Input
              id="title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Enter title for cloned resume"
            />
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleClone}
              disabled={cloning || !newTitle.trim()}
            >
              {cloning ? 'Cloning...' : 'Clone Resume'}
            </Button>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
