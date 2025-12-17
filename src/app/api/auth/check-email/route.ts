import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import { User } from '@/lib/db/models/User';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    await connectDB();

    const user = await User.findOne({ email: email.toLowerCase() }).select(
      'email password'
    );

    if (!user) {
      return NextResponse.json({ exists: false, method: null });
    }

    return NextResponse.json({
      exists: true,
      method: user.password ? 'credentials' : 'google',
    });
  } catch (error) {
    console.error('Check email error:', error);
    return NextResponse.json(
      { error: 'Failed to check email' },
      { status: 500 }
    );
  }
}
