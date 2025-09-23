/**
 * Content Processing Pipeline
 *
 * Handles Reddit content analysis, problem identification, and preprocessing
 * for LLM-based idea generation
 */

import crypto from 'crypto';
import type { RedditPost, RedditComment } from '../reddit/types';

// ============================================================================
// INTERFACES
// ============================================================================

export interface ProblemStatement {
  text: string;
  severity: number; // 1-10
  domain: string; // business, tech, lifestyle, health, etc.
  userCount: number; // estimated affected users
  urgency: number; // 1-10
  keywords: string[];
}

export interface ProcessedContent {
  contentHash: string;
  problems: ProblemStatement[];
  context: ContentContext;
  quality: QualityScore;
  metadata: ProcessingMetadata;
}

export interface ContentContext {
  subreddit: string;
  category: string;
  engagement: EngagementMetrics;
  temporalContext: TemporalContext;
  userSentiment: SentimentAnalysis;
  // Source tracking for MVP requirements
  sourcePost: {
    id: string;
    permalink: string;
    url: string;
  };
}

export interface EngagementMetrics {
  score: number;
  commentCount: number;
  upvoteRatio: number;
  controversiality: number;
  viralityScore: number;
}

export interface TemporalContext {
  postAge: number; // hours since creation
  trendingStatus: 'hot' | 'rising' | 'stable' | 'declining';
  seasonality: string; // seasonal relevance
}

export interface SentimentAnalysis {
  overall: 'positive' | 'negative' | 'neutral' | 'frustrated' | 'excited';
  frustrationLevel: number; // 1-10
  urgencyIndicators: string[];
  emotionalWords: string[];
}

export interface QualityScore {
  overall: number; // 0-100
  contentLength: number;
  readability: number;
  specificity: number;
  actionability: number;
  authenticity: number;
}

export interface ProcessingMetadata {
  processedAt: Date;
  processingVersion: string;
  sourceType: 'post' | 'comment';
  processingTime: number; // milliseconds
}

// ============================================================================
// CONTENT PROCESSOR CLASS
// ============================================================================

export class ContentProcessor {
  private readonly PROBLEM_KEYWORDS = [
    // Business problems
    'struggling with',
    'problem with',
    'issue with',
    'difficulty',
    'challenge',
    'frustrating',
    'annoying',
    'broken',
    "doesn't work",
    'failing',
    'need help',
    'looking for',
    'wish there was',
    'if only',

    // Pain indicators
    'waste time',
    'takes forever',
    'so slow',
    'inefficient',
    'manual process',
    'repetitive',
    'tedious',
    'time-consuming',
    'expensive',
    'costly',

    // Solution seeking
    'alternative to',
    'better than',
    'replace',
    'automate',
    'simplify',
    'streamline',
    'optimize',
    'improve',
    'solution',
    'tool for',
  ];

  private readonly DOMAIN_KEYWORDS = {
    business: [
      'revenue',
      'customers',
      'sales',
      'marketing',
      'growth',
      'startup',
    ],
    tech: ['software', 'app', 'platform', 'api', 'code', 'development'],
    productivity: [
      'workflow',
      'process',
      'efficiency',
      'time management',
      'organization',
    ],
    health: ['wellness', 'fitness', 'mental health', 'medical', 'healthcare'],
    finance: [
      'money',
      'budget',
      'investment',
      'expense',
      'financial',
      'accounting',
    ],
    education: [
      'learning',
      'course',
      'training',
      'skill',
      'knowledge',
      'study',
    ],
  };

  /**
   * Process Reddit post and comments into structured problem statements
   */
  async processContent(
    post: RedditPost,
    comments: RedditComment[] = [],
  ): Promise<ProcessedContent> {
    const startTime = Date.now();

    // Generate content hash for deduplication
    const contentHash = this.generateContentHash(post, comments);

    // Extract problems from post and comments
    const problems = await this.extractProblems(post, comments);

    // Analyze context and engagement
    const context = this.analyzeContext(post, comments);

    // Calculate quality score
    const quality = this.calculateQualityScore(post, comments, problems);

    const processingTime = Date.now() - startTime;

    return {
      contentHash,
      problems,
      context,
      quality,
      metadata: {
        processedAt: new Date(),
        processingVersion: '1.0.0',
        sourceType: 'post',
        processingTime,
      },
    };
  }

