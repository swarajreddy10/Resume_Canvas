import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';

export async function GET() {
  try {
    await connectDB();
    return NextResponse.json({
      status: 'Connected',
      message: 'Database connection successful',
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'Error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
