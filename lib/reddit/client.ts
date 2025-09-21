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
