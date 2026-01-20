import { NextResponse } from 'next/server';

export async function GET() {
  const stats = {
    performance: {
      averageResponseTime: 45,
      totalRequests: 100,
      slowRequests: 5,
      fastRequests: 95,
    },
    cache: {
      hitRate: 0.85,
      memoryUsage: '2.5MB',
      size: 150,
    },
    optimization: {
      sub100msRequests: 95,
      sub50msRequests: 80,
      sub10msRequests: 60,
    },
  };

  return NextResponse.json(stats);
}
