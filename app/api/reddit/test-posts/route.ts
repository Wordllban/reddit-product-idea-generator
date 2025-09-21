import { NextRequest, NextResponse } from 'next/server';
import { testFetchPosts } from '@/lib/reddit/test-client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { subreddit = 'entrepreneur', limit = 5 } = body;

    const posts = await testFetchPosts(subreddit, limit);

    return NextResponse.json({
      success: posts.length > 0,
      posts,
      message: `Successfully fetched ${posts.length} posts from r/${subreddit}`,
    });
  } catch (error) {
    console.error('Reddit posts test error:', error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Unknown error fetching posts',
        posts: [],
      },
      { status: 500 },
    );
  }
}
