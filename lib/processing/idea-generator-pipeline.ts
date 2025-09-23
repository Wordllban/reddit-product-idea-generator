/**
 * Main Idea Generation Pipeline
 *
 * Orchestrates the complete flow from Reddit data fetching to idea generation
 * Handles deduplication, caching, and database operations
 */

import { createClient } from '../supabase/server';
import { redditClient } from '../reddit/client';
import { ContentProcessor } from './content-processor';
import { openaiClient } from '../llm/openai-client';
import { getEnabledSubreddits } from '../reddit/subreddits';
import type { RedditPost, RedditComment, PostSortType } from '../reddit/types';
import type { ProcessedContent, ProblemStatement } from './content-processor';
import type {
  ProductIdea,
  GenerationConfig,
  IdeaGenerationResult,
} from '../llm/openai-client';

// ============================================================================
// INTERFACES
// ============================================================================

export interface PipelineConfig {
  maxPostsPerSubreddit: number;
  maxCommentsPerPost: number;
  minPostScore: number;
  minCommentScore: number;
  sortTypes: PostSortType[];
  generationConfig: GenerationConfig;
  enableDeduplication: boolean;
  maxProcessingTime: number; // milliseconds
}

export interface PipelineResult {
  success: boolean;
  ideasGenerated: number;
  subredditsProcessed: number;
  postsAnalyzed: number;
  processingTime: number;
  errors: string[];
  ideas: ProductIdea[];
  metadata: {
    batchId: string;
    startTime: Date;
    endTime: Date;
    configUsed: PipelineConfig;
  };
}

export interface SubredditProcessingResult {
  subreddit: string;
  postsProcessed: number;
  problemsIdentified: number;
  ideasGenerated: number;
  processingTime: number;
  errors: string[];
}

// ============================================================================
// MAIN PIPELINE CLASS
// ============================================================================

export class IdeaGeneratorPipeline {
  private contentProcessor: ContentProcessor;
  private readonly DEFAULT_CONFIG: PipelineConfig = {
    maxPostsPerSubreddit: 25,
    maxCommentsPerPost: 10,
    minPostScore: 5,
    minCommentScore: 3,
    sortTypes: ['hot', 'top'],
    generationConfig: {
      maxIdeas: 5,
      minScore: 65,
      creativityLevel: 'balanced',
      model: 'gpt-5-nano',
    },
    enableDeduplication: true,
    maxProcessingTime: 30 * 60 * 1000, // 30 minutes
  };

  constructor() {
    this.contentProcessor = new ContentProcessor();
  }

  /**
   * Run the complete pipeline
   */
  async runPipeline(
    config: Partial<PipelineConfig> = {},
  ): Promise<PipelineResult> {
    const finalConfig = { ...this.DEFAULT_CONFIG, ...config };
    const batchId = this.generateBatchId();
    const startTime = new Date();

    console.log(`🚀 Starting pipeline batch ${batchId}`);

    const result: PipelineResult = {
      success: false,
      ideasGenerated: 0,
      subredditsProcessed: 0,
      postsAnalyzed: 0,
      processingTime: 0,
      errors: [],
      ideas: [],
      metadata: {
        batchId,
        startTime,
        endTime: new Date(),
        configUsed: finalConfig,
      },
    };

    try {
      // Set processing timeout
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(
          () => reject(new Error('Pipeline timeout')),
          finalConfig.maxProcessingTime,
        );
      });

      // Run the main processing
      const processingPromise = this.executeProcessing(finalConfig, result);

      await Promise.race([processingPromise, timeoutPromise]);

