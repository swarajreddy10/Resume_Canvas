import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import connectDB from '@/lib/db/connection';
import { Resume } from '@/lib/db/models/Resume';
import { generateSlug } from '@/lib/utils/slug';

export async function GET() {
  return await runMigration();
}

export async function POST() {
  return await runMigration();
}

async function runMigration() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const resumesWithoutSlugs = await Resume.find({
      userEmail: session.user.email,
    });

    for (const resume of resumesWithoutSlugs) {
      let slug = generateSlug(resume.title);
      let counter = 1;

      while (await Resume.findOne({ slug, userEmail: session.user.email })) {
        slug = `${generateSlug(resume.title)}-${counter}`;
        counter++;
      }

      await Resume.updateOne({ _id: resume._id }, { slug });
    }

    return NextResponse.json({
      message: `Updated ${resumesWithoutSlugs.length} resumes with slugs`,
    });
  } catch (error) {
    console.error('Error migrating slugs:', error);
    return NextResponse.json(
      { error: 'Failed to migrate slugs' },
      { status: 500 }
    );
  }
}
