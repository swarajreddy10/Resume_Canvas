import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import { User } from '@/lib/db/models/User';

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required', status: 'invalid' },
        { status: 400 }
      );
    }

    await connectDB();

    // Find user with this reset token
    const user = await User.findOne({
      resetToken: token,
    }).select('+resetToken +resetExpiry email');

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid reset token', status: 'invalid' },
        { status: 400 }
      );
    }

    // Check if token is expired
    if (user.resetExpiry && user.resetExpiry < new Date()) {
      return NextResponse.json(
        {
          error: 'Reset token has expired',
          status: 'expired',
          email: user.email,
        },
        { status: 400 }
      );
    }

    // Token is valid
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
