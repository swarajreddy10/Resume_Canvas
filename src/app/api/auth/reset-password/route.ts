import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { z } from 'zod';
import connectDB from '@/lib/db/connection';
import { limitAuthAttempt } from '@/lib/middleware/withRateLimit';
import { User } from '@/lib/db/models/User';
import {
  hashPassword,
  hashResetToken,
  passwordSchema,
  resetTokenSchema,
} from '@/lib/auth/password';

const bodySchema = z.object({ token: resetTokenSchema, password: passwordSchema });

export async function POST(request: NextRequest) {
  try {
    const limited = await limitAuthAttempt('reset-password', request);
    if (limited) return limited;

    const parsed = bodySchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? 'Invalid request' },
        { status: 400 }
      );
    }

    await connectDB();

    // Consume the token in one atomic step: it matches only while unexpired and is
    // removed in the same write, so it can never be used twice.
    const user = await User.findOneAndUpdate(
      {
        resetToken: hashResetToken(parsed.data.token),
        resetExpiry: mongoose.trusted({ $gt: new Date() }),
      },
      {
        $set: { password: await hashPassword(parsed.data.password) },
        $unset: { resetToken: 1, resetExpiry: 1 },
      },
      { projection: { _id: 1 } }
    );

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired reset token' },
        { status: 400 }
      );
    }

    return NextResponse.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