  /**
   * Generate SHA-256 hash for content deduplication
   */
  generateContentHash(post: RedditPost, comments: RedditComment[]): string {
    const content = [
      post.title,
      post.selftext || '',
      ...comments.slice(0, 5).map((c) => c.body), // Include top 5 comments
    ].join('|');

    return crypto.createHash('sha256').update(content).digest('hex');
  }

  /**
   * Extract problem statements from post and comments
   */
  private async extractProblems(
    post: RedditPost,
    comments: RedditComment[],
  ): Promise<ProblemStatement[]> {
    const problems: ProblemStatement[] = [];

    // Analyze main post
    const postProblems = this.extractProblemsFromText(
      post.title + ' ' + (post.selftext || ''),
      'post',
    );
    problems.push(...postProblems);

    // Analyze high-value comments
    const highValueComments = comments
      .filter((c) => c.score >= 5 && c.body.length > 50)
      .slice(0, 10); // Top 10 comments

    for (const comment of highValueComments) {
      const commentProblems = this.extractProblemsFromText(
        comment.body,
        'comment',
      );
      problems.push(...commentProblems);
    }

    // Deduplicate and rank problems
    return this.deduplicateProblems(problems);
  }

  /**
   * Extract problems from a single text block
   */
  private extractProblemsFromText(
    text: string,
    source: 'post' | 'comment',
  ): ProblemStatement[] {
    const problems: ProblemStatement[] = [];
    const sentences = this.splitIntoSentences(text);

    for (const sentence of sentences) {
      if (this.containsProblemIndicators(sentence)) {
        const problem = this.createProblemStatement(sentence, source);
        if (problem) {
          problems.push(problem);
        }
      }
    }

    return problems;
  }

  /**
   * Check if text contains problem indicators
   */
  private containsProblemIndicators(text: string): boolean {
    const lowercaseText = text.toLowerCase();
    return this.PROBLEM_KEYWORDS.some((keyword) =>
      lowercaseText.includes(keyword),
    );
  }

  /**
   * Create structured problem statement
   */
  private createProblemStatement(
    text: string,
    source: 'post' | 'comment',
  ): ProblemStatement | null {
    if (text.length < 20 || text.length > 500) {
      return null; // Skip too short or too long texts
    }

    const domain = this.identifyDomain(text);
    const severity = this.calculateSeverity(text);
    const urgency = this.calculateUrgency(text);
    const userCount = this.estimateUserCount(text, source);
    const keywords = this.extractKeywords(text);

    return {
      text: text.trim(),
      severity,
      domain,
      userCount,
      urgency,
      keywords,
    };
  }

  /**
   * Identify problem domain based on keywords
   */
  private identifyDomain(text: string): string {
    const lowercaseText = text.toLowerCase();

    for (const [domain, keywords] of Object.entries(this.DOMAIN_KEYWORDS)) {
      const matchCount = keywords.filter((keyword) =>
        lowercaseText.includes(keyword),
      ).length;

      if (matchCount >= 2) {
        return domain;
      }
    }

    return 'general';
  }

  /**
   * Calculate problem severity based on language intensity
   */
  private calculateSeverity(text: string): number {
    const lowercaseText = text.toLowerCase();
    let severity = 5; // Base severity

    // High severity indicators
    const highSeverityWords = [
      'critical',
      'urgent',
      'broken',
      'failing',
      'disaster',
      'nightmare',
      'impossible',
      'terrible',
      'awful',
      'hate',
      'frustrated',
      'angry',
    ];

    // Low severity indicators
    const lowSeverityWords = [
      'minor',
      'small',
      'little',
      'slight',
      'would be nice',
      'improvement',
    ];

    highSeverityWords.forEach((word) => {
      if (lowercaseText.includes(word)) severity += 1;
    });

    lowSeverityWords.forEach((word) => {
      if (lowercaseText.includes(word)) severity -= 1;
    });

    return Math.max(1, Math.min(10, severity));
  }

