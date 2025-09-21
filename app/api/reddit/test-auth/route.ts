import { NextRequest, NextResponse } from 'next/server';
import { testAuthentication } from '@/lib/reddit/test-client';

export async function POST(request: NextRequest) {
  try {
    const isAuthenticated = await testAuthentication();

    return NextResponse.json({
      success: isAuthenticated,
      message: isAuthenticated
        ? 'Authentication successful'
        : 'Authentication failed',
    });
  } catch (error) {
    console.error('Reddit authentication test error:', error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Unknown authentication error',
      },
      { status: 500 },
    );
  }
}
