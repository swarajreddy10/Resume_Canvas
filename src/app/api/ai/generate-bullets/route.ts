import { NextRequest, NextResponse } from 'next/server';
import { generateBulletPoints } from '@/services/ai.service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { jobTitle, company, description, skills } = body;

    if (!jobTitle || !company || !description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const bulletPoints = await generateBulletPoints({
      jobTitle,
      company,
      description,
      skills,
    });

    return NextResponse.json({ bulletPoints });
  } catch (error) {
    console.error('Error in AI generation:', error);
    return NextResponse.json(
      { error: 'Failed to generate bullet points' },
      { status: 500 }
    );
  }
}