      result.success = true;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      result.errors.push(errorMessage);
      console.error('Pipeline error:', error);
    }

    result.metadata.endTime = new Date();
    result.processingTime =
      result.metadata.endTime.getTime() - startTime.getTime();

    console.log(
      `✅ Pipeline completed: ${result.ideasGenerated} ideas generated in ${result.processingTime}ms`,
    );

    // Log results to database
    await this.logPipelineResult(result);

    return result;
  }

  /**
   * Execute the main processing logic
   */
  private async executeProcessing(
    config: PipelineConfig,
    result: PipelineResult,
  ): Promise<void> {
    // 1. Get enabled subreddits
    const subreddits = getEnabledSubreddits();
    console.log(`📊 Processing ${subreddits.length} subreddits`);

    // 2. Process each subreddit
    const allProcessedContent: ProcessedContent[] = [];

    for (const subreddit of subreddits) {
      try {
        console.log(`🔍 Processing r/${subreddit.name}...`);

        const subredditResult = await this.processSubreddit(
          subreddit.name,
          config,
        );

        result.subredditsProcessed++;
        result.postsAnalyzed += subredditResult.postsProcessed;
        result.errors.push(...subredditResult.errors);

        // Collect processed content for idea generation
        allProcessedContent.push(...subredditResult.processedContent);
      } catch (error) {
        const errorMessage = `Subreddit ${subreddit.name}: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`;
        result.errors.push(errorMessage);
        console.error(errorMessage);
      }
    }

    // 3. Generate ideas from all processed content
    if (allProcessedContent.length > 0) {
      console.log(
        `🤖 Generating ideas from ${allProcessedContent.length} processed items...`,
      );

      const ideaResult = await this.generateIdeasFromContent(
        allProcessedContent,
        config.generationConfig,
      );

      result.ideas = ideaResult.ideas;
      result.ideasGenerated = ideaResult.totalIdeas;

      // 4. Store ideas in database
      await this.storeGeneratedIdeas(ideaResult.ideas, result.metadata.batchId);
    }
  }

  /**
   * Process a single subreddit
   */
  private async processSubreddit(
    subredditName: string,
    config: PipelineConfig,
  ): Promise<
    SubredditProcessingResult & { processedContent: ProcessedContent[] }
  > {
    const startTime = Date.now();
    const processedContent: ProcessedContent[] = [];

    const result: SubredditProcessingResult & {
      processedContent: ProcessedContent[];
    } = {
      subreddit: subredditName,
      postsProcessed: 0,
      problemsIdentified: 0,
      ideasGenerated: 0,
      processingTime: 0,
      errors: [],
      processedContent,
    };

    try {
      // Fetch posts from different sort types
      for (const sortType of config.sortTypes) {
        const posts = await this.fetchSubredditPosts(
          subredditName,
          sortType,
          config.maxPostsPerSubreddit / config.sortTypes.length,
        );

        for (const post of posts) {
          try {
            // Skip if post doesn't meet criteria
            if (post.score < config.minPostScore || post.stickied) {
              continue;
            }

            // Check for duplicates if enabled
            if (
              config.enableDeduplication &&
              (await this.isDuplicateContent(post))
            ) {
              continue;
            }

            // Fetch comments for the post
            const comments = await this.fetchPostComments(
              subredditName,
              post.id,
              config.maxCommentsPerPost,
              config.minCommentScore,
            );

            // Process content
            const processed = await this.contentProcessor.processContent(
              post,
              comments,
            );

            // Store temporarily in database
            await this.storeTemporaryContent(post, comments, processed);

            processedContent.push(processed);
            result.postsProcessed++;
            result.problemsIdentified += processed.problems.length;
          } catch (error) {
            const errorMessage = `Post ${post.id}: ${
              error instanceof Error ? error.message : 'Unknown error'
            }`;
            result.errors.push(errorMessage);
          }
        }
      }
    } catch (error) {
      const errorMessage = `Subreddit processing: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`;
      result.errors.push(errorMessage);
    }

    result.processingTime = Date.now() - startTime;
    return result;
  }

  /**
   * Fetch posts from a subreddit
   */
  private async fetchSubredditPosts(
    subreddit: string,
    sortType: PostSortType,
    limit: number,
  ): Promise<RedditPost[]> {
    try {
      const response = await redditClient.getSubredditPosts(
        subreddit,
        sortType,
        limit,
        sortType === 'top' ? 'week' : undefined,
      );

      return response.data.children.map((child) => child.data);
    } catch (error) {
      console.error(`Failed to fetch posts from r/${subreddit}:`, error);
      return [];
    }
  }

  /**
   * Fetch comments for a post
   */
  private async fetchPostComments(
    subreddit: string,
    postId: string,
    maxComments: number,
    minScore: number,
  ): Promise<RedditComment[]> {
    try {
      const [, commentsListing] = await redditClient.getPostComments(
        subreddit,
        postId,
        'top',
        maxComments,
      );

      return commentsListing.data.children
        .map((child) => child.data)
        .filter(
          (comment) => comment.score >= minScore && comment.body.length > 20,
        )
        .slice(0, maxComments);
    } catch (error) {
      console.error(`Failed to fetch comments for post ${postId}:`, error);
      return [];
    }
  }

  /**
   * Check if content is duplicate based on hash
   */
  private async isDuplicateContent(post: RedditPost): Promise<boolean> {
    const supabase = await createClient();
    const contentHash = this.contentProcessor.generateContentHash(post, []);

    try {
      const { data, error } = await supabase
        .from('content_fingerprints')
        .select('id')
        .eq('content_hash', contentHash)
        .single();

      if (error && error.code !== 'PGRST116') {
        // Not found error
        console.error('Error checking duplicate:', error);
      }

      return !!data;
    } catch (error) {
      console.error('Duplicate check error:', error);
      return false;
    }
  }

  /**
   * Store temporary content in database
   */
  private async storeTemporaryContent(
    post: RedditPost,
    comments: RedditComment[],
    processed: ProcessedContent,
  ): Promise<void> {
    const supabase = await createClient();

    try {
      // Store content fingerprint
      await supabase.from('content_fingerprints').upsert(
        {
          content_hash: processed.contentHash,
          content_type: 'post',
          last_seen_at: new Date().toISOString(),
          occurrence_count: 1,
        },
        {
          onConflict: 'content_hash',
          ignoreDuplicates: false,
        },
      );

      // Store post temporarily
      await supabase.from('reddit_posts_temp').insert({
        reddit_id: post.id,
        title: post.title,
        content: post.selftext || null,
        url: post.url,
        author: post.author,
        score: post.score,
        num_comments: post.num_comments,
        upvote_ratio: post.upvote_ratio,
        created_utc: new Date(post.created_utc * 1000).toISOString(),
        permalink: post.permalink,
        content_hash: processed.contentHash,
        processed: true,
      });
    } catch (error) {
      console.error('Error storing temporary content:', error);
      // Don't throw - continue processing
    }
  }

  /**
   * Generate ideas from processed content
   */
  private async generateIdeasFromContent(
    processedContent: ProcessedContent[],
    config: GenerationConfig,
  ): Promise<IdeaGenerationResult> {
    // Group content by category for better context
    const contentByCategory = this.groupContentByCategory(processedContent);

    const allIdeas: ProductIdea[] = [];
    let totalProcessingTime = 0;
    let totalTokensUsed = 0;
    let totalCost = 0;

    // Process each category separately for better focus
    for (const [category, content] of Object.entries(contentByCategory)) {
      if (content.length === 0) continue;

      try {
        console.log(
          `🎯 Generating ideas for ${category} category (${content.length} items)`,
        );

        const result = await openaiClient.generateIdeas(content, {
          ...config,
          maxIdeas: Math.ceil(
            config.maxIdeas / Object.keys(contentByCategory).length,
          ),
        });

        allIdeas.push(...result.ideas);
        totalProcessingTime += result.processingTime;
        totalTokensUsed += result.metadata.tokensUsed;
        totalCost += result.metadata.cost;
      } catch (error) {
        console.error(`Error generating ideas for ${category}:`, error);
      }
    }

    // Deduplicate and rank ideas
    const deduplicatedIdeas = this.deduplicateIdeas(allIdeas);
    const rankedIdeas = this.rankIdeas(deduplicatedIdeas, config.maxIdeas);

    return {
      ideas: rankedIdeas,
      totalIdeas: rankedIdeas.length,
      processingTime: totalProcessingTime,
      model: config.model,
      promptVersion: 'v1.2.0',
      confidence: 80,
      metadata: {
        tokensUsed: totalTokensUsed,
        cost: totalCost,
        processingDate: new Date(),
      },
    };
  }

  /**
   * Store generated ideas in database
   */
  private async storeGeneratedIdeas(
    ideas: ProductIdea[],
    batchId: string,
  ): Promise<void> {
    const supabase = await createClient();

    try {
      const ideaRecords = ideas.map((idea) => ({
        name: idea.name,
        elevator_pitch: idea.elevatorPitch,
        target_audience: idea.targetAudience,
        pain_point_solved: idea.painPointSolved,
        solution_approach: idea.solutionApproach,
        overall_score: idea.scoring.overall,
        pain_severity_score: idea.scoring.painSeverity,
        market_size_score: idea.scoring.marketSize,
        competition_score: idea.scoring.competition,
        implementation_difficulty: idea.scoring.implementationDifficulty,
        category: idea.category,
        tags: idea.tags,
        generated_by: 'openai-gpt',
        processing_metadata: {
          batchId,
          reasoning: idea.reasoning,
          generatedAt: new Date().toISOString(),
        },
      }));

      const { error } = await supabase
        .from('product_ideas')
        .insert(ideaRecords);

      if (error) {
        console.error('Error storing ideas:', error);
      } else {
        console.log(`💾 Stored ${ideas.length} ideas in database`);
      }
    } catch (error) {
      console.error('Database error storing ideas:', error);
    }
  }

  /**
   * Log pipeline result to database
   */
  private async logPipelineResult(result: PipelineResult): Promise<void> {
    const supabase = await createClient();

    try {
      await supabase.from('processing_batches').insert({
        batch_type: 'full_pipeline',
        posts_fetched: result.postsAnalyzed,
        posts_processed: result.postsAnalyzed,
        ideas_generated: result.ideasGenerated,
        started_at: result.metadata.startTime.toISOString(),
        completed_at: result.metadata.endTime.toISOString(),
        status: result.success ? 'completed' : 'failed',
        error_message: result.errors.join('; ') || null,
      });
    } catch (error) {
      console.error('Error logging pipeline result:', error);
    }
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  private generateBatchId(): string {
    return `batch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private groupContentByCategory(
    content: ProcessedContent[],
  ): Record<string, ProcessedContent[]> {
    const grouped: Record<string, ProcessedContent[]> = {};

    content.forEach((item) => {
      const category = item.context.category;
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(item);
    });

    return grouped;
  }

  private deduplicateIdeas(ideas: ProductIdea[]): ProductIdea[] {
    const seen = new Set<string>();
    return ideas.filter((idea) => {
      const key = `${idea.name.toLowerCase()}_${idea.targetAudience.toLowerCase()}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  private rankIdeas(ideas: ProductIdea[], maxIdeas: number): ProductIdea[] {
    return ideas
      .sort((a, b) => b.scoring.overall - a.scoring.overall)
      .slice(0, maxIdeas);
  }

  /**
   * Clean up expired temporary data
   */
  async cleanupExpiredData(): Promise<number> {
    const supabase = await createClient();

    try {
      const { data, error } = await supabase.rpc('cleanup_expired_temp_data');

      if (error) {
        console.error('Cleanup error:', error);
        return 0;
      }

      console.log(`🧹 Cleaned up ${data} expired records`);
      return data || 0;
    } catch (error) {
      console.error('Cleanup error:', error);
      return 0;
    }
  }
}

// Export singleton instance
export const ideaGeneratorPipeline = new IdeaGeneratorPipeline();
