/**
 * OpenAI Client for Product Idea Generation
 *
 * Handles LLM integration for analyzing Reddit problems and generating
 * scored product ideas with structured outputs
 */

import { OpenAI } from 'openai';
import { promptLoader } from '../prompts/prompt-loader';
import type {
  ProblemStatement,
  ProcessedContent,
} from '../processing/content-processor';

// ============================================================================
// INTERFACES
// ============================================================================

export interface ProductIdea {
  name: string;
  elevatorPitch: string;
  targetAudience: string;
  painPointSolved: string;
  solutionApproach: string;
  scoring: {
    overall: number; // 0-100
    painSeverity: number; // 0-100
    marketSize: number; // 0-100
    competition: number; // 0-100 (higher = less competition)
    implementationDifficulty: number; // 0-100 (higher = more difficult)
  };
  tags: string[];
  category: string;
  reasoning: string;
  // MVP Recommendations Feed requirements
  sourceSubreddits: string[]; // Source subreddits where problems were identified
  sourceLinks: string[]; // Direct links to Reddit posts/comments
  createdAt: Date; // For "New" badge functionality
  isNew?: boolean; // Helper field for UI (ideas created within last 24-48 hours)
}

export interface IdeaGenerationResult {
  ideas: ProductIdea[];
  totalIdeas: number;
  processingTime: number;
  model: string;
  promptVersion: string;
  confidence: number; // 0-100
  metadata: {
    tokensUsed: number;
    cost: number;
    processingDate: Date;
  };
}

export interface GenerationConfig {
  maxIdeas: number;
  minScore: number;
  focusCategories?: string[];
  creativityLevel: 'conservative' | 'balanced' | 'creative';
  model: 'gpt-5-nano';
}

// ============================================================================
// OPENAI CLIENT CLASS
// ============================================================================

export class OpenAIClient {
  private client: OpenAI;
  private readonly PROMPT_VERSION = 'v1.2.0';
  private readonly DEFAULT_MODEL = 'gpt-5-nano';

  constructor() {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY environment variable is required');
    }

    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  /**
   * Generate product ideas from processed Reddit content
   */
  async generateIdeas(
    processedContent: ProcessedContent[],
    config: GenerationConfig = {
      maxIdeas: 5,
      minScore: 60,
      creativityLevel: 'balanced',
      model: 'gpt-5-nano',
    },
  ): Promise<IdeaGenerationResult> {
    const startTime = Date.now();

    try {
      // Prepare the prompts with processed content
      const [systemPrompt, userPrompt] = await Promise.all([
        this.getSystemPrompt(config),
        this.buildIdeaGenerationPrompt(processedContent, config),
      ]);

      // Make the API call
      const response = await this.client.chat.completions.create({
        model: this.DEFAULT_MODEL,
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: userPrompt,
          },
        ],
        max_completion_tokens: 4000,
        response_format: { type: 'json_object' },
      });

      const processingTime = Date.now() - startTime;

      // Parse and validate the response
      const result = this.parseResponse(response, processingTime, config);

