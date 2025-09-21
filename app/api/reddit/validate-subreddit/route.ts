import { NextRequest, NextResponse } from 'next/server';
import { redditClient } from '@/lib/reddit';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { subreddit } = body;

    if (!subreddit) {
      return NextResponse.json(
        {
          success: false,
          error: 'Subreddit name is required',
        },
        { status: 400 },
      );
    }

    const validation = await redditClient.validateSubreddit(subreddit);

    return NextResponse.json({
      success: true,
      validation,
    });
  } catch (error) {
    console.error('Reddit subreddit validation error:', error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown validation error',
      },
      { status: 500 },
    );
  }
}
