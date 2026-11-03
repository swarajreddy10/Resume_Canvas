import { NextRequest } from 'next/server';
import { publicResumeResponse } from '@/lib/resume/public';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  return publicResumeResponse({ slug: (await params).slug });
}