      return result;
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw error;
    }
  }

  /**
   * Build the main prompt for idea generation using template
   */
  private async buildIdeaGenerationPrompt(
    processedContent: ProcessedContent[],
    config: GenerationConfig,
  ): Promise<string> {
    const problems = processedContent.flatMap((content) => content.problems);
    const contexts = processedContent.map((content) => content.context);

    // Group problems by domain for better context
    const problemsByDomain = this.groupProblemsByDomain(problems);

    return await promptLoader.getIdeaGenerationPrompt({
      contextSection: this.buildContextSection(contexts),
      problemsSection: this.buildProblemsSection(problemsByDomain),
      maxIdeas: config.maxIdeas,
      minScore: config.minScore,
      creativityLevel: config.creativityLevel,
      focusCategories: config.focusCategories?.join(', ') || 'All categories',
      totalProblems: problems.length,
    });
  }

  /**
   * Get system prompt based on configuration using template
   */
  private async getSystemPrompt(config: GenerationConfig): Promise<string> {
    return await promptLoader.getSystemPrompt({
      minScore: config.minScore,
      creativityLevel: config.creativityLevel,
      creativityGuidance: promptLoader.getCreativityGuidance(
        config.creativityLevel,
      ),
    });
  }

  /**
   * Build context section for prompt
   */
  private buildContextSection(contexts: any[]): string {
    const subreddits = [...new Set(contexts.map((c) => c.subreddit))];
    const categories = [...new Set(contexts.map((c) => c.category))];
    const avgEngagement =
      contexts.reduce((sum, c) => sum + c.engagement.score, 0) /
      contexts.length;

    // Collect source links for reference
    const sourceLinks = contexts.map((c) => ({
      subreddit: c.subreddit,
      permalink: `https://reddit.com${c.sourcePost.permalink}`,
      url: c.sourcePost.url,
    }));

    return `
**Source Subreddits**: ${subreddits.join(', ')}
**Categories**: ${categories.join(', ')}
**Average Engagement**: ${Math.round(avgEngagement)} points
**Content Volume**: ${contexts.length} posts/discussions analyzed
**User Sentiment**: Mixed (frustration and solution-seeking detected)

**Source Links Available**: ${sourceLinks.length} Reddit discussions
- Use these subreddit names in sourceSubreddits: [${subreddits
      .map((s) => `"${s}"`)
      .join(', ')}]
- Reference these permalink patterns in sourceLinks: https://reddit.com/r/{subreddit}/comments/{post_id}
`;
  }

  /**
   * Build problems section for prompt
   */
  private buildProblemsSection(
    problemsByDomain: Record<string, ProblemStatement[]>,
  ): string {
    let section = '';

    for (const [domain, problems] of Object.entries(problemsByDomain)) {
      if (problems.length === 0) continue;

      section += `\n### ${domain.toUpperCase()} Problems\n`;

      problems.slice(0, 5).forEach((problem, index) => {
        section += `
          ${index + 1}. **Problem**: ${problem.text}
            - **Severity**: ${problem.severity}/10
            - **Urgency**: ${problem.urgency}/10
            - **Estimated Users**: ${problem.userCount.toLocaleString()}
            - **Keywords**: ${problem.keywords.join(', ')}
          `;
      });
    }

    return section;
  }

  /**
   * Group problems by domain for better organization
   */
  private groupProblemsByDomain(
    problems: ProblemStatement[],
  ): Record<string, ProblemStatement[]> {
    const grouped: Record<string, ProblemStatement[]> = {};

    problems.forEach((problem) => {
      if (!grouped[problem.domain]) {
        grouped[problem.domain] = [];
      }
      grouped[problem.domain].push(problem);
    });

    // Sort problems within each domain by severity + urgency
    Object.keys(grouped).forEach((domain) => {
      grouped[domain].sort(
        (a, b) => b.severity + b.urgency - (a.severity + a.urgency),
      );
    });

    return grouped;
  }

  /**
   * Parse and validate OpenAI response
   */
  private parseResponse(
    response: OpenAI.Chat.Completions.ChatCompletion,
    processingTime: number,
    config: GenerationConfig,
  ): IdeaGenerationResult {
    const content = response.choices[0]?.message?.content;

    if (!content) {
      throw new Error('Empty response from OpenAI');
    }

    try {
      const parsed = JSON.parse(content);

      // Validate structure
      if (!parsed.ideas || !Array.isArray(parsed.ideas)) {
        throw new Error('Invalid response structure: missing ideas array');
      }

      // Filter and validate ideas
      const validIdeas = parsed.ideas
        .filter((idea: any) => this.validateIdea(idea))
        .filter((idea: any) => idea.scoring.overall >= config.minScore)
        .slice(0, config.maxIdeas)
        .map((idea: any) => ({
          ...idea,
          createdAt: new Date(),
          isNew: true, // All newly generated ideas are marked as new
        }));

      // Calculate cost estimate (rough)
      const tokensUsed = response.usage?.total_tokens || 0;
      const cost = this.estimateCost(tokensUsed, config.model);

      return {
        ideas: validIdeas,
        totalIdeas: validIdeas.length,
        processingTime,
        model: config.model,
        promptVersion: this.PROMPT_VERSION,
        confidence: parsed.confidence || 75,
        metadata: {
          tokensUsed,
          cost,
          processingDate: new Date(),
        },
      };
    } catch (error) {
      console.error('Failed to parse OpenAI response:', error);
      console.error('Response content:', content);
      throw new Error('Failed to parse LLM response');
    }
  }

  /**
   * Validate individual idea structure
   */
  private validateIdea(idea: any): boolean {
    const requiredFields = [
      'name',
      'elevatorPitch',
      'targetAudience',
      'painPointSolved',
      'solutionApproach',
      'scoring',
      'tags',
      'category',
      'sourceSubreddits',
      'sourceLinks',
    ];

    // Check required fields
    for (const field of requiredFields) {
      if (!idea[field]) return false;
    }

    // Validate scoring object
    const requiredScores = [
      'overall',
      'painSeverity',
      'marketSize',
      'competition',
      'implementationDifficulty',
    ];
    for (const score of requiredScores) {
      if (
        typeof idea.scoring[score] !== 'number' ||
        idea.scoring[score] < 0 ||
        idea.scoring[score] > 100
      ) {
        return false;
      }
    }

    // Validate arrays
    if (!Array.isArray(idea.tags) || idea.tags.length === 0) return false;
    if (
      !Array.isArray(idea.sourceSubreddits) ||
      idea.sourceSubreddits.length === 0
    )
      return false;
    if (!Array.isArray(idea.sourceLinks) || idea.sourceLinks.length === 0)
      return false;

    return true;
  }

  /**
   * Estimate API cost based on tokens and model
   */
  private estimateCost(tokens: number, model: string): number {
    // Rough pricing estimates (as of 2024)
    const pricing = {
      'gpt-4': 0.03 / 1000, // $0.03 per 1K tokens
      'gpt-5-nano': 0.00005 / 1000, // $0.002 per 1K tokens
    } as Record<string, number>;

    const rate = pricing[model];
    return tokens * rate;
  }

  /**
   * Batch process multiple content sets for better efficiency
   */
  async batchGenerateIdeas(
    contentBatches: ProcessedContent[][],
    config: GenerationConfig,
  ): Promise<IdeaGenerationResult[]> {
    const results: IdeaGenerationResult[] = [];

    // Process batches sequentially to respect rate limits
    for (const batch of contentBatches) {
      try {
        const result = await this.generateIdeas(batch, config);
        results.push(result);

        // Add delay between batches to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
        console.error('Batch processing error:', error);
        // Continue with other batches
      }
    }

    return results;
  }

  /**
   * Test the connection and validate API key
   */
  async testConnection(): Promise<boolean> {
    try {
      const response = await this.client.chat.completions.create({
        model: 'gpt-5-nano',
        messages: [{ role: 'user', content: 'Hello' }],
        max_completion_tokens: 10,
      });

      return !!response.choices[0]?.message?.content;
    } catch (error) {
      console.error('OpenAI connection test failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const openaiClient = new OpenAIClient();
