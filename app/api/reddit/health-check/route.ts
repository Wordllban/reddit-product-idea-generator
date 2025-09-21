import { NextRequest, NextResponse } from 'next/server';
import { redditClient } from '@/lib/reddit';
import { getEnabledSubreddits } from '@/lib/reddit/subreddits';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { subreddit, checkAll = false } = body;

    if (checkAll) {
      // Health check all target subreddits
      const subreddits = getEnabledSubreddits();
      const results = [];

      for (const config of subreddits) {
        try {
          const healthCheck = await redditClient.performSubredditHealthCheck(
            config.name,
          );
          results.push({
            subreddit: config.name,
            category: config.category,
            priority: config.priority,
            ...healthCheck,
          });

          // Small delay between requests to be respectful
          await new Promise((resolve) => setTimeout(resolve, 1000));
        } catch (error) {
          results.push({
            subreddit: config.name,
            category: config.category,
            priority: config.priority,
            healthy: false,
            error: error instanceof Error ? error.message : 'Unknown error',
          });
        }
      }

      return NextResponse.json({
        success: true,
        results,
        summary: {
          total: results.length,
          healthy: results.filter((r) => r.healthy).length,
          unhealthy: results.filter((r) => !r.healthy).length,
        },
      });
    } else {
      // Single subreddit health check
      if (!subreddit) {
        return NextResponse.json(
          {
            success: false,
            error: 'Subreddit name is required when checkAll is false',
          },
          { status: 400 },
        );
      }

      const healthCheck = await redditClient.performSubredditHealthCheck(
        subreddit,
      );

      return NextResponse.json({
        success: true,
        healthCheck,
      });
    }
  } catch (error) {
    console.error('Reddit health check error:', error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown health check error',
      },
      { status: 500 },
    );
  }
}
