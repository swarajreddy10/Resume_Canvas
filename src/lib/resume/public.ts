import mongoose from 'mongoose';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import { Resume } from '@/lib/db/models/Resume';

/**
 * The fields the public page (src/app/resume/[id]/page.tsx) renders. Nothing else
 * leaves the server: not the owner's account email, slug, id, or other counters.
 */
const PUBLIC_PROJECTION = {
  _id: 0,
  title: 1,
  personalInfo: 1,
  experience: 1,
  education: 1,
  skills: 1,
  templateId: 1,
  viewCount: 1,
} as const;

/**
 * Serve one published resume and count the view in a single atomic findOneAndUpdate:
 * an unpublished resume matches nothing (404, count untouched), the returned count
 * includes this view, and `timestamps: false` keeps a view from looking like an edit.
 * `no-store` sends every read to the server, so every view is counted and unpublishing
 * takes effect at once.
 * https://mongoosejs.com/docs/api/model.html#Model.findOneAndUpdate()
 * https://mongoosejs.com/docs/timestamps.html
 */
export async function publicResumeResponse(match: { _id: string } | { slug: string }) {
  const headers = { 'Cache-Control': 'no-store' };
  try {
    if ('_id' in match && !mongoose.isValidObjectId(match._id)) {
      return notPublic(headers);
    }
    await connectDB();
    // .select(), not the `projection` option: Mongoose 9.3 drops `_id: 0` from the
    // option (seen in its debug log), but sends it intact from select().
    const resume = await Resume.findOneAndUpdate(
      { ...match, isPublic: true },
      { $inc: { viewCount: 1 } },
      { returnDocument: 'after', timestamps: false }
    )
      .select(PUBLIC_PROJECTION)
      .lean();
    return resume ? NextResponse.json({ resume }, { headers }) : notPublic(headers);
  } catch (error) {
    console.error('Failed to fetch public resume:', error);
    return NextResponse.json({ error: 'Failed to fetch resume' }, { status: 500, headers });
  }
}

function notPublic(headers: Record<string, string>) {
  return NextResponse.json({ error: 'Resume not found or not public' }, { status: 404, headers });
}
