import { NextRequest, NextResponse } from 'next/server';
import { optimizeResume } from '@/services/ai.service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { resumeContent } = body;

    if (!resumeContent) {
      return NextResponse.json(
        { error: 'Resume content is required' },
        { status: 400 }
      );
    }

    const optimization = await optimizeResume(resumeContent);
    return NextResponse.json(optimization);
  } catch (error) {
    console.error('Error in resume optimization:', error);
    return NextResponse.json(
      { error: 'Failed to optimize resume' },
      { status: 500 }
    );
  }
}
