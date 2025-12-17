import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import connectDB from '@/lib/db/connection';
import { User } from '@/lib/db/models/User';
import bcrypt from 'bcryptjs';

const schema = z.object({
  email: z.string().email('Please enter a valid email address'),
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[a-z]/, 'Password must contain a lowercase letter')
    .regex(/[A-Z]/, 'Password must contain an uppercase letter')
    .regex(/\d/, 'Password must contain a number'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = schema.parse(body);

    await connectDB();

    const existing = await User.findOne({
      email: validated.email.toLowerCase(),
    });
    if (existing) {
      return NextResponse.json(
        {
          error: 'This email is already registered',
          suggestion: existing.password
            ? 'Please sign in with your password'
            : 'Please sign in with Google',
        },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(validated.password, 12);
    const user = await User.create({
      email: validated.email.toLowerCase(),
      name: validated.name.trim(),
      password: hashedPassword,
      subscriptionTier: 'free',
    });

    return NextResponse.json({
      success: true,
      message: 'Account created successfully',
      user: { id: user._id, email: user.email, name: user.name },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Registration failed. Please try again.' },
      { status: 500 }
    );
  }
}
