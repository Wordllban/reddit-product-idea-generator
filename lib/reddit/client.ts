/**
 * Reddit API Client
 *
 * Handles authentication, rate limiting, and API requests to Reddit
 */

import { config } from '../config';
import type {
  RedditAuthToken,
  RedditPost,
  RedditComment,
  RedditListing,
  RedditApiError,
  PostSortType,
  PostTimeRange,
} from './types';

export class RedditApiClient {
  private token: RedditAuthToken | null = null;
  private rateLimitRemaining = 60;
  private rateLimitReset = 0;
  private lastRequestTime = 0;

  constructor() {
    this.validateConfig();
  }

  /**
   * Validates that required Reddit API configuration is present
   */
  private validateConfig() {
    if (!config.reddit.clientId || !config.reddit.clientSecret) {
      throw new Error(
        'Reddit API credentials are required. Please set REDDIT_CLIENT_ID and REDDIT_CLIENT_SECRET environment variables.',
      );
    }
  }

  /**
   * Authenticates with Reddit API using OAuth2 client credentials flow
   */
  async authenticate(): Promise<void> {
    try {
      const credentials = Buffer.from(
        `${config.reddit.clientId}:${config.reddit.clientSecret}`,
      ).toString('base64');

      const response = await fetch(config.reddit.authUrl, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${credentials}`,
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': config.reddit.userAgent,
        },
        body: 'grant_type=client_credentials',
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Reddit authentication failed: ${response.status} ${errorText}`,
        );
      }

      const tokenData = await response.json();

      this.token = {
        ...tokenData,
        created_at: Date.now(),
      };

      console.log('Reddit API authentication successful');
    } catch (error) {
      console.error('Reddit API authentication error:', error);
      throw error;
    }
  }

  /**
   * Checks if the current token is valid and not expired
   */
  private isTokenValid(): boolean {
    if (!this.token) return false;

    const now = Date.now();
    const tokenAge = (now - this.token.created_at) / 1000; // Convert to seconds

    // Add 5 minute buffer before expiration
    return tokenAge < this.token.expires_in - 300;
  }

  /**
   * Ensures we have a valid authentication token
   */
  private async ensureAuthenticated(): Promise<void> {
    if (!this.isTokenValid()) {
      await this.authenticate();
    }
  }

  /**
   * Implements rate limiting to respect Reddit's 60 requests per minute limit
   */
  private async enforceRateLimit(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;

    // Minimum 1 second between requests to stay under 60/minute
    const minInterval = 1000;

    if (timeSinceLastRequest < minInterval) {
      const waitTime = minInterval - timeSinceLastRequest;
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }

    this.lastRequestTime = Date.now();
  }

  /**
   * Makes an authenticated request to the Reddit API
   */
  private async makeRequest(endpoint: string): Promise<any> {
    await this.ensureAuthenticated();
    await this.enforceRateLimit();

    if (!this.token) {
      throw new Error('No valid Reddit API token available');
    }

    const url = `${config.reddit.baseUrl}${endpoint}`;

    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${this.token.access_token}`,
          'User-Agent': config.reddit.userAgent,
        },
      });

      // Update rate limit info from headers
      const remaining = response.headers.get('x-ratelimit-remaining');
      const reset = response.headers.get('x-ratelimit-reset');

      if (remaining) this.rateLimitRemaining = parseInt(remaining);
      if (reset) this.rateLimitReset = parseInt(reset);

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: 'Unknown error' }));
        throw new Error(
          `Reddit API error: ${response.status} - ${
            errorData.message || response.statusText
          }`,
        );
      }

      return await response.json();
    } catch (error) {
      console.error(`Reddit API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  /**
   * Fetches posts from a specific subreddit
   */
  async getSubredditPosts(
    subreddit: string,
    sort: PostSortType = 'hot',
    limit: number = 25,
    timeRange?: PostTimeRange,
    after?: string,
  ): Promise<RedditListing<RedditPost>> {
    let endpoint = `/r/${subreddit}/${sort}`;
    const params = new URLSearchParams({
      limit: limit.toString(),
      raw_json: '1', // Prevents HTML encoding
    });

    if (after) params.append('after', after);
    if (timeRange && sort === 'top') {
      params.append('t', timeRange);
    }

    endpoint += `?${params.toString()}`;

    return await this.makeRequest(endpoint);
  }

  /**
   * Fetches comments for a specific post
   */
  async getPostComments(
    subreddit: string,
    postId: string,
    sort:
      | 'confidence'
      | 'top'
      | 'new'
      | 'controversial'
      | 'old'
      | 'random'
      | 'qa'
      | 'live' = 'top',
    limit: number = 100,
  ): Promise<[RedditListing<RedditPost>, RedditListing<RedditComment>]> {
    const endpoint = `/r/${subreddit}/comments/${postId}?sort=${sort}&limit=${limit}&raw_json=1`;

    return await this.makeRequest(endpoint);
  }

  /**
   * Searches for posts across Reddit
   */
  async searchPosts(
    query: string,
    subreddit?: string,
    sort: 'relevance' | 'hot' | 'top' | 'new' | 'comments' = 'relevance',
    timeRange?: PostTimeRange,
    limit: number = 25,
  ): Promise<RedditListing<RedditPost>> {
    let endpoint = '/search';
    const params = new URLSearchParams({
      q: query,
      sort,
      limit: limit.toString(),
      type: 'link',
      raw_json: '1',
    });

    if (subreddit) params.append('restrict_sr', 'true');
    if (timeRange) params.append('t', timeRange);

    endpoint += `?${params.toString()}`;

    if (subreddit) {
      endpoint = `/r/${subreddit}${endpoint}`;
    }

    return await this.makeRequest(endpoint);
  }

  /**
   * Gets information about a specific subreddit
   */
  async getSubredditInfo(subreddit: string): Promise<any> {
    const endpoint = `/r/${subreddit}/about`;
    return await this.makeRequest(endpoint);
  }

  /**
   * Validates if a subreddit exists and is accessible
   */
  async validateSubreddit(subreddit: string): Promise<{
    exists: boolean;
    accessible: boolean;
    subscribers: number;
    isPrivate: boolean;
    error?: string;
  }> {
    try {
      const info = await this.getSubredditInfo(subreddit);
      const subredditData = info.data;

      return {
        exists: true,
        accessible: true,
        subscribers: subredditData.subscribers || 0,
        isPrivate: subredditData.subreddit_type === 'private',
        error: undefined,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';

      // Check if it's a "not found" error
      if (errorMessage.includes('404') || errorMessage.includes('not found')) {
        return {
          exists: false,
          accessible: false,
          subscribers: 0,
          isPrivate: false,
          error: 'Subreddit does not exist',
        };
      }

      // Check if it's a "forbidden" error (private subreddit)
      if (errorMessage.includes('403') || errorMessage.includes('forbidden')) {
        return {
          exists: true,
          accessible: false,
          subscribers: 0,
          isPrivate: true,
          error: 'Subreddit is private or restricted',
        };
      }

      return {
        exists: false,
        accessible: false,
        subscribers: 0,
        isPrivate: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Performs health check on a subreddit (activity, accessibility, etc.)
   */
  async performSubredditHealthCheck(subreddit: string): Promise<{
    healthy: boolean;
    validation: {
      exists: boolean;
      accessible: boolean;
      subscribers: number;
      isPrivate: boolean;
      error?: string;
    };
    recentActivity: {
      hasRecentPosts: boolean;
      postCount: number;
      averageScore: number;
    };
    recommendations: string[];
  }> {
    const validation = await this.validateSubreddit(subreddit);
    const recommendations: string[] = [];
    let healthy = true;

    // Check basic accessibility
    if (!validation.exists) {
      healthy = false;
      recommendations.push(
        'Subreddit does not exist - remove from target list',
      );
    } else if (!validation.accessible) {
      healthy = false;
      recommendations.push(
        'Subreddit is not accessible - consider alternative',
      );
    }

    // Check recent activity
    let recentActivity = {
      hasRecentPosts: false,
      postCount: 0,
      averageScore: 0,
    };

    if (validation.accessible) {
      try {
        const posts = await this.getSubredditPosts(subreddit, 'hot', 10);
        const postData = posts.data.children.map((child) => child.data);

        recentActivity = {
          hasRecentPosts: postData.length > 0,
          postCount: postData.length,
          averageScore:
            postData.length > 0
              ? postData.reduce((sum, post) => sum + post.score, 0) /
                postData.length
              : 0,
        };

        // Health recommendations based on activity
        if (postData.length === 0) {
          healthy = false;
          recommendations.push(
            'No recent posts found - subreddit may be inactive',
          );
        } else if (recentActivity.averageScore < 5) {
          recommendations.push(
            'Low engagement scores - consider higher priority subreddits',
          );
        } else if (validation.subscribers < 10000) {
          recommendations.push(
            'Small community size - may have limited content',
          );
        }

        if (postData.length >= 5 && recentActivity.averageScore >= 10) {
          recommendations.push('Good activity and engagement levels');
        }
      } catch (error) {
        healthy = false;
        recommendations.push(
          `Error fetching posts: ${
            error instanceof Error ? error.message : 'Unknown error'
          }`,
        );
      }
    }

    return {
      healthy,
      validation,
      recentActivity,
      recommendations,
    };
  }

  /**
   * Gets current rate limit status
   */
  getRateLimitStatus(): { remaining: number; resetTime: number } {
    return {
      remaining: this.rateLimitRemaining,
      resetTime: this.rateLimitReset,
    };
  }

  /**
   * Checks if the client is authenticated
   */
  isAuthenticated(): boolean {
    return this.isTokenValid();
  }
}

// Export a singleton instance
export const redditClient = new RedditApiClient();
