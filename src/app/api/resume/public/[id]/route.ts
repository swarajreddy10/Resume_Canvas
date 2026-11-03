import { NextRequest } from 'next/server';
import { publicResumeResponse } from '@/lib/resume/public';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return publicResumeResponse({ _id: (await params).id });
}
