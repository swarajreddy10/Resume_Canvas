import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import connectDB from '@/lib/db/connection';
import { User } from '@/lib/db/models/User';
import { hashPassword, passwordSchema } from '@/lib/auth/password';
import { limitAuthAttempt } from '@/lib/middleware/withRateLimit';

const schema = z.object({
  email: z.string().trim().toLowerCase().email('Please enter a valid email address'),
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  password: passwordSchema,
});

// The same answer whether the email was free or already taken, so registration cannot be
// used to discover accounts. The client signs in next; that only succeeds with the
// account's real password.
// https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html#authentication-and-error-messages
const GENERIC_REPLY = { success: true };

const DUPLICATE_KEY = 11000;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    const limited = await limitAuthAttempt('register', request, body?.email);
    if (limited) return limited;

    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? 'Invalid request' },
        { status: 400 }
      );
    }
    const { email, name, password } = parsed.data;

    // Hash before touching the database, so a taken email costs the same time as a new one.
    const hashedPassword = await hashPassword(password);
    await connectDB();

    try {
      // The unique email index decides, in one write, whether the address is free.
      await User.create({
        email,
        name: name.trim(),
        password: hashedPassword,
        subscriptionTier: 'free',
      });
    } catch (error) {
      if ((error as { code?: number }).code !== DUPLICATE_KEY) throw error;
    }

    return NextResponse.json(GENERIC_REPLY);
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Registration failed. Please try again.' },
      { status: 500 }
    );
  }
}
