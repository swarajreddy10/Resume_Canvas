import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { withRateLimit } from '@/lib/middleware/withRateLimit';
import { authRateLimit } from '@/lib/security/rateLimit';
import connectDB from '@/lib/db/connection';
import { User } from '@/lib/db/models/User';
import { sendResetEmail } from '@/lib/email/resend.service';
import { createResetToken, RESET_TOKEN_TTL_MS } from '@/lib/auth/password';

const bodySchema = z.object({ email: z.string().trim().toLowerCase().email() });

// Same answer whether or not the account exists, so the endpoint cannot enumerate users.
const GENERIC_REPLY = { message: 'If email exists, reset link sent' };

export const POST = withRateLimit(authRateLimit)(async (
  request: NextRequest
) => {
  try {
    const parsed = bodySchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }
    const { email } = parsed.data;

    await connectDB();

    // One write replaces any earlier token; only the token's hash is stored.
    const { token, tokenHash } = createResetToken();
    const user = await User.findOneAndUpdate(
      { email },
      {
        $set: {
          resetToken: tokenHash,
          resetExpiry: new Date(Date.now() + RESET_TOKEN_TTL_MS),
        },
      },
      { projection: { _id: 1 } }
    );

    if (user) {
      await sendResetEmail(email, token);
    }

    return NextResponse.json(GENERIC_REPLY);
  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
});
