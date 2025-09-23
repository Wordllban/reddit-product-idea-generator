/**
 * Admin API Route for Data Cleanup
 *
 * Handles cleanup of expired temporary data and maintenance tasks
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ideaGeneratorPipeline } from '@/lib/processing/idea-generator-pipeline';

export async function POST(request: NextRequest) {
  try {
    // Verify authentication (you might want to add admin role check here)
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('🧹 Starting data cleanup...');

    // Run cleanup
    const cleanedRecords = await ideaGeneratorPipeline.cleanupExpiredData();

    // Get cleanup statistics
    const stats = await getCleanupStats(supabase);

    return NextResponse.json({
      success: true,
      message: `Cleaned up ${cleanedRecords} expired records`,
      data: {
        recordsCleaned: cleanedRecords,
        ...stats,
      },
    });
  } catch (error) {
    console.error('Cleanup API error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message:
          error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get system statistics
    const stats = await getSystemStats(supabase);

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Stats API error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message:
          error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 },
    );
  }
}

async function getCleanupStats(supabase: any) {
  try {
    // Get counts of temporary data
    const [postsResult, commentsResult, fingerprintsResult] = await Promise.all(
      [
        supabase
          .from('reddit_posts_temp')
          .select('id', { count: 'exact', head: true }),
        supabase
          .from('reddit_comments_temp')
          .select('id', { count: 'exact', head: true }),
        supabase
          .from('content_fingerprints')
          .select('id', { count: 'exact', head: true }),
      ],
    );

    return {
      temporaryPosts: postsResult.count || 0,
      temporaryComments: commentsResult.count || 0,
      contentFingerprints: fingerprintsResult.count || 0,
    };
  } catch (error) {
    console.error('Error getting cleanup stats:', error);
    return {
      temporaryPosts: 0,
      temporaryComments: 0,
      contentFingerprints: 0,
    };
  }
}

async function getSystemStats(supabase: any) {
  try {
    // Get comprehensive system statistics
    const [
      ideasResult,
      batchesResult,
      subredditsResult,
      postsResult,
      commentsResult,
    ] = await Promise.all([
      supabase
        .from('product_ideas')
        .select('id', { count: 'exact', head: true }),
      supabase
        .from('processing_batches')
        .select('id', { count: 'exact', head: true }),
      supabase.from('subreddits').select('id', { count: 'exact', head: true }),
      supabase
        .from('reddit_posts_temp')
        .select('id', { count: 'exact', head: true }),
      supabase
        .from('reddit_comments_temp')
        .select('id', { count: 'exact', head: true }),
    ]);

    // Get recent batch results
    const { data: recentBatches } = await supabase
      .from('processing_batches')
      .select('*')
      .order('started_at', { ascending: false })
      .limit(5);

    // Get ideas by category
    const { data: categoryStats } = await supabase
      .from('product_ideas')
      .select('category')
      .not('category', 'is', null);

    const categoryCounts =
      categoryStats?.reduce((acc: Record<string, number>, item: any) => {
        acc[item.category] = (acc[item.category] || 0) + 1;
        return acc;
      }, {}) || {};

    return {
      totalIdeas: ideasResult.count || 0,
      totalBatches: batchesResult.count || 0,
      activeSubreddits: subredditsResult.count || 0,
      temporaryPosts: postsResult.count || 0,
      temporaryComments: commentsResult.count || 0,
      recentBatches: recentBatches || [],
      ideasByCategory: categoryCounts,
    };
  } catch (error) {
    console.error('Error getting system stats:', error);
    return {
      totalIdeas: 0,
      totalBatches: 0,
      activeSubreddits: 0,
      temporaryPosts: 0,
      temporaryComments: 0,
      recentBatches: [],
      ideasByCategory: {},
    };
  }
}

