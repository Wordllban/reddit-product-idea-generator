/**
 * API Route for Idea Generation Pipeline
 *
 * Triggers the complete Reddit data processing and idea generation pipeline
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ideaGeneratorPipeline } from '@/lib/processing/idea-generator-pipeline';
import type { PipelineConfig } from '@/lib/processing/idea-generator-pipeline';

export async function POST(request: NextRequest) {
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

    // Parse request body for configuration
    let config: Partial<PipelineConfig> = {};
    try {
      const body = await request.json();
      config = body.config || {};
    } catch {
      // Use default config if no body provided
    }

    console.log('🚀 Starting idea generation pipeline...');

    // Run the pipeline
    const result = await ideaGeneratorPipeline.runPipeline(config);

    // Return results
    return NextResponse.json({
      success: result.success,
      message: result.success
        ? `Generated ${result.ideasGenerated} ideas from ${result.subredditsProcessed} subreddits`
        : 'Pipeline completed with errors',
      data: {
        ideasGenerated: result.ideasGenerated,
        subredditsProcessed: result.subredditsProcessed,
        postsAnalyzed: result.postsAnalyzed,
        processingTime: result.processingTime,
        batchId: result.metadata.batchId,
        ideas: result.ideas.slice(0, 10), // Return first 10 ideas
      },
      errors: result.errors.length > 0 ? result.errors : undefined,
    });
  } catch (error) {
    console.error('Pipeline API error:', error);

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

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const category = searchParams.get('category');
    const minScore = parseInt(searchParams.get('minScore') || '0');

    // Fetch recent ideas from database
    let query = supabase
      .from('product_ideas')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (category) {
      query = query.eq('category', category);
    }

    if (minScore > 0) {
      query = query.gte('overall_score', minScore);
    }

    const { data: ideas, error } = await query;

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch ideas' },
        { status: 500 },
      );
    }

    // Transform database format to API format
    const transformedIdeas =
      ideas?.map((idea) => ({
        id: idea.id,
        name: idea.name,
        elevatorPitch: idea.elevator_pitch,
        targetAudience: idea.target_audience,
        painPointSolved: idea.pain_point_solved,
        solutionApproach: idea.solution_approach,
        scoring: {
          overall: idea.overall_score,
          painSeverity: idea.pain_severity_score,
          marketSize: idea.market_size_score,
          competition: idea.competition_score,
          implementationDifficulty: idea.implementation_difficulty,
        },
        category: idea.category,
        tags: idea.tags,
        createdAt: idea.created_at,
        sourceSubreddits: idea.source_subreddits,
        sourceUrls: idea.source_urls,
      })) || [];

    return NextResponse.json({
      success: true,
      ideas: transformedIdeas,
      total: transformedIdeas.length,
      filters: {
        category,
        minScore,
        limit,
      },
    });
  } catch (error) {
    console.error('Get ideas API error:', error);

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

