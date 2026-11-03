import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import { Resume } from '@/lib/db/models/Resume';
import { withAuth } from '@/lib/middleware/withAuth';
import { editableResumeFields, ownedResume } from '@/lib/resume/ownership';
import { mapWriteError } from '@/lib/resume/errors';

type Params = { id: string };
const notFound = () => NextResponse.json({ error: 'Resume not found' }, { status: 404 });

// Every handler reads or writes with one owner-scoped filter: one round trip, and a
// resume owned by someone else is indistinguishable from one that does not exist.

export const GET = withAuth<Params>(async (_request, { session, params }) => {
  try {
    const filter = ownedResume((await params).id, session.user.email);
    if (!filter) return notFound();
    await connectDB();
    const resume = await Resume.findOne(filter).lean();
    return resume ? NextResponse.json({ resume }) : notFound();
  } catch (error) {
    console.error('Failed to fetch resume:', error);
    return NextResponse.json({ error: 'Failed to fetch resume' }, { status: 500 });
  }
});

export const PUT = withAuth<Params>(async (request, { session, params }) => {
  try {
    const filter = ownedResume((await params).id, session.user.email);
    if (!filter) return notFound();
    const fields = editableResumeFields(await request.json().catch(() => null));
    await connectDB();
    const resume = await Resume.findOneAndUpdate(
      filter,
      { $set: fields },
      { returnDocument: 'after', runValidators: true }
    ).lean();
    return resume ? NextResponse.json({ resume }) : notFound();
  } catch (error) {
    return mapWriteError(error, 'Failed to update resume');
  }
});

export const DELETE = withAuth<Params>(async (_request, { session, params }) => {
  try {
    const filter = ownedResume((await params).id, session.user.email);
    if (!filter) return notFound();
    await connectDB();
    const deleted = await Resume.findOneAndDelete(filter, { projection: { _id: 1 } });
    return deleted
      ? NextResponse.json({ message: 'Resume deleted successfully' })
      : notFound();
  } catch (error) {
    console.error('Failed to delete resume:', error);
    return NextResponse.json({ error: 'Failed to delete resume' }, { status: 500 });
  }
});