  /**
   * Calculate urgency based on temporal indicators
   */
  private calculateUrgency(text: string): number {
    const lowercaseText = text.toLowerCase();
    let urgency = 5; // Base urgency

    const urgentWords = [
      'now',
      'immediately',
      'asap',
      'urgent',
      'quickly',
      'deadline',
      'today',
      'this week',
      'right away',
      'emergency',
    ];

    const nonUrgentWords = [
      'someday',
      'eventually',
      'future',
      'when i have time',
      'nice to have',
    ];

    urgentWords.forEach((word) => {
      if (lowercaseText.includes(word)) urgency += 1;
    });

    nonUrgentWords.forEach((word) => {
      if (lowercaseText.includes(word)) urgency -= 1;
    });

    return Math.max(1, Math.min(10, urgency));
  }

  /**
   * Estimate affected user count based on language and context
   */
  private estimateUserCount(text: string, source: 'post' | 'comment'): number {
    const lowercaseText = text.toLowerCase();

    // Scale indicators
    const scaleIndicators = [
      { words: ['everyone', 'all', 'everybody'], multiplier: 1000000 },
      { words: ['most people', 'many', 'lots of'], multiplier: 100000 },
      { words: ['some people', 'several'], multiplier: 10000 },
      { words: ['few people', 'a couple'], multiplier: 1000 },
      { words: ['i', 'me', 'my'], multiplier: 100 },
    ];

    for (const indicator of scaleIndicators) {
      if (indicator.words.some((word) => lowercaseText.includes(word))) {
        return source === 'post'
          ? indicator.multiplier
          : indicator.multiplier * 0.5;
      }
    }

    return 5000; // Default estimate
  }

  /**
   * Extract relevant keywords from text
   */
  private extractKeywords(text: string): string[] {
    const words = text
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter((word) => word.length > 3);

    // Simple frequency-based keyword extraction
    const wordCount = new Map<string, number>();
    words.forEach((word) => {
      wordCount.set(word, (wordCount.get(word) || 0) + 1);
    });

    return Array.from(wordCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([word]) => word);
  }

  /**
   * Analyze content context and engagement
   */
  private analyzeContext(
    post: RedditPost,
    comments: RedditComment[],
  ): ContentContext {
    const engagement = this.calculateEngagementMetrics(post, comments);
    const temporal = this.analyzeTemporalContext(post);
    const sentiment = this.analyzeSentiment(post, comments);

    return {
      subreddit: post.subreddit,
      category: this.mapSubredditToCategory(post.subreddit),
      engagement,
      temporalContext: temporal,
      userSentiment: sentiment,
      sourcePost: {
        id: post.id,
        permalink: post.permalink,
        url: post.url,
      },
    };
  }

  /**
   * Calculate engagement metrics
   */
  private calculateEngagementMetrics(
    post: RedditPost,
    comments: RedditComment[],
  ): EngagementMetrics {
    const viralityScore = Math.min(
      100,
      (post.score /
        Math.max(
          1,
          (Date.now() - post.created_utc * 1000) / (1000 * 60 * 60),
        )) *
        10,
    );

    return {
      score: post.score,
      commentCount: post.num_comments,
      upvoteRatio: post.upvote_ratio,
      controversiality: post.upvote_ratio < 0.7 ? 1 : 0,
      viralityScore,
    };
  }

  /**
   * Analyze temporal context
   */
  private analyzeTemporalContext(post: RedditPost): TemporalContext {
    const postAge = (Date.now() - post.created_utc * 1000) / (1000 * 60 * 60); // hours

    let trendingStatus: TemporalContext['trendingStatus'] = 'stable';
    if (postAge < 2 && post.score > 100) trendingStatus = 'hot';
    else if (postAge < 6 && post.score > 50) trendingStatus = 'rising';
    else if (postAge > 24 && post.score < 10) trendingStatus = 'declining';

    return {
      postAge,
      trendingStatus,
      seasonality: this.getSeasonality(),
    };
  }

