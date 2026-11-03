import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import { JobApplication } from '@/lib/db/models/JobApplication';
import { withAuth } from '@/lib/middleware/withAuth';
import { mapWriteError } from '@/lib/resume/errors';
import { ownsResume } from '@/lib/resume/ownership';
import { pickFields } from '@/lib/security/allowList';

/** The fields a user may set; the server sets the owner (userEmail) and timestamps. */
const EDITABLE_FIELDS = [
  'resumeId',
  'jobTitle',
  'company',
  'location',
  'jobUrl',
  'description',
  'salary',
  'status',
  'appliedDate',
  'notes',
  'contacts',
  'interviews',
] as const;

export const GET = withAuth(async (_request, { session }) => {
  try {
    await connectDB();
    const applications = await JobApplication.find({ userEmail: session.user.email })
      .sort({ createdAt: -1 })
      .lean();
    return NextResponse.json({ applications });
  } catch (error) {
    console.error('Failed to fetch applications:', error);
    return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 });
  }
});

export const POST = withAuth(async (request, { session }) => {
  try {
    const fields = pickFields(await request.json().catch(() => null), EDITABLE_FIELDS);
    await connectDB();
    if (fields.resumeId != null && !(await ownsResume(fields.resumeId, session.user.email))) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
    }
    const application = await JobApplication.create({ ...fields, userEmail: session.user.email });
    return NextResponse.json({ application });
  } catch (error) {
    return mapWriteError(error, 'Failed to create application');
  }
});
