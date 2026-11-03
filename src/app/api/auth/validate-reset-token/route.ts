import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import connectDB from '@/lib/db/connection';
import { limitAuthAttempt } from '@/lib/middleware/withRateLimit';
import { User } from '@/lib/db/models/User';
import { hashResetToken, resetTokenSchema } from '@/lib/auth/password';

const bodySchema = z.object({ token: resetTokenSchema });

export async function POST(request: NextRequest) {
  try {
    const limited = await limitAuthAttempt('validate-reset-token', request);
    if (limited) return limited;

    const parsed = bodySchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid reset token', status: 'invalid' },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findOne({
      resetToken: hashResetToken(parsed.data.token),
    }).select('+resetExpiry email');

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid reset token', status: 'invalid' },
        { status: 400 }
      );
    }

    if (!user.resetExpiry || user.resetExpiry < new Date()) {
      return NextResponse.json(
        { error: 'Reset token has expired', status: 'expired', email: user.email },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: 'Token is valid',
      status: 'valid',
      email: user.email,
    });
  } catch (error) {
    console.error('Token validation error:', error);
    return NextResponse.json(
      { error: 'Internal server error', status: 'invalid' },
      { status: 500 }
    );
  }
}