  /**
   * Analyze sentiment of content
   */
  private analyzeSentiment(
    post: RedditPost,
    comments: RedditComment[],
  ): SentimentAnalysis {
    const allText = [post.title, post.selftext || '']
      .concat(comments.slice(0, 5).map((c) => c.body))
      .join(' ')
      .toLowerCase();

    const frustrationWords = [
      'frustrated',
      'annoying',
      'hate',
      'terrible',
      'awful',
      'broken',
    ];
    const excitementWords = [
      'excited',
      'amazing',
      'awesome',
      'love',
      'great',
      'fantastic',
    ];

    const frustrationCount = frustrationWords.filter((word) =>
      allText.includes(word),
    ).length;
    const excitementCount = excitementWords.filter((word) =>
      allText.includes(word),
    ).length;

    let overall: SentimentAnalysis['overall'] = 'neutral';
    if (frustrationCount > excitementCount && frustrationCount > 0) {
      overall = 'frustrated';
    } else if (excitementCount > frustrationCount && excitementCount > 0) {
      overall = 'excited';
    }

    return {
      overall,
      frustrationLevel: Math.min(10, frustrationCount * 2),
      urgencyIndicators: this.extractUrgencyIndicators(allText),
      emotionalWords: [...frustrationWords, ...excitementWords].filter((word) =>
        allText.includes(word),
      ),
    };
  }

  /**
   * Calculate overall quality score
   */
  private calculateQualityScore(
    post: RedditPost,
    comments: RedditComment[],
    problems: ProblemStatement[],
  ): QualityScore {
    const contentLength = (post.title + (post.selftext || '')).length;
    const readability = this.calculateReadability(
      post.title + (post.selftext || ''),
    );
    const specificity =
      problems.length > 0 ? problems[0].keywords.length * 10 : 0;
    const actionability = this.calculateActionability(post, comments);
    const authenticity = this.calculateAuthenticity(post);

    const overall = Math.round(
      (readability + specificity + actionability + authenticity) / 4,
    );

    return {
      overall: Math.max(0, Math.min(100, overall)),
      contentLength,
      readability,
      specificity,
      actionability,
      authenticity,
    };
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  private splitIntoSentences(text: string): string[] {
    return text.split(/[.!?]+/).filter((s) => s.trim().length > 10);
  }

  private deduplicateProblems(
    problems: ProblemStatement[],
  ): ProblemStatement[] {
    const seen = new Set<string>();
    return problems.filter((problem) => {
      const key = problem.text.toLowerCase().substring(0, 50);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  private mapSubredditToCategory(subreddit: string): string {
    const categoryMap: Record<string, string> = {
      entrepreneur: 'Business',
      smallbusiness: 'Business',
      SaaS: 'Software',
      webdev: 'Technology',
      productivity: 'Lifestyle',
      freelance: 'Business',
      startups: 'Business',
    };
    return categoryMap[subreddit] || 'General';
  }

  private getSeasonality(): string {
    const month = new Date().getMonth();
    const seasons = [
      'Winter',
      'Winter',
      'Spring',
      'Spring',
      'Spring',
      'Summer',
      'Summer',
      'Summer',
      'Fall',
      'Fall',
      'Fall',
      'Winter',
    ];
    return seasons[month];
  }

  private extractUrgencyIndicators(text: string): string[] {
    const indicators = [
      'deadline',
      'urgent',
      'asap',
      'immediately',
      'critical',
    ];
    return indicators.filter((indicator) => text.includes(indicator));
  }

  private calculateReadability(text: string): number {
    // Simple readability score based on sentence and word length
    const sentences = text.split(/[.!?]+/).length;
    const words = text.split(/\s+/).length;
    const avgWordsPerSentence = words / Math.max(1, sentences);

    // Optimal range: 15-20 words per sentence
    if (avgWordsPerSentence >= 15 && avgWordsPerSentence <= 20) return 90;
    if (avgWordsPerSentence >= 10 && avgWordsPerSentence <= 25) return 70;
    return 50;
  }

  private calculateActionability(
    post: RedditPost,
    comments: RedditComment[],
  ): number {
    const actionWords = [
      'need',
      'want',
      'looking for',
      'solution',
      'help',
      'fix',
    ];
    const allText = (post.title + (post.selftext || '')).toLowerCase();
    const actionWordCount = actionWords.filter((word) =>
      allText.includes(word),
    ).length;
    return Math.min(100, actionWordCount * 20);
  }

  private calculateAuthenticity(post: RedditPost): number {
    // Simple heuristics for authentic vs promotional content
    let score = 70; // Base score

    if (post.selftext && post.selftext.length > 100) score += 10; // Detailed posts
    if (post.score > 10) score += 10; // Community validated
    if (!post.title.toLowerCase().includes('check out')) score += 10; // Not promotional

    return Math.min(100, score);
  }
}
