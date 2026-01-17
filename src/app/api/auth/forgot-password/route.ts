import { NextRequest, NextResponse } from 'next/server';
import { withRateLimit } from '@/lib/middleware/withRateLimit';
import { authRateLimit } from '@/lib/security/rateLimit';
import { sanitizeInput } from '@/lib/security/sanitize';
import connectDB from '@/lib/db/connection';
import { User } from '@/lib/db/models/User';
import { sendResetEmail } from '@/lib/email/resend.service';
import crypto from 'crypto';

export const POST = withRateLimit(authRateLimit)(async (
  request: NextRequest
) => {
  try {
    const { email } = sanitizeInput(await request.json());

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    await connectDB();
    const user = await User.findOne({ email: email.toLowerCase() });

    // Always return success (security: don't reveal if email exists)
    if (!user) {
      return NextResponse.json({
        message: 'If email exists, reset link sent',
      });
    }

    // Clear any existing reset token first
    await User.findByIdAndUpdate(user._id, {
      resetToken: undefined,
      resetExpiry: undefined,
    });

    // Generate secure reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Set new reset token
    await User.findByIdAndUpdate(user._id, {
      resetToken,
      resetExpiry,
    });

    console.log(`Generated reset token for ${email}`);
    console.log(`Reset URL generated successfully`);

    // Send reset email
    await sendResetEmail(email, resetToken);

    return NextResponse.json({
      message: 'If email exists, reset link sent',
    });
  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
});
