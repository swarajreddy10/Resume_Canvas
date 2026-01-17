import { NextRequest, NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';
import connectDB from '@/lib/db/connection';
import { User } from '@/lib/db/models/User';

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    await connectDB();

    // Find user with valid reset token
    const user = await User.findOne({
      resetToken: token,
      resetExpiry: { $gt: new Date() },
    }).select('+resetToken +resetExpiry');

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired reset token' },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Update user password and clear reset token
    await User.findByIdAndUpdate(user._id, {
      password: hashedPassword,
      resetToken: undefined,
      resetExpiry: undefined,
    });

    return NextResponse.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
